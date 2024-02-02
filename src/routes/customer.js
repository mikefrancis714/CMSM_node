// customer.js
const express = require('express');
const router = express.Router();
const { Customer, ServiceRequest } = require('../models');
const passport = require('passport');

// Login route
router.route('/')
  .get((req, res) => {
    res.render('login'); // Render the login form
  })
  .post(passport.authenticate('local', {
    successRedirect: '/customer-dashboard',
    failureRedirect: '/customer/login',
    failureFlash: true,
    successFlash: 'Login successful!',
  }));

// Customer signup route
router.route('/signup')
  .get((req, res) => {
    res.render('customer_signup'); // Render the customer signup form
  })
  .post((req, res) => {
    const { firstname, lastname, email, phones, address, password } = req.body;

    // Check if the email is already registered
    Customer.findOne({ where: { email: email } })
      .then(existingCustomer => {
        if (existingCustomer) {
          // Email is already registered
          req.flash('error', 'Email is already registered. Please log in.');
          res.redirect('/customer/login');
        } else {
          // Create a new customer
          Customer.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phones: phones,
            address: address,
            password: password,
          })
            .then(newCustomer => {
              // Registration successful
              req.flash('success', 'Registration successful! Please log in.');
              res.redirect('/customer/login');
            })
            .catch(error => {
              console.error(error);
              req.flash('error', 'Internal Server Error');
              res.redirect('/customer/signup');
            });
        }
      })
      .catch(error => {
        console.error(error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/customer/signup');
      });
  });

// Customer dashboard route
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    const customerid = req.user.customerid;

    ServiceRequest.findAll({
      where: {
        customerid: customerid
      }
    })
      .then(customerServiceRequests => {
        res.render('customer_dashboard.pug', { service_requests: customerServiceRequests });
      })
      .catch(error => {
        console.error(error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/');
      });
  } else {
    // User is not authenticated
    req.flash('error', 'Unauthorized');
    res.redirect('/customer/login');
  }
});

module.exports = router;
