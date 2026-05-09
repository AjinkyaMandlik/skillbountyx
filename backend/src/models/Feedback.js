const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  bounty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bounty',
    required: true,
  },
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
