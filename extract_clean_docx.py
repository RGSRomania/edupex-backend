#!/usr/bin/env python3
"""
CLEAN WORD DOCUMENT EXTRACTOR
==============================
Extracts clean, structured text from .docx Word documents.
Uses ZIP extraction method (works on Mac, Linux, Windows).

This produces MUCH CLEANER output than PDF extraction!
"""

import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
import json
import sys

def extract_from_docx(docx_path):
    """Extract clean text from .docx file"""
    print(f"\n📖 Extracting from: {Path(docx_path).name}")

    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            root = ET.fromstring(xml_content)

            namespace = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
                'v': 'urn:schemas-microsoft-com:vml',
                'o': 'urn:schemas-microsoft-com:office:office'
            }

            # Extract structured content
            sections = []
            current_section = None
            current_subsection = None

            for para in root.findall('.//w:p', namespace):
                # Get paragraph text
                texts = []
                for text in para.findall('.//w:t', namespace):
                    if text.text:
                        texts.append(text.text)

                para_text = ''.join(texts).strip()
                if not para_text:
                    continue

                # Detect heading levels
                style = para.find('.//w:pStyle', namespace)
                style_id = style.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if style is not None else None

                # Determine level based on style
                is_heading = False
                level = 0
                if style_id and 'Heading' in style_id:
                    is_heading = True
                    level = int(style_id.replace('Heading', '')) if any(c.isdigit() for c in style_id) else 1

                # Build structure
                if is_heading and level == 1:
                    # Top level section
                    if current_section:
                        sections.append(current_section)
                    current_section = {
                        'title': para_text,
                        'subsections': [],
                        'content': []
                    }
                    current_subsection = None

                elif is_heading and level >= 2 and current_section:
                    # Subsection
                    if current_subsection:
                        current_section['subsections'].append(current_subsection)
                    current_subsection = {
                        'title': para_text,
                        'content': []
                    }

                elif current_section:
                    # Regular content
                    if current_subsection:
                        current_subsection['content'].append(para_text)
                    else:
                        current_section['content'].append(para_text)
                else:
                    # No section yet
                    sections.append({'title': 'Uncategorized', 'content': [para_text]})

            # Add last section
            if current_section:
                if current_subsection:
                    current_section['subsections'].append(current_subsection)
                sections.append(current_section)

            return sections

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def format_for_display(sections):
    """Format extracted sections for pretty display"""
    output = []

    for section in sections:
        title = section.get('title', 'Section')
        output.append(f"\n{'='*70}")
        output.append(f"  {title}")
        output.append(f"{'='*70}")

        # Main content
        for para in section.get('content', []):
            output.append(f"\n  {para}")

        # Subsections
        for subsection in section.get('subsections', []):
            sub_title = subsection.get('title', 'Subsection')
            output.append(f"\n  ├─ {sub_title}")

            for para in subsection.get('content', []):
                output.append(f"  │  {para}")

    return "\n".join(output)

def extract_and_save(docx_path, output_txt=None, output_json=None):
    """Extract and save in both text and JSON formats"""

    # Extract
    sections = extract_from_docx(docx_path)

    if not sections:
        print("❌ Extraction failed!")
        return False

    print(f"✅ Extracted {len(sections)} sections")

    # Save as text
    if output_txt:
        formatted_text = format_for_display(sections)
        with open(output_txt, 'w', encoding='utf-8') as f:
            f.write(formatted_text)
        print(f"💾 Saved text: {output_txt}")

    # Save as JSON
    if output_json:
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(sections, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved JSON: {output_json}")

    # Print preview
    print(f"\n{'='*70}")
    print("PREVIEW (first 1500 chars):")
    print(f"{'='*70}")
    if output_txt:
        with open(output_txt, 'r', encoding='utf-8') as f:
            preview = f.read()[:1500]
            print(preview)
            print("\n... (see file for full content)")

    return True

if __name__ == '__main__':
    # Define files to extract
    files_to_extract = [
        {
            'docx': '/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/PLANIFICARE DIDACTICĂ.docx',
            'txt': '/Users/mdica/PycharmProjects/EduPex/EXTRACTED_CLEAN_PLANNING.txt',
            'json': '/Users/mdica/PycharmProjects/EduPex/EXTRACTED_CLEAN_PLANNING.json'
        }
    ]

    print("\n" + "="*70)
    print("📄 WORD DOCUMENT EXTRACTOR - CLEAN TEXT")
    print("="*70)

    for file_config in files_to_extract:
        docx_path = file_config['docx']

        if not Path(docx_path).exists():
            print(f"\n⚠️  File not found: {docx_path}")
            continue

        extract_and_save(
            docx_path,
            output_txt=file_config.get('txt'),
            output_json=file_config.get('json')
        )

    print("\n" + "="*70)
    print("✅ Extraction complete!")
    print("="*70)

