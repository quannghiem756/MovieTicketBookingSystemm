import unittest
from unittest.mock import patch
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from movie_vector_service import app

class TestFallback(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('movie_vector_service.classify_query_intent')
    @patch('movie_vector_service.search_similar_movies')
    @patch('movie_vector_service.fetch_movies_from_api')
    def test_vague_query_popular_fallback(self, mock_fetch, mock_search, mock_classify):
        mock_classify.return_value = ('movie_recommendation', 'en')
        mock_search.return_value = [] # No results
        mock_fetch.return_value = [
            {'id': '1', 'title': 'Popular Movie', 'rating': '9.0'}
        ]
        
        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'good movie'}),
            content_type='application/json'
        )
        data = json.loads(response.data)
        self.assertEqual(data['source'], 'popular_fallback')
        self.assertEqual(data['recommendations'][0]['title'], 'Popular Movie')

if __name__ == '__main__':
    unittest.main()
