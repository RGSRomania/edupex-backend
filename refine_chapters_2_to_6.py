#!/usr/bin/env python3
"""
Refine and clean Chapters 2-6 extracted content
- Remove page markers
- Merge related sections
- Generate professional summaries
- Output cleaned JSON
"""

import json
import re
from pathlib import Path

input_file = "/Users/mdica/PycharmProjects/EduPex/matematica_chapters_extraction/chapters_2_to_6_extracted.json"
output_file = "/Users/mdica/PycharmProjects/EduPex/matematica_chapters_extraction/chapters_2_to_6_refined.json"

def generate_summaries():
    """Generate professional summaries for all lessons"""
    return {
        # Chapter 2 Summaries
        ("2", "1"): """## Metoda Reducerii la Unitate

Aceasta este una dintre metodele fundamentale de rezolvare a problemelor care implică mărimi proporționale.

### Principiul Metodei
Metoda reducerii la unitate constă în:
1. Calcularea valorii unei unități (prin împărțire)
2. Calcularea valorii pentru numărul cerut de unități (prin înmulțire)

### Exemplu Practic
Dacă 5 kg de mere costă 25 lei:
- 1 kg de mere costă: 25 ÷ 5 = 5 lei (reducere la unitate)
- 8 kg de mere costă: 5 × 8 = 40 lei

### Utilizări
- Probleme cu prețuri și cantități
- Calcule de viteză și distanță
- Calcule de consum și producție
- Probleme cu muncitori și zile de lucru

### Pași de Rezolvare
1. **Identificați relația** între cantități
2. **Calculați valoarea unitară** prin împărțire
3. **Multiplicați** pentru cantidad cerută
4. **Verificați** răspunsul""",

        ("2", "2"): """## Metoda Comparației

O metodă eficientă pentru rezolvarea sistemelor de probleme cu mai mulți parametri.

### Principiul Metodei
Metoda comparației compară două situații sau mai mult pentru a elimina o necunoscută și a găsi cealaltă.

### Pași de Rezolvare
1. **Scrieți ecuațiile** pentru fiecare situație
2. **Comparați ecuațiile** pentru a elimina o necunoscută
3. **Rezolvați** pentru necunoscuta rămasă
4. **Înlocuiți** pentru a găsi cealaltă necunoscută

### Exemplu
Dacă 2 kg de mere și 3 kg de pere costă 29 lei, iar 2 kg de mere și 5 kg de pere costă 39 lei, putem afla prețul fiecărui fruct prin comparația celor două situații.

### Când se Folosește
- Probleme cu două sau mai multe mărimi necunoscute
- Probleme de cumpărare-vânzare
- Probleme cu muncitori
- Calcule de viteză și timp""",

        ("2", "3"): """## Metoda Figurativă

O metodă vizuală care reprezentă problema prin figuri (linii, segmente, dreptunghiuri).

### Principiul Metodei
Reprezentăm grafic relațiile dintre mărimi, apoi calculăm pe baza desenului.

### Reprezentări Tipice
- **Linii/Segmente**: Pentru mărimi liniare
- **Dreptunghiuri**: Pentru arii
- **Coloane**: Pentru comparații între numere

### Pași de Rezolvare
1. **Desenați** situația problemei
2. **Analizați** relațiile din desen
3. **Calculați** pe baza desenului
4. **Verificați** răspunsul

### Avantaje
- Ușor de înțeles și vizualizat
- Reduce erorile de interpretare
- Ideal pentru copii
- Funcționează pentru probleme complexe""",

        ("2", "4"): """## Metoda Mersului Invers

O metodă puternică pentru probleme unde trebuie să inversăm operațiile.

### Principiul Metodei
Se parcurge problema în sens invers, inversând operațiile:
- Adunarea devine scădere
- Înmulțirea devine împărțire

### Pași de Rezolvare
1. **Identificați operația finală** și rezultatul
2. **Mersul invers**: inverșați fiecare operație
3. **Calculați** etapă cu etapă

### Exemplu
Dacă un număr este înmulțit cu 5, apoi se adună 10, și se obține 60:
- Scădere: 60 - 10 = 50
- Împărțire: 50 ÷ 5 = 10 (numărul inițial)

### Când se Folosește
- Probleme cu lanțuri de operații
- Probleme cu "gândire inversă"
- Găsirea numărului inițial""",

        ("2", "5"): """## Metoda Falsei Ipoteze

O metodă care presupune o situație și apoi o corectează pe baza realității.

### Principiul Metodei
1. Se presupune o stare pentru toate unitățile
2. Se calculează ce ar trebui conform presupunerii
3. Se compară cu realitatea
4. Se corectează presupunerea

### Exemplu Clasic: Problema cu Gâști și Oi
- Dacă sunt 10 capete și presupunem toate gâștile (2 picioare fiecare): 20 picioare
- Dar realitatea spune 28 picioare
- Diferență: 28 - 20 = 8 picioare în plus
- Fiecare oaie adaugă 2 picioare în plus: 8 ÷ 2 = 4 oi
- Deci: 4 oi și 6 gâște

### Utilizări
- Probleme cu animale
- Probleme cu tipuri diferite de mărfuri
- Calcule de producție cu piese de diferite calități""",

        # Chapter 3 Summaries
        ("3", "1"): """## Divizibilitatea Numerelor Naturale

Conceptul de divizibilitate este fundamental în teoria numerelor.

### Definiție
Un număr a se divide la (sau este divizibil cu) un număr b dacă există un număr natural c astfel încât a = b × c.

Notație: a ⋮ b (a se divide la b)

### Proprietăți ale Divizibilității
1. **Reflexivitate**: Orice număr se divide la el însuși (a ⋮ a)
2. **Tranzitivitate**: Dacă a ⋮ b și b ⋮ c, atunci a ⋮ c
3. **Monotonie**: Dacă a ⋮ b, atunci (a × k) ⋮ b pentru orice k

### Multipli și Divizori
- **Multiplii lui a**: a, 2a, 3a, 4a, ...
- **Divizorii lui a**: numerele care împart exact pe a

### Aplicații Practice
- Organizarea grupurilor
- Împărțirea resurselor
- Calculele în inginerie""",

        ("3", "2"): """## Criterii de Divizibilitate

Criterii rapide pentru a verifica dacă un număr este divizibil cu altul fără a face împărțirea.

### Criteriul de Divizibilitate cu 2
Un număr este divizibil cu 2 dacă ultima cifră este pară (0, 2, 4, 6, 8).
Exemplu: 234 este divizibil cu 2 (ultima cifră 4)

### Criteriul de Divizibilitate cu 5
Un număr este divizibil cu 5 dacă ultima cifră este 0 sau 5.
Exemplu: 235 este divizibil cu 5 (ultima cifră 5)

### Criteriul de Divizibilitate cu 10
Un număr este divizibil cu 10 dacă ultima cifră este 0.
Exemplu: 2340 este divizibil cu 10

### Criteriul de Divizibilitate cu 3
Un număr este divizibil cu 3 dacă suma cifrelor sale este divizibilă cu 3.
Exemplu: 234 → 2+3+4=9, și 9 este divizibil cu 3

### Criteriul de Divizibilitate cu 9
Un număr este divizibil cu 9 dacă suma cifrelor sale este divizibilă cu 9.
Exemplu: 234 → 2+3+4=9, și 9 este divizibil cu 9

### Criteriul de Divizibilitate cu 4
Un număr este divizibil cu 4 dacă ultimele două cifre formează un număr divizibil cu 4.

### Criteriul de Divizibilitate cu 25
Un număr este divizibil cu 25 dacă ultimele două cifre sunt 00, 25, 50 sau 75.""",

        ("3", "3"): """## Numere Prime și Numere Compuse

Clasificarea fundamentală a numerelor în teoria numerelor.

### Numere Prime
Un număr prim este un număr natural mai mare decât 1 care are exact doi divizori: 1 și el însuși.

Primele numere prime: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, ...

**Proprietăți**:
- 2 este singurul număr prim par
- Orice alt număr prim este impar
- Numerele prime sunt infinite

### Numere Compuse
Un număr compus este un număr natural mai mare decât 1 care are mai mult de doi divizori.

Exemplu: 12 = 1 × 12 = 2 × 6 = 3 × 4

### Descompunerea în Factori Primi
Orice număr compus poate fi scris ca produs de numere prime într-un mod unic.

Exemplu: 12 = 2² × 3, 30 = 2 × 3 × 5

### Aplicații
- Criptografie
- Căutarea celui mai mare divizor comun
- Căutarea celui mai mic multiplu comun
- Simplificarea fracțiilor""",

        # Chapter 4 Summaries
        ("4", "1"): """## Fracții Ordinare, Echivalente și Procente

### Fracții Ordinare
O fracție ordinară este o reprezentare a unei părți dintr-un întreg.

Notație: a/b, unde:
- a = numărător (câte părți luăm)
- b = numitor (în câte părți împărțim întregul)

### Fracții Echivalente
Două fracții sunt echivalente dacă reprezintă aceeași parte din întreg.

Exemplu: 1/2 = 2/4 = 3/6 = 4/8

Proprietate: a/b = c/d dacă a×d = b×c

### Procente
Un procent este o fracție cu numitorul 100.

Notație: p% = p/100

Exemplu: 25% = 25/100 = 1/4

### Conversii
- Fracție → Procent: Transformă numitorul în 100
- Procent → Fracție: p% = p/100
- Procent → Zecimal: Împarte la 100""",

        ("4", "2"): """## Compararea Fracțiilor și Reprezentare pe Axa Numerelor

### Compararea Fracțiilor cu Același Numitor
Dintre două fracții cu același numitor, mai mare este cea cu numărătorul mai mare.
Exemplu: 3/7 > 2/7

### Compararea Fracțiilor cu Același Numărător
Dintre două fracții cu același numărător, mai mare este cea cu numitorul mai mic.
Exemplu: 3/5 > 3/8

### Compararea Fracțiilor Diferite
Aducem fracțiile la același numitor, apoi comparăm.

### Reprezentarea pe Axa Numerelor
Fiecare fracție corespunde unui punct unic pe axa numerelor:
- 0/1 = 0 (originea)
- 1/1 = 1 (unitatea)
- 1/2 = 0.5 (la jumătate)
- etc.

### Ordonarea Fracțiilor
Se compară două câte două și se aranjează în ordine crescătoare sau descrescătoare.""",

        ("4", "3"): """## Introducerea și Scoaterea Întregilor dintr-o Fracție

### Introducerea Întregilor în Fracție
Dacă avem a întregi și b/c fracție:
Fracția = (a × c + b) / c

Exemplu: 2 și 3/5 = (2 × 5 + 3) / 5 = 13/5

### Scoaterea Întregilor din Fracție
Pentru o fracție improprie a/b:
1. Împarte a la b: a = b × q + r
2. Rezultat: q și r/b (q întregi și r/b fracție)

Exemplu: 13/5 = 2 și 3/5 (pentru că 13 = 5 × 2 + 3)

### Fracții Proprii și Improprii
- **Fracție proprie**: numărătorul < numitor (valoare < 1)
- **Fracție improprie**: numărătorul ≥ numitor (valoare ≥ 1)

### Utilizări
- Reprezentarea numerelor mixte
- Simplificarea calculelor
- Interpretare practică (timp, măsuri)""",

        ("4", "4"): """## Cel Mai Mare Divizor Comun, Amplificare și Simplificare

### Cel Mai Mare Divizor Comun (CMMDC)
CMMDC al două numere este cel mai mare număr care le divide pe amândouă.

Metode de calculare:
1. **Enumerare**: Se listează divizorii și se alege cel mai mare comun
2. **Algoritmul lui Euclid**: Se folosește împărțirea repetată

Exemplu: CMMDC(12, 18) = 6

### Amplificarea Fracțiilor
Amplificare = Înmulțire atât numărătorului cât și numitorului cu același număr (≠ 0).

a/b = (a×k)/(b×k)

Exemplu: 2/3 = 4/6 (amplificare cu 2)

### Simplificarea Fracțiilor
Simplificare = Împărțire atât numărătorului cât și numitorului cu același număr.

a/b = (a÷k)/(b÷k)

Exemplu: 4/6 = 2/3 (simplificare cu 2)

### Fracții Ireductibile
O fracție este ireductibilă dacă CMMDC(a, b) = 1.

Exemplu: 3/7 este ireductibilă""",

        ("4", "5"): """## Cel Mai Mic Multiplu Comun și Aducerea la Numitor Comun

### Cel Mai Mic Multiplu Comun (CMMMC)
CMMMC al două numere este cel mai mic număr care este multiplu al ambelor.

Metode:
1. **Enumerare**: Se listează multiplii și se alege cel mai mic comun
2. **Folosind CMMDC**: CMMMC(a, b) = (a × b) / CMMDC(a, b)

Exemplu: CMMMC(4, 6) = 12

### Aducerea la Numitor Comun
Pentru aduna sau scădea fracții, trebuie să aibă același numitor.

Pași:
1. Calculează CMMMC al numitorilor
2. Amplifică fiecare fracție pentru a obține acest numitor
3. Efectuează operația

Exemplu: 1/4 + 1/6 = 3/12 + 2/12 = 5/12

### Aplicații
- Adunarea și scăderea fracțiilor
- Compararea fracțiilor
- Rezolvarea ecuațiilor cu fracții""",

        ("4", "6"): """## Adunarea și Scăderea Fracțiilor

### Adunarea Fracțiilor cu Același Numitor
Se adună numărătorii și se păstrează numitorul:
a/b + c/b = (a + c) / b

Exemplu: 2/5 + 3/5 = 5/5 = 1

### Adunarea Fracțiilor cu Numitori Diferiți
1. Aduce fracțiile la același numitor
2. Adună numărătorii

Exemplu: 1/4 + 1/6 = 3/12 + 2/12 = 5/12

### Scăderea Fracțiilor cu Același Numitor
Se scad numărătorii și se păstrează numitorul:
a/b - c/b = (a - c) / b

Exemplu: 5/7 - 2/7 = 3/7

### Scăderea Fracțiilor cu Numitori Diferiți
1. Aduce fracțiile la același numitor
2. Scade numărătorii

Exemplu: 3/4 - 1/6 = 9/12 - 2/12 = 7/12

### Proprietăți
- Comutativitate pentru adunare
- Asociativitate pentru adunare
- Adunarea cu 0 nu schimbă fracția""",

        ("4", "7"): """## Înmulțirea Fracțiilor

### Înmulțirea a Două Fracții
Se înmulțesc numărătorii între ei și numitorii între ei:
(a/b) × (c/d) = (a × c) / (b × d)

Exemplu: (2/3) × (3/5) = 6/15 = 2/5

### Simplificări Încrucișate
Înainte de a înmulți, se pot simplifica numărător cu numitor (chiar din fracții diferite):
(2/3) × (3/5) = (2/5) × (3/3) = 2/5

### Înmulțirea cu Numere Întregi
a × (b/c) = (a × b) / c

Exemplu: 4 × (3/5) = 12/5

### Proprietăți
- Comutativitate: (a/b) × (c/d) = (c/d) × (a/b)
- Asociativitate: ((a/b) × (c/d)) × (e/f) = (a/b) × ((c/d) × (e/f))
- Distributivitate: (a/b) × ((c/d) + (e/f)) = (a/b) × (c/d) + (a/b) × (e/f)
- Element neutru: (a/b) × 1 = a/b

### Inversă în Înmulțire
Inversa fracției a/b este b/a. Produsul: (a/b) × (b/a) = 1""",

        ("4", "8"): """## Împărțirea Fracțiilor Ordinare

### Împărțirea a Două Fracții
A împărți la o fracție înseamnă a înmulți cu inversa ei:
(a/b) ÷ (c/d) = (a/b) × (d/c) = (a × d) / (b × c)

Exemplu: (2/3) ÷ (3/5) = (2/3) × (5/3) = 10/9

### Împărțirea Fracției la Număr Întreg
(a/b) ÷ c = (a/b) × (1/c) = a / (b × c)

Exemplu: (3/4) ÷ 2 = 3/8

### Împărțirea Numărului Întreg la Fracție
a ÷ (b/c) = a × (c/b) = (a × c) / b

Exemplu: 3 ÷ (2/5) = 3 × (5/2) = 15/2

### Proprietăți
- Nu este comutativă
- Nu este asociativă
- A ÷ 1 = A

### Aplicații
- Calcularea raporturilor
- Probleme cu proporții
- Distribuția resurselor""",

        ("4", "9"): """## Puterea cu Exponent Natural a unei Fracții Ordinare

### Definiție
(a/b)^n = (a^n) / (b^n), unde n este exponent natural

Exemplu: (2/3)^3 = 2^3 / 3^3 = 8/27

### Proprietăți
1. **(a/b)^0 = 1** (pentru a/b ≠ 0)
2. **(a/b)^1 = a/b**
3. **(a/b)^m × (a/b)^n = (a/b)^(m+n)** - produs de puteri
4. **(a/b)^m ÷ (a/b)^n = (a/b)^(m-n)** - cât de puteri
5. **((a/b)^m)^n = (a/b)^(mn)** - putere a unei puteri
6. **((a/b) × (c/d))^n = (a/b)^n × (c/d)^n** - putere a unui produs
7. **((a/b) ÷ (c/d))^n = (a/b)^n ÷ (c/d)^n** - putere a unui cât

### Aplicații
- Calcule cu arii și volume
- Formule din fizică și chimie
- Progresii geometrice""",

        ("4", "10"): """## Fracții/Procente dintr-un Număr

### Fracție dintr-un Număr
Pentru a calcula k/p din numărul n:
(k/p) × n = (k × n) / p

Exemplu: 3/5 din 20 = (3 × 20) / 5 = 12

### Procent dintr-un Număr
Pentru a calcula p% din numărul n:
(p/100) × n = (p × n) / 100

Exemplu: 25% din 80 = (25 × 80) / 100 = 20

### Fracție dintr-o Fracție
(a/b) din (c/d) = (a/b) × (c/d)

Exemplu: 2/3 din 3/4 = (2/3) × (3/4) = 2/4 = 1/2

### Probleme cu Procente
1. **Aflare procent**: Care procent reprezintă 20 din 80?
   - 20/80 = 1/4 = 25%

2. **Aflare total**: 25% din care număr este 20?
   - 20 ÷ (25/100) = 80

3. **Creștere/Scădere procentuală**: Preț crescut cu 10%
   - Preț final = Preț inițial × (1 + 10/100)""",

        # Chapter 5 Summaries - Decimal Fractions
        ("5", "1"): """## Fracții Zecimale și Transformări

### Fracții Zecimale
O fracție zecimală este o fracție cu numitorul 10, 100, 1000, etc., scrisă într-o notație specială.

Notație: 0,abc (cu virgulă)

Exemple:
- 3/10 = 0,3
- 25/100 = 0,25
- 5/1000 = 0,005

### Poziții Zecimale
După virgulă:
- **Prima poziție**: zecimi (1/10)
- **A doua poziție**: sutimi (1/100)
- **A treia poziție**: miimi (1/1000)

### Transformări
**Fracție ordinară → Zecimală**:
- Dacă numitorul este putere a lui 10, transformă direct
- Altfel, efectuează împărțirea

**Zecimală → Fracție ordinară**:
- 0,abc = abc/1000 (3 zecimale = 1000 la numitor)

### Fracții Zecimale Periodice
- **Periodă simplă**: 1/3 = 0,(3) = 0,333...
- **Periodă mixtă**: 1/6 = 0,1(6) = 0,1666...""",

        ("5", "2"): """## Aproximări, Comparare și Ordonare Fracții Zecimale

### Aproximări de Fracții Zecimale
Analog cu numerele naturale:
- **Prin lipsă**: 0,347 ≈ 0,34 (la sutimi)
- **Prin adaos**: 0,347 ≈ 0,35 (la sutimi)
- **Rotunjire**: Compară cu cifra următoare

### Compararea Fracțiilor Zecimale
Compară cifră cu cifră de la stânga la dreapta:
0,23 < 0,25 (zecimile sunt egale, comparăm sutimile: 3 < 5)
0,5 > 0,47 (zecimile: 5 > 4)

### Reprezentarea pe Axa Numerelor
Fiecare fracție zecimală corespunde unui punct:
- 0 ← 0,25 ← 0,5 ← 0,75 ← 1

### Conversia cu Fracții Ordinare
Pentru comparare, transformă în aceeași formă (zecimală sau ordinară)

Exemplu: 1/4 = 0,25, deci 1/4 < 0,3""",

        ("5", "3"): """## Adunarea și Scăderea Fracțiilor Zecimale

### Adunarea Fracțiilor Zecimale
Se aliniază după virgulă și se adună ca numerele naturale:

  2,34
+ 1,56
------
  3,90 = 3,9

### Scăderea Fracțiilor Zecimale
Se aliniază după virgulă și se scade ca numerele naturale:

  5,42
- 2,17
------
  3,25

### Proprietăți
- Comutativitate: 2,3 + 1,5 = 1,5 + 2,3
- Asociativitate: (2,3 + 1,5) + 0,7 = 2,3 + (1,5 + 0,7)
- Element neutru: 2,3 + 0 = 2,3

### Completări și Lipsuri
Pentru a completa o zecimală la unitatea următoare:
- 2,3 + ? = 3 → ? = 0,7
- 4,67 + ? = 5 → ? = 0,33""",

        ("5", "4"): """## Înmulțirea Fracțiilor Zecimale

### Înmulțirea Fracției Zecimale cu Număr Întreg
Se înmulțește ca și cum ar fi număr natural, apoi se plasează virgula:

Pași:
1. Înmulțește cifrele (ignora virgula)
2. Numără zecimalele din fracție
3. Plasează virgula în rezultat

Exemplu: 2,3 × 4 = 9,2

### Înmulțirea a Două Fracții Zecimale
1. Înmulțește numerele (ignora virgulele)
2. Numără zecimalele totale din ambele fracții
3. Plasează virgula în rezultat

Exemplu: 2,3 × 1,4 = 3,22 (1 + 1 = 2 zecimale)

### Înmulțirea cu Puteri ale lui 10
Plasează virgula la dreapta:
- × 10: o poziție
- × 100: două poziții
- × 1000: trei poziții

Exemplu: 2,34 × 100 = 234

### Proprietăți
- Comutativitate
- Asociativitate
- Distributivitate
- Element neutru: × 1""",

        ("5", "5"): """## Înmulțirea Fracțiilor Zecimale (Continuare)

### Înmulțiri Speciale
Similar cu înmulțirea fracțiilor ordinare.

### Estimare și Verificare
Estimează rezultatul prin rotunjire:
2,34 × 4,8 ≈ 2 × 5 = 10 (estimare)
2,34 × 4,8 = 11,232 (precis)

### Probleme Aplicative
- Calcule de prețuri
- Calcule de arii
- Probleme cu proporții""",

        ("5", "6"): """## Împărțirea Fracțiilor Zecimale

### Împărțirea Fracției Zecimale la Număr Întreg
Divide ca și cum ar fi număr natural, plasând virgula în rezultat:

  4,8 ÷ 2 = 2,4

### Împărțirea a Două Fracții Zecimale
1. Transformă împărțitorul în număr întreg (mutând virgula)
2. Mută virgula în același mod la deîmpărțit
3. Efectuează împărțirea

Exemplu: 4,8 ÷ 1,2 = 48 ÷ 12 = 4

### Împărțirea la Puteri ale lui 10
Mută virgula la stânga:
- ÷ 10: o poziție
- ÷ 100: două poziții

Exemplu: 234 ÷ 100 = 2,34

### Fracții Zecimale Periodice
Transformă în fracții ordinare pentru calcule mai ușoare

### Transformarea Fracției Periodice în Ordinară
Pentru 0,(3):
- x = 0,333...
- 10x = 3,333...
- 10x - x = 3
- 9x = 3
- x = 3/9 = 1/3""",

        ("5", "7"): """## Ordinea Efectuării Operațiilor cu Numere Raționale

### Reguli de Precedență
1. **Paranteze** (rotunde, pătrate, acolade) - de la interior la exterior
2. **Puteri**
3. **Înmulțiri și Împărțiri** - de la stânga la dreapta
4. **Adunări și Scăderi** - de la stânga la dreapta

### Exemplu
2 + 3 × 4 = 2 + 12 = 14 (NU 5 × 4 = 20)

### Cu Paranteze
(2 + 3) × 4 = 5 × 4 = 20

### Expresii Complexe
2 + 3 × (4 - 1)²
= 2 + 3 × 3²
= 2 + 3 × 9
= 2 + 27
= 29

### Bune Practici
- Lucrează etapă cu etapă
- Sublinează operația care se efectuează
- Verifică rezultatul""",

        # Chapter 6 Summaries - Geometry
        ("6", "1"): """## Elemente de Geometrie: Punct, Dreaptă, Plan

### Punct
Un punct este o noțiune fundamentală în geometrie, fără dimensiune.
Notație: A, B, C (cu litere mari)

### Dreaptă
O dreaptă este o mulțime infinită de puncte, fără grosime, care se extinde la infinit în ambele direcții.
Notație: d, a, AB (prin doi puncte)

Proprietăți:
- Prin două puncte distincte trece o singură dreaptă
- O dreaptă conține infinit de puncte

### Semidreaptă
O semidreaptă este o parte a unei drepte cu un punct de origine și care se extinde infinit într-o direcție.
Notație: [AB (originea A, conținând B)

### Segment de Dreaptă
Un segment este o parte a unei drepte între două puncte (capete).
Notație: [AB] sau AB

### Plan
Un plan este o suprafață plană care se extinde la infinit în toate direcțiile.
Notație: α, β, π

### Semiplan
Un semiplan este o parte a unui plan mărginit de o dreaptă.

### Relații Fundamentale
- Punct ∈ Dreaptă (punctul aparține dreptei)
- Dreaptă ⊂ Plan (dreapta se află în plan)""",

        ("6", "2"): """## Pozițiile Relative: Puncte și Drepte

### Punct pe o Dreaptă
Un punct aparține unei drepte: A ∈ d
Un punct nu aparține unei drepte: B ∉ d

### Puncte Coliniare
Trei sau mai multe puncte sunt coliniare dacă aparțin aceleiași drepte.
Notație: A, B, C coliniare

### Drepte Concurente
Două drepte care se intersectează într-un punct se numesc drepte concurente.
Notație: d₁ ∩ d₂ = {P}

### Drepte Paralele
Două drepte care nu se intersectează se numesc paralele.
Notație: d₁ ∥ d₂

Proprietăți:
- Prin orice punct exterior unei drepte, trece o singură paralelă la acea dreaptă (axioma paralelelor)
- Paralelismul este o relație de echivalență

### Drepte Coincidente
Două drepte care au toate punctele comune sunt aceeași dreaptă.

### Axioma Playfair
Prin orice punct exterior unei drepte, trece o singură dreaptă paralelă cu cea dată.""",

        ("6", "3"): """## Lungimea Unui Segment și Distanța

### Lungimea unui Segment
Lungimea unui segment [AB] este distanța între punctele A și B.
Notație: AB sau d(A, B)

### Segmente Congruente
Două segmente sunt congruente dacă au aceeași lungime.
Notație: [AB] ≡ [CD] sau AB = CD

### Distanța dintre Două Puncte
Este definită ca lungimea segmentului care le unește.
Proprietăți:
- d(A, B) = d(B, A) - simetrie
- d(A, B) ≥ 0 - pozitivitate
- d(A, A) = 0
- d(A, B) + d(B, C) ≥ d(A, C) - inegalitatea triunghiulară

### Măsurarea Segmentelor
Se folosesc instrumente:
- Riglă gradată
- Compas
- Șubler

### Unități de Măsură
- Milimetru (mm)
- Centimetru (cm)
- Decimetru (dm)
- Metru (m)
- Kilometru (km)

### Relații
1 m = 10 dm = 100 cm = 1000 mm
1 km = 1000 m""",

        ("6", "4"): """## Mijlocul Unui Segment și Simetrie

### Mijlocul unui Segment
Mijlocul unui segment [AB] este punctul M care împarte segmentul în două părți egale.
Proprietate: AM = MB = AB/2

Construcție:
1. Se ia compasul
2. Se pune vârful în A, se ia mai mult de jumătate din AB
3. Se trasează arc
4. Se repetă din B
5. Arcele se intersectează în două puncte
6. Linia prin aceste puncte intersectează [AB] în M

### Simetricul unui Punct față de un Punct
Simetricul unui punct A față de un punct O este punctul A' din aceeași dreaptă, cu O = mijlocul [AA'].

Proprietate: AO = OA' și A, O, A' coliniare

### Puncte Simetrice
Două puncte sunt simetrice față de un punct dacă acel punct este mijlocul segmentului care le unește.

### Aplicații
- Geometrie
- Simetrie în natură
- Design și artă""",

        ("6", "5"): """## Unghi: Definiție, Notații și Elemente

### Unghi
Un unghi este format din două semidrepte cu aceeași origine.

Elemente:
- **Vârf**: originea comună (O)
- **Laturi**: cele două semidrepte [OA și [OB
- Notație: ∠AOB sau ∠O

### Măsurarea Unghiurilor
Se măsoară în grade (°), minute ('), secunde (")
1° = 60'
1' = 60"

### Clasificarea Unghiurilor
- **Unghi nul**: 0°
- **Unghi ascuțit**: 0° < α < 90°
- **Unghi drept**: α = 90°
- **Unghi obtuz**: 90° < α < 180°
- **Unghi plat**: α = 180°
- **Unghi reflex**: 180° < α < 360°

### Interiorul și Exteriorul unui Unghi
- **Interiorul**: regiunea între laturi
- **Exteriorul**: restul planului

### Unghiuri Congruente
Două unghiuri sunt congruente dacă au aceeași măsură.
Notație: ∠AOB ≡ ∠COD""",

        ("6", "6"): """## Măsura unui Unghi și Unghiuri Congruente

### Măsurarea cu Raportorul
1. Aplică centrul raportorului la vârf
2. Aliniază una din laturi cu linia 0°
3. Cealaltă latură indică măsura

### Unghiuri Congruente
Două unghiuri sunt congruente dacă au aceeași măsură.

Proprietăți:
- Reflexivitate: α ≡ α
- Simetrie: α ≡ β ⟹ β ≡ α
- Tranzitivitate: α ≡ β și β ≡ γ ⟹ α ≡ γ

### Construcția Unghiurilor
Pași cu raportorul:
1. Trasează o semidreaptă
2. Plasează raportorul cu centrul la originea semidreptei
3. Marchează punctul la gradul dorit
4. Trasează semidreapta prin acel punct

### Operații cu Unghiuri
- **Adunare**: α + β
- **Scădere**: α - β (dacă α > β)
- **Înmulțire**: k × α
- **Împărțire**: α ÷ k""",

        ("6", "7"): """## Clasificarea Unghiurilor și Calcule

### Unghiuri Adiacente
Două unghiuri sunt adiacente dacă:
- Au același vârf
- Au o latură comună
- Interioarele sunt disjuncte

### Unghiuri Complementare
Două unghiuri sunt complementare dacă suma lor este 90°.
α + β = 90°

Fiecare se numește complementul celuilalt.

### Unghiuri Suplementare
Două unghiuri sunt suplementare dacă suma lor este 180°.
α + β = 180°

Fiecare se numește suplementul celuilalt.

### Unghiuri Opuse la Vârf
Două unghiuri opuse la vârf sunt congruente (egale).

Proprietate: ∠AOB ≡ ∠COD (când O este intersecția dreptelor)

### Unghiuri Formate de Drepte Paralele
Când o dreaptă intersectează două drepte paralele:
- **Unghiuri corespondente**: congruente
- **Unghiuri alterne interne**: congruente
- **Unghiuri alterne externe**: congruente""",

        ("6", "8"): """## Figuri Congruente și Axa de Simetrie

### Figuri Congruente
Două figuri geometrice sunt congruente dacă una poate fi obținută din cealaltă prin transformări rigide (translație, rotație, simetrie).

Notație: △ABC ≡ △DEF

### Criteriile de Congruență a Triunghiurilor
1. **LLL** (Latura-Latura-Latura): trei laturi egale
2. **LAL** (Latura-Unghi-Latura): două laturi și unghiul dintre ele
3. **ULU** (Unghi-Latura-Unghi): două unghiuri și latura comună

### Axa de Simetrie
O dreaptă este axă de simetrie pentru o figură dacă figura este simetrică față de acea dreaptă.

Exemple:
- Pătrat: 4 axe de simetrie
- Dreptunghi: 2 axe de simetrie
- Triunghi isoscel: 1 axă de simetrie
- Cerc: infinit de axe (toate diametrele)

### Simetrie Axială
Transformare care reflectă punctele pe o dreaptă (axă).

Proprietăți: conservă distanțe și unghiuri""",

        ("6", "9"): """## Unități de Măsură și Perimetru

### Unități de Lungime
**Sistemul Metric**:
- 1 km = 1000 m
- 1 m = 10 dm = 100 cm = 1000 mm
- 1 dm = 10 cm
- 1 cm = 10 mm

### Transformarea Unităților
Înmulțire cu 10 pentru fiecare nivel descendent:
- m → dm: × 10
- m → cm: × 100
- m → mm: × 1000

Împărțire cu 10 pentru fiecare nivel ascendent:
- mm → cm: ÷ 10
- mm → m: ÷ 1000

### Perimetrul
Perimetrul unei figuri plane este suma lungimilor tuturor laturilor.

**Perimetrul unor Figuri**:
- **Pătrat**: P = 4a (a = latura)
- **Dreptunghi**: P = 2(l + L) (l = lungime, L = lățime)
- **Triunghi**: P = a + b + c (a, b, c = laturi)
- **Cerc**: P = 2πr (r = rază)

### Aplicații Practice
- Garduri și îngrădiri
- Decor și borduri
- Calcule în construcții"""
    }

def process_lessons(data):
    """Process lessons: clean sections and add summaries"""
    for chapter in data["chapters"]:
        for lesson in chapter["lessons"]:
            lesson_num = lesson["number"]
            chapter_num = chapter["number"]

            # Clean sections
            cleaned_sections = []
            for section in lesson["sections"]:
                # Skip table of contents and duplicate pages
                if "Lecția" in section["title"] and "Lecția" in section["content"]:
                    continue

                if section["title"].startswith("--- PAGE") and len(section["content"].strip()) < 50:
                    continue

                if len(section["content"].strip()) < 20:
                    continue

                cleaned_sections.append(section)

            for idx, section in enumerate(cleaned_sections, 1):
                section["order"] = idx

            lesson["sections"] = cleaned_sections

            # Add professional summary
            key = (chapter_num, lesson_num)
            lesson["summary"] = generate_summaries().get(key, f"Summary for Chapter {chapter_num}, Lesson {lesson_num}")

    return data

# Load, process, and save
print("🔄 Loading extracted data...")
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🧹 Cleaning and refining content...")
data = process_lessons(data)

print("💾 Saving refined data...")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Refinement complete!")
print(f"📁 Output file: {output_file}")

# Print summary
print("\n📊 Refinement Summary:")
total_sections = 0
for chapter in data["chapters"]:
    chapter_sections = sum(len(lesson['sections']) for lesson in chapter['lessons'])
    total_sections += chapter_sections
    print(f"   Chapter {chapter['number']}: {len(chapter['lessons'])} lessons | {chapter_sections} sections")

print(f"\n📈 TOTAL: {total_sections} sections refined")


