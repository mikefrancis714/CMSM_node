// models/technician.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db/connection');

const Technician = sequelize.define('Technician', {
    TechnicianID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    FirstName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    LastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    Password: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'technicians',
    timestamps: false
});

module.exports = Technician;
