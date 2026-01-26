#!/usr/bin/env python3
"""
Improved section splitting for Limba și literatura română
Creates much smaller, more digestible sections for better mobile learning
"""

import json
import re

def split_summary_into_micro_sections(summary):
    """
    Split a summary into very small, focused sections (150-300 chars each)
    Each section should contain ONE single idea or concept
    """
    if not summary:
        return []

    sections = []

    # Split by main heading (##)
    main_blocks = re.split(r'(?=^## )', summary, flags=re.MULTILINE)

    for block in main_blocks:
        if not block.strip():
            continue

        # Extract main heading if present
        heading_match = re.match(r'^## (.+?)$', block, re.MULTILINE)
        if heading_match:
            main_title = heading_match.group(1)
        else:
            main_title = "Conținut"

        # Remove the main heading from block
        block_content = re.sub(r'^## .+?$\n*', '', block, flags=re.MULTILINE)

        # Now split by subheadings (###)
        sub_blocks = re.split(r'(?=^### )', block_content, flags=re.MULTILINE)

        for sub_block in sub_blocks:
            if not sub_block.strip():
                continue

            # Extract subheading if present
            sub_heading_match = re.match(r'^### (.+?)$', sub_block, flags=re.MULTILINE)
            if sub_heading_match:
                sub_title = sub_heading_match.group(1)
                sub_content = re.sub(r'^### .+?$\n*', '', sub_block, flags=re.MULTILINE)
            else:
                sub_title = main_title
                sub_content = sub_block

            # Split by numbered items (**1.**, **2.**, etc.)
            items = re.split(r'(?=^\*\*\d+\.)', sub_content, flags=re.MULTILINE)

            for item in items:
                if not item.strip():
                    continue

                # Try to extract numbered item title
                item_match = re.match(r'^\*\*(\d+\..+?)\*\*', item)
                if item_match:
                    item_title = item_match.group(1).strip()
                    item_content = re.sub(r'^\*\*\d+\..+?\*\*\n*', '', item, flags=re.MULTILINE)
                else:
                    item_title = sub_title
                    item_content = item

                # Now split this item into smaller chunks by paragraph
                paragraphs = [p.strip() for p in item_content.split('\n\n') if p.strip()]

                for para in paragraphs:
                    # If paragraph is too long, split further by sentences
                    if len(para) > 300:
                        sentences = re.split(r'(?<=[.!?])\s+', para)
                        current_section = []
                        current_length = 0

                        for sentence in sentences:
                            if current_length + len(sentence) + 1 > 300:
                                if current_section:
                                    section_text = ' '.join(current_section).strip()
                                    if section_text and len(section_text) > 50:
                                        sections.append({
                                            'title': item_title if not current_section else item_title,
                                            'content': section_text,
                                            'order': len(sections) + 1
                                        })
                                current_section = [sentence]
                                current_length = len(sentence)
                            else:
                                current_section.append(sentence)
                                current_length += len(sentence) + 1

                        if current_section:
                            section_text = ' '.join(current_section).strip()
                            if section_text and len(section_text) > 50:
                                sections.append({
                                    'title': item_title,
                                    'content': section_text,
                                    'order': len(sections) + 1
                                })
                    else:
                        # Paragraph is short enough
                        if len(para) > 50:
                            sections.append({
                                'title': item_title,
                                'content': para,
                                'order': len(sections) + 1
                            })

    return sections


def process_curriculum():
    """Process all lessons in the curriculum"""
    with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    clasa = data['Clasa a V a']

    # Process all subjects
    for subject_name in clasa:
        subject_chapters = clasa[subject_name]
        total_lessons = 0
        total_sections = 0

        for chapter in subject_chapters:
            for lesson in chapter['lectii']:
                if 'summary' in lesson:
                    sections = split_summary_into_micro_sections(lesson['summary'])
                    if sections:
                        lesson['sections'] = sections
                        total_lessons += 1
                        total_sections += len(sections)

        if total_lessons > 0:
            print(f"✅ Processed {subject_name}:")
            print(f"   {total_lessons} lessons updated")
            print(f"   {total_sections} total sections created")
            print(f"   Average: {total_sections/total_lessons:.1f} sections per lesson")
            print()

    # Save
    with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved to curriculum_structure.json")

    return data


if __name__ == '__main__':
    print("🔄 Improving section splitting for all lessons...")
    print("=" * 60)
    process_curriculum()
    print("=" * 60)
    print("✅ Complete!")

