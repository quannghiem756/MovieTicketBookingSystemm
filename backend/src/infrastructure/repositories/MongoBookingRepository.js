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
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      expiresAt: booking.expiresAt
    });

    const savedBooking = await bookingDoc.save();
    booking.id = savedBooking._id;
    return booking;
  }

  async findAll() {
    const bookingDocs = await BookingModel.find({})
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

    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId._id,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status,
      showtime: {
        showDate: doc.showtimeId.showDate,
        showTime: doc.showtimeId.showTime,
        format: doc.showtimeId.format,
        language: doc.showtimeId.language,
        price: doc.showtimeId.price,
        theaterId: doc.showtimeId.theaterId._id,
        theater: {
          id: doc.showtimeId.theaterId._id,
          name: doc.showtimeId.theaterId.name,
          location: doc.showtimeId.theaterId.location,
          totalSeats: doc.showtimeId.theaterId.totalSeats
        }
      },
      movie: {
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
      },
      theater: {
        id: doc.showtimeId.theaterId._id,
        name: doc.showtimeId.theaterId.name,
        location: doc.showtimeId.theaterId.location,
        totalSeats: doc.showtimeId.theaterId.totalSeats
      }
    }));
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

    if (!bookingDoc) return null;

    return {
      id: bookingDoc._id,
      userId: bookingDoc.userId,
      showtimeId: bookingDoc.showtimeId._id,
      seatIds: bookingDoc.seatIds,
      totalPrice: bookingDoc.totalPrice,
      bookingDate: bookingDoc.bookingDate,
      status: bookingDoc.status,
      showtime: {
        showDate: bookingDoc.showtimeId.showDate,
        showTime: bookingDoc.showtimeId.showTime,
        format: bookingDoc.showtimeId.format,
        language: bookingDoc.showtimeId.language,
        price: bookingDoc.showtimeId.price,
        theaterId: bookingDoc.showtimeId.theaterId._id,
        theater: {
          id: bookingDoc.showtimeId.theaterId._id,
          name: bookingDoc.showtimeId.theaterId.name,
          location: bookingDoc.showtimeId.theaterId.location,
          totalSeats: bookingDoc.showtimeId.theaterId.totalSeats
        }
      },
      movie: {
        id: bookingDoc.showtimeId.movieId._id,
        title: bookingDoc.showtimeId.movieId.title,
        director: bookingDoc.showtimeId.movieId.director,
        cast: bookingDoc.showtimeId.movieId.cast,
        synopsis: bookingDoc.showtimeId.movieId.synopsis,
        duration: bookingDoc.showtimeId.movieId.duration,
        genre: bookingDoc.showtimeId.movieId.genre,
        rating: bookingDoc.showtimeId.movieId.rating,
        posterUrl: bookingDoc.showtimeId.movieId.posterUrl,
        trailerUrl: bookingDoc.showtimeId.movieId.trailerUrl,
        releaseDate: bookingDoc.showtimeId.movieId.releaseDate,
        endDate: bookingDoc.showtimeId.movieId.endDate
      },
      theater: {
        id: bookingDoc.showtimeId.theaterId._id,
        name: bookingDoc.showtimeId.theaterId.name,
        location: bookingDoc.showtimeId.theaterId.location,
        totalSeats: bookingDoc.showtimeId.theaterId.totalSeats
      }
    };
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

    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId._id,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status,
      showtime: {
        showDate: doc.showtimeId.showDate,
        showTime: doc.showtimeId.showTime,
        format: doc.showtimeId.format,
        language: doc.showtimeId.language,
        price: doc.showtimeId.price,
        theaterId: doc.showtimeId.theaterId._id,
        theater: {
          id: doc.showtimeId.theaterId._id,
          name: doc.showtimeId.theaterId.name,
          location: doc.showtimeId.theaterId.location,
          totalSeats: doc.showtimeId.theaterId.totalSeats
        }
      },
      movie: {
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
      },
      theater: {
        id: doc.showtimeId.theaterId._id,
        name: doc.showtimeId.theaterId.name,
        location: doc.showtimeId.theaterId.location,
        totalSeats: doc.showtimeId.theaterId.totalSeats
      }
    }));
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

    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId._id,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status,
      showtime: {
        showDate: doc.showtimeId.showDate,
        showTime: doc.showtimeId.showTime,
        format: doc.showtimeId.format,
        language: doc.showtimeId.language,
        price: doc.showtimeId.price,
        theaterId: doc.showtimeId.theaterId._id,
        theater: {
          id: doc.showtimeId.theaterId._id,
          name: doc.showtimeId.theaterId.name,
          location: doc.showtimeId.theaterId.location,
          totalSeats: doc.showtimeId.theaterId.totalSeats
        }
      },
      movie: {
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
      },
      theater: {
        id: doc.showtimeId.theaterId._id,
        name: doc.showtimeId.theaterId.name,
        location: doc.showtimeId.theaterId.location,
        totalSeats: doc.showtimeId.theaterId.totalSeats
      }
    }));
  }

  async update(id, booking) {
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, {
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
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

    if (!updatedBooking) return null;

    return {
      id: updatedBooking._id,
      userId: updatedBooking.userId,
      showtimeId: updatedBooking.showtimeId._id,
      seatIds: updatedBooking.seatIds,
      totalPrice: updatedBooking.totalPrice,
      bookingDate: updatedBooking.bookingDate,
      status: updatedBooking.status,
      paymentMethod: updatedBooking.paymentMethod,
      showtime: {
        showDate: updatedBooking.showtimeId.showDate,
        showTime: updatedBooking.showtimeId.showTime,
        format: updatedBooking.showtimeId.format,
        language: updatedBooking.showtimeId.language,
        price: updatedBooking.showtimeId.price,
        theaterId: updatedBooking.showtimeId.theaterId._id,
        theater: {
          id: updatedBooking.showtimeId.theaterId._id,
          name: updatedBooking.showtimeId.theaterId.name,
          location: updatedBooking.showtimeId.theaterId.location,
          totalSeats: updatedBooking.showtimeId.theaterId.totalSeats
        }
      },
      movie: {
        id: updatedBooking.showtimeId.movieId._id,
        title: updatedBooking.showtimeId.movieId.title,
        director: updatedBooking.showtimeId.movieId.director,
        cast: updatedBooking.showtimeId.movieId.cast,
        synopsis: updatedBooking.showtimeId.movieId.synopsis,
        duration: updatedBooking.showtimeId.movieId.duration,
        genre: updatedBooking.showtimeId.movieId.genre,
        rating: updatedBooking.showtimeId.movieId.rating,
        posterUrl: updatedBooking.showtimeId.movieId.posterUrl,
        trailerUrl: updatedBooking.showtimeId.movieId.trailerUrl,
        releaseDate: updatedBooking.showtimeId.movieId.releaseDate,
        endDate: updatedBooking.showtimeId.movieId.endDate
      },
      theater: {
        id: updatedBooking.showtimeId.theaterId._id,
        name: updatedBooking.showtimeId.theaterId.name,
        location: updatedBooking.showtimeId.theaterId.location,
        totalSeats: updatedBooking.showtimeId.theaterId.totalSeats
      }
    };
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
          }
        ]
      });

    return bookingDocs.map(doc => ({
      id: doc._id,
      userId: doc.userId,
      showtimeId: doc.showtimeId._id,
      seatIds: doc.seatIds,
      totalPrice: doc.totalPrice,
      bookingDate: doc.bookingDate,
      status: doc.status,
      createdAt: doc.createdAt,
      movie: {
        id: doc.showtimeId.movieId._id,
        title: doc.showtimeId.movieId.title
      }
    }));
  }
}

module.exports = MongoBookingRepository;