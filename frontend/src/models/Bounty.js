const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reward_amount: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  skills_required: {
    type: [String],
    default: [],
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'pending_approval', 'completed'],
    default: 'open',
  },
  escrow_tx_hash: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.models.Bounty || mongoose.model('Bounty', bountySchema);
