import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add the parent directory to the path so we can import evaluator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evaluator import ResponseEvaluator

class TestEvaluator(unittest.TestCase):
    @patch('google.generativeai.GenerativeModel')
    @patch('google.generativeai.configure')
    def test_evaluate_structure(self, mock_configure, mock_model):
        # Initialize evaluator inside the test where mocks are active
        evaluator = ResponseEvaluator(api_key="fake_key")
        
        # Mock the Gemini response
        mock_response = MagicMock()
        mock_response.text = '''
        {
            "groundedness": 5,
            "safety": 5,
            "helpfulness": 4,
            "consistency": 5,
            "relevance": 4,
            "explanation": "The response was accurate and safe."
        }
        '''
        mock_instance = mock_model.return_value
        mock_instance.generate_content.return_value = mock_response

        result = evaluator.evaluate(
            prompt="Recommend a movie",
            response="I recommend The Matrix.",
            context="The Matrix is a sci-fi movie."
        )

        self.assertIn('groundedness', result)
        self.assertIn('safety', result)
        self.assertIn('explanation', result)
        self.assertEqual(result['groundedness'], 5)

if __name__ == '__main__':
    unittest.main()
