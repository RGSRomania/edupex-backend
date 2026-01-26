#!/usr/bin/env python3
"""
Remove all sections from lessons and prepare for re-splitting with new algorithm
"""

import json

def clear_sections(curriculum_data):
    """Remove sections from all lessons"""
    lessons_cleared = 0

    for class_name, class_data in curriculum_data.items():
        if not isinstance(class_data, dict):
            continue

        for subject_name, chapters in class_data.items():
            if not isinstance(chapters, list):
                continue

            for chapter in chapters:
                if not isinstance(chapter, dict) or 'lectii' not in chapter:
                    continue

                for lesson in chapter['lectii']:
                    if isinstance(lesson, dict) and 'sections' in lesson:
                        del lesson['sections']
                        lessons_cleared += 1

    return lessons_cleared

# Load curriculum
with open('/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json', 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

print("Clearing old sections...")
cleared = clear_sections(curriculum)
print(f"✅ Cleared sections from {cleared} lessons")

# Save
with open('/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json', 'w', encoding='utf-8') as f:
    json.dump(curriculum, f, ensure_ascii=False, indent=2)

print("✅ Ready for re-processing with new algorithm")

