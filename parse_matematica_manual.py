#!/usr/bin/env python3
"""
Automated Matematica Manual Parser
Parses the exported MATEMATICA_MANUAL_TEXT.txt from Word
and extracts all 51 lessons into structured format
"""

import re
import os
from collections import defaultdict

def parse_manual_text(input_file):
    """Parse the extracted manual text file"""

    if not os.path.exists(input_file):
        print(f"❌ File not found: {input_file}")
        print("\nPlease first export Manual MATE.doc as .txt from Word:")
        print("1. Open Manual MATE.doc in Word")
        print("2. File → Save As → Plain Text (.txt)")
        print("3. Save as: MATEMATICA_MANUAL_TEXT.txt")
        return None

    print(f"📖 Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    print(f"✅ Loaded {len(content)} characters")

    # Parse lessons
    lessons = extract_lessons(content)
    return lessons

def extract_lessons(content):
    """Extract individual lessons from content"""

    lessons = []

    # Split by potential lesson markers
    # Look for patterns like "Lecția", "Lesson", numbered items, etc.
    lines = content.split('\n')

    current_lesson = None
    current_section = None

    for line in lines:
        line_stripped = line.strip()

        if not line_stripped:
            continue

        # Check if this is a lesson title/marker
        if is_lesson_start(line_stripped):
            if current_lesson:
                lessons.append(current_lesson)
            current_lesson = {
                'title': line_stripped,
                'content': [],
                'examples': [],
                'notes': [],
                'definitions': [],
                'formulas': []
            }

        # Check for section markers
        elif is_definition(line_stripped) and current_lesson:
            current_lesson['definitions'].append(line_stripped)
        elif is_example(line_stripped) and current_lesson:
            current_lesson['examples'].append(line_stripped)
        elif is_note(line_stripped) and current_lesson:
            current_lesson['notes'].append(line_stripped)
        elif is_formula(line_stripped) and current_lesson:
            current_lesson['formulas'].append(line_stripped)
        elif current_lesson:
            current_lesson['content'].append(line_stripped)

    if current_lesson:
        lessons.append(current_lesson)

    return lessons

def is_lesson_start(line):
    """Check if line is a lesson start"""
    patterns = [
        r'^lecti',
        r'^lesson\s+\d',
        r'^capitolul',
        r':\s*[A-Z]',  # Line ending with definition
    ]
    for pattern in patterns:
        if re.match(pattern, line, re.IGNORECASE):
            return True
    return False

def is_definition(line):
    """Check if line contains a definition"""
    return 'defini' in line.lower()

def is_example(line):
    """Check if line contains an example"""
    return 'exemplu' in line.lower() or r'ex\.' in line.lower()

def is_note(line):
    """Check if line contains a note"""
    patterns = ['notă', 'observație', 'important', 'atenție', 'remark']
    return any(p in line.lower() for p in patterns)

def is_formula(line):
    """Check if line contains a formula"""
    patterns = ['formul', '=', '×', '÷', '+', '-', '√']
    return any(p in line.lower() for p in patterns)

def format_lesson_output(lessons):
    """Format lessons for output"""

    output = []
    output.append("=" * 80)
    output.append("MATEMATICA - EXTRACTED LESSONS")
    output.append("=" * 80)
    output.append("")

    for i, lesson in enumerate(lessons, 1):
        output.append(f"\n{'=' * 80}")
        output.append(f"LESSON {i}: {lesson['title']}")
        output.append(f"{'=' * 80}\n")

        if lesson['definitions']:
            output.append("DEFINITION:")
            for defn in lesson['definitions'][:3]:  # First 3 definitions
                output.append(f"  {defn}")
            output.append("")

        if lesson['examples']:
            output.append("EXAMPLES:")
            for example in lesson['examples'][:5]:  # First 5 examples
                output.append(f"  {example}")
            output.append("")

        if lesson['formulas']:
            output.append("FORMULAS/RULES:")
            for formula in lesson['formulas'][:5]:  # First 5 formulas
                output.append(f"  {formula}")
            output.append("")

        if lesson['notes']:
            output.append("NOTES:")
            for note in lesson['notes'][:5]:  # First 5 notes
                output.append(f"  {note}")
            output.append("")

        if lesson['content']:
            output.append("ADDITIONAL CONTENT:")
            for content_line in lesson['content'][:10]:  # First 10 lines
                output.append(f"  {content_line}")
            output.append("")

    return '\n'.join(output)

def main():
    print("\n" + "=" * 80)
    print("🔍 MATEMATICA MANUAL PARSER")
    print("=" * 80 + "\n")

    # Try PDF extracted text first, then fallback to manual txt
    input_files = [
        "EXTRACTED_TEXT_FROM_PDF.txt",  # From PDF extraction
        "MATEMATICA_MANUAL_TEXT.txt"     # From Word export
    ]

    input_file = None
    for candidate in input_files:
        if os.path.exists(candidate):
            input_file = candidate
            break

    if not input_file:
        print("📋 Looking for extracted manual text...")
        print(f"   Expected files: {' or '.join(input_files)}\n")
        print("\n⚠️  NEXT STEPS:")
        print("─" * 80)
        print("Option 1: Use PDF-extracted text")
        print("   Run: python3 extract_from_pdf.py")
        print("")
        print("Option 2: Export from Word")
        print("   1. Open Manual MATE.doc in Microsoft Word")
        print("   2. Go to File → Save As...")
        print("   3. Change format to Plain Text (.txt)")
        print("   4. Save as: MATEMATICA_MANUAL_TEXT.txt")
        print("   5. Choose UTF-8 encoding")
        print("─" * 80)
        return

    print(f"📋 Found extracted text: {input_file}")
    print(f"   Size: {os.path.getsize(input_file) / 1024:.1f} KB\n")

    # Parse the manual
    lessons = parse_manual_text(input_file)

    if not lessons:
        return

    print(f"✅ Extracted {len(lessons)} lessons from manual\n")

    # Show summary
    print("📊 EXTRACTION SUMMARY:")
    print("─" * 80)
    for i, lesson in enumerate(lessons[:5], 1):  # Show first 5
        print(f"\nLesson {i}: {lesson['title']}")
        print(f"  - Definitions: {len(lesson['definitions'])}")
        print(f"  - Examples: {len(lesson['examples'])}")
        print(f"  - Formulas: {len(lesson['formulas'])}")
        print(f"  - Notes: {len(lesson['notes'])}")
        print(f"  - Content lines: {len(lesson['content'])}")

    if len(lessons) > 5:
        print(f"\n... and {len(lessons) - 5} more lessons")

    # Format and save output
    print("\n" + "─" * 80)
    print("💾 Formatting and saving output...")

    formatted_output = format_lesson_output(lessons)
    output_file = "MATEMATICA_PARSED_LESSONS.txt"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(formatted_output)

    print(f"✅ Saved parsed lessons to: {output_file}")

    print("\n" + "=" * 80)
    print("🎯 NEXT STEPS:")
    print("─" * 80)
    print("1. Review MATEMATICA_PARSED_LESSONS.txt")
    print("2. Check if all 51 lessons are present")
    print("3. Verify definitions, examples, and notes")
    print("4. Compare with curriculum_structure.json")
    print("5. Update JSON with complete lesson content")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()

