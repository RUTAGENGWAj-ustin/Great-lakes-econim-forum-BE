// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();
// console.log(' in auth:',process.env.JWT_SECRET);

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'Access Denied' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access Denied: Admins only' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
