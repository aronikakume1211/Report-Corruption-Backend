const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['bribery', 'embezzlement', 'nepotism', 'fraud', 'other']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  evidenceFiles: [{
    type: String, // URLs to uploaded files/images
    required: false
  }],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'rejected'],
    default: 'pending'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  hasEvidence: {
    type: Boolean,
    required: false
  },
  isAnonymous: {
    type: Boolean,
    required: false
  },
  contactEmail: {
    type: String,
    required: false
  },
  contactPhone: {
    type: String,
    required: false
  }
});

// Update the updatedAt timestamp before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema); 