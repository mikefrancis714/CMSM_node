const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

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

// Define Customer model
const Customer = sequelize.define('Customer', {
  customerid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  phones: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Define Technician model
const Technician = sequelize.define('Technician', {
  technicianid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Define ServiceRequest model
const ServiceRequest = sequelize.define('ServiceRequest', {
  requestid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  requestdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('New', 'In Progress', 'Completed'),
    defaultValue: 'New',
    allowNull: true,
  },
});

// Define Inventory model
const Inventory = sequelize.define('Inventory', {
  itemid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itemname: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

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

// Customer signup route
app.post('/customer-signup', async (req, res) => {
  const { firstname, lastname, email, phones, address, password } = req.body;

  try {
    // Check if the email is already registered
    const existingCustomer = await Customer.findOne({ where: { email } });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Email is already registered. Please log in.' });
    }

    // Create a new customer
    const newCustomer = await Customer.create({
      firstname,
      lastname,
      email,
      phones,
      address,
      password,
    });

    // Respond with success message
    return res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate as a customer
    const customer = await Customer.findOne({ where: { email, password } });
    
    if (customer) {
      login_user(customer)
            flash('Login successful!', 'success')
            return redirect(url_for('customer_dashboard'))
      //return res.status(200).json({ message: 'Login successful!', user: customer });
    }

    // Authenticate as a technician
    const technician = await Technician.findOne({ where: { email, password } });
    
    if (technician) {
      login_user(technician)
            flash('Login successful!', 'success')
            return redirect(url_for('technician_dashboard'))
      //return res.status(200).json({ message: 'Login successful!', user: technician });
    }

    return res.status(401).json({ message: 'Login failed. Check your username and password.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


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

// Example usage:
// const requestId = 1; // Replace with the actual service request ID
// await assignAnother(requestId);
// await markInProgress(requestId);
// await markFinished(requestId);


//CUSTOMER ROUTES
// Customer dashboard route
app.get('/customer-dashboard', async (req, res) => {
  try {
    // Check if the user is authenticated (similar to Python code)
    // Example: res.render('customer_dashboard', { customerServiceRequests });
    res.status(200).json({ message: 'Customer dashboard route' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

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
//app.get('/', (req, res) => {
//  res.send('Hello World!');
//});

// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
