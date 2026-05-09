const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bounty = require('../models/Bounty');
const Submission = require('../models/Submission');
const stellarService = require('../services/stellar');

// Get all open bounties
router.get('/', async (req, res) => {
  try {
    const bounties = await Bounty.find().populate('creator_id', 'username wallet_address').sort({ createdAt: -1 });
    res.json(bounties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get bounty by ID
router.get('/:id', async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id).populate('creator_id', 'username wallet_address');
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }
    const submissions = await Submission.find({ bounty_id: req.params.id }).populate('freelancer_id', 'username wallet_address');
    res.json({ bounty, submissions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a bounty
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, reward_amount, deadline, skills_required, escrow_tx_hash } = req.body;

    const newBounty = new Bounty({
      title,
      description,
      reward_amount,
      deadline,
      skills_required,
      creator_id: req.user.id,
      status: 'open',
      escrow_tx_hash
    });

    const bounty = await newBounty.save();
    res.json(bounty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Submit work
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { work_url, message } = req.body;

    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) return res.status(404).json({ message: 'Bounty not found' });

    const submission = new Submission({
      bounty_id: req.params.id,
      freelancer_id: req.user.id,
      work_url,
      message,
      status: 'submitted'
    });

    await submission.save();

    bounty.status = 'pending_approval';
    await bounty.save();

    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Approve work
router.post('/:id/approve', auth, async (req, res) => {
  try {
    const { submission_id } = req.body;
    
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) return res.status(404).json({ message: 'Bounty not found' });

    if (bounty.creator_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const submission = await Submission.findById(submission_id).populate('freelancer_id', 'wallet_address');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Payout logic via Stellar
    const txHash = await stellarService.releasePayment(submission.freelancer_id.wallet_address, bounty.reward_amount.toString());

    submission.status = 'approved';
    await submission.save();

    bounty.status = 'completed';
    await bounty.save();

    res.json({ message: 'Work approved and payment released', txHash });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
