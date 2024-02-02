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
router.get('/customer-dashboard', (req, res) => {
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
    res.redirect('/login');
  }
});


// Create service request route
router.post('/create-service-request', async (req, res) => {
  const { description, requestdate } = req.body;

  try {
     // Check if the user is authenticated
     if (req.isAuthenticated()) {
      // Use req.user.customerid to get the current customer ID
      const currentCustomerId = req.user.customerid;

    const newServiceRequest = await ServiceRequest.create({
      CustomerId: req.user.customerid, // Assuming your ServiceRequest model has a CustomerId field
      Description: description,
      RequestDate: requestdate,
      // Other fields as needed
    });

    // Example: res.redirect('/customer-dashboard');
    res.status(200).json({ message: 'Service request submitted successfully!' });
      }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
