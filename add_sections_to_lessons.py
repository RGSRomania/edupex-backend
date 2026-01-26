#!/usr/bin/env python3
"""
Split lesson summaries into logical sections.
This creates a step-by-step learning experience where students see one concept at a time.
"""

import json
import re

def split_summary_into_sections(summary):
    """
    Split a lesson summary into logical sections based on headings and content structure.
    Each section becomes a separate "page" in the learning flow.

    Returns a list of section dictionaries with 'order', 'title', and 'content'
    """
    if not summary:
        return []

    sections = []
    lines = summary.split('\n')
    current_section = None
    buffer = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check for main heading (##)
        if line.strip().startswith('## '):
            # Save previous section if exists
            if current_section and buffer:
                current_section['content'] = '\n'.join(buffer).strip()
                sections.append(current_section)
                buffer = []

            # Create new section
            title = line.replace('## ', '').strip()
            current_section = {
                'order': len(sections) + 1,
                'title': title,
                'content': ''
            }
            buffer.append(line)

        # Check for sub-heading (###)
        elif line.strip().startswith('### '):
            # If this is a major subsection and we have a lot of content, we might split here
            if buffer and len('\n'.join(buffer)) > 300:
                # Save current section
                if current_section:
                    current_section['content'] = '\n'.join(buffer).strip()
                    sections.append(current_section)
                    buffer = []

                # Create new section from the subsection heading
                subtitle = line.replace('### ', '').strip()
                current_section = {
                    'order': len(sections) + 1,
                    'title': subtitle,
                    'content': ''
                }

            if current_section:
                buffer.append(line)

        else:
            if current_section or buffer:
                buffer.append(line)

        i += 1

    # Save the last section
    if current_section and buffer:
        current_section['content'] = '\n'.join(buffer).strip()
        sections.append(current_section)

    # Clean up empty sections and ensure all have content
    cleaned_sections = []
    for section in sections:
        content = section['content'].strip()
        if content and len(content) > 50:  # Only keep substantial sections
            section['content'] = content
            cleaned_sections.append(section)

    # Renumber sections
    for i, section in enumerate(cleaned_sections):
        section['order'] = i + 1

    return cleaned_sections if cleaned_sections else []


def process_curriculum(curriculum_data):
    """
    Process the entire curriculum and add sections to all lessons.
    """
    classes_updated = 0
    subjects_updated = 0
    chapters_updated = 0
    lessons_updated = 0

    # Iterate through all classes (Clasa a V a, etc.)
    for class_name, class_data in curriculum_data.items():
        if not isinstance(class_data, dict):
            continue

        classes_updated += 1

        # Iterate through all subjects (Matematica, Limba Română, etc.)
        for subject_name, chapters in class_data.items():
            if not isinstance(chapters, list):
                continue

            subjects_updated += 1

            # Iterate through all chapters
            for chapter in chapters:
                if not isinstance(chapter, dict) or 'lectii' not in chapter:
                    continue

                chapters_updated += 1

                # Iterate through all lessons in the chapter
                for lesson in chapter['lectii']:
                    if not isinstance(lesson, dict) or 'summary' not in lesson:
                        continue

                    # Only add sections if they don't already exist
                    if 'sections' not in lesson or not lesson['sections']:
                        summary = lesson['summary']
                        sections = split_summary_into_sections(summary)

                        if sections:
                            lesson['sections'] = sections
                            lessons_updated += 1

    return classes_updated, subjects_updated, chapters_updated, lessons_updated


def main():
    """Main function to process curriculum_structure.json"""

    # Load curriculum
    with open('/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json', 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    print("Processing curriculum...")
    print("=" * 60)

    # Process curriculum
    classes, subjects, chapters, lessons = process_curriculum(curriculum)

    print(f"✅ Classes processed: {classes}")
    print(f"✅ Subjects processed: {subjects}")
    print(f"✅ Chapters processed: {chapters}")
    print(f"✅ Lessons updated with sections: {lessons}")

    # Save updated curriculum
    with open('/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 60)
    print("✅ curriculum_structure.json updated successfully!")
    print("=" * 60)

    # Show example for first lesson
    print("\nExample - First lesson sections:")
    print("-" * 60)

    try:
        clasa_va = curriculum.get('Clasa a V a', {})
        first_subject = list(clasa_va.values())[0][0]  # First chapter of first subject
        first_lesson = first_subject['lectii'][0]

        if 'sections' in first_lesson:
            print(f"Lesson: {first_lesson['name']}")
            print(f"Total sections: {len(first_lesson['sections'])}")
            for section in first_lesson['sections']:
                content_preview = section['content'][:80].replace('\n', ' ') + "..."
                print(f"\n  Part {section['order']}: {section['title']}")
                print(f"  Content: {content_preview}")
    except (KeyError, IndexError, TypeError) as e:
        print(f"Could not display example: {e}")

    print("\n" + "=" * 60)


if __name__ == '__main__':
    main()

