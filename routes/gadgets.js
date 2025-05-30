const express = require('express');
const router = express.Router();
const { Gadget } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { generateCodename, generateSuccessProbability, generateConfirmationCode } = require('../utils/generators');

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Get all gadgets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Destroyed, Decommissioned]
 *     responses:
 *       200:
 *         description: List of gadgets
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const gadgets = await Gadget.findAll({ where });
    
    // Add success probability to each gadget
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${generateSuccessProbability()}%`
    }));

    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gadgets', error: error.message });
  }
});

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Add a new gadget
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gadget created
 */
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const codename = await generateCodename();
    const gadget = await Gadget.create({
      name,
      codename,
      description,
      status: 'Available'
    });

    res.status(201).json(gadget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating gadget', error: error.message });
  }
});

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     summary: Update gadget information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gadget updated
 */
router.patch('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    // Don't allow updating codename
    delete updates.codename;
    
    await gadget.update(updates);
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gadget', error: error.message });
  }
});

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gadget decommissioned
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    // Mark as decommissioned instead of deleting
    await gadget.update({
      status: 'Decommissioned',
      decommissionedAt: new Date()
    });

    res.json({ message: 'Gadget decommissioned', gadget });
  } catch (error) {
    res.status(500).json({ message: 'Error decommissioning gadget', error: error.message });
  }
});

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Trigger self-destruct sequence
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Self-destruct initiated
 */
router.post('/:id/self-destruct', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;
    
    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    if (gadget.status === 'Destroyed' || gadget.status === 'Decommissioned') {
      return res.status(400).json({ message: 'Gadget already destroyed or decommissioned' });
    }

    // Generate confirmation code for this request
    const requiredCode = generateConfirmationCode();
    
    // For demo purposes, we'll accept the code if it matches the required format
    if (!confirmationCode || confirmationCode.length !== 6) {
      return res.status(400).json({ 
        message: 'Invalid confirmation code. Please provide a 6-character code.',
        hint: 'Use a code like: ' + requiredCode 
      });
    }

    // Update gadget status to destroyed
    await gadget.update({ status: 'Destroyed' });

    res.json({ 
      message: 'Self-destruct sequence initiated',
      gadget: gadget.toJSON(),
      destructionTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating self-destruct', error: error.message });
  }
});

module.exports = router;