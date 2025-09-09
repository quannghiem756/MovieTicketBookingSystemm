// Showtime domain model
class Showtime {
  constructor(id, movieId, theaterId, showDate, showTime, format, language, price) {
    this.id = id;
    this.movieId = movieId;
    this.theaterId = theaterId;
    this.showDate = showDate;
    this.showTime = showTime;
    this.format = format; // 2D, 3D, IMAX, etc.
    this.language = language; // Subtitled, Dubbed, etc.
    this.price = price;
  }
}

module.exports = Showtime;