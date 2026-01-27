#!/usr/bin/env python3
"""
Add Highlighted Words to Grade 6 Matematica Chapter 3
"""

import json
import re

def add_highlights_to_grade6_chapter3():
    """Add highlighted keywords to Grade 6 Chapter 3"""

    print("=" * 80)
    print("📝 ADDING HIGHLIGHTED WORDS TO GRADE 6 CHAPTER 3")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Keywords to highlight for each lesson in Grade 6 Chapter 3
    keywords_map = {
        "1": ["numere întregi", "opus", "modul", "comparare", "ordonare"],
        "2": ["adunare", "proprietăți", "comutativă", "asociativă"],
        "3": ["scădere", "opus"],
        "4": ["înmulțire", "regula semnelor"],
        "5": ["împărțire", "regula semnelor"],
        "6": ["putere", "exponent", "bază"],
        "7": ["ordinea operațiilor", "paranteze"],
        "8": ["ecuații", "soluție", "necunoscută"],
        "9": ["inecuații", "inegalitate"]
    }

    # Get Grade 6 Matematica Chapter 3
    if "Clasa a VI a" in curriculum and "Matematica" in curriculum["Clasa a VI a"]:
        math_chapters = curriculum["Clasa a VI a"]["Matematica"]

        # Find Chapter 3
        chapter_3 = None
        for ch in math_chapters:
            if ch.get("number") == "3":
                chapter_3 = ch
                break

        if chapter_3:
            lessons = chapter_3.get("lectii", [])

            print(f"\n📚 Grade 6 Chapter 3: {chapter_3.get('name')}")

            for lesson in lessons:
                lesson_num = lesson.get("number")

                if lesson_num not in keywords_map:
                    continue

                keywords = keywords_map[lesson_num]

                # Highlight in summary
                summary = lesson.get("summary", "")
                for keyword in keywords:
                    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                    summary = pattern.sub(lambda m: f"**{m.group()}**", summary)

                lesson["summary"] = summary

                # Highlight in sections
                sections = lesson.get("sections", [])
                for section in sections:
                    content = section.get("content", "")
                    for keyword in keywords:
                        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                        content = pattern.sub(lambda m: f"**{m.group()}**", content)
                    section["content"] = content

                print(f"   ✅ L{lesson_num}: {lesson.get('name')[:50]}...")

            # Save updated curriculum
            with open(curriculum_file, 'w', encoding='utf-8') as f:
                json.dump(curriculum, f, indent=2, ensure_ascii=False)

            print(f"\n{'=' * 80}")
            print(f"✅ HIGHLIGHTS ADDED TO GRADE 6 CHAPTER 3!")
            print(f"{'=' * 80}")

if __name__ == '__main__':
    add_highlights_to_grade6_chapter3()

