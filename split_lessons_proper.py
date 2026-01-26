#!/usr/bin/env python3
"""Split each Matematica lesson into 4-6 readable parts"""

import json
import textwrap

with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

math = data['Clasa a V a']['Matematica']

def smart_split_content(content, target_parts=4):
    """Split content into roughly equal, readable parts"""

    lines = content.split('\n')
    lines = [l.strip() for l in lines if l.strip()]

    if len(lines) < target_parts:
        target_parts = max(2, len(lines) // 10)  # At least 2 parts, or 10 lines per part

    lines_per_part = len(lines) // target_parts

    parts = []
    for i in range(target_parts):
        start_idx = i * lines_per_part
        if i == target_parts - 1:
            # Last part gets all remaining lines
            part_lines = lines[start_idx:]
        else:
            part_lines = lines[start_idx:start_idx + lines_per_part]

        if part_lines:
            parts.append('\n'.join(part_lines))

    return parts

# Process all lessons
for lesson_idx, lesson in enumerate(math):
    if lesson.get('sections') and len(lesson['sections']) == 1:
        # This lesson has only 1 section, split it into more parts
        original_content = lesson['sections'][0].get('content', '')

        if len(original_content) > 600:  # Only split if substantial
            # Determine number of parts based on content length
            num_parts = min(6, max(3, len(original_content) // 400))
            parts = smart_split_content(original_content, target_parts=num_parts)

            # Create new sections array
            lesson['sections'] = [
                {
                    'order': i + 1,
                    'title': f'Partea {i + 1}',
                    'content': part
                }
                for i, part in enumerate(parts)
            ]

            print(f"✅ Lesson {lesson_idx + 1}: Split into {len(parts)} parts ({len(original_content)} chars)")
        else:
            # Keep as is if too short
            print(f"⏭️  Lesson {lesson_idx + 1}: Too short, kept as is")

# Save updated curriculum
with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n✅ All lessons updated!")
print("\nNow:")
print("1. Go to your browser (http://localhost:3000)")
print("2. Hard refresh (Cmd+Shift+R)")
print("3. Click a lesson")
print("4. You should see 3-6 parts instead of just 2!")

