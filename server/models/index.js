const sequelize = require('../config/database');
const User = require('./User');
const Equipment = require('./Equipment');
const Reservation = require('./Reservation');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force: true to reset DB during dev
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = {
    sequelize,
    User,
    Equipment,
    Reservation,
    syncDatabase
};
