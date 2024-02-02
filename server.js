const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Sequelize, DataTypes } = require('sequelize');
const models = require('./models'); // Adjust the path accordingly

const { Customer, Technician, Inventory, ServiceRequest } = models;

const app = express();
const port = 3030; // Replace with your desired port number
app.use(express.static('public'));
app.set("view engine", "pug");

// Sequelize initialization
const sequelize = models.sequelize;

// Passport configuration
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    Customer.findOne({ where: { email: email } })
      .then(customer => {
        if (!customer || customer.password !== password) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, customer);
      })
      .catch(err => done(err));
  }
));

// Set up relationships
Customer.hasMany(ServiceRequest, { foreignKey: 'customerid' });
ServiceRequest.belongsTo(Customer, { foreignKey: 'customerid' });

Technician.hasMany(ServiceRequest, { foreignKey: 'technicianid' });
ServiceRequest.belongsTo(Technician, { foreignKey: 'technicianid' });

Inventory.hasMany(ServiceRequest, { foreignKey: 'itemid' });
ServiceRequest.belongsTo(Inventory, { foreignKey: 'itemid' });

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: '1234567890', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Routes
const customerRoutes = require('./routes/customer'); // Adjust the path accordingly
const technicianRoutes = require('./routes/technician'); // Adjust the path accordingly

app.use('/', customerRoutes); // Customer routes
app.use('/technician', technicianRoutes); // Technician routes

// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
