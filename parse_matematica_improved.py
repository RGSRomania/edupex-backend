#!/usr/bin/env python3
"""
Improved Matematica Manual Parser
Parses extracted PDF text and creates structured lesson output
With better lesson boundary detection
"""

import re
import os
from collections import defaultdict

def parse_pdf_text_to_lessons(text_file):
    """Parse PDF-extracted text into structured lessons"""

    print(f"📖 Reading {text_file}...")
    with open(text_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    print(f"✅ Loaded {len(content):,} characters\n")

    # Split by page markers
    pages = re.split(r'--- PAGE \d+ ---', content)
    print(f"📄 Detected {len(pages)} pages")

    # Parse content
    lessons = []
    current_lesson = {}

    for page_num, page in enumerate(pages, 1):
        if not page.strip():
            continue

        page = page.strip()

        # Look for lesson indicators
        # Romanian lesson patterns: "Lecția", "Lectia", numbered items, etc.

        # Split page into logical sections
        lines = [l.strip() for l in page.split('\n') if l.strip()]

        for line in lines:
            # Check if line looks like a lesson title
            if looks_like_lesson_title(line):
                if current_lesson:
                    lessons.append(current_lesson)
                current_lesson = {
                    'title': line,
                    'page': page_num,
                    'content': [],
                    'examples': [],
                    'definitions': [],
                    'formulas': [],
                    'notes': []
                }
            elif current_lesson:
                # Categorize content
                if looks_like_definition(line):
                    current_lesson['definitions'].append(line)
                elif looks_like_example(line):
                    current_lesson['examples'].append(line)
                elif looks_like_formula(line):
                    current_lesson['formulas'].append(line)
                elif looks_like_note(line):
                    current_lesson['notes'].append(line)
                else:
                    current_lesson['content'].append(line)

    if current_lesson:
        lessons.append(current_lesson)

    return lessons, pages

def looks_like_lesson_title(line):
    """Check if line looks like a lesson title"""
    # Lesson titles are usually short, capitalized
    line_lower = line.lower()

    # Romanian lesson keywords
    keywords = [
        'lecția', 'lectia', 'lesson',
        'capitolul', 'capitolului',
        'unitatea', 'unitatii'
    ]

    # Check length (titles are short)
    if len(line) < 150 and any(kw in line_lower for kw in keywords):
        return True

    # Check if it's a numbered title pattern
    if re.match(r'^\d+\.\s+[A-Z]', line):
        return True

    return False

def looks_like_definition(line):
    """Check if line contains a definition"""
    keywords = ['definiție', 'definitie', 'definiția', 'definitia', 'este o', 'este un']
    return any(kw in line.lower() for kw in keywords)

def looks_like_example(line):
    """Check if line contains an example"""
    keywords = ['exemplu', 'exempla', 'exemplul', 'exemple', 'ex.', 'example', 'ex ']
    return any(kw in line.lower() for kw in keywords)

def looks_like_formula(line):
    """Check if line contains a formula"""
    # Check for mathematical operators
    operators = ['=', '+', '-', '×', '÷', '√', '^', '²', '³', '≈', '≠', '>', '<']
    return any(op in line for op in operators)

def looks_like_note(line):
    """Check if line contains a note"""
    keywords = ['notă', 'nota', 'observație', 'observatie', 'important', 'atenție', 'atentie', 'remark']
    return any(kw in line.lower() for kw in keywords)

def create_structured_output(lessons):
    """Create formatted output with lesson structure"""

    output = []
    output.append("=" * 80)
    output.append("MATEMATICA - EXTRACTED LESSONS (FROM PDF)")
    output.append("=" * 80)
    output.append("")

    for i, lesson in enumerate(lessons, 1):
        output.append(f"\n{'=' * 80}")
        output.append(f"LESSON {i}: {lesson['title'][:70]}")
        output.append(f"Page: {lesson['page']}")
        output.append(f"{'=' * 80}\n")

        if lesson['definitions']:
            output.append("DEFINITIONS:")
            for defn in lesson['definitions'][:3]:
                output.append(f"  • {defn[:100]}")
            output.append("")

        if lesson['formulas']:
            output.append("FORMULAS/RULES:")
            for formula in lesson['formulas'][:5]:
                output.append(f"  • {formula[:100]}")
            output.append("")

        if lesson['examples']:
            output.append("EXAMPLES:")
            for example in lesson['examples'][:5]:
                output.append(f"  • {example[:100]}")
            output.append("")

        if lesson['notes']:
            output.append("NOTES:")
            for note in lesson['notes'][:3]:
                output.append(f"  • {note[:100]}")
            output.append("")

        if lesson['content']:
            output.append("CONTENT:")
            for content_line in lesson['content'][:5]:
                output.append(f"  {content_line[:100]}")
            output.append("")

    return '\n'.join(output)

def main():
    print("\n" + "=" * 80)
    print("📊 IMPROVED MATEMATICA MANUAL PARSER")
    print("=" * 80 + "\n")

    input_file = "EXTRACTED_TEXT_FROM_PDF.txt"

    if not os.path.exists(input_file):
        print(f"❌ File not found: {input_file}")
        print("\nRun: python3 extract_from_pdf.py")
        return

    # Parse the text
    lessons, pages = parse_pdf_text_to_lessons(input_file)

    print(f"\n✅ Parsed {len(lessons)} lessons from {len(pages)} pages")

    # Show summary
    print("\n" + "=" * 80)
    print("📊 LESSON SUMMARY:")
    print("=" * 80)

    for i, lesson in enumerate(lessons[:5], 1):
        title = lesson['title'][:50]
        print(f"\n{i}. {title}")
        print(f"   Page: {lesson['page']}")
        print(f"   Definitions: {len(lesson['definitions'])}")
        print(f"   Examples: {len(lesson['examples'])}")
        print(f"   Formulas: {len(lesson['formulas'])}")
        print(f"   Notes: {len(lesson['notes'])}")
        print(f"   Content lines: {len(lesson['content'])}")

    if len(lessons) > 5:
        print(f"\n... and {len(lessons) - 5} more lessons")

    # Create formatted output
    print("\n" + "=" * 80)
    print("💾 Creating formatted output...")

    formatted = create_structured_output(lessons)
    output_file = "MATEMATICA_PARSED_IMPROVED.txt"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(formatted)

    print(f"✅ Saved to: {output_file}")

    print("\n" + "=" * 80)
    print("🎯 NEXT STEPS:")
    print("=" * 80)
    print("""
1. Review MATEMATICA_PARSED_IMPROVED.txt
2. Check lesson extraction accuracy
3. Compare with curriculum_structure.json
4. Reference EXTRACTED_FROM_PDF/ (page images)
5. Enhance with image descriptions
6. Update JSON with complete lesson content
""")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()

