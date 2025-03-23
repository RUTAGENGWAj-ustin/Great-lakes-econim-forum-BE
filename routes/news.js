import { Router } from 'express';
const router = Router();
import News from '../models/News.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';

// Configure Multer Storage
const storage = diskStorage({
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
    const extname = fileTypes.test(_extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only! (jpeg, jpg, png)'));
  }
});

// Create news only (admin)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ?  `/uploads/events/${req.file.filename}` : null; // Get uploaded file path

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
    const news = await find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get News by ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await findById(req.params.id);
    if (!newsItem) return res.status(404).json({ msg: 'News article not found' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update News (Admin Only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // Use multer to handle file uploads
  async (req, res) => {
    try {
      const { title, content, author } = req.body;
      const image = req.file; // Access the uploaded image file

      // Prepare the update object
      const updateData = {
        title,
        content,
        author,
      };

      // If a new image is uploaded, add it to the update object
      if (image) {
        updateData.image = image.path; // Save the file path to the database
      }

      // Update the news item in the database
      const newsItem = await findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!newsItem) return res.status(404).json({ msg: "News article not found" });
      res.json(newsItem);
    } catch (err) {
      console.error("Error updating news:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Delete News (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = await findByIdAndDelete(req.params.id);
    if (!newsItem) return res.status(404).json({ msg: 'News article not found' });
    res.json({ msg: 'News article deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
