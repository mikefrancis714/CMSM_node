const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true});
const session = require('express-session');
const flash = require('express-flash');
const { Op } = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Sequelize, DataTypes } = require('sequelize');
const port = 443; // Replace 443 with your desired port number


const server = app.listen(443, function () {
    console.log('Server is listening on port 443');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set("view engine", "pug");

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


// Configure Passport to use a local strategy
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

// login route
app.route('/')
  .get((req, res) => {
    // Handle GET request (render login form)
    res.render('login');
  })
  .post((req, res) => {
    // Handle POST request (login logic)
    const { email, password } = req.body;

    // Try to authenticate as a customer
    Customer.findOne({
      where: { email, password }
    }).then(customer => {
      if (customer) {
        // Redirect to the customer dashboard after login
        req.session.successMessage = 'Login successful!';
        res.redirect('/customer-dashboard');
      } else {
        // Try to authenticate as a technician
        Technician.findOne({
          where: { email, password }
        }).then(technician => {
          if (technician) {
            // Redirect to the technician dashboard after login
            req.session.successMessage = 'Login successful!';
            res.redirect('/technician-dashboard');
          } else {
            req.session.errorMessage = 'Login failed. Check your username and password.';
            res.redirect('/');
          }
        });
      }
    });
  });

module.exports = app;

//Customer-signup route
app.route('/customer-signup')
  .get((req, res) => {
    res.render('customer_signup.html'); // Render the customer signup form
  })
  .post((req, res) => {
    const { firstname, lastname, email, phones, address, password } = req.body;

    // Check if the email is already registered
    Customer.findOne({ where: { email: email } })
      .then(existingCustomer => {
        if (existingCustomer) {
          // Email is already registered
          res.status(400).json({ error: 'Email is already registered. Please log in.' });
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
              res.status(200).json({ message: 'Registration successful! Please log in.' });
            })
            .catch(error => {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

module.exports = app;

/*
//TECHNICIAN ROUTES
// Technician dashboard route
app.get('/technician-dashboard', async (req, res) => {
  try {
    if (current_user.is_technician){
        technicianid = current_user.technicianid
        technician_service_requests = ServiceRequest.query.filter_by(technicianid=technicianid).all()

        //Calculate counts
        new_works_count = calculateWorksCount(technicianid, 'New')
        in_progress_count = calculate_works_count(technicianid, 'In Progress')
        completed_count = calculate_works_count(technicianid, 'Completed')
        works_left_count = calculate_works_count(technicianid, None)

        return render_template('technician_dashboard.html',
                               service_requests=technician_service_requests,
                               new_works_count=new_works_count,
                               in_progress_count=in_progress_count,
                               completed_count=completed_count,
                               works_left_count=works_left_count)
    }

    //If the user is not a technician, handle it appropriately.
    flash('You do not have access to the technician dashboard.', 'info')
    return redirect(url_for('home'))
    //res.status(200).json({ message: 'Technician dashboard route' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Assume you have Sequelize models for ServiceRequest and Technician defined earlier

const calculateWorksCount = async (technicianId, status = null) => {
  try {
    // Build the base query for service requests for the given technician
    const baseQuery = {
      where: { technicianid: technicianId },
    };

    // Add status condition if provided
    if (status) {
      baseQuery.where.status = status;
    }

    // Execute the count query
    const worksCount = await ServiceRequest.count(baseQuery);

    return worksCount;
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating works count');
  }
};

// Example usage:
// const technicianId = 1; // Replace with the actual technician ID
// const newWorksCount = await calculateWorksCount(technicianId, 'New');
// console.log(`New works count: ${newWorksCount}`);


// Accept work route
app.get('/accept-work/:request_id', async (req, res) => {
  const requestId = req.params.request_id;

  try {
    if (service_request){
        service_request.status = 'In Progress'
        db.session.commit()
        // Additional logic as needed
        flash('Work accepted successfully!', 'success')
    }
        flash('Service request not found', 'error')

    return redirect(url_for('dashboard'))
    //res.status(200).json({ message: 'Work accepted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



const assignAnother = async (requestId) => {
  try {
    // Logic to randomly assign the service request to another technician
    const technicians = await Technician.findAll();
    const newTechnician = technicians[Math.floor(Math.random() * technicians.length)];

    // Update the service request with the new technician
    const serviceRequest = await ServiceRequest.findByPk(requestId);
    serviceRequest.technicianid = newTechnician.technicianid;
    await serviceRequest.save();

    return 'Service request assigned to another technician.';
  } catch (error) {
    console.error(error);
    throw new Error('Error assigning service request to another technician');
  }
};

const markInProgress = async (requestId) => {
  try {
    // Logic to mark the service request as in progress
    const serviceRequest = await ServiceRequest.findByPk(requestId);
    serviceRequest.status = 'In Progress';
    await serviceRequest.save();

    return 'Service request marked as in progress.';
  } catch (error) {
    console.error(error);
    throw new Error('Error marking service request as in progress');
  }
};

const markFinished = async (requestId) => {
  try {
    // Logic to mark the service request as finished
    const serviceRequest = await ServiceRequest.findByPk(requestId);
    serviceRequest.status = 'Completed';
    await serviceRequest.save();

    return 'Service request marked as completed.';
  } catch (error) {
    console.error(error);
    throw new Error('Error marking service request as completed');
  }
};


//CUSTOMER ROUTES
// Customer dashboard route
app.route('/customer-dashboard')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      const customerid = req.user.customerid;

      ServiceRequest.findAll({
        where: {
          customerid: customerid
        }
      })
        .then(customerServiceRequests => {
          res.render('customer_dashboard.html', { service_requests: customerServiceRequests });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    } else {
      // User is not authenticated
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

module.exports = app;


// Create service request route
app.post('/create-service-request', async (req, res) => {
  const { description, requestdate } = req.body;

  try {
    // Logic to create a service request (similar to Python code)
    // Example: res.redirect('/customer-dashboard');
    res.status(200).json({ message: 'Service request submitted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Check status route
app.get('/check-status', async (req, res) => {
  try {
    // Placeholder logic to get the status based on your backend data (replace this with your actual implementation)
    // Example: res.render('check_status', { status, serviceRequestId });
    res.status(200).json({ message: 'Check status route' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
*/
// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
