const NewsService = require('../../../application/NewsService');

class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
  }

  async create(req, res) {
    try {
      const newsData = req.body;

      // If publishing immediately, set publish date
      if (newsData.published && !newsData.publishDate) {
        newsData.publishDate = new Date();
      }

      const news = await this.newsService.createNews(newsData);
      res.status(201).json(news);
    } catch (error) {
      console.error('Create news error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const { news, totalNews, currentPage, totalPages } = await this.newsService.getAllNews(page, limit);
      res.json({ news, totalNews, currentPage, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const news = await this.newsService.getNewsById(req.params.id);
      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const newsData = req.body;

      // If publishing for the first time, set publish date
      if (newsData.published && !newsData.publishDate) {
        const existingNews = await this.newsService.getNewsById(req.params.id);
        if (existingNews && !existingNews.publishDate) {
          newsData.publishDate = new Date();
        }
      }

      const news = await this.newsService.updateNews(req.params.id, newsData);
      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }
      res.json(news);
    } catch (error) {
      console.error('Update news error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await this.newsService.deleteNews(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'News not found' });
      }
      res.json({ message: 'News deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPublishedNews(req, res) {
    try {
      let { page = 1, limit = 10, category } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const { news, totalNews, currentPage, totalPages } = await this.newsService.getPublishedNews(page, limit, category);

      res.json({ news, totalNews, currentPage, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = NewsController;