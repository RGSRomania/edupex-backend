#!/bin/bash
set -e

# Change to backend directory
cd /Users/mdica/PycharmProjects/EduPex/backend

# Copy curriculum file
echo "Copying curriculum file..."
cp /Users/mdica/PycharmProjects/EduPex/frontend/src/data/curriculum_structure.json ./curriculum_structure.json
echo "✓ File copied"

# Configure git
echo "Configuring git..."
git config user.email "admin@edupex.ro"
git config user.name "EduPex Admin"

# Add file
echo "Adding to git..."
git add curriculum_structure.json

# Commit
echo "Committing..."
git commit -m "Fix: Evaluation form questions with curriculum_structure.json" || echo "Nothing new to commit"

# Push
echo "Pushing to GitHub..."
git push origin main

echo "✓ Done!"
git log --oneline -1

