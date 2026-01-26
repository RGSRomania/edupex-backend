#!/usr/bin/env python3
"""
Merge extracted PDF content into the 6-chapter Matematica structure
"""

import json

# Load both files
with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

with open('curriculum_structure_updated.json', 'r', encoding='utf-8') as f:
    extracted = json.load(f)

# Get the data
chapters = curriculum['Clasa a V a']['Matematica']
extracted_lessons = extracted['Clasa a V a']['Matematica']

print("MERGING EXTRACTED CONTENT INTO 6-CHAPTER STRUCTURE")
print("=" * 70)

# Map extracted lessons by title to find matches
extracted_map = {}
for lesson in extracted_lessons:
    title = lesson.get('titlu', '').lower().strip()
    extracted_map[title] = lesson

# Try to match and merge
matches_found = 0
no_match = 0

for chapter_idx, chapter in enumerate(chapters):
    print(f"\nChapter {chapter_idx + 1}: {chapter['name']}")

    for lesson_idx, lesson in enumerate(chapter.get('lectii', [])):
        lesson_title = lesson.get('name', '').lower().strip()

        # Try exact match first
        if lesson_title in extracted_map:
            extracted_lesson = extracted_map[lesson_title]
            lesson['summary'] = extracted_lesson.get('summary', lesson.get('summary', ''))
            lesson['images'] = extracted_lesson.get('images', [])
            lesson['sections'] = extracted_lesson.get('sections', [])
            matches_found += 1
            print(f"  ✅ Lesson {lesson_idx + 1}: {lesson_title[:50]} - MATCHED")
        else:
            # Try partial match (check if extracted title contains lesson name)
            matched = False
            for ext_title, ext_lesson in extracted_map.items():
                if lesson_title in ext_title or ext_title in lesson_title:
                    extracted_lesson = ext_lesson
                    lesson['summary'] = extracted_lesson.get('summary', lesson.get('summary', ''))
                    lesson['images'] = extracted_lesson.get('images', [])
                    lesson['sections'] = extracted_lesson.get('sections', [])
                    matches_found += 1
                    print(f"  ✅ Lesson {lesson_idx + 1}: {lesson_title[:50]} - PARTIAL MATCH")
                    matched = True
                    break

            if not matched:
                no_match += 1
                print(f"  ⏭️  Lesson {lesson_idx + 1}: {lesson_title[:50]} - NO MATCH (kept old summary)")

print("\n" + "=" * 70)
print(f"\nRESULTS:")
print(f"  Matches found: {matches_found}")
print(f"  No matches: {no_match}")
print(f"  Total lessons: {sum(len(ch.get('lectii', [])) for ch in chapters)}")

# Save merged curriculum
with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
    json.dump(curriculum, f, ensure_ascii=False, indent=2)

print(f"\n✅ Merged curriculum saved to curriculum_structure.json")

