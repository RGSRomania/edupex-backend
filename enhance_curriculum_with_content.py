#!/usr/bin/env python3
"""
Enhance curriculum with extracted manual content
Maps batch content properly and creates rich lesson descriptions
"""

import json
from pathlib import Path
from typing import Dict, List

def enhance_curriculum_with_batches(batch_dir: str, grade: str, subject: str):
    """Enhance curriculum by extracting content from batches"""

    # Load curriculum
    with open('curriculum_structure.json', 'r') as f:
        curriculum = json.load(f)

    # Ensure structure exists
    if grade not in curriculum:
        curriculum[grade] = {}
    if subject not in curriculum[grade]:
        curriculum[grade][subject] = []

    # Load all batches and collect content
    batch_path = Path(batch_dir)
    batch_files = sorted(batch_path.glob("batch_*.json"))

    all_content = []
    all_lessons = []

    print(f"\n📖 Loading content from {len(batch_files)} batch files...")

    for batch_file in batch_files:
        with open(batch_file, 'r') as f:
            batch = json.load(f)

        # Extract text content
        for section in batch.get('sections', []):
            if section.get('text'):
                all_content.append({
                    'page': section.get('page'),
                    'text': section['text'],
                    'tables': section.get('tables_count', 0)
                })

            # Collect lessons
            if section.get('lessons'):
                all_lessons.extend(section['lessons'])

    print(f"   ✅ Loaded {len(all_content)} content sections")
    print(f"   ✅ Found {len(all_lessons)} lesson references")

    # Create enhanced lessons with content
    lessons_dict = {}

    # Group content by lessons (approximately)
    content_per_lesson = len(all_content) // max(len(all_lessons), 1)

    for lesson_idx, lesson_ref in enumerate(all_lessons):
        lesson_num = lesson_ref.get('number', lesson_idx + 1)
        lesson_title = lesson_ref.get('title', f'Lesson {lesson_num}')

        # Get content for this lesson
        start_idx = lesson_idx * content_per_lesson
        end_idx = start_idx + content_per_lesson
        lesson_content = all_content[start_idx:end_idx]

        # Build content summary
        summary_text = ""
        for content in lesson_content[:3]:  # First 3 sections
            summary_text += content['text'][:200] + "\n\n"

        # Create lesson entry
        lesson_data = {
            'lectia': lesson_num,
            'titlu': lesson_title,
            'content': [{
                'text': summary_text.strip(),
                'full_length': len(summary_text)
            }],
            'images': [],
            'questions': [],
            'sections': [
                {
                    'title': f'Section {i+1}',
                    'content': content['text']
                }
                for i, content in enumerate(lesson_content)
            ]
        }

        lessons_dict[lesson_num] = lesson_data

    # Update curriculum
    enhanced_lessons = []
    for lesson_num in sorted(lessons_dict.keys()):
        enhanced_lessons.append(lessons_dict[lesson_num])

    curriculum[grade][subject] = enhanced_lessons

    # Save
    with open('curriculum_structure.json', 'w') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Enhanced curriculum with {len(enhanced_lessons)} lessons")
    return len(enhanced_lessons)

if __name__ == "__main__":
    print("\n" + "="*80)
    print("STEP 4: ENHANCE CURRICULUM WITH MANUAL CONTENT")
    print("="*80)

    count = enhance_curriculum_with_batches(
        'matematica_v5_manual',
        'Clasa a V a',
        'Matematica'
    )

    print(f"\n✅ Curriculum enhanced with {count} lessons")
    print("="*80)

