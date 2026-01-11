#!/usr/bin/env python3
import subprocess
import os
import sys

output_file = '/tmp/git_complete_status.txt'

with open(output_file, 'w') as f:
    os.chdir('/Users/mdica/PycharmProjects/EduPex/backend')

    f.write("=== STEP 1: Check Git Status ===\n")
    result = subprocess.run(['git', 'status'], capture_output=True, text=True, cwd='/Users/mdica/PycharmProjects/EduPex/backend')
    f.write(result.stdout)
    f.write(result.stderr)

    f.write("\n\n=== STEP 2: Check Git Log ===\n")
    result = subprocess.run(['git', 'log', '--oneline', '-5'], capture_output=True, text=True, cwd='/Users/mdica/PycharmProjects/EduPex/backend')
    f.write(result.stdout)
    f.write(result.stderr)

    f.write("\n\n=== STEP 3: Check Git Remote ===\n")
    result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True, cwd='/Users/mdica/PycharmProjects/EduPex/backend')
    f.write(result.stdout)
    f.write(result.stderr)

    f.write("\n\n=== STEP 4: Force Push to GitHub ===\n")
    result = subprocess.run(['git', 'push', '-f', 'origin', 'main'], capture_output=True, text=True, cwd='/Users/mdica/PycharmProjects/EduPex/backend', timeout=30)
    f.write("STDOUT:\n")
    f.write(result.stdout)
    f.write("\nSTDERR:\n")
    f.write(result.stderr)
    f.write(f"\nReturn Code: {result.returncode}\n")

    f.write("\n\n=== STEP 5: Verify Push with GitHub API ===\n")
    try:
        import urllib.request
        import json
        req = urllib.request.Request('https://api.github.com/repos/RGSRomania/edupex-backend')
        req.add_header('Accept', 'application/vnd.github.v3+json')
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            f.write(f"Last Push: {data.get('pushed_at', 'N/A')}\n")
            f.write(f"Default Branch: {data.get('default_branch', 'N/A')}\n")
    except Exception as e:
        f.write(f"Error checking API: {e}\n")

print("Status written to /tmp/git_complete_status.txt")

