#!/usr/bin/env python3
"""
Create Chapter 3 Matematica Clasa VI-a
Based on PLANIFICARE DIDACTICĂ
Chapter 3: Mulțimea numerelor întregi
"""

import json

# Chapter 3 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_3_LESSONS = [
    {
        "order": 1,
        "title": "Mulțimea numerelor întregi. Opusul unui număr întreg. Reprezentarea pe axa numerelor. Modulul unui număr întreg. Compararea și ordonarea numerelor întregi",
        "summary": "**Mulțimea numerelor întregi** (notată ℤ) include numerele pozitive, negative și zero. Orice **întreg** are un **opus** (de semn contrar). Numerele întregi se reprezintă pe o **axă numerică** și pot fi **comparate** și **ordonate**. **Modulul** (valoarea absolută) unui întreg este distanța sa de la zero.",
        "content": {
            "theory": [
                "**Mulțimea numerelor întregi**: ℤ = {..., -3, -2, -1, 0, 1, 2, 3, ...}",
                "**Numere pozitive**: 1, 2, 3, ... (mai mari decât 0)",
                "**Numere negative**: -1, -2, -3, ... (mai mici decât 0)",
                "**Zero**: nici pozitiv, nici negativ",
                "**Opusul unui întreg n**: -n (de exemplu, opusul lui 5 este -5)",
                "**Axa numerelor**: linie cu numere în ordine, cu 0 în centru",
                "**Modulul (valoarea absolută)** lui a: |a| = distanța de la a la 0",
                "|5| = 5, |-5| = 5, |0| = 0",
                "**Comparare**: pe axa, numerele cresc de la stânga la dreapta",
                "-5 < -2 < 0 < 3 < 7"
            ],
            "examples": [
                {
                    "title": "Numere întregi în viață",
                    "content": "Temperatură: -10°C (sub zero), +25°C (deasupra zero)\nAltitudine: -100m (sub nivelul mării), +500m (deasupra nivelului mării)\nCont bancar: -50 lei (datorat), +200 lei (credit)"
                },
                {
                    "title": "Opusuri și modul",
                    "content": "-7 și 7 sunt opuse\n-3 și 3 sunt opuse\n|-7| = 7, |7| = 7, |-3| = 3, |3| = 3"
                },
                {
                    "title": "Comparare pe axa numerelor",
                    "content": "-10___-5___0___3___8___15\n-10 < -5, -5 < 0, 0 < 3, 3 < 8, 8 < 15"
                }
            ],
            "tips": [
                "Opusurile au același modul dar semne opuse",
                "Pe axa numerelor, stânga = mai mic, dreapta = mai mare",
                "Modul e întotdeauna pozitiv sau zero"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care este opusul numărului -8?",
                "options": ["8", "-8", "0", "1"],
                "correct": 0,
                "explanation": "Opusul lui -8 este 8 (același modul, semn opus)"
            },
            {
                "id": "L1_Q2",
                "type": "multiple_choice",
                "text": "Care este |-7|?",
                "options": ["7", "-7", "0", "14"],
                "correct": 0,
                "explanation": "|-7| = 7 (distanța de la -7 la 0 pe axa numerelor)"
            }
        ]
    },
    {
        "order": 2,
        "title": "Adunarea numerelor întregi. Proprietăți",
        "summary": "**Adunarea numerelor întregi** urmează reguli specifice pentru numere cu semne diferite. Dacă ambele sunt pozitive/negative, se adună modulele. Dacă au semne opuse, se scade modulul mai mic din cel mai mare și se ia semnul numărului cu modul mai mare.",
        "content": {
            "theory": [
                "**Regula 1**: Dacă ambele numere au același semn, se adună modulele și se păstrează semnul",
                "(+5) + (+3) = +8, (-5) + (-3) = -8",
                "**Regula 2**: Dacă numerele au semne opuse, se scade modulul mai mic din cel mai mare",
                "Semnul rezultatului este al numărului cu modul mai mare",
                "(+7) + (-3) = +4, (-7) + (+3) = -4",
                "**Proprietatea comutativă**: a + b = b + a",
                "**Proprietatea asociativă**: (a + b) + c = a + (b + c)",
                "**Element neutru**: a + 0 = a",
                "**Element opus**: a + (-a) = 0"
            ],
            "examples": [
                {
                    "title": "Ambele pozitive sau ambele negative",
                    "content": "(+5) + (+3) = +8\n(-5) + (-3) = -8\n(+2) + (+6) = +8"
                },
                {
                    "title": "Semne opuse",
                    "content": "(+7) + (-3) = +4 (7 > 3, deci rezultat pozitiv)\n(-7) + (+3) = -4 (7 > 3, deci rezultat negativ)\n(+5) + (-5) = 0"
                },
                {
                    "title": "Aplicație practică",
                    "content": "Cont: +200 lei, apoi se retrage -50 lei\n200 + (-50) = 150 lei"
                }
            ],
            "tips": [
                "Dacă semnele sunt aceleași: adună modulele",
                "Dacă semnele sunt opuse: scade modulele",
                "Notul rezultatului depinde de care modul e mai mare"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (-5) + 3",
                "options": ["-8", "-2", "8", "2"],
                "correct": 1,
                "explanation": "Semne opuse: |−5| − |3| = 5 − 3 = 2, semn negativ (5 > 3) → -2"
            }
        ]
    },
    {
        "order": 3,
        "title": "Scăderea numerelor întregi",
        "summary": "**Scăderea** numerelor întregi se transformă în **adunare** cu opusul. Pentru a scădea un întreg, se adună opusul său. a - b = a + (-b).",
        "content": {
            "theory": [
                "**Regula scăderii**: a - b = a + (-b)",
                "Scaderea întregi se transformă în adunare cu opusul",
                "(+5) - (+3) = (+5) + (-3) = +2",
                "(-5) - (-3) = (-5) + (+3) = -2",
                "(+5) - (-3) = (+5) + (+3) = +8",
                "(-5) - (+3) = (-5) + (-3) = -8",
                "După transformare în adunare, se aplică regulile adunării",
                "Scăderea nu e comutativă: a - b ≠ b - a (în general)"
            ],
            "examples": [
                {
                    "title": "Transformare în adunare",
                    "content": "7 - 5 = 7 + (-5) = 2\n-7 - 5 = -7 + (-5) = -12\n7 - (-5) = 7 + 5 = 12"
                },
                {
                    "title": "Aplicație practică",
                    "content": "Temperatură: era 5°C, scade cu 8°C\n5 - 8 = 5 + (-8) = -3°C"
                }
            ],
            "tips": [
                "Transformă scăderea în adunare cu opusul",
                "Apoi aplică regulile adunării",
                "Atenție la semne!"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (-3) - (-7)",
                "options": ["-10", "4", "-4", "10"],
                "correct": 1,
                "explanation": "(-3) - (-7) = (-3) + 7 = 4"
            }
        ]
    },
    {
        "order": 4,
        "title": "Înmulțirea numerelor întregi. Proprietăți",
        "summary": "**Înmulțirea numerelor întregi** depinde de semnele factorilor. **Pozitiv × pozitiv = pozitiv**, **negativ × negativ = pozitiv**, **pozitiv × negativ = negativ**. Se notează regula semnelor: **+ × + = +, - × - = +, + × - = -, - × + = -**.",
        "content": {
            "theory": [
                "**Regula semnelor pentru înmulțire:**",
                "Pozitiv × Pozitiv = Pozitiv: (+5) × (+3) = +15",
                "Negativ × Negativ = Pozitiv: (-5) × (-3) = +15",
                "Pozitiv × Negativ = Negativ: (+5) × (-3) = -15",
                "Negativ × Pozitiv = Negativ: (-5) × (+3) = -15",
                "**Proprietatea comutativă**: a × b = b × a",
                "**Proprietatea asociativă**: (a × b) × c = a × (b × c)",
                "**Element neutru**: a × 1 = a",
                "**Element absorbant**: a × 0 = 0",
                "**Proprietatea distributivă**: a × (b + c) = a × b + a × c"
            ],
            "examples": [
                {
                    "title": "Aceleași semne",
                    "content": "(+4) × (+3) = +12\n(-4) × (-3) = +12"
                },
                {
                    "title": "Semne opuse",
                    "content": "(+4) × (-3) = -12\n(-4) × (+3) = -12"
                },
                {
                    "title": "Cu zero",
                    "content": "5 × 0 = 0\n(-7) × 0 = 0"
                }
            ],
            "tips": [
                "Același semn → rezultat pozitiv",
                "Semne opuse → rezultat negativ",
                "Orice × 0 = 0"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (-6) × (-5)",
                "options": ["-30", "30", "11", "-11"],
                "correct": 1,
                "explanation": "Negativ × Negativ = Pozitiv: (-6) × (-5) = 30"
            }
        ]
    },
    {
        "order": 5,
        "title": "Împărțirea numerelor întregi",
        "summary": "**Împărțirea numerelor întregi** urmează aceleași reguli de semne ca și înmulțirea. Împărțirea unui întreg la altul (non-zero) se face prin operație inversă a înmulțirii. Nu se poate împărți la zero.",
        "content": {
            "theory": [
                "**Regula semnelor pentru împărțire:** aceeași ca la înmulțire",
                "Pozitiv ÷ Pozitiv = Pozitiv: (+12) ÷ (+3) = +4",
                "Negativ ÷ Negativ = Pozitiv: (-12) ÷ (-3) = +4",
                "Pozitiv ÷ Negativ = Negativ: (+12) ÷ (-3) = -4",
                "Negativ ÷ Pozitiv = Negativ: (-12) ÷ (+3) = -4",
                "**Nu se poate împărți la zero!**",
                "Verificare: dacă a ÷ b = c, atunci a = b × c",
                "Împărțirea nu e comutativă și nici asociativă"
            ],
            "examples": [
                {
                    "title": "Aceleași semne",
                    "content": "(+20) ÷ (+4) = +5\n(-20) ÷ (-4) = +5"
                },
                {
                    "title": "Semne opuse",
                    "content": "(+20) ÷ (-4) = -5\n(-20) ÷ (+4) = -5"
                },
                {
                    "title": "Verificare",
                    "content": "(-12) ÷ 3 = -4 (verific: -4 × 3 = -12 ✓)"
                }
            ],
            "tips": [
                "Aceleași reguli de semne ca la înmulțire",
                "Verifica prin înmulțire inversă",
                "Nu uita: nu se divide la 0!"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (-24) ÷ 6",
                "options": ["-4", "4", "-6", "6"],
                "correct": 0,
                "explanation": "Negativ ÷ Pozitiv = Negativ: (-24) ÷ 6 = -4"
            }
        ]
    },
    {
        "order": 6,
        "title": "Puterea cu exponent număr natural a unui număr întreg nenul. Reguli de calcul cu puteri",
        "summary": "**Puterea unui întreg** se calculează ca înmulțire repetată. Pentru numere negative, semnul rezultatului depinde dacă exponentul e par sau impar. **Exponenți pari** dau rezultat **pozitiv**, **exponenți impari** păstrează **semnul bazei**.",
        "content": {
            "theory": [
                "**Putere cu exponent natural**: a^n = a × a × ... × a (de n ori)",
                "**Bază negativă, exponent par**: (-a)^(2n) = a^(2n) (rezultat pozitiv)",
                "(-2)^4 = 16, (-3)^2 = 9",
                "**Bază negativă, exponent impar**: (-a)^(2n+1) = -a^(2n+1) (rezultat negativ)",
                "(-2)^3 = -8, (-3)^5 = -243",
                "**a^0 = 1** (pentru a ≠ 0)",
                "**a^1 = a**",
                "**Reguli de calcul:**",
                "a^m × a^n = a^(m+n), a^m ÷ a^n = a^(m-n), (a^m)^n = a^(m×n)"
            ],
            "examples": [
                {
                    "title": "Exponenți pari",
                    "content": "(-2)^2 = 4\n(-3)^4 = 81\n(-1)^6 = 1"
                },
                {
                    "title": "Exponenți impari",
                    "content": "(-2)^3 = -8\n(-3)^5 = -243\n(-1)^7 = -1"
                },
                {
                    "title": "Reguli de calcul",
                    "content": "(-2)^3 × (-2)^2 = (-2)^5 = -32\n(-3)^4 ÷ (-3)^2 = (-3)^2 = 9"
                }
            ],
            "tips": [
                "Exponent par → rezultat POZITIV",
                "Exponent impar → rezultat cu semnul bazei",
                "Aplică regulile pentru a simplifica"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (-3)^2",
                "options": ["-9", "9", "-6", "6"],
                "correct": 1,
                "explanation": "Exponent par: (-3)^2 = (-3) × (-3) = 9"
            }
        ]
    },
    {
        "order": 7,
        "title": "Ordinea efectuării operațiilor și folosirea parantezelor",
        "summary": "**Ordinea operațiilor** (PEMDAS): Parantezele, Exponenții, Înmulțirea și Împărțirea (stânga-dreapta), Adunarea și Scăderea (stânga-dreapta). **Parantezele** schimbă ordinea naturală a calculelor.",
        "content": {
            "theory": [
                "**Ordinea operațiilor (fără paranteze):**",
                "1. Puteri (exponenți)",
                "2. Înmulțire și Împărțire (de la stânga la dreapta)",
                "3. Adunare și Scădere (de la stânga la dreapta)",
                "**Parantezele** se rezolvă mai întâi:",
                "1. Paranteze rotunde ( )",
                "2. Paranteze pătrate [ ]",
                "3. Acolade { }",
                "În paranteze nesate, se rezolvă de la interior la exterior"
            ],
            "examples": [
                {
                    "title": "Fără paranteze",
                    "content": "5 + 3 × 2 = 5 + 6 = 11 (nu 16!)\n20 - 8 ÷ 2 = 20 - 4 = 16\n2 × (-3)^2 = 2 × 9 = 18"
                },
                {
                    "title": "Cu paranteze",
                    "content": "(5 + 3) × 2 = 8 × 2 = 16\n[20 - (8 ÷ 2)] = [20 - 4] = 16"
                }
            ],
            "tips": [
                "Parantezele schimbă ordinea naturală",
                "Lucreaza în parantezele nesate de la interior la exterior",
                "Verifica cu exemple"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 10 - 2 × 3",
                "options": ["24", "4", "12", "10"],
                "correct": 1,
                "explanation": "Înmulțire mai întâi: 2 × 3 = 6, apoi 10 - 6 = 4"
            }
        ]
    },
    {
        "order": 8,
        "title": "Ecuații în mulțimea numerelor întregi",
        "summary": "O **ecuație** este o egalitate cu una sau mai multe necunoscute. **Soluția** ecuației este valoarea necunoscutei care face egalitatea adevărată. Se rezolvă prin **izolarea** necunoscutei.",
        "content": {
            "theory": [
                "**Ecuație**: egalitate cu o necunoscută, notată cu x, y, etc.",
                "**Soluție**: valoare a necunoscutei care satisface ecuația",
                "**Rezolvare**: izolarea necunoscutei pe o parte a ecuației",
                "**Proprietăți** (păstrează soluțiile):",
                "Adunare/Scădere: dacă a = b, atunci a + c = b + c",
                "Înmulțire: dacă a = b, atunci a × c = b × c (pentru c ≠ 0)",
                "**Pași de rezolvare:**",
                "1. Adună/scade pentru a izola termenii cu x",
                "2. Înmulțește/împarte pentru a afla x"
            ],
            "examples": [
                {
                    "title": "Ecuație simplă",
                    "content": "x + 5 = 12\nx = 12 - 5\nx = 7"
                },
                {
                    "title": "Ecuație cu înmulțire",
                    "content": "3x = 15\nx = 15 ÷ 3\nx = 5"
                },
                {
                    "title": "Ecuație mai complexă",
                    "content": "2x - 3 = 7\n2x = 7 + 3\n2x = 10\nx = 5"
                }
            ],
            "tips": [
                "Operațiile inverse: + și -, × și ÷",
                "Verifică soluția în ecuația inițială",
                "Pași sistematici"
            ]
        },
        "questions": [
            {
                "id": "L8_Q1",
                "type": "multiple_choice",
                "text": "Rezolvă: x - 4 = -1",
                "options": ["-5", "3", "5", "-3"],
                "correct": 2,
                "explanation": "x = -1 + 4 = 3. Verific: 3 - 4 = -1 ✓"
            }
        ]
    },
    {
        "order": 9,
        "title": "Inecuații în mulțimea numerelor întregi. Probleme rezolvabile cu ajutorul ecuațiilor și inecuațiilor",
        "summary": "O **inecuație** este o inegalitate cu o necunoscută. Se rezolvă similar cu ecuațiile, dar cu o diferență importantă: **înmulțirea/împărțirea cu număr negativ schimbă sensul inegalității**.",
        "content": {
            "theory": [
                "**Inecuație**: inegalitate cu o necunoscută (x < 5, x > -2, x ≤ 10, etc.)",
                "**Mulțimea soluțiilor**: toate valorile care satisfac inecuația",
                "**Reguli** (asemănătoare ecuațiilor, cu o excepție):",
                "Adunare/Scădere: dacă a < b, atunci a + c < b + c",
                "Înmulțire cu POZITIV: dacă a < b și c > 0, atunci a×c < b×c",
                "Înmulțire cu NEGATIV: dacă a < b și c < 0, atunci a×c > b×c (SE SCHIMBĂ!)",
                "**Reprezentare grafică**: pe axa numerelor sau interval"
            ],
            "examples": [
                {
                    "title": "Inecuație simplă",
                    "content": "x + 3 > 5\nx > 5 - 3\nx > 2\nSoluții: {3, 4, 5, ...}"
                },
                {
                    "title": "Cu schimbare de semn",
                    "content": "-2x < 6\nx > 6 ÷ (-2) = -3 (se schimbă < în >)\nx > -3"
                },
                {
                    "title": "Problemă aplicată",
                    "content": "Un autobuz cu locuri pentru 50 pasageri are x pasageri.\nLocuri rămase: 50 - x > 5\n-x > 5 - 50\n-x > -45\nx < 45"
                }
            ],
            "tips": [
                "Atenție: înmulțire/împărțire cu negativ schimbă semnul inegalității!",
                "Verifica soluția",
                "Reprezintă grafic pe axa numerelor"
            ]
        },
        "questions": [
            {
                "id": "L9_Q1",
                "type": "multiple_choice",
                "text": "Rezolvă: x + 2 ≥ -1",
                "options": [
                    "x ≥ 1",
                    "x ≥ -3",
                    "x ≤ -3",
                    "x ≤ 1"
                ],
                "correct": 1,
                "explanation": "x ≥ -1 - 2, deci x ≥ -3"
            }
        ]
    }
]

def create_chapter_3_grade6():
    """Create complete Chapter 3 for Grade 6"""

    chapter_3 = {
        "name": "Mulțimea numerelor întregi",
        "order": 3,
        "description": "Capitolul 3 introduce mulțimea numerelor întregi (pozitive, negative, și zero). Se studiază operații (adunare, scădere, înmulțire, împărțire), puteri, și aplicații în ecuații și inecuații.",
        "lessons": CHAPTER_3_LESSONS
    }

    return chapter_3

def main():
    print("=" * 80)
    print("📚 CREATING CHAPTER 3 - MATEMATICA CLASA VI-a")
    print("=" * 80)

    chapter_data = create_chapter_3_grade6()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Total lessons: {len(chapter_data['lessons'])}")

    total_questions = sum(len(lesson.get('questions', [])) for lesson in chapter_data['lessons'])
    print(f"   Total questions: {total_questions}")

    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_3_GRADE6_MATEMATICA.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    print(f"\n📋 CHAPTER 3 LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']}. {lesson['title'][:60]}")
        print(f"   Questions: {num_questions}")

    print("\n" + "=" * 80)
    print("✅ CHAPTER 3 GRADE 6 READY!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

