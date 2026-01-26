#!/usr/bin/env python3
import requests
import json
import time

url = "https://edupex-backend.onrender.com/api/users/evaluation-questions/5"
print(f"Checking: {url}")
print("Waiting for response (Render may be restarting)...")

try:
    response = requests.get(url, timeout=15)
    print(f"Status Code: {response.status_code}")

    data = response.json()

    # Check first math question
    if data.get('matematica') and len(data['matematica']) > 0:
        first_math_q = data['matematica'][0]
        question_text = first_math_q.get('question', 'Unknown')

        # Check if it's still placeholder
        if 'Clasa a' in question_text and 'ntrebare' in question_text:
            print("❌ Still showing PLACEHOLDER questions")
            print(f"   Question: {question_text}")
            print("\n   Render deployment still in progress or hasn't pulled new code")
        else:
            print("✅ NOW SHOWING REAL CURRICULUM QUESTIONS!")
            print(f"   Question: {question_text}")
            print(f"\n   Full response preview:")
            print(f"   - Math questions: {len(data.get('matematica', []))}")
            print(f"   - Language questions: {len(data.get('limba', []))}")

            # Show options too
            if 'options' in first_math_q:
                print(f"   - Options sample: {first_math_q['options'][:2]}")
    else:
        print("❓ Unexpected response format")
        print(json.dumps(data, indent=2)[:500])

except requests.exceptions.Timeout:
    print("⏳ Request timed out - Render service may be starting up")
    print("   Try again in 30 seconds")
except Exception as e:
    print(f"❌ Error: {e}")
    print("   API may be temporarily unavailable")

