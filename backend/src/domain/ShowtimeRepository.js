// Showtime repository interface
class ShowtimeRepository {
  async create(showtime) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByMovieId(movieId) {
    throw new Error('Method not implemented');
  }

  async findByTheaterId(theaterId) {
    throw new Error('Method not implemented');
  }

  async findByDateAndTheater(date, theaterId) {
    throw new Error('Method not implemented');
  }

  async update(id, showtime) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = ShowtimeRepository;