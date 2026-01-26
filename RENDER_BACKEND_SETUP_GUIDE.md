# Render Backend Setup - Environment Configuration Guide

## Overview
Your backend is deployed on Render (https://render.com). This guide explains how to configure the environment variables properly.

## Files Created

### 1. `.env.backend` (Local Development)
Location: `/Users/mdica/PycharmProjects/EduPex/.env.backend`

This file contains:
- Database: MongoDB Atlas connection
- Authentication: JWT secret
- Supabase: Fallback database
- LLM: AI provider configuration
- API settings

### 2. `frontend/.env` (Frontend Configuration)
Location: `/Users/mdica/PycharmProjects/EduPex/frontend/.env`

This file contains:
- API URL: Points to backend
- Feature flags: Enable/disable features
- Debug settings

## Local Development Setup

### Step 1: Copy Environment Variables
```bash
# Backend environment
cd /Users/mdica/PycharmProjects/EduPex
cp .env.backend .env  # For local testing
# OR
export $(cat .env.backend | grep -v '^#' | xargs)
```

### Step 2: Start Backend Locally
```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
# Frontend will run on http://localhost:3000
```

## Render Production Setup

### Step 1: Set Environment Variables on Render

Go to your Render dashboard → Your Backend Service → Environment

Add these variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
JWT_SECRET=RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF
SUPABASE_URL=https://szbjppcmhshegyewsveu.supabase.co
SUPABASE_SERVICE_KEY=eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YmpwcGNtaHNoZWd5ZXdzdmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIwODg4NiwiZXhwIjoyMDcxNzg0ODg2fQ.9DFChq7KL_KhjyNxUkhlBWDXuMiRZkpuvAS-kS3SlH0
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=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
OPENAI_API_KEY=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
CURRICULUM_JSON_PATH=./curriculum_structure.json
LOG_LEVEL=info
FRONTEND_URL=https://edupex.vercel.app  # Or your frontend URL
BACKEND_URL=https://edupex-backend.onrender.com
```

### Step 2: Update Frontend for Production
Create `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://edupex-backend.onrender.com
REACT_APP_API_TIMEOUT=30000
REACT_APP_DEBUG_MODE=false
```

### Step 3: Deploy to Render
```bash
# In your edupex-backend repository
git add .
git commit -m "Add environment configuration"
git push origin main

# Render will automatically deploy
# Check deployment status in Render dashboard
```

## Important: Curriculum File

The `curriculum_structure.json` file needs to be:

1. **In the backend repository root** (edupex-backend)
2. **Copied during deployment** to Render
3. **Served via API** to the frontend

### Option 1: Copy to Backend Repository
```bash
cp /Users/mdica/PycharmProjects/EduPex/curriculum_structure.json \
   /path/to/edupex-backend/curriculum_structure.json

cd /path/to/edupex-backend
git add curriculum_structure.json
git commit -m "Add curriculum structure"
git push origin main
```

### Option 2: Serve from API
Your backend should expose the curriculum:
```javascript
// In your backend server
app.get('/api/curriculum', (req, res) => {
  const curriculum = require('./curriculum_structure.json');
  res.json(curriculum);
});
```

## Testing the Setup

### Local Testing
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm start

# Browser
http://localhost:3000
```

### Production Testing
```bash
# After pushing to GitHub and deploying to Render:
# https://edupex-backend.onrender.com/api/curriculum
# Should return your curriculum JSON
```

## Troubleshooting

### Problem: Backend not loading curriculum
**Solution:**
1. Check if curriculum_structure.json is in backend folder
2. Verify path in CURRICULUM_JSON_PATH
3. Restart backend service on Render

### Problem: Frontend can't connect to backend
**Solution:**
1. Check REACT_APP_API_URL in frontend/.env
2. Verify backend is running on Render
3. Check CORS settings in backend

### Problem: MongoDB connection error
**Solution:**
1. Verify MONGODB_URI is correct
2. Check IP whitelist on MongoDB Atlas
3. Ensure credentials haven't changed

## Files Summary

```
Project Root:
  ├── .env (main development)
  ├── .env.backend (backend reference)
  ├── curriculum_structure.json (MOVED to backend)
  │
  ├── frontend/
  │   ├── .env (frontend development)
  │   └── .env.production (frontend production)
  │
  └── backend/
      ├── curriculum_structure.json (copy here)
      └── (other backend files)
```

## Next Steps

1. ✅ Created `.env.backend` with all backend variables
2. ✅ Created `frontend/.env` with frontend configuration
3. **TODO:** Copy curriculum_structure.json to backend repository
4. **TODO:** Update Render environment variables
5. **TODO:** Deploy and test

Let me know when you're ready and I can help with the next steps!

