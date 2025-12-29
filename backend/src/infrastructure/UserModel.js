const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String },
  googleId: { type: String },
  dateOfBirth: { type: Date },
  loyaltyPoints: { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);