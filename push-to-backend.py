#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir('/Users/mdica/PycharmProjects/EduPex')

print("=" * 50)
print("PUSHING TO EDUPEX-BACKEND")
print("=" * 50)

try:
    # Check remote
    print("\n1. Checking remote configuration...")
    result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True, timeout=10)
    print(result.stdout)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")

    # Stage all changes
    print("2. Staging all changes...")
    result = subprocess.run(['git', 'add', '-A'], capture_output=True, text=True, timeout=10)
    print("✅ Changes staged")

    # Check status
    print("\n3. Checking status...")
    result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True, timeout=10)
    print(result.stdout)

    # Create commit
    print("4. Creating commit...")
    result = subprocess.run([
        'git', 'commit', '-m',
        'Fix: Evaluation form questions - Add curriculum to backend'
    ], capture_output=True, text=True, timeout=10)

    if result.returncode == 0:
        print("✅ Commit created")
    else:
        print(f"Status: {result.stdout}")

    # Check log
    print("\n5. Latest commits:")
    result = subprocess.run(['git', 'log', '--oneline', '-3'], capture_output=True, text=True, timeout=10)
    print(result.stdout)

    # Push to edupex-backend
    print("\n6. Pushing to edupex-backend repository...")
    result = subprocess.run(['git', 'push', '-u', 'origin', 'main', '--force'],
                          capture_output=True, text=True, timeout=30)

    print("STDOUT:")
    print(result.stdout)
    if result.stderr:
        print("STDERR:")
        print(result.stderr)

    if result.returncode == 0:
        print("\n✅ PUSH SUCCESSFUL!")
        print("Check: https://github.com/RGSRomania/edupex-backend")
        print("Render will auto-deploy in 2-5 minutes")
    else:
        print(f"\n❌ Push failed with code {result.returncode}")
        sys.exit(1)

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

print("\n" + "=" * 50)
print("DONE")
print("=" * 50)

