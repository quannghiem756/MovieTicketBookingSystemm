import unittest
import json
import os

class TestEdgeCasesSchema(unittest.TestCase):
    def test_json_exists(self):
        file_path = os.path.join(os.path.dirname(__file__), 'edge_cases.json')
        self.assertTrue(os.path.exists(file_path), f"{file_path} does not exist")

    def test_json_schema(self):
        file_path = os.path.join(os.path.dirname(__file__), 'edge_cases.json')
        if not os.path.exists(file_path):
            self.skipTest("edge_cases.json not found")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.assertIsInstance(data, list, "Data should be a list of edge cases")
        for i, entry in enumerate(data):
            self.assertIn('category', entry, f"Entry {i} missing 'category'")
            self.assertIn('prompt', entry, f"Entry {i} missing 'prompt'")
            self.assertIn('expected_behavior', entry, f"Entry {i} missing 'expected_behavior'")

if __name__ == '__main__':
    unittest.main()
