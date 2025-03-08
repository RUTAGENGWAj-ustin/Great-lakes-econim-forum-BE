const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");
const { authMiddleware, adminMiddleware } = require('../middleware/auth');


const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/Gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// 📌 Upload multiple images and create gallery entries
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { event, captions } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Convert captions to an array (if sent as a string)
    const captionArray = Array.isArray(captions) ? captions : [captions];

    const galleryEntries = req.files.map((file, index) => ({
      event,
      imageUrl: `/uploads/Gallery/${file.filename}`,
      caption: captionArray[index] || "", // Assign caption if available
    }));

    const savedGalleries = await Gallery.insertMany(galleryEntries);
    
    res.status(201).json(savedGalleries);
  } catch (error) {
    res.status(500).json({ message: "Error uploading images", error });
  }
});

// 📌 Serve uploaded images statically
router.use("/uploads/Gallery", express.static(uploadDir));


// 📌 Get all gallery images
router.get("/", async (req, res) => {
  try {
    const galleries = await Gallery.find().populate("event", "name date location");
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery images", error });
  }
});

// 📌 Get gallery images for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const galleries = await Gallery.find({ event: eventId }).populate("event", "name date location");
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery images for event", error });
  }
});

// 📌 Get a specific gallery image by ID
router.get("/:id", async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id).populate("event", "name date location");

    if (!galleryItem) return res.status(404).json({ message: "Gallery item not found" });

    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery item", error });
  }
});

// 📌 Update a gallery image
router.put( "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images"), // Use multer to handle multiple file uploads
  async (req, res) => {
    try {
      const { event, caption } = req.body;
      const images = req.files; // Access the uploaded image files

      // Prepare the update object
      const updateData = {
        event,
        caption,
      };

      // If new images are uploaded, add them to the update object
      if (images && images.length > 0) {
        updateData.images = images.map((file) => `/uploads/gallery/${file.filename}`);
      }

      // Update the gallery item in the database
      const updatedGallery = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!updatedGallery) return res.status(404).json({ msg: "Gallery item not found" });
      res.json(updatedGallery);
    } catch (err) {
      console.error("Error updating gallery:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// 📌 Delete a gallery image
router.delete("/:id", async (req, res) => {
  try {
    const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedGallery) return res.status(404).json({ message: "Gallery item not found" });

    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery item", error });
  }
});

module.exports = router;
