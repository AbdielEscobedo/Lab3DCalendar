const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipment = sequelize.define('Equipment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('printer', 'cnc', 'laser', 'scanner'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'maintenance', 'in_use'),
        defaultValue: 'available'
    }
});

module.exports = Equipment;
