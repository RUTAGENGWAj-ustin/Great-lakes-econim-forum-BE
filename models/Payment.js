import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  paymentIntentId: { type: String }, // Payment gateway intent ID
});

const Payment = model('Payment', paymentSchema);

export default Payment;
