// Movie repository interface
class MovieRepository {
  async create(movie) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll(page, limit, search, format) {
    throw new Error('Method not implemented');
  }

  async update(id, movie) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findByTitle(title) {
    throw new Error('Method not implemented');
  }

  async findNowShowing(page, limit, format) {
    throw new Error('Method not implemented');
  }

  async findComingSoon(page, limit, format) {
    throw new Error('Method not implemented');
  }
}

module.exports = MovieRepository;