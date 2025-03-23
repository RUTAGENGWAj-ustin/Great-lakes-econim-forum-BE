import { Schema, model } from 'mongoose';

const rsvpSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  attending: { type: Boolean, required: true }, // True if attending, false if not
});

const Rsvp = model('Rsvp', rsvpSchema);

export default Rsvp;
