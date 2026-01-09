const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  cast: [{ type: String }],
  synopsis: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genre: [{ type: String }],
  rating: { 
    type: String, 
    required: true,
    enum: ['P', 'K', 'C13', 'C16', 'C18'],
    message: 'Rating must be one of: P, K, C13, C16, C18'
  }, // Vietnamese Cinema Standard
  posterUrl: { type: String },
  trailerUrl: { type: String },
  formats: [{ type: String, enum: ['2D', '3D', 'IMAX'], default: ['2D'] }],
  releaseDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);