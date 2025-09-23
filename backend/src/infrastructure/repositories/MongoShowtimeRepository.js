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

  async findAll() {
    const showtimeDocs = await ShowtimeModel.find({});
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
}

module.exports = MongoShowtimeRepository;