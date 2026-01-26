#!/usr/bin/env python3
"""
Merge Matematica template with existing curriculum and apply section splitting
"""

import json
import sys

def load_curriculum(filepath):
    """Load curriculum from JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_curriculum(curriculum, filepath):
    """Save curriculum to JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

def merge_matematica(main_curriculum, matematica_template):
    """Merge Matematica chapters into main curriculum"""
    # Copy Matematica from template
    if "Clasa a V a" in matematica_template:
        if "Clasa a V a" in main_curriculum:
            main_curriculum["Clasa a V a"]["Matematica"] = matematica_template["Clasa a V a"]["Matematica"]
        else:
            main_curriculum["Clasa a V a"] = matematica_template["Clasa a V a"]

    return main_curriculum

def split_summary_into_sections(summary):
    """Split lesson summary into smaller sections"""
    if not summary:
        return []

    sections = []
    lines = summary.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check for main heading (##)
        if line.strip().startswith('## '):
            # Main heading becomes a section
            title = line.replace('## ', '').strip()
            buffer = [line]

            # Collect content until next major heading
            i += 1
            while i < len(lines):
                next_line = lines[i]

                # Stop at next main heading
                if next_line.strip().startswith('## '):
                    break

                buffer.append(next_line)
                i += 1

            # Now split this content into smaller subsections
            content = '\n'.join(buffer).strip()
            subsections = split_by_subheadings(content, title)
            sections.extend(subsections)
            continue

        i += 1

    # Renumber all sections
    for idx, section in enumerate(sections):
        section['order'] = idx + 1

    return sections if sections else []

def split_by_subheadings(content, main_title):
    """Split content by subheadings (###) and numbered items"""
    sections = []
    lines = content.split('\n')
    current_subsection = None
    buffer = []

    for line in lines:
        # Sub-heading (###)
        if line.strip().startswith('### '):
            # Save previous subsection
            if current_subsection and buffer:
                subsection_content = '\n'.join(buffer).strip()
                if len(subsection_content) > 50:
                    current_subsection['content'] = subsection_content
                    sections.append(current_subsection)
                buffer = []

            # Create new subsection
            title = line.replace('### ', '').strip()
            current_subsection = {
                'title': title,
                'content': ''
            }
            buffer.append(line)

        # Numbered items like "**1. Item**"
        elif line.strip() and line.strip().startswith('**') and '. ' in line[:20]:
            # If buffer has content, save it first
            if buffer and current_subsection:
                subsection_content = '\n'.join(buffer).strip()
                if len(subsection_content) > 50:
                    current_subsection['content'] = subsection_content
                    sections.append(current_subsection)
                buffer = []

            # Start new section for this numbered item
            title = line.replace('**', '').replace('**', '').strip()
            current_subsection = {
                'title': title,
                'content': ''
            }
            buffer.append(line)

        else:
            if current_subsection or buffer:
                buffer.append(line)

    # Save last section
    if current_subsection and buffer:
        subsection_content = '\n'.join(buffer).strip()
        if len(subsection_content) > 50:
            current_subsection['content'] = subsection_content
            sections.append(current_subsection)

    # If no subsections were created, create one from main content
    if not sections:
        sections.append({
            'title': main_title,
            'content': content.strip()
        })

    return sections

def add_sections_to_curriculum(curriculum):
    """Add sections to all lessons in the curriculum"""
    lessons_processed = 0

    for class_name, class_data in curriculum.items():
        if not isinstance(class_data, dict):
            continue

        for subject_name, chapters in class_data.items():
            if not isinstance(chapters, list):
                continue

            for chapter in chapters:
                if not isinstance(chapter, dict) or 'lectii' not in chapter:
                    continue

                for lesson in chapter['lectii']:
                    if isinstance(lesson, dict) and 'summary' in lesson:
                        # Only process if sections don't exist or are empty
                        if not lesson.get('sections'):
                            summary = lesson['summary']
                            sections = split_summary_into_sections(summary)
                            if sections:
                                lesson['sections'] = sections
                                lessons_processed += 1

    return curriculum, lessons_processed

def main():
    print("="*70)
    print("Merging Matematica with main curriculum...")
    print("="*70)

    # Load files
    main_path = "/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json"
    template_path = "/Users/mdica/PycharmProjects/EduPex/matematica_clasa_va_template.json"

    print("\n1️⃣  Loading curriculum files...")
    main_curriculum = load_curriculum(main_path)
    matematica_template = load_curriculum(template_path)
    print("   ✅ Loaded main curriculum")
    print("   ✅ Loaded Matematica template")

    # Merge
    print("\n2️⃣  Merging Matematica...")
    merged_curriculum = merge_matematica(main_curriculum, matematica_template)
    print("   ✅ Merged Matematica chapters")

    # Add sections
    print("\n3️⃣  Adding sections to lessons...")
    merged_curriculum, lessons_count = add_sections_to_curriculum(merged_curriculum)
    print(f"   ✅ Added sections to {lessons_count} lessons")

    # Save
    print("\n4️⃣  Saving updated curriculum...")
    save_curriculum(merged_curriculum, main_path)
    print(f"   ✅ Saved to: {main_path}")

    # Verify
    print("\n5️⃣  Verification...")
    if "Matematica" in merged_curriculum.get("Clasa a V a", {}):
        mate_chapters = merged_curriculum["Clasa a V a"]["Matematica"]
        print(f"   ✅ Matematica has {len(mate_chapters)} chapters")

        total_lessons = sum(len(ch.get("lectii", [])) for ch in mate_chapters)
        print(f"   ✅ Total lessons: {total_lessons}")

        # Check first lesson for sections
        if mate_chapters and mate_chapters[0].get("lectii"):
            first_lesson = mate_chapters[0]["lectii"][0]
            sections_count = len(first_lesson.get("sections", []))
            print(f"   ✅ First lesson has {sections_count} sections")

    print("\n" + "="*70)
    print("✅ Merge complete!")
    print("="*70)
    print("\n📌 Next steps:")
    print("   1. Sync to frontend public folder")
    print("   2. Sync to Android assets")
    print("   3. Test in browser: http://localhost:3000")
    print("   4. Extract and enhance content from Manual MATE.doc")

if __name__ == '__main__':
    main()

