const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Bounty = require('../models/Bounty');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get user's active/completed tasks
    const createdBounties = await Bounty.find({ creator_id: req.user.id });
    
    res.json({ user, createdBounties });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get public profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
