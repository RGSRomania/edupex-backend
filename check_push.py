#!/usr/bin/env python3
import subprocess
import os

os.chdir('/Users/mdica/PycharmProjects/EduPex/backend')

# Check git status
result = subprocess.run(['git', 'status'], capture_output=True, text=True)
print("=== Git Status ===")
print(result.stdout)
print(result.stderr)

# Check git log
result = subprocess.run(['git', 'log', '--oneline'], capture_output=True, text=True)
print("\n=== Git Log ===")
print(result.stdout)
print(result.stderr)

# Check remote
result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
print("\n=== Git Remote ===")
print(result.stdout)
print(result.stderr)

# Push to GitHub
print("\n=== Pushing to GitHub ===")
result = subprocess.run(['git', 'push', '-f', 'origin', 'main'], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
print("Push complete!")

