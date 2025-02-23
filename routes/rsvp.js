const express = require('express');
const router = express.Router();
const Rsvp = require('../models/Rsvp'); // Assuming you have an RSVP model
const { authMiddleware } = require('../middleware/auth');

// RSVP for an Event (User)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { eventId, attending } = req.body;
    
    // Create a new RSVP record
    const newRsvp = new Rsvp({
      user: req.user.id,
      eventId,
      attending,
    });
    
    await newRsvp.save();
    res.status(201).json(newRsvp);
  } catch (err) {
    res.status(500).json({ msg: 'RSVP creation failed' });
  }
});

// Get RSVPs for a specific event
router.get('/:eventId', async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ eventId: req.params.eventId });
    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ msg: 'Error retrieving RSVPs' });
  }
});

// Get User's RSVP Status for a Specific Event
router.get('/user/:eventId', authMiddleware, async (req, res) => {
  try {
    const rsvp = await Rsvp.findOne({ eventId: req.params.eventId, user: req.user.id });
    if (!rsvp) return res.status(404).json({ msg: 'RSVP not found' });
    res.json(rsvp);
  } catch (err) {
    res.status(500).json({ msg: 'Error retrieving RSVP status' });
  }
});

module.exports = router;
