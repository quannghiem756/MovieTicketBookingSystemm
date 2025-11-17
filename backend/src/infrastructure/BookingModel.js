const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seatIds: [{ type: String }], // Array of selected seat IDs
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'paid'], default: 'pending' },
  paymentId: { type: String } // Reference to payment transaction
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);