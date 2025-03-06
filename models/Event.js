import mongoose from "mongoose";

// Define the subdocument schema for pricing
const pricingSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  benefits: [{ type: String }],
});

// Define the main event schema
const eventSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }],
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }],
  pricing: [pricingSchema], // Array of pricing objects
});

const Event = mongoose.model('Event', eventSchema);

export default Event;