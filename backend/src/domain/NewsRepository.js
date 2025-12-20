// News repository interface
class NewsRepository {
  async create(news) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll(page = 1, limit = 10, filter = {}) {
    throw new Error('Method not implemented');
  }

  async update(id, news) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findByCategory(category) {
    throw new Error('Method not implemented');
  }

  async findPublished(page = 1, limit = 10, category = null) {
    throw new Error('Method not implemented');
  }

  async count(filter = {}) {
    throw new Error('Method not implemented');
  }

  async findAllWithPagination(skip, limit) {
    throw new Error('Method not implemented');
  }

  async findPublishedWithPagination(skip, limit, category = null) {
    throw new Error('Method not implemented');
  }
}

module.exports = NewsRepository;