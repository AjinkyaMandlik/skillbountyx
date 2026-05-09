const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bounty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bounty',
    required: true,
  },
  from_address: {
    type: String,
    required: true,
  },
  to_address: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  tx_hash: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['escrow_funding', 'payout'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
