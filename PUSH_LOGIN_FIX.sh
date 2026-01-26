#!/bin/bash

# Push Login Fix to edupex-backend Repository
cd /Users/mdica/PycharmProjects/EduPex/backend

echo "📝 Checking git status..."
git status

echo ""
echo "📦 Adding files..."
git add routes/userRoutes.js migrateUsers.js

echo ""
echo "💾 Committing changes..."
git commit -m "Fix: Login error - ensure all user fields exist before saving and add migration script"

echo ""
echo "🚀 Pushing to edupex-backend repository..."
git push origin main

echo ""
echo "✅ Push complete!"
echo ""
echo "🎉 Your changes have been pushed to:"
echo "   https://github.com/RGSRomania/edupex-backend"
echo ""
echo "📦 Render will automatically detect the push and deploy!"

