const UserRepository = require('../../domain/UserRepository');
const UserModel = require('../UserModel');

class MongoUserRepository extends UserRepository {
  async create(user) {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      googleId: user.googleId,
      dateOfBirth: user.dateOfBirth,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role || 'user'
    });
    
    const savedUser = await userDoc.save();
    user.id = savedUser._id;
    return user;
  }

  async findAll() {
    const userDocs = await UserModel.find({});
    return userDocs.map(doc => this._mapToDomain(doc));
  }

  async findById(id) {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    return this._mapToDomain(userDoc);
  }

  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return this._mapToDomain(userDoc);
  }

  async update(id, user) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      googleId: user.googleId,
      dateOfBirth: user.dateOfBirth,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role
    }, { new: true });
    
    if (!updatedUser) return null;
    return this._mapToDomain(updatedUser);
  }

  async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async countAll() {
    return await UserModel.countDocuments();
  }

  _mapToDomain(doc) {
    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      passwordHash: doc.passwordHash,
      googleId: doc.googleId,
      dateOfBirth: doc.dateOfBirth,
      loyaltyPoints: doc.loyaltyPoints,
      role: doc.role
    };
  }
}

module.exports = MongoUserRepository;
