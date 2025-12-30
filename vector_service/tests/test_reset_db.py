import unittest
from unittest.mock import MagicMock
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import movie_vector_service
from movie_vector_service import app

class TestResetDB(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        # Reset global variables in movie_vector_service
        movie_vector_service.vector_store = MagicMock()
        movie_vector_service.movies_data = []

    def test_reset_db_clears_data(self):
        """Test that /reset-db endpoint clears the vector database"""
        # Mock vector store delete/reset method
        mock_vector_store = MagicMock()
        movie_vector_service.vector_store = mock_vector_store
        
        # Simulate data existing before reset
        movie_vector_service.movies_data = [{'id': '1', 'title': 'Test'}]
        
        response = self.app.post('/reset-db')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Vector database has been reset')
        
        # Verify vector store reset/delete was called
        # Depending on implementation, might call delete_collection or similar
        # For now, we assume it calls reset() or we'll inspect implementation later.
        # But critically, the in-memory cache should be cleared
        self.assertEqual(len(movie_vector_service.movies_data), 0)

if __name__ == '__main__':
    unittest.main()
