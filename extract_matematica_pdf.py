#!/usr/bin/env python3
"""
PDF Extraction Script for Matematica Manual Clasa V
Extracts content by lesson with graphics, examples, and notes
"""

import sys
import json
import os
from pathlib import Path

try:
    import pypdf
    import fitz  # PyMuPDF for image extraction
except ImportError:
    print("Installing required packages...")
    os.system("pip install pypdf PyMuPDF pillow")
    import pypdf
    import fitz

def extract_pdf_content(pdf_path):
    """
    Extract content from PDF lesson by lesson
    """
    print(f"📖 Opening PDF: {pdf_path}")

    pdf_file = fitz.open(pdf_path)
    total_pages = pdf_file.page_count

    print(f"📊 Total pages: {total_pages}")
    print(f"🔍 Analyzing content structure...")

    # Extract all text and images
    lessons = []
    current_lesson = None
    current_content = []
    images_extracted = 0

    for page_num in range(total_pages):
        page = pdf_file[page_num]
        text = page.get_text()

        # Extract images from this page
        image_list = page.get_images()
        if image_list:
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    pix = fitz.Pixmap(pdf_file, xref)

                    # Convert to RGB if necessary
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        pix_rgb = pix
                    else:  # CMYK
                        pix_rgb = fitz.Pixmap(fitz.csRGB, pix)

                    # Save image
                    image_filename = f"lesson_image_{page_num}_{img_index}.png"
                    image_path = f"./extracted_images/{image_filename}"
                    os.makedirs("./extracted_images", exist_ok=True)

                    pix_rgb.save(image_path)
                    print(f"  📷 Extracted image: {image_filename}")
                    images_extracted += 1

                    current_content.append({
                        "type": "image",
                        "filename": image_filename,
                        "page": page_num + 1
                    })
                except Exception as e:
                    print(f"  ⚠️  Could not extract image {img_index} on page {page_num + 1}: {str(e)}")

        # Add text content
        if text.strip():
            current_content.append({
                "type": "text",
                "content": text,
                "page": page_num + 1
            })

    print(f"\n✅ Extraction complete!")
    print(f"   - Total images extracted: {images_extracted}")
    print(f"   - Total pages processed: {total_pages}")

    return {
        "total_pages": total_pages,
        "content": current_content,
        "images_count": images_extracted
    }

def save_extracted_data(data, output_file="extracted_matematica_data.json"):
    """
    Save extracted data to JSON file
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Data saved to: {output_file}")

if __name__ == "__main__":
    pdf_path = "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf"

    if not os.path.exists(pdf_path):
        print(f"❌ PDF not found: {pdf_path}")
        sys.exit(1)

    print("╔════════════════════════════════════════════════════════════╗")
    print("║  📚 Matematica Manual - Content Extraction Tool 📚         ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print()

    # Extract content
    extracted = extract_pdf_content(pdf_path)

    # Save to file
    save_extracted_data(extracted)

    print("\n📋 Next steps:")
    print("   1. Review extracted_matematica_data.json")
    print("   2. Organize content by lessons")
    print("   3. Update curriculum_structure.json")

