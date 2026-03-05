import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from movie_vector_service import app, get_now_showing_ids

class TestShowtimeFilter(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('movie_vector_service.requests.get')
    def test_get_now_showing_ids_success(self, mock_get):
        # Mock successful API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'movies': [
                {'id': 'movie1', 'title': 'Movie 1'},
                {'id': 'movie2', 'title': 'Movie 2'}
            ]
        }
        mock_get.return_value = mock_response

        ids = get_now_showing_ids()
        self.assertEqual(ids, ['movie1', 'movie2'])
        mock_get.assert_called_once()

    @patch('movie_vector_service.requests.get')
    def test_get_now_showing_ids_empty(self, mock_get):
        # Mock empty API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'movies': []}
        mock_get.return_value = mock_response

        ids = get_now_showing_ids()
        self.assertEqual(ids, [])

    @patch('movie_vector_service.requests.get')
    def test_get_now_showing_ids_failure(self, mock_get):
        # Mock failed API response
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_get.return_value = mock_response

        ids = get_now_showing_ids()
        self.assertEqual(ids, [])

    @patch('movie_vector_service.OPENAI_API_KEY', None)
    @patch('movie_vector_service.GEMINI_API_KEY', None)
    @patch('movie_vector_service.get_now_showing_ids')
    @patch('movie_vector_service.search_similar_movies')
    @patch('movie_vector_service.classify_query_intent')
    def test_recommend_with_filter(self, mock_classify, mock_search, mock_filter_ids):
        # Mock intent
        mock_classify.return_value = ('movie_recommendation', 'en')
        
        # Mock now showing IDs
        mock_filter_ids.return_value = ['movie1']
        
        # Mock search results
        mock_search.return_value = [
            {'movie': {'id': 'movie1', 'title': 'Movie 1'}, 'similarity': 0.9, 'rank': 1}
        ]

        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'find some good action movies'}),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        
        # Verify get_now_showing_ids was called
        mock_filter_ids.assert_called_once()
        
        # Verify search_similar_movies was called with filter_ids
        mock_search.assert_called_once_with('find some good action movies', top_k=10, filter_ids=['movie1'])
        
        # When LLM keys are missing, it returns top 5 from results (which is 1 here)
        self.assertEqual(len(data['recommendations']), 1)
        self.assertEqual(data['recommendations'][0]['id'], 'movie1')
        self.assertEqual(data['source'], 'retrieval_only')

    @patch('movie_vector_service.get_now_showing_ids')
    @patch('movie_vector_service.get_popular_movies')
    @patch('movie_vector_service.classify_query_intent')
    def test_recommend_no_showtimes_today(self, mock_classify, mock_popular, mock_filter_ids):
        # Mock intent
        mock_classify.return_value = ('movie_recommendation', 'en')
        
        # Mock no showtimes
        mock_filter_ids.return_value = []
        
        # Mock popular movies
        mock_popular.return_value = [{'id': 'popular1', 'title': 'Popular Movie'}]

        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'action movies'}),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        
        self.assertEqual(data['source'], 'no_showtimes_today')
        self.assertEqual(len(data['recommendations']), 1)
        self.assertEqual(data['recommendations'][0]['id'], 'popular1')

if __name__ == '__main__':
    unittest.main()
