const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to Event
  imageUrl: { type: String, required: true }, // URL of the image
  caption: { type: String }, // Optional caption for the image
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
