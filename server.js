const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const speakerRoutes = require('./routes/speakers');
const topicRoutes = require('./routes/topics');
const newsRoutes = require('./routes/news');
const sponsorRoutes = require('./routes/sponsors');
const paymentRoutes = require('./routes/payments');
const rsvpRoutes = require('./routes/rsvp');
const category = require('./routes/category');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// console.log('in server:', process.env.JWT_SECRET);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))).catch(err => console.log(err));

// Middleware to verify JWT
defaultMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use("/api/categories", category);

// const PORT = process.env.PORT || 5000;

