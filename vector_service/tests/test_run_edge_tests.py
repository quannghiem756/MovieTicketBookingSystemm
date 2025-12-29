import unittest
from unittest.mock import MagicMock, patch, mock_open
import json
import os
import sys

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from run_edge_tests import TestRunner

class TestTestRunner(unittest.TestCase):
    def setUp(self):
        self.edge_cases = [
            {"category": "Test", "prompt": "Hello", "expected_behavior": "Reply Hi"}
        ]

    @patch('run_edge_tests.requests.post')
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps([{"category": "Test", "prompt": "Hello", "expected_behavior": "Reply Hi"}]))
    @patch('run_edge_tests.os.path.exists', return_value=True)
    def test_run_tests_basic(self, mock_exists, mock_file, mock_post):
        # Mock API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"recommendations": [], "intent": "movie_recommendation"}
        mock_post.return_value = mock_response

        runner = TestRunner(api_url="http://fake-api/recommend")
        results = runner.run_all()

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['prompt'], "Hello")
        self.assertEqual(results[0]['response']['intent'], "movie_recommendation")

    @patch('run_edge_tests.requests.post')
    @patch('run_edge_tests.ResponseEvaluator')
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps([{"category": "Test", "prompt": "Hello", "expected_behavior": "Reply Hi"}]))
    @patch('run_edge_tests.os.path.exists', return_value=True)
    def test_run_tests_with_evaluation(self, mock_exists, mock_file, mock_evaluator, mock_post):
        # Mock API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"recommendations": [], "intent": "movie_recommendation"}
        mock_post.return_value = mock_response

        # Mock Evaluator
        mock_eval_instance = mock_evaluator.return_value
        mock_eval_instance.evaluate.return_value = {"groundedness": 5}

        runner = TestRunner(api_url="http://fake-api/recommend")
        results = runner.run_all(evaluate=True)

        self.assertEqual(len(results), 1)
        self.assertIn('evaluation', results[0])
        self.assertEqual(results[0]['evaluation']['groundedness'], 5)

if __name__ == '__main__':
    unittest.main()
