import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import speakerRoutes from './routes/speakers.js';
import topicRoutes from './routes/topics.js';
import newsRoutes from './routes/news.js';
import sponsorRoutes from './routes/sponsors.js';
import paymentRoutes from './routes/payments.js';
import rsvpRoutes from './routes/rsvp.js';
import categoryRoutes from "./routes/category.js";
import galleryRoutes from "./routes/gallery.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { verify } = jwt;
// Load environment variables
config();

const app = express();
app.use(json());
app.use(cors());


// Connect to MongoDB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))).catch(err => console.log(err));

// Middleware to verify JWT
const defaultMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Routes
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use("/api/category", categoryRoutes );
app.use("/api/gallery", galleryRoutes);

// const PORT = process.env.PORT || 5000;

