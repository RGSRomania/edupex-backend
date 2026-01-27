#!/usr/bin/env python3
"""
Extract Chapter 1 Lessons from Planning Document
Create JSON structure matching the curriculum_structure.json format
"""

import json
from pathlib import Path

# Chapter 1 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_1_LESSONS = [
    {
        "order": 1,
        "title": "Scrierea și citirea numerelor naturale",
        "summary": "În această lecție vom învăța cum se scriu și se citesc numerele naturale. Numerele naturale sunt utilizate pentru a număra și pentru a ordona obiecte. Se face utilizând zece cifre arabe: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. În sistemul de numerație zecimal (baza 10), poziția unei cifre determină valoarea acesteia.",
        "content": {
            "theory": [
                "Numerele naturale sunt: 0, 1, 2, 3, 4, 5, ...",
                "Cifra este un simbol folosit pentru a scrie numere. Cifrele arabe sunt: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9",
                "Sistemul de numerație zecimal se bazează pe puteri ale lui 10",
                "Un număr natural se scrie cu ajutorul cifrelor arabe",
                "Valoarea unei cifre depinde de poziția sa în număr (unități, zeci, sute, mii, etc.)",
                "Exemple: 5 = cinci, 27 = douăzeci și șapte, 345 = trei sute patruzeci și cinci"
            ],
            "examples": [
                {
                    "title": "Scris și citire numerelor",
                    "content": "25 se citește: douăzeci și cinci\n103 se citește: o sută trei\n2005 se citește: două mii cinci"
                },
                {
                    "title": "Descompunerea unui număr",
                    "content": "345 = 3 × 100 + 4 × 10 + 5 × 1\n2048 = 2 × 1000 + 0 × 100 + 4 × 10 + 8 × 1"
                }
            ],
            "tips": [
                "Pentru a citi corect un număr cu mai multe cifre, grupează cifrele în clase de trei: mii, sute, zeci, unități",
                "Unitatea de ordinul 1 este cifra din dreapta",
                "Fiecare ordinul are o valoare de 10 ori mai mare decât ordinul anterior"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care este valoarea cifrei 5 în numărul 357?",
                "options": [
                    "5",
                    "50",
                    "500",
                    "5000"
                ],
                "correct": 1,
                "explanation": "În numărul 357, cifra 5 ocupă poziția zecilor, deci valoarea sa este 5 × 10 = 50"
            },
            {
                "id": "L1_Q2",
                "type": "multiple_choice",
                "text": "Cum se scrie cu cifre numărul \"o mie nouă\"?",
                "options": [
                    "109",
                    "1009",
                    "1090",
                    "10009"
                ],
                "correct": 1,
                "explanation": "O mie = 1000, nouă = 9, deci 1000 + 9 = 1009"
            },
            {
                "id": "L1_Q3",
                "type": "multiple_choice",
                "text": "Descompuneți numărul 204 în forma cu puteri ale lui 10",
                "options": [
                    "2 × 10 + 4 × 1",
                    "2 × 100 + 0 × 10 + 4 × 1",
                    "20 × 10 + 4",
                    "2 × 1000 + 4 × 1"
                ],
                "correct": 1,
                "explanation": "204 = 2 × 100 + 0 × 10 + 4 × 1, deoarece 2 este la ordinul sutelor, 0 la ordinul zecilor și 4 la ordinul unităților"
            }
        ]
    },
    {
        "order": 2,
        "title": "Reprezentarea pe axa numerelor. Compararea și ordonarea numerelor naturale",
        "summary": "Numerele naturale se pot reprezenta pe o axă numerică. Axa numerelor ne ajută să vizualizăm numerele și relațiile dintre ele. Pe axa numerelor, numerele cresc de la stânga la dreapta. Compararea numerelor naturale se face folosind semnele: <, =, >",
        "content": {
            "theory": [
                "Axa numerelor este o dreaptă pe care marcăm puncte corespunzătoare numerelor naturale",
                "Pe axa numerelor, numerele sunt dispuse în ordine crescătoare de la stânga la dreapta",
                "Orice număr natural (mai puțin 0) are un predecesor (numărul care îl precede)",
                "Orice număr natural are un succesor (numărul care îl urmează)",
                "Compararea numerelor: dacă a < b, atunci a se află la stânga lui b pe axă",
                "Ordonarea crescătoare: de la cel mai mic la cel mai mare",
                "Ordonarea descrescătoare: de la cel mai mare la cel mai mic"
            ],
            "examples": [
                {
                    "title": "Axa numerelor",
                    "content": "0___1___2___3___4___5___6___7___8___9___10\nObservație: 3 < 5 (3 este la stânga lui 5)\n5 > 3 (5 este la dreapta lui 3)"
                },
                {
                    "title": "Ordonare crescătoare",
                    "content": "12, 7, 25, 3, 18 → 3 < 7 < 12 < 18 < 25"
                },
                {
                    "title": "Ordonare descrescătoare",
                    "content": "12, 7, 25, 3, 18 → 25 > 18 > 12 > 7 > 3"
                }
            ],
            "tips": [
                "Pentru a compara două numere: mai întâi compară numărul de cifre, apoi cifrele pe rând de la stânga la dreapta",
                "Succesor al lui n este n + 1",
                "Predecesor al lui n (pentru n > 0) este n - 1"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Care din aceste numere este mai mic: 245 sau 254?",
                "options": [
                    "245",
                    "254",
                    "Sunt egale",
                    "Nu se pot compara"
                ],
                "correct": 0,
                "explanation": "245 < 254 pentru că la cifra zecilor avem 4 < 5"
            },
            {
                "id": "L2_Q2",
                "type": "multiple_choice",
                "text": "Ordonați crescător: 89, 98, 23, 32",
                "options": [
                    "23, 32, 89, 98",
                    "23, 32, 98, 89",
                    "98, 89, 32, 23",
                    "32, 23, 89, 98"
                ],
                "correct": 0,
                "explanation": "Ordonare crescătoare (de la mic la mare): 23 < 32 < 89 < 98"
            }
        ]
    },
    {
        "order": 3,
        "title": "Adunarea numerelor naturale. Proprietăți",
        "summary": "Adunarea este operația prin care unim două mulțimi disjuncte. Numerele care se adună se numesc termeni, iar rezultatul se numește sumă. Adunarea are proprietăți importante: este comutativă, asociativă și are element neutru.",
        "content": {
            "theory": [
                "Adunarea este operația prin care combinăm două sau mai multe numere",
                "Numerele care se adună se numesc termeni",
                "Rezultatul adunării se numește sumă",
                "Proprietatea comutativă: a + b = b + a (ordinea termenilor nu schimbă rezultatul)",
                "Proprietatea asociativă: (a + b) + c = a + (b + c) (modul de grupare nu schimbă rezultatul)",
                "Element neutru: a + 0 = 0 + a = a (0 nu schimbă valoarea unui număr)"
            ],
            "examples": [
                {
                    "title": "Adunarea simplă",
                    "content": "7 + 5 = 12\n23 + 15 = 38\n100 + 200 = 300"
                },
                {
                    "title": "Proprietatea comutativă",
                    "content": "8 + 3 = 11 și 3 + 8 = 11, deci 8 + 3 = 3 + 8"
                },
                {
                    "title": "Proprietatea asociativă",
                    "content": "(2 + 3) + 4 = 5 + 4 = 9\n2 + (3 + 4) = 2 + 7 = 9\nDeci (2 + 3) + 4 = 2 + (3 + 4)"
                }
            ],
            "tips": [
                "Pentru a aduna numere mari, aliniază cifrele după ordinul lor (unități, zeci, sute)",
                "Adunarea este comutativă - aceasta ne permite să grupăm numerele cum am vrea",
                "Folosim proprietatea comutativă și asociativă pentru a calcula mai ușor"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Care este rezultatul: 27 + 43?",
                "options": [
                    "60",
                    "65",
                    "70",
                    "75"
                ],
                "correct": 1,
                "explanation": "27 + 43 = (20 + 40) + (7 + 3) = 60 + 10 = 70"
            }
        ]
    }
]

def create_chapter_1_json():
    """Create the Chapter 1 JSON for curriculum"""

    chapter_1 = {
        "name": "Operații cu numere naturale",
        "order": 1,
        "description": "În această unitate de învățare, elevii vor aprender despre numerele naturale, operațiile cu acestea și proprietățile acestor operații.",
        "lessons": CHAPTER_1_LESSONS
    }

    return chapter_1

def main():
    print("=" * 80)
    print("📚 CREATING CHAPTER 1 JSON - MATEMATICA CLASA 5")
    print("=" * 80)

    # Create chapter data
    chapter_data = create_chapter_1_json()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Lessons: {len(chapter_data['lessons'])}")

    # Save to file
    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_1_MATEMATICA_CLASA5.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    # Display summary
    print(f"\n📋 CHAPTER 1 LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']}. {lesson['title']}")
        print(f"   Questions: {num_questions}")
        print()

    print("=" * 80)
    print("✅ CHAPTER 1 READY FOR INTEGRATION!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

