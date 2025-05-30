require('dotenv').config();
const { User, Gadget } = require('../models');
const { generateCodename } = require('../utils/generators');

async function seed() {
  try {
    // Create admin user
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });

    // Create agent user
    await User.create({
      username: 'agent007',
      password: 'agent123',
      role: 'agent'
    });

    // Create sample gadgets
    const gadgets = [
      { name: 'Explosive Pen', description: 'A pen that doubles as an explosive device' },
      { name: 'Grappling Hook Watch', description: 'Wristwatch with built-in grappling hook' },
      { name: 'Invisible Car', description: 'Vehicle with advanced cloaking technology' },
      { name: 'Laser Cufflinks', description: 'Cufflinks that emit cutting laser beams' },
      { name: 'X-Ray Glasses', description: 'Glasses with X-ray vision capability' }
    ];

    for (const gadgetData of gadgets) {
      const codename = await generateCodename();
      await Gadget.create({
        ...gadgetData,
        codename,
        status: 'Available'
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;