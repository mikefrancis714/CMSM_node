// models/servicerequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db/connection');
const Customer = require('./customer');
const Technician = require('./technician');
const Inventory = require('./inventory');

const ServiceRequest = sequelize.define('ServiceRequest', {
    RequestID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    CustomerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Customer,
            key: 'CustomerID'
        }
    },
    TechnicianID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Technician,
            key: 'TechnicianID'
        }
    },
    RequestDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Status: {
        type: DataTypes.ENUM('New', 'In Progress', 'Completed'),
        allowNull: true
    },
    ItemID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Inventory,
            key: 'ItemID'
        }
    }
}, {
    tableName: 'servicerequests',
    timestamps: false
});

module.exports = ServiceRequest;
