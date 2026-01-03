// Booking domain model
class Booking {
  constructor(id, userId, showtimeId, seatIds, totalPrice, bookingDate, status, paymentMethod, expiresAt, originalPrice, discountAmount, couponCode, validationToken) {
    this.id = id;
    this.userId = userId;
    this.showtimeId = showtimeId;
    this.seatIds = seatIds; // Array of selected seat IDs
    this.totalPrice = totalPrice;
    this.bookingDate = bookingDate;
    this.status = status; // pending, confirmed, cancelled, paid
    this.paymentMethod = paymentMethod || 'momo'; // Default to momo, can be 'momo' or 'cash'
    this.expiresAt = expiresAt;
    this.originalPrice = originalPrice;
    this.discountAmount = discountAmount || 0;
    this.couponCode = couponCode;
    this.validationToken = validationToken;
  }
}

module.exports = Booking;