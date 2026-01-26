#!/usr/bin/env python3
"""
Extract text AND images from PDF files
Specifically designed for Manual MATE.pdf
"""

import os
import sys
from pathlib import Path

try:
    from PyPDF2 import PdfReader
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError as e:
    print(f"❌ Missing library: {e}")
    print("Install with: pip install PyPDF2 pdf2image pillow")
    sys.exit(1)

def extract_from_pdf(pdf_path, output_dir="EXTRACTED_FROM_PDF"):
    """Extract text and images from PDF"""

    if not os.path.exists(pdf_path):
        print(f"❌ PDF not found: {pdf_path}")
        return None

    print(f"📖 Reading PDF: {pdf_path}")
    print(f"📊 File size: {os.path.getsize(pdf_path) / 1024 / 1024:.2f} MB")

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Extract text
    print("\n📝 Extracting text from PDF...")
    text = extract_text_from_pdf(pdf_path)

    # Extract images
    print("\n🖼️  Extracting images from PDF...")
    image_count = extract_images_from_pdf(pdf_path, output_dir)

    return {
        'text': text,
        'image_count': image_count,
        'output_dir': output_dir,
        'text_length': len(text)
    }

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    try:
        reader = PdfReader(pdf_path)
        text = ""

        for i, page in enumerate(reader.pages):
            try:
                page_text = page.extract_text()
                text += f"\n--- PAGE {i+1} ---\n"
                text += page_text
            except Exception as e:
                print(f"  ⚠️  Could not extract text from page {i+1}: {e}")

        return text
    except Exception as e:
        print(f"  ❌ Error extracting text: {e}")
        return ""

def extract_images_from_pdf(pdf_path, output_dir):
    """Extract images from PDF by converting to images"""
    try:
        print("  Converting PDF to images (this may take a moment)...")
        images = convert_from_path(pdf_path, dpi=150)

        print(f"  ✅ PDF converted to {len(images)} page images")

        # Save images
        for i, image in enumerate(images):
            image_path = os.path.join(output_dir, f"page_{i+1:03d}.png")
            image.save(image_path, 'PNG')

            width, height = image.size
            file_size = os.path.getsize(image_path) / 1024
            print(f"     ✅ Page {i+1}: {width}x{height} → {file_size:.1f} KB")

        return len(images)
    except Exception as e:
        print(f"  ❌ Error extracting images: {e}")
        return 0

def save_text_file(text, output_file="EXTRACTED_TEXT_FROM_PDF.txt"):
    """Save extracted text to file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)

    print(f"\n✅ Text saved to: {output_file}")

def main():
    print("\n" + "=" * 80)
    print("🖼️  EXTRACT TEXT & IMAGES FROM PDF")
    print("=" * 80 + "\n")

    # Find the Matematica PDF
    pdf_path = "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf"

    if not os.path.exists(pdf_path):
        print(f"❌ PDF not found: {pdf_path}")
        print("\nAvailable PDFs:")
        pdfs = [
            "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Limba și literatura romnă/Manual.pdf",
            "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf",
        ]
        for pdf in pdfs:
            if os.path.exists(pdf):
                print(f"  ✅ {pdf}")
        return

    print(f"📖 Found: {pdf_path}\n")

    # Extract
    result = extract_from_pdf(pdf_path)

    if result is None:
        return

    # Save text
    save_text_file(result['text'])

    # Print summary
    print("\n" + "=" * 80)
    print("✅ EXTRACTION COMPLETE!")
    print("=" * 80)
    print(f"\n📊 Results:")
    print(f"   Text characters: {result['text_length']:,}")
    print(f"   Images extracted: {result['image_count']}")
    print(f"   Output directory: {os.path.abspath(result['output_dir'])}/")
    print(f"\n📂 Files created:")
    print(f"   - EXTRACTED_TEXT_FROM_PDF.txt (full text)")

    if result['image_count'] > 0:
        print(f"   - {result['output_dir']}/page_*.png ({result['image_count']} page images)")

    print("\n" + "=" * 80)
    print("🎯 Next steps:")
    print("=" * 80)
    print("""
1. Review the extracted text in EXTRACTED_TEXT_FROM_PDF.txt
2. Review the page images in EXTRACTED_FROM_PDF/
3. Use parse_matematica_manual.py to extract lessons from text
4. Integrate with page images for visual reference
5. Update curriculum_structure.json
""")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()

