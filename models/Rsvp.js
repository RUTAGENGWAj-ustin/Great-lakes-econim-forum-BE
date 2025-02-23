const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attending: { type: Boolean, required: true }, // True if attending, false if not
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

module.exports = Rsvp;
