const mongoose = require('mongoose');
const RefreshTokenModel = require('./src/infrastructure/RefreshTokenModel');
require('dotenv').config();

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking');
    console.log('Connected to MongoDB');

    const testToken = new RefreshTokenModel({
      userId: new mongoose.Types.ObjectId(),
      token: 'test-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 10000),
      consumedAt: new Date(),
      replacedBy: 'new-token-123'
    });

    const saved = await testToken.save();
    console.log('Saved token with new fields:', saved);

    const found = await RefreshTokenModel.findById(saved._id);
    if (found.consumedAt && found.replacedBy === 'new-token-123') {
      console.log('Verification SUCCESS: New fields are working in DB.');
    } else {
      console.log('Verification FAILED: New fields not found or incorrect.');
    }

    await RefreshTokenModel.deleteOne({ _id: saved._id });
    await mongoose.connection.close();
  } catch (error) {
    console.error('Verification error:', error);
    process.exit(1);
  }
}

verify();
