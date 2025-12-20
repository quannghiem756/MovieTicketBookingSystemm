const NewsRepository = require('../../domain/NewsRepository');
const NewsModel = require('../NewsModel');

class MongoNewsRepository extends NewsRepository {
  async create(news) {
    const newsDoc = new NewsModel({
      title: news.title,
      content: news.content,
      published: news.published,
      publishDate: news.publishDate,
      expiryDate: news.expiryDate,
      category: news.category,
      featuredImage: news.featuredImage,
      tags: news.tags
    });

    const savedNews = await newsDoc.save();
    news.id = savedNews._id;
    return news;
  }

  async findById(id) {
    const newsDoc = await NewsModel.findById(id);
    if (!newsDoc) return null;

    return {
      id: newsDoc._id,
      title: newsDoc.title,
      content: newsDoc.content,
      published: newsDoc.published,
      publishDate: newsDoc.publishDate,
      expiryDate: newsDoc.expiryDate,
      category: newsDoc.category,
      featuredImage: newsDoc.featuredImage,
      tags: newsDoc.tags,
      createdAt: newsDoc.createdAt,
      updatedAt: newsDoc.updatedAt
    };
  }

  async findAll(page = 1, limit = 10, filter = {}) {
    const skip = (page - 1) * limit;

    const query = {};
    if (filter.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex }
      ];
    }

    if (filter.published !== undefined) {
      query.published = filter.published;
    }

    if (filter.category) {
      query.category = filter.category;
    }

    const newsDocs = await NewsModel.find(query)
      .sort(filter.sort || '-createdAt')
      .skip(skip)
      .limit(limit);

    const totalNews = await NewsModel.countDocuments(query);

    const news = newsDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      published: doc.published,
      publishDate: doc.publishDate,
      expiryDate: doc.expiryDate,
      category: doc.category,
      featuredImage: doc.featuredImage,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    return {
      news,
      totalNews,
      currentPage: page,
      totalPages: Math.ceil(totalNews / limit)
    };
  }

  async update(id, news) {
    const updatedNews = await NewsModel.findByIdAndUpdate(id, {
      title: news.title,
      content: news.content,
      published: news.published,
      publishDate: news.publishDate,
      expiryDate: news.expiryDate,
      category: news.category,
      featuredImage: news.featuredImage,
      tags: news.tags
    }, { new: true });

    if (!updatedNews) return null;

    return {
      id: updatedNews._id,
      title: updatedNews.title,
      content: updatedNews.content,
      published: updatedNews.published,
      publishDate: updatedNews.publishDate,
      expiryDate: updatedNews.expiryDate,
      category: updatedNews.category,
      featuredImage: updatedNews.featuredImage,
      tags: updatedNews.tags,
      createdAt: updatedNews.createdAt,
      updatedAt: updatedNews.updatedAt
    };
  }

  async delete(id) {
    const result = await NewsModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByCategory(category) {
    const newsDocs = await NewsModel.find({ category, published: true }).sort('-publishDate');

    return newsDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      published: doc.published,
      publishDate: doc.publishDate,
      expiryDate: doc.expiryDate,
      category: doc.category,
      featuredImage: doc.featuredImage,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  }

  async findPublished(page = 1, limit = 10, category = null) {
    const skip = (page - 1) * limit;

    const query = { published: true };
    if (category) {
      query.category = category;
    }

    const newsDocs = await NewsModel.find(query)
      .sort('-publishDate')
      .skip(skip)
      .limit(limit);

    const totalNews = await NewsModel.countDocuments(query);

    const news = newsDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      published: doc.published,
      publishDate: doc.publishDate,
      expiryDate: doc.expiryDate,
      category: doc.category,
      featuredImage: doc.featuredImage,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    return {
      news,
      totalNews,
      currentPage: page,
      totalPages: Math.ceil(totalNews / limit)
    };
  }

  async count(filter = {}) {
    return await NewsModel.countDocuments(filter);
  }

  async findAllWithPagination(skip, limit) {
    const newsDocs = await NewsModel.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    return newsDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      published: doc.published,
      publishDate: doc.publishDate,
      expiryDate: doc.expiryDate,
      category: doc.category,
      featuredImage: doc.featuredImage,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  }

  async findPublishedWithPagination(skip, limit, category = null) {
    const query = { published: true };
    if (category) {
      query.category = category;
    }

    const newsDocs = await NewsModel.find(query)
      .sort('-publishDate')
      .skip(skip)
      .limit(limit);

    return newsDocs.map(doc => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      published: doc.published,
      publishDate: doc.publishDate,
      expiryDate: doc.expiryDate,
      category: doc.category,
      featuredImage: doc.featuredImage,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));
  }
}

module.exports = MongoNewsRepository;