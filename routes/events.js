const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create Event (Admin Only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { imageUrl, name, category, description, date, location, topics, speakers, sponsors } = req.body;

    // Validate required fields
    if (!imageUrl || !name || !category || !date) {
      return res.status(400).json({ msg: 'imageUrl, name, category, and date are required' });
    }

    const newEvent = new Event({
      imageUrl,
      name,
      category,
      description,
      date,
      location,
      topics,
      speakers,
      sponsors,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All Events (Populating Category, Topics, Speakers, and Sponsors)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category', 'name') // Populate category name
      .populate('topics', 'title') // Populate topic titles
      .populate('speakers', 'name') // Populate speaker names
      .populate('sponsors', 'name'); // Populate sponsor names

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Event by ID (with Population)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name')
      .populate('topics', 'title')
      .populate('speakers', 'name')
      .populate('sponsors', 'name');

    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Event (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedEvent) return res.status(404).json({ msg: 'Event not found' });

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Event (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    res.json({ msg: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
