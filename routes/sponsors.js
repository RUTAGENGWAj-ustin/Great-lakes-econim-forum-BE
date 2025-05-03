import { Router } from 'express';
const router = Router();
import Sponsor from '../models/Sponsor.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';

// Configure Multer Storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/sponsor/'); // Store files in 'uploads/logos' folder
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

//Sponsor Route to Handle Logo Upload
router.post('/', authMiddleware, adminMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { name, website, description } = req.body;
    const logo = req.file ? req.file.path : null; // Get uploaded file path

    const newSponsor = new Sponsor({ name, logo, website, description });
    await newSponsor.save();

    res.status(201).json(newSponsor);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get All Sponsors
router.get('/', async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Sponsor by ID
router.get('/:id', async (req, res) => {
  try {
    const sponsor = await findById(req.params.id);
    if (!sponsor) return res.status(404).json({ msg: 'Sponsor not found' });
    res.json(sponsor);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Sponsor (Admin Only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("logo"), // Use multer to handle file uploads
  async (req, res) => {
    try {
      const { name, website, description } = req.body;
      let logo;

      // If a new logo is uploaded, update logoUrl
      if (req.file) {
        logo = `uploads/sponsor/${req.file.filename}`;
      }

      // Update sponsor
      const updatedSponsor = await findByIdAndUpdate(
        req.params.id,
        {
          name,
          website,
          description,
          ...(logo && { logo }), // Conditionally update logoUrl
        },
        { new: true }
      );

      if (!updatedSponsor) return res.status(404).json({ msg: "Sponsor not found" });

      res.json(updatedSponsor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Delete Sponsor (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sponsor = await findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ msg: 'Sponsor not found' });
    res.json({ msg: 'Sponsor deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
