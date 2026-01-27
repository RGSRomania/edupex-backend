#!/usr/bin/env python3
"""
Extract Chapter 1 lessons from Manual.pdf
Using pdfplumber and PyMuPDF for comprehensive extraction
"""

import pdfplumber
import json
import os
from pathlib import Path
import re

pdf_path = "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf"
output_dir = "/Users/mdica/PycharmProjects/EduPex/matematica_chapter1_extraction"
os.makedirs(output_dir, exist_ok=True)

# Define lessons in Chapter 1 (U1 - Operații cu numere naturale)
# Based on table of contents: pages 10-38
CHAPTER1_LESSONS = [
    {"number": "1", "name": "Scrierea și citirea numerelor naturale", "page_start": 10},
    {"number": "2", "name": "Reprezentarea pe axa numerelor. Compararea și ordonarea numerelor naturale", "page_start": 15},
    {"number": "3", "name": "Adunarea numerelor naturale, proprietăți", "page_start": 20},
    {"number": "4", "name": "Scăderea numerelor naturale", "page_start": 26},
    {"number": "5", "name": "Înmulțirea numerelor naturale, proprietăți", "page_start": 30},
    {"number": "6", "name": "Factor comun", "page_start": 36},
    # Lesson 7 starts new section, so chapter 1 ends at page 38
]

extracted_content = {
    "source": "Manual.pdf - Clasa a V a - Matematica",
    "chapter": {
        "number": "1",
        "name": "Operații cu numere naturale",
        "lessons": []
    }
}

print("🚀 Extracting Chapter 1 lessons from Manual.pdf")
print("=" * 70)

with pdfplumber.open(pdf_path) as pdf:
    print(f"📄 PDF loaded: {len(pdf.pages)} pages total")

    for lesson_idx, lesson in enumerate(CHAPTER1_LESSONS):
        lesson_num = lesson["number"]
        lesson_name = lesson["name"]
        page_start = lesson["page_start"] - 1  # Convert to 0-based indexing

        # Determine page end (next lesson start or end of chapter)
        if lesson_idx < len(CHAPTER1_LESSONS) - 1:
            page_end = CHAPTER1_LESSONS[lesson_idx + 1]["page_start"] - 1
        else:
            page_end = 38  # Chapter 1 ends at page 38

        print(f"\n📖 Lesson {lesson_num}: {lesson_name}")
        print(f"   Pages: {page_start + 1}-{page_end + 1}")

        lesson_content = {
            "number": lesson_num,
            "name": lesson_name,
            "pages": list(range(page_start + 1, page_end + 2)),
            "raw_text": "",
            "sections": []
        }

        # Extract text from pages
        for page_num in range(page_start, min(page_end + 1, len(pdf.pages))):
            page = pdf.pages[page_num]
            text = page.extract_text()

            if text:
                lesson_content["raw_text"] += f"\n--- PAGE {page_num + 1} ---\n{text}"

        # Split content into sections based on headers (look for lines that might be section titles)
        lines = lesson_content["raw_text"].split('\n')
        current_section = None

        for line in lines:
            # Look for potential section headers (lines in capitals or after page breaks)
            if line.strip() and (line.isupper() or '---' in line):
                if current_section is not None and current_section["content"].strip():
                    lesson_content["sections"].append(current_section)
                current_section = {
                    "title": line.strip(),
                    "content": "",
                    "order": len(lesson_content["sections"]) + 1
                }
            elif current_section is not None:
                current_section["content"] += line + "\n"

        # Add the last section
        if current_section is not None and current_section["content"].strip():
            lesson_content["sections"].append(current_section)

        # Clean up sections
        lesson_content["sections"] = [
            {
                "title": s["title"],
                "content": s["content"].strip(),
                "order": idx + 1
            }
            for idx, s in enumerate(lesson_content["sections"])
            if s["content"].strip()
        ]

        print(f"   ✅ Extracted: {len(lesson_content['sections'])} sections")
        print(f"   ✅ Text length: {len(lesson_content['raw_text'])} characters")

        extracted_content["chapter"]["lessons"].append(lesson_content)

print("\n" + "=" * 70)
print(f"✅ Chapter 1 extraction complete!")
print(f"   - Lessons extracted: {len(extracted_content['chapter']['lessons'])}")

# Save the extracted content
output_file = os.path.join(output_dir, "chapter1_extracted.json")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(extracted_content, f, ensure_ascii=False, indent=2)

print(f"✅ Saved to: {output_file}")
print(f"\n📊 Summary:")
for lesson in extracted_content["chapter"]["lessons"]:
    print(f"   Lesson {lesson['number']}: {lesson['name']}")
    print(f"      - Sections: {len(lesson['sections'])}")


