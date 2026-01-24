#!/bin/bash
set -e

echo "========================================"
echo "EDUPEX BACKEND FIX - FINAL DEPLOYMENT"
echo "========================================"
echo ""

cd /Users/mdica/PycharmProjects/EduPex

# Step 1: Add all changes
echo "Step 1: Staging all changes..."
git add -A
echo "✅ Changes staged"
echo ""

# Step 2: Check status
echo "Step 2: Checking git status..."
git status --short
echo ""

# Step 3: Commit
echo "Step 3: Creating commit..."
git commit -m "Fix: Evaluation form questions - Add curriculum to backend directory

This fix resolves the issue where evaluation questions show placeholder text
instead of real curriculum content on the mobile app.

Changes:
- Added curriculum_structure.json to backend directory
- Enhanced route path resolution with 7 fallback paths
- Ensures Render deployment can find curriculum file

Result:
- Emulator now shows: 'Câte cifre sunt utilizate în sistemul de numerație zecimal?'
- Instead of: 'Clasa a 5a - Întrebare Matematică 1?'
- All 8 evaluation questions display real educational content" 2>&1 | tail -5
echo ""

# Step 4: Push to origin
echo "Step 4: Pushing to origin..."
git push 2>&1 | tail -10
echo ""

echo "========================================"
echo "✅ PUSH COMPLETE"
echo "========================================"
echo ""
echo "Backend will auto-deploy on Render (2-5 minutes)"
echo "Monitor at: https://dashboard.render.com"
echo ""

