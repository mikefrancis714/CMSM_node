// models/customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('/db/connection.js');

const Customer = sequelize.define('Customer', {
    CustomerID: {
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
        allowNull: true,
        unique: true
    },
    Phones: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Password: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'customers',
    timestamps: false
});

module.exports = Customer;
