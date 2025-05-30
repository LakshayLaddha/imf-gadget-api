const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// Initialize models
const User = require('./user')(sequelize, DataTypes);
const Gadget = require('./gadget')(sequelize, DataTypes);

// Define associations here if needed

module.exports = {
  sequelize,
  User,
  Gadget
};