#!/usr/bin/env python3
"""
Integrate Chapter 2 Grade 6 Matematica into curriculum_structure.json
"""

import json

def integrate_grade6_chapter2():
    print("=" * 80)
    print("🔧 INTEGRATING CHAPTER 2 GRADE 6 MATEMATICA INTO CURRICULUM")
    print("=" * 80)

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    print(f"\n📖 Loaded curriculum")

    # Load Chapter 2 Grade 6
    chapter_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_2_GRADE6_MATEMATICA.json'
    with open(chapter_file, 'r', encoding='utf-8') as f:
        chapter_2_data = json.load(f)

    print(f"✅ Loaded Chapter 2 Grade 6: {chapter_2_data['name']}")
    print(f"   Lessons: {len(chapter_2_data['lessons'])}")

    # Get chapters list
    chapters_list = curriculum["Clasa a VI a"]["Matematica"]

    # Create chapter in the right format
    chapter_formatted = {
        "number": str(chapter_2_data["order"]),
        "name": chapter_2_data["name"],
        "description": chapter_2_data.get("description", ""),
        "lectii": []
    }

    # Add all lessons to chapter
    for lesson in chapter_2_data["lessons"]:
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

        # Add tips as section
        lesson_formatted["sections"].append({
            "title": "Sfaturi și trucuri",
            "content": "\n".join([f"• {tip}" for tip in lesson.get("content", {}).get("tips", [])]),
            "order": len(lesson_formatted["sections"]) + 1
        })

        chapter_formatted["lectii"].append(lesson_formatted)

    # Find and add Chapter 2
    existing_idx = None
    for idx, ch in enumerate(chapters_list):
        if ch.get("number") == "2":
            existing_idx = idx
            break

    if existing_idx is not None:
        print(f"\n⚠️  Chapter 2 already exists, replacing...")
        chapters_list[existing_idx] = chapter_formatted
    else:
        print(f"\n✅ Adding new Chapter 2")
        chapters_list.append(chapter_formatted)

    # Save updated curriculum
    with open(curriculum_file, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Curriculum updated!")

    # Display summary
    print(f"\n📊 SUMMARY:")
    print(f"   Chapter: {chapter_formatted['name']}")
    print(f"   Total Lessons: {len(chapter_formatted['lectii'])}")

    total_questions = sum(len(lesson.get('questions', [])) for lesson in chapter_formatted['lectii'])
    print(f"   Total Questions: {total_questions}")

    print(f"\n   Lessons:")
    for lesson in chapter_formatted['lectii']:
        num_questions = len(lesson.get('questions', []))
        num_sections = len(lesson.get('sections', []))
        print(f"     L{lesson['number']}: {lesson['name'][:50]}...")
        print(f"         Questions: {num_questions}, Sections: {num_sections}")

    print("\n" + "=" * 80)
    print("✅ CHAPTER 2 GRADE 6 SUCCESSFULLY INTEGRATED!")
    print("=" * 80)

if __name__ == '__main__':
    integrate_grade6_chapter2()

