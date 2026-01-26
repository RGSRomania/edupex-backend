#!/bin/bash
# 🚀 BATCH PROCESSING QUICK REFERENCE
# ====================================
# Copy and paste these commands to process your files

# =============================================================================
# QUICK START (Most Common Use Cases)
# =============================================================================

# 1. Process Matematica with default settings (ALREADY DONE)
cd /Users/mdica/PycharmProjects/EduPex
python3 process_matematica_in_batches.py
# Result: matematica_batches/ (17 files, 248 lessons)

# 2. Process with custom batch size
python3 universal_batch_processor.py MATEMATICA_PARSED_IMPROVED.txt -b 20
# Result: matematica_batches_v2/ (13 files, 20 items each)

# 3. Process Limba Română (when you have the parsed file)
python3 universal_batch_processor.py LIMBA_ROMANA_PARSED_IMPROVED.txt -b 15 -o limba_batches
# Result: limba_batches/ (various batch files)

# 4. Merge all batches into one file
python3 universal_batch_processor.py matematica_batches --merge -o matematica_complete.json
# Result: matematica_complete.json (248 lessons in one file)

# =============================================================================
# BATCH SIZE QUICK REFERENCE
# =============================================================================

# Very Limited Memory (Phones, embedded systems)
python3 universal_batch_processor.py file.txt -b 5

# Standard Laptop
python3 universal_batch_processor.py file.txt -b 15

# Good Memory Desktop
python3 universal_batch_processor.py file.txt -b 30

# High-End Systems
python3 universal_batch_processor.py file.txt -b 50

# =============================================================================
# CUSTOM DELIMITER PATTERNS
# =============================================================================

# Match "LESSON X:" format (default)
python3 universal_batch_processor.py file.txt -p "^LESSON\s+\d+" -t regex

# Match "Chapter X:" format
python3 universal_batch_processor.py file.txt -p "^Chapter\s+\d+" -t regex

# Match "Unit X:" format
python3 universal_batch_processor.py file.txt -p "^Unit\s+\d+" -t regex

# Match exact string
python3 universal_batch_processor.py file.txt -p "SECTION" -t exact

# Match lines starting with
python3 universal_batch_processor.py file.txt -p "TOPIC:" -t startswith

# =============================================================================
# VIEW YOUR RESULTS
# =============================================================================

# List all batch files
ls -la matematica_batches/

# Count batches
ls matematica_batches/*.json | wc -l

# View one batch
cat matematica_batches/batch_000.json | python3 -m json.tool | head -50

# View batch statistics
python3 << 'EOF'
import json
from pathlib import Path

for batch_file in sorted(Path('matematica_batches').glob('batch_000.json')):
    with open(batch_file) as f:
        batch = json.load(f)
    print(f"Batch {batch['batch_number']}: {batch['lesson_count']} lessons")
    for lesson in batch['lessons'][:2]:
        print(f"  - {lesson['title']}")
EOF

# =============================================================================
# WORKING WITH BATCHES
# =============================================================================

# Extract all lesson titles from batch 0
python3 << 'EOF'
import json
with open('matematica_batches/batch_000.json') as f:
    batch = json.load(f)
for lesson in batch['lessons']:
    print(lesson['title'])
EOF

# Count total lessons across all batches
python3 << 'EOF'
import json
from pathlib import Path

total = 0
for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)
    total += batch['lesson_count']
print(f"Total lessons: {total}")
EOF

# Export all lesson titles to text file
python3 << 'EOF'
import json
from pathlib import Path

with open('all_lesson_titles.txt', 'w') as out:
    for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
        with open(batch_file) as f:
            batch = json.load(f)
        for lesson in batch['lessons']:
            out.write(lesson['title'] + '\n')
EOF

# =============================================================================
# MERGE AND COMBINE BATCHES
# =============================================================================

# Merge using universal processor
python3 universal_batch_processor.py matematica_batches --merge -o matematica_complete.json

# Manual merge with Python
python3 << 'EOF'
import json
from pathlib import Path

items = []
for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)
        # Add lessons from batch
        for lesson in batch['lessons']:
            items.append(lesson)

with open('matematica_complete.json', 'w') as f:
    json.dump({'lessons': items}, f, ensure_ascii=False, indent=2)

print(f"Merged {len(items)} items")
EOF

# =============================================================================
# PROCESS MULTIPLE FILES
# =============================================================================

# Process all parsed files in directory
for file in MATEMATICA_PARSED*.txt LIMBA_ROMANA_PARSED*.txt; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        python3 universal_batch_processor.py "$file" -b 15
    fi
done

# =============================================================================
# MEMORY-CONSTRAINED SYSTEMS
# =============================================================================

# Process in tiny batches (5 items)
python3 universal_batch_processor.py large_file.txt -b 5

# Process in streaming mode (load one batch, process, delete)
python3 << 'EOF'
import json
from pathlib import Path
import os

batch_dir = Path('matematica_batches')
for batch_file in sorted(batch_dir.glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)

    # Process batch
    print(f"Processing {batch_file.name}...")

    # Your processing code here

    # Optional: delete after processing to save disk space
    # os.remove(batch_file)
EOF

# =============================================================================
# VALIDATION & CHECKING
# =============================================================================

# Validate all batch files
python3 << 'EOF'
import json
from pathlib import Path

errors = 0
for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    try:
        with open(batch_file) as f:
            json.load(f)
        print(f"✅ {batch_file.name}")
    except json.JSONDecodeError as e:
        print(f"❌ {batch_file.name}: {e}")
        errors += 1

if errors == 0:
    print(f"\n✅ All batch files valid!")
else:
    print(f"\n❌ Found {errors} errors")
EOF

# Check file sizes
du -sh matematica_batches/*

# =============================================================================
# INTEGRATION WITH YOUR SYSTEM
# =============================================================================

# After batch processing, integrate into curriculum
python3 << 'EOF'
import json
from pathlib import Path

# Load curriculum structure
with open('curriculum_structure.json') as f:
    curriculum = json.load(f)

# Load processed batches
lessons_by_title = {}
for batch_file in sorted(Path('matematica_batches').glob('batch_*.json')):
    with open(batch_file) as f:
        batch = json.load(f)
    for lesson in batch['lessons']:
        lessons_by_title[lesson['title']] = lesson

# Update curriculum with processed lessons
# ... your integration code here ...

print(f"Ready to integrate {len(lessons_by_title)} processed lessons")
EOF

# =============================================================================
# HELP & INFO
# =============================================================================

# Get help for universal processor
python3 universal_batch_processor.py --help

# Show Python examples
python3 BATCH_PROCESSOR_USAGE_EXAMPLES.py

# Read documentation
cat BATCH_PROCESSING_SYSTEM_GUIDE.md

# =============================================================================
# TROUBLESHOOTING
# =============================================================================

# If batches not created:
# 1. Check input file exists
ls -la MATEMATICA_PARSED_IMPROVED.txt

# 2. Check delimiter pattern matches your file
head -10 MATEMATICA_PARSED_IMPROVED.txt

# 3. Try with verbose mode
python3 -u universal_batch_processor.py file.txt -b 15

# If batch files are corrupted:
# 1. Delete problematic batch directory
rm -rf matematica_batches_broken

# 2. Reprocess from source file
python3 universal_batch_processor.py MATEMATICA_PARSED_IMPROVED.txt

# =============================================================================
# CHEAT SHEET SUMMARY
# =============================================================================

# Most common command:
cd /Users/mdica/PycharmProjects/EduPex && \
python3 universal_batch_processor.py INPUT_FILE.txt -b 15 -o output_dir

# With options:
# -b : batch size (default 15)
# -o : output directory (default input_file_batches)
# -p : delimiter pattern (default "^(LESSON|Lecția|Chapter|Capitolul)")
# -t : pattern type: regex|exact|startswith (default regex)

# =============================================================================

echo "✅ Batch processing system ready to use!"
echo "📖 See BATCH_PROCESSING_SYSTEM_GUIDE.md for more details"

