const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  expertise: { type: String },
  image: { type: String }, // Image URL
});

const Speaker = mongoose.model('Speaker', speakerSchema);

module.exports = Speaker;
