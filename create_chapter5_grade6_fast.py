#!/usr/bin/env python3
"""
Create Chapter 5 Matematica Clasa VI-a
Chapter 5: Noțiuni geometrice fundamentale
"""

import json
import re

CHAPTER_5_LESSONS = [
    {
        "order": 1,
        "title": "Unghiuri opuse la vârf. Unghiuri formate în jurul unui punct. Unghiuri complementare și suplimentare",
        "summary": "**Unghiurile opuse la vârf** sunt egale. **Unghiuri în jurul unui punct** au suma 360°. **Unghiuri complementare**: suma 90°. **Unghiuri suplimentare**: suma 180°.",
        "content": {
            "theory": [
                "**Unghi**: format din două semidrepte cu origine comună (vârf)",
                "**Unghi drept**: 90°",
                "**Unghi alungit**: 180°",
                "**Unghi plin**: 360°",
                "**Unghiuri opuse la vârf**: unghiurile formate de două drepte intersectante, EGALE",
                "**Unghiuri în jurul unui punct**: suma = 360°",
                "**Unghiuri complementare**: α + β = 90°",
                "**Unghiuri suplimentare**: α + β = 180°",
                "**Unghi ascuțit**: < 90°",
                "**Unghi obtuz**: între 90° și 180°"
            ],
            "examples": [
                {
                    "title": "Unghiuri opuse la vârf",
                    "content": "Dacă ∠AOB = 50°, atunci ∠COD = 50° (opuse la vârf)"
                },
                {
                    "title": "Complementare și suplimentare",
                    "content": "α = 30°, complementul: 90° - 30° = 60°\nα = 50°, suplimentul: 180° - 50° = 130°"
                }
            ],
            "tips": [
                "Unghiuri opuse la vârf sunt EGALE",
                "Suma unghiurilor în jurul unui punct = 360°",
                "Complementare + suplimentare = 90° + 180°"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Dacă un unghi are 35°, complementul sau este:",
                "options": ["55°", "145°", "90°", "35°"],
                "correct": 0,
                "explanation": "Complementul = 90° - 35° = 55°"
            }
        ]
    },
    {
        "order": 2,
        "title": "Unghiuri adiacente. Bisectoarea unui unghi. Construcția bisectoarei unui unghi",
        "summary": "**Unghiuri adiacente**: consecutive, cu o latură comună și vârf comun. **Bisectoarea**: semidreapta care împarte unghiul în două unghiuri egale. Se construiește cu compasul și rigla.",
        "content": {
            "theory": [
                "**Unghiuri adiacente**: au vârf comun, o latură comună, și nu se suprapun",
                "**Bisectoarea unui unghi**: semidreapta care împarte unghiul în două unghiuri egale",
                "Dacă ∠AOB = 60° și OC e bisectoare, atunci ∠AOC = ∠COB = 30°",
                "**Construcția bisectoarei:**",
                "1. Deschid compasul la o rază oarecare",
                "2. Centrat în vârf, trasez un arc care taie laturile unghiului",
                "3. Centrat în intersecții, trasez două arce care se întretaie",
                "4. Semidreapta din vârf prin intersecția arcelor e bisectoarea"
            ],
            "examples": [
                {
                    "title": "Bisectoare",
                    "content": "Unghiul ∠AOB = 80°\nBisectoarea OC împarte în ∠AOC = ∠COB = 40°"
                }
            ],
            "tips": [
                "Bisectoarea e simetrala unghiului",
                "Compasul trebuie să aibă aceeași deschidere",
                "Precizie în construcție e importantă"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Bisectoarea unui unghi de 60° creează două unghiuri de:",
                "options": ["30°", "60°", "90°", "120°"],
                "correct": 0,
                "explanation": "Bisectoarea împarte unghiul în două părți egale: 60° ÷ 2 = 30°"
            }
        ]
    },
    {
        "order": 3,
        "title": "Drepte paralele. Axioma paralelelor. Criterii de paralelism. Aplicații practice",
        "summary": "**Dreptele paralele**: nu se intersectează niciodată. **Axioma**: printr-un punct exterior unei drepte, trece o unică paralelă. **Criterii**: unghiuri egale (alternare, corespondente). **Aplicații**: în construcții, trasee, etc.",
        "content": {
            "theory": [
                "**Dreptele paralele**: coplanare și nu se intersectează",
                "Notație: a || b (a paralel cu b)",
                "**Axioma lui Euclid**: Printr-un punct exterior unei drepte trece o unică paralelă la acea dreaptă",
                "**Criterii de paralelism** (cu o transversală):",
                "1. Unghiuri alterne interne egale → dreptele sunt paralele",
                "2. Unghiuri corespondente egale → dreptele sunt paralele",
                "3. Unghiuri co-interne suplimentare → dreptele sunt paralele",
                "**Aplicații**: trasee paralele, construcții, gratii"
            ],
            "examples": [
                {
                    "title": "Proprietăți",
                    "content": "a || b și b || c → a || c (tranzitivitate)"
                }
            ],
            "tips": [
                "Drepte paralele nu se intersectează niciodată",
                "Axioma lui Euclid e fundamentală în geometrie",
                "Criteriile sunt utile pentru construcții"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Dacă a || b și b || c, atunci:",
                "options": ["a ⊥ c", "a || c", "a și c se intersectează", "nu putem determina"],
                "correct": 1,
                "explanation": "Parallelismul e tranzitiv: a || b și b || c implică a || c"
            }
        ]
    },
    {
        "order": 4,
        "title": "Drepte perpendiculare și oblice. Distanța de la un punct la o dreaptă. Mediatoarea unui segment. Simetria față de o dreaptă",
        "summary": "**Drepte perpendiculare**: formează unghi de 90°. **Distanța**: lungimea perpendicularei. **Mediatoarea**: dreaptă perpendiculară la mijlocul unui segment. **Simetria**: reflexie față de o dreaptă.",
        "content": {
            "theory": [
                "**Drepte perpendiculare**: intersectare la 90°, notație a ⊥ b",
                "**Distanța de la punct la dreaptă**: lungimea segmentului perpendicular din punct la dreaptă",
                "**Mediatoarea unui segment AB**: dreaptă perpendiculară la AB în mijloc",
                "Proprietate: orice punct pe mediatoare e echidistant de A și B",
                "**Simetria față de o dreaptă**: reflexie în oglindă",
                "Proprietate: simetricul unui punct P e P' și PP' ⊥ d, cu PP' bisectat de d"
            ],
            "examples": [
                {
                    "title": "Mediatoare",
                    "content": "Segment AB, M mijloc, d mediatoare\nPentru orice P pe d: PA = PB"
                }
            ],
            "tips": [
                "Perpendicular = 90°",
                "Mediatoarea e construibilă cu compas",
                "Simetria e transformare izometrică"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Mediatoarea unui segment:",
                "options": [
                    "e paralelă la segment",
                    "e perpendiculară la segment și trece prin mijloc",
                    "bisectează unghiurile capetelor",
                    "e paralelă la o anumită dreaptă"
                ],
                "correct": 1,
                "explanation": "Mediatoarea e perpendiculară la segment și trece prin mijlocul acestuia"
            }
        ]
    },
    {
        "order": 5,
        "title": "Cerc: definiție, construcție, elemente. Unghi la centru. Măsuri",
        "summary": "**Cercul**: mulțimea de puncte egal depărtate de un centru. **Elemente**: centru, rază, coardă, diametru, arc. **Unghi la centru**: unghi cu vârf în centru și lături care sunt raze.",
        "content": {
            "theory": [
                "**Cerc**: mulțimea punctelor la distanță r (rază) de centru O",
                "**Rază**: distanța de la centru la orice punct pe cerc",
                "**Diametru**: coardă care trece prin centru, d = 2r",
                "**Coardă**: segment cu capete pe cerc",
                "**Arc**: porțiune de cerc dintre două puncte",
                "**Unghi la centru**: unghi ∠AOB cu vârf în centru, măsurat în grade",
                "**Proprietate**: unghi la centru = arcul corespunzător (în grade)",
                "**Lungimea cercului**: L = 2πr",
                "**Aria cercului**: A = πr²"
            ],
            "examples": [
                {
                    "title": "Construcție",
                    "content": "Centru O, rază r, orice P cu OP = r e pe cerc"
                },
                {
                    "title": "Unghi la centru",
                    "content": "∠AOB = 60° → arcul AB = 60°"
                }
            ],
            "tips": [
                "Diametrul e cea mai lungă coardă",
                "Unghi la centru = arc în grade",
                "π ≈ 3.14"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Diametrul unui cerc cu rază 5 cm este:",
                "options": ["5 cm", "10 cm", "2.5 cm", "15 cm"],
                "correct": 1,
                "explanation": "Diametru = 2 × rază = 2 × 5 = 10 cm"
            }
        ]
    },
    {
        "order": 6,
        "title": "Pozițiile unei drepte față de un cerc. Pozițiile relative a două cercuri",
        "summary": "**Dreaptă și cerc**: exterioară, tangentă, secantă. **Două cercuri**: exterioare, tangente externe/interne, secante, interne, concentrice.",
        "content": {
            "theory": [
                "**Dreaptă exterioară**: nu intersectează cercul (d > r)",
                "**Dreaptă tangentă**: intersectează în exact un punct (d = r)",
                "Proprietate: tangenta e perpendiculară pe rază în punctul de tangență",
                "**Dreaptă secantă**: intersectează în două puncte (d < r)",
                "**Două cercuri exterioare**: distanța centrelor > suma razelor",
                "**Două cercuri tangente externe**: distanța = suma razelor",
                "**Două cercuri secante**: distanța între razele și suma",
                "**Două cercuri tangente interne**: distanța = diferența razelor",
                "**Două cercuri interne**: un cerc în altul",
                "**Cercuri concentrice**: același centru, raze diferite"
            ],
            "examples": [
                {
                    "title": "Tangentă",
                    "content": "Tangenta la cerc e perpendiculară pe rază în punct de tangență"
                }
            ],
            "tips": [
                "Tangenta = o singură intersecție",
                "Secantă = două intersecții",
                "Distanța centrelor determine pozițiile"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "O tangentă la cerc formează cu raza un unghi de:",
                "options": ["45°", "60°", "90°", "120°"],
                "correct": 2,
                "explanation": "Tangenta e perpendiculară pe rază la punctul de tangență, deci 90°"
            }
        ]
    },
    {
        "order": 7,
        "title": "Exerciții recapitulative și evaluare - Noțiuni geometrice",
        "summary": "Consolidarea tuturor conceptelor din Capitolul 5: unghiuri, drepte, cerc, construcții geometrice.",
        "content": {
            "theory": [
                "Recapitulare: unghiuri și proprietăți",
                "Recapitulare: drepte paralele și perpendiculare",
                "Recapitulare: cerc și elemente",
                "Aplicații și construcții geometrice"
            ],
            "examples": [
                {
                    "title": "Exercițiu",
                    "content": "Construiți bisectoarea unui unghi de 80° și mediatoarea unui segment"
                }
            ],
            "tips": [
                "Practica construcții cu rigla și compasul",
                "Atenție la precizie",
                "Verifică proprietățile"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "Care e suma unghiurilor formate în jurul unui punct?",
                "options": ["180°", "90°", "270°", "360°"],
                "correct": 3,
                "explanation": "Unghiurile în jurul unui punct au suma = 360°"
            }
        ]
    }
]

def main():
    print("=" * 80)
    print("📚 CREATING & INTEGRATING CHAPTER 5 - GRADE 6")
    print("=" * 80)

    # Create Chapter 5
    chapter_5 = {
        "name": "Noțiuni geometrice fundamentale",
        "order": 5,
        "description": "Capitolul 5 introduce concepte geometrice fundamentale: unghiuri, drepte paralele/perpendiculare, cerc.",
        "lessons": CHAPTER_5_LESSONS
    }

    print(f"\n✅ Chapter 5: {len(chapter_5['lessons'])} lessons")

    # Load curriculum
    curriculum_file = '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json'
    with open(curriculum_file, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Format and integrate Chapter 5
    chapters_list = curriculum["Clasa a VI a"]["Matematica"]
    chapter_formatted = {
        "number": "5",
        "name": chapter_5["name"],
        "description": chapter_5.get("description", ""),
        "lectii": []
    }

    for lesson in chapter_5["lessons"]:
        lesson_formatted = {
            "number": str(lesson["order"]),
            "name": lesson["title"],
            "summary": lesson["summary"],
            "questions": lesson.get("questions", []),
            "sections": []
        }

        if "content" in lesson and "theory" in lesson["content"]:
            for idx, theory_point in enumerate(lesson["content"]["theory"]):
                lesson_formatted["sections"].append({
                    "title": f"Teorie {idx+1}",
                    "content": theory_point,
                    "order": idx + 1
                })

        if "content" in lesson and "examples" in lesson["content"]:
            start_order = len(lesson_formatted["sections"]) + 1
            for idx, example in enumerate(lesson["content"]["examples"]):
                lesson_formatted["sections"].append({
                    "title": example.get("title", f"Exemplu {idx+1}"),
                    "content": example.get("content", ""),
                    "order": start_order + idx
                })

        lesson_formatted["sections"].append({
            "title": "Sfaturi și trucuri",
            "content": "\n".join([f"• {tip}" for tip in lesson.get("content", {}).get("tips", [])]),
            "order": len(lesson_formatted["sections"]) + 1
        })

        chapter_formatted["lectii"].append(lesson_formatted)

    # Add highlights
    keywords = ["unghi", "cerc", "rază", "diametru", "paralel", "perpendicular"]
    for lesson in chapter_formatted["lectii"]:
        for keyword in keywords:
            pattern = re.compile(re.escape(keyword), re.IGNORECASE)
            summary = lesson.get("summary", "")
            lesson["summary"] = pattern.sub(lambda m: f"**{m.group()}**", summary)

            for section in lesson.get("sections", []):
                content = section.get("content", "")
                section["content"] = pattern.sub(lambda m: f"**{m.group()}**", content)

    # Replace Chapter 5
    existing_idx = None
    for idx, ch in enumerate(chapters_list):
        if ch.get("number") == "5":
            existing_idx = idx
            break

    if existing_idx is not None:
        chapters_list[existing_idx] = chapter_formatted
    else:
        chapters_list.append(chapter_formatted)

    with open(curriculum_file, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=2, ensure_ascii=False)

    print("✅ Chapter 5 created, integrated, and highlighted!")

if __name__ == '__main__':
    main()

