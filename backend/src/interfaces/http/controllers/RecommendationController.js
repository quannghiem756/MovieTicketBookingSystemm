const MovieService = require('../../../application/MovieService');
const axios = require('axios');

class RecommendationController {
  constructor(movieService) {
    this.movieService = movieService;
    this.vectorServiceUrl = process.env.VECTOR_SERVICE_URL || 'http://localhost:5001';
  }

  async getMovieRecommendations(req, res) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Forward the request to the Python vector service
      try {
        const vectorServiceResponse = await axios.post(
          `${this.vectorServiceUrl}/recommend`,
          { query },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000 // 30 second timeout
          }
        );

        const { recommendations, total, source, message } = vectorServiceResponse.data;

        if (recommendations && recommendations.length > 0) {
          res.json({
            query: query,
            recommendations: recommendations,
            total: total,
            source: source || 'vector_service'
          });
        } else {
          res.json({
            query: query,
            recommendations: [],
            total: 0,
            message: message || "No movies match your criteria. Try mentioning genres like 'action', 'comedy', 'drama' or specific actors/directors you like!"
          });
        }
      } catch (vectorServiceError) {
        console.error('Error communicating with vector service:', vectorServiceError.message);

        // Fallback to original analysis if vector service is unavailable
        const { movies: nowShowingMovies } = await this.movieService.getNowShowing(1, 100);
        const { movies: comingSoonMovies } = await this.movieService.getComingSoon(1, 100);
        const { movies: allMovies } = await this.movieService.getAllMovies(1, 100);

        // Combine all movies and remove duplicates
        const allMoviesData = [
          ...nowShowingMovies,
          ...comingSoonMovies,
          ...allMovies
        ].filter((movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
        );

        const fallbackRecommendations = this.analyzeQuery(query, allMoviesData);

        res.json({
          query: query,
          recommendations: fallbackRecommendations,
          total: fallbackRecommendations.length,
          source: 'fallback',
          message: 'Using fallback recommendation system due to vector service unavailability'
        });
      }
    } catch (error) {
      console.error('Error in getMovieRecommendations:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  analyzeQuery(query, movies) {
    const lowerQuery = query.toLowerCase();
    let matchingMovies = [...movies];

    // Check for genre keywords
    const genreKeywords = ['action', 'comedy', 'drama', 'thriller', 'horror', 'romance', 'sci-fi', 'science fiction', 'fantasy', 'adventure', 'animation'];
    const foundGenres = genreKeywords.filter(genre =>
      lowerQuery.includes(genre)
    );

    if (foundGenres.length > 0) {
      matchingMovies = matchingMovies.filter(movie => {
        if (movie.genre && Array.isArray(movie.genre)) {
          return movie.genre.some(movGenre =>
            foundGenres.some(foundGenre =>
              movGenre.toLowerCase().includes(foundGenre.replace(' ', ''))
            )
          );
        }
        return false;
      });
    }

    // Check for rating keywords
    const ratingKeywords = ['g', 'pg', 'pg-13', 'r', 'nc-17'];
    const foundRatings = ratingKeywords.filter(rating =>
      lowerQuery.includes(rating)
    );

    if (foundRatings.length > 0) {
      matchingMovies = matchingMovies.filter(movie =>
        foundRatings.some(foundRating =>
          movie.rating && movie.rating.toLowerCase().includes(foundRating.toLowerCase())
        )
      );
    }

    // Check for keywords related to movie type
    if (lowerQuery.includes('new') || lowerQuery.includes('latest') || lowerQuery.includes('recent')) {
      // Sort by release date (newest first)
      matchingMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (lowerQuery.includes('old') || lowerQuery.includes('classic')) {
      // Sort by release date (oldest first)
      matchingMovies.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    }

    // Limit to top 5 recommendations
    return matchingMovies.slice(0, 5);
  }
}

module.exports = RecommendationController;