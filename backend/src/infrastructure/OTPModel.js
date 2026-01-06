const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otpCode: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index for automatic deletion after expiry
// Mongoose will automatically remove documents when the expiresAt date is reached.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
