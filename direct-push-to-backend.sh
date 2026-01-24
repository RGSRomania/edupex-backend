#!/bin/bash

# DIRECT PUSH TO EDUPEX-BACKEND
cd /Users/mdica/PycharmProjects/EduPex

echo "========================================="
echo "PUSHING TO EDUPEX-BACKEND REPOSITORY"
echo "========================================="
echo ""

# Check current remote
echo "Current remote configuration:"
git remote -v
echo ""

# Stage all changes
echo "Staging changes..."
git add -A
echo "Status:"
git status --short
echo ""

# Create commit
echo "Creating commit..."
git commit -m "Fix: Evaluation form questions - Add curriculum to backend

- Added curriculum_structure.json to backend directory (903 KB)
- Enhanced backend route with 7 fallback paths for curriculum file
- Changed git remote to edupex-backend
- Fixes evaluation questions showing placeholder text instead of real curriculum

Expected result:
- Emulator will show real questions like 'Câte cifre sunt utilizate în sistemul de numerație zecimal?'
- Instead of placeholder 'Clasa a 5a - Întrebare Matematică 1?'
- All 8 evaluation questions will display proper educational content"

echo ""
echo "Latest commits:"
git log --oneline -3
echo ""

# Push to edupex-backend
echo "Pushing to https://github.com/RGSRomania/edupex-backend.git..."
git push -u origin main --force

echo ""
echo "========================================="
echo "✅ PUSH COMPLETE"
echo "========================================="
echo ""
echo "Check Render dashboard: https://dashboard.render.com"
echo "GitHub edupex-backend: https://github.com/RGSRomania/edupex-backend"
echo ""
echo "Deployment should start automatically in a few seconds."

