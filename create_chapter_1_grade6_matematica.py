#!/usr/bin/env python3
"""
Create Chapter 1 Matematica Clasa VI-a
Based on PLANIFICARE DIDACTICĂ
Chapter 1: Mulțimi. Mulțimea numerelor naturale
"""

import json
from pathlib import Path

# Chapter 1 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_1_LESSONS = [
    {
        "order": 1,
        "title": "Mulțimi: descriere, notații, reprezentări. Mulțimi numerice și nenumerice",
        "summary": "Mulțimea este o colecție de obiecte bine determinate, numite elemente. Mulțimile pot fi descrise în mai multe moduri: prin enumerare, prin caracteristică sau prin reprezentare grafică. Mulțimile pot fi numerice (conținând numere) sau nenumerice (conținând alte obiecte).",
        "content": {
            "theory": [
                "O **mulțime** este o colecție de obiecte bine determinate, numite **elemente**",
                "Elementele unei mulțimi sunt distincte și aparțin doar o dată acelei mulțimi",
                "Mulțimile se notează cu litere mari: A, B, C, ...",
                "Elementele se notează cu litere mici: a, b, c, ...",
                "**Relația de apartenență**: element ∈ mulțime (aparține) sau element ∉ mulțime (nu aparține)",
                "**Reprezentare prin enumerare**: se listează toate elementele în acolade, ex: A = {1, 2, 3, 4, 5}",
                "**Reprezentare prin caracteristică**: se descriu proprietatea elementelor, ex: B = {x ∈ ℕ | x ≤ 10}",
                "**Reprezentare grafică**: se folosesc diagrame Venn, cercuri care conțin elementele",
                "**Mulțimile numerice** conțin numere: mulțimea numerelor naturale, întregi, raționale, etc.",
                "**Mulțimile nenumerice** conțin alte obiecte: litere, orase, persoane, etc."
            ],
            "examples": [
                {
                    "title": "Mulțimi prin enumerare",
                    "content": "A = {a, e, i, o, u} (mulțimea vocalelor din limba română)\nB = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9} (cifre)\nC = {România, Italia, Franța} (țări europene)"
                },
                {
                    "title": "Mulțimi prin caracteristică",
                    "content": "D = {x ∈ ℕ | x < 5} înseamnă D = {0, 1, 2, 3, 4}\nE = {x ∈ ℕ | x este par și x < 10} înseamnă E = {0, 2, 4, 6, 8}\nF = {x ∈ ℕ | x este impar și x ≤ 9} înseamnă F = {1, 3, 5, 7, 9}"
                },
                {
                    "title": "Apartenență la mulțime",
                    "content": "Dacă A = {1, 2, 3, 4, 5}, atunci:\n1 ∈ A (1 aparține mulțimii A)\n6 ∉ A (6 nu aparține mulțimii A)\n3 ∈ A (3 aparține mulțimii A)"
                }
            ],
            "tips": [
                "Ordinea elementelor într-o mulțime nu contează: {1, 2, 3} = {3, 2, 1}",
                "Elementele duplicate se scriu o singură dată în mulțime",
                "Mulțimea care nu conține niciun element se numește mulțimea **vidă**, notată cu ∅ sau {}"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care din următoarele este o mulțime numerică?",
                "options": [
                    "Mulțimea continentelor",
                    "Mulțimea numerelor naturale mai mici decât 10",
                    "Mulțimea vocalelor",
                    "Mulțimea copacilor din parc"
                ],
                "correct": 1,
                "explanation": "Mulțimea numerelor naturale mai mici decât 10 este o mulțime numerică deoarece conține numere (0, 1, 2, 3, ..., 9)"
            },
            {
                "id": "L1_Q2",
                "type": "multiple_choice",
                "text": "Cum se notează relația că elementul 5 aparține mulțimii A?",
                "options": [
                    "5 ⊂ A",
                    "5 ∈ A",
                    "5 ≤ A",
                    "5 = A"
                ],
                "correct": 1,
                "explanation": "Relația de apartenență se notează cu ∈, deci 5 ∈ A înseamnă '5 aparține mulțimii A'"
            }
        ]
    },
    {
        "order": 2,
        "title": "Relații între mulțimi",
        "summary": "Două mulțimi pot avea relații între ele: egalitate (sunt identice), incluziune (una este submulțime a celeilalte), sau nici una din acestea. Se notează cu simboluri speciale pentru a exprima aceste relații.",
        "content": {
            "theory": [
                "**Egalitate de mulțimi**: A = B dacă și numai dacă au exact aceleași elemente",
                "**Submulțime**: A ⊆ B dacă orice element din A aparține și lui B",
                "**Submulțime proprie**: A ⊂ B dacă A ⊆ B și A ≠ B",
                "**Mulțimea vidă** (∅) este submulțime a oricărei mulțimi",
                "Orice mulțime este submulțime a ei însuși: A ⊆ A",
                "Dacă A ⊆ B și B ⊆ A, atunci A = B",
                "Dacă A ⊂ B și B ⊂ C, atunci A ⊂ C (tranzitivitate)"
            ],
            "examples": [
                {
                    "title": "Egalitate de mulțimi",
                    "content": "A = {1, 2, 3} și B = {3, 1, 2}\nA = B (au aceleași elemente, ordinea nu contează)"
                },
                {
                    "title": "Relație de incluziune",
                    "content": "A = {1, 2, 3} și B = {1, 2, 3, 4, 5}\nA ⊂ B (A este submulțime proprie a lui B)\nA ⊆ B (A este submulțime a lui B, notație non-strictă)"
                },
                {
                    "title": "Relații între mulțimi",
                    "content": "ℕ = {0, 1, 2, 3, ...} (numerele naturale)\nℤ = {..., -2, -1, 0, 1, 2, ...} (numerele întregi)\nℕ ⊂ ℤ (numerele naturale sunt submulțime a numerelor întregi)"
                }
            ],
            "tips": [
                "Nu confunda ∈ (apartență) cu ⊆ (incluziune): element ∈ mulțime, mulțime ⊆ mulțime",
                "∅ ⊆ A pentru orice mulțime A",
                "Pentru a arăta că A ≠ B, trebuie să găsești un element care e în A dar nu în B (sau invers)"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Dacă A = {1, 2} și B = {1, 2, 3}, ce relație există între A și B?",
                "options": [
                    "A = B",
                    "A ⊂ B",
                    "B ⊂ A",
                    "A ∉ B"
                ],
                "correct": 1,
                "explanation": "A ⊂ B (A este submulțime proprie a lui B) deoarece orice element din A este în B, dar B are și elementul 3 care nu e în A"
            }
        ]
    },
    {
        "order": 3,
        "title": "Mulțimi finite. Cardinalul unei mulțimi finite. Mulțimi infinite",
        "summary": "Mulțimile pot fi finite (cu un număr determinat de elemente) sau infinite (cu un număr nelimitat de elemente). **Cardinalul** unei mulțimi finite este numărul elementelor sale, notat cu |A| sau card(A).",
        "content": {
            "theory": [
                "**Mulțime finită**: o mulțime cu un număr determinat de elemente",
                "**Cardinalul** unei mulțimi finite A este numărul elementelor sale, notat |A| sau card(A)",
                "**Mulțime infinită**: o mulțime cu infinit de elemente (nenumărabile)",
                "Mulțimea numerelor naturale ℕ = {0, 1, 2, 3, ...} este infinită",
                "Mulțimea vidă ∅ are cardinal 0: card(∅) = 0",
                "**Mulțimi echipotente**: două mulțimi sunt echipotente dacă au același cardinal",
                "Două mulțimi finite sunt egale dacă și numai dacă au același cardinal și aceleași elemente"
            ],
            "examples": [
                {
                    "title": "Mulțimi finite și cardinale",
                    "content": "A = {a, e, i, o, u} → card(A) = 5\nB = {1, 2, 3} → card(B) = 3\nC = {10, 20, 30, 40, 50, 60} → card(C) = 6"
                },
                {
                    "title": "Mulțimi infinite",
                    "content": "ℕ = {0, 1, 2, 3, ...} - infinită\nℤ = {..., -2, -1, 0, 1, 2, ...} - infinită\n{x ∈ ℕ | x > 100} - infinită (toate numerele mai mari decât 100)"
                },
                {
                    "title": "Mulțimi echipotente",
                    "content": "A = {1, 2, 3} și B = {a, b, c}\ncard(A) = card(B) = 3\nA și B sunt echipotente (au același număr de elemente)"
                }
            ],
            "tips": [
                "Pentru a numara elementele unei mulțimi, le enumerezi pe toate",
                "Ordinea elementelor în enumerare nu afectează cardinalul",
                "Cardinalul unei mulțimi finite este întotdeauna un număr natural"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Care este cardinalul mulțimii A = {2, 4, 6, 8, 10}?",
                "options": [
                    "card(A) = 2",
                    "card(A) = 4",
                    "card(A) = 5",
                    "card(A) = 10"
                ],
                "correct": 2,
                "explanation": "Mulțimea A are 5 elemente (2, 4, 6, 8, 10), deci card(A) = 5"
            }
        ]
    },
    {
        "order": 4,
        "title": "Operații cu mulțimi: reuniune, intersecție, diferență",
        "summary": "Operațiile cu mulțimi sunt modalități de a combina sau compara mulțimi. Prin reuniune obținem o mulțime cu toate elementele, prin intersecție doar cele comune, iar prin diferență elementele din prima mulțime care nu sunt în a doua.",
        "content": {
            "theory": [
                "**Reuniunea** mulțimilor A și B (notată A ∪ B) conține toate elementele din A și din B",
                "**Intersecția** mulțimilor A și B (notată A ∩ B) conține doar elementele comune lui A și B",
                "**Diferența** mulțimilor A și B (notată A \\ B) conține elementele din A care nu sunt în B",
                "A ∪ B = {x | x ∈ A sau x ∈ B}",
                "A ∩ B = {x | x ∈ A și x ∈ B}",
                "A \\ B = {x | x ∈ A și x ∉ B}",
                "Dacă A ∩ B = ∅, mulțimile A și B se numesc **disjuncte**",
                "Reuniunea și intersecția sunt **comutative**: A ∪ B = B ∪ A, A ∩ B = B ∩ A",
                "Reuniunea și intersecția sunt **asociative**"
            ],
            "examples": [
                {
                    "title": "Reuniune de mulțimi",
                    "content": "A = {1, 2, 3} și B = {3, 4, 5}\nA ∪ B = {1, 2, 3, 4, 5}"
                },
                {
                    "title": "Intersecție de mulțimi",
                    "content": "A = {1, 2, 3, 4} și B = {2, 4, 6, 8}\nA ∩ B = {2, 4} (elementele comune)"
                },
                {
                    "title": "Diferență de mulțimi",
                    "content": "A = {1, 2, 3, 4, 5} și B = {2, 4}\nA \\ B = {1, 3, 5} (elementele din A care nu sunt în B)"
                }
            ],
            "tips": [
                "Pentru A ∪ B, scrii fiecare element o singură dată chiar dacă apare în ambele mulțimi",
                "A ∩ B conține DOAR elementele care sunt în AMBELE mulțimi",
                "A \\ B este necomutativă: A \\ B ≠ B \\ A (în general)"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Dacă A = {1, 2, 3} și B = {2, 3, 4}, care este A ∪ B?",
                "options": [
                    "{2, 3}",
                    "{1, 2, 3, 4}",
                    "{1, 2, 3}",
                    "{1, 4}"
                ],
                "correct": 1,
                "explanation": "A ∪ B conține toate elementele din A și din B: {1, 2, 3, 4}"
            },
            {
                "id": "L4_Q2",
                "type": "multiple_choice",
                "text": "Dacă A = {1, 2, 3} și B = {2, 3, 4}, care este A ∩ B?",
                "options": [
                    "{2, 3}",
                    "{1, 2, 3, 4}",
                    "{1, 2, 3}",
                    "{1, 4}"
                ],
                "correct": 0,
                "explanation": "A ∩ B conține doar elementele comune: {2, 3}"
            }
        ]
    },
    {
        "order": 5,
        "title": "Descompunerea numerelor naturale în produs de puteri de numere prime",
        "summary": "Orice număr natural mai mare decât 1 poate fi scris ca produs de puteri de numere prime. Aceasta se numește **descompunere în factori primi** sau **factorizare primă**. De exemplu, 12 = 2² × 3.",
        "content": {
            "theory": [
                "**Număr prim**: un număr natural mai mare decât 1 care are exact doi divizori: 1 și el însuși",
                "Numerele prime: 2, 3, 5, 7, 11, 13, 17, 19, 23, ...",
                "**Descompunere în factori primi**: orice n > 1 se poate scrie ca n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ",
                "Descompunerea în factori primi este **unică** (cu excepția ordinii)",
                "**Metoda: diviziuni succesive**: împarte numărul la cel mai mic divizor prim",
                "Procesul continuă până când se obține 1",
                "Puterea unui prim în descompunere arată de câte ori apare acel prim ca divizor"
            ],
            "examples": [
                {
                    "title": "Descompunere în factori primi",
                    "content": "12 = 2² × 3\n24 = 2³ × 3\n30 = 2 × 3 × 5\n100 = 2² × 5²\n60 = 2² × 3 × 5"
                },
                {
                    "title": "Metoda divizării succesive",
                    "content": "Pentru 24:\n24 ÷ 2 = 12\n12 ÷ 2 = 6\n6 ÷ 2 = 3\n3 ÷ 3 = 1\nDeci 24 = 2³ × 3"
                },
                {
                    "title": "Numere prime",
                    "content": "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, ..."
                }
            ],
            "tips": [
                "2 este singurul număr prim par",
                "Un număr este prim dacă nu are alți divizori decât 1 și el însuși",
                "Pentru verificare: dacă n nu este divizibil cu niciun prim până la √n, atunci n este prim"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Care este descompunerea în factori primi a numărului 20?",
                "options": [
                    "20 = 2 × 5",
                    "20 = 2² × 5",
                    "20 = 4 × 5",
                    "20 = 2 × 10"
                ],
                "correct": 1,
                "explanation": "20 = 2² × 5 (20 = 4 × 5, iar 4 = 2²)"
            }
        ]
    },
    {
        "order": 6,
        "title": "Determinarea celui mai mare divizor comun și a celui mai mic multiplu comun",
        "summary": "Pentru două sau mai multe numere naturale, cel mai mare divizor comun (cmmdc) este cel mai mare număr care le divide pe toate, iar cel mai mic multiplu comun (cmmmc) este cel mai mic număr care este multiplu al tuturor.",
        "content": {
            "theory": [
                "**Divizor comun**: un număr care divide doi sau mai mulți numere",
                "**Cel mai mare divizor comun (cmmdc)**: notate (a, b) sau gcd(a, b)",
                "**Multiplu comun**: un număr care este multiplu a doi sau mai mulți numere",
                "**Cel mai mic multiplu comun (cmmmc)**: notat [a, b] sau lcm(a, b)",
                "**Metoda descompunerii în factori primi**:",
                "  - Pentru cmmdc: iau factorii comuni cu puteri minime",
                "  - Pentru cmmmc: iau toți factorii cu puteri maxime",
                "**Formula**: (a, b) × [a, b] = a × b",
                "Dacă (a, b) = 1, numerele se numesc **prime între ele** (coprime)"
            ],
            "examples": [
                {
                    "title": "Cel mai mare divizor comun",
                    "content": "12 = 2² × 3\n18 = 2 × 3²\ncmmdc(12, 18) = 2 × 3 = 6\nDivizori comuni: 1, 2, 3, 6 (cel mai mare este 6)"
                },
                {
                    "title": "Cel mai mic multiplu comun",
                    "content": "12 = 2² × 3\n18 = 2 × 3²\ncmmmc(12, 18) = 2² × 3² = 4 × 9 = 36\nMultipli comuni: 36, 72, 108, ... (cel mai mic este 36)"
                },
                {
                    "title": "Numere prime între ele",
                    "content": "9 = 3²\n16 = 2⁴\ncmmdc(9, 16) = 1 (nu au factori comuni)\n9 și 16 sunt prime între ele"
                }
            ],
            "tips": [
                "Descompune în factori primi, apoi aplică regula",
                "Pentru cmmdc, iei puteri MINIME ale factorilor comuni",
                "Pentru cmmmc, iei puteri MAXIME ale tuturor factorilor"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "Care este cmmdc(12, 18)?",
                "options": [
                    "6",
                    "12",
                    "18",
                    "36"
                ],
                "correct": 0,
                "explanation": "12 = 2² × 3, 18 = 2 × 3². cmmdc = 2 × 3 = 6"
            }
        ]
    },
    {
        "order": 7,
        "title": "Proprietăți ale divizibilității în ℕ",
        "summary": "Divizibilitatea în mulțimea numerelor naturale are proprietăți importante care ajută în rezolvarea problemelor. Dintre acestea: reflexivitate, antisimetrie, tranzitivitate și reguli pentru sume, diferențe și produse.",
        "content": {
            "theory": [
                "**Reflexivitate**: a | a pentru orice a ∈ ℕ (orice număr se divide pe sine)",
                "**Antisimetrie**: dacă a | b și b | a, atunci a = b",
                "**Tranzitivitate**: dacă a | b și b | c, atunci a | c",
                "**Regula pentru sume**: dacă a | b și a | c, atunci a | (b + c)",
                "**Regula pentru diferență**: dacă a | b și a | c, atunci a | (b - c)",
                "**Regula pentru produs**: dacă a | b, atunci a | (b × c) pentru orice c",
                "**Regula pentru combinații**: dacă a | b și a | c, atunci a | (mb + nc) pentru orice m, n ∈ ℕ"
            ],
            "examples": [
                {
                    "title": "Proprietate de tranzitivitate",
                    "content": "6 | 12 și 12 | 24, deci 6 | 24\nVerificare: 24 = 6 × 4 ✓"
                },
                {
                    "title": "Regula pentru sume",
                    "content": "5 | 10 și 5 | 15, deci 5 | (10 + 15) = 5 | 25\nVerificare: 25 = 5 × 5 ✓"
                },
                {
                    "title": "Regula pentru produse",
                    "content": "3 | 12, deci 3 | (12 × 2) = 3 | 24\nVerificare: 24 = 3 × 8 ✓"
                }
            ],
            "tips": [
                "Foloseaza aceste proprietati pentru a simplifica problemele",
                "Pentru a verifica dacă a | b, calculează b ÷ a și vede dacă e număr întreg",
                "Proprietăți utile în exerciții cu divizibilitate"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "Dacă 4 | 12 și 4 | 20, ce putem spune despre 4 și (12 + 20)?",
                "options": [
                    "4 ∤ 32",
                    "4 | 32",
                    "32 | 4",
                    "4 = 32"
                ],
                "correct": 1,
                "explanation": "Conform regulii pentru sume, dacă 4 | 12 și 4 | 20, atunci 4 | (12 + 20) = 4 | 32"
            }
        ]
    },
    {
        "order": 8,
        "title": "Exerciții recapitulative",
        "summary": "În această lecție vom practica și consolida toate conceptele din Capitolul 1: mulțimi, notații, operații cu mulțimi, descompuneri în factori primi, cmmdc și cmmmc, și proprietăți ale divizibilității.",
        "content": {
            "theory": [
                "Recapitulare: mulțimi și notații",
                "Recapitulare: relații între mulțimi și cardinale",
                "Recapitulare: operații cu mulțimi (reuniune, intersecție, diferență)",
                "Recapitulare: descompuneri în factori primi",
                "Recapitulare: cmmdc și cmmmc",
                "Recapitulare: proprietăți ale divizibilității"
            ],
            "examples": [
                {
                    "title": "Exercițiu compus 1",
                    "content": "Fie A = {1, 2, 3, 4, 5} și B = {3, 4, 5, 6, 7}\nCalculează: A ∪ B, A ∩ B, A \\ B"
                },
                {
                    "title": "Exercițiu compus 2",
                    "content": "Descompune în factori primi: 24, 35, 100\nCalculează cmmdc(24, 35) și cmmmc(24, 35)"
                }
            ],
            "tips": [
                "Verifica răspunsurile prin diverse metode",
                "Foloseaza diagrame Venn pentru vizualizare",
                "Practica cu numere diverse"
            ]
        },
        "questions": [
            {
                "id": "L8_Q1",
                "type": "multiple_choice",
                "text": "Fie A = {1, 2, 3} și B = {2, 3, 4}. Care este A \\ B?",
                "options": [
                    "{1}",
                    "{4}",
                    "{2, 3}",
                    "{1, 2, 3, 4}"
                ],
                "correct": 0,
                "explanation": "A \\ B conține elementele din A care nu sunt în B. Din A = {1, 2, 3} scoatem elementele care sunt și în B = {2, 3, 4}, deci A \\ B = {1}"
            }
        ]
    },
    {
        "order": 9,
        "title": "Evaluare - Capitolul 1",
        "summary": "Test final pentru verificarea înțelegerii tuturor conceptelor din Capitolul 1: Mulțimi. Mulțimea numerelor naturale. Evaluează cunoștințele despre mulțimi, operații, divisibilitate și factori primi.",
        "content": {
            "theory": [
                "Teste de evaluare pentru: mulțimi și notații",
                "Teste pentru: relații între mulțimi",
                "Teste pentru: operații cu mulțimi",
                "Teste pentru: numere prime și descompuneri",
                "Teste pentru: cmmdc și cmmmc",
                "Teste pentru: proprietăți ale divizibilității"
            ],
            "examples": [
                {
                    "title": "Problema integrativă 1",
                    "content": "Dă două mulțimi și calculează toate operațiile între ele"
                },
                {
                    "title": "Problema integrativă 2",
                    "content": "Descompune numere în factori primi și calculează cmmdc și cmmmc"
                }
            ],
            "tips": [
                "Citește atent întrebările",
                "Verifica răspunsurile",
                "Foloseaza metode multiple pentru confirmare"
            ]
        },
        "questions": [
            {
                "id": "L9_Q1",
                "type": "multiple_choice",
                "text": "Alcătuiește o mulțime cu numerele prime mai mici decât 10.",
                "options": [
                    "{2, 3, 5}",
                    "{2, 3, 5, 7}",
                    "{1, 2, 3, 5, 7}",
                    "{2, 3, 5, 7, 9}"
                ],
                "correct": 1,
                "explanation": "Numerele prime mai mici decât 10 sunt: 2, 3, 5, 7 (1 nu este prim, 9 nu este prim)"
            }
        ]
    }
]

def create_chapter_1_grade6():
    """Create complete Chapter 1 for Grade 6"""

    chapter_1 = {
        "name": "Mulțimi. Mulțimea numerelor naturale",
        "order": 1,
        "description": "Capitolul 1 introduce conceptul de mulțime, operații cu mulțimi, și proprietăți ale numerelor naturale. Se studiază notații, relații între mulțimi, cardinale, descompuneri în factori primi, cmmdc și cmmmc.",
        "lessons": CHAPTER_1_LESSONS
    }

    return chapter_1

def main():
    print("=" * 80)
    print("📚 CREATING CHAPTER 1 - MATEMATICA CLASA VI-a")
    print("=" * 80)

    # Create chapter data
    chapter_data = create_chapter_1_grade6()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Total lessons: {len(chapter_data['lessons'])}")

    total_questions = sum(len(lesson.get('questions', [])) for lesson in chapter_data['lessons'])
    print(f"   Total questions: {total_questions}")

    # Save to file
    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_1_GRADE6_MATEMATICA.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    # Display summary
    print(f"\n📋 CHAPTER 1 LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']}. {lesson['title'][:60]}")
        print(f"   Questions: {num_questions}")

    print("\n" + "=" * 80)
    print("✅ CHAPTER 1 GRADE 6 READY!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

