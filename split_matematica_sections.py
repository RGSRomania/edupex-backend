#!/usr/bin/env python3
"""
Split Matematica lesson summaries into sections
This makes long lessons more readable by breaking them into parts
"""

import json
import re

def split_text_into_sections(text, max_length=400):
    """
    Split text into sections of approximately max_length characters
    Try to split at logical boundaries (paragraphs, sentences)
    """
    if not text or len(text) < max_length:
        return [text]

    # Split by double newlines first (paragraphs)
    paragraphs = text.split('\n\n')
    sections = []
    current_section = ""

    for para in paragraphs:
        if len(current_section) + len(para) < max_length:
            current_section += para + "\n\n"
        else:
            if current_section:
                sections.append(current_section.strip())
            current_section = para + "\n\n"

    if current_section:
        sections.append(current_section.strip())

    # If still too large, split by sentences
    final_sections = []
    for section in sections:
        if len(section) > max_length:
            # Split by period followed by space
            sentences = re.split(r'(?<=[.!?])\s+', section)
            current = ""
            for sentence in sentences:
                if len(current) + len(sentence) < max_length:
                    current += " " + sentence if current else sentence
                else:
                    if current:
                        final_sections.append(current)
                    current = sentence
            if current:
                final_sections.append(current)
        else:
            final_sections.append(section)

    return final_sections if final_sections else [text]

def add_sections_to_lessons(curriculum):
    """
    Add sections array to each Matematica lesson
    """
    math_lessons = curriculum.get('Clasa a V a', {}).get('Matematica', [])

    for lesson_idx, lesson in enumerate(math_lessons):
        if not lesson.get('sections') and lesson.get('summary'):
            # Split summary into sections
            sections_list = split_text_into_sections(lesson['summary'])

            # Create sections array
            lesson['sections'] = []
            for section_idx, section_text in enumerate(sections_list):
                lesson['sections'].append({
                    'order': section_idx + 1,
                    'title': f'Partea {section_idx + 1}',
                    'content': section_text
                })

            print(f"✅ Lesson {lesson_idx + 1}: {lesson.get('titlu', 'Unknown')[:50]}")
            print(f"   Split into {len(sections_list)} sections")

    return curriculum

if __name__ == "__main__":
    print("╔════════════════════════════════════════════════════════════╗")
    print("║  📚 Splitting Matematica Lessons into Sections            ║")
    print("╚════════════════════════════════════════════════════════════╝\n")

    # Load curriculum
    with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    print(f"📖 Loading curriculum...")
    math_count = len(curriculum.get('Clasa a V a', {}).get('Matematica', []))
    print(f"   Found {math_count} lessons\n")

    # Add sections
    curriculum = add_sections_to_lessons(curriculum)

    # Save updated curriculum
    with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    print("\n✅ Curriculum updated with sections!")
    print("\n📝 Next steps:")
    print("   1. Restart frontend (Ctrl+C and npm start)")
    print("   2. Refresh browser (Cmd+Shift+R)")
    print("   3. Test lessons - they should now have multiple parts!")

