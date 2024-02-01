const { Sequelize, DataTypes } = require('sequelize');

// Sequelize initialization
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

// Define your models
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

// Set up relationships
Customer.hasMany(ServiceRequest, { foreignKey: 'customerid' });
ServiceRequest.belongsTo(Customer, { foreignKey: 'customerid' });

Technician.hasMany(ServiceRequest, { foreignKey: 'technicianid' });
ServiceRequest.belongsTo(Technician, { foreignKey: 'technicianid' });

Inventory.hasMany(ServiceRequest, { foreignKey: 'itemid' });
ServiceRequest.belongsTo(Inventory, { foreignKey: 'itemid' });


module.exports = {
  sequelize,
  Customer,
  Technician,
  Inventory,
  ServiceRequest,
};
