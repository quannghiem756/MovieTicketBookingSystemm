const axios = require('axios');
const VectorSyncService = require('../infrastructure/VectorSyncService');

jest.mock('axios');

describe('VectorSyncService', () => {
  const movie = {
    id: 'movie_123',
    title: 'Test Movie',
    synopsis: 'Test synopsis',
    genre: ['Action'],
    director: 'Director',
    cast: ['Actor'],
    rating: 8.5,
    releaseDate: '2026-01-01',
    duration: 120,
    posterUrl: 'poster.jpg',
    trailerUrl: 'trailer'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VECTOR_SERVICE_URL = 'http://localhost:5001';
  });

  describe('syncMovieUpsert', () => {
    it('should call vector service with upsert action and movie data', async () => {
      axios.post.mockResolvedValue({ data: { status: 'success' } });

      await VectorSyncService.syncMovieUpsert(movie);

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5001/sync/movie',
        {
          action: 'upsert',
          movie: movie
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.post.mockRejectedValue(new Error('Connection failed'));
      
      // Should not throw, but log error (we can't easily test console.error here without more setup)
      await expect(VectorSyncService.syncMovieUpsert(movie)).resolves.not.toThrow();
    });
  });

  describe('syncMovieDelete', () => {
    it('should call vector service with delete action and movie id', async () => {
      axios.post.mockResolvedValue({ data: { status: 'success' } });

      await VectorSyncService.syncMovieDelete('movie_123');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5001/sync/movie',
        {
          action: 'delete',
          movie_id: 'movie_123'
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.post.mockRejectedValue(new Error('Connection failed'));
      
      await expect(VectorSyncService.syncMovieDelete('movie_123')).resolves.not.toThrow();
    });
  });
});
