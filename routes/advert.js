import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Advert from "../models/Advert.js";

const router = express.Router();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/advert/")); // Store files in 'uploads/adverts/'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only images (jpeg, jpg, png) are allowed."));
  },
});

// Create a new advert with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = `/uploads/advert/${req.file.filename}`; // Get the uploaded file path

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const advert = new Advert({ image, title, description, link });
    await advert.save();
    res.status(201).json(advert);
  } catch (error) {
    res.status(500).json({ error: "Failed to create advert" });
  }
});

// Get all adverts
router.get("/", async (req, res) => {
  try {
    const adverts = await Advert.find();
    res.status(200).json(adverts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch adverts" });
  }
});

// Get a single advert by ID
router.get("/:id", async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    res.status(200).json(advert);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch advert" });
  }
});

// Update an advert by ID (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link } = req.body;
    const image = req.file ? `/uploads/advert/${req.file.filename}` : null;

    const updateData = { title, description, link };
    if (image) updateData.image = image;

    const advert = await Advert.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });

    if (!advert) {
      return res.status(404).json({ error: "Advert not found" });
    }

    res.status(200).json(advert);
  } catch (error) {
    console.error("Error updating advert:", error);
    res.status(500).json({ error: "Failed to update advert" });
  }
});

// Delete an advert by ID
router.delete("/:id", async (req, res) => {
  try {
    const advert = await Advert.findByIdAndDelete(req.params.id);
    if (!advert) {
      return res.status(404).json({ error: "Advert not found" });
    }
    res.status(200).json({ message: "Advert deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete advert" });
  }
});

export default router;