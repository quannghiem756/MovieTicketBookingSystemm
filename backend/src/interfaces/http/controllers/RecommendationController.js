const MovieService = require('../../../application/MovieService');
const axios = require('axios');

class RecommendationController {
  constructor(movieService, showtimeService) {
    this.movieService = movieService;
    this.showtimeService = showtimeService;
    this.vectorServiceUrl = process.env.VECTOR_SERVICE_URL || 'http://localhost:5001';
  }

  async _enrichWithShowtimes(movies) {
    if (!movies || !Array.isArray(movies) || !this.showtimeService) {
      return movies;
    }

    return await Promise.all(movies.map(async (movie) => {
      try {
        const showtimes = await this.showtimeService.getFutureShowtimesByMovieId(movie.id);
        return { ...movie, showtimes };
      } catch (error) {
        console.error(`Error fetching showtimes for movie ${movie.id}:`, error.message);
        return { ...movie, showtimes: [] };
      }
    }));
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

        const { recommendations, total, source, message, intent } = vectorServiceResponse.data;

        // Enrich recommendations with showtimes
        const enrichedRecommendations = await this._enrichWithShowtimes(recommendations);

        res.json({
          query: query,
          recommendations: enrichedRecommendations,
          total: total,
          source: source || 'vector_service',
          intent: intent || 'unknown',
          message: message || (total > 0 ? `Found ${total} recommendations` : "No movies match your criteria. Try mentioning genres like 'action', 'comedy', 'drama' or specific actors/directors you like!")
        });
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
        
        // Enrich fallback recommendations with showtimes
        const enrichedFallbackRecommendations = await this._enrichWithShowtimes(fallbackRecommendations);

        res.json({
          query: query,
          recommendations: enrichedFallbackRecommendations,
          total: enrichedFallbackRecommendations.length,
          source: 'fallback',
          intent: 'unknown',
          message: 'Using fallback recommendation system due to vector service unavailability'
        });
      }
    } catch (error) {
      console.error('Error in getMovieRecommendations:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async getAvailableMovies(req, res) {
    try {
      // Forward the request directly to the vector service which handles intent internally
      const { query } = req.body;

      // Since this is specifically an "available movies" endpoint, we can send a query that's likely to trigger
      // the available_movies intent, or just forward the query as is
      try {
        const vectorServiceResponse = await axios.post(
          `${this.vectorServiceUrl}/recommend`,
          { query: query || "What movies are available to watch?" },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000 // 30 second timeout
          }
        );

        const { recommendations, total, source, message, intent } = vectorServiceResponse.data;

        // Enrich recommendations with showtimes
        const enrichedRecommendations = await this._enrichWithShowtimes(recommendations);

        res.json({
          query: query || "What movies are available to watch?",
          recommendations: enrichedRecommendations,
          total: total,
          source: source || 'vector_service',
          intent: intent || 'available_movies',
          message: message || `Found ${total} available movies`
        });
      } catch (vectorServiceError) {
        console.error('Error communicating with vector service:', vectorServiceError.message);

        // Fallback to original approach if vector service is unavailable
        const { movies: nowShowingMovies } = await this.movieService.getNowShowing(1, 100);
        const { movies: comingSoonMovies } = await this.movieService.getComingSoon(1, 100);

        // Combine all available movies and remove duplicates
        const availableMovies = [
          ...nowShowingMovies,
          ...comingSoonMovies
        ].filter((movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
        );

        // Enrich available movies with showtimes
        const enrichedAvailableMovies = await this._enrichWithShowtimes(availableMovies);

        res.json({
          query: query,
          recommendations: enrichedAvailableMovies,
          total: enrichedAvailableMovies.length,
          source: 'fallback',
          intent: 'available_movies',
          message: `Using fallback - found ${enrichedAvailableMovies.length} available movies`
        });
      }
    } catch (error) {
      console.error('Error in getAvailableMovies:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Helper method to determine if the query is asking for available movies using simple keyword matching
  isAvailableMoviesQuery(query) {
    if (!query) return false;

    const lowerQuery = query.toLowerCase();
    const availableKeywords = [
      'available', 'showing', 'available movies', 'what movies',
      'what films', 'currently showing', 'now showing', 'in theaters',
      'what\'s playing', 'what is playing', 'currently playing', 'on screen',
      'now on', 'what movies are', 'show me movies', 'what films are',
      'any movies', 'any films', 'what\'s available', 'currently available'
    ];

    return availableKeywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
  }

  // The intent detection is now handled internally by the vector service
  // Alternative method to determine if the query is asking for available movies using LLM intent analysis
  async isAvailableMoviesQueryLLM(query) {
    if (!query) return false;

    try {
      // Send query to the vector service's recommendation endpoint which now handles intent internally
      const vectorServiceResponse = await axios.post(
        `${this.vectorServiceUrl}/recommend`,
        {
          query: query
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000 // 15 second timeout for LLM processing
        }
      );

      // Check the intent property in the response
      if (vectorServiceResponse.data && vectorServiceResponse.data.intent) {
        return vectorServiceResponse.data.intent === 'available_movies';
      }
    } catch (vectorServiceError) {
      console.error('Vector service intent analysis unavailable:', vectorServiceError.message);
      // Fallback to original keyword matching if vector service is not available
    }

    // Fallback to original keyword matching if vector service is not available
    return this.isAvailableMoviesQuery(query);
  }

  analyzeQuery(query, movies) {
    const lowerQuery = query.toLowerCase();
    let matchingMovies = [...movies];

    // Check if this is a query for available movies
    if (this.isAvailableMoviesQuery(query)) {
      // If user is asking for available movies, return all movies that are now showing or coming soon
      return movies.filter(movie => {
        const now = new Date();
        const releaseDate = new Date(movie.releaseDate);

        // Include movies that are now showing (released and not expired) or coming soon (future release)
        return releaseDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30); // Include movies from last 30 days
      });
    }

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