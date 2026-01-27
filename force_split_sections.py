#!/usr/bin/env python3
"""Force split Matematica lessons into sections"""

import json
import re

# Load curriculum
with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

math_lessons = curriculum.get('Clasa a V a', {}).get('Matematica', [])

for lesson in math_lessons:
    # Check if already has sections, or only has old structure
    if 'summary' in lesson and ('sections' not in lesson or not lesson['sections']):
        text = lesson['summary']

        # Split into chunks of ~400-600 characters
        max_chunk = 500
        lines = text.split('\n')

        sections = []
        current_section = ""

        for line in lines:
            if len(current_section) + len(line) < max_chunk:
                current_section += line + "\n"
            else:
                if current_section.strip():
                    sections.append(current_section.strip())
                current_section = line + "\n"

        if current_section.strip():
            sections.append(current_section.strip())

        # Ensure at least 2 sections for variety
        if len(sections) < 2:
            # Split in middle
            half = len(text) // 2
            # Find nearest newline
            for i in range(half - 50, half + 50):
                if text[i] == '\n':
                    sections = [text[:i].strip(), text[i:].strip()]
                    break

        # Create sections array
        lesson['sections'] = [
            {
                'order': idx + 1,
                'title': f'Partea {idx + 1}',
                'content': section
            }
            for idx, section in enumerate(sections)
        ]

# Save
with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
    json.dump(curriculum, f, ensure_ascii=False, indent=2)

print("✅ Done! Sections added to all Matematica lessons")

# Verify
with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
    verify = json.load(f)

math_verify = verify.get('Clasa a V a', {}).get('Matematica', [])
for idx, lesson in enumerate(math_verify[:3]):
    print(f"\nLesson {idx + 1}:")
    print(f"  Sections: {len(lesson.get('sections', []))}")

