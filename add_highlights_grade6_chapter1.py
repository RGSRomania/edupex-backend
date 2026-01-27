#!/usr/bin/env python3
"""
Add Highlighted Words to Grade 6 Matematica Chapter 1 Lessons
"""

import json
import re

def add_highlights_to_grade6_chapter1():
    """Add highlighted keywords to Grade 6 Chapter 1"""

    print("=" * 80)
    print("📝 ADDING HIGHLIGHTED WORDS TO GRADE 6 CHAPTER 1")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Keywords to highlight for each lesson in Grade 6 Chapter 1
    keywords_map = {
        "1": ["mulțime", "elemente", "notații", "reprezentare", "enumerare", "caracteristică"],
        "2": ["egalitate", "submulțime", "incluziune", "disjuncte"],
        "3": ["mulțime finită", "cardinal", "mulțime infinită", "echipotente"],
        "4": ["reuniune", "intersecție", "diferență", "operații"],
        "5": ["factori primi", "descompunere", "prim", "putere"],
        "6": ["cmmdc", "cmmmc", "divizor comun", "multiplu comun"],
        "7": ["divizibilitate", "reflexivitate", "antisimetrie", "tranzitivitate"],
        "8": ["recapitulare", "exerciții", "consolidare"],
        "9": ["evaluare", "test", "verificare"]
    }

    # Get Grade 6 Matematica Chapter 1
    if "Clasa a VI a" in curriculum and "Matematica" in curriculum["Clasa a VI a"]:
        math_chapters = curriculum["Clasa a VI a"]["Matematica"]

        if math_chapters and math_chapters[0].get("number") == "1":
            chapter_1 = math_chapters[0]
            lessons = chapter_1.get("lectii", [])

            print(f"\n📚 Grade 6 Chapter 1: {chapter_1.get('name')}")
            print(f"   Keywords to highlight per lesson")

            highlighted_count = 0

            for lesson in lessons:
                lesson_num = lesson.get("number")

                if lesson_num not in keywords_map:
                    continue

                keywords = keywords_map[lesson_num]

                # Highlight in summary
                summary = lesson.get("summary", "")
                modified_summary = summary

                for keyword in keywords:
                    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                    # Only replace if not already wrapped in **
                    modified_summary = pattern.sub(lambda m: f"**{m.group()}**" if not (
                        modified_summary[max(0, m.start()-2):m.start()] == '**' and
                        modified_summary[m.end():min(len(modified_summary), m.end()+2)] == '**'
                    ) else m.group(), modified_summary)

                    highlighted_count += modified_summary.count(f"**{keyword}**")

                lesson["summary"] = modified_summary

                # Highlight in sections
                sections = lesson.get("sections", [])
                for section in sections:
                    content = section.get("content", "")
                    modified_content = content

                    for keyword in keywords:
                        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                        modified_content = pattern.sub(lambda m: f"**{m.group()}**", modified_content)

                    section["content"] = modified_content

                print(f"   ✅ L{lesson_num}: {lesson.get('name')[:50]}...")

            # Save updated curriculum
            with open(curriculum_file, 'w', encoding='utf-8') as f:
                json.dump(curriculum, f, indent=2, ensure_ascii=False)

            print(f"\n{'=' * 80}")
            print(f"✅ HIGHLIGHTS ADDED TO GRADE 6 CHAPTER 1!")
            print(f"{'=' * 80}")
            print(f"   File: {curriculum_file}")
            print(f"   Highlighted terms across lessons")

            return curriculum

if __name__ == '__main__':
    add_highlights_to_grade6_chapter1()

