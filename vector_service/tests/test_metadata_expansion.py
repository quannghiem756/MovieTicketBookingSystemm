import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import movie_vector_service
from movie_vector_service import app

class TestMetadataExpansion(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        # Reset global variables in movie_vector_service
        movie_vector_service.vector_store = MagicMock()
        movie_vector_service.movies_data = []

    def test_search_results_include_expanded_metadata(self):
        """Test that /search endpoint returns the new metadata fields"""
        # Mock document returned by vector store
        mock_doc = MagicMock()
        mock_doc.metadata = {
            'id': 'movie123',
            'title': 'Test Movie',
            'director': 'Test Director',
            'cast': 'Actor 1, Actor 2',
            'synopsis': 'A test synopsis',
            'genre': 'Action, Sci-Fi',
            'rating': 'PG-13',
            'posterUrl': 'http://example.com/poster.jpg',
            'releaseDate': '2023-12-30',
            'duration': '120',
            'trailerUrl': 'http://example.com/trailer.mp4'
        }
        
        movie_vector_service.vector_store.similarity_search.return_value = [mock_doc]
        # Ensure movies_data is empty so it reconstructs from metadata
        movie_vector_service.movies_data = []

        response = self.app.post('/search', 
            data=json.dumps({'query': 'test'}),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(data['movies']) > 0)
        
        movie = data['movies'][0]
        self.assertEqual(movie['id'], 'movie123')
        self.assertEqual(movie.get('posterUrl'), 'http://example.com/poster.jpg')
        self.assertEqual(movie.get('releaseDate'), '2023-12-30')
        self.assertEqual(movie.get('duration'), '120')
        self.assertEqual(movie.get('trailerUrl'), 'http://example.com/trailer.mp4')

    def test_get_movies_includes_expanded_metadata(self):
        """Test that /movies endpoint returns the new metadata fields"""
        # Mock Chroma collection get() response
        mock_collection = MagicMock()
        mock_collection.get.return_value = {
            'metadatas': [{
                'id': 'movie123',
                'title': 'Test Movie',
                'director': 'Test Director',
                'cast': 'Actor 1, Actor 2',
                'synopsis': 'A test synopsis',
                'genre': 'Action, Sci-Fi',
                'rating': 'PG-13',
                'posterUrl': 'http://example.com/poster.jpg',
                'releaseDate': '2023-12-30',
                'duration': '120',
                'trailerUrl': 'http://example.com/trailer.mp4'
            }]
        }
        movie_vector_service.vector_store._collection = mock_collection

        response = self.app.get('/movies')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(data['movies']) > 0)
        
        movie = data['movies'][0]
        self.assertEqual(movie.get('posterUrl'), 'http://example.com/poster.jpg')
        self.assertEqual(movie.get('releaseDate'), '2023-12-30')
        self.assertEqual(movie.get('duration'), '120')
        self.assertEqual(movie.get('trailerUrl'), 'http://example.com/trailer.mp4')

if __name__ == '__main__':
    unittest.main()
