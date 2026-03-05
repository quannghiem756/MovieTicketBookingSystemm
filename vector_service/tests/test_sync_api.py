import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from movie_vector_service import app

class TestSyncAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('movie_vector_service.vector_store')
    def test_sync_movie_upsert_success(self, mock_vector_store):
        # Mock vector_store behavior
        mock_vector_store.add_documents.return_value = ["new_doc_id"]
        
        movie_data = {
            "action": "upsert",
            "movie": {
                "id": "movie_123",
                "title": "Test Movie",
                "synopsis": "A test movie synopsis.",
                "genre": ["Action", "Sci-Fi"],
                "director": "Test Director",
                "cast": ["Actor 1", "Actor 2"],
                "rating": "8.5",
                "releaseDate": "2026-01-01",
                "duration": "120",
                "posterUrl": "http://example.com/poster.jpg",
                "trailerUrl": "http://example.com/trailer"
            }
        }
        
        response = self.app.post('/sync/movie', 
            data=json.dumps(movie_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Movie movie_123 synced successfully')

    @patch('movie_vector_service.vector_store')
    def test_sync_movie_delete_success(self, mock_vector_store):
        # Mock vector_store behavior
        # Chroma.delete takes ids
        mock_vector_store.delete.return_value = None
        
        delete_data = {
            "action": "delete",
            "movie_id": "movie_123"
        }
        
        response = self.app.post('/sync/movie', 
            data=json.dumps(delete_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Movie movie_123 deleted from vector store')

    def test_sync_movie_invalid_action(self):
        invalid_data = {
            "action": "invalid",
            "movie_id": "movie_123"
        }
        
        response = self.app.post('/sync/movie', 
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['error'], 'Invalid action')

    def test_sync_movie_missing_data(self):
        response = self.app.post('/sync/movie', 
            data=json.dumps({}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
