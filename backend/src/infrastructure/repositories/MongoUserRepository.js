const UserRepository = require('../../domain/UserRepository');
const UserModel = require('../UserModel');

class MongoUserRepository extends UserRepository {
  async create(user) {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
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
    return userDocs.map(doc => ({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      passwordHash: doc.passwordHash,
      dateOfBirth: doc.dateOfBirth,
      loyaltyPoints: doc.loyaltyPoints,
      role: doc.role
    }));
  }

  async findById(id) {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    
    return {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      passwordHash: userDoc.passwordHash,
      dateOfBirth: userDoc.dateOfBirth,
      loyaltyPoints: userDoc.loyaltyPoints,
      role: userDoc.role
    };
  }

  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    
    return {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      passwordHash: userDoc.passwordHash,
      dateOfBirth: userDoc.dateOfBirth,
      loyaltyPoints: userDoc.loyaltyPoints,
      role: userDoc.role
    };
  }

  async update(id, user) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      dateOfBirth: user.dateOfBirth,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role
    }, { new: true });
    
    if (!updatedUser) return null;
    
    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      passwordHash: updatedUser.passwordHash,
      dateOfBirth: updatedUser.dateOfBirth,
      loyaltyPoints: updatedUser.loyaltyPoints,
      role: updatedUser.role
    };
  }

  async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }
}

module.exports = MongoUserRepository;