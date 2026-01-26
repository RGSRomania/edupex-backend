#!/usr/bin/env python3
"""
Create Matematica Clasa a V-a curriculum structure
Based on standard Romanian math curriculum for grade 5
Will create comprehensive lessons with sections for content to be filled in
"""

import json

def create_matematica_curriculum():
    """
    Create the mathematical curriculum structure for Clasa a V-a
    Following the standard curriculum divisions
    """

    curriculum = {
        "Clasa a V a": {
            "Matematica": []
        }
    }

    # Define the chapters/units for Matematica Clasa a V-a
    chapters = [
        {
            "number": "1",
            "name": "Operații cu numere naturale",
            "lectii": [
                {
                    "number": "1",
                    "name": "Adunarea și scăderea numerelor naturale",
                    "summary": "## Adunarea și Scăderea Numerelor Naturale\n\n### Ce este adunarea?\nAdunarea este operația prin care combinăm două sau mai multe numere pentru a obține o sumă. Simbolul folosit este \"+\".\n\n**Exemplu:** 25 + 15 = 40\n\n### Proprietățile adunării\n- **Asociativitate**: (a + b) + c = a + (b + c)\n- **Comutativitate**: a + b = b + a\n- **Element neutru**: a + 0 = a\n\n### Ce este scăderea?\nScăderea este operația inversă adunării, prin care aflăm diferența dintre două numere. Simbolul folosit este \"-\".\n\n**Exemplu:** 40 - 15 = 25\n\n### Relația dintre adunare și scădere\nDacă a + b = c, atunci c - b = a și c - a = b\n\n### Reguli importante\n- **Minuendul** este primul număr (din care se scade)\n- **Scăzătorul** este al doilea număr (care se scade)\n- **Diferența** este rezultatul\n\n### Aplicații practice\nAdunarea și scăderea sunt folosite în:\n- Calculul costurilor\n- Măsurarea distanțelor\n- Rezolvarea problemelor cotidiene",
                    "sections": [],
                    "questions": [
                        {
                            "questionNumber": 1,
                            "questionText": "Calculează: 235 + 167 = ?",
                            "options": ["A. 402", "B. 392", "C. 412", "D. 382"],
                            "correctAnswerIndex": 0,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 2,
                            "questionText": "Dacă a + 25 = 50, cât este a?",
                            "options": ["A. 15", "B. 25", "C. 35", "D. 75"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 2
                        },
                        {
                            "questionNumber": 3,
                            "questionText": "Care dintre următoarele nu este o proprietate a adunării?",
                            "options": ["A. Comutativitate", "B. Asociativitate", "C. Distributivitate", "D. Element neutru"],
                            "correctAnswerIndex": 2,
                            "nivelDificultate": 3
                        }
                    ]
                },
                {
                    "number": "2",
                    "name": "Înmulțirea numerelor naturale",
                    "summary": "## Înmulțirea Numerelor Naturale\n\n### Ce este înmulțirea?\nÎnmulțirea este operația prin care repetăm o adunare de termeni egali. Simbolul folosit este \"×\" sau \"·\".\n\n**Exemplu:** 5 × 4 = 5 + 5 + 5 + 5 = 20\n\n### Terminologia\n- **Factori**: numerele care se înmulțesc (5 și 4 în exemplul de mai sus)\n- **Produs**: rezultatul înmulțirii (20 în exemplul de mai sus)\n\n### Proprietățile înmulțirii\n- **Comutativitate**: a × b = b × a\n- **Asociativitate**: (a × b) × c = a × (b × c)\n- **Element neutru**: a × 1 = a\n- **Element absorbant**: a × 0 = 0\n- **Distributivitate**: a × (b + c) = a × b + a × c\n\n### Tabla înmulțirii\nEste importantă memorizarea tablei înmulțirii de la 1 la 10 pentru a calcula rapid.\n\n**Exemplu:**\n- 7 × 6 = 42\n- 8 × 9 = 72\n- 9 × 9 = 81\n\n### Ordinea operațiilor\nÎntr-un exercițiu cu mai multe operații:\n1. Mai întâi se efectuează înmulțirile și împărțirile (de la stânga la dreapta)\n2. Apoi se efectuează adunările și scăderile (de la stânga la dreapta)\n\n**Exemplu:** 2 + 3 × 4 = 2 + 12 = 14 (NU 5 × 4 = 20)",
                    "sections": [],
                    "questions": [
                        {
                            "questionNumber": 1,
                            "questionText": "Calculează: 12 × 8 = ?",
                            "options": ["A. 86", "B. 92", "C. 96", "D. 98"],
                            "correctAnswerIndex": 2,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 2,
                            "questionText": "Care este rezultatul: 3 + 2 × 5?",
                            "options": ["A. 25", "B. 13", "C. 15", "D. 11"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 2
                        },
                        {
                            "questionNumber": 3,
                            "questionText": "Dacă a × 0 = 0, care este valoarea lui a?",
                            "options": ["A. 0 exclusiv", "B. Orice număr", "C. 1", "D. Imposibil"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 3
                        }
                    ]
                },
                {
                    "number": "3",
                    "name": "Împărțirea numerelor naturale",
                    "summary": "## Împărțirea Numerelor Naturale\n\n### Ce este împărțirea?\nÎmpărțirea este operația inversă înmulțirii, prin care aflăm de câte ori un număr se cuprinde în altul, sau cum distribuim ceva în părți egale.\n\n**Exemplu:** 20 ÷ 4 = 5 (pentru că 5 × 4 = 20)\n\n### Terminologia\n- **Deîmpărțit**: 20 (numărul care se împarte)\n- **Împărțitor**: 4 (numărul la care se împarte)\n- **Cât**: 5 (rezultatul)\n- **Rest**: diferența atunci când împărțirea nu este exactă\n\n### Relația între înmulțire și împărțire\nDacă a × b = c, atunci c ÷ b = a\n\n**Exemplu:** 6 × 7 = 42, deci 42 ÷ 7 = 6\n\n### Împărțirea exactă vs. cu rest\n- **Exactă**: 24 ÷ 6 = 4 (rest 0)\n- **Cu rest**: 25 ÷ 6 = 4 (rest 1), pentru că 6 × 4 + 1 = 25\n\n### Reguli importante\n- **Nu putem împărți la 0**\n- a ÷ 1 = a (element neutru)\n- a ÷ a = 1 (pentru a ≠ 0)\n- 0 ÷ a = 0 (pentru a ≠ 0)\n\n### Proba împărțirii\nPentru a verifica dacă o împărțire este corectă:\n**Cât × Împărțitor + Rest = Deîmpărțit**\n\n**Exemplu:** 25 ÷ 6 = 4 (rest 1)\nVerificare: 4 × 6 + 1 = 24 + 1 = 25 ✓",
                    "sections": [],
                    "questions": [
                        {
                            "questionNumber": 1,
                            "questionText": "Calculează: 48 ÷ 6 = ?",
                            "options": ["A. 6", "B. 7", "C. 8", "D. 9"],
                            "correctAnswerIndex": 2,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 2,
                            "questionText": "Cât este restul împărțirii 37 ÷ 5?",
                            "options": ["A. 2", "B. 3", "C. 4", "D. 7"],
                            "correctAnswerIndex": 0,
                            "nivelDificultate": 2
                        },
                        {
                            "questionNumber": 3,
                            "questionText": "Pentru a verifica o împărțire, înmulțim catul cu...",
                            "options": ["A. Deîmpărțitul", "B. Împărțitorul", "C. Rezultatul", "D. 10"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 3
                        }
                    ]
                }
            ]
        },
        {
            "number": "2",
            "name": "Divizibilitate",
            "lectii": [
                {
                    "number": "1",
                    "name": "Divizori și multipli",
                    "summary": "## Divizori și Multipli\n\n### Ce sunt divizorii?\nDivizorii unui număr sunt numerele care îl împart exact (fără rest). Se spune că d este divizor al lui a dacă a ÷ d nu are rest.\n\n**Exemplu:** Divizorii lui 12 sunt: 1, 2, 3, 4, 6, 12\nPentru că 12 ÷ 1 = 12, 12 ÷ 2 = 6, 12 ÷ 3 = 4, etc.\n\n### Ce sunt multiplii?\nMultiplii unui număr sunt numerele care se obțin prin înmulțirea lui cu numerele naturale.\n\n**Exemplu:** Multiplii lui 5 sunt: 5, 10, 15, 20, 25, 30, ...\nPentru că 5 × 1 = 5, 5 × 2 = 10, 5 × 3 = 15, etc.\n\n### Relația între divizori și multipli\nDacă d este divizor al lui a, atunci a este multiplu al lui d.\n\n**Exemplu:** 3 este divizor al lui 15, deci 15 este multiplu al lui 3\n\n### Proprietăți importante\n1. Fiecare număr are divizori: 1 și el însuși\n2. Fiecare număr este multiplu al lui 1 și al lui însuși\n3. Un număr poate avea finit mulți divizori, dar infinit mulți multipli\n\n### Notații\n- \"a | b\" înseamnă \"a îl divide pe b\" (a este divizor al lui b)\n- \"a ∤ b\" înseamnă \"a nu îl divide pe b\"\n\n### Aplicații practice\nDivizorii și multiplii sunt folosiți la:\n- Distribuirea în grupe egale\n- Calculul celui mai mare divizor comun (cmmdc)\n- Calculul celui mai mic multiplu comun (cmmmc)",
                    "sections": [],
                    "questions": [
                        {
                            "questionNumber": 1,
                            "questionText": "Care dintre următoarele este divizor al lui 24?",
                            "options": ["A. 5", "B. 7", "C. 8", "D. 10"],
                            "correctAnswerIndex": 2,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 2,
                            "questionText": "Care dintre următoarele este multiplu al lui 6?",
                            "options": ["A. 12", "B. 15", "C. 22", "D. 25"],
                            "correctAnswerIndex": 0,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 3,
                            "questionText": "Câți divizori are numărul 16?",
                            "options": ["A. 2", "B. 3", "C. 4", "D. 5"],
                            "correctAnswerIndex": 3,
                            "nivelDificultate": 2
                        }
                    ]
                }
            ]
        },
        {
            "number": "3",
            "name": "Fracții ordinare",
            "lectii": [
                {
                    "number": "1",
                    "name": "Noțiuni fundamentale despre fracții",
                    "summary": "## Noțiuni Fundamentale despre Fracții\n\n### Ce este o fracție?\nO fracție este o parte dintr-un întreg. Se notează cu a/b unde:\n- **a** este numărătorul (câte părți luăm)\n- **b** este numitorul (în câte părți egale s-a împărțit întregul)\n- **b ≠ 0** (nu putem divide la 0)\n\n**Exemplu:** 3/4 înseamnă că întregul a fost împărțit în 4 părți egale și am luat 3 din ele\n\n### Reprezentarea grafică\nPutem reprezenta fracțiile pe un segment de linie:\n```\n|------|------|------|------|\n0      1/4    2/4    3/4    1\n```\n\n### Tipuri de fracții\n1. **Fracție proprie**: numărătorul < numitorul (3/4, 2/5)\n2. **Fracție improprie**: numărătorul ≥ numitorul (5/4, 7/7)\n3. **Fracție subunitară**: mai mică decât 1 (3/4)\n4. **Fracție echiunitară**: egală cu 1 (5/5)\n5. **Fracție supraunitară**: mai mare decât 1 (7/5)\n\n### Fracții egale\nDouă fracții sunt egale dacă reprezintă aceeași parte din întreg.\n\n**Exemplu:** 2/4 = 3/6 = 4/8 = 1/2\n\nPutem obține fracții egale:\n- Amplificând: înmulțim numărătorul și numitorul cu același număr\n  Exemplu: 1/2 × (3/3) = 3/6\n- Simplificând: împărțim numărătorul și numitorul la același număr\n  Exemplu: 6/9 ÷ (3/3) = 2/3\n\n### Compararea fracțiilor\n- Cu același numitor: 2/5 < 3/5 (comparăm numărătorii)\n- Cu același numărător: 2/3 < 2/5 (mai mic numitor = fracție mai mare)\n- Cu numitori diferiți: aducemi la același numitor",
                    "sections": [],
                    "questions": [
                        {
                            "questionNumber": 1,
                            "questionText": "Care este numitorul fracției 5/8?",
                            "options": ["A. 5", "B. 8", "C. 3", "D. 13"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 2,
                            "questionText": "Care fracție este egală cu 1/3?",
                            "options": ["A. 2/5", "B. 2/6", "C. 3/6", "D. 2/4"],
                            "correctAnswerIndex": 1,
                            "nivelDificultate": 1
                        },
                        {
                            "questionNumber": 3,
                            "questionText": "Care fracție este supraunitară?",
                            "options": ["A. 3/5", "B. 4/4", "C. 7/5", "D. 2/3"],
                            "correctAnswerIndex": 2,
                            "nivelDificultate": 2
                        }
                    ]
                }
            ]
        }
    ]

    curriculum["Clasa a V a"]["Matematica"] = chapters

    return curriculum


def main():
    print("Creating Matematica Clasa a V-a curriculum structure...")
    print("="*70)

    curriculum = create_matematica_curriculum()

    # Save to file
    output_path = "/Users/mdica/PycharmProjects/EduPex/matematica_clasa_va_template.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    # Print summary
    print(f"\n✅ Created Matematica curriculum template")
    print(f"✅ Saved to: {output_path}")

    # Count lessons
    total_chapters = 0
    total_lessons = 0
    total_questions = 0

    for chapter in curriculum["Clasa a V a"]["Matematica"]:
        total_chapters += 1
        for lesson in chapter["lectii"]:
            total_lessons += 1
            total_questions += len(lesson.get("questions", []))

    print(f"\n📊 Statistics:")
    print(f"  Chapters: {total_chapters}")
    print(f"  Lessons: {total_lessons}")
    print(f"  Questions: {total_questions}")

    print(f"\n📝 Structure includes:")
    print(f"  ✅ Chapter 1: Operații cu numere naturale (3 lessons)")
    print(f"  ✅ Chapter 2: Divizibilitate (1 lesson)")
    print(f"  ✅ Chapter 3: Fracții ordinare (1 lesson)")
    print(f"  ✅ Each lesson has: summary, sections array, and 3 questions")

    print(f"\n📌 Next steps:")
    print(f"  1. Manually extract content from Manual MATE.doc")
    print(f"  2. Update lesson summaries with detailed content")
    print(f"  3. Add examples, graphics descriptions, important notes")
    print(f"  4. Create questions specific to the manual content")
    print(f"  5. Run section splitting script to create digestible sections")
    print(f"  6. Merge with main curriculum_structure.json")


if __name__ == '__main__':
    main()

