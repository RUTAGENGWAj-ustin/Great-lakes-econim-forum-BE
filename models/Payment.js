const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  paymentIntentId: { type: String }, // Payment gateway intent ID
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
