const MovieService = require('../application/MovieService');
const VectorSyncService = require('../infrastructure/VectorSyncService');

jest.mock('../infrastructure/VectorSyncService');

describe('MovieService Synchronization', () => {
  let movieService;
  let mockMovieRepository;

  beforeEach(() => {
    mockMovieRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn()
    };
    movieService = new MovieService(mockMovieRepository);
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should call VectorSyncService.syncMovieUpsert after creating a movie', async () => {
      const movieData = { title: 'New Movie', id: 'movie_123' };
      const createdMovie = { ...movieData, id: 'movie_123' };
      mockMovieRepository.create.mockResolvedValue(createdMovie);

      const result = await movieService.createMovie(movieData);

      expect(mockMovieRepository.create).toHaveBeenCalled();
      expect(VectorSyncService.syncMovieUpsert).toHaveBeenCalledWith(createdMovie);
      expect(result).toEqual(createdMovie);
    });
  });

  describe('updateMovie', () => {
    it('should call VectorSyncService.syncMovieUpsert after updating a movie', async () => {
      const id = 'movie_123';
      const movieData = { title: 'Updated Movie' };
      const updatedMovie = { ...movieData, id };
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      const result = await movieService.updateMovie(id, movieData);

      expect(mockMovieRepository.update).toHaveBeenCalled();
      expect(VectorSyncService.syncMovieUpsert).toHaveBeenCalledWith(updatedMovie);
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('deleteMovie', () => {
    it('should call VectorSyncService.syncMovieDelete after deleting a movie', async () => {
      const id = 'movie_123';
      mockMovieRepository.delete.mockResolvedValue(true);

      const result = await movieService.deleteMovie(id);

      expect(mockMovieRepository.delete).toHaveBeenCalledWith(id);
      expect(VectorSyncService.syncMovieDelete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
