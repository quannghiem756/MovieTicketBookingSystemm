const MongoNewsRepository = require('../infrastructure/repositories/MongoNewsRepository');

class NewsService {
  constructor(newsRepository) {
    this.newsRepository = newsRepository || new MongoNewsRepository();
  }

  async createNews(newsData) {
    try {
      return await this.newsRepository.create(newsData);
    } catch (error) {
      throw new Error(`Failed to create news: ${error.message}`);
    }
  }

  async getNewsById(id) {
    try {
      return await this.newsRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get news by ID: ${error.message}`);
    }
  }

  async getAllNews(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const totalNews = await this.newsRepository.count({});
      const news = await this.newsRepository.findAllWithPagination(skip, limit);
      
      return {
        news,
        totalNews,
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get all news: ${error.message}`);
    }
  }

  async updateNews(id, newsData) {
    try {
      return await this.newsRepository.update(id, newsData);
    } catch (error) {
      throw new Error(`Failed to update news: ${error.message}`);
    }
  }

  async deleteNews(id) {
    try {
      return await this.newsRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete news: ${error.message}`);
    }
  }

  async getPublishedNews(page = 1, limit = 10, category = null) {
    try {
      const skip = (page - 1) * limit;
      const filter = { published: true };
      if (category) {
        filter.category = category;
      }
      
      const totalNews = await this.newsRepository.count(filter);
      const news = await this.newsRepository.findPublishedWithPagination(skip, limit, category);
      
      return {
        news,
        totalNews,
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get published news: ${error.message}`);
    }
  }
}

module.exports = NewsService;