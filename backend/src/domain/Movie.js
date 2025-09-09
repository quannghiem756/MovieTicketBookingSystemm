// Movie domain model
class Movie {
  constructor(id, title, director, cast, synopsis, duration, genre, rating, posterUrl, trailerUrl, releaseDate, endDate) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.cast = cast;
    this.synopsis = synopsis;
    this.duration = duration; // in minutes
    this.genre = genre;
    this.rating = rating; // e.g., PG, PG-13, R
    this.posterUrl = posterUrl;
    this.trailerUrl = trailerUrl;
    this.releaseDate = releaseDate;
    this.endDate = endDate;
  }
}

module.exports = Movie;