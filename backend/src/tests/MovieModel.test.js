const mongoose = require('mongoose');
const MovieModel = require('../infrastructure/MovieModel');

describe('Movie Model Rating Validation', () => {
  it('should accept valid Vietnamese ratings', async () => {
    const validRatings = ['P', 'K', 'C13', 'C16', 'C18'];
    for (const rating of validRatings) {
      const movie = new MovieModel({
        title: 'Test Movie',
        director: 'Director',
        synopsis: 'Synopsis',
        duration: 120,
        rating: rating,
        releaseDate: new Date(),
        endDate: new Date()
      });
      // validation should pass
      const err = movie.validateSync();
      if (err && err.errors['rating']) {
         console.error(`Validation failed for rating: ${rating}`, err.errors['rating']);
      }
      expect(err).toBeUndefined();
    }
  });

  it('should reject invalid ratings', async () => {
    const invalidRatings = ['PG', 'R', 'G', 'X', ''];
    for (const rating of invalidRatings) {
      const movie = new MovieModel({
        title: 'Test Movie',
        director: 'Director',
        synopsis: 'Synopsis',
        duration: 120,
        rating: rating,
        releaseDate: new Date(),
        endDate: new Date()
      });
      const err = movie.validateSync();
      expect(err).toBeDefined();
      expect(err.errors['rating']).toBeDefined();
    }
  });
});
