const { Gadget } = require('../models');

const adjectives = ['Silent', 'Shadow', 'Ghost', 'Night', 'Storm', 'Thunder', 'Lightning', 'Falcon', 'Eagle', 'Wolf', 'Tiger', 'Dragon', 'Phoenix', 'Stealth', 'Phantom', 'Crimson', 'Azure', 'Emerald', 'Obsidian', 'Crystal'];
const nouns = ['Hawk', 'Viper', 'Raven', 'Serpent', 'Panther', 'Jaguar', 'Shark', 'Kraken', 'Nightingale', 'Sparrow', 'Owl', 'Falcon', 'Reaper', 'Sentinel', 'Guardian', 'Watcher', 'Hunter', 'Seeker', 'Striker', 'Shadow'];

async function generateCodename() {
  let codename;
  let isUnique = false;
  
  while (!isUnique) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    codename = `The ${adjective} ${noun}`;
    
    // Check if codename already exists
    const existing = await Gadget.findOne({ where: { codename } });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return codename;
}

function generateSuccessProbability() {
  // Generate a random success probability between 60 and 99
  return Math.floor(Math.random() * 40) + 60;
}

function generateConfirmationCode() {
  // Generate a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = {
  generateCodename,
  generateSuccessProbability,
  generateConfirmationCode
};