// routes/auth.js
import { Router } from 'express';
import { genSalt, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne, findById, find } from '../models/User';
const router = Router();
import { authMiddleware, adminMiddleware } from '../middleware/auth';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password , role });
    await user.save();

    const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get User Profile (Protected Route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All Users (Admin Only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
