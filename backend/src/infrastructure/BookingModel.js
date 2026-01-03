const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seatIds: [{ type: String }], // Array of selected seat IDs
  totalPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'paid', 'held'], default: 'pending' },
  paymentId: { type: String }, // Reference to payment transaction
  paymentMethod: { type: String, enum: ['momo', 'cash'], default: 'momo' }, // Payment method used
  validationToken: { type: String }, // Token for QR code validation
  expiresAt: { type: Date } // When the pending/held booking expires
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);