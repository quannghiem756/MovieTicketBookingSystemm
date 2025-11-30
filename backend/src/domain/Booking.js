// Booking domain model
class Booking {
  constructor(id, userId, showtimeId, seatIds, totalPrice, bookingDate, status, paymentMethod) {
    this.id = id;
    this.userId = userId;
    this.showtimeId = showtimeId;
    this.seatIds = seatIds; // Array of selected seat IDs
    this.totalPrice = totalPrice;
    this.bookingDate = bookingDate;
    this.status = status; // pending, confirmed, cancelled, paid
    this.paymentMethod = paymentMethod || 'momo'; // Default to momo, can be 'momo' or 'cash'
  }
}

module.exports = Booking;