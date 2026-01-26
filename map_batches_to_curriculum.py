#!/usr/bin/env python3
"""
🎓 Map Extracted Lessons to Curriculum Structure
=================================================
Takes extracted document batches and maps them to curriculum_structure.json

This script:
  1. Reads extracted batch files
  2. Detects lessons and sections
  3. Maps to correct grade level and subject
  4. Updates curriculum_structure.json
  5. Preserves existing questions
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class CurriculumMapper:
    """Map extracted content to curriculum structure"""

    def __init__(self, curriculum_file: str = "curriculum_structure.json"):
        self.curriculum_file = Path(curriculum_file)
        self.curriculum = {}

        # Load existing curriculum
        if self.curriculum_file.exists():
            with open(self.curriculum_file, 'r', encoding='utf-8') as f:
                self.curriculum = json.load(f)
        else:
            print(f"⚠️  Warning: {curriculum_file} not found. Creating new structure.")
            self.curriculum = {}

    def extract_from_batches(self, batch_dir: str) -> Dict:
        """Extract content from batch files"""
        batch_path = Path(batch_dir)

        if not batch_path.exists():
            print(f"❌ Error: Batch directory not found: {batch_dir}")
            return {}

        extracted_content = {
            'lessons': [],
            'sections': [],
            'total_chars': 0,
            'source': batch_dir
        }

        # Read all batch files
        batch_files = sorted(batch_path.glob("batch_*.json"))
        print(f"📂 Found {len(batch_files)} batch files in {batch_dir}")

        for batch_file in batch_files:
            try:
                with open(batch_file, 'r', encoding='utf-8') as f:
                    batch = json.load(f)

                # Extract lessons from this batch
                if 'pages' in batch:
                    # PDF batches
                    for page in batch['pages']:
                        if 'lessons' in page and page['lessons']:
                            extracted_content['lessons'].extend(page['lessons'])

                        # Extract text content
                        if 'text' in page:
                            extracted_content['sections'].append({
                                'page': page.get('page_number'),
                                'text': page['text'][:500],  # First 500 chars
                                'full_length': len(page.get('text', ''))
                            })
                            extracted_content['total_chars'] += len(page.get('text', ''))

                elif 'sections' in batch:
                    # Document batches
                    for section in batch['sections']:
                        if 'lessons' in section and section['lessons']:
                            extracted_content['lessons'].extend(section['lessons'])

                        # Extract text
                        if 'text' in section:
                            extracted_content['sections'].append({
                                'index': section.get('index'),
                                'text': section['text'][:500],
                                'full_length': len(section.get('text', ''))
                            })
                            extracted_content['total_chars'] += len(section.get('text', ''))

            except json.JSONDecodeError as e:
                print(f"⚠️  Error reading {batch_file.name}: {e}")

        return extracted_content

    def map_to_grade_and_subject(self, batch_dir: str) -> Tuple[Optional[str], Optional[str]]:
        """Determine grade and subject from batch directory name"""
        dir_name = batch_dir.lower()

        # Detect grade
        grade_map = {
            'v5': 'Clasa a V a',
            'v5': 'Clasa a V a',
            'v6': 'Clasa a VI a',
            'v7': 'Clasa a VII a',
            'v8': 'Clasa a VIII a',
            'clasa a v': 'Clasa a V a',
            'clasa a vi': 'Clasa a VI a',
            'clasa a vii': 'Clasa a VII a',
            'clasa a viii': 'Clasa a VIII a',
        }

        grade = None
        for key, value in grade_map.items():
            if key in dir_name:
                grade = value
                break

        # Detect subject
        subject_map = {
            'matematica': 'Matematica',
            'mate': 'Matematica',
            'limba': 'Limba și literatura română',
            'romana': 'Limba și literatura română',
        }

        subject = None
        for key, value in subject_map.items():
            if key in dir_name:
                subject = value
                break

        return grade, subject

    def update_curriculum(self, batch_dir: str, grade: str, subject: str):
        """Update curriculum structure with extracted content"""

        print(f"\n📚 Mapping {batch_dir} to {grade} - {subject}")

        # Extract content
        extracted = self.extract_from_batches(batch_dir)

        if not extracted['lessons']:
            print(f"⚠️  No lessons found in {batch_dir}")
            return

        # Initialize grade/subject if needed
        if grade not in self.curriculum:
            self.curriculum[grade] = {}

        if subject not in self.curriculum[grade]:
            self.curriculum[grade][subject] = []

        # Map lessons
        print(f"  📝 Found {len(extracted['lessons'])} lessons")
        print(f"  📊 Total characters: {extracted['total_chars']:,}")

        # Add extracted sections to lessons
        for lesson_num, lesson in enumerate(extracted['lessons'], 1):
            lesson_data = {
                'lectia': lesson_num,
                'titlu': lesson.get('title', f'Lesson {lesson_num}'),
                'content': extracted['sections'][:1] if extracted['sections'] else [],  # First section as summary
                'images': [],
                'questions': [],  # Preserve if updating
                'sections': []
            }

            # Check if lesson already exists (preserve questions)
            existing_lesson = next(
                (l for l in self.curriculum[grade][subject] if l.get('lectia') == lesson_num),
                None
            )

            if existing_lesson:
                # Preserve existing questions
                lesson_data['questions'] = existing_lesson.get('questions', [])
                print(f"    ✅ Updated lesson {lesson_num}: {lesson_data['titlu']}")
            else:
                print(f"    ✅ Added lesson {lesson_num}: {lesson_data['titlu']}")

            # Update or add
            self.curriculum[grade][subject] = [
                l for l in self.curriculum[grade][subject] if l.get('lectia') != lesson_num
            ] + [lesson_data]

    def save_curriculum(self):
        """Save updated curriculum to file"""
        with open(self.curriculum_file, 'w', encoding='utf-8') as f:
            json.dump(self.curriculum, f, ensure_ascii=False, indent=2)

        print(f"\n✅ Curriculum saved to: {self.curriculum_file}")

    def process_batch_dir(self, batch_dir: str) -> bool:
        """Process a single batch directory"""

        grade, subject = self.map_to_grade_and_subject(batch_dir)

        if not grade:
            print(f"❌ Could not determine grade from: {batch_dir}")
            return False

        if not subject:
            print(f"❌ Could not determine subject from: {batch_dir}")
            return False

        self.update_curriculum(batch_dir, grade, subject)
        return True


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Map extracted document batches to curriculum',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Map single batch directory
  %(prog)s matematica_v5_manual_batches
  
  # Map multiple directories
  %(prog)s matematica_v5_manual_batches limba_romana_v5_manual_batches
  
  # Custom curriculum file
  %(prog)s batch_dir -c custom_curriculum.json
  
  # Auto-map all *_batches directories
  %(prog)s --auto-all
        """
    )

    parser.add_argument('batch_dirs', nargs='*', help='Batch directories to map')
    parser.add_argument('-c', '--curriculum', default='curriculum_structure.json',
                        help='Curriculum file (default: curriculum_structure.json)')
    parser.add_argument('--auto-all', action='store_true',
                        help='Auto-map all *_batches directories')

    args = parser.parse_args()

    mapper = CurriculumMapper(args.curriculum)

    if args.auto_all:
        # Find all *_batches directories
        batch_dirs = sorted(Path('.').glob('*_batches'))
        args.batch_dirs = [str(d) for d in batch_dirs]

    if not args.batch_dirs:
        parser.print_help()
        return

    print("\n" + "="*80)
    print("🎓 MAPPING EXTRACTED CONTENT TO CURRICULUM")
    print("="*80)

    success_count = 0
    for batch_dir in args.batch_dirs:
        if mapper.process_batch_dir(batch_dir):
            success_count += 1

    # Save curriculum
    mapper.save_curriculum()

    print("\n" + "="*80)
    print(f"✅ Mapped {success_count}/{len(args.batch_dirs)} batch directories")
    print("="*80)


if __name__ == "__main__":
    main()

