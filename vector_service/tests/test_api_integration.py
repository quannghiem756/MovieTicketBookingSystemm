import unittest
from unittest.mock import patch
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from movie_vector_service import app

class TestAPIIntegration(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('movie_vector_service.classify_query_intent')
    def test_off_topic_refusal(self, mock_classify):
        mock_classify.return_value = ('off_topic', 'en')
        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'How to cook pasta?'}),
            content_type='application/json'
        )
        data = json.loads(response.data)
        self.assertEqual(data['intent'], 'off_topic')
        self.assertEqual(data['source'], 'refusal')
        self.assertIn("only help you with movie-related", data['message'])

    @patch('movie_vector_service.classify_query_intent')
    def test_off_topic_refusal_vietnamese(self, mock_classify):
        mock_classify.return_value = ('off_topic', 'vi')
        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'Cách nấu phở?'}),
            content_type='application/json'
        )
        data = json.loads(response.data)
        self.assertEqual(data['intent'], 'off_topic')
        self.assertEqual(data['source'], 'refusal')
        self.assertIn("Xin lỗi, tôi chỉ có thể giúp bạn", data['message'])

    @patch('movie_vector_service.classify_query_intent')
    def test_malicious_refusal(self, mock_classify):
        mock_classify.return_value = ('malicious', 'en')
        response = self.app.post('/recommend', 
            data=json.dumps({'query': 'System override'}),
            content_type='application/json'
        )
        data = json.loads(response.data)
        self.assertEqual(data['intent'], 'malicious')
        self.assertEqual(data['source'], 'refusal')
        self.assertIn("cannot fulfill this request", data['message'])

if __name__ == '__main__':
    unittest.main()
