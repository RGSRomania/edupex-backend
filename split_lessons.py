#!/usr/bin/env python3
"""
Script to split lesson summaries into logical sections
Each section becomes a separate "page" in the lesson learning flow
"""

import json
import re

def split_lesson_into_sections(summary):
    """
    Split a lesson summary into logical sections based on headings
    Returns a list of section objects
    """
    sections = []
    current_section = None
    lines = summary.split('\n')

    for line in lines:
        # Check if this is a main heading (##)
        if line.strip().startswith('## '):
            # Save previous section if exists
            if current_section:
                sections.append(current_section)

            # Create new section from main heading
            title = line.replace('## ', '').strip()
            current_section = {
                'title': title,
                'content': line + '\n'
            }

        # Check if this is a sub-heading (###)
        elif line.strip().startswith('### '):
            if current_section:
                current_section['content'] += line + '\n'
            else:
                # If no section yet, create one
                current_section = {
                    'title': 'Introducere',
                    'content': line + '\n'
                }

        # Regular content
        else:
            if current_section:
                current_section['content'] += line + '\n'
            elif line.strip():  # Only create section for non-empty lines
                current_section = {
                    'title': 'Introducere',
                    'content': line + '\n'
                }

    # Don't forget the last section
    if current_section:
        sections.append(current_section)

    # Clean up sections
    cleaned_sections = []
    for i, section in enumerate(sections):
        content = section['content'].strip()
        if content:  # Only keep non-empty sections
            cleaned_sections.append({
                'order': i + 1,
                'title': section['title'],
                'content': content
            })

    return cleaned_sections


# Example usage - test with Lesson 1
lesson_1_summary = """## Textul Literar: 'Prietenul meu' de Ioana Pârvu

### Ce este un text literar?
Textul literar este o creație artistică a unui autor care transmite idei, emoții și sentimente într-un limbaj expresiv și plin de imaginație. Spre deosebire de alte texte care doar informează (textele nonliterare), textul literar creează o lume imaginară care captivează cititorul și îl face să simtă profund.

### Povestea 'Prietenul meu'
Povestea lui Ioana Pârvu ne prezintă aventura unui copil pe nume Bogdan din clasa a V-a. Bogdan se pregătește pentru teze și se gândește cum să-și ilustreze compunerea pentru tema \"Prietenul meu cel mai bun\". Compunerea i-a ieșit prea scurtă și inițial se gândea doar să o recopie și s-o completeze cu cuvinte grele.

### Caracteristicile principale ale textului:

**1. Joi - Personajul animalului**
Joi nu este doar orice catel. Este un chihuahua de culoare cafenie, extrem de mic și delicat, cu o coadă întinsă și ochii negri și rotunzi.

**2. Reacția clasmatilor și a profesoarei**
Când Bogdan intră în sala de clasă cu Joi, reacția este de șoc, apoi de uimire și, în final, de compasiune și tandrete.

**3. Limbajul expresiv al autorului**
Ioana Pârvu folosește cuvinte pline de emoție și imagini evocative: \"o pasăre fără pene\", \"ochii negri și rotunzi\", \"o creatuță delicată\".

**4. Mesajul profund al povestei**
Pe deasupra poveștii simple, există niveluri mai profunde de înțelegere referitoare la sinceritate, curaj, și acceptare.

### De ce este important să studiem acest text?
Textul lui Ioana Pârvu ne învață că literatura nu este doar o colecție de cuvinte, ci un mod de a exprima ceea ce simțim cu profunzime."""

if __name__ == '__main__':
    sections = split_lesson_into_sections(lesson_1_summary)
    print("Number of sections:", len(sections))
    print("\nSections:")
    for section in sections:
        print(f"\n--- Section {section['order']}: {section['title']} ---")
        print(section['content'][:100] + "...")

