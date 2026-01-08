const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Equipment = require('./Equipment');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    materialUsed: {
        type: DataTypes.FLOAT, // Grams or meters
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
        defaultValue: 'confirmed'
    }
});

// Relationships
Reservation.belongsTo(User, { foreignKey: 'userId' });
Reservation.belongsTo(Equipment, { foreignKey: 'equipmentId' });
User.hasMany(Reservation, { foreignKey: 'userId' });
Equipment.hasMany(Reservation, { foreignKey: 'equipmentId' });

module.exports = Reservation;
