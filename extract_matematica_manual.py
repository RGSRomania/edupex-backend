#!/usr/bin/env python3
"""
Extract lesson list from Manual MATE.doc (RTF file)
Parses the document structure to identify:
- Chapter/Unit names
- Lesson names
- Summaries and content
- Graphics descriptions
- Examples
- Notes

This is a manual extraction guide since the file is large and complex.
"""

import re
import os

def extract_rtf_text(filepath):
    """Extract readable text from RTF file"""
    try:
        with open(filepath, 'r', encoding='latin-1', errors='ignore') as f:
            content = f.read()

        # Remove RTF formatting
        # Remove control words
        text = re.sub(r'\\[a-z]+\d*\s?', ' ', content)
        # Remove braces
        text = re.sub(r'[{}]', '', text)
        # Remove hex sequences
        text = re.sub(r"\\'[0-9a-f]{2}", '', text)
        # Clean up extra spaces
        text = re.sub(r' +', ' ', text)
        # Clean up newlines
        text = re.sub(r'\n\n+', '\n', text)

        return text
    except Exception as e:
        print(f"Error reading RTF: {e}")
        return None

def find_lesson_patterns(text):
    """Find lesson patterns in the text"""
    patterns = {
        'chapter_headers': r'^(CAPITOLUL|Capitolul|Chapter|CAP\.?\s*\d+)',
        'lesson_titles': r'^(Lecția|Lektion|Lesson|Lectia)\s*\d+',
        'summaries': r'^(Rezumat|Summary|Rsum)',
        'examples': r'^(Exemplu|Exemple|Example|Examplu)',
        'notes': r'^(Notă|Observație|Note|Important)',
        'graphics': r'\[.*?(Fig|Figura|Diagram|Imagine|Graph).*?\]',
    }

    results = {}
    for pattern_name, pattern in patterns.items():
        matches = re.findall(pattern, text, re.MULTILINE | re.IGNORECASE)
        results[pattern_name] = len(matches)

    return results

def manual_extraction_guide():
    """Create a manual extraction guide"""
    guide = """
═══════════════════════════════════════════════════════════════════════════
                 MANUAL LESSON EXTRACTION GUIDE
           For Manual MATE.doc - Clasa a V-a Mathematics
═══════════════════════════════════════════════════════════════════════════

WHAT WE NEED TO EXTRACT:
═════════════════════════

For each LESSON, we need:

1. LESSON TITLE
   Example: "Adunarea și scăderea numerelor naturale"

2. LESSON SUMMARY/CONTENT
   - Main explanation/definition
   - Step-by-step explanations
   - Key concepts
   - Rules and properties

3. EXAMPLES
   - Worked examples with solutions
   - Step-by-step calculations
   - Different difficulty levels

4. GRAPHICS/DIAGRAMS
   - Descriptions of visual elements
   - Tables
   - Number lines
   - Diagrams (if any)

5. NOTES
   - Important reminders
   - Common mistakes
   - Tips and tricks

6. LESSON STRUCTURE/CHAPTERS
   - Which chapter does this belong to?
   - Lesson number within chapter
   - Connections to other lessons

═════════════════════════════════════════════════════════════════════════════

EXPECTED STRUCTURE FROM CURRENT JSON:
═══════════════════════════════════════════════════════════════════════════

Matematica (6 chapters):
├── Chapter 1: Operații cu numere (13 lessons)
│   ├── Lesson 1: Scrierea și citirea numerelor naturale
│   ├── Lesson 2: Compararea și ordonarea numerelor naturale
│   ├── Lesson 3: Adunarea numerelor naturale
│   └── ... (10 more lessons)
├── Chapter 2: Metode aritmetice (5 lessons)
├── Chapter 3: Divizibilitatea (3 lessons)
├── Chapter 4: Fracții ordinare (10 lessons)
├── Chapter 5: Fracții zecimale (9 lessons)
└── Chapter 6: Elemente de geometrie (11 lessons)

TOTAL: 6 chapters, 51 lessons

═════════════════════════════════════════════════════════════════════════════

HOW TO PROCEED:
═══════════════

1. OPEN Manual MATE.doc in Word/Writer
2. FOR EACH LESSON, EXTRACT:
   
   a) Copy the lesson TITLE
   b) Copy ALL CONTENT INCLUDING:
      - Main explanation/definition
      - All paragraphs
      - All numbered points
      - All lists
      - All worked examples (including answers)
      - All diagrams/tables (describe them textually)
      - All notes and tips
      
   c) Format as:
      LESSON TITLE: [title here]
      CHAPTER: [chapter number/name]
      LESSON NUMBER: [number]
      
      CONTENT:
      [All text content including examples and notes]
      
      GRAPHICS/TABLES:
      [Descriptions of any diagrams, tables, number lines, etc.]
      
      ═══════════════════════════════════════════════════════════════

3. SAVE IN A STRUCTURED FORMAT
   We'll create a file like: MATEMATICA_LESSONS_EXTRACTED.txt

═════════════════════════════════════════════════════════════════════════════

EXAMPLE FORMAT:
═══════════════

LESSON TITLE: Adunarea numerelor naturale
CHAPTER: 1 - Operații cu numere
LESSON NUMBER: 3

CONTENT:
Adunarea este operația prin care combinăm două sau mai multe numere...
[Full content here]

Exemplu:
25 + 15 = 40

GRAPHICS/TABLES:
[Table: Addition facts for numbers 0-10]
[Number line: 0 to 50 with marking]

═════════════════════════════════════════════════════════════════════════════

NEXT STEPS AFTER EXTRACTION:
═════════════════════════════

Once we have all lessons extracted:
1. Create a structured list
2. Map each lesson to current JSON structure
3. Update JSON with full content
4. Add proper formatting (markdown)
5. Verify completeness
6. Deploy to app

═════════════════════════════════════════════════════════════════════════════
"""
    return guide

def main():
    print("🔍 MATEMATICA MANUAL EXTRACTION TOOL")
    print("=" * 80)

    doc_path = "/Users/mdica/PycharmProjects/EduPex/Manuale word/Clasa a V-A/Manual MATE.doc"

    # Extract RTF text
    print("\n1️⃣  Extracting text from Manual MATE.doc...")
    text = extract_rtf_text(doc_path)

    if text:
        print(f"✅ Extracted {len(text)} characters")

        # Find patterns
        print("\n2️⃣  Analyzing content structure...")
        patterns = find_lesson_patterns(text)
        print("\n📊 Found patterns:")
        for pattern_name, count in patterns.items():
            print(f"   {pattern_name}: {count}")

        # Show preview
        print("\n3️⃣  Content preview (first 500 chars):")
        print("-" * 80)
        preview = text[:500].replace('\n', ' ')
        print(preview)
        print("-" * 80)

    # Show manual extraction guide
    print("\n" + "=" * 80)
    print(manual_extraction_guide())
    print("=" * 80)

if __name__ == '__main__':
    main()

