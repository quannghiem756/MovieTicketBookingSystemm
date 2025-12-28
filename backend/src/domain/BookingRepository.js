// Booking repository interface
class BookingRepository {
  async create(booking) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }

  async findByShowtimeId(showtimeId) {
    throw new Error('Method not implemented');
  }

  async update(id, booking) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findLockedSeats(showtimeId) {
    throw new Error('Method not implemented');
  }
  async findPendingBookingByUser(userId, showtimeId) {
    throw new Error('Method not implemented');
  }

  async countByUserAndCoupon(userId, couponCode) {
    throw new Error('Method not implemented');
  }
}

module.exports = BookingRepository;