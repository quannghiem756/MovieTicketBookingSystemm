// User service
const User = require('../domain/User');
const bcrypt = require('bcryptjs');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData) {
    let hashedPassword = null;
    if (userData.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    }
    
    const role = userData.role && userData.role === 'admin' ? 'admin' : 'user';
    
    const user = new User(
      null,
      userData.name,
      userData.email,
      userData.phone,
      hashedPassword,
      userData.dateOfBirth,
      0,
      role,
      userData.googleId
    );
    
    return await this.userRepository.create(user);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async updateUser(id, userData) {
    const user = new User(
      id,
      userData.name,
      userData.email,
      userData.phone,
      userData.passwordHash,
      userData.dateOfBirth,
      userData.loyaltyPoints,
      userData.role || 'user',
      userData.googleId
    );
    
    return await this.userRepository.update(id, user);
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }

  async authenticateUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    // If user has no password (Google user), they can't login via email/password
    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }
}

module.exports = UserService;
