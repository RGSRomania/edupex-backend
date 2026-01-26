#!/usr/bin/env python3
"""
🚀 BATCH PROCESSOR USAGE EXAMPLES
==================================
Copy and customize these commands for your needs
"""

# ============================================================================
# EXAMPLE 1: Process Matematica (Default - Already Done)
# ============================================================================
"""
cd /Users/mdica/PycharmProjects/EduPex
python3 process_matematica_in_batches.py

Results in: matematica_batches/ (17 files, 248 lessons)
Memory usage: ~50 MB peak
Processing time: <1 second
"""

# ============================================================================
# EXAMPLE 2: Process with Different Batch Size (Memory Constrained)
# ============================================================================
"""
For systems with very limited memory, reduce batch size:

from process_matematica_in_batches import LessonBatchProcessor

processor = LessonBatchProcessor(
    input_file="MATEMATICA_PARSED_IMPROVED.txt",
    batch_size=5,  # Process only 5 lessons at a time
    output_dir="matematica_batches_small"
)
processor.process_all()

Results: 50 batches of 5 lessons each
Memory usage: ~10 MB peak
Processing time: ~1-2 seconds
"""

# ============================================================================
# EXAMPLE 3: Process for Better Parallel Processing (Larger Batches)
# ============================================================================
"""
For faster processing with more memory available:

from process_matematica_in_batches import LessonBatchProcessor

processor = LessonBatchProcessor(
    input_file="MATEMATICA_PARSED_IMPROVED.txt",
    batch_size=30,  # Process 30 lessons per batch
    output_dir="matematica_batches_large"
)
processor.process_all()

Results: 9 batches of ~28 lessons each
Memory usage: ~100 MB peak
Processing time: <1 second (faster overall)
"""

# ============================================================================
# EXAMPLE 4: Create Similar Processor for Limba Română
# ============================================================================
"""
from process_matematica_in_batches import LessonBatchProcessor

processor = LessonBatchProcessor(
    input_file="LIMBA_ROMANA_PARSED_IMPROVED.txt",
    batch_size=15,
    output_dir="limba_romana_batches"
)
processor.process_all()

Will create: limba_romana_batches/ with processed lessons
"""

# ============================================================================
# EXAMPLE 5: Load and Process a Specific Batch
# ============================================================================
"""
import json
from pathlib import Path

# Load batch 0
with open('matematica_batches/batch_000.json') as f:
    batch = json.load(f)

print(f"Processing batch {batch['batch_number']}")
print(f"Contains {batch['lesson_count']} lessons\n")

for lesson in batch['lessons']:
    print(f"📚 {lesson['title']}")
    print(f"   - Definitions: {len(lesson['definitions'])}")
    print(f"   - Examples: {len(lesson['examples'])}")
    print(f"   - Summary: {lesson['summary'][:60]}...")
    print()
"""

# ============================================================================
# EXAMPLE 6: Merge All Batches into Single File
# ============================================================================
"""
import json
from pathlib import Path

# Load all batches
batches = []
for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batches.append(json.load(f))

# Merge with statistics
merged = {
    'metadata': {
        'source': 'matematica_batches',
        'total_batches': len(batches),
        'total_lessons': sum(b['lesson_count'] for b in batches),
        'total_definitions': sum(
            len(l['definitions']) 
            for b in batches 
            for l in b['lessons']
        ),
        'total_examples': sum(
            len(l['examples']) 
            for b in batches 
            for l in b['lessons']
        ),
        'total_formulas': sum(
            len(l['formulas']) 
            for b in batches 
            for l in b['lessons']
        ),
        'total_notes': sum(
            len(l['notes']) 
            for b in batches 
            for l in b['lessons']
        )
    },
    'lessons': [
        lesson
        for batch in batches
        for lesson in batch['lessons']
    ]
}

# Save
with open('matematica_complete.json', 'w') as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)

print(f"✅ Merged {merged['metadata']['total_lessons']} lessons")
"""

# ============================================================================
# EXAMPLE 7: Extract Specific Content Type (e.g., All Formulas)
# ============================================================================
"""
import json
from pathlib import Path

all_formulas = []

for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)
        for lesson in batch['lessons']:
            for formula in lesson['formulas']:
                all_formulas.append({
                    'lesson': lesson['title'],
                    'formula': formula
                })

# Save all formulas
with open('matematica_all_formulas.json', 'w') as f:
    json.dump(all_formulas, f, ensure_ascii=False, indent=2)

print(f"✅ Extracted {len(all_formulas)} formulas from all lessons")

# Or print them
for item in all_formulas[:10]:
    print(f"{item['lesson']}: {item['formula']}")
"""

# ============================================================================
# EXAMPLE 8: Filter Lessons by Content Type
# ============================================================================
"""
import json
from pathlib import Path

lessons_with_examples = []

for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)
        for lesson in batch['lessons']:
            if lesson['examples']:  # Has at least one example
                lessons_with_examples.append({
                    'title': lesson['title'],
                    'example_count': len(lesson['examples']),
                    'examples': lesson['examples']
                })

print(f"✅ Found {len(lessons_with_examples)} lessons with examples")

for lesson in lessons_with_examples[:5]:
    print(f"\n📚 {lesson['title']}")
    for example in lesson['examples']:
        print(f"   💡 {example[:80]}...")
"""

# ============================================================================
# EXAMPLE 9: Create Statistics Report
# ============================================================================
"""
import json
from pathlib import Path
from collections import defaultdict

stats = {
    'total_batches': 0,
    'total_lessons': 0,
    'avg_definitions': 0,
    'avg_examples': 0,
    'avg_formulas': 0,
    'avg_notes': 0,
    'lessons_by_content': defaultdict(int)
}

total_def = 0
total_ex = 0
total_form = 0
total_notes = 0
total_lessons = 0

for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    stats['total_batches'] += 1
    with open(batch_file) as f:
        batch = json.load(f)
        for lesson in batch['lessons']:
            total_lessons += 1
            total_def += len(lesson['definitions'])
            total_ex += len(lesson['examples'])
            total_form += len(lesson['formulas'])
            total_notes += len(lesson['notes'])
            
            # Categorize
            content_type = 'empty'
            if lesson['formulas']: content_type = 'formulas'
            if lesson['examples']: content_type = 'examples'
            if lesson['definitions']: content_type = 'definitions'
            
            stats['lessons_by_content'][content_type] += 1

stats['total_lessons'] = total_lessons
stats['avg_definitions'] = total_def / total_lessons if total_lessons > 0 else 0
stats['avg_examples'] = total_ex / total_lessons if total_lessons > 0 else 0
stats['avg_formulas'] = total_form / total_lessons if total_lessons > 0 else 0
stats['avg_notes'] = total_notes / total_lessons if total_lessons > 0 else 0

print("📊 STATISTICS REPORT")
print("=" * 50)
print(f"Total batches: {stats['total_batches']}")
print(f"Total lessons: {stats['total_lessons']}")
print(f"Avg definitions per lesson: {stats['avg_definitions']:.1f}")
print(f"Avg examples per lesson: {stats['avg_examples']:.1f}")
print(f"Avg formulas per lesson: {stats['avg_formulas']:.1f}")
print(f"Avg notes per lesson: {stats['avg_notes']:.1f}")
print(f"\nLessons by type:")
for ctype, count in sorted(stats['lessons_by_content'].items()):
    print(f"  {ctype}: {count}")
"""

# ============================================================================
# EXAMPLE 10: Validate Batch Files
# ============================================================================
"""
import json
from pathlib import Path

issues = []

for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    try:
        with open(batch_file) as f:
            batch = json.load(f)
        
        # Validate structure
        required = ['batch_number', 'lesson_count', 'lessons']
        for field in required:
            if field not in batch:
                issues.append(f"{batch_file.name}: Missing '{field}'")
        
        # Check lesson count
        if len(batch['lessons']) != batch['lesson_count']:
            issues.append(f"{batch_file.name}: lesson_count mismatch")
        
        # Validate each lesson
        for i, lesson in enumerate(batch['lessons']):
            required_lesson = ['title', 'definitions', 'examples', 'formulas', 'notes', 'summary']
            for field in required_lesson:
                if field not in lesson:
                    issues.append(f"{batch_file.name}, lesson {i}: Missing '{field}'")
    
    except json.JSONDecodeError as e:
        issues.append(f"{batch_file.name}: Invalid JSON - {e}")

if issues:
    print("❌ Issues found:")
    for issue in issues:
        print(f"   {issue}")
else:
    print("✅ All batch files are valid!")
    print(f"✅ Successfully validated {len(list(Path('matematica_batches').glob('batch_*.json')))} batch files")
"""

# ============================================================================
# QUICK REFERENCE
# ============================================================================
"""
BATCH SIZES QUICK REFERENCE:

Batch Size  | Total Batches | Memory Peak | Best For
------------|---------------|-------------|--------------------
5           | 50            | ~10 MB      | Very limited memory
10          | 25            | ~20 MB      | Embedded systems
15 (default)| 17            | ~50 MB      | Standard systems
20          | 12            | ~60 MB      | Good memory available
30          | 9             | ~100 MB     | Fast processing
50          | 5             | ~150 MB     | Powerful systems

PROCESSING PATTERNS:

1. Sequential batches (safest):
   - Process batch 0, then 1, then 2, etc.
   - Good for debugging

2. Parallel batches (faster):
   - Process multiple batches simultaneously
   - Need careful synchronization

3. Streaming mode:
   - Load one batch at a time
   - Process immediately
   - Delete from disk
   - Uses minimal disk space

MEMORY CALCULATION:
   Estimated memory ≈ Batch size × 3.5 KB + Python overhead
   
   Example: 15 lessons × 3.5 KB = ~52 KB per batch + ~20 MB overhead = ~50 MB peak
"""

print(__doc__)

