const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: false },
  publishDate: { type: Date },
  expiryDate: { type: Date },
  category: { type: String, default: 'General' },
  featuredImage: { type: String },
  tags: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);