// routes/speakers.js
import { Router } from 'express';
const router = Router();
import Speaker from '../models/Speaker.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';

// Configure Multer storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/speakers/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit: 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(_extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Images only! (jpeg, jpg, png)'));
  }
});

// Speaker creation route
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, bio, expertise } = req.body;
   const image = req.file ? `http://localhost:5000/uploads/speakers/${req.file.filename}` : null; // Get uploaded file path
    
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
    const speakers = await find();
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Speaker by ID
router.get('/:id', async (req, res) => {
  try {
    const speaker = await findById(req.params.id);
    if (!speaker) return res.status(404).json({ msg: 'Speaker not found' });
    res.json(speaker);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Speaker (Admin Only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // Use multer to handle file uploads
  async (req, res) => {
    try {
      const { name, bio, expertise } = req.body;
      const image = req.file; // Access the uploaded image file

      // Prepare the update object
      const updateData = {
        name,
        bio,
        expertise,
      };

      // If a new image is uploaded, add it to the update object
      if (image) {
        updateData.image = image.path; // Save the file path to the database
      }

      // Update the speaker in the database
      const speaker = await findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!speaker) return res.status(404).json({ msg: "Speaker not found" });
      res.json(speaker);
    } catch (err) {
      console.error("Error updating speaker:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Delete Speaker (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const speaker = await findByIdAndDelete(req.params.id);
    if (!speaker) return res.status(404).json({ msg: 'Speaker not found' });
    res.json({ msg: 'Speaker deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
