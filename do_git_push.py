#!/usr/bin/env python3
import shutil
import os
import subprocess
import sys

# Copy curriculum file from frontend to backend
src_file = '/Users/mdica/PycharmProjects/EduPex/frontend/src/data/curriculum_structure.json'
dest_file = '/Users/mdica/PycharmProjects/EduPex/backend/curriculum_structure.json'

print(f"Copying {src_file}")
print(f"To {dest_file}")

try:
    shutil.copy2(src_file, dest_file)
    print("✓ File copied successfully")
except Exception as e:
    print(f"✗ Copy failed: {e}")
    sys.exit(1)

# Change to backend directory
os.chdir('/Users/mdica/PycharmProjects/EduPex/backend')

# Add the file
print("\nAdding curriculum_structure.json to git...")
result = subprocess.run(['git', 'add', 'curriculum_structure.json'], capture_output=True, text=True)
if result.returncode != 0:
    print(f"✗ git add failed: {result.stderr}")
    sys.exit(1)
print("✓ File added to git")

# Check git status
print("\nGit status:")
result = subprocess.run(['git', 'status'], capture_output=True, text=True)
print(result.stdout)

# Commit
print("\nCommitting...")
result = subprocess.run(['git', 'commit', '-m', 'Fix: Evaluation form questions with curriculum_structure.json'], capture_output=True, text=True)
if result.returncode != 0:
    if 'nothing to commit' in result.stdout or 'nothing to commit' in result.stderr:
        print("✓ Nothing new to commit (file might already be committed)")
    else:
        print(f"✗ Commit failed: {result.stderr}")
        sys.exit(1)
else:
    print("✓ Commit successful")
    print(result.stdout)

# Push to origin
print("\nPushing to GitHub...")
result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True, timeout=30)
if result.returncode != 0:
    print(f"✗ Push failed: {result.stderr}")
    sys.exit(1)

print("✓ Push successful!")
print(result.stdout)

# Verify
print("\nVerifying...")
result = subprocess.run(['git', 'log', '--oneline', '-1'], capture_output=True, text=True)
print(f"Latest commit:\n{result.stdout}")

print("\n✅ All done! Check GitHub in a few seconds.")

