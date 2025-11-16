const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  seatMap: { 
    type: [[{
      id: String,
      row: String,
      number: Number,
      type: { type: String, enum: ['standard', 'double', 'vip', 'space'], default: 'standard' },
      isAvailable: { type: Boolean, default: true },
      isDisabled: { type: Boolean, default: false }
    }]],
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Theater', theaterSchema);