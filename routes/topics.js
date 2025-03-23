import { Router } from 'express';
const router = Router();
import Topic, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/Topic';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

// Create Topic (Admin Only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTopic = new Topic({ name, description });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All Topics
router.get('/', async (req, res) => {
  try {
    const topics = await find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Topic by ID
router.get('/:id', async (req, res) => {
  try {
    const topic = await findById(req.params.id);
    if (!topic) return res.status(404).json({ msg: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Topic (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topic = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ msg: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Topic (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topic = await findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ msg: 'Topic not found' });
    res.json({ msg: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
