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
      status: booking.status
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