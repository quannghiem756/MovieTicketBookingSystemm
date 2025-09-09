const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  cast: [{ type: String }],
  synopsis: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genre: [{ type: String }],
  rating: { type: String, required: true }, // e.g., PG, PG-13, R
  posterUrl: { type: String },
  trailerUrl: { type: String },
  releaseDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);