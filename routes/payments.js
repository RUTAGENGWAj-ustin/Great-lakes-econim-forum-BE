const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Payment = require('../models/Payment'); // Assuming you have a Payment model
// const { createPaymentIntent, confirmPaymentIntent } = require('../utils/paymentGateway'); // A mock of your payment gateway integration

// Create Payment (User)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, currency, eventId } = req.body;
    
    // Assume createPaymentIntent is a function that interacts with your payment provider (Stripe, PayPal, etc.)
    const paymentIntent = await createPaymentIntent(amount, currency);
    
    const newPayment = new Payment({
      user: req.user.id, 
      amount,
      currency,
      eventId,
      status: 'pending', // Payment is pending until confirmed
      paymentIntentId: paymentIntent.id,
    });
    
    await newPayment.save();
    res.status(201).json(paymentIntent); // Send payment intent to the frontend for confirmation
  } catch (err) {
    res.status(500).json({ msg: 'Payment creation failed' });
  }
});

// Confirm Payment (User)
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Assume confirmPaymentIntent verifies the payment status
    const confirmedPayment = await confirmPaymentIntent(paymentIntentId);
    
    if (!confirmedPayment) return res.status(400).json({ msg: 'Payment failed' });
    
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status: 'confirmed' },
      { new: true }
    );
    
    res.json(payment);
  } catch (err) {
    res.status(500).json({ msg: 'Payment confirmation failed' });
  }
});

// Get Payment Status (Admin & User)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ msg: 'Error retrieving payment status' });
  }
});

module.exports = router;
