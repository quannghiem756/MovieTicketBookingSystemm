import json
import requests
import os
import logging
from evaluator import ResponseEvaluator
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestRunner:
    def __init__(self, api_url="http://localhost:5001/recommend", cases_path=None):
        self.api_url = api_url
        self.cases_path = cases_path or os.path.join(os.path.dirname(__file__), 'tests', 'edge_cases.json')
        self.results_path = os.path.join(os.path.dirname(__file__), 'tests', 'test_results.json')
        self.evaluator = None

    def load_cases(self):
        with open(self.cases_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def run_all(self, evaluate=False):
        cases = self.load_cases()
        results = []
        
        if evaluate:
            self.evaluator = ResponseEvaluator()

        for case in cases:
            logger.info(f"Running test case: {case['category']} - {case['prompt']}")
            try:
                response = requests.post(self.api_url, json={"query": case['prompt']}, timeout=30)
                response.raise_for_status()
                data = response.json()
                
                result = {
                    "category": case['category'],
                    "prompt": case['prompt'],
                    "expected_behavior": case['expected_behavior'],
                    "response": data,
                    "timestamp": datetime.now().isoformat()
                }

                if evaluate and self.evaluator:
                    # Construct context string for the judge
                    context = ""
                    if 'recommendations' in data:
                        context = json.dumps(data['recommendations'][:3]) # Top 3 for context
                    
                    # We need the actual text response from the chatbot, 
                    # but the /recommend endpoint currently returns a list of movies.
                    # Wait, looking at movie_vector_service.py, /recommend returns a JSON with 'recommendations' list.
                    # It doesn't seem to return a natural language string.
                    # Actually, for 'no_matches' and other fallbacks, it returns a 'message' field.
                    
                    chat_text = data.get('message', "")
                    if not chat_text and data.get('recommendations'):
                        chat_text = f"I recommend: {', '.join([m.get('title', 'Unknown') for m in data['recommendations']])}"
                    
                    evaluation = self.evaluator.evaluate(case['prompt'], chat_text, context)
                    result['evaluation'] = evaluation

                results.append(result)
            except Exception as e:
                logger.error(f"Error running case {case['category']}: {e}")
                results.append({
                    "category": case['category'],
                    "prompt": case['prompt'],
                    "error": str(e)
                })

        with open(self.results_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        
        return results

if __name__ == "__main__":
    import dotenv
    dotenv.load_dotenv()
    runner = TestRunner()
    # Enable evaluation for Phase 3
    runner.run_all(evaluate=True)
    print(f"Results saved to {runner.results_path}")
