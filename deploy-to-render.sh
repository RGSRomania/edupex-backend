#!/bin/bash

# EduPex Backend - Quick Deploy to Render
# This script helps you deploy your backend to Render with HTTPS

set -e

echo "=========================================="
echo "EduPex Backend - Render Deployment Helper"
echo "=========================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from backend directory"
    echo "Usage: cd backend && ./deploy-to-render.sh"
    exit 1
fi

echo "✅ Backend directory confirmed"
echo ""

# Check if Git is initialized
if [ ! -d "../.git" ]; then
    echo "📦 Git not initialized. Setting up Git repository..."
    cd ..
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository found"
fi

cd ..

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Environment files
.env
.env.*
!.env.example

# Node modules
node_modules/

# Logs
*.log

# OS files
.DS_Store

# Build files
build/
dist/

# Keystore files
*.keystore
keystore.properties
EOF
    echo "✅ .gitignore created"
else
    echo "✅ .gitignore exists"
fi

# Add all files
echo ""
echo "📦 Adding files to Git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Prepare backend for Render deployment" || echo "No changes to commit"

echo ""
echo "=========================================="
echo "✅ Repository Prepared!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1️⃣  Push to GitHub:"
echo "   • Go to: https://github.com/new"
echo "   • Create a new repository named 'EduPex'"
echo "   • Then run:"
echo "     git remote add origin https://github.com/YOUR_USERNAME/EduPex.git"
echo "     git branch -M main"
echo "     git push -u origin main"
echo ""
echo "2️⃣  Deploy to Render:"
echo "   • Go to: https://render.com"
echo "   • Sign up (free)"
echo "   • Click 'New +' → 'Web Service'"
echo "   • Connect your GitHub repository"
echo "   • Configure:"
echo "     - Name: edupex-backend"
echo "     - Root Directory: backend"
echo "     - Build Command: npm install"
echo "     - Start Command: npm start"
echo ""
echo "3️⃣  Add Environment Variables in Render:"
echo "   Copy these from backend/.env:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_KEY"
echo "   - LLM_PROVIDER"
echo "   - GROQ_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - JWT_SECRET"
echo ""
echo "4️⃣  After deployment, you'll get a URL like:"
echo "   https://edupex-backend.onrender.com"
echo ""
echo "5️⃣  Update frontend .env.production with your URL:"
echo "   REACT_APP_API_URL=https://edupex-backend.onrender.com/api"
echo ""
echo "=========================================="
echo ""

