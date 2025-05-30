module.exports = (sequelize, DataTypes) => {
  const Gadget = sequelize.define('Gadget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
      defaultValue: 'Available'
    },
    description: {
      type: DataTypes.TEXT
    },
    decommissionedAt: {
      type: DataTypes.DATE
    }
  });

  return Gadget;
};