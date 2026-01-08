const BookingRepository = require('../../domain/BookingRepository');
const BookingModel = require('../BookingModel');

class MongoBookingRepository extends BookingRepository {
  async create(booking) {
    const bookingDoc = new BookingModel({
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      originalPrice: booking.originalPrice,
      discountAmount: booking.discountAmount,
      couponCode: booking.couponCode,
      bookingDate: booking.bookingDate,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      validationToken: booking.validationToken,
      expiresAt: booking.expiresAt
    });

    const savedBooking = await bookingDoc.save();
    booking.id = savedBooking._id;
    return booking;
  }

  mapBookingDoc(doc) {
    if (!doc) return null;

    const booking = {
      id: doc._id,
      userId: doc.userId,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      originalPrice: doc.originalPrice,
      discountAmount: doc.discountAmount,
      couponCode: doc.couponCode,
      bookingDate: doc.bookingDate,
      status: doc.status,
      paymentMethod: doc.paymentMethod,
      validationToken: doc.validationToken,
      expiresAt: doc.expiresAt,
      showtimeId: doc.showtimeId ? (doc.showtimeId._id || doc.showtimeId) : null,
      showtime: null,
      movie: null,
      theater: null
    };

    if (doc.showtimeId && typeof doc.showtimeId === 'object') {
      booking.showtime = {
        showDate: doc.showtimeId.showDate,
        showTime: doc.showtimeId.showTime,
        format: doc.showtimeId.format,
        language: doc.showtimeId.language,
        price: doc.showtimeId.price,
        theaterId: doc.showtimeId.theaterId ? (doc.showtimeId.theaterId._id || doc.showtimeId.theaterId) : null
      };

      if (doc.showtimeId.movieId && typeof doc.showtimeId.movieId === 'object') {
        booking.movie = {
          id: doc.showtimeId.movieId._id,
          title: doc.showtimeId.movieId.title,
          director: doc.showtimeId.movieId.director,
          cast: doc.showtimeId.movieId.cast,
          synopsis: doc.showtimeId.movieId.synopsis,
          duration: doc.showtimeId.movieId.duration,
          genre: doc.showtimeId.movieId.genre,
          rating: doc.showtimeId.movieId.rating,
          posterUrl: doc.showtimeId.movieId.posterUrl,
          trailerUrl: doc.showtimeId.movieId.trailerUrl,
          releaseDate: doc.showtimeId.movieId.releaseDate,
          endDate: doc.showtimeId.movieId.endDate
        };
      }

      if (doc.showtimeId.theaterId && typeof doc.showtimeId.theaterId === 'object') {
        const theaterData = {
          id: doc.showtimeId.theaterId._id,
          name: doc.showtimeId.theaterId.name,
          location: doc.showtimeId.theaterId.location,
          totalSeats: doc.showtimeId.theaterId.totalSeats
        };
        booking.theater = theaterData;
        booking.showtime.theater = theaterData;
      }
    }

    return booking;
  }

  async findAll() {
    const bookingDocs = await BookingModel.find({})
      .populate('userId')
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return bookingDocs.map(doc => {
      const booking = this.mapBookingDoc(doc);
      if (doc.userId && doc.userId._id) {
          booking.userId = doc.userId._id;
          booking.user = {
              id: doc.userId._id,
              name: doc.userId.name,
              email: doc.userId.email,
              phone: doc.userId.phone
          };
      }
      return booking;
    });
  }

  async findById(id) {
    const bookingDoc = await BookingModel.findById(id)
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return this.mapBookingDoc(bookingDoc);
  }

  async findByUserId(userId) {
    const bookingDocs = await BookingModel.find({ userId })
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return bookingDocs.map(doc => this.mapBookingDoc(doc));
  }

  async findByUserIds(userIds) {
    const bookingDocs = await BookingModel.find({ userId: { $in: userIds } })
      .sort({ bookingDate: -1 })
      .populate('userId')
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return bookingDocs.map(doc => {
      const booking = this.mapBookingDoc(doc);
      // Ensure userId is string ID if populated and attach user details
      if (doc.userId && doc.userId._id) {
          booking.userId = doc.userId._id;
          booking.user = {
              id: doc.userId._id,
              name: doc.userId.name,
              email: doc.userId.email,
              phone: doc.userId.phone
          };
      }
      return booking;
    });
  }

  async findByShowtimeId(showtimeId) {
    const bookingDocs = await BookingModel.find({ showtimeId })
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return bookingDocs.map(doc => this.mapBookingDoc(doc));
  }

  async update(id, booking) {
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, {
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      originalPrice: booking.originalPrice,
      discountAmount: booking.discountAmount,
      couponCode: booking.couponCode,
      bookingDate: booking.bookingDate,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      validationToken: booking.validationToken,
      expiresAt: booking.expiresAt
    }, { new: true })
    .populate({
      path: 'showtimeId',
      populate: [
        {
          path: 'movieId',
          model: 'Movie'
        },
        {
          path: 'theaterId',
          model: 'Theater'
        }
      ]
    });

    return this.mapBookingDoc(updatedBooking);
  }

  async delete(id) {
    const result = await BookingModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findLockedSeats(showtimeId) {
    // Find all bookings that lock seats:
    // 1. Confirmed/Paid bookings
    // 2. Pending/Held bookings that haven't expired
    const lockedBookings = await BookingModel.find({
      showtimeId,
      $or: [
        { status: { $in: ['confirmed', 'paid'] } },
        { 
          status: { $in: ['pending', 'held'] },
          $or: [
            { expiresAt: { $gt: new Date() } },
            // Fallback for legacy bookings without expiresAt (default 10 mins from creation)
            { expiresAt: { $exists: false }, bookingDate: { $gte: new Date(Date.now() - 10 * 60 * 1000) } }
          ]
        }
      ]
    });

    // Extract all seat IDs from locked bookings
    const lockedSeats = [];
    lockedBookings.forEach(booking => {
      lockedSeats.push(...booking.seatIds);
    });

    return lockedSeats;
  }

  async findCollidingBooking(showtimeId, seatId, excludeUserId = null) {
    const query = {
      showtimeId,
      seatIds: seatId,
      $or: [
        { status: { $in: ['confirmed', 'paid'] } },
        { 
          status: { $in: ['pending', 'held'] },
          $or: [
            { expiresAt: { $gt: new Date() } },
            { expiresAt: { $exists: false }, bookingDate: { $gte: new Date(Date.now() - 10 * 60 * 1000) } }
          ]
        }
      ]
    };

    if (excludeUserId) {
      query.userId = { $ne: excludeUserId };
    }

    return await BookingModel.findOne(query);
  }

  async findPendingBookingByUser(userId, showtimeId) {
    return await BookingModel.findOne({
      userId,
      showtimeId,
      status: { $in: ['pending', 'held'] },
      expiresAt: { $gt: new Date() }
    });
  }

  async addSeatToBooking(bookingId, seatId, expiresAt) {
    return await BookingModel.findByIdAndUpdate(bookingId, {
      $addToSet: { seatIds: seatId },
      $set: { expiresAt: expiresAt, status: 'held' }
    }, { new: true });
  }

  async removeSeatFromBooking(bookingId, seatId) {
    return await BookingModel.findByIdAndUpdate(bookingId, {
      $pull: { seatIds: seatId }
    }, { new: true });
  }


  async countAll() {
    return await BookingModel.countDocuments();
  }

  async countByStatus(statuses) {
    return await BookingModel.countDocuments({
      status: { $in: statuses }
    });
  }

  async countByUserAndCoupon(userId, couponCode) {
    return await BookingModel.countDocuments({
      userId,
      couponCode,
      status: { $ne: 'cancelled' }
    });
  }

  async getTotalRevenue() {
    const result = await BookingModel.aggregate([
      {
        $match: { status: { $in: ['confirmed', 'paid'] } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async findAllRecent(limit = 4) {
    const bookingDocs = await BookingModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'showtimeId',
        populate: [
          {
            path: 'movieId',
            model: 'Movie'
          },
          {
            path: 'theaterId',
            model: 'Theater'
          }
        ]
      });

    return bookingDocs.map(doc => this.mapBookingDoc(doc));
  }
}

module.exports = MongoBookingRepository;