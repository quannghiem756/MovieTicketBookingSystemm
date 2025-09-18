const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  showDate: { type: Date, required: true },
  showTime: { type: String, required: true }, // Format: "HH:MM"
  format: { type: String, required: true }, // 2D, 3D, IMAX, etc.
  language: { type: String, required: true }, // Subtitled, Dubbed, etc.
  price: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Showtime', showtimeSchema);