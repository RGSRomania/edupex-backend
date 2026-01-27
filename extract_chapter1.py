#!/usr/bin/env python3
"""
Extract content from Manual.pdf - Chapter 1
Extracts text, images, and structure information
"""

import PyPDF2
import fitz  # PyMuPDF
import json
import os
from pathlib import Path

# File paths
pdf_path = "/Users/mdica/PycharmProjects/EduPex/Planificari + Manual + Culegeri/Clasa a V a/Matematica/Manual.pdf"
output_dir = "/Users/mdica/PycharmProjects/EduPex/matematica_chapter1_extraction"
images_dir = os.path.join(output_dir, "images")

# Create output directories
os.makedirs(images_dir, exist_ok=True)

def extract_chapter1_content():
    """
    Extract Chapter 1 content from the PDF
    Returns a dictionary with all extracted content
    """

    doc = fitz.open(pdf_path)
    content = {
        "metadata": {
            "total_pages": len(doc),
            "source": "Manual.pdf - Clasa a V a Matematica"
        },
        "chapters": []
    }

    print(f"📄 PDF has {len(doc)} pages")

    # Extract text from first 50 pages to find Chapter 1
    chapter_content = {
        "number": "1",
        "name": "",
        "raw_text": "",
        "images": [],
        "page_ranges": {
            "start": None,
            "end": None
        }
    }

    image_count = 0
    chapter_started = False
    chapter_ended = False
    pages_content = []

    for page_num in range(min(100, len(doc))):  # Check first 100 pages
        page = doc[page_num]
        text = page.get_text()

        # Look for "Capitolul 1" or "Chapter 1" indicators
        if not chapter_started and ("Capitolul 1" in text or "CAPITOLUL 1" in text or "Chapter 1" in text):
            chapter_started = True
            chapter_content["page_ranges"]["start"] = page_num
            print(f"✅ Found Chapter 1 start at page {page_num}")

        if chapter_started:
            pages_content.append({
                "page_num": page_num,
                "text": text
            })

            # Extract images from this page
            image_list = page.get_images()
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)

                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_filename = f"chapter1_page{page_num}_img{img_index}.png"
                        img_path = os.path.join(images_dir, img_filename)
                        pix.save(img_path)
                        image_count += 1
                        chapter_content["images"].append({
                            "page": page_num,
                            "filename": img_filename
                        })
                        print(f"  📸 Extracted image: {img_filename}")
                    pix = None
                except Exception as e:
                    print(f"  ⚠️  Could not extract image from page {page_num}: {str(e)}")

            # Stop after finding second chapter or after enough content
            if page_num > chapter_content["page_ranges"]["start"] + 50:
                # Look for next chapter indicator
                if "Capitolul 2" in text or "CAPITOLUL 2" in text or "Chapter 2" in text:
                    chapter_ended = True
                    chapter_content["page_ranges"]["end"] = page_num
                    print(f"✅ Found Chapter 2 start (end of Chapter 1) at page {page_num}")
                    break

    # If chapter 2 not found, set end based on reasonable length
    if not chapter_ended and chapter_content["page_ranges"]["start"] is not None:
        chapter_content["page_ranges"]["end"] = min(
            chapter_content["page_ranges"]["start"] + 50,
            len(doc) - 1
        )

    # Store all extracted text
    chapter_content["raw_text"] = "\n\n---PAGE BREAK---\n\n".join([
        f"PAGE {p['page_num']}:\n{p['text']}" for p in pages_content
    ])

    content["chapters"].append(chapter_content)

    doc.close()

    return content, image_count, len(pages_content)

# Run extraction
print("🚀 Starting Chapter 1 extraction from Manual.pdf...")
print("=" * 60)

content, img_count, page_count = extract_chapter1_content()

print("=" * 60)
print(f"✅ Extraction complete!")
print(f"   - Pages processed: {page_count}")
print(f"   - Images extracted: {img_count}")
print(f"   - Chapter pages: {content['chapters'][0]['page_ranges']}")

# Save raw extraction as JSON
output_file = os.path.join(output_dir, "chapter1_raw_extraction.json")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

print(f"✅ Saved raw extraction to: {output_file}")
print(f"✅ Images saved to: {images_dir}/")


