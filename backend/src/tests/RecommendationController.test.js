const RecommendationController = require('../interfaces/http/controllers/RecommendationController');
const axios = require('axios');

jest.mock('axios');

describe('RecommendationController', () => {
  let recommendationController;
  let mockMovieService;
  let mockShowtimeService;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockMovieService = {
      getNowShowing: jest.fn(),
      getComingSoon: jest.fn(),
      getAllMovies: jest.fn(),
    };
    mockShowtimeService = {
      getFutureShowtimesByMovieId: jest.fn(),
    };

    recommendationController = new RecommendationController(mockMovieService, mockShowtimeService);

    mockRequest = {
      body: { query: 'action movies' },
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getMovieRecommendations', () => {
    it('should include showtimes in the recommendations', async () => {
      // Mock vector service response
      const mockRecommendations = [
        { id: '1', title: 'Movie 1' },
        { id: '2', title: 'Movie 2' },
      ];
      axios.post.mockResolvedValue({
        data: {
          recommendations: mockRecommendations,
          total: 2,
          source: 'vector_service',
          intent: 'movie_recommendation',
          message: 'Found 2 recommendations',
        },
      });

      // Mock showtime service response
      mockShowtimeService.getFutureShowtimesByMovieId.mockImplementation(async (movieId) => {
        if (movieId === '1') return [{ id: 's1', time: '10:00' }];
        if (movieId === '2') return [];
        return [];
      });

      await recommendationController.getMovieRecommendations(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalled();
      const responseData = mockResponse.json.mock.calls[0][0];

      expect(responseData.recommendations).toHaveLength(2);
      expect(responseData.recommendations[0].showtimes).toBeDefined();
      expect(responseData.recommendations[0].showtimes).toHaveLength(1); // Movie 1 has 1 showtime
      expect(responseData.recommendations[1].showtimes).toBeDefined();
      expect(responseData.recommendations[1].showtimes).toHaveLength(0); // Movie 2 has 0 showtimes
      expect(mockShowtimeService.getFutureShowtimesByMovieId).toHaveBeenCalledTimes(2);
    });
  });
});
