// technician.js
const express = require('express');
const router = express.Router();
const { Technician, ServiceRequest, sequelize } = require('../models');
const { Op } = require('sequelize');
const { ensureAuthenticated } = require('../middlewares/auth');

// Technician dashboard route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.is_technician) {
      const technicianId = req.user.technicianid;

      const technicianServiceRequests = await ServiceRequest.findAll({
        where: {
          technicianid: technicianId,
        },
      });

      // Calculate counts
      const newWorksCount = await calculateWorksCount(technicianId, 'New');
      const inProgressCount = await calculateWorksCount(technicianId, 'In Progress');
      const completedCount = await calculateWorksCount(technicianId, 'Completed');
      const worksLeftCount = await calculateWorksCount(technicianId, null);

      res.render('technician_dashboard.html', {
        serviceRequests: technicianServiceRequests,
        newWorksCount,
        inProgressCount,
        completedCount,
        worksLeftCount,
      });
    } else {
      req.flash('info', 'You do not have access to the technician dashboard.');
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Accept work route
router.get('/accept-work/:requestId', ensureAuthenticated, async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const serviceRequest = await ServiceRequest.findByPk(requestId);

    if (serviceRequest) {
      serviceRequest.status = 'In Progress';
      await serviceRequest.save();
      req.flash('success', 'Work accepted successfully!');
    } else {
      req.flash('error', 'Service request not found');
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to calculate works count for a technician
const calculateWorksCount = async (technicianId, status = null) => {
  try {
    const baseQuery = {
      where: {
        technicianid: technicianId,
      },
    };

    if (status) {
      baseQuery.where.status = status;
    }

    const worksCount = await ServiceRequest.count(baseQuery);
    return worksCount;
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating works count');
  }
};

module.exports = router;
