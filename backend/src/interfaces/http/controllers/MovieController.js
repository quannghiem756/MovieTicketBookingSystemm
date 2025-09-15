const MovieService = require('../../../application/MovieService');

class MovieController {
  constructor(movieService) {
    this.movieService = movieService;
  }

  async createMovie(req, res) {
    try {
      const movie = await this.movieService.createMovie(req.body);
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMovieById(req, res) {
    try {
      const movie = await this.movieService.getMovieById(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Get all movies with pagination
  async getAllMovies(req, res) {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const { movies, totalMovies, currentPage, totalPages } = await this.movieService.getAllMovies(page, limit);
      res.json({ movies, totalMovies, currentPage, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get now showing movies with pagination
  async getNowShowing(req, res) {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const { movies, totalMovies, currentPage, totalPages } = await this.movieService.getNowShowing(page, limit);
      res.json({ movies, totalMovies, currentPage, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get coming soon movies with pagination
  async getComingSoon(req, res) {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const { movies, totalMovies, currentPage, totalPages } = await this.movieService.getComingSoon(page, limit);
      res.json({ movies, totalMovies, currentPage, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateMovie(req, res) {
    try {
      const movie = await this.movieService.updateMovie(req.params.id, req.body);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteMovie(req, res) {
    try {
      const result = await this.movieService.deleteMovie(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieController;