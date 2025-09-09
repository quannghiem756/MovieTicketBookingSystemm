// User domain model
class User {
  constructor(id, name, email, phone, passwordHash, dateOfBirth, loyaltyPoints) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    this.dateOfBirth = dateOfBirth;
    this.loyaltyPoints = loyaltyPoints;
  }
}

module.exports = User;