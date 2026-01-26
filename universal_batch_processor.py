#!/usr/bin/env python3
"""
🎯 UNIVERSAL BATCH PROCESSOR
=============================
Process ANY large text file in memory-efficient batches.
Works for lessons, documents, articles, etc.

Usage:
    python3 universal_batch_processor.py <input_file> [options]

Examples:
    # Default batch size of 15
    python3 universal_batch_processor.py MATEMATICA_PARSED_IMPROVED.txt

    # Custom batch size
    python3 universal_batch_processor.py MATEMATICA_PARSED_IMPROVED.txt -b 20

    # Custom output directory
    python3 universal_batch_processor.py LIMBA_ROMANA_PARSED.txt -o limba_batches

    # All options
    python3 universal_batch_processor.py file.txt -b 10 -o output_dir -p "LESSON"
"""

import json
import re
import sys
from pathlib import Path
from typing import Generator, List, Dict, Optional
import argparse


class UniversalBatchProcessor:
    """Process any large text file in memory-efficient batches"""

    def __init__(
        self,
        input_file: str,
        batch_size: int = 15,
        output_dir: str = None,
        delimiter_pattern: str = r"^(LESSON|Lecția|Chapter|Capitolul)\s+\d+",
        delimiter_type: str = "regex"
    ):
        self.input_file = Path(input_file)
        self.batch_size = batch_size
        self.delimiter_pattern = delimiter_pattern
        self.delimiter_type = delimiter_type

        # Set output directory
        if output_dir is None:
            stem = self.input_file.stem
            output_dir = f"{stem}_batches"

        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        self.batch_num = 0
        self.total_items = 0

        # Validate input file
        if not self.input_file.exists():
            print(f"❌ Error: Input file not found: {input_file}")
            sys.exit(1)

    def read_items_in_batches(self) -> Generator[List[Dict], None, None]:
        """
        Generator that yields items in batches.
        Each item is text between delimiters.
        """
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                current_batch = []
                current_item = None

                for line_num, line in enumerate(f, 1):
                    line_stripped = line.rstrip('\n')

                    # Check if line matches delimiter
                    if self._matches_delimiter(line_stripped):
                        # Save previous item
                        if current_item:
                            current_batch.append(current_item)

                        # Start new item
                        current_item = {
                            'title': self._extract_title(line_stripped),
                            'raw_title': line_stripped,
                            'line_number': line_num,
                            'content': []
                        }

                    # Skip empty lines and separators
                    elif self._should_skip(line_stripped):
                        continue

                    # Add line to current item
                    elif current_item and line_stripped.strip():
                        current_item['content'].append(line_stripped.strip())

                    # Yield batch when full
                    if len(current_batch) >= self.batch_size:
                        yield current_batch
                        current_batch = []

                # Yield final item and batch
                if current_item:
                    current_batch.append(current_item)
                if current_batch:
                    yield current_batch

        except Exception as e:
            print(f"❌ Error reading file: {e}")
            sys.exit(1)

    def _matches_delimiter(self, line: str) -> bool:
        """Check if line matches delimiter pattern"""
        if self.delimiter_type == "regex":
            return re.match(self.delimiter_pattern, line, re.IGNORECASE) is not None
        elif self.delimiter_type == "exact":
            return line == self.delimiter_pattern
        elif self.delimiter_type == "startswith":
            return line.startswith(self.delimiter_pattern)
        return False

    def _extract_title(self, line: str) -> str:
        """Extract meaningful title from line"""
        # Try to remove common prefixes
        title = re.sub(r'^(LESSON|Lecția|Chapter|Capitolul)\s+\d+[:.]?\s*', '', line, flags=re.IGNORECASE)
        return title.strip() if title else line

    def _should_skip(self, line: str) -> bool:
        """Check if line should be skipped"""
        # Skip separator lines
        if re.match(r'^=+\s*$', line):
            return True
        # Skip metadata
        if re.match(r'^(Page|CONTENT|Lines?):', line):
            return True
        return False

    def process_batch(self, items: List[Dict]) -> Dict:
        """Process a single batch"""
        processed_items = []

        for item in items:
            processed_item = {
                'title': item['title'],
                'line_number': item['line_number'],
                'content_lines': len(item['content']),
                'content': item['content'],
                'content_preview': self._create_preview(item['content']),
                'metadata': {
                    'word_count': sum(len(line.split()) for line in item['content']),
                    'char_count': sum(len(line) for line in item['content'])
                }
            }
            processed_items.append(processed_item)
            self.total_items += 1

        return {
            'batch_number': self.batch_num,
            'item_count': len(processed_items),
            'items': processed_items
        }

    def _create_preview(self, content: List[str], max_length: int = 150) -> str:
        """Create preview of content"""
        preview = " ".join(content)
        return preview[:max_length] + "..." if len(preview) > max_length else preview

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

    def print_progress(self, batch_file: Path, item_count: int):
        """Print progress for current batch"""
        status = "✅" if batch_file else "❌"
        print(f"{status} Batch {self.batch_num:02d}: {item_count:3d} items → {batch_file.name}")

    def print_summary(self):
        """Print processing summary"""
        print("\n" + "="*80)
        print("📊 PROCESSING COMPLETE")
        print("="*80)
        print(f"✅ Input file:       {self.input_file}")
        print(f"📦 Batch size:       {self.batch_size} items per batch")
        print(f"📚 Total items:      {self.total_items}")
        print(f"📊 Total batches:    {self.batch_num}")
        print(f"📂 Output directory: {self.output_dir.absolute()}")
        print("="*80 + "\n")

    def process_all(self) -> bool:
        """Main processing loop"""
        print("\n" + "="*80)
        print("🚀 UNIVERSAL BATCH PROCESSOR")
        print("="*80)
        print(f"📖 Input file:      {self.input_file}")
        print(f"📦 Batch size:      {self.batch_size} items per batch")
        print(f"🎯 Delimiter:       {self.delimiter_pattern}")
        print(f"📂 Output dir:      {self.output_dir}")
        print("="*80 + "\n")

        try:
            for batch in self.read_items_in_batches():
                # Process batch
                batch_data = self.process_batch(batch)

                # Save to JSON
                batch_file = self.save_batch(batch_data)

                # Print progress
                self.print_progress(batch_file, len(batch))

                # Increment counter
                self.batch_num += 1

            # Print final summary
            self.print_summary()
            return True

        except Exception as e:
            print(f"\n❌ Error during processing: {e}")
            return False


def merge_all_batches(batch_dir: str, output_file: str = None) -> bool:
    """Merge all batch files into a single JSON file"""
    batch_path = Path(batch_dir)
    batch_files = sorted(batch_path.glob("batch_*.json"))

    if not batch_files:
        print(f"❌ No batch files found in {batch_dir}")
        return False

    if output_file is None:
        output_file = batch_path.parent / f"{batch_path.name[:-8]}_complete.json"
    else:
        output_file = Path(output_file)

    print(f"\n📦 Merging {len(batch_files)} batch files...")

    merged_data = {
        'metadata': {
            'source_batches': batch_dir,
            'total_batches': len(batch_files),
            'total_items': 0,
            'merge_date': str(Path(batch_files[0]).stat().st_mtime)
        },
        'items': []
    }

    for batch_file in batch_files:
        with open(batch_file, 'r', encoding='utf-8') as f:
            batch_data = json.load(f)
            merged_data['items'].extend(batch_data['items'])
            merged_data['metadata']['total_items'] += batch_data['item_count']

    # Save merged file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Merged file saved: {output_file}")
    print(f"   Total items: {merged_data['metadata']['total_items']}")

    return True


def main():
    parser = argparse.ArgumentParser(
        description='Process large text files in memory-efficient batches',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Default batch size of 15
  %(prog)s MATEMATICA_PARSED_IMPROVED.txt
  
  # Custom batch size of 20
  %(prog)s MATEMATICA_PARSED_IMPROVED.txt -b 20
  
  # Custom output directory
  %(prog)s LIMBA_ROMANA_PARSED.txt -o limba_batches
  
  # Custom delimiter pattern
  %(prog)s custom_file.txt -p "^Chapter" -t regex
  
  # Merge existing batches
  %(prog)s --merge matematica_batches -o output.json
        """
    )

    parser.add_argument('input_file', nargs='?', help='Input file to process')
    parser.add_argument('-b', '--batch-size', type=int, default=15,
                        help='Number of items per batch (default: 15)')
    parser.add_argument('-o', '--output', help='Output directory or file for merge')
    parser.add_argument('-p', '--pattern', default=r"^(LESSON|Lecția|Chapter|Capitolul)\s+\d+",
                        help='Delimiter pattern (default: LESSON/Lecția/Chapter/Capitolul)')
    parser.add_argument('-t', '--type', choices=['regex', 'exact', 'startswith'],
                        default='regex', help='Pattern type (default: regex)')
    parser.add_argument('--merge', action='store_true',
                        help='Merge batch files instead of processing')

    args = parser.parse_args()

    # Handle merge operation
    if args.merge:
        if not args.input_file:
            print("❌ Error: Specify batch directory for merge")
            sys.exit(1)
        success = merge_all_batches(args.input_file, args.output)
        sys.exit(0 if success else 1)

    # Handle regular processing
    if not args.input_file:
        parser.print_help()
        sys.exit(1)

    processor = UniversalBatchProcessor(
        input_file=args.input_file,
        batch_size=args.batch_size,
        output_dir=args.output,
        delimiter_pattern=args.pattern,
        delimiter_type=args.type
    )

    success = processor.process_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

