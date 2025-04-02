const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const { auth, isAdmin } = require('../middleware/auth');

// Create a new report
router.post('/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['bribery', 'embezzlement', 'nepotism', 'fraud', 'other']).withMessage('Invalid category'),
    body('location'),
    body('date'),
    body('time')
  ],
  async (req, res) => {
    try {
      console.log('Body',req.body)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const report = new Report({
        ...req.body,
        reporter: req.user._id
      });

      await report.save();
      console.log('Report: ', report);
      res.status(201).json(report);
    } catch (error) {
      console.log('Error:',error)
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all reports (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reports
router.get('/my-reports', auth, async (req, res) => {
  console.log('Request User: ', req.user)
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.log('Error: ',error)
    res.status(500).json({ message: 'error' });
  }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user is authorized to view the report
    if (report.reporter._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update report status (admin only)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign report to admin (admin only)
router.patch('/:id/assign', auth, isAdmin, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.assignedTo = assignedTo;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 