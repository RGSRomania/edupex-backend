#!/usr/bin/env python3
"""
Extract text AND images from Manual MATE.doc
Creates a folder with extracted images and text content
"""

import os
import re
from pathlib import Path
from datetime import datetime

def extract_from_rtf_with_images(doc_path):
    """
    Extract content from RTF file and look for embedded images
    """
    print("🔍 Attempting to extract text and image references from RTF file...")

    if not os.path.exists(doc_path):
        print(f"❌ File not found: {doc_path}")
        return None

    print(f"📖 Reading {doc_path}...")

    # Read raw bytes
    with open(doc_path, 'rb') as f:
        raw_data = f.read()

    print(f"✅ Loaded {len(raw_data)} bytes")

    # Create output directory
    output_dir = "EXTRACTED_IMAGES"
    os.makedirs(output_dir, exist_ok=True)

    # Look for image signatures in the binary data
    image_count = extract_images(raw_data, output_dir)

    # Extract text
    text = extract_text_from_rtf(raw_data)

    return {
        'text': text,
        'image_count': image_count,
        'output_dir': output_dir
    }

def extract_images(data, output_dir):
    """Extract embedded images from RTF binary data"""
    image_count = 0

    # Look for JPEG signatures
    jpeg_start = b'\xff\xd8\xff'
    jpeg_end = b'\xff\xd9'

    pos = 0
    while True:
        pos = data.find(jpeg_start, pos)
        if pos == -1:
            break

        end_pos = data.find(jpeg_end, pos)
        if end_pos == -1:
            pos += 1
            continue

        # Extract JPEG data
        jpeg_data = data[pos:end_pos + 2]

        # Save image
        image_file = os.path.join(output_dir, f"image_{image_count}.jpg")
        with open(image_file, 'wb') as f:
            f.write(jpeg_data)

        print(f"  ✅ Extracted image {image_count}: {len(jpeg_data)} bytes → {image_file}")
        image_count += 1
        pos = end_pos + 1

    # Look for PNG signatures
    png_start = b'\x89PNG'
    png_end = b'IEND'

    pos = 0
    while True:
        pos = data.find(png_start, pos)
        if pos == -1:
            break

        end_pos = data.find(png_end, pos)
        if end_pos == -1:
            pos += 1
            continue

        # Extract PNG data
        png_data = data[pos:end_pos + 8]  # Include IEND bytes

        # Save image
        image_file = os.path.join(output_dir, f"image_{image_count}.png")
        with open(image_file, 'wb') as f:
            f.write(png_data)

        print(f"  ✅ Extracted image {image_count}: {len(png_data)} bytes → {image_file}")
        image_count += 1
        pos = end_pos + 1

    return image_count

def extract_text_from_rtf(data):
    """Extract readable text from RTF data"""
    try:
        text = data.decode('utf-8', errors='ignore')
    except:
        text = data.decode('latin-1', errors='ignore')

    # Remove RTF control sequences
    text = re.sub(r'\\[a-z]+\d*\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r"\\'[0-9a-f]{2}", '', text, flags=re.IGNORECASE)
    text = re.sub(r'\\[^a-zA-Z]', '', text)
    text = re.sub(r'[{}]', '', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n\n\n+', '\n\n', text)

    return text

def main():
    print("\n" + "=" * 80)
    print("🖼️  EXTRACT TEXT & IMAGES FROM MANUAL MATE.DOC")
    print("=" * 80 + "\n")

    doc_path = "/Users/mdica/PycharmProjects/EduPex/Manuale word/Clasa a V-A/Manual MATE.doc"

    result = extract_from_rtf_with_images(doc_path)

    if result is None:
        return

    print(f"\n✅ Extraction Complete!")
    print(f"   📊 Image count: {result['image_count']}")
    print(f"   📂 Output directory: {result['output_dir']}")
    print(f"   📝 Text characters: {len(result['text'])}")

    print("\n" + "=" * 80)
    print("RESULTS:")
    print("=" * 80)

    if result['image_count'] > 0:
        print(f"\n✅ SUCCESS! Found {result['image_count']} images")
        print(f"   Location: {os.path.abspath(result['output_dir'])}/")
        print(f"\n   Images extracted:")
        for img in os.listdir(result['output_dir']):
            img_path = os.path.join(result['output_dir'], img)
            img_size = os.path.getsize(img_path) / 1024
            print(f"   - {img} ({img_size:.1f} KB)")
    else:
        print(f"\n⚠️  No images found in the RTF file")
        print(f"   Possible reasons:")
        print(f"   - Images might be stored differently in RTF")
        print(f"   - Images might not be embedded (linked instead)")
        print(f"   - RTF might not support full image extraction")

    print("\n" + "=" * 80)
    print("OPTIONS:")
    print("=" * 80)

    if result['image_count'] > 0:
        print(f"\n✅ Images found! You can:")
        print(f"   1. Review extracted images in {result['output_dir']}/")
        print(f"   2. Continue with text extraction")
        print(f"   3. Describe images manually in the text file")
    else:
        print(f"\n⚠️  No embedded images found in RTF")
        print(f"\n   Next options:")
        print(f"   1. Convert .doc to PDF and extract images from PDF")
        print(f"   2. Open .doc in Word and export images manually")
        print(f"   3. Continue with text-only extraction")
        print(f"   4. Describe images/diagrams in text form")

    print("\n" + "=" * 80)

if __name__ == '__main__':
    main()

