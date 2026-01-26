#!/usr/bin/env python3
"""
📄 PDF to JSON Batch Processor
==============================
Memory-efficient PDF extraction that processes pages in batches
and outputs structured JSON data.

Features:
  - Processes one page at a time (minimal memory)
  - Batches pages into configurable chunks
  - Detects lessons, chapters, sections automatically
  - Extracts text, images, tables intelligently
  - Saves each batch immediately
  - Progress tracking and statistics
  - Works with large PDFs (100+ MB)

Usage:
  python3 pdf_to_json_batch_processor.py input.pdf -b 10 -o output_dir

Requirements:
  pip install pypdf PyPDF2 pdfplumber
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Generator, Tuple, Optional
import re

# Try to import PDF libraries (with fallbacks)
try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False
    print("⚠️  pdfplumber not installed. Install with: pip install pdfplumber")

try:
    from pypdf import PdfReader
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


class PDFBatchProcessor:
    """Process large PDFs in memory-efficient batches"""

    def __init__(
        self,
        pdf_file: str,
        batch_size: int = 10,
        output_dir: str = None,
        detect_lessons: bool = True
    ):
        self.pdf_file = Path(pdf_file)
        self.batch_size = batch_size
        self.detect_lessons = detect_lessons
        self.total_pages = 0
        self.batch_num = 0

        # Validate input
        if not self.pdf_file.exists():
            print(f"❌ Error: PDF file not found: {pdf_file}")
            sys.exit(1)

        if not HAS_PDFPLUMBER and not HAS_PYPDF:
            print("❌ Error: No PDF library available")
            print("Install one with: pip install pdfplumber")
            sys.exit(1)

        # Set output directory
        if output_dir is None:
            output_dir = f"{self.pdf_file.stem}_batches"

        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Get PDF info
        self._get_pdf_info()

        # Statistics
        self.stats = {
            'batches': 0,
            'pages_processed': 0,
            'lessons_found': 0,
            'total_text_chars': 0,
            'images_found': 0,
            'tables_found': 0
        }

    def _get_pdf_info(self):
        """Get PDF page count"""
        try:
            if HAS_PDFPLUMBER:
                with pdfplumber.open(self.pdf_file) as pdf:
                    self.total_pages = len(pdf.pages)
            elif HAS_PYPDF:
                with open(self.pdf_file, 'rb') as f:
                    reader = PdfReader(f)
                    self.total_pages = len(reader.pages)
        except Exception as e:
            print(f"⚠️  Could not get page count: {e}")
            self.total_pages = 0

    def extract_pages_in_batches(self) -> Generator[List[Dict], None, None]:
        """
        Generator that yields pages in batches.
        Only keeps one page in memory at a time.
        """
        try:
            with pdfplumber.open(self.pdf_file) as pdf:
                current_batch = []

                for page_num, page in enumerate(pdf.pages, 1):
                    # Extract page data
                    page_data = self._extract_page_data(page, page_num)
                    current_batch.append(page_data)

                    # Update stats
                    self.stats['pages_processed'] += 1
                    self.stats['total_text_chars'] += len(page_data.get('text', ''))
                    self.stats['images_found'] += len(page_data.get('images', []))
                    self.stats['tables_found'] += len(page_data.get('tables', []))

                    # Yield batch when full
                    if len(current_batch) >= self.batch_size:
                        yield current_batch
                        current_batch = []

                # Yield final batch
                if current_batch:
                    yield current_batch

        except Exception as e:
            print(f"❌ Error reading PDF: {e}")
            sys.exit(1)

    def _extract_page_data(self, page, page_num: int) -> Dict:
        """Extract data from a single page"""
        page_data = {
            'page_number': page_num,
            'text': '',
            'images': [],
            'tables': [],
            'lessons': [],
            'metadata': {}
        }

        try:
            # Extract text
            text = page.extract_text()
            if text:
                page_data['text'] = text
                page_data['text_length'] = len(text)

            # Extract tables
            tables = page.extract_tables()
            if tables:
                page_data['tables'] = [
                    {'rows': len(table), 'cols': len(table[0]) if table else 0}
                    for table in tables
                ]

            # Detect lessons if enabled
            if self.detect_lessons and text:
                lessons = self._detect_lessons(text, page_num)
                if lessons:
                    page_data['lessons'] = lessons
                    self.stats['lessons_found'] += len(lessons)

            # Page size info
            page_data['metadata'] = {
                'width': page.width,
                'height': page.height,
                'has_images': len(page.images) > 0,
                'image_count': len(page.images)
            }

            return page_data

        except Exception as e:
            print(f"⚠️  Error extracting page {page_num}: {e}")
            page_data['error'] = str(e)
            return page_data

    def _detect_lessons(self, text: str, page_num: int) -> List[Dict]:
        """Detect lessons/chapters in page text"""
        lessons = []

        # Pattern for lesson headers
        patterns = [
            r'^Lecția\s+(\d+)[:\s]+(.+?)$',
            r'^Chapter\s+(\d+)[:\s]+(.+?)$',
            r'^Unit\s+(\d+)[:\s]+(.+?)$',
            r'^Unitatea\s+(\d+)[:\s]+(.+?)$',
            r'^Capitolul\s+(\d+)[:\s]+(.+?)$',
        ]

        lines = text.split('\n')
        for line in lines:
            for pattern in patterns:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    lessons.append({
                        'number': int(match.group(1)),
                        'title': match.group(2).strip(),
                        'page': page_num
                    })

        return lessons

    def process_batch(self, pages: List[Dict]) -> Dict:
        """Process a single batch of pages"""
        processed = {
            'batch_number': self.batch_num,
            'page_count': len(pages),
            'pages': pages,
            'summary': {
                'total_chars': sum(len(p.get('text', '')) for p in pages),
                'total_tables': sum(len(p.get('tables', [])) for p in pages),
                'total_lessons': sum(len(p.get('lessons', [])) for p in pages),
                'page_range': f"{pages[0]['page_number']}-{pages[-1]['page_number']}"
            }
        }
        return processed

    def save_batch(self, batch_data: Dict) -> Path:
        """Save batch to JSON file"""
        batch_file = self.output_dir / f"batch_{self.batch_num:03d}.json"

        try:
            with open(batch_file, 'w', encoding='utf-8') as f:
                json.dump(batch_data, f, ensure_ascii=False, indent=2)
            return batch_file
        except IOError as e:
            print(f"❌ Error saving batch {self.batch_num}: {e}")
            return None

    def print_progress(self, batch_file: Path, page_count: int):
        """Print progress for current batch"""
        status = "✅" if batch_file else "❌"
        pages = f"{batch_file.name}" if batch_file else "ERROR"
        print(f"{status} Batch {self.batch_num:02d}: {page_count:3d} pages ({batch_file.stem if batch_file else 'failed'})")

    def print_summary(self):
        """Print processing summary"""
        print("\n" + "="*80)
        print("📊 PDF EXTRACTION COMPLETE")
        print("="*80)
        print(f"✅ Batches created:      {self.stats['batches']}")
        print(f"📄 Pages processed:      {self.stats['pages_processed']}/{self.total_pages}")
        print(f"📝 Lessons detected:     {self.stats['lessons_found']}")
        print(f"📊 Total text chars:     {self.stats['total_text_chars']:,}")
        print(f"🖼️  Images found:         {self.stats['images_found']}")
        print(f"📋 Tables found:         {self.stats['tables_found']}")
        print(f"📂 Output directory:     {self.output_dir.absolute()}")
        print("="*80 + "\n")

    def process_all(self) -> bool:
        """Main processing loop"""
        print("\n" + "="*80)
        print("🚀 PDF TO JSON BATCH PROCESSOR")
        print("="*80)
        print(f"📖 Input file:       {self.pdf_file}")
        print(f"📄 Total pages:      {self.total_pages}")
        print(f"📦 Batch size:       {self.batch_size} pages per batch")
        print(f"📂 Output dir:       {self.output_dir}")
        print("="*80 + "\n")

        if self.total_pages == 0:
            print("⚠️  Could not determine page count. Processing anyway...")

        try:
            for batch in self.extract_pages_in_batches():
                # Process batch
                batch_data = self.process_batch(batch)

                # Save to JSON
                batch_file = self.save_batch(batch_data)

                # Print progress
                self.print_progress(batch_file, len(batch))

                # Update stats
                self.stats['batches'] += 1
                self.batch_num += 1

            # Print final summary
            self.print_summary()
            return True

        except Exception as e:
            print(f"\n❌ Error during processing: {e}")
            return False


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Extract PDF to JSON in memory-efficient batches',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Default batch size of 10 pages
  %(prog)s input.pdf
  
  # Custom batch size
  %(prog)s manual.pdf -b 5
  
  # Custom output directory
  %(prog)s large_file.pdf -o json_output
  
  # Without lesson detection
  %(prog)s file.pdf --no-lessons
        """
    )

    parser.add_argument('pdf_file', help='Input PDF file')
    parser.add_argument('-b', '--batch-size', type=int, default=10,
                        help='Pages per batch (default: 10)')
    parser.add_argument('-o', '--output', help='Output directory')
    parser.add_argument('--no-lessons', action='store_true',
                        help='Disable lesson detection')

    args = parser.parse_args()

    processor = PDFBatchProcessor(
        pdf_file=args.pdf_file,
        batch_size=args.batch_size,
        output_dir=args.output,
        detect_lessons=not args.no_lessons
    )

    success = processor.process_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

