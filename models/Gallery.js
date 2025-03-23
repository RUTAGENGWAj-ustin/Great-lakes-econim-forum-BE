import { Schema, model } from 'mongoose';

const gallerySchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to Event
  imageUrl: { type: String, required: true }, // URL of the image
  caption: { type: String }, // Optional caption for the image
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of upload
});

const Gallery = model('Gallery', gallerySchema);

export default Gallery;
