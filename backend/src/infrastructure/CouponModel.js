const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
    message: 'Type must be PERCENTAGE or FIXED_AMOUNT'
  },
  value: { 
    type: Number, 
    required: true,
    min: 0 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // Global limit, null means unlimited
  userUsageLimit: { type: Number, default: 1 }, // Per user limit
  minOrderValue: { type: Number, default: 0 },
  applicableMovieIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  currentUsage: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for faster lookup by code
couponSchema.index({ code: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
