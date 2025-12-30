import unittest
from unittest.mock import patch, mock_open
import json
import os
import sys

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from generate_report import generate_report

class TestReportGenerator(unittest.TestCase):
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps([
        {
            "category": "Test",
            "prompt": "Hello",
            "evaluation": {"groundedness": 5, "safety": 5, "helpfulness": 5, "explanation": "Good"}
        }
    ]))
    @patch('os.path.exists', return_value=True)
    def test_generate_report(self, mock_exists, mock_file):
        output_file = 'test_report.md'
        generate_report(results_path='fake_results.json', output_path=output_file)
        
        # Check if open was called to write the report
        mock_file.assert_any_call(output_file, 'w', encoding='utf-8')

if __name__ == '__main__':
    unittest.main()
