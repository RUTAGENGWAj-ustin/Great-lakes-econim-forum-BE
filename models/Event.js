const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }], // Array of topic IDs
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }], // Array of speaker IDs
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }], // Array of sponsor IDs
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
