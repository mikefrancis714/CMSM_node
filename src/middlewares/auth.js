// auth.js

const ensureAuthenticated = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      return next(); // Continue to the next middleware or route handler
    }
  
    // If not authenticated, redirect to the login page or handle it as needed
    res.redirect('/login'); // Adjust the path based on your routes
  
    // Alternatively, you can send a 401 Unauthorized status and a JSON response
    // res.status(401).json({ message: 'Unauthorized' });
  };
  
  module.exports = { ensureAuthenticated };
  