// News domain model
class News {
  constructor(id, title, content, published, publishDate, expiryDate, category, featuredImage, tags) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.published = published;
    this.publishDate = publishDate;
    this.expiryDate = expiryDate;
    this.category = category;
    this.featuredImage = featuredImage;
    this.tags = tags;
  }
}

module.exports = News;