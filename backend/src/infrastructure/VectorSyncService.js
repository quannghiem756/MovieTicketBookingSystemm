const axios = require('axios');
require('dotenv').config();

/**
 * Service to synchronize movie data with the Python Vector Service
 */
class VectorSyncService {
  /**
   * Sync a movie (create or update) to the vector store
   * @param {Object} movie The movie data object
   */
  static async syncMovieUpsert(movie) {
    try {
      const vectorServiceUrl = process.env.VECTOR_SERVICE_URL || 'http://localhost:5001';
      console.log(`[VectorSync] Upserting movie ${movie.id} to vector service at ${vectorServiceUrl}`);
      
      const response = await axios.post(`${vectorServiceUrl}/sync/movie`, {
        action: 'upsert',
        movie: movie
      });
      
      console.log(`[VectorSync] Successfully synced movie ${movie.id}:`, response.data.message);
      return response.data;
    } catch (error) {
      console.error(`[VectorSync] Error syncing movie ${movie?.id}:`, error.message);
      // We don't throw here to avoid failing the main operation if sync fails
      return null;
    }
  }

  /**
   * Delete a movie from the vector store
   * @param {string} movieId The movie ID to delete
   */
  static async syncMovieDelete(movieId) {
    try {
      const vectorServiceUrl = process.env.VECTOR_SERVICE_URL || 'http://localhost:5001';
      console.log(`[VectorSync] Deleting movie ${movieId} from vector service at ${vectorServiceUrl}`);
      
      const response = await axios.post(`${vectorServiceUrl}/sync/movie`, {
        action: 'delete',
        movie_id: movieId
      });
      
      console.log(`[VectorSync] Successfully deleted movie ${movieId}:`, response.data.message);
      return response.data;
    } catch (error) {
      console.error(`[VectorSync] Error deleting movie ${movieId}:`, error.message);
      // We don't throw here to avoid failing the main operation if sync fails
      return null;
    }
  }
}

module.exports = VectorSyncService;
