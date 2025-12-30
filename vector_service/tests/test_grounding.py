import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import json

# Add parent directory to path to import movie_vector_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from movie_vector_service import app

class TestGrounding(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('movie_vector_service.classify_query_intent')
    @patch('movie_vector_service.search_similar_movies')
    @patch('movie_vector_service.ChatOpenAI')
    def test_hallucination_refusal(self, mock_llm_cls, mock_search, mock_classify):
        """
        Test that if the LLM tries to recommend a movie not in the context, 
        the system should ideally refuse or we catch it.
        We expect the LLM to be instructed to only use provided context.
        """
        mock_classify.return_value = ('movie_recommendation', 'en')
        
        # Mock search results (Context)
        mock_search.return_value = [
            {'movie': {'id': '1', 'title': 'The Matrix', 'genre': ['Action'], 'synopsis': 'A computer hacker...'}}
        ]
        
        # Mock LLM trying to recommend something NOT in the context
        mock_chain = MagicMock()
        mock_llm_cls.return_value.pipe.return_value = mock_chain # Actually it's prompt | llm
        
        # Since I'm using PromptTemplate | llm in the code, I need to mock the chain correctly
        # In movie_vector_service.py: chain = prompt | llm
        
        # Let's mock the actual chain execution
        with patch('movie_vector_service.PromptTemplate') as mock_prompt_cls:
            mock_prompt = MagicMock()
            mock_prompt_cls.return_value = mock_prompt
            mock_chain = MagicMock()
            mock_prompt.__or__.return_value = mock_chain
            
            # LLM returns an ID that is NOT '1'
            mock_chain.invoke.return_value.content = '["999"]'
            
            response = self.app.post('/recommend', 
                data=json.dumps({'query': 'Recommend me a movie'}),
                content_type='application/json'
            )
            data = json.loads(response.data)
            
            # The current implementation falls back to top retrieved if LLM output is empty or filtered
            # But here, if the ID 999 is not found, it should NOT be in the recommendations
            for rec in data['recommendations']:
                self.assertNotEqual(str(rec['id']), '999')
                self.assertEqual(str(rec['id']), '1')

if __name__ == '__main__':
    unittest.main()
