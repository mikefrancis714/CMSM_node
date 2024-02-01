const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'cmsm',
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
