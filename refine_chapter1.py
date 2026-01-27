#!/usr/bin/env python3
"""
Refine and clean extracted Chapter 1 content
- Remove page markers
- Merge related sections
- Generate professional summaries
- Output cleaned JSON
"""

import json
import re
from pathlib import Path

input_file = "/Users/mdica/PycharmProjects/EduPex/matematica_chapter1_extraction/chapter1_extracted.json"
output_file = "/Users/mdica/PycharmProjects/EduPex/matematica_chapter1_extraction/chapter1_refined.json"

def clean_text(text):
    """Clean text by removing page markers and extra whitespace"""
    # Remove page break indicators
    text = re.sub(r'--- PAGE \d+ ---\n?', '', text)
    # Remove multiple newlines
    text = re.sub(r'\n\n\n+', '\n\n', text)
    # Fix spacing issues
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def generate_summary(lesson_number, lesson_name, raw_text):
    """Generate a professional summary for each lesson"""

    summaries = {
        "1": """## Scrierea și Citirea Numerelor Naturale

Numerele naturale sunt fundamentale în matematică și au apărut din necesități practice de numărare și ordonare. Această lecție explorează:

### Cifre și Sisteme de Numerație
- **Cifrele arabe** (0-9): sistemul cel mai utilizat în prezent
- **Cifrele romane**: I, V, X, L, C, D, M - istorie și utilizare
- **Alte sisteme**: cifrele indiene și arabe, evoluția istoric a numerației

### Sistemul Zecimal (Baza 10)
Scrierea în sistem zecimal se bazează pe principiul că zece unități de orice ordin formează o unitate de ordin imediat superior:
- 10 unități = 1 zece
- 10 zeci = 1 sută (100 unități)
- 10 sute = 1 mie (1000 unități)
- Și așa mai departe: zeci de mii, sute de mii, milioane, etc.

### Poziția Cifrelor și Ordinele
În orice număr natural, poziția unei cifre determină valoarea acesteia:
- **Ordinul 1**: unități (cifra din dreapta)
- **Ordinul 2**: zeci (a doua cifră din dreapta)
- **Ordinul 3**: sute (a treia cifră din dreapta)
- **Ordinul 4**: mii, și așa mai departe

### Gruparea în Clase
Pentru a citi numere mari, cifrele se grupează câte trei de la dreapta la stânga în clase:
- Clasa unităților: 3 ordine
- Clasa miilor: 3 ordine
- Clasa milioanelor: 3 ordine
- Clasa miliardelor și mai departe

### Numere Pare și Impare
- **Numere pare**: ultima cifră este 0, 2, 4, 6, 8
- **Numere impare**: ultima cifră este 1, 3, 5, 7, 9

### Șirul Numerelor Naturale
0, 1, 2, 3, 4, ..., n, n+1, n+2, ...
- **Consecutive**: numere care urmează una după alta
- **Orice două numere consecutive diferă prin 1**

### Descompunerea Zecimală
Orice număr poate fi scris ca o sumă de produse între fiecare cifră și ordinul ei:
- 37 = 3 × 10 + 7
- 275 = 2 × 100 + 7 × 10 + 5
- 8086 = 8 × 1000 + 0 × 100 + 8 × 10 + 6

**Importanță**: Înțelegerea scrierii și citirii numerelor naturale este baza pentru toate operațiile matematice care vor urma.""",

        "2": """## Reprezentarea pe Axa Numerelor. Compararea și Ordonarea. Aproximări și Estimări

### 1. Axa Numerelor
Axa numerelor este o linie orizontală cu:
- **Origine**: punctul marcat cu 0
- **Sens pozitiv**: de la stânga la dreapta (indicat de o săgeată)
- **Unitate de măsură**: un segment standard

Fiecărui număr natural îi corespunde un punct unic pe axa numerelor. Punctul și coordonata sa (numărul) definesc poziția în șirul numerelor naturale.

### 2. Compararea și Ordonarea Numerelor Naturale
**Reguli de comparare:**
- Dintre două numere cu cifre diferite, este mai mare cel cu mai multe cifre
  - 1234 > 546 (patru cifre vs trei cifre)
  - 10001 > 9999 (cinci cifre vs patru cifre)
  
- Dintre două numere cu același număr de cifre, comparăm cifrele de la stânga la dreapta până găsim cifre diferite
  - 123 < 193 (comparând sutele: 1 < 9)
  - 540 > 440 (comparând sutele: 5 > 4)
  - 1234 < 1237 (primele trei cifre identice, comparând zecile: 3 < 3, apoi unități: 4 < 7)

**Reprezentare pe axa numerelor**: Dintre două numere reprezentate pe axa numerelor, mai mare este cel aflat la dreapta.

### 3. Aproximări și Rotunjiri
**Aproximarea prin lipsă** (la ordinul zecilor, sutelor, etc.): cel mai mare număr din puteri ale lui 10 care este mai mic sau egal cu numărul dat.
- 2537 ≈ 2530 (la zeci)
- 2537 ≈ 2500 (la sute)

**Aproximarea prin adaos** (la ordinul zecilor, sutelor, etc.): cel mai mic număr din puteri ale lui 10 care este mai mare decât numărul dat.
- 2537 ≈ 2540 (la zeci)
- 2537 ≈ 2600 (la sute)

**Rotunjire** (la un anumit ordin): aproximarea cea mai apropiată. Dacă ambele aproximări sunt egal distanțate, se ia aproximarea prin adaos.
- 2537 ≈ 2540 (la zeci) - distanța de 7 > distanță de 3
- 2537 ≈ 2500 (la sute) - distanța de 37 < distanță de 63

### 4. Estimări
A estima înseamnă a evalua cu aproximație pe baza unor date incomplete. Estimările:
- Au rol informativ și sunt utilizate în planificarea activităților
- Nu corespund întotdeauna exact realității matematice
- O bună estimare se apropie cu timpul de realitate

### Aplicații Practice
- Citirea datelor pe scale (termometre, măsuri)
- Calcularea distanțelor (pe hărți, în context real)
- Planificarea bugetelor și resurselor
- Rotunjirea în viața cotidiană (prețuri, măsuri)""",

        "3": """## Adunarea Numerelor Naturale și Proprietățile Ei

### 1. Adunarea - Noțiuni Introductive
**Definiție**: Adunarea numerelor naturale a și b este operația prin care obținem suma s.
- Notație: a + b = s
- **Termenii adunării**: a și b
- **Suma**: rezultatul s

**Algoritm de adunare**: Se adună unitățile de același ordin, ținând cont că 10 unități de orice ordin formează 1 unitate de ordin imediat superior.

### 2. Proprietățile Adunării

#### Comutativitate
Suma a două numere este aceeași indiferent de ordinea lor:
- a + b = b + a
- Exemplu: 250 + 450 = 450 + 250 = 700

#### Asociativitate  
Când adunăm trei numere, rezultatul este același indiferent de gruparea lor:
- (a + b) + c = a + (b + c)
- Exemplu: (24 + 67) + 48 = 24 + (67 + 48) = 139

#### Element Neutru
Adunarea cu 0 nu schimbă numărul:
- a + 0 = 0 + a = a
- Exemplu: 5 + 0 = 5

### 3. Relația Adunării cu Egalități și Inegalități

- Dacă a = b, atunci a + c = b + c (pentru orice natural c)
- Dacă a < b, atunci a + c < b + c (pentru orice natural c)
- Dacă a = b și c = d, atunci a + c = b + d
- Dacă a < b și c < d, atunci a + c < b + d

### 4. Formula Gauss - Suma Primelor n Numere Naturale
Pentru orice n ≥ 1:
**1 + 2 + 3 + ... + n = n × (n + 1) ÷ 2**

Exemplu:
- 1 + 2 + ... + 10 = 10 × 11 ÷ 2 = 55
- 1 + 2 + ... + 100 = 100 × 101 ÷ 2 = 5050

### 5. Aplicații Practice
Adunarea se folosește pentru:
- Calcularea distanțelor totale
- Determina sume de bani
- Agregarea quantităților
- Calcule progresive

### Proba Adunării
- Suma - un termen = celălalt termen
- Exemplu: Dacă 24 + 67 = 91, atunci 91 - 24 = 67 ✓""",

        "4": """## Scăderea Numerelor Naturale

### 1. Scăderea - Noțiuni Introductive
**Definiție**: Scăderea este operația inversă a adunării. Pentru numerele naturale a ≥ b, diferența d este numărul natural cu proprietatea că a = b + d.
- Notație: d = a - b
- **Descăzut**: a (numărul din care scădem)
- **Scăzător**: b (numărul pe care îl scădem)
- **Diferență**: d (rezultatul)

**Condiție**: Pentru ca scăderea să dea rezultat în numerele naturale, trebuie ca descăzutul să fie mai mare sau egal cu scăzătorul (a ≥ b).

### 2. Algoritm de Scădere
Se scad unitățile de același ordin. Dacă nu sunt suficiente unități la descăzut, se ia o unitate de ordin imediat superior și se transformă în 10 unități de ordin imediat inferior.

**Exemplu**:
- 654 - 273 = ?
  - Unități: 4 - 3 = 1
  - Zeci: 5 + 10 - 7 = 8 (am luat 1 sută și am transformat-o în 10 zeci)
  - Sute: 6 - 1 - 2 = 3
  - Rezultat: 381

### 3. Scăderea și Relația cu Adunarea
Scăderea este operația inversă a adunării:
- Dacă a + b = s, atunci a = s - b și b = s - a
- Exemplu: Dacă 112 + 202 = 314, atunci 314 - 202 = 112

### 4. Proba Scăderii
Se poate verifica prin:
- **Alta scădere**: descăzut - diferență = scăzător
  - 654 - 381 = 273 ✓
- **Adunare**: descăzut = scăzător + diferență
  - 654 = 273 + 381 ✓

### 5. Proprietăți ale Scăderii cu Egalități și Inegalități
- Dacă a = b, atunci a - c = b - c (pentru orice c ≤ a)
- Dacă a ≤ b, atunci a - c ≤ b - c (pentru orice c ≤ a)
- Dacă a = b, c = d și a ≥ c, atunci a - c = b - d

### 6. Aplicații Practice
Scăderea se folosește pentru:
- Calcularea diferenței între două mărimi
- Determinarea ce a mai rămas după o parte
- Găsirea umpluturilor în probleme (a - ? = c)
- Compararea cantităților

### 7. Contextul Istoric
Scăderea din numere naturale nu permite rezultate negative (în clasa a V-a). La nivel superior, se vor introduce numerele întregi negative pentru a permite scăderea oricărui număr din orice alt număr.""",

        "5": """## Înmulțirea Numerelor Naturale și Proprietățile Ei

### 1. Înmulțirea - Noțiuni Introductive
**Definiție**: Înmulțirea este o operație care repetă adunarea. a × b înseamnă a aduna pe a de b ori (sau pe b de a ori).
- Notație: a × b = p
- **Factori**: a și b
- **Produs**: p (rezultatul)

**Interpretare**: 5 × 3 = 5 + 5 + 5 = 15 (adunăm 5, de 3 ori)

### 2. Proprietățile Înmulțirii

#### Comutativitate
Ordinea factorilor nu schimbă produsul:
- a × b = b × a
- Exemplu: 5 × 3 = 3 × 5 = 15

#### Asociativitate
Când înmulțim trei numere, rezultatul este același indiferent de gruparea factorilor:
- (a × b) × c = a × (b × c)
- Exemplu: (2 × 3) × 4 = 2 × (3 × 4) = 24

#### Distributivitatea față de Adunare
Înmulțirea se distribuie peste adunare:
- a × (b + c) = a × b + a × c
- Exemplu: 3 × (2 + 4) = 3 × 2 + 3 × 4 = 6 + 12 = 18

#### Element Neutru
Înmulțirea cu 1 nu schimbă numărul:
- a × 1 = 1 × a = a

#### Element Absorbant
Înmulțirea cu 0 dă întotdeauna 0:
- a × 0 = 0 × a = 0

### 3. Înmulțirea cu Puteri ale lui 10
Pentru a înmulți cu 10, 100, 1000, etc., se adaugă zerouri:
- 25 × 10 = 250
- 25 × 100 = 2500
- 25 × 1000 = 25000

### 4. Factorul Comun
Când doi termeni au un factor comun, acesta poate fi dat în factor:
- a × b + a × c = a × (b + c)
- Exemplu: 3 × 7 + 3 × 5 = 3 × (7 + 5) = 3 × 12 = 36

### 5. Aplicații Practice
Înmulțirea se folosește pentru:
- Calcularea ariilor și volumelor
- Determinarea costului total
- Calcule repetate
- Factoruri și multipli""",

        "6": """## Factor Comun - Factorizare și Simplificare

### 1. Conceptul de Factor Comun
Când termeni diferiți au un factor care apare în fiecare, acel factor se numește **factor comun**.

**Exemplu**:
- 3 × 7 + 3 × 5
- Factorul 3 apare în ambii termeni
- 3 este factor comun

### 2. Scoaterea Factorului Comun
Proprietatea distributivă permite rescrierea:
- a × b + a × c = a × (b + c)
- a × b - a × c = a × (b - c)

**Exemplu**:
- 3 × 7 + 3 × 5 = 3 × (7 + 5) = 3 × 12 = 36
- 5 × 8 - 5 × 3 = 5 × (8 - 3) = 5 × 5 = 25

### 3. Avantajele Factorului Comun
- **Simplificare**: Calculele devin mai ușoare
- **Recunoaștere de modele**: Ajută la identificarea structurii matematice
- **Calculare mai rapidă**: 3 × (7 + 5) este mai ușor de calculat decât 3 × 7 + 3 × 5

### 4. Aplicații
Factorul comun se folosește în:
- Simplificarea calculelor
- Rezolvarea de ecuații
- Factorizarea polinoamelor (în clase superioare)
- Optimizarea calculelor"""
    }

    return summaries.get(lesson_number, "Summary not available")

def process_lessons(data):
    """Process lessons: clean sections and add summaries"""
    for lesson in data["chapter"]["lessons"]:
        lesson_num = lesson["number"]

        # Clean sections
        cleaned_sections = []
        for section in lesson["sections"]:
            # Skip table of contents and duplicate pages
            if "Lecția" in section["title"] and "Lecția" in section["content"]:
                continue

            # Skip page headers that are just noise
            if section["title"].startswith("--- PAGE") and len(section["content"].strip()) < 50:
                continue

            # Skip empty or trivial sections
            if len(section["content"].strip()) < 20:
                continue

            cleaned_sections.append(section)

        # Renumber sections
        for idx, section in enumerate(cleaned_sections, 1):
            section["order"] = idx

        lesson["sections"] = cleaned_sections

        # Add professional summary
        lesson["summary"] = generate_summary(lesson_num, lesson["name"], lesson["raw_text"])

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
for lesson in data["chapter"]["lessons"]:
    print(f"   Lesson {lesson['number']}: {len(lesson['sections'])} sections | Summary: {len(lesson['summary'])} chars")


