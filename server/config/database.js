const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  // In Vercel (PROD), use /tmp (ephemeral). In Dev, use local file.
  storage: process.env.NODE_ENV === 'production'
    ? path.join('/tmp', 'database.sqlite')
    : path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

module.exports = sequelize;
