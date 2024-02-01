// models/inventory.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db/connection');

const Inventory = sequelize.define('Inventory', {
    ItemID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ItemName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'inventory',
    timestamps: false
});

module.exports = Inventory;
