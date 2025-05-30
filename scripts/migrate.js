require('dotenv').config();
const { sequelize } = require('../models');

async function migrate() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;