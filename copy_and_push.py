#!/usr/bin/env python3
import shutil
import os
import subprocess
import sys

# Paths
src = "/Users/mdica/PycharmProjects/EduPex/frontend/src/data/curriculum_structure.json"
backend_dir = "/Users/mdica/PycharmProjects/EduPex/backend"
dst = os.path.join(backend_dir, "curriculum_structure.json")

print("Step 1: Copying curriculum file...")
try:
    if not os.path.exists(src):
        print(f"ERROR: Source file not found: {src}")
        sys.exit(1)

    shutil.copy2(src, dst)
    print(f"✓ File copied successfully")
    print(f"  Size: {os.path.getsize(dst)} bytes")
except Exception as e:
    print(f"ERROR copying file: {e}")
    sys.exit(1)

print("\nStep 2: Configuring git...")
try:
    os.chdir(backend_dir)
    subprocess.run(["git", "config", "user.email", "admin@edupex.ro"], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "EduPex Admin"], check=True, capture_output=True)
    print("✓ Git configured")
except Exception as e:
    print(f"ERROR configuring git: {e}")
    sys.exit(1)

print("\nStep 3: Adding file to git...")
try:
    subprocess.run(["git", "add", "curriculum_structure.json"], check=True, capture_output=True)
    print("✓ File added")
except Exception as e:
    print(f"ERROR adding file: {e}")
    sys.exit(1)

print("\nStep 4: Committing...")
try:
    result = subprocess.run(["git", "commit", "-m", "Fix: Evaluation form questions with curriculum_structure.json"],
                          capture_output=True, text=True)
    if result.returncode == 0:
        print("✓ File committed")
    else:
        print("⚠ Nothing new to commit (already committed)")
except Exception as e:
    print(f"ERROR committing: {e}")
    sys.exit(1)

print("\nStep 5: Pushing to GitHub...")
try:
    subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
    print("✓ Pushed to GitHub")
except Exception as e:
    print(f"ERROR pushing: {e}")
    sys.exit(1)

print("\nStep 6: Verifying...")
try:
    result = subprocess.run(["git", "log", "--oneline", "-1"], capture_output=True, text=True)
    print(f"✓ Latest commit: {result.stdout.strip()}")
except Exception as e:
    print(f"ERROR verifying: {e}")
    sys.exit(1)

print("\n✅ All steps completed successfully!")

