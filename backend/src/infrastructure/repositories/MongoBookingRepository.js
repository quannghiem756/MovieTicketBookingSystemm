const BookingRepository = require('../../domain/BookingRepository');
const BookingModel = require('../BookingModel');

class MongoBookingRepository extends BookingRepository {
  async create(booking) {
    const bookingDoc = new BookingModel({
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      status: booking.status
    });
    
    const savedBooking = await bookingDoc.save();
    booking.id = savedBooking._id;
    return booking;
  }

  async findById(id) {
    const bookingDoc = await BookingModel.findById(id);
    if (!bookingDoc) return null;
    
    return {
      id: bookingDoc._id,
      userId: bookingDoc.userId,
      showtimeId: bookingDoc.showtimeId,
      seatIds: bookingDoc.seatIds,
      totalPrice: bookingDoc.totalPrice,
      bookingDate: bookingDoc.bookingDate,
      status: bookingDoc.status
    };
  }

  async findByUserId(userId) {
    const bookingDocs = await BookingModel.find({ userId });
    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status
    }));
  }

  async findByShowtimeId(showtimeId) {
    const bookingDocs = await BookingModel.find({ showtimeId });
    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status
    }));
  }

  async update(id, booking) {
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, {
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      status: booking.status
    }, { new: true });
    
    if (!updatedBooking) return null;
    
    return {
      id: updatedBooking._id,
      userId: updatedBooking.userId,
      showtimeId: updatedBooking.showtimeId,
      seatIds: updatedBooking.seatIds,
      totalPrice: updatedBooking.totalPrice,
      bookingDate: updatedBooking.bookingDate,
      status: updatedBooking.status
    };
  }

  async delete(id) {
    const result = await BookingModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findLockedSeats(showtimeId) {
    // Find all bookings with "pending" status for a showtime
    // These represent temporarily locked seats
    const pendingBookings = await BookingModel.find({
      showtimeId,
      status: 'pending',
      bookingDate: {
        $gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
      }
    });
    
    // Extract all seat IDs from pending bookings
    const lockedSeats = [];
    pendingBookings.forEach(booking => {
      lockedSeats.push(...booking.seatIds);
    });
    
    return lockedSeats;
  }
}

module.exports = MongoBookingRepository;