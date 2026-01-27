#!/usr/bin/env python3
"""
Add Highlighted Words to Matematica Lessons
Uses **word** format for highlighting (same as Romanian lessons)
"""

import json
from pathlib import Path

def add_highlights_to_matematica():
    """Add highlighted keywords to all Matematica lessons"""

    print("=" * 80)
    print("📝 ADDING HIGHLIGHTED WORDS TO MATEMATICA LESSONS")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Get Matematica lessons
    math_chapters = curriculum["Clasa a V a"]["Matematica"]

    # Define keywords to highlight for each lesson
    keywords_map = {
        "1": ["numerele naturale", "cifre", "sistem zecimal", "ordinul", "valoare"],
        "2": ["axa numerelor", "comparare", "ordonare", "crescător", "descrescător", "aproximare"],
        "3": ["adunarea", "termeni", "sumă", "comutativă", "asociativă", "element neutru"],
        "4": ["scăderea", "descăzut", "scăzător", "diferență", "inversa"],
        "5": ["înmulțirea", "factori", "produs", "comutativă", "asociativă", "distributivă"],
        "6": ["factor comun", "scoate factorul", "simplificare", "paranteze"],
        "7": ["recapitulare", "evaluare", "operații", "proprietăți"],
        "8": ["împărțire", "deîmpărțit", "împărțitor", "cât", "exactă"],
        "9": ["rest", "deîmpărțit", "cât", "împărțitor", "formula"],
        "10": ["putere", "exponent", "bază", "pătrat", "cub"],
        "11": ["reguli de calcul", "putere", "exponenți", "înmulțire", "împărțire"],
        "12": ["comparare", "puteri", "bază", "exponent", "mai mare", "mai mic"],
        "13": ["baza 10", "baza 2", "binar", "zecimal", "conversie"],
        "14": ["ordine operații", "paranteze", "prioritate", "reguli"],
        "15": ["recapitulare finală", "evaluare", "consolidare", "cunoștințe"]
    }

    # Process each chapter
    total_highlighted = 0

    for chapter_idx, chapter in enumerate(math_chapters):
        chapter_num = chapter.get("number")
        if chapter_num not in keywords_map:
            continue

        keywords = keywords_map[chapter_num]
        lessons = chapter.get("lectii", [])

        print(f"\n📚 Chapter {chapter_num}: {chapter.get('name')}")
        print(f"   Keywords to highlight: {', '.join(keywords)}")

        for lesson in lessons:
            lesson_num = lesson.get("number")
            summary = lesson.get("summary", "")

            # Highlight keywords in summary
            modified_summary = summary
            for keyword in keywords:
                # Case-insensitive replacement, preserve original case
                import re

                # Pattern to match the keyword (case-insensitive)
                pattern = re.compile(re.escape(keyword), re.IGNORECASE)

                # Replace with **keyword** (using original case from text)
                def replacer(match):
                    original = match.group()
                    # Only wrap if not already wrapped
                    if not (modified_summary[match.start()-2:match.start()] == '**' and
                            modified_summary[match.end():match.end()+2] == '**'):
                        return f"**{original}**"
                    return original

                modified_summary = pattern.sub(replacer, modified_summary)

            # Count how many keywords were highlighted
                # Simple count: just check how many **keyword** patterns we have
                wrapped_keywords = modified_summary.count(f"**{keyword}**") + modified_summary.count(f"**{keyword.capitalize()}**")
                if wrapped_keywords > 0:
                    total_highlighted += wrapped_keywords

            # Update lesson summary
            lesson["summary"] = modified_summary

            print(f"   ✅ L{lesson_num}: {lesson.get('name')[:50]}...")

        # Also highlight in sections
        for lesson in lessons:
            sections = lesson.get("sections", [])
            for section in sections:
                content = section.get("content", "")
                modified_content = content

                for keyword in keywords:
                    import re
                    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                    modified_content = pattern.sub(f"**{keyword}**", modified_content)

                section["content"] = modified_content

    # Save updated curriculum
    with open(curriculum_file, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2, ensure_ascii=False)

    print(f"\n{'=' * 80}")
    print(f"✅ HIGHLIGHTS ADDED TO MATEMATICA!")
    print(f"{'=' * 80}")
    print(f"   File: {curriculum_file}")
    print(f"\n   Summary updates:")
    print(f"   - All chapter summaries now have highlighted keywords")
    print(f"   - All section contents now have highlighted keywords")
    print(f"   - Format: **keyword** (same as Romanian lessons)")

    return curriculum

if __name__ == '__main__':
    add_highlights_to_matematica()

