#!/usr/bin/env python3
"""
Add Highlighted Words to Grade 6 Matematica Chapter 2
"""

import json
import re

def add_highlights_to_grade6_chapter2():
    """Add highlighted keywords to Grade 6 Chapter 2"""

    print("=" * 80)
    print("📝 ADDING HIGHLIGHTED WORDS TO GRADE 6 CHAPTER 2")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Keywords to highlight for each lesson in Grade 6 Chapter 2
    keywords_map = {
        "1": ["raport", "antecedent", "consecvent", "echivalente"],
        "2": ["proporție", "proprietatea fundamentală", "extremi", "mezi"],
        "3": ["proporții derivate", "permutare", "compoziție", "descompunere"],
        "4": ["șir de rapoarte", "coeficient", "proporționalitate"],
        "5": ["direct proporționale", "coeficient de proporționalitate", "linie dreaptă"],
        "6": ["invers proporționale", "produs constant", "hiperbolă"],
        "7": ["regula de trei", "proporționalitate"],
        "8": ["grafice", "reprezentare datelor", "tabele", "diagramă"],
        "9": ["probabilitate", "cazuri favorabile", "cazuri posibile"],
        "10": ["recapitulare", "exerciții", "aplicații"],
        "11": ["evaluare", "test", "sinteză"]
    }

    # Get Grade 6 Matematica Chapter 2
    if "Clasa a VI a" in curriculum and "Matematica" in curriculum["Clasa a VI a"]:
        math_chapters = curriculum["Clasa a VI a"]["Matematica"]

        # Find Chapter 2
        chapter_2 = None
        for ch in math_chapters:
            if ch.get("number") == "2":
                chapter_2 = ch
                break

        if chapter_2:
            lessons = chapter_2.get("lectii", [])

            print(f"\n📚 Grade 6 Chapter 2: {chapter_2.get('name')}")

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
            print(f"✅ HIGHLIGHTS ADDED TO GRADE 6 CHAPTER 2!")
            print(f"{'=' * 80}")

if __name__ == '__main__':
    add_highlights_to_grade6_chapter2()

