#!/usr/bin/env python3
import urllib.request
import json
import sys

url = "https://edupex-backend.onrender.com/api/users/evaluation-questions/5"
print(f"Checking: {url}")

try:
    with urllib.request.urlopen(url, timeout=15) as response:
        data = json.loads(response.read().decode('utf-8'))

        # Check first math question
        if data.get('matematica') and len(data['matematica']) > 0:
            first_math_q = data['matematica'][0]
            question_text = first_math_q.get('question', 'Unknown')

            # Check if it's still placeholder
            if 'Clasa a' in question_text and 'ntrebare' in question_text:
                print("STATUS: PLACEHOLDER")
                print(f"Question: {question_text}")
                print("Note: Render deployment may still be in progress")
            else:
                print("STATUS: REAL CURRICULUM")
                print(f"Question: {question_text}")
                print(f"Math questions: {len(data.get('matematica', []))}")
                print(f"Language questions: {len(data.get('limba', []))}")
        else:
            print("STATUS: UNEXPECTED")
            print(json.dumps(data)[:200])

except Exception as e:
    print(f"STATUS: ERROR")
    print(f"Error: {str(e)}")
    print("Note: Render may be restarting/building")
    sys.exit(1)

