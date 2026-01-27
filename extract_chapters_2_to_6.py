#!/usr/bin/env python3
"""
Extract Chapters 2-6 from Manual.pdf
Using pdfplumber for comprehensive extraction
"""

import pdfplumber
import json
import os
from pathlib import Path

pdf_path = "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf"
output_dir = "/Users/mdica/PycharmProjects/EduPex/matematica_chapters_extraction"
os.makedirs(output_dir, exist_ok=True)

# Define chapters 2-6 with their lessons
CHAPTERS = {
    "2": {
        "name": "Metode aritmetice de rezolvare a problemelor",
        "lessons": [
            {"number": "1", "name": "Metoda reducerii la unitate", "page_start": 64},
            {"number": "2", "name": "Metoda comparației", "page_start": 67},
            {"number": "3", "name": "Metoda figurativă", "page_start": 71},
            {"number": "4", "name": "Metoda mersului invers", "page_start": 77},
            {"number": "5", "name": "Metoda falsei ipoteze", "page_start": 82},
        ],
        "chapter_end": 85
    },
    "3": {
        "name": "Divizibilitatea numerelor naturale",
        "lessons": [
            {"number": "1", "name": "Divizibilitatea numerelor naturale", "page_start": 88},
            {"number": "2", "name": "Criterii de divizibilitate", "page_start": 92},
            {"number": "3", "name": "Numere prime. Numere compuse", "page_start": 96},
        ],
        "chapter_end": 99
    },
    "4": {
        "name": "Fracții ordinare",
        "lessons": [
            {"number": "1", "name": "Fracții ordinare. Fracții echivalente. Procente", "page_start": 102},
            {"number": "2", "name": "Compararea fracțiilor cu același numitor/numărător. Reprezentarea fracțiilor ordinare pe axa numerelor", "page_start": 106},
            {"number": "3", "name": "Introducerea și scoaterea întregilor dintr-o fracție", "page_start": 109},
            {"number": "4", "name": "Cel mai mare divizor comun a două numere naturale. Amplificarea și simplificarea fracțiilor. Fracții ireductibile", "page_start": 111},
            {"number": "5", "name": "Cel mai mic multiplu comun a două numere naturale. Aducerea fracțiilor la un numitor comun", "page_start": 116},
            {"number": "6", "name": "Adunarea și scăderea fracțiilor", "page_start": 119},
            {"number": "7", "name": "Înmulțirea fracțiilor", "page_start": 123},
            {"number": "8", "name": "Împărțirea fracțiilor ordinare", "page_start": 126},
            {"number": "9", "name": "Puterea cu exponent natural a unei fracții ordinare", "page_start": 129},
            {"number": "10", "name": "Fracții/procente dintr-un număr natural sau dintr-o fracție ordinară", "page_start": 132},
        ],
        "chapter_end": 136
    },
    "5": {
        "name": "Fracții zecimale",
        "lessons": [
            {"number": "1", "name": "Fracții zecimale; scrierea fracțiilor ordinare cu numitori puteri ale lui 10 sub forma de fracții zecimale; transformarea unei fracții zecimale cu un număr finit de zecimale nenule în fracție ordinară", "page_start": 140},
            {"number": "2", "name": "Aproximări; compararea, ordonarea și reprezentarea pe axa numerelor a unor fracții zecimale cu un număr finit de zecimale nenule", "page_start": 143},
            {"number": "3", "name": "Adunarea și scăderea fracțiilor zecimale cu un număr finit de zecimale nenule", "page_start": 146},
            {"number": "4", "name": "Înmulțirea fracțiilor zecimale cu un număr finit de zecimale nenule", "page_start": 149},
            {"number": "5", "name": "Înmulțirea fracțiilor zecimale cu un număr finit de zecimale nenule", "page_start": 152},
            {"number": "6", "name": "Împărțirea unei fracții zecimale cu un număr finit de zecimale nenule la un număr natural nenul; Împărțirea a două fracții zecimale cu un număr finit de zecimale nenule. Transformarea unei fracții zecimale periodice în fracție ordinară", "page_start": 157},
            {"number": "7", "name": "Număr rațional pozitiv; ordinea efectuării operațiilor cu numere raționale pozitive", "page_start": 160},
        ],
        "chapter_end": 164
    },
    "6": {
        "name": "Elemente de geometrie și unități de măsură",
        "lessons": [
            {"number": "1", "name": "Punct, dreaptă, plan, semiplan, semidreaptă, segment de dreaptă", "page_start": 176},
            {"number": "2", "name": "Pozițiile relative ale unui punct față de o dreaptă. Puncte coliniare. Pozițiile relative a două drepte: drepte concurente, drepte paralele", "page_start": 181},
            {"number": "3", "name": "Lungimea unui segment. Distanța dintre două puncte. Segmente congruente", "page_start": 186},
            {"number": "4", "name": "Mijlocul unui segment. Simetricul unui punct față de un punct", "page_start": 191},
            {"number": "5", "name": "Unghi: definiție, notații, elemente. Interiorul unui unghi, exteriorul unui unghi", "page_start": 197},
            {"number": "6", "name": "Măsura unui unghi. Unghiuri congruente (măsurarea și construcția cu raportorul)", "page_start": 200},
            {"number": "7", "name": "Clasificarea unghiurilor. Calcule cu măsuri de unghiuri", "page_start": 204},
            {"number": "8", "name": "Figuri congruente. Axa de simetrie", "page_start": 210},
            {"number": "9", "name": "Unități de măsură pentru lungime. Perimetrul", "page_start": 215},
        ],
        "chapter_end": 220
    }
}

def extract_chapter(chapter_num, chapter_info):
    """Extract a complete chapter"""
    print(f"\n📖 Extracting Chapter {chapter_num}: {chapter_info['name']}")

    chapter_data = {
        "number": chapter_num,
        "name": chapter_info["name"],
        "lessons": []
    }

    with pdfplumber.open(pdf_path) as pdf:
        for lesson_idx, lesson in enumerate(chapter_info["lessons"]):
            lesson_num = lesson["number"]
            lesson_name = lesson["name"]
            page_start = lesson["page_start"] - 1  # 0-based

            # Determine page end (next lesson start or chapter end)
            if lesson_idx < len(chapter_info["lessons"]) - 1:
                page_end = chapter_info["lessons"][lesson_idx + 1]["page_start"] - 1
            else:
                page_end = chapter_info["chapter_end"] - 1

            print(f"  Lesson {lesson_num}: {lesson_name[:50]}... (pages {page_start + 1}-{page_end + 1})")

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

            # Split into sections by headers
            lines = lesson_content["raw_text"].split('\n')
            current_section = None

            for line in lines:
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

            print(f"     ✅ {len(lesson_content['sections'])} sections extracted")
            chapter_data["lessons"].append(lesson_content)

    return chapter_data

# Extract all chapters
print("🚀 Starting extraction of Chapters 2-6...")
print("=" * 70)

all_chapters = {
    "source": "Manual.pdf - Clasa a V a - Matematica",
    "chapters": []
}

for chapter_num in ["2", "3", "4", "5", "6"]:
    chapter_data = extract_chapter(chapter_num, CHAPTERS[chapter_num])
    all_chapters["chapters"].append(chapter_data)

print("\n" + "=" * 70)
print(f"✅ Extraction complete!")

# Save extracted data
output_file = os.path.join(output_dir, "chapters_2_to_6_extracted.json")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_chapters, f, ensure_ascii=False, indent=2)

print(f"✅ Saved to: {output_file}")

# Print summary
print("\n📊 Extraction Summary:")
total_lessons = 0
total_sections = 0
for chapter in all_chapters["chapters"]:
    lessons = len(chapter["lessons"])
    sections = sum(len(l["sections"]) for l in chapter["lessons"])
    total_lessons += lessons
    total_sections += sections
    print(f"   Chapter {chapter['number']}: {lessons} lessons | {sections} sections")

print(f"\n📈 TOTAL: {total_lessons} lessons | {total_sections} sections")


