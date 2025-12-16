const MovieService = require('../../../application/MovieService');

class MovieController {
  constructor(movieService) {
    this.movieService = movieService;
  }

  async createMovie(req, res) {
    try {
      // Process the request body to parse arrays that were sent as JSON strings
      const processedBody = { ...req.body };

      if (req.body.cast && typeof req.body.cast === 'string') {
        try {
          processedBody.cast = JSON.parse(req.body.cast);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          processedBody.cast = req.body.cast.split(',').map(item => item.trim()).filter(item => item);
        }
      }

      if (req.body.genre && typeof req.body.genre === 'string') {
        try {
          processedBody.genre = JSON.parse(req.body.genre);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          processedBody.genre = req.body.genre.split(',').map(item => item.trim()).filter(item => item);
        }
      }

      // If a file was uploaded, add the file path to the processed body
      if (req.file) {
        processedBody.posterUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.posterUrl) {
        // If no file uploaded but URL provided (for cases where user doesn't want to upload an image)
        processedBody.posterUrl = req.body.posterUrl;
      }

      const movie = await this.movieService.createMovie(processedBody);
      res.status(201).json(movie);
    } catch (error) {
      console.error('Create movie error:', error);
      if (req.fileValidationError) {
        res.status(400).json({ error: req.fileValidationError });
      } else {
        res.status(400).json({ error: error.message });
      }
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
      // Process the request body to parse arrays that were sent as JSON strings
      const processedBody = { ...req.body };

      if (req.body.cast && typeof req.body.cast === 'string') {
        try {
          processedBody.cast = JSON.parse(req.body.cast);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          processedBody.cast = req.body.cast.split(',').map(item => item.trim()).filter(item => item);
        }
      }

      if (req.body.genre && typeof req.body.genre === 'string') {
        try {
          processedBody.genre = JSON.parse(req.body.genre);
        } catch (e) {
          // If JSON parsing fails, treat as comma-separated string
          processedBody.genre = req.body.genre.split(',').map(item => item.trim()).filter(item => item);
        }
      }

      // If a file was uploaded, add the file path to the processed body
      if (req.file) {
        processedBody.posterUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.posterUrl) {
        // If no new file was uploaded but there's a posterUrl in the request, keep it
        processedBody.posterUrl = req.body.posterUrl;
      }

      const movie = await this.movieService.updateMovie(req.params.id, processedBody);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    } catch (error) {
      console.error('Update movie error:', error);
      if (req.fileValidationError) {
        res.status(400).json({ error: req.fileValidationError });
      } else {
        res.status(400).json({ error: error.message });
      }
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