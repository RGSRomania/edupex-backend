#!/usr/bin/env python3
"""
Integrate Complete Chapter 1 (all 15 lessons) into curriculum_structure.json
Replaces the existing 3-lesson Chapter 1 with the full version
"""

import json
from pathlib import Path

def integrate_complete_chapter_1():
    print("=" * 80)
    print("🔧 INTEGRATING COMPLETE CHAPTER 1 INTO CURRICULUM")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    print(f"\n📖 Loaded curriculum")

    # Load Complete Chapter 1
    chapter_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_1_COMPLETE_MATEMATICA_CLASA5.json'
    with open(chapter_file, 'r', encoding='utf-8') as f:
        chapter_1_data = json.load(f)

    print(f"✅ Loaded Chapter 1: {chapter_1_data['name']}")
    print(f"   Lessons: {len(chapter_1_data['lessons'])}")

    # Get Clasa a V a and Matematica
    if "Clasa a V a" not in curriculum:
        curriculum["Clasa a V a"] = {}

    if "Matematica" not in curriculum["Clasa a V a"]:
        curriculum["Clasa a V a"]["Matematica"] = []

    # Convert Chapter 1 to the expected format
    chapters_list = curriculum["Clasa a V a"]["Matematica"]

    # Create chapter in the right format
    chapter_formatted = {
        "number": str(chapter_1_data["order"]),
        "name": chapter_1_data["name"],
        "description": chapter_1_data.get("description", ""),
        "lectii": []
    }

    # Add all lessons to chapter
    for lesson in chapter_1_data["lessons"]:
        lesson_formatted = {
            "number": str(lesson["order"]),
            "name": lesson["title"],
            "summary": lesson["summary"],
            "questions": lesson.get("questions", []),
            "sections": []
        }

        # Add theory as sections
        if "content" in lesson and "theory" in lesson["content"]:
            for idx, theory_point in enumerate(lesson["content"]["theory"]):
                lesson_formatted["sections"].append({
                    "title": f"Teorie {idx+1}",
                    "content": theory_point,
                    "order": idx + 1
                })

        # Add examples as sections
        if "content" in lesson and "examples" in lesson["content"]:
            start_order = len(lesson_formatted["sections"]) + 1
            for idx, example in enumerate(lesson["content"]["examples"]):
                lesson_formatted["sections"].append({
                    "title": example.get("title", f"Exemplu {idx+1}"),
                    "content": example.get("content", ""),
                    "order": start_order + idx
                })

        chapter_formatted["lectii"].append(lesson_formatted)

    # Find and replace Chapter 1
    existing_chapter_idx = None
    for idx, ch in enumerate(chapters_list):
        if ch.get("number") == str(chapter_1_data["order"]):
            existing_chapter_idx = idx
            break

    if existing_chapter_idx is not None:
        print(f"\n⚠️  Chapter 1 already exists, replacing with complete version...")
        chapters_list[existing_chapter_idx] = chapter_formatted
    else:
        print(f"\n✅ Adding new Chapter 1")
        chapters_list.append(chapter_formatted)

    # Save updated curriculum
    with open(curriculum_file, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Curriculum updated!")
    print(f"   File: {curriculum_file}")

    # Display summary
    print(f"\n📊 SUMMARY:")
    print(f"   Chapter: {chapter_formatted['name']}")
    print(f"   Total Lessons: {len(chapter_formatted['lectii'])}")
    print(f"   Total Questions: {sum(len(lesson.get('questions', [])) for lesson in chapter_formatted['lectii'])}")

    print(f"\n   Lessons:")
    for lesson in chapter_formatted['lectii']:
        num_questions = len(lesson.get('questions', []))
        num_sections = len(lesson.get('sections', []))
        print(f"     L{lesson['number']}: {lesson['name'][:50]}...")
        print(f"         Questions: {num_questions}, Sections: {num_sections}")

    print("\n" + "=" * 80)
    print("✅ COMPLETE CHAPTER 1 SUCCESSFULLY INTEGRATED!")
    print("=" * 80)

    return curriculum

if __name__ == '__main__':
    integrate_complete_chapter_1()

