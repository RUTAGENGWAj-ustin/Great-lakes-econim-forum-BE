const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/news/'); // Store files in 'uploads/news' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only! (jpeg, jpg, png)'));
  }
});

// Create news only (admin)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.path : null; // Get uploaded file path

    const newNews = new News({ title, content, image, author });
    await newNews.save();

    res.status(201).json(newNews);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All News
router.get('/', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get News by ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ msg: 'News article not found' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update News (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!newsItem) return res.status(404).json({ msg: 'News article not found' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete News (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) return res.status(404).json({ msg: 'News article not found' });
    res.json({ msg: 'News article deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
