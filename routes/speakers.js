// routes/speakers.js
const express = require('express');
const router = express.Router();
const Speaker = require('../models/Speaker');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/speakers/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only! (jpeg, jpg, png)'));
  }
});

// Speaker creation route
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, bio, expertise } = req.body;
    const image = req.file ? req.file.path : null; // Get uploaded file path
    
    const newSpeaker = new Speaker({ name, bio, expertise, image });
    await newSpeaker.save();
    
    res.status(201).json(newSpeaker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get All Speakers
router.get('/', async (req, res) => {
  try {
    const speakers = await Speaker.find();
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Speaker by ID
router.get('/:id', async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ msg: 'Speaker not found' });
    res.json(speaker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Speaker (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!speaker) return res.status(404).json({ msg: 'Speaker not found' });
    res.json(speaker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Speaker (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) return res.status(404).json({ msg: 'Speaker not found' });
    res.json({ msg: 'Speaker deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
