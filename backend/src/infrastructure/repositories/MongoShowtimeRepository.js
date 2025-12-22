const ShowtimeRepository = require('../../domain/ShowtimeRepository');
const ShowtimeModel = require('../ShowtimeModel');

class MongoShowtimeRepository extends ShowtimeRepository {
  async create(showtime) {
    const showtimeDoc = new ShowtimeModel({
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      showDate: showtime.showDate,
      showTime: showtime.showTime,
      format: showtime.format,
      language: showtime.language,
      price: showtime.price
    });

    const savedShowtime = await showtimeDoc.save();
    showtime.id = savedShowtime._id;
    return showtime;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const showtimeDocs = await ShowtimeModel.find({})
      .skip(skip)
      .limit(limit)
      .sort({ showDate: 1, showTime: 1 }); // Sort by date and time

    const total = await ShowtimeModel.countDocuments();

    return {
      data: showtimeDocs.map(doc => ({
        id: doc._id,
        movieId: doc.movieId,
        theaterId: doc.theaterId,
        showDate: doc.showDate,
        showTime: doc.showTime,
        format: doc.format,
        language: doc.language,
        price: doc.price
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    const showtimeDoc = await ShowtimeModel.findById(id);
    if (!showtimeDoc) return null;

    return {
      id: showtimeDoc._id,
      movieId: showtimeDoc.movieId,
      theaterId: showtimeDoc.theaterId,
      showDate: showtimeDoc.showDate,
      showTime: showtimeDoc.showTime,
      format: showtimeDoc.format,
      language: showtimeDoc.language,
      price: showtimeDoc.price
    };
  }

  async findByMovieId(movieId) {
    const showtimeDocs = await ShowtimeModel.find({ movieId });
    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price
    }));
  }

  async findByTheaterId(theaterId) {
    const showtimeDocs = await ShowtimeModel.find({ theaterId });
    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price
    }));
  }

  async findFutureByMovieId(movieId) {
    // Find showtimes from today up to one week ahead for a specific movie
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today to include today's showtimes

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7); // Add 7 days to get one week ahead

    const showtimeDocs = await ShowtimeModel.find({
      movieId,
      showDate: { $gte: today, $lte: nextWeek }
    }).sort({ showDate: 1, showTime: 1 });  // Sort by date and time ascending

    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price
    }));
  }

  async findByDateAndTheater(date, theaterId) {
    // Find showtimes for a specific date (ignoring time) and theater
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const showtimeDocs = await ShowtimeModel.find({
      theaterId,
      showDate: { $gte: startOfDay, $lte: endOfDay }
    });

    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price
    }));
  }

  async findByDate(date) {
    // Find showtimes for a specific date (ignoring time), regardless of theater
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const showtimeDocs = await ShowtimeModel.find({
      showDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('movieId');

    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId._id,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price,
      movie: {
        id: doc.movieId._id,
        title: doc.movieId.title,
        posterUrl: doc.movieId.posterUrl,
        rating: doc.movieId.rating,
        duration: doc.movieId.duration,
        genre: doc.movieId.genre,
        director: doc.movieId.director,
        cast: doc.movieId.cast,
        synopsis: doc.movieId.synopsis,
        releaseDate: doc.movieId.releaseDate,
        status: doc.movieId.status
      }
    }));
  }

  async update(id, showtime) {
    const updatedShowtime = await ShowtimeModel.findByIdAndUpdate(id, {
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      showDate: showtime.showDate,
      showTime: showtime.showTime,
      format: showtime.format,
      language: showtime.language,
      price: showtime.price
    }, { new: true });

    if (!updatedShowtime) return null;

    return {
      id: updatedShowtime._id,
      movieId: updatedShowtime.movieId,
      theaterId: updatedShowtime.theaterId,
      showDate: updatedShowtime.showDate,
      showTime: updatedShowtime.showTime,
      format: updatedShowtime.format,
      language: updatedShowtime.language,
      price: updatedShowtime.price
    };
  }

  async delete(id) {
    const result = await ShowtimeModel.findByIdAndDelete(id);
    return result !== null;
  }

  async countAll() {
    return await ShowtimeModel.countDocuments();
  }

  async countUpcoming() {
    return await ShowtimeModel.countDocuments({
      showDate: { $gte: new Date() }
    });
  }

  async findAllRecent(limit = 4) {
    const showtimeDocs = await ShowtimeModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('movieId');

    return showtimeDocs.map(doc => ({
      id: doc._id,
      movieId: doc.movieId._id,
      theaterId: doc.theaterId,
      showDate: doc.showDate,
      showTime: doc.showTime,
      format: doc.format,
      language: doc.language,
      price: doc.price,
      createdAt: doc.createdAt,
      movie: {
        id: doc.movieId._id,
        title: doc.movieId.title
      }
    }));
  }
}

module.exports = MongoShowtimeRepository;