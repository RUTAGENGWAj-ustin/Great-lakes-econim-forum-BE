import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/events/')); // Store files in 'uploads/events/'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) are allowed.'));
  }
});

// Serve Uploaded Images
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create Event (Admin Only) with Image Upload
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, category, description, date, location, topics, speakers, sponsors } = req.body;
    const imageUrl = req.file ? `/uploads/events/${req.file.filename}` : null;

    // Convert JSON strings to arrays
    const topicsArray = topics ? JSON.parse(topics) : [];
    const speakersArray = speakers ? JSON.parse(speakers) : [];
    const sponsorsArray = sponsors ? JSON.parse(sponsors) : [];
    const eventDate = date ? new Date(date) : null;

    if (!imageUrl || !name || !category || !eventDate) {
      return res.status(400).json({ msg: 'Image, name, category, and date are required' });
    }

    const newEvent = new Event({
      imageUrl,
      name,
      category,
      description,
      date: eventDate,
      location,
      topics: topicsArray,
      speakers: speakersArray,
      sponsors: sponsorsArray,
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

// Update Event (Admin Only) with Image Upload
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, date, location, topics, speakers, sponsors } = req.body;
    let imageUrl;

    // If a new image is uploaded, update imageUrl
    if (req.file) {
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, category, description, date, location, topics, speakers, sponsors, ...(imageUrl && { imageUrl }) },
      { new: true }
    );

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

export default router;
