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
import advertRoutes from "./routes/advert.js";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import "dotenv/config";


// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const { verify } = jwt;
// Load environment variables
config();

const app = express();
app.use(json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



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

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// Email sending endpoint
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // Sender's email
    to: "just123@gmail.com", // Recipient's email
    subject: `New Message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully");
  });
});


// app.use('/send-email',email)
app.use('/api/auth', authRoutes);
app.use("/api/adverts", advertRoutes);
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
export default app;
