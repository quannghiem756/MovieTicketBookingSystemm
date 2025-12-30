import json
import os
from statistics import mean

def generate_report(results_path='tests/test_results.json', output_path='edge_case_report.md'):
    if not os.path.exists(results_path):
        print(f"Error: {results_path} not found.")
        return

    with open(results_path, 'r', encoding='utf-8') as f:
        results = json.load(f)

    report = ["# Recommendation Chatbot Edge Case Test Report\n"]
    
    # Summary Table
    report.append("## Executive Summary\n")
    
    categories = {}
    total_cases = len(results)
    successful_calls = 0
    errors = 0
    
    for res in results:
        cat = res['category']
        if cat not in categories:
            categories[cat] = {"scores": [], "count": 0, "errors": 0}
        
        categories[cat]["count"] += 1
        if 'error' in res:
            categories[cat]["errors"] += 1
            errors += 1
        else:
            successful_calls += 1
            if 'evaluation' in res:
                eval_data = res['evaluation']
                # Average of all metrics
                score = mean([
                    eval_data.get('groundedness', 0),
                    eval_data.get('safety', 0),
                    eval_data.get('helpfulness', 0),
                    eval_data.get('consistency', 0),
                    eval_data.get('relevance', 0)
                ])
                categories[cat]["scores"].append(score)

    report.append(f"- **Total Test Cases:** {total_cases}")
    report.append(f"- **Successful API Calls:** {successful_calls}")
    report.append(f"- **Failed/Timed Out:** {errors}")
    report.append(f"- **Average Performance Score:** {mean([mean(c['scores']) for c in categories.values() if c['scores']]) :.2f}/5.0\n")

    report.append("### Category Breakdown\n")
    report.append("| Category | Count | Errors | Avg Score |")
    report.append("| :--- | :---: | :---: | :---: |")
    for cat, data in categories.items():
        avg = mean(data['scores']) if data['scores'] else 0
        report.append(f"| {cat} | {data['count']} | {data['errors']} | {avg:.2f}/5 |")
    
    report.append("\n## Detailed Findings\n")
    
    for res in results:
        report.append(f"### Category: {res['category']}")
        report.append(f"**Prompt:** `{res['prompt']}`")
        if 'error' in res:
            report.append(f"**Result:** ❌ ERROR: {res['error']}\n")
        else:
            eval_data = res.get('evaluation', {})
            report.append(f"**Expected Behavior:** {res.get('expected_behavior', 'N/A')}")
            report.append(f"**Groundedness:** {eval_data.get('groundedness', 'N/A')}/5")
            report.append(f"**Safety:** {eval_data.get('safety', 'N/A')}/5")
            report.append(f"**Helpfulness:** {eval_data.get('helpfulness', 'N/A')}/5")
            report.append(f"**Explanation:** {eval_data.get('explanation', 'N/A')}\n")
            
            # Highlight hallucinations
            if eval_data.get('groundedness', 5) < 3:
                report.append("> ⚠️ **Hallucination Alert:** Low groundedness score detected.")
            
            # Highlight safety issues
            if eval_data.get('safety', 5) < 3:
                report.append("> 🚫 **Safety Alert:** Potential safety or persona violation.")
        
        report.append("---\n")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(report))
    
    print(f"Report generated at {output_path}")

if __name__ == "__main__":
    generate_report()
