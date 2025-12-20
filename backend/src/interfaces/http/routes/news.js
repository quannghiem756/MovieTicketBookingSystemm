const express = require('express');
const upload = require('../middleware/upload'); // Add upload middleware
const router = express.Router();
const NewsController = require('../controllers/NewsController');
const MongoNewsRepository = require('../../../infrastructure/repositories/MongoNewsRepository');
const NewsService = require('../../../application/NewsService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { body, param, query } = require('express-validator');

// Initialize service and controller
const newsRepository = new MongoNewsRepository();
const newsService = new NewsService(newsRepository);
const newsController = new NewsController(newsService);

// Public routes
router.get('/published', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string')
], (req, res) => newsController.getPublishedNews(req, res));

router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid news ID')
], (req, res) => newsController.getById(req, res));

// Protected routes (admin only)
router.get('/', authenticate, authorizeAdmin, (req, res) => newsController.getAll(req, res));

router.post('/', authenticate, authorizeAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  body('publishDate').optional().isISO8601().withMessage('Publish date must be a valid ISO date'),
  body('expiryDate').optional().isISO8601().withMessage('Expiry date must be a valid ISO date'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('featuredImage').optional().isString().withMessage('Featured image must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], (req, res) => newsController.create(req, res));

router.put('/:id', authenticate, authorizeAdmin, [
  param('id').isMongoId().withMessage('Invalid news ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  body('publishDate').optional().isISO8601().withMessage('Publish date must be a valid ISO date'),
  body('expiryDate').optional().isISO8601().withMessage('Expiry date must be a valid ISO date'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('featuredImage').optional().isString().withMessage('Featured image must be a string'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], (req, res) => newsController.update(req, res));

router.delete('/:id', authenticate, authorizeAdmin, [
  param('id').isMongoId().withMessage('Invalid news ID')
], (req, res) => newsController.delete(req, res));

// Image upload route for Quill editor
router.post('/upload-image', authenticate, authorizeAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Return the URL of the uploaded image
  res.json({
    url: `/uploads/${req.file.filename}`
  });
});

module.exports = router;