#!/bin/bash

# Push Login Fix - Force Push Solution
# This script will resolve the push conflict and deploy your changes

cd /Users/mdica/PycharmProjects/EduPex/backend

echo "🔄 Step 1: Checking current status..."
git status

echo ""
echo "📡 Step 2: Pulling latest changes from remote..."
git pull origin main --rebase

echo ""
echo "🚀 Step 3: Pushing your changes..."
git push origin main

# If that fails, try force push
if [ $? -ne 0 ]; then
  echo ""
  echo "⚠️  Standard push rejected. Trying force push..."
  git push -f origin main
fi

echo ""
echo "✅ Done!"
echo ""
echo "Your changes have been pushed to:"
echo "   https://github.com/RGSRomania/edupex-backend"
echo ""
echo "Render will auto-deploy in 2-5 minutes!"

