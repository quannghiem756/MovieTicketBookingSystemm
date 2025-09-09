const MovieRepository = require('../domain/MovieRepository');
const MovieModel = require('../infrastructure/MovieModel');

class MongoMovieRepository extends MovieRepository {
  async create(movie) {
    const movieDoc = new MovieModel({
      title: movie.title,
      director: movie.director,
      cast: movie.cast,
      synopsis: movie.synopsis,
      duration: movie.duration,
      genre: movie.genre,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      releaseDate: movie.releaseDate,
      endDate: movie.endDate
    });
    
    const savedMovie = await movieDoc.save();
    movie.id = savedMovie._id;
    return movie;
  }

  async findById(id) {
    const movieDoc = await MovieModel.findById(id);
    if (!movieDoc) return null;
    
    return {
      id: movieDoc._id,
      title: movieDoc.title,
      director: movieDoc.director,
      cast: movieDoc.cast,
      synopsis: movieDoc.synopsis,
      duration: movieDoc.duration,
      genre: movieDoc.genre,
      rating: movieDoc.rating,
      posterUrl: movieDoc.posterUrl,
      trailerUrl: movieDoc.trailerUrl,
      releaseDate: movieDoc.releaseDate,
      endDate: movieDoc.endDate
    };
  }

  async findAll() {
    const movieDocs = await MovieModel.find();
    return movieDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      director: doc.director,
      cast: doc.cast,
      synopsis: doc.synopsis,
      duration: doc.duration,
      genre: doc.genre,
      rating: doc.rating,
      posterUrl: doc.posterUrl,
      trailerUrl: doc.trailerUrl,
      releaseDate: doc.releaseDate,
      endDate: doc.endDate
    }));
  }

  async update(id, movie) {
    const updatedMovie = await MovieModel.findByIdAndUpdate(id, {
      title: movie.title,
      director: movie.director,
      cast: movie.cast,
      synopsis: movie.synopsis,
      duration: movie.duration,
      genre: movie.genre,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      releaseDate: movie.releaseDate,
      endDate: movie.endDate
    }, { new: true });
    
    if (!updatedMovie) return null;
    
    return {
      id: updatedMovie._id,
      title: updatedMovie.title,
      director: updatedMovie.director,
      cast: updatedMovie.cast,
      synopsis: updatedMovie.synopsis,
      duration: updatedMovie.duration,
      genre: updatedMovie.genre,
      rating: updatedMovie.rating,
      posterUrl: updatedMovie.posterUrl,
      trailerUrl: updatedMovie.trailerUrl,
      releaseDate: updatedMovie.releaseDate,
      endDate: updatedMovie.endDate
    };
  }

  async delete(id) {
    const result = await MovieModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByTitle(title) {
    const movieDoc = await MovieModel.findOne({ title: new RegExp(title, 'i') });
    if (!movieDoc) return null;
    
    return {
      id: movieDoc._id,
      title: movieDoc.title,
      director: movieDoc.director,
      cast: movieDoc.cast,
      synopsis: movieDoc.synopsis,
      duration: movieDoc.duration,
      genre: movieDoc.genre,
      rating: movieDoc.rating,
      posterUrl: movieDoc.posterUrl,
      trailerUrl: movieDoc.trailerUrl,
      releaseDate: movieDoc.releaseDate,
      endDate: movieDoc.endDate
    };
  }

  async findNowShowing() {
    const today = new Date();
    const movieDocs = await MovieModel.find({
      releaseDate: { $lte: today },
      endDate: { $gte: today }
    });
    
    return movieDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      director: doc.director,
      cast: doc.cast,
      synopsis: doc.synopsis,
      duration: doc.duration,
      genre: doc.genre,
      rating: doc.rating,
      posterUrl: doc.posterUrl,
      trailerUrl: doc.trailerUrl,
      releaseDate: doc.releaseDate,
      endDate: doc.endDate
    }));
  }

  async findComingSoon() {
    const today = new Date();
    const movieDocs = await MovieModel.find({
      releaseDate: { $gt: today }
    });
    
    return movieDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      director: doc.director,
      cast: doc.cast,
      synopsis: doc.synopsis,
      duration: doc.duration,
      genre: doc.genre,
      rating: doc.rating,
      posterUrl: doc.posterUrl,
      trailerUrl: doc.trailerUrl,
      releaseDate: doc.releaseDate,
      endDate: doc.endDate
    }));
  }
}

module.exports = MongoMovieRepository;