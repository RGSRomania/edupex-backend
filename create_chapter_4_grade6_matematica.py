#!/usr/bin/env python3
"""
Create Chapter 4 Matematica Clasa VI-a
Based on PLANIFICARE DIDACTICĂ
Chapter 4: Mulțimea numerelor raționale
"""

import json

# Chapter 4 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_4_LESSONS = [
    {
        "order": 1,
        "title": "Număr rațional. Mulțimea numerelor raționale. Reprezentarea pe axa numerelor. Opusul și modulul unui număr rațional. Compararea și ordonarea numerelor raționale",
        "summary": "**Numerele raționale** (notate ℚ) sunt numere care pot fi exprimate ca fracție a/b, unde a și b sunt întregi și b ≠ 0. Includ fracții, zecimale și numere întregi. Se pot representa pe o **axă numerică**, compara și ordona. Fiecare rațional are un **opus** și un **modul**.",
        "content": {
            "theory": [
                "**Număr rațional**: orice număr care se poate scrie ca a/b, unde a, b ∈ ℤ, b ≠ 0",
                "**Mulțimea numerelor raționale**: ℚ = {a/b | a, b ∈ ℤ, b ≠ 0}",
                "ℕ ⊂ ℤ ⊂ ℚ (naturale ⊂ întregi ⊂ raționale)",
                "**Fracții echivalente**: a/b = c/d dacă a×d = b×c",
                "**Forma ireductibilă**: fracție unde cmmdc(a,b) = 1",
                "**Opusul**: opusul lui a/b este -a/b",
                "**Modulul (valoare absolută)**: |a/b| = |a|/|b|",
                "**Comparare pe axa**: crescător de la stânga la dreapta",
                "**Reprezentare**: puncte pe axa numerelor corespunzătoare valorilor raționale"
            ],
            "examples": [
                {
                    "title": "Numere raționale",
                    "content": "1/2, 3/4, -5/3, 0, 7 (ca 7/1), -2.5 (ca -5/2)"
                },
                {
                    "title": "Fracții echivalente",
                    "content": "1/2 = 2/4 = 3/6 = 5/10\n3/4 = 6/8 = 9/12"
                },
                {
                    "title": "Forma ireductibilă",
                    "content": "12/18 = (12÷6)/(18÷6) = 2/3\n15/25 = (15÷5)/(25÷5) = 3/5"
                }
            ],
            "tips": [
                "Fiecare întreg e și rațional (a = a/1)",
                "Orice rațional se poate scrie ca zecimală terminată sau periodică",
                "Forma ireductibilă e mai simplă de folosit"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care este opusul raționalului 3/4?",
                "options": ["4/3", "-3/4", "3/4", "1/4"],
                "correct": 1,
                "explanation": "Opusul lui 3/4 este -3/4"
            }
        ]
    },
    {
        "order": 2,
        "title": "Adunarea numerelor raționale. Proprietăți. Scăderea numerelor raționale",
        "summary": "**Adunarea raționalelor** cu același numitor se face adunând numărătorii. Pentru numitori diferiți, se aduc la același numitor. **Scăderea** se transformă în adunare cu opusul. Adunarea are proprietăți: comutativă, asociativă, element neutru, element opus.",
        "content": {
            "theory": [
                "**Adunare cu același numitor**: a/b + c/b = (a+c)/b",
                "**Adunare cu numitori diferiți**: aduci la același numitor (preferabil cmmmc)",
                "Pasul 1: Găsește cmmmc(b, d)",
                "Pasul 2: Amplifică fiecare fracție cu cât trebuie",
                "Pasul 3: Adună numărătorii",
                "**Scădere**: a/b - c/d = a/b + (-c/d)",
                "**Proprietatea comutativă**: a/b + c/d = c/d + a/b",
                "**Proprietatea asociativă**: (a/b + c/d) + e/f = a/b + (c/d + e/f)",
                "**Element neutru**: a/b + 0 = a/b",
                "**Element opus**: a/b + (-a/b) = 0"
            ],
            "examples": [
                {
                    "title": "Adunare cu același numitor",
                    "content": "1/5 + 2/5 = 3/5\n3/7 - 1/7 = 2/7"
                },
                {
                    "title": "Adunare cu numitori diferiți",
                    "content": "1/2 + 1/3 = 3/6 + 2/6 = 5/6\n2/3 + 3/4 = 8/12 + 9/12 = 17/12"
                },
                {
                    "title": "Scădere",
                    "content": "5/6 - 1/6 = 4/6 = 2/3\n3/4 - 1/3 = 9/12 - 4/12 = 5/12"
                }
            ],
            "tips": [
                "Găsește cmmmc pentru numitori uși diferit",
                "Amplifică, nu arunca cu numitorul",
                "Simplifica rezultatul dacă e posibil"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 1/3 + 1/6",
                "options": ["1/2", "2/6", "2/9", "2/3"],
                "correct": 0,
                "explanation": "1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2"
            }
        ]
    },
    {
        "order": 3,
        "title": "Înmulțirea numerelor raționale. Proprietăți",
        "summary": "**Înmulțirea raționalelor**: (a/b) × (c/d) = (a×c)/(b×d). Poate simplifica înainte de a înmulți. Semn rezultat: regula semnelor ca la întregi. Are proprietăți: comutativă, asociativă, element neutru (1), distributivă.",
        "content": {
            "theory": [
                "**Înmulțire**: (a/b) × (c/d) = (a×c)/(b×d)",
                "**Simplificare încrucișată**: dacă a și d au factor comun, simplifică",
                "Exemplu: (2/5) × (3/4) = (2×3)/(5×4) = 6/20 = 3/10",
                "Sau: (2/5) × (3/4) = (1/5) × (3/2) = 3/10 (după simplificare)",
                "**Regula semnelor**: identică ca la întregi (+ × + = +, - × - = +, etc.)",
                "**Proprietatea comutativă**: (a/b) × (c/d) = (c/d) × (a/b)",
                "**Proprietatea asociativă**: [(a/b) × (c/d)] × (e/f) = (a/b) × [(c/d) × (e/f)]",
                "**Element neutru**: (a/b) × 1 = a/b",
                "**Element absorbant**: (a/b) × 0 = 0",
                "**Proprietatea distributivă**: (a/b) × [(c/d) + (e/f)] = (a/b) × (c/d) + (a/b) × (e/f)"
            ],
            "examples": [
                {
                    "title": "Înmulțire simplă",
                    "content": "(2/3) × (4/5) = 8/15\n(3/4) × (2/3) = 6/12 = 1/2"
                },
                {
                    "title": "Cu simplificare",
                    "content": "(3/5) × (5/6) = (3×5)/(5×6) = 15/30 = 1/2\nSau: (3/5) × (5/6) = (1/1) × (1/2) = 1/2 (după simplificare)"
                },
                {
                    "title": "Cu semne",
                    "content": "(-2/3) × (3/4) = -6/12 = -1/2\n(-1/2) × (-3/4) = 3/8"
                }
            ],
            "tips": [
                "Simplificare încrucișată înainte de a înmulți e mai ușor",
                "Fii atent la semne",
                "Rezultatul trebuie în formă ireductibilă"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (1/2) × (2/3)",
                "options": ["1/6", "2/6", "1/3", "2/5"],
                "correct": 2,
                "explanation": "(1/2) × (2/3) = 2/6 = 1/3"
            }
        ]
    },
    {
        "order": 4,
        "title": "Împărțirea numerelor raționale",
        "summary": "**Împărțirea raționalelor**: (a/b) ÷ (c/d) = (a/b) × (d/c). Inverseaza al doilea rațional și înmulțește. Regula semnelor: identică cu înmulțirea.",
        "content": {
            "theory": [
                "**Regula împărțirii**: (a/b) ÷ (c/d) = (a/b) × (d/c)",
                "Pasul 1: Inverseaza al doilea rațional (numărător și numitor se schimbă)",
                "Pasul 2: Înmulțește cu reciprocul",
                "**Reciprocul lui a/b**: b/a (pentru a ≠ 0)",
                "**Regula semnelor**: identică cu înmulțirea",
                "**Nu se poate împărți la 0!**",
                "Verificare: dacă a ÷ b = c, atunci a = b × c"
            ],
            "examples": [
                {
                    "title": "Împărțire simplă",
                    "content": "(3/4) ÷ (2/5) = (3/4) × (5/2) = 15/8\n(2/3) ÷ (4/9) = (2/3) × (9/4) = 18/12 = 3/2"
                },
                {
                    "title": "Cu semne",
                    "content": "(-3/4) ÷ (1/2) = (-3/4) × (2/1) = -6/4 = -3/2\n(-1/2) ÷ (-3/4) = (-1/2) × (-4/3) = 4/6 = 2/3"
                },
                {
                    "title": "Verificare",
                    "content": "(3/4) ÷ (2/3) = 9/8\nVerific: (9/8) × (2/3) = 18/24 = 3/4 ✓"
                }
            ],
            "tips": [
                "Inverseaza și înmulțește!",
                "Nu uita: reciprocul lui a/b e b/a",
                "Verifica prin înmulțire inversă"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (2/3) ÷ (4/5)",
                "options": ["8/15", "10/12", "5/6", "6/5"],
                "correct": 2,
                "explanation": "(2/3) ÷ (4/5) = (2/3) × (5/4) = 10/12 = 5/6"
            }
        ]
    },
    {
        "order": 5,
        "title": "Puterea cu exponent număr întreg a unui număr rațional nenul. Reguli de calcul cu puteri",
        "summary": "**Puterea unui rațional**: (a/b)^n = a^n / b^n. Exponenți negativi: (a/b)^(-n) = (b/a)^n. Reguli: produsul și raportul exponenților, puterea unei puteri, regulile semnelor (exponent par/impar).",
        "content": {
            "theory": [
                "**Putere cu exponent pozitiv**: (a/b)^n = a^n / b^n",
                "(1/2)^3 = 1/8, (2/3)^2 = 4/9",
                "**Putere cu exponent negativ**: (a/b)^(-n) = (b/a)^n",
                "(1/2)^(-2) = (2/1)^2 = 4",
                "(2/3)^(-1) = 3/2",
                "**Exponent 0**: (a/b)^0 = 1 (pentru a/b ≠ 0)",
                "**Exponent 1**: (a/b)^1 = a/b",
                "**Reguli de calcul:**",
                "a^m × a^n = a^(m+n)",
                "a^m ÷ a^n = a^(m-n)",
                "(a^m)^n = a^(m×n)",
                "(a × b)^n = a^n × b^n",
                "(a ÷ b)^n = a^n ÷ b^n"
            ],
            "examples": [
                {
                    "title": "Exponenți pozitivi",
                    "content": "(1/2)^3 = 1^3 / 2^3 = 1/8\n(2/3)^2 = 4/9\n(-1/2)^2 = 1/4 (exponent par → pozitiv)\n(-1/2)^3 = -1/8 (exponent impar → negativ)"
                },
                {
                    "title": "Exponenți negativi",
                    "content": "(2/3)^(-1) = 3/2\n(1/2)^(-3) = 2^3 = 8\n(2/5)^(-2) = (5/2)^2 = 25/4"
                },
                {
                    "title": "Reguli",
                    "content": "(1/2)^3 × (1/2)^2 = (1/2)^5 = 1/32\n[(1/2)^2]^3 = (1/2)^6 = 1/64"
                }
            ],
            "tips": [
                "Exponent negativ → inverseaza baza",
                "Exponent par → rezultat pozitiv",
                "Exponent impar → semn bazei"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (1/2)^3",
                "options": ["1/6", "3/2", "1/8", "1/2"],
                "correct": 2,
                "explanation": "(1/2)^3 = 1^3 / 2^3 = 1/8"
            }
        ]
    },
    {
        "order": 6,
        "title": "Ordinea efectuării operațiilor și folosirea parantezelor",
        "summary": "**Ordinea operațiilor cu raționale**: 1. Parantezele, 2. Puteri, 3. Înmulțire și Împărțire (stânga-dreapta), 4. Adunare și Scădere (stânga-dreapta). Reguli identice cu numere întregi și naturale.",
        "content": {
            "theory": [
                "**Ordinea operațiilor (fără paranteze):**",
                "1. Puteri",
                "2. Înmulțire și Împărțire (de la stânga la dreapta)",
                "3. Adunare și Scădere (de la stânga la dreapta)",
                "**Parantezele**: se rezolvă mai întâi",
                "Paranteze nesate: de la interior la exterior",
                "Tipuri: ( ), [ ], { }"
            ],
            "examples": [
                {
                    "title": "Fără paranteze",
                    "content": "1/2 + 1/3 × 2 = 1/2 + 2/3 = 3/6 + 4/6 = 7/6\n(3/4 - 1/2) × 2 ≠ 3/4 - 1/2 × 2"
                },
                {
                    "title": "Cu paranteze",
                    "content": "(1/2 + 1/3) × 2 = (3/6 + 2/6) × 2 = (5/6) × 2 = 10/6 = 5/3"
                }
            ],
            "tips": [
                "Parantezele sunt importanți!",
                "Lucreaza sistematic",
                "Verifica cu substituție"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 1/2 + 1/4 ÷ 1/2",
                "options": ["3/4", "1", "1/2", "2"],
                "correct": 1,
                "explanation": "Îm... (1/4 ÷ 1/2) = (1/4) × (2/1) = 1/2, apoi 1/2 + 1/2 = 1"
            }
        ]
    },
    {
        "order": 7,
        "title": "Ecuații cu numere raționale",
        "summary": "**Ecuații cu raționale** sunt rezolvate similar cu ecuații întregi. Se izolează necunoscuta prin operații inverse. După rezolvare, soluția este o valoare rațională.",
        "content": {
            "theory": [
                "**Ecuație**: egalitate cu o necunoscută",
                "**Soluție**: valoare rațională care satisface ecuația",
                "**Rezolvare**: izolarea necunoscutei pe o parte",
                "**Operații inverse:**",
                "Adunare ↔ Scădere",
                "Înmulțire ↔ Împărțire"
            ],
            "examples": [
                {
                    "title": "Ecuație cu fracții",
                    "content": "x + 1/2 = 3/4\nx = 3/4 - 1/2 = 3/4 - 2/4 = 1/4"
                },
                {
                    "title": "Ecuație cu înmulțire",
                    "content": "(2/3) × x = 4/9\nx = (4/9) ÷ (2/3) = (4/9) × (3/2) = 12/18 = 2/3"
                }
            ],
            "tips": [
                "Aduci la același numitor",
                "Izolează x sistematic",
                "Verifica soluția în ecuația inițială"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "Rezolvă: x - 1/3 = 1/6",
                "options": ["1/6", "1/3", "1/2", "-1/6"],
                "correct": 2,
                "explanation": "x = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2"
            }
        ]
    },
    {
        "order": 8,
        "title": "Probleme rezolvabile folosind ecuații",
        "summary": "**Probleme cu ecuații raționale**: Se traduc din limbaj natural în ecuații matematice. Se rezolvă ecuația și se verifică soluția în contextul problemei.",
        "content": {
            "theory": [
                "Pasul 1: Citește problema cu atenție",
                "Pasul 2: Definește necunoscuta (x)",
                "Pasul 3: Scrie ecuația din condiții",
                "Pasul 4: Rezolvă ecuația",
                "Pasul 5: Verifică soluția",
                "Pasul 6: Răspunde la întrebare"
            ],
            "examples": [
                {
                    "title": "Problemă 1",
                    "content": "Un număr adunat cu 1/4 dă 3/2. Care e numărul?\nSie x numărul.\nx + 1/4 = 3/2\nx = 3/2 - 1/4 = 6/4 - 1/4 = 5/4"
                },
                {
                    "title": "Problemă 2",
                    "content": "Jumătate din 2/3 din un număr e 5. Care e numărul?\n(1/2) × (2/3) × x = 5\n(1/3) × x = 5\nx = 5 × 3 = 15"
                }
            ],
            "tips": [
                "Traduce problema în ecuație",
                "Fii atent la expresii: 'jumătate', 'o treime', etc.",
                "Verifica răspunsul în problema inițială"
            ]
        },
        "questions": [
            {
                "id": "L8_Q1",
                "type": "multiple_choice",
                "text": "Trei sferturi dintr-un număr sunt 12. Care e numărul?",
                "options": ["9", "16", "15", "18"],
                "correct": 1,
                "explanation": "(3/4) × x = 12 → x = 12 × (4/3) = 16"
            }
        ]
    },
    {
        "order": 9,
        "title": "Exerciții recapitulative și evaluare",
        "summary": "În această lecție vom practica și consolida toate conceptele din Capitolul 4: numere raționale, operații, puteri, ordinea operațiilor, ecuații și probleme.",
        "content": {
            "theory": [
                "Recapitulare: numere raționale și reprezentări",
                "Recapitulare: operații cu raționale (adunare, scădere, înmulțire, împărțire)",
                "Recapitulare: puteri raționale",
                "Recapitulare: ordinea operațiilor",
                "Recapitulare: ecuații și probleme"
            ],
            "examples": [
                {
                    "title": "Exercițiu compus 1",
                    "content": "Calculează: (1/2 + 1/3) × (2/5 - 1/10)"
                },
                {
                    "title": "Exercițiu compus 2",
                    "content": "Rezolvă: 2x - 1/3 = 5/6"
                }
            ],
            "tips": [
                "Revizuieste toate regulile",
                "Practica sistematic",
                "Verifica răspunsurile"
            ]
        },
        "questions": [
            {
                "id": "L9_Q1",
                "type": "multiple_choice",
                "text": "Calculează: (1/2 + 1/2) × (1/3 + 1/3)",
                "options": ["1/3", "2/3", "1", "2/9"],
                "correct": 1,
                "explanation": "(1/2 + 1/2) × (1/3 + 1/3) = 1 × (2/3) = 2/3"
            }
        ]
    }
]

def create_chapter_4_grade6():
    """Create complete Chapter 4 for Grade 6"""

    chapter_4 = {
        "name": "Mulțimea numerelor raționale",
        "order": 4,
        "description": "Capitolul 4 introduc mulțimea numerelor raționale (fracții, zecimale). Se studiază operații cu raționale, puteri, ecuații cu raționale și aplicații în probleme practice.",
        "lessons": CHAPTER_4_LESSONS
    }

    return chapter_4

def main():
    print("=" * 80)
    print("📚 CREATING CHAPTER 4 - MATEMATICA CLASA VI-a")
    print("=" * 80)

    chapter_data = create_chapter_4_grade6()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Total lessons: {len(chapter_data['lessons'])}")

    total_questions = sum(len(lesson.get('questions', [])) for lesson in chapter_data['lessons'])
    print(f"   Total questions: {total_questions}")

    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_4_GRADE6_MATEMATICA.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    print(f"\n📋 CHAPTER 4 LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']}. {lesson['title'][:60]}")
        print(f"   Questions: {num_questions}")

    print("\n" + "=" * 80)
    print("✅ CHAPTER 4 GRADE 6 READY!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

