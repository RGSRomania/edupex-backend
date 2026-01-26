#!/usr/bin/env python3
"""
Map extracted PDF content to curriculum lessons
"""

import json
import os
from pathlib import Path

def load_extracted_data():
    """Load the extracted PDF data"""
    with open('extracted_matematica_data.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def load_curriculum():
    """Load the current curriculum"""
    with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def organize_content_by_lessons(extracted_data):
    """
    Organize extracted content into lesson chunks
    Split content across 13 lessons evenly
    """
    all_content = extracted_data['content']
    total_items = len(all_content)
    num_lessons = 13

    # Distribute content across lessons
    items_per_lesson = total_items // num_lessons
    remainder = total_items % num_lessons

    lessons_content = {}
    current_idx = 0

    print(f"📊 Distributing {total_items} content items across {num_lessons} lessons")
    print(f"   ~{items_per_lesson} items per lesson")
    print()

    for lesson_num in range(1, num_lessons + 1):
        # Calculate how many items this lesson gets
        items_for_this_lesson = items_per_lesson + (1 if lesson_num <= remainder else 0)

        lesson_items = []
        for _ in range(items_for_this_lesson):
            if current_idx < len(all_content):
                lesson_items.append(all_content[current_idx])
                current_idx += 1

        lessons_content[lesson_num] = {
            'items': lesson_items,
            'text_blocks': [item for item in lesson_items if item.get('type') == 'text'],
            'images': [item for item in lesson_items if item.get('type') == 'image'],
            'summary': build_summary(lesson_items)
        }

        print(f"Lesson {lesson_num}: {len(lesson_items)} items ({len(lessons_content[lesson_num]['text_blocks'])} text blocks, {len(lessons_content[lesson_num]['images'])} images)")

    return lessons_content

def build_summary(items):
    """Build a summary from text blocks"""
    text_blocks = [item['content'] for item in items if item.get('type') == 'text']

    if not text_blocks:
        return ""

    # Combine and clean text
    full_text = '\n'.join(text_blocks)

    # Remove excessive whitespace
    lines = full_text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]

    # Limit to first 2000 characters for summary
    summary = '\n'.join(lines[:100])  # First 100 lines
    if len(summary) > 3000:
        summary = summary[:3000] + "..."

    return summary

def update_curriculum_with_content(curriculum, lessons_content):
    """
    Update curriculum with extracted content
    """
    math_lessons = curriculum['Clasa a V a']['Matematica']

    print("\n" + "="*60)
    print("Updating curriculum with extracted content...")
    print("="*60 + "\n")

    for idx, lesson_data in enumerate(lessons_content.values(), 1):
        if idx <= len(math_lessons):
            lesson = math_lessons[idx - 1]

            # Update summary
            lesson['summary'] = lesson_data['summary']

            # Add images reference if not already there
            if 'images' not in lesson:
                lesson['images'] = []

            for img_item in lesson_data['images']:
                if img_item['filename'] not in [img.get('filename', '') for img in lesson.get('images', [])]:
                    lesson['images'].append({
                        'filename': img_item['filename'],
                        'page': img_item['page']
                    })

            print(f"✅ Lesson {idx}: {lesson.get('titlu', 'Unknown')[:60]}...")
            print(f"   - Summary: {len(lesson_data['summary'])} characters")
            print(f"   - Images: {len(lesson_data['images'])}")

    return curriculum

if __name__ == "__main__":
    print("╔════════════════════════════════════════════════════════════╗")
    print("║  📚 Mapping Content to Curriculum Lessons 📚               ║")
    print("╚════════════════════════════════════════════════════════════╝\n")

    # Load data
    extracted = load_extracted_data()
    curriculum = load_curriculum()

    print(f"✅ Loaded extracted data: {len(extracted['content'])} items")
    print(f"✅ Loaded curriculum with {len(curriculum['Clasa a V a']['Matematica'])} lessons\n")

    # Organize content
    lessons_content = organize_content_by_lessons(extracted)

    # Update curriculum
    updated_curriculum = update_curriculum_with_content(curriculum, lessons_content)

    # Save updated curriculum
    output_file = 'curriculum_structure_updated.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(updated_curriculum, f, ensure_ascii=False, indent=2)

    print(f"\n💾 Updated curriculum saved to: {output_file}")
    print("\n✅ Mapping complete!")
    print("\n📋 Next steps:")
    print("   1. Review curriculum_structure_updated.json")
    print("   2. Verify content looks good")
    print("   3. Move extracted_images folder to frontend/public/")
    print("   4. Replace curriculum_structure.json with updated version")
    print("   5. Restart frontend server")

