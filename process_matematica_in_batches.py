#!/usr/bin/env python3
"""
📚 Batch Processor for Matematica Lessons
=========================================
Processes large lesson files in memory-efficient batches to avoid memory overload.

Features:
  - Processes lessons in configurable batches (default: 15 lessons)
  - Only loads one batch at a time to minimize memory usage
  - Categorizes content (definitions, examples, formulas, notes)
  - Generates formatted summaries with markdown
  - Saves each batch immediately to avoid data loss
  - Provides progress tracking and statistics
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Generator
import sys

class LessonBatchProcessor:
    def __init__(self, input_file: str, batch_size: int = 15, output_dir: str = "matematica_batches"):
        self.input_file = input_file
        self.batch_size = batch_size
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.batch_num = 0
        self.total_lessons = 0
        self.stats = {
            'batches_processed': 0,
            'total_lessons': 0,
            'total_definitions': 0,
            'total_examples': 0,
            'total_formulas': 0,
            'total_notes': 0
        }

    def read_lessons_in_batches(self) -> Generator[List[Dict], None, None]:
        """
        Generator that yields lessons in batches.
        Only keeps one batch in memory at a time.
        """
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                current_batch = []
                current_lesson = None

                for line in f:
                    line_stripped = line.rstrip('\n')

                    # Detect lesson start (LESSON X: Title)
                    if re.match(r'^LESSON\s+\d+:', line_stripped, re.IGNORECASE):
                        # Save previous lesson if exists
                        if current_lesson:
                            current_batch.append(current_lesson)

                        # Extract lesson title (remove "LESSON X: " prefix)
                        title = re.sub(r'^LESSON\s+\d+:\s*', '', line_stripped, flags=re.IGNORECASE)
                        current_lesson = {
                            'title': title.strip(),
                            'content': []
                        }

                    # Skip separator lines and metadata
                    elif re.match(r'^=+\s*$', line_stripped) or re.match(r'^(Page|CONTENT):', line_stripped):
                        continue

                    # Add non-empty lines to current lesson content
                    elif current_lesson and line_stripped.strip():
                        current_lesson['content'].append(line_stripped.strip())

                    # Yield batch when full
                    if len(current_batch) >= self.batch_size:
                        yield current_batch
                        current_batch = []

                # Yield final lesson and batch
                if current_lesson:
                    current_batch.append(current_lesson)
                if current_batch:
                    yield current_batch

        except FileNotFoundError:
            print(f"❌ Error: File not found: {self.input_file}")
            sys.exit(1)

    def process_batch(self, lessons: List[Dict]) -> Dict:
        """Process a single batch of lessons"""
        processed_lessons = []

        for lesson in lessons:
            processed_lesson = self._process_single_lesson(lesson)
            processed_lessons.append(processed_lesson)

            # Update stats
            self.stats['total_lessons'] += 1
            self.stats['total_definitions'] += len(processed_lesson['definitions'])
            self.stats['total_examples'] += len(processed_lesson['examples'])
            self.stats['total_formulas'] += len(processed_lesson['formulas'])
            self.stats['total_notes'] += len(processed_lesson['notes'])

        return {
            'batch_number': self.batch_num,
            'lesson_count': len(processed_lessons),
            'lessons': processed_lessons
        }

    def _process_single_lesson(self, lesson: Dict) -> Dict:
        """Process a single lesson and categorize its content"""
        content = lesson['content']

        return {
            'title': lesson['title'],
            'definitions': self._extract_definitions(content),
            'examples': self._extract_examples(content),
            'formulas': self._extract_formulas(content),
            'notes': self._extract_notes(content),
            'summary': self._create_summary(content)
        }

    def _extract_definitions(self, content: List[str]) -> List[str]:
        """Extract definition lines"""
        definitions = []
        keywords = ['definiție', 'definition', 'se numește', 'called', 'înțeles ca', 'este']

        for line in content:
            if any(kw.lower() in line.lower() for kw in keywords):
                if len(line) > 10:
                    definitions.append(line)

        return definitions[:10]  # Limit to 10 definitions per lesson

    def _extract_examples(self, content: List[str]) -> List[str]:
        """Extract example lines"""
        examples = []
        keywords = ['exemplu', 'ex.', 'ex:', 'example', 'de exemplu', 'spre exemplu']

        i = 0
        while i < len(content):
            line = content[i]
            if any(kw.lower() in line.lower() for kw in keywords):
                # Get the example and next line if available
                example_block = line
                if i + 1 < len(content) and not self._is_new_section(content[i + 1]):
                    example_block += " " + content[i + 1]
                    i += 1
                if len(example_block) > 10:
                    examples.append(example_block)
            i += 1

        return examples[:10]  # Limit to 10 examples per lesson

    def _extract_formulas(self, content: List[str]) -> List[str]:
        """Extract formula lines (contain math symbols)"""
        formulas = []
        math_symbols = ['=', '×', '÷', '√', '^', '±', '≤', '≥', '≠', '+', '−']

        for line in content:
            if any(symbol in line for symbol in math_symbols):
                # Make sure it's not just a normal sentence
                if len(line.split()) <= 15:  # Likely a formula, not a paragraph
                    formulas.append(line)

        return formulas[:15]  # Limit to 15 formulas per lesson

    def _extract_notes(self, content: List[str]) -> List[str]:
        """Extract note/observation lines"""
        notes = []
        keywords = ['notă', 'observație', 'important', 'atenție', 'note', 'reminder']

        for line in content:
            if any(kw.lower() in line.lower() for kw in keywords):
                if len(line) > 10:
                    notes.append(line)

        return notes[:8]  # Limit to 8 notes per lesson

    def _create_summary(self, content: List[str]) -> str:
        """Create a formatted summary from lesson content"""
        if not content:
            return ""

        # Join content and create summary
        full_text = " ".join(content)

        # Take first meaningful sentence or first 250 characters
        sentences = re.split(r'[.!?]+', full_text)
        summary = ""

        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 10:
                summary = sentence
                break

        # Limit to 300 characters
        return summary[:300] if summary else ""

    def _is_new_section(self, line: str) -> bool:
        """Check if line starts a new section"""
        return re.match(r'^(Lecția|Capitolul|Unitatea)\s+\d+', line, re.IGNORECASE) is not None

    def save_batch_to_json(self, batch_data: Dict) -> Path:
        """Save batch to JSON file"""
        batch_file = self.output_dir / f"batch_{self.batch_num:03d}.json"

        try:
            with open(batch_file, 'w', encoding='utf-8') as f:
                json.dump(batch_data, f, ensure_ascii=False, indent=2)
            return batch_file
        except IOError as e:
            print(f"❌ Error saving batch {self.batch_num}: {e}")
            return None

    def print_progress(self, batch_file: Path, lesson_count: int):
        """Print progress for current batch"""
        status = "✅" if batch_file else "❌"
        print(f"{status} Batch {self.batch_num:02d}: {lesson_count:3d} lessons → {batch_file.name}")

    def print_summary(self):
        """Print processing summary"""
        print("\n" + "="*80)
        print("📊 PROCESSING COMPLETE - SUMMARY")
        print("="*80)
        print(f"✅ Batches processed:    {self.stats['batches_processed']}")
        print(f"📚 Total lessons:        {self.stats['total_lessons']}")
        print(f"📝 Total definitions:    {self.stats['total_definitions']}")
        print(f"💡 Total examples:       {self.stats['total_examples']}")
        print(f"🔢 Total formulas:       {self.stats['total_formulas']}")
        print(f"⚠️  Total notes:          {self.stats['total_notes']}")
        print(f"📂 Output directory:     {self.output_dir.absolute()}")
        print("="*80 + "\n")

    def process_all(self):
        """Main processing loop - handles everything in batches"""
        print("\n" + "="*80)
        print("🚀 STARTING BATCH PROCESSING")
        print("="*80)
        print(f"📖 Input file:     {self.input_file}")
        print(f"📦 Batch size:     {self.batch_size} lessons per batch")
        print(f"📂 Output dir:     {self.output_dir}")
        print("="*80 + "\n")

        try:
            for batch in self.read_lessons_in_batches():
                # Process batch
                batch_data = self.process_batch(batch)

                # Save to JSON
                batch_file = self.save_batch_to_json(batch_data)

                # Print progress
                self.print_progress(batch_file, len(batch))

                # Increment counters
                self.batch_num += 1
                self.stats['batches_processed'] += 1

            # Print final summary
            self.print_summary()

            return True

        except Exception as e:
            print(f"\n❌ Error during processing: {e}")
            return False


def merge_batches_to_single_json(output_dir: str, output_file: str = "matematica_complete.json"):
    """
    Optional: Merge all batch files into a single JSON file
    Use this only after all batches are processed and verified
    """
    output_path = Path(output_dir)
    batch_files = sorted(output_path.glob("batch_*.json"))

    if not batch_files:
        print(f"❌ No batch files found in {output_dir}")
        return False

    print(f"\n📦 Merging {len(batch_files)} batch files...")

    merged_data = {
        'total_batches': len(batch_files),
        'total_lessons': 0,
        'batches': []
    }

    for batch_file in batch_files:
        with open(batch_file, 'r', encoding='utf-8') as f:
            batch_data = json.load(f)
            merged_data['batches'].append(batch_data)
            merged_data['total_lessons'] += batch_data.get('lesson_count', 0)

    # Save merged file
    output_path_file = output_path.parent / output_file
    with open(output_path_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Merged file saved: {output_path_file}")
    print(f"   Total lessons: {merged_data['total_lessons']}")

    return True


if __name__ == "__main__":
    # Configuration
    INPUT_FILE = "MATEMATICA_PARSED_IMPROVED.txt"
    BATCH_SIZE = 15  # Process 15 lessons per batch (adjust based on memory)
    OUTPUT_DIR = "matematica_batches"

    # Create processor
    processor = LessonBatchProcessor(
        input_file=INPUT_FILE,
        batch_size=BATCH_SIZE,
        output_dir=OUTPUT_DIR
    )

    # Process all batches
    success = processor.process_all()

    if success:
        print("💾 Individual batch files have been created and saved.")
        print("\n⚠️  Next steps:")
        print("   1. Review batch files in ./matematica_batches/")
        print("   2. Verify content accuracy")
        print("   3. Optionally merge batches: python3 process_matematica_in_batches.py --merge")
        print("   4. Update curriculum_structure.json with processed data")
    else:
        print("❌ Processing failed. Check errors above.")
        sys.exit(1)

