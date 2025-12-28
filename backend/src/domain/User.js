// User domain model
class User {
  constructor(id, name, email, phone, passwordHash, dateOfBirth, loyaltyPoints, role = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    this.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    this.loyaltyPoints = loyaltyPoints;
    this.role = role; // 'admin' or 'user'
  }

  calculateAge() {
    if (!this.dateOfBirth) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const m = today.getMonth() - this.dateOfBirth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  }

  canBookMovie(movieRating) {
    const age = this.calculateAge();
    
    switch (movieRating) {
      case 'P':
        return true;
      case 'K':
        // Soft warning, technically allowed to proceed to booking (with guardian check on frontend)
        return true;
      case 'C13':
        return age >= 13;
      case 'C16':
        return age >= 16;
      case 'C18':
        return age >= 18;
      default:
        // Default to safe side if unknown rating, but spec says "except for K...". 
        // If unknown rating, maybe allow? Or block?
        // Let's assume strict validation on movie creation ensures valid ratings.
        // If invalid rating passed here, return false for safety.
        return false;
    }
  }
}

module.exports = User;