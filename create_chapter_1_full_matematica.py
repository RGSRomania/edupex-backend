#!/usr/bin/env python3
"""
Create Complete Chapter 1 Matematica Clasa 5 with ALL lessons
Extracted from PLANIFICARE DIDACTICĂ
"""

import json
from pathlib import Path

# Complete Chapter 1 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_1_LESSONS = [
    # Lesson 1
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
                "Unitatea de ordinul unu (unități) este cea mai mică unitate",
                "Zece unități = unu zece",
                "Zece zeci = o sută"
            ],
            "examples": [
                {
                    "title": "Scris și citire numerelor",
                    "content": "5 se citește: cinci\n27 se citește: douăzeci și șapte\n345 se citește: trei sute patruzeci și cinci\n2005 se citește: două mii cinci"
                },
                {
                    "title": "Descompunerea unui număr",
                    "content": "345 = 3 × 100 + 4 × 10 + 5 × 1\n2048 = 2 × 1000 + 0 × 100 + 4 × 10 + 8 × 1"
                }
            ],
            "tips": [
                "Pentru a citi corect un număr cu mai multe cifre, grupează cifrele în clase de trei",
                "Unitatea de ordinul 1 este cifra din dreapta",
                "Fiecare ordinul are o valoare de 10 ori mai mare decât ordinul anterior"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care este valoarea cifrei 5 în numărul 357?",
                "options": ["5", "50", "500", "5000"],
                "correct": 1,
                "explanation": "În numărul 357, cifra 5 ocupă poziția zecilor, deci valoarea sa este 5 × 10 = 50"
            },
            {
                "id": "L1_Q2",
                "type": "multiple_choice",
                "text": "Cum se scrie cu cifre numărul 'o mie nouă'?",
                "options": ["109", "1009", "1090", "10009"],
                "correct": 1,
                "explanation": "O mie = 1000, nouă = 9, deci 1000 + 9 = 1009"
            }
        ]
    },
    # Lesson 2
    {
        "order": 2,
        "title": "Reprezentarea pe axa numerelor. Compararea și ordonarea numerelor naturale. Aproximări și estimări",
        "summary": "Numerele naturale se pot reprezenta pe o axă numerică. Axa numerelor ne ajută să vizualizăm numerele și relațiile dintre ele. Pe axa numerelor, numerele cresc de la stânga la dreapta. Compararea numerelor naturale se face folosind semnele: <, =, >. Aproximările ne ajută să lucrum cu numere mai mari.",
        "content": {
            "theory": [
                "Axa numerelor este o dreaptă pe care marcăm puncte corespunzătoare numerelor naturale",
                "Pe axa numerelor, numerele sunt dispuse în ordine crescătoare de la stânga la dreapta",
                "Orice număr natural (mai puțin 0) are un predecesor (numărul care îl precede)",
                "Orice număr natural are un succesor (numărul care îl urmează)",
                "Compararea numerelor: dacă a < b, atunci a se află la stânga lui b pe axă",
                "Ordonarea crescătoare: de la cel mai mic la cel mai mare",
                "Ordonarea descrescătoare: de la cel mai mare la cel mai mic",
                "Aproximarea unui număr: înlocuirea cu un număr apropiat mai ușor de folosit"
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
                    "title": "Aproximări",
                    "content": "127 ≈ 130 (aproximare la zeci)\n2456 ≈ 2500 (aproximare la sute)"
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
                "options": ["245", "254", "Sunt egale", "Nu se pot compara"],
                "correct": 0,
                "explanation": "245 < 254 pentru că la cifra zecilor avem 4 < 5"
            }
        ]
    },
    # Lesson 3
    {
        "order": 3,
        "title": "Adunarea numerelor naturale. Proprietăți",
        "summary": "Adunarea este operația prin care unim două mulțimi disjuncte. Numerele care se adună se numesc termeni, iar rezultatul se numește sumă. Adunarea are proprietăți importante: este comutativă, asociativă și are element neutru.",
        "content": {
            "theory": [
                "Adunarea este operația prin care combinăm două sau mai multe numere",
                "Numerele care se adună se numesc termeni",
                "Rezultatul adunării se numește sumă",
                "Proprietatea comutativă: a + b = b + a",
                "Proprietatea asociativă: (a + b) + c = a + (b + c)",
                "Element neutru: a + 0 = 0 + a = a",
                "Pentru a aduna numere mari, aliniază cifrele după ordinul lor"
            ],
            "examples": [
                {
                    "title": "Adunarea simplă",
                    "content": "7 + 5 = 12\n23 + 15 = 38\n100 + 200 = 300"
                },
                {
                    "title": "Proprietatea comutativă",
                    "content": "8 + 3 = 11 și 3 + 8 = 11\nDeci 8 + 3 = 3 + 8"
                }
            ],
            "tips": [
                "Adunarea este comutativă - poti schimba ordinea termenilor",
                "Grupează numerele pentru a calcula mai ușor",
                "Verifica rezultatul prin inversare"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Care este rezultatul: 27 + 43?",
                "options": ["60", "70", "65", "75"],
                "correct": 1,
                "explanation": "27 + 43 = 70"
            }
        ]
    },
    # Lesson 4
    {
        "order": 4,
        "title": "Scăderea numerelor naturale",
        "summary": "Scăderea este operația inversă adunării. Scade un număr (scăzător) din altul (descăzut) pentru a obține diferența. Scăderea nu este comutativă, dar are alte proprietăți importante.",
        "content": {
            "theory": [
                "Scăderea este operația inversă adunării",
                "Descăzut - scăzător = diferență",
                "Scăderea nu este comutativă: a - b ≠ b - a (de obicei)",
                "Proprietatea: a - 0 = a",
                "Proprietatea: a - a = 0",
                "Pentru a scădea numere mari, aliniază cifrele după ordinul lor",
                "Dacă descăzutul este mai mic decât scăzătorul, nu putem scădea în numerele naturale"
            ],
            "examples": [
                {
                    "title": "Scăderea simplă",
                    "content": "12 - 7 = 5\n45 - 23 = 22\n100 - 35 = 65"
                },
                {
                    "title": "Verifica prin adunare",
                    "content": "20 - 8 = 12, verificare: 12 + 8 = 20 ✓\n56 - 23 = 33, verificare: 33 + 23 = 56 ✓"
                }
            ],
            "tips": [
                "Scăderea este inversa adunării - folosește-o pentru verificare",
                "Aliniază numerele după ordinul lor",
                "Dacă cifra de la descăzut este mai mică decât a de la scăzător, 'împrumută' din ordinul superior"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Care este rezultatul: 85 - 23?",
                "options": ["62", "62", "65", "58"],
                "correct": 0,
                "explanation": "85 - 23 = 62"
            }
        ]
    },
    # Lesson 5
    {
        "order": 5,
        "title": "Înmulțirea numerelor naturale. Proprietăți",
        "summary": "Înmulțirea este adunarea repetată de termeni egali. Numerele care se înmulțesc se numesc factori, iar rezultatul se numește produs. Înmulțirea are proprietăți importante: comutativă, asociativă, distributivă și are element neutru.",
        "content": {
            "theory": [
                "Înmulțirea este adunarea repetată de termeni egali",
                "4 × 3 = 3 + 3 + 3 + 3 = 12",
                "Numerele care se înmulțesc se numesc factori",
                "Rezultatul înmulțirii se numește produs",
                "Proprietatea comutativă: a × b = b × a",
                "Proprietatea asociativă: (a × b) × c = a × (b × c)",
                "Element neutru: a × 1 = a",
                "Proprietate cu 0: a × 0 = 0",
                "Proprietatea distributivă: a × (b + c) = a × b + a × c"
            ],
            "examples": [
                {
                    "title": "Înmulțirea simplă",
                    "content": "5 × 3 = 15\n12 × 4 = 48\n10 × 100 = 1000"
                },
                {
                    "title": "Proprietatea comutativă",
                    "content": "6 × 7 = 42 și 7 × 6 = 42\nDeci 6 × 7 = 7 × 6"
                },
                {
                    "title": "Proprietatea distributivă",
                    "content": "5 × (3 + 2) = 5 × 5 = 25\n5 × 3 + 5 × 2 = 15 + 10 = 25"
                }
            ],
            "tips": [
                "Ordine factorilor nu contează - inmultirea este comutativa",
                "Pentru a inmulti cu 10, 100, 1000, adauga zerouri",
                "Descompune numerele pentru a calcul mai ușor"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Care este rezultatul: 8 × 9?",
                "options": ["71", "72", "73", "74"],
                "correct": 1,
                "explanation": "8 × 9 = 72"
            }
        ]
    },
    # Lesson 6
    {
        "order": 6,
        "title": "Factor comun",
        "summary": "Factorul comun este o tehnică de simplificare a calculelor. Când mai mulți termeni au un factor comun, îl putem scoate în fața parantezelor. Aceasta se bazează pe proprietatea distributivă a înmulțirii.",
        "content": {
            "theory": [
                "Factorul comun este o expresie care apare în toți termenii unei sume/diferențe",
                "a × c + b × c = c × (a + b)",
                "a × c - b × c = c × (a - b)",
                "Scoaterea factorului comun simplifică calculele",
                "Factorul comun poate fi un număr, o literă sau o expresie"
            ],
            "examples": [
                {
                    "title": "Scoaterea factorului comun",
                    "content": "5 × 3 + 5 × 7 = 5 × (3 + 7) = 5 × 10 = 50\n8 × 4 + 8 × 6 = 8 × (4 + 6) = 8 × 10 = 80"
                },
                {
                    "title": "Cu scădere",
                    "content": "12 × 7 - 12 × 5 = 12 × (7 - 5) = 12 × 2 = 24"
                }
            ],
            "tips": [
                "Cauta ce se repeta in toti termenii",
                "Scoate factorul comun in fata parantezelor",
                "Verifica rezultatul prin desfacerea parantezelor"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "Descompune: 7 × 5 + 7 × 3 folosind factorul comun",
                "options": ["7 × (5 + 3)", "7 × 8", "5 × (7 + 3)", "56"],
                "correct": 0,
                "explanation": "7 × 5 + 7 × 3 = 7 × (5 + 3) = 7 × 8 = 56"
            }
        ]
    },
    # Lesson 7
    {
        "order": 7,
        "title": "Recapitulare și evaluare (Operații cu numere naturale)",
        "summary": "În această lecție vom recapitula toate conceptele învățate despre operații cu numere naturale: adunarea, scăderea, înmulțirea și proprietățile acestora. Vom practica prin exerciții diverse.",
        "content": {
            "theory": [
                "Adunarea: a + b = b + a (comutativă), (a + b) + c = a + (b + c) (asociativă), a + 0 = a",
                "Scăderea: este inversa adunării, descăzut - scăzător = diferență",
                "Înmulțirea: a × b = b × a (comutativă), (a × b) × c = a × (b × c) (asociativă), a × 1 = a, a × 0 = 0",
                "Factorul comun: a × c + b × c = c × (a + b)",
                "Ordinea operațiilor: mai întâi înmulțirea și împărțirea, apoi adunarea și scăderea"
            ],
            "examples": [
                {
                    "title": "Exercițiu compus",
                    "content": "5 + 3 × 2 = 5 + 6 = 11 (nu 16!)\n(5 + 3) × 2 = 8 × 2 = 16"
                }
            ],
            "tips": [
                "Verifica-ti raspunsurile prin operatia inversa",
                "Respecta ordinea operatiilor",
                "Pentru calcule complexe, descompune in pasi mai simpli"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 10 + 5 × 3",
                "options": ["25", "45", "15", "10"],
                "correct": 0,
                "explanation": "Mai întâi 5 × 3 = 15, apoi 10 + 15 = 25"
            }
        ]
    },
    # Lesson 8
    {
        "order": 8,
        "title": "Împărțirea cu rest 0 a numerelor naturale",
        "summary": "Împărțirea este operația inversă înmulțirii. Quando împărțim un număr la altul fără rest, spunem că avem o împărțire exactă. Deîmpărțit ÷ împărțitor = cât.",
        "content": {
            "theory": [
                "Împărțirea este operația inversă înmulțirii",
                "Deîmpărțit ÷ împărțitor = cât",
                "Deîmpărțit = cât × împărțitor",
                "Nu putem împărți la 0",
                "Orice număr împărțit la 1 dă acel număr: a ÷ 1 = a",
                "0 împărțit la orice număr diferit de 0 dă 0: 0 ÷ a = 0",
                "Împărțirea nu este comutativă și nici asociativă"
            ],
            "examples": [
                {
                    "title": "Împărțire simplă",
                    "content": "12 ÷ 3 = 4 (verificare: 4 × 3 = 12)\n50 ÷ 5 = 10 (verificare: 10 × 5 = 50)\n100 ÷ 10 = 10 (verificare: 10 × 10 = 100)"
                }
            ],
            "tips": [
                "Verifica impartirea prin inmultire",
                "Pentru a imparti la 10, 100, 1000, sterge zerouri",
                "Daca deimpartitul este mai mic decat impartitorul, catul este 0"
            ]
        },
        "questions": [
            {
                "id": "L8_Q1",
                "type": "multiple_choice",
                "text": "Care este rezultatul: 56 ÷ 7?",
                "options": ["7", "8", "6", "9"],
                "correct": 1,
                "explanation": "56 ÷ 7 = 8, deoarece 8 × 7 = 56"
            }
        ]
    },
    # Lesson 9
    {
        "order": 9,
        "title": "Împărțirea cu rest a numerelor naturale",
        "summary": "Când deîmpărțitul nu se împarte exact la împărțitor, obținem un rest. Formula împărțirii cu rest este: Deîmpărțit = cât × împărțitor + rest, unde rest < împărțitor.",
        "content": {
            "theory": [
                "Deîmpărțit = cât × împărțitor + rest",
                "Rest < împărțitor (restul este întotdeauna mai mic decât împărțitorul)",
                "Verificare: cât × împărțitor + rest = deîmpărțit",
                "Restul nu poate fi negativ și nu poate fi ≥ împărțitor",
                "Dacă rest = 0, atunci împărțirea este exactă"
            ],
            "examples": [
                {
                    "title": "Împărțire cu rest",
                    "content": "17 ÷ 5 = 3 rest 2 (verificare: 3 × 5 + 2 = 15 + 2 = 17)\n23 ÷ 6 = 3 rest 5 (verificare: 3 × 6 + 5 = 18 + 5 = 23)\n29 ÷ 4 = 7 rest 1 (verificare: 7 × 4 + 1 = 28 + 1 = 29)"
                }
            ],
            "tips": [
                "Restul trebuie sa fie mai mic decat impartitorul",
                "Verifica intotdeauna: cat × impartitor + rest = deimpartit",
                "Daca restul este 0, impartirea este exacta"
            ]
        },
        "questions": [
            {
                "id": "L9_Q1",
                "type": "multiple_choice",
                "text": "Care este catul și restul: 25 ÷ 6?",
                "options": ["Cât 4 rest 1", "Cât 4 rest 2", "Cât 3 rest 7", "Cât 5 rest 0"],
                "correct": 0,
                "explanation": "25 ÷ 6 = 4 rest 1, deoarece 4 × 6 + 1 = 24 + 1 = 25"
            }
        ]
    },
    # Lesson 10
    {
        "order": 10,
        "title": "Puterea cu exponent natural a unui număr natural. Pătratul unui număr natural",
        "summary": "Puterea unui număr este o operație de înmulțire repetată. a^n = a × a × ... × a (de n ori). Pătratul unui număr este a^2 = a × a. Cubul unui număr este a^3 = a × a × a.",
        "content": {
            "theory": [
                "a^n = a × a × ... × a (de n ori)",
                "a se numește bază, n se numește exponent",
                "a^2 se numește pătratul lui a",
                "a^3 se numește cubul lui a",
                "Orice număr la puterea 1 este acel număr: a^1 = a",
                "Orice număr la puterea 0 este 1: a^0 = 1 (pentru a ≠ 0)",
                "1 la orice putere este 1: 1^n = 1",
                "0 la orice putere pozitivă este 0: 0^n = 0 (pentru n > 0)"
            ],
            "examples": [
                {
                    "title": "Puteri simple",
                    "content": "2^3 = 2 × 2 × 2 = 8\n5^2 = 5 × 5 = 25\n3^4 = 3 × 3 × 3 × 3 = 81\n10^2 = 100"
                },
                {
                    "title": "Pătrate și cuburi",
                    "content": "1^2 = 1, 2^2 = 4, 3^2 = 9, 4^2 = 16, 5^2 = 25\n1^3 = 1, 2^3 = 8, 3^3 = 27, 4^3 = 64, 5^3 = 125"
                }
            ],
            "tips": [
                "Invata patratele si cuburile pana la 10",
                "a^n inseamna 'a de n ori'",
                "Atentie la exponenti: 2^3 ≠ 2×3"
            ]
        },
        "questions": [
            {
                "id": "L10_Q1",
                "type": "multiple_choice",
                "text": "Care este 4^2 (patrat)?",
                "options": ["8", "16", "12", "20"],
                "correct": 1,
                "explanation": "4^2 = 4 × 4 = 16"
            }
        ]
    },
    # Lesson 11
    {
        "order": 11,
        "title": "Reguli de calcul cu puteri",
        "summary": "Există reguli importante pentru a simplifica calculele cu puteri. a^m × a^n = a^(m+n), a^m ÷ a^n = a^(m-n), (a^m)^n = a^(m×n), și altele.",
        "content": {
            "theory": [
                "a^m × a^n = a^(m+n)",
                "a^m ÷ a^n = a^(m-n) (pentru m ≥ n)",
                "(a^m)^n = a^(m×n)",
                "(a × b)^n = a^n × b^n",
                "(a ÷ b)^n = a^n ÷ b^n",
                "a^(m+n) = a^m × a^n",
                "a^(m-n) = a^m ÷ a^n"
            ],
            "examples": [
                {
                    "title": "Înmulțire de puteri",
                    "content": "2^3 × 2^2 = 2^(3+2) = 2^5 = 32\n3^2 × 3^3 = 3^5 = 243"
                },
                {
                    "title": "Împărțire de puteri",
                    "content": "2^5 ÷ 2^2 = 2^(5-2) = 2^3 = 8\n3^4 ÷ 3^2 = 3^2 = 9"
                },
                {
                    "title": "Putere de putere",
                    "content": "(2^3)^2 = 2^(3×2) = 2^6 = 64\n(3^2)^2 = 3^4 = 81"
                }
            ],
            "tips": [
                "Aplica regulile pentru a simplifica calculele",
                "Poti sa aplici regulile doar daca au aceeasi baza",
                "Verifica-ti raspunsurile prin calcul direct"
            ]
        },
        "questions": [
            {
                "id": "L11_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 2^3 × 2^2",
                "options": ["2^5", "2^6", "32", "64"],
                "correct": 2,
                "explanation": "2^3 × 2^2 = 2^(3+2) = 2^5 = 32"
            }
        ]
    },
    # Lesson 12
    {
        "order": 12,
        "title": "Compararea puterilor",
        "summary": "Pentru a compara puteri, trebuie să le calculezi sau să folosești reguli specifice. Dacă au aceeași bază, se compară exponenții. Dacă au același exponent, se compară bazele.",
        "content": {
            "theory": [
                "Dacă bazele sunt egale și a > 1, atunci a^m < a^n dacă m < n",
                "Dacă exponenții sunt egali și m, n > 0, atunci a^m < b^m dacă a < b",
                "Pentru a compara puteri diferite, calculează valorile sau aplică regulile"
            ],
            "examples": [
                {
                    "title": "Aceeași bază",
                    "content": "2^3 < 2^5 (8 < 32)\n3^2 < 3^4 (9 < 81)"
                },
                {
                    "title": "Același exponent",
                    "content": "2^3 < 3^3 (8 < 27)\n4^2 < 5^2 (16 < 25)"
                }
            ],
            "tips": [
                "Daca bazele sunt egale, compara exponenti",
                "Daca exponenti sunt egali, compara bazele",
                "Calculeaza daca nu poti aplica o regula"
            ]
        },
        "questions": [
            {
                "id": "L12_Q1",
                "type": "multiple_choice",
                "text": "Care este mai mare: 2^4 sau 3^3?",
                "options": ["2^4 = 16", "3^3 = 27", "3^3 este mai mare", "2^4 și 3^3 sunt egale"],
                "correct": 2,
                "explanation": "2^4 = 16 și 3^3 = 27, deci 3^3 este mai mare (27 > 16)"
            }
        ]
    },
    # Lesson 13
    {
        "order": 13,
        "title": "Scrierea în baza 10. Scrierea în baza 2",
        "summary": "Baza 10 este sistemul zecimal pe care îl folosim zilnic. Baza 2 (binară) este folosită în informatică. Un număr se poate scrie în orice bază: N = a_n × b^n + a_(n-1) × b^(n-1) + ... + a_1 × b + a_0.",
        "content": {
            "theory": [
                "Baza 10 (zecimal): cifrele sunt 0-9",
                "Baza 2 (binar): cifrele sunt 0-1",
                "Un număr în baza b se scrie: N = a_n × b^n + a_(n-1) × b^(n-1) + ... + a_1 × b + a_0",
                "Conversia din baza 10 în baza 2: împarte succesiv la 2, citește resturile invers",
                "Conversia din baza 2 în baza 10: calculează suma exponenților"
            ],
            "examples": [
                {
                    "title": "Baza 10",
                    "content": "345 = 3 × 10^2 + 4 × 10^1 + 5 × 10^0\n     = 3 × 100 + 4 × 10 + 5 × 1"
                },
                {
                    "title": "Baza 2",
                    "content": "1011 (baza 2) = 1 × 2^3 + 0 × 2^2 + 1 × 2^1 + 1 × 2^0\n              = 8 + 0 + 2 + 1 = 11 (baza 10)"
                },
                {
                    "title": "Conversia din baza 10 în baza 2",
                    "content": "5 în baza 2: 5÷2=2 rest 1, 2÷2=1 rest 0, 1÷2=0 rest 1\nCitim invers: 101"
                }
            ],
            "tips": [
                "Baza 2 este importante in informatica",
                "Pentru conversia din baza 2 in 10, aduna puteri lui 2",
                "Pentru conversia din 10 in 2, imparte succesiv si retine resturile"
            ]
        },
        "questions": [
            {
                "id": "L13_Q1",
                "type": "multiple_choice",
                "text": "Ce valoare în baza 10 are 1010 în baza 2?",
                "options": ["10", "8", "12", "6"],
                "correct": 0,
                "explanation": "1010 (baza 2) = 1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10"
            }
        ]
    },
    # Lesson 14
    {
        "order": 14,
        "title": "Ordinea efectuării operațiilor. Utilizarea parantezelor: rotunde, pătrate și acolade",
        "summary": "Ordinea operațiilor determină cum calculezi o expresie cu mai multe operații. Parantezele sunt folosite pentru a schimba ordinea. Se respectă: parantezele, exponenții, înmulțirea și împărțirea, adunarea și scăderea.",
        "content": {
            "theory": [
                "Ordinea operațiilor (fără paranteze):",
                "1. Exponenți (puteri)",
                "2. Înmulțire și împărțire (de la stânga la dreapta)",
                "3. Adunare și scădere (de la stânga la dreapta)",
                "Parantezele (rotunde, pătrate, acolade) se rezolvă de la interior la exterior",
                "Expresiile din paranteze se rezolvă mai întâi",
                "Pentru paranteze nesate: ( [ { } ] )"
            ],
            "examples": [
                {
                    "title": "Fără paranteze",
                    "content": "5 + 3 × 2 = 5 + 6 = 11 (nu 16!)\n20 - 8 ÷ 2 = 20 - 4 = 16 (nu 6!)\n2 + 3^2 = 2 + 9 = 11 (nu 25!)"
                },
                {
                    "title": "Cu paranteze",
                    "content": "(5 + 3) × 2 = 8 × 2 = 16\n[(20 - 8) ÷ 2] = [12 ÷ 2] = 6\n(2 + 3)^2 = 5^2 = 25"
                }
            ],
            "tips": [
                "Respecta ordinea operatiilor",
                "Parantezele schimba ordinea - calculeaza mai intai ce e in paranteze",
                "Pentru paranteze nesate, lucreaza de la interior la exterior"
            ]
        },
        "questions": [
            {
                "id": "L14_Q1",
                "type": "multiple_choice",
                "text": "Calculează: 2 + 3 × 4 - 1",
                "options": ["13", "19", "11", "23"],
                "correct": 0,
                "explanation": "Operația: 2 + (3 × 4) - 1 = 2 + 12 - 1 = 14 - 1 = 13"
            }
        ]
    },
    # Lesson 15
    {
        "order": 15,
        "title": "Recapitulare și evaluare finală (Cap. 1 complet)",
        "summary": "Evaluarea finală pentru Capitolul 1 - Operații cu numere naturale. Vei practica și consolida toate cunoștințele: adunarea, scăderea, înmulțirea, împărțirea, puteri, și ordinea operațiilor.",
        "content": {
            "theory": [
                "Toate conceptele din Capitolul 1: operații cu numere naturale",
                "Proprietățile operațiilor: comutativă, asociativă, distributivă",
                "Factorul comun și simplificări",
                "Puteri și reguli de calcul cu puteri",
                "Ordinea operațiilor și utilizarea parantezelor",
                "Conversia între baze (10 și 2)"
            ],
            "examples": [
                {
                    "title": "Exercițiu complex",
                    "content": "[10 + (3 × 2^2)] ÷ 2 - 1\n= [10 + (3 × 4)] ÷ 2 - 1\n= [10 + 12] ÷ 2 - 1\n= 22 ÷ 2 - 1\n= 11 - 1\n= 10"
                }
            ],
            "tips": [
                "Revizuieste toate regulile invatate",
                "Practica cu exercitii diverse",
                "Verifica mereu raspunsurile"
            ]
        },
        "questions": [
            {
                "id": "L15_Q1",
                "type": "multiple_choice",
                "text": "Calculează: [(8 + 4) × 2] ÷ 3",
                "options": ["8", "10", "12", "6"],
                "correct": 0,
                "explanation": "[(8 + 4) × 2] ÷ 3 = [12 × 2] ÷ 3 = 24 ÷ 3 = 8"
            }
        ]
    }
]

def create_chapter_1_full():
    """Create complete Chapter 1 with all lessons"""

    chapter_1 = {
        "name": "Operații cu numere naturale",
        "order": 1,
        "description": "În această unitate de învățare, elevii vor învăța despre numerele naturale, operațiile cu acestea și proprietățile acestor operații. Vor studia adunarea, scăderea, înmulțirea, împărțirea, puteri, și ordinea operațiilor.",
        "lessons": CHAPTER_1_LESSONS
    }

    return chapter_1

def main():
    print("=" * 80)
    print("📚 CREATING COMPLETE CHAPTER 1 JSON - MATEMATICA CLASA 5")
    print("=" * 80)

    # Create chapter data
    chapter_data = create_chapter_1_full()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Total lessons: {len(chapter_data['lessons'])}")
    print(f"   Total questions: {sum(len(lesson.get('questions', [])) for lesson in chapter_data['lessons'])}")

    # Save to file
    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_1_COMPLETE_MATEMATICA_CLASA5.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    # Display summary
    print(f"\n📋 CHAPTER 1 COMPLETE LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']:2d}. {lesson['title'][:60]}")
        print(f"    Questions: {num_questions}")

    print("\n" + "=" * 80)
    print("✅ COMPLETE CHAPTER 1 READY FOR INTEGRATION!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

