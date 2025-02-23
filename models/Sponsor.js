const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // Logo image URL
  website: { type: String },
  description: { type: String },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
