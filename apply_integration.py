#!/usr/bin/env python3
"""
Apply Integration - Update curriculum_structure.json with enriched content
"""

import json
import os
from datetime import datetime

def apply_integration():
    """Apply lesson matches to curriculum_structure.json"""

    print("\n" + "=" * 80)
    print("🔄 APPLYING LESSON INTEGRATION")
    print("=" * 80 + "\n")

    # Load files
    print("📖 Loading files...")
    with open('curriculum_structure.json', 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    with open('lesson_matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)

    print(f"✅ Loaded curriculum with {len(curriculum)} classes")
    print(f"✅ Loaded {len(matches)} lesson matches\n")

    # Apply matches to Clasa a V a > Matematica
    clasa_va = curriculum.get('Clasa a V a', {})
    matematica = clasa_va.get('Matematica', [])

    updated_count = 0

    # Iterate through chapters
    for chapter_idx, chapter in enumerate(matematica):
        chapter_num = chapter.get('number', '')

        # Iterate through lessons
        for lesson_idx, lesson in enumerate(chapter.get('lectii', [])):
            lesson_num = lesson.get('number', '')
            match_key = f"{chapter_num}_{lesson_num}"

            if match_key in matches:
                match_data = matches[match_key]

                # Update summary with enriched content
                old_summary = lesson.get('summary', '')
                new_summary = match_data.get('enriched_summary', '')

                if new_summary:
                    lesson['summary'] = new_summary
                    updated_count += 1

                    print(f"✅ Updated Chapter {chapter_num}, Lesson {lesson_num}")
                    print(f"   Title: {match_data['curriculum_name'][:50]}...")
                    print(f"   Page: {match_data['page']}")
                    print(f"   Summary length: {len(new_summary)} chars")
                    print()

    print("=" * 80)
    print(f"✅ Updated {updated_count} lessons\n")

    # Create backup
    backup_file = f"curriculum_structure.json.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    print(f"💾 Creating backup: {backup_file}")
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)
    print(f"✅ Backup created\n")

    # Save updated curriculum
    print("💾 Saving updated curriculum_structure.json...")
    with open('curriculum_structure.json', 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)

    print("✅ curriculum_structure.json updated\n")

    print("=" * 80)
    print("🎯 NEXT STEPS:")
    print("=" * 80)
    print("""
1. TEST IN WEB INTERFACE:
   $ npm start
   - Navigate to localhost:3000/lessons
   - Click on a Matematica lesson
   - Verify enriched content displays

2. TEST IN MOBILE APP:
   - Rebuild APK: npm run build-apk
   - Install on emulator
   - Test lesson display

3. COMMIT & PUSH:
   $ git add curriculum_structure.json
   $ git commit -m "feat: Enhance Matematica lessons with extracted content"
   $ git push origin main

4. DEPLOY:
   - Push to edupex-backend on Render
   - Verify lessons display
   - Monitor for any issues

5. VERIFY ON PRODUCTION:
   - Test on live website
   - Test on mobile app
   - Confirm all lessons visible
""")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    try:
        apply_integration()
        print("✅ INTEGRATION APPLIED SUCCESSFULLY!\n")
    except Exception as e:
        print(f"\n❌ Error during integration: {e}\n")
        raise

