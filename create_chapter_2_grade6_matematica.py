#!/usr/bin/env python3
"""
Create Chapter 2 Matematica Clasa VI-a
Based on PLANIFICARE DIDACTICĂ
Chapter 2: Rapoarte și proporții
"""

import json
from pathlib import Path

# Chapter 2 Lessons from PLANIFICARE DIDACTICĂ
CHAPTER_2_LESSONS = [
    {
        "order": 1,
        "title": "Rapoarte",
        "summary": "Un **raport** este o comparație între două mărimi exprimate prin împărțire. Se notează a:b sau a/b și se citește \"a la b\". Raporturile sunt folosite pentru a exprima relații între mărimi: viteze, densități, scări, etc.",
        "content": {
            "theory": [
                "Un **raport** este o fracție care compară două mărimi de același fel",
                "Se notează: a:b sau a/b (a se numește antecedent, b se numește consecvent)",
                "**Raportul numerelor a și b** este a/b",
                "Raporturile echivalente: a/b = (a×k)/(b×k) pentru k ≠ 0",
                "Raportul în cea mai simplă formă: cmmdc(a,b) = 1",
                "Pentru a compara rapoarte, le aducem la același numitor",
                "Un raport nu are unitate de măsură (este adimensional) dacă mărimi sunt de același fel",
                "Raporturile pot exprima viteze (km/h), densități (kg/m³), scări hărți, etc."
            ],
            "examples": [
                {
                    "title": "Rapoarte simple",
                    "content": "Raportul numerelor 4 și 5: 4/5 sau 4:5\nRaportul numerelor 12 și 8: 12/8 = 3/2 (în forma simplificată)\nRaportul dintre lungime și lățime unui dreptunghi: 20/15 = 4/3"
                },
                {
                    "title": "Rapoarte echivalente",
                    "content": "1/2 = 2/4 = 3/6 = 5/10 (toate reprezintă același raport)\n3/4 = 6/8 = 9/12 (rapoarte echivalente)"
                },
                {
                    "title": "Rapoarte în situații reale",
                    "content": "Scara unei hărți: 1/1000000 (1 cm pe hartă = 1000000 cm în realitate)\nViteză: 100 km/h (raportul dintre distanță și timp)\nDensitate: 2.7 g/cm³ (raportul dintre masă și volum)"
                }
            ],
            "tips": [
                "Pentru a simplifica un raport, determină cmmdc și împarte ambii termeni la el",
                "Două rapoarte sunt echivalente dacă a/b = c/d, atunci a×d = b×c",
                "Un raport se poate exprima ca procent: a/b = (a/b)×100%"
            ]
        },
        "questions": [
            {
                "id": "L1_Q1",
                "type": "multiple_choice",
                "text": "Care este raportul numerelor 6 și 9 în forma simplificată?",
                "options": ["6/9", "2/3", "3/2", "1/2"],
                "correct": 1,
                "explanation": "6/9 = (6÷3)/(9÷3) = 2/3"
            }
        ]
    },
    {
        "order": 2,
        "title": "Proporții. Proprietatea fundamentală a proporțiilor. Determinarea unui termen necunoscut dintr-o proporție",
        "summary": "O **proporție** este egalitatea a două rapoarte. Se notează a/b = c/d și se citește \"a este la b ca c este la d\". Proprietatea fundamentală afirmă că într-o proporție, produsul extremilor egal cu produsul mezilor: a×d = b×c.",
        "content": {
            "theory": [
                "O **proporție** este egalitatea a două rapoarte: a/b = c/d",
                "Se citește: \"a este la b ca c este la d\"",
                "În proporția a/b = c/d:",
                "  - a și d se numesc **extremi**",
                "  - b și c se numesc **mezi**",
                "**Proprietatea fundamentală**: a×d = b×c (produsul extremilor = produsul mezilor)",
                "Pentru a determina un termen necunoscut x: izolează x și aplică regula proporțiilor",
                "Dacă a/b = c/d, atunci: a = (b×c)/d, b = (a×d)/c, c = (a×d)/b, d = (b×c)/a",
                "O proporție cu termeni întregi poate fi amplificată/simplificată fără a se schimba"
            ],
            "examples": [
                {
                    "title": "Verificarea unei proporții",
                    "content": "2/3 = 4/6 este o proporție?\nVerificare: 2×6 = 12 și 3×4 = 12\n12 = 12, deci DA, este proporție"
                },
                {
                    "title": "Găsirea unui termen necunoscut",
                    "content": "Fie x/4 = 3/2\nAplică regula: x×2 = 4×3\n2x = 12\nx = 6"
                },
                {
                    "title": "Aplicație practică",
                    "content": "Dacă 2 kg de mere costă 6 lei, cât costă 5 kg?\n2/6 = 5/x\n2x = 30\nx = 15 lei"
                }
            ],
            "tips": [
                "Memorează: extremi cu extremi, mezi cu mezi",
                "Pentru găsire termen necunoscut: înmulțește extremii/mezi diagonali și împarte la termenul opus",
                "Verifică întotdeauna răspunsul prin înlocuire în proporție"
            ]
        },
        "questions": [
            {
                "id": "L2_Q1",
                "type": "multiple_choice",
                "text": "Dacă x/5 = 4/10, care este valoarea lui x?",
                "options": ["2", "4", "8", "20"],
                "correct": 0,
                "explanation": "x×10 = 5×4, deci 10x = 20, x = 2"
            }
        ]
    },
    {
        "order": 3,
        "title": "Proporții derivate",
        "summary": "Din proprietatea fundamentală a proporțiilor se pot obține **proporții derivate** prin operații cu termenii proporției. Acestea sunt utile în rezolvarea problemelor și manipularea proporțiilor.",
        "content": {
            "theory": [
                "Dacă a/b = c/d, atunci sunt adevărate și proporțiile derivate:",
                "**Permutarea**: d/b = c/a (schimbă extremii între ei)",
                "**Inversion**: b/a = d/c (inversează rapoartele)",
                "**Compoziție**: (a+b)/b = (c+d)/d",
                "**Descompunere**: (a-b)/b = (c-d)/d (pentru a ≥ b și c ≥ d)",
                "**Compoziție și descompunere**: (a+b)/(a-b) = (c+d)/(c-d)",
                "Aceste proporții derivate mențin egalitatea produsului extremilor cu produsul mezilor"
            ],
            "examples": [
                {
                    "title": "Permutare de termeni",
                    "content": "Dacă 2/5 = 4/10\nPermutare: 10/5 = 4/2\nVerificare: 10×2 = 20 și 5×4 = 20 ✓"
                },
                {
                    "title": "Compoziție",
                    "content": "Dacă 3/5 = 6/10\n(3+5)/5 = (6+10)/10\n8/5 = 16/10\nVerificare: 8×10 = 80 și 5×16 = 80 ✓"
                },
                {
                    "title": "Proporții derivate în problemă",
                    "content": "Dacă a/b = 2/3 și a+b = 25\nAplicând compoziție: (a+b)/b = (2+3)/3\n25/b = 5/3\nb = 15, deci a = 10"
                }
            ],
            "tips": [
                "Proporțiile derivate sunt utile pentru probleme mai complexe",
                "Orice transformare care menține produsul extremilor = produsul mezilor e validă",
                "Practica ajută să recunoști rapid proporțiile derivate"
            ]
        },
        "questions": [
            {
                "id": "L3_Q1",
                "type": "multiple_choice",
                "text": "Dacă a/b = 3/4, care din următoarele este o proporție derivată corectă?",
                "options": ["b/a = 4/3", "a/b = 4/3", "b/a = 3/4", "a/b = 3/7"],
                "correct": 0,
                "explanation": "Prin inversion: dacă a/b = 3/4, atunci b/a = 4/3"
            }
        ]
    },
    {
        "order": 4,
        "title": "Șir de rapoarte egale",
        "summary": "Un **șir de rapoarte egale** este o succesiune de mai mult de două rapoarte egale: a/b = c/d = e/f = k. Constanta k se numește **coeficientul de proporționalitate**. Aceasta permite rezolvarea problemelor cu mai multe mărimi proporționale.",
        "content": {
            "theory": [
                "Un **șir de rapoarte egale**: a/b = c/d = e/f = ... = k",
                "k este **coeficientul de proporționalitate**",
                "Din a/b = k, obținem a = kb",
                "Pentru un șir de rapoarte: a/b = c/d = e/f, avem a+c+e / b+d+f = a/b",
                "Proprietate: Dacă a/b = c/d = e/f = k, atunci (a+c+e)/(b+d+f) = k",
                "Invers: Dacă a/b = c/d = e/f = k, atunci a = kb, c = kd, e = kf",
                "Șirurile de rapoarte egale sunt utile pentru a divide o mărime în mai multe părți proporționale"
            ],
            "examples": [
                {
                    "title": "Șir de rapoarte egale",
                    "content": "2/3 = 4/6 = 6/9 = 8/12 = 2/3\nCoeficientul de proporționalitate: k = 2/3"
                },
                {
                    "title": "Aplicație: împărțire proporțională",
                    "content": "Împarte 60 în trei părți proporționale cu 2, 3, și 5\nFie a/2 = b/3 = c/5 = k\nAtunci a = 2k, b = 3k, c = 5k\nDar a + b + c = 60\n2k + 3k + 5k = 60\n10k = 60, k = 6\nDeci a = 12, b = 18, c = 30"
                },
                {
                    "title": "Proprietatea șirului",
                    "content": "Dacă a/2 = b/3 = c/5 = k\nAtunci (a+b+c)/(2+3+5) = k\n(a+b+c)/10 = k"
                }
            ],
            "tips": [
                "Șirurile de rapoarte sunt utile pentru probleme de împărțire proporțională",
                "Întotdeauna există o constantă k care leagă toți termenii",
                "Suma exponenților din șir ajută la rezolvare rapidă"
            ]
        },
        "questions": [
            {
                "id": "L4_Q1",
                "type": "multiple_choice",
                "text": "Dacă a/2 = b/5 = 6, care sunt valorile lui a și b?",
                "options": [
                    "a = 12, b = 30",
                    "a = 6, b = 15",
                    "a = 2, b = 5",
                    "a = 3, b = 7.5"
                ],
                "correct": 0,
                "explanation": "Din a/2 = 6, obținem a = 12. Din b/5 = 6, obținem b = 30"
            }
        ]
    },
    {
        "order": 5,
        "title": "Mărimi direct proporționale",
        "summary": "Două mărimi sunt **direct proporționale** dacă raportul lor este constant. Dacă x și y sunt direct proporționale, atunci y/x = k (constant), sau y = kx. Graficul unei relații de proporționalitate directă este o dreaptă ce trece prin origine.",
        "content": {
            "theory": [
                "Mărimi x și y sunt **direct proporționale** dacă y = kx, unde k ≠ 0 este constantă",
                "k se numește **coeficient de proporționalitate**",
                "Reciproc: dacă y/x = k (constant), atunci y și x sunt direct proporționale",
                "Proprietate: Dacă x₁, x₂, ... sunt valori pentru x și y₁, y₂, ... pentru y",
                "Atunci x₁/y₁ = x₂/y₂ = ... = 1/k",
                "Graficul proporționalității directe: linie dreaptă care trece prin origine (0,0)",
                "Cu cât k mai mare, cu atât linia e mai abruptă",
                "Aplicații: viteza constantă (d = v×t), prețuri (cost = preț×cantitate)"
            ],
            "examples": [
                {
                    "title": "Proporționalitate directă",
                    "content": "Dacă 1 kg mere costă 3 lei\nAtunci 2 kg costă 6 lei\n3 kg costă 9 lei\nRelația: cost = 3 × kg\nCoeficient: k = 3"
                },
                {
                    "title": "Grafic de proporționalitate directă",
                    "content": "Pentru y = 2x:\n(0,0), (1,2), (2,4), (3,6), (4,8)\nGraficul este o linie dreaptă care trece prin origine"
                },
                {
                    "title": "Viteza constantă",
                    "content": "Un automobil merge cu viteza constantă 80 km/h\nDistanța = 80 × timp\nÎn 1 h: 80 km\nÎn 2 h: 160 km\nÎn 3 h: 240 km"
                }
            ],
            "tips": [
                "Proporționalitatea directă înseamnă: când una crește, cealaltă crește proporțional",
                "Graficul trece ÎNTOTDEAUNA prin originea (0,0)",
                "Pentru a găsi k: împarte orice valoare a lui y la valoarea corespunzătoare a lui x"
            ]
        },
        "questions": [
            {
                "id": "L5_Q1",
                "type": "multiple_choice",
                "text": "Dacă y = 5x și x = 4, care este y?",
                "options": ["9", "15", "20", "25"],
                "correct": 2,
                "explanation": "y = 5×4 = 20"
            }
        ]
    },
    {
        "order": 6,
        "title": "Mărimi invers proporționale",
        "summary": "Două mărimi sunt **invers proporționale** dacă produsul lor este constant. Dacă x și y sunt invers proporționale, atunci x×y = k (constant), sau y = k/x. Graficul unei relații de invers proporționalitate este o hiperbolă.",
        "content": {
            "theory": [
                "Mărimi x și y sunt **invers proporționale** dacă x×y = k, unde k ≠ 0 este constantă",
                "Alternativ: y = k/x",
                "k se numește **coeficient de proporționalitate**",
                "Proprietate: Dacă x₁, x₂ sunt valori pentru x și y₁, y₂ pentru y",
                "Atunci x₁×y₁ = x₂×y₂ = k",
                "Graficul: hiperbolă (curba cu două ramuri)",
                "Curba nu trece prin origine",
                "Cu cât k mai mare, cu atât hiperbolă e mai departe de axe",
                "Aplicații: viteză vs timp (pentru distanță constantă), număr muncitori vs timp (pentru job constant)"
            ],
            "examples": [
                {
                    "title": "Invers proporționalitate",
                    "content": "Pentru a parcurge 200 km:\n- Viteza 100 km/h → timp 2 h\n- Viteza 50 km/h → timp 4 h\n- Viteza 40 km/h → timp 5 h\nProdusul: 100×2 = 50×4 = 40×5 = 200"
                },
                {
                    "title": "Formula invers proporționalității",
                    "content": "Dacă x×y = 12:\nx = 1, y = 12\nx = 2, y = 6\nx = 3, y = 4\nx = 4, y = 3\nx = 6, y = 2"
                },
                {
                    "title": "Muncitori și timp",
                    "content": "Pentru a termina o lucrare:\n- 1 muncitor: 12 zile\n- 2 muncitori: 6 zile\n- 3 muncitori: 4 zile\n- 4 muncitori: 3 zile\nProdusul: 1×12 = 2×6 = 3×4 = 4×3 = 12"
                }
            ],
            "tips": [
                "Invers proporționalitate: când una crește, cealaltă scade",
                "Produsul rămâne constant",
                "Graficul NU trece prin origine (spre deosebire de proporționalitate directă)"
            ]
        },
        "questions": [
            {
                "id": "L6_Q1",
                "type": "multiple_choice",
                "text": "Dacă x și y sunt invers proporționale și x = 2, y = 9, care este y când x = 3?",
                "options": ["6", "13.5", "4.5", "6"],
                "correct": 0,
                "explanation": "Produsul constant: k = 2×9 = 18. Când x = 3: y = 18/3 = 6"
            }
        ]
    },
    {
        "order": 7,
        "title": "Regula de trei simplă",
        "summary": "**Regula de trei simplă** este o metodă rapidă de rezolvare a problemelor cu proporții. Se folosește atunci când trei termeni ai unei proporții sunt cunoscuți și trebuie să găsim al patrulea. Funcționează pentru atât proporționalitate directă, cât și inversă.",
        "content": {
            "theory": [
                "**Regula de trei simplă** permite găsirea unui termen necunoscut dintr-o proporție",
                "Se folosește când trei termeni sunt cunoscuți",
                "**Pasul 1**: Identifică dacă problema e de proporționalitate directă sau inversă",
                "**Pasul 2**: Scrie rapoartele în ordinea potrivită",
                "**Pasul 3**: Aplică formula: x = (b×c)/a (pentru proporție a/b = c/x)",
                "**Pentru proporționalitate directă**: mărimile cresc/scad împreună",
                "**Pentru proporționalitate inversă**: când una crește, cealaltă scade"
            ],
            "examples": [
                {
                    "title": "Regula de trei simplă - directă",
                    "content": "5 caiete costă 10 lei. Cât costă 8 caiete?\nProporție: 5/10 = 8/x\nx = (10×8)/5 = 16 lei"
                },
                {
                    "title": "Regula de trei simplă - inversă",
                    "content": "3 muncitori termină lucrarea în 4 zile. În câte zile o vor termina 6 muncitori?\nProporție inversă: 3×4 = 6×x\nx = (3×4)/6 = 2 zile"
                },
                {
                    "title": "Procente cu regula de trei",
                    "content": "Un produs costă 100 lei și se scumpește cu 20%. Cât va costa?\n100/100 = x/120\nx = 120 lei"
                }
            ],
            "tips": [
                "Identifică tipul de proporționalitate: directă sau inversă",
                "Scrie proporția cu x în poziția corectă",
                "Produsul extremilor = produsul mezilor"
            ]
        },
        "questions": [
            {
                "id": "L7_Q1",
                "type": "multiple_choice",
                "text": "4 cărți costă 20 lei. Cât costă 10 cărți?",
                "options": ["40 lei", "50 lei", "45 lei", "60 lei"],
                "correct": 1,
                "explanation": "4/20 = 10/x → x = (20×10)/4 = 50 lei"
            }
        ]
    },
    {
        "order": 8,
        "title": "Elemente de organizare a datelor. Reprezentarea datelor prin grafice în contextul proporționalității",
        "summary": "Datele pot fi organizate și reprezentate în diferite moduri: tabele, grafice de bare, grafice liniare, diagramele circulare. Reprezentarea vizuală ajută la înțelegerea și analizarea datelor, mai ales în contextul proporționalității.",
        "content": {
            "theory": [
                "**Tabel**: organizează date în rânduri și coloane",
                "**Grafic de bare**: compară valori între categorii diferite",
                "**Grafic liniar**: arată tendințe și relații de proporționalitate",
                "**Diagramă circulară**: arată proporția fiecărei părți din total",
                "**Histogramă**: arată frecvența datelor în intervale",
                "Pentru proporționalitate directă: graficul liniar e o linie dreaptă prin origine",
                "Pentru invers proporționalitate: graficul e o hiperbolă",
                "Interpretarea graficelor: observă tendințe, extreme, și puncte importante"
            ],
            "examples": [
                {
                    "title": "Tabel și grafic",
                    "content": "Vânzări lunare:\nLuna 1: 100\nLuna 2: 150\nLuna 3: 120\nLuna 4: 200\nPot fi reprezentate în grafic cu bare sau linie"
                },
                {
                    "title": "Proporționalitate pe grafic",
                    "content": "Pentru y = 2x, graficul e o linie dreaptă\nPuncte: (0,0), (1,2), (2,4), (3,6)\nLinia trece prin origine"
                },
                {
                    "title": "Diagramă circulară",
                    "content": "Distribuția activităților zilnice:\nMuncă: 40% → 144°\nSomnul: 33% → 120°\nOdihna: 27% → 97°"
                }
            ],
            "tips": [
                "Alege tipul de grafic potrivit pentru datele tale",
                "Eticheteaza axele și titlul graficului",
                "Observă tendințele și relațiile din grafic"
            ]
        },
        "questions": [
            {
                "id": "L8_Q1",
                "type": "multiple_choice",
                "text": "Ce tip de grafic e cel mai potrivit pentru a arăta tendința vânzărilor pe 12 luni?",
                "options": [
                    "Diagramă circulară",
                    "Grafic de bare",
                    "Grafic liniar",
                    "Histogramă"
                ],
                "correct": 2,
                "explanation": "Graficul liniar e potrivit pentru a arăta tendințe în timp"
            }
        ]
    },
    {
        "order": 9,
        "title": "Probabilități",
        "summary": "**Probabilitatea** măsoară șansa ca un eveniment să se întâmple. Se notează P(A) și se calculează ca P(A) = (numărul cazurilor favorabile) / (numărul cazurilor posibile). Probabilitatea este un număr între 0 și 1.",
        "content": {
            "theory": [
                "**Probabilitate**: măsura șansei ca un eveniment să se producă",
                "**Eveniment sigur**: P(A) = 1 (sigur că se va întâmpla)",
                "**Eveniment imposibil**: P(A) = 0 (sigur că nu se va întâmpla)",
                "**Eveniment aleatoriu**: 0 < P(A) < 1",
                "**Formula**: P(A) = (numărul cazurilor favorabile) / (numărul cazurilor posibile)",
                "**Cazuri favorabile**: rezultatele care corespund evenimentului A",
                "**Cazuri posibile**: toate rezultatele posibile ale experimentului",
                "**Probabilitate de complement**: P(non-A) = 1 - P(A)"
            ],
            "examples": [
                {
                    "title": "Zar cu 6 fețe",
                    "content": "Probabilitatea de a obține 3:\nCazuri favorabile: 1 (doar 3)\nCazuri posibile: 6 (1, 2, 3, 4, 5, 6)\nP(3) = 1/6 ≈ 0.167"
                },
                {
                    "title": "Monedă",
                    "content": "Probabilitatea de a obține cap:\nCazuri favorabile: 1\nCazuri posibile: 2\nP(cap) = 1/2 = 0.5"
                },
                {
                    "title": "Cărți de joc",
                    "content": "Probabilitatea de a extrage un as din 52 cărți:\nCazuri favorabile: 4 ași\nCazuri posibile: 52\nP(as) = 4/52 = 1/13"
                }
            ],
            "tips": [
                "Probabilitatea e întotdeauna între 0 și 1",
                "Suma probabilităților tuturor cazurilor posibile = 1",
                "Experimentează cu zaruri și monede pentru a înțelege probabilitate"
            ]
        },
        "questions": [
            {
                "id": "L9_Q1",
                "type": "multiple_choice",
                "text": "Care e probabilitatea de a obține un număr par la aruncarea unui zar?",
                "options": ["1/6", "1/3", "1/2", "2/3"],
                "correct": 2,
                "explanation": "Numere pare: 2, 4, 6 (3 cazuri favorabile din 6 posibile) → P = 3/6 = 1/2"
            }
        ]
    },
    {
        "order": 10,
        "title": "Exerciții recapitulative",
        "summary": "În această lecție vom practica și consolida toate conceptele din Capitolul 2: rapoarte, proporții, proporționalitate directă și inversă, regula de trei, grafice și probabilități.",
        "content": {
            "theory": [
                "Recapitulare: rapoarte și proporții",
                "Recapitulare: proporționalitate directă și inversă",
                "Recapitulare: regula de trei simplă",
                "Recapitulare: reprezentarea datelor",
                "Recapitulare: probabilități",
                "Probleme mixte și aplicații practice"
            ],
            "examples": [
                {
                    "title": "Problemă integrativă 1",
                    "content": "Trei muncitori termină o lucrare în 6 zile. Câți muncitori sunt necesari pentru a termina în 3 zile?"
                },
                {
                    "title": "Problemă integrativă 2",
                    "content": "Un produs costă 100 lei și se ieftinește cu 15%. Cât va costa?"
                }
            ],
            "tips": [
                "Identifică tipul de problemă",
                "Aplică regula sau formula potrivită",
                "Verifica răspunsul prin calcule inverse"
            ]
        },
        "questions": [
            {
                "id": "L10_Q1",
                "type": "multiple_choice",
                "text": "Dacă un autobuz parcurge 240 km în 3 ore, cât va parcurge în 5 ore la aceeași viteză?",
                "options": ["300 km", "360 km", "400 km", "480 km"],
                "correct": 3,
                "explanation": "Viteza = 240/3 = 80 km/h. În 5 ore: 80×5 = 400 km"
            }
        ]
    },
    {
        "order": 11,
        "title": "Evaluare - Capitolul 2",
        "summary": "Test final pentru verificarea înțelegerii tuturor conceptelor din Capitolul 2: Rapoarte și proporții. Evaluează cunoștințele despre rapoarte, proporții, proporționalitate, regula de trei și probabilități.",
        "content": {
            "theory": [
                "Teste de evaluare pentru rapoarte și proporții",
                "Teste pentru proporționalitate directă și inversă",
                "Teste pentru regula de trei",
                "Teste pentru reprezentarea datelor",
                "Teste pentru probabilități",
                "Probleme de sinteză"
            ],
            "examples": [
                {
                    "title": "Problemă de evaluare 1",
                    "content": "Trei numere sunt în raport 2:3:5. Suma lor este 100. Găsiți numerele."
                },
                {
                    "title": "Problemă de evaluare 2",
                    "content": "Un produs se scumpește cu 20%, apoi se ieftinește cu 20%. Preț inițial 100 lei. Preț final?"
                }
            ],
            "tips": [
                "Citește atent problema",
                "Identifică ce e cunoscut și ce trebuie găsit",
                "Verifica răspunsul"
            ]
        },
        "questions": [
            {
                "id": "L11_Q1",
                "type": "multiple_choice",
                "text": "Dacă a/2 = b/3 = c/5 și a + b + c = 40, care este a?",
                "options": [
                    "8",
                    "12",
                    "20",
                    "10"
                ],
                "correct": 0,
                "explanation": "Fie a/2 = b/3 = c/5 = k. Atunci a = 2k, b = 3k, c = 5k. 2k + 3k + 5k = 40 → 10k = 40 → k = 4 → a = 8"
            }
        ]
    }
]

def create_chapter_2_grade6():
    """Create complete Chapter 2 for Grade 6"""

    chapter_2 = {
        "name": "Rapoarte și proporții",
        "order": 2,
        "description": "Capitolul 2 introduce conceptele de rapoarte, proporții, proporționalitate directă și inversă. Se studiază aplicații practice ale proporțiilor, regula de trei simplă, reprezentarea datelor și noțiuni introductive de probabilitate.",
        "lessons": CHAPTER_2_LESSONS
    }

    return chapter_2

def main():
    print("=" * 80)
    print("📚 CREATING CHAPTER 2 - MATEMATICA CLASA VI-a")
    print("=" * 80)

    # Create chapter data
    chapter_data = create_chapter_2_grade6()

    print(f"\n✅ Chapter created: {chapter_data['name']}")
    print(f"   Total lessons: {len(chapter_data['lessons'])}")

    total_questions = sum(len(lesson.get('questions', [])) for lesson in chapter_data['lessons'])
    print(f"   Total questions: {total_questions}")

    # Save to file
    output_file = '/Users/mdica/PycharmProjects/EduPex/CHAPTER_2_GRADE6_MATEMATICA.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapter_data, f, indent=2, ensure_ascii=False)

    print(f"   Saved to: {output_file}")

    # Display summary
    print(f"\n📋 CHAPTER 2 LESSONS:")
    print("-" * 80)
    for lesson in chapter_data['lessons']:
        num_questions = len(lesson['questions'])
        print(f"{lesson['order']}. {lesson['title'][:60]}")
        print(f"   Questions: {num_questions}")

    print("\n" + "=" * 80)
    print("✅ CHAPTER 2 GRADE 6 READY!")
    print("=" * 80)

    return chapter_data

if __name__ == '__main__':
    chapter_data = main()

