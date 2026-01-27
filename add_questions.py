#!/usr/bin/env python3
import json

# Load curriculum
with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

# Template questions for Limba Class VI lesson 5
questions_to_add = [
    {
        "id": "C1_L5_Q1",
        "type": "multiple_choice",
        "text": "Ce este o mulţime în sensul matematic?",
        "options": [
            "O colecţie ordonată de obiecte",
            "O colecţie neordonată de obiecte distincte",
            "Un număr mare",
            "Un set de numere"
        ],
        "correct": 1,
        "explanation": "O mulţime este o colecţie neordonată de obiecte distincte"
    },
    {
        "id": "C1_L5_Q2",
        "type": "multiple_choice",
        "text": "Cum se notează o mulţime în matematică?",
        "options": [
            "Cu paranteze rotunde ()",
            "Cu paranteze pătrate []",
            "Cu acolade {}",
            "Cu paranteze unghiulare <>"
        ],
        "correct": 2,
        "explanation": "Mulţimile se notează cu acolade {}"
    },
    {
        "id": "C1_L5_Q3",
        "type": "multiple_choice",
        "text": "Care dintre următoarele este o mulţime finită?",
        "options": [
            "Mulţimea numerelor naturale",
            "Mulţimea numerelor pare",
            "Mulţimea elevilor din clasa ta",
            "Mulţimea numerelor întregi"
        ],
        "correct": 2,
        "explanation": "Mulţimea elevilor din clasa ta este finită, are un număr determinat de elemente"
    },
    {
        "id": "C1_L5_Q4",
        "type": "multiple_choice",
        "text": "Ce înseamnă că un element aparţine unei mulţimi?",
        "options": [
            "Elementul este mai mic decât mulţimea",
            "Elementul se găseşte în interiorul mulţimii",
            "Elementul este egal cu mulţimea",
            "Elementul este diferit de celelalte"
        ],
        "correct": 1,
        "explanation": "Un element aparţine unei mulţimi dacă se găseşte în interiorul mulţimii"
    },
    {
        "id": "C1_L5_Q5",
        "type": "multiple_choice",
        "text": "Care este cardinalul mulţimii {1, 2, 3, 4, 5}?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correct": 2,
        "explanation": "Cardinalul unei mulţimi este numărul de elemente pe care le conţine. În acest caz, cardinalul este 5"
    },
    {
        "id": "C1_L5_Q6",
        "type": "multiple_choice",
        "text": "Cum se numeşte mulţimea care nu conţine niciun element?",
        "options": [
            "Mulţimea infinită",
            "Mulţimea vidă",
            "Mulţimea universală",
            "Mulţimea complementară"
        ],
        "correct": 1,
        "explanation": "Mulţimea vidă este mulţimea care nu conţine niciun element şi se notează cu ∅"
    },
    {
        "id": "C1_L5_Q7",
        "type": "multiple_choice",
        "text": "Ce este intersecţia a două mulţimi?",
        "options": [
            "Mulţimea tuturor elementelor comune",
            "Mulţimea tuturor elementelor din ambele mulţimi",
            "Mulţimea elementelor care lipsesc",
            "Mulţimea cea mai mare"
        ],
        "correct": 0,
        "explanation": "Intersecţia a două mulţimi conţine doar elementele care aparţin ambelor mulţimi"
    },
    {
        "id": "C1_L5_Q8",
        "type": "multiple_choice",
        "text": "Ce este reuniunea a două mulţimi?",
        "options": [
            "Mulţimea elementelor care lipsesc",
            "Mulţimea tuturor elementelor din ambele mulţimi",
            "Mulţimea elementelor comune",
            "Mulţimea cea mai mică"
        ],
        "correct": 1,
        "explanation": "Reuniunea a două mulţimi conţine toate elementele care aparţin măcar uneia dintre mulţimi"
    }
]

# Access the lesson and update it
try:
    clasa_vi = curriculum["Clasa a VI a"]
    limba = clasa_vi["Limba și literatura română"]
    chapter = limba[0]  # First chapter
    lesson = chapter["lectii"][4]  # Lesson 5 (0-indexed, so 4 is lesson 5)

    # Replace the single question with all 8 questions
    lesson["questions"] = questions_to_add

    # Save back
    with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    print("✅ Successfully added 8 questions to lesson 5!")
    print(f"Total questions in lesson 5: {len(lesson['questions'])}")

except Exception as e:
    print(f"❌ Error: {e}")
    print("Trying alternative keys...")

    # Try to find the lesson with different approaches
    for class_key in curriculum.keys():
        if "VI" in class_key or "6" in class_key:
            class_data = curriculum[class_key]
            for subject_key in class_data.keys():
                if "Limba" in subject_key:
                    print(f"Found: {class_key} -> {subject_key}")
                    subject_data = class_data[subject_key]
                    if isinstance(subject_data, list) and len(subject_data) > 0:
                        chapter = subject_data[0]
                        if "lectii" in chapter:
                            lessons = chapter["lectii"]
                            if len(lessons) > 4:
                                lesson = lessons[4]
                                lesson["questions"] = questions_to_add

                                with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
                                    json.dump(curriculum, f, ensure_ascii=False, indent=2)

                                print(f"✅ Successfully added 8 questions!")
                                break

