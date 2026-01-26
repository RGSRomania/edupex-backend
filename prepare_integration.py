#!/usr/bin/env python3
"""
Matematica Lesson Integration Script
Processes extracted lessons and prepares JSON enhancement data
"""

import json
import re
import os
from pathlib import Path
from typing import Dict, List, Any

def parse_parsed_lessons(file_path):
    """Parse MATEMATICA_PARSED_IMPROVED.txt into structured data"""

    print(f"📖 Reading {file_path}...")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    lessons = []

    # Split by lesson markers
    lesson_pattern = r'LESSON \d+: (.+?)\nPage: (\d+)'
    matches = re.finditer(lesson_pattern, content)

    for match in matches:
        title = match.group(1).strip()
        page = int(match.group(2))

        # Extract content section after this lesson until next lesson
        start_pos = match.end()
        next_match = re.search(r'LESSON \d+:', content[start_pos:])

        if next_match:
            lesson_content = content[start_pos:start_pos + next_match.start()]
        else:
            lesson_content = content[start_pos:]

        # Parse sections
        definitions = extract_section(lesson_content, 'DEFINITIONS')
        examples = extract_section(lesson_content, 'EXAMPLES')
        formulas = extract_section(lesson_content, 'FORMULAS/RULES')
        notes = extract_section(lesson_content, 'NOTES')
        content_lines = extract_section(lesson_content, 'CONTENT')

        lessons.append({
            'title': title,
            'page': page,
            'definitions': definitions,
            'examples': examples,
            'formulas': formulas,
            'notes': notes,
            'content': content_lines
        })

    return lessons

def extract_section(text, section_name):
    """Extract content from a named section"""
    pattern = rf'{section_name}:\n(.*?)(?=\n[A-Z]+:|$)'
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)

    if not match:
        return []

    lines = match.group(1).strip().split('\n')
    return [line.strip() for line in lines if line.strip() and line.strip().startswith('•') or line.strip().startswith('-')]

def create_enriched_summary(lesson_data):
    """Create enriched summary from lesson data"""

    summary_parts = []

    # Add definitions
    if lesson_data['definitions']:
        summary_parts.append("## Definiții\n")
        for defn in lesson_data['definitions'][:2]:  # First 2 definitions
            summary_parts.append(f"- {defn}\n")
        summary_parts.append("\n")

    # Add main content
    if lesson_data['content']:
        summary_parts.append("## Conținut\n")
        for content in lesson_data['content'][:3]:  # First 3 content lines
            summary_parts.append(f"{content}\n\n")

    # Add formulas
    if lesson_data['formulas']:
        summary_parts.append("## Formule și Reguli\n")
        for formula in lesson_data['formulas'][:3]:  # First 3 formulas
            summary_parts.append(f"- {formula}\n")
        summary_parts.append("\n")

    # Add examples
    if lesson_data['examples']:
        summary_parts.append("## Exemple\n")
        for example in lesson_data['examples'][:2]:  # First 2 examples
            summary_parts.append(f"- {example}\n")

    return ''.join(summary_parts)

def match_lessons_to_curriculum(extracted_lessons, curriculum_data):
    """Match extracted lessons to curriculum structure"""

    matches = {}

    # Extract curriculum lesson titles
    clasa = curriculum_data.get('Clasa a V a', {})
    matematica = clasa.get('Matematica', [])

    for chapter in matematica:
        chapter_num = chapter.get('number', '')
        chapter_name = chapter.get('name', '')

        for lesson in chapter.get('lectii', []):
            lesson_num = lesson.get('number', '')
            lesson_name = lesson.get('name', '')

            # Try to match with extracted lesson
            for extracted in extracted_lessons:
                extracted_title = extracted['title'].lower()
                curriculum_title = f"lecția {lesson_num}".lower()

                if curriculum_title in extracted_title or lesson_name.lower() in extracted_title:
                    matches[f"{chapter_num}_{lesson_num}"] = {
                        'chapter': chapter_num,
                        'lesson': lesson_num,
                        'curriculum_name': lesson_name,
                        'extracted_data': extracted,
                        'enriched_summary': create_enriched_summary(extracted)
                    }

    return matches

def generate_integration_report(matches):
    """Generate report of lesson mappings"""

    report = []
    report.append("=" * 80)
    report.append("MATEMATICA LESSON INTEGRATION REPORT")
    report.append("=" * 80)
    report.append("")

    report.append(f"Total matched lessons: {len(matches)}")
    report.append("")

    for key, match_data in sorted(matches.items()):
        chapter = match_data['chapter']
        lesson = match_data['lesson']
        curriculum_name = match_data['curriculum_name']
        extracted_title = match_data['extracted_data']['title']
        page = match_data['extracted_data']['page']

        report.append(f"✅ Chapter {chapter}, Lesson {lesson}")
        report.append(f"   Curriculum: {curriculum_name}")
        report.append(f"   Extracted: {extracted_title}")
        report.append(f"   Page: {page}")
        report.append("")

    report.append("=" * 80)
    report.append(f"Integration ready for {len(matches)} lessons")
    report.append("=" * 80)

    return '\n'.join(report)

def main():
    print("\n" + "=" * 80)
    print("🔧 MATEMATICA LESSON INTEGRATION SCRIPT")
    print("=" * 80 + "\n")

    # Load parsed lessons
    if not os.path.exists('MATEMATICA_PARSED_IMPROVED.txt'):
        print("❌ MATEMATICA_PARSED_IMPROVED.txt not found")
        print("   Run: python3 parse_matematica_improved.py")
        return

    extracted_lessons = parse_parsed_lessons('MATEMATICA_PARSED_IMPROVED.txt')
    print(f"✅ Parsed {len(extracted_lessons)} lessons from MATEMATICA_PARSED_IMPROVED.txt\n")

    # Load curriculum
    if not os.path.exists('curriculum_structure.json'):
        print("❌ curriculum_structure.json not found")
        return

    with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
        curriculum_data = json.load(f)

    print("✅ Loaded curriculum_structure.json\n")

    # Match lessons
    print("📊 Matching extracted lessons to curriculum...")
    matches = match_lessons_to_curriculum(extracted_lessons, curriculum_data)

    # Generate report
    report = generate_integration_report(matches)
    print(report)

    # Save report
    with open('INTEGRATION_REPORT.txt', 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"\n✅ Report saved to: INTEGRATION_REPORT.txt")

    # Save match data for next step
    with open('lesson_matches.json', 'w', encoding='utf-8') as f:
        # Convert to serializable format
        serializable_matches = {}
        for key, match in matches.items():
            serializable_matches[key] = {
                'chapter': match['chapter'],
                'lesson': match['lesson'],
                'curriculum_name': match['curriculum_name'],
                'page': match['extracted_data']['page'],
                'title': match['extracted_data']['title'],
                'enriched_summary': match['enriched_summary']
            }
        json.dump(serializable_matches, f, ensure_ascii=False, indent=2)

    print(f"✅ Match data saved to: lesson_matches.json")

    print("\n" + "=" * 80)
    print("🎯 NEXT STEPS:")
    print("=" * 80)
    print("""
1. Review INTEGRATION_REPORT.txt
   - Check mappings accuracy
   - Verify all lessons matched

2. Review lesson_matches.json
   - Check enriched summaries
   - Ensure content quality

3. Update curriculum_structure.json
   - Run: python3 apply_integration.py
   - This will apply the enriched content

4. Test in app
   - Start web interface: npm start
   - Check lessons display correctly
   - Verify mobile view

5. Deploy
   - git add curriculum_structure.json
   - git commit -m "feat: Enhance Matematica lessons"
   - git push origin main
""")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()

