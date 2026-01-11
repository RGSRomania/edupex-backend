#!/usr/bin/env python3
import subprocess
import os

os.chdir('/Users/mdica/PycharmProjects/EduPex/backend')

print("1. Checking git status...")
result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
print(f"Modified files:\n{result.stdout}")

print("\n2. Adding all files...")
subprocess.run(['git', 'add', '-A'], capture_output=True)

print("3. Creating commit...")
result = subprocess.run(['git', 'commit', '-m', 'Fix: Add proper API health endpoints and remove MongoDB'],
                       capture_output=True, text=True)
print(result.stdout)
print(result.stderr)

print("\n4. Checking HEAD...")
result = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True)
print(f"Current HEAD: {result.stdout.strip()}")

print("\n5. Pushing to GitHub...")
result = subprocess.run(['git', 'push', 'origin', 'main', '--force'],
                       capture_output=True, text=True, timeout=30)
print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("Return code:", result.returncode)

print("\n✅ Done!")

