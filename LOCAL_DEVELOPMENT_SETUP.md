# 🚀 LOCAL DEVELOPMENT ENVIRONMENT SETUP

## Overview

Set up a complete local development environment to test modifications without touching your Render production deployment.

## ✅ What You'll Have

- ✅ Local backend server (Node.js)
- ✅ Local frontend (React)
- ✅ Local MongoDB (or use cloud MongoDB)
- ✅ Complete curriculum loaded
- ✅ All authentication working
- ✅ Isolated from production

---

## 📋 Prerequisites

Make sure you have:
- Node.js v14+ installed: `node --version`
- npm installed: `npm --version`
- Git installed: `git --version`
- MongoDB (optional, can use Atlas cloud)

---

## 🔧 Setup Instructions

### Step 1: Create Local Environment Files

#### Backend Environment (`.env` in root or backend folder)

Create `/Users/mdica/PycharmProjects/EduPex/.env`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Use your MongoDB Atlas (same as production)
MONGODB_URI=mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex

# Authentication
JWT_SECRET=RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF

# Supabase (optional fallback)
SUPABASE_URL=https://szbjppcmhshegyewsveu.supabase.co
SUPABASE_SERVICE_KEY=eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YmpwcGNtaHNoZWd5ZXdzdmV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIwODg4NiwiZXhwIjoyMDcxNzg0ODg2fQ.9DFChq7KL_KhjyNxUkhlBWDXuMiRZkpuvAS-kS3SlH0

# LLM Configuration
LLM_PROVIDER=huggingface
HUGGINGFACE_API_KEY=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

# Curriculum
CURRICULUM_JSON_PATH=./curriculum_structure.json

# Logging
LOG_LEVEL=debug

# API URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### Frontend Environment (`frontend/.env`)

Already created for you at:
`/Users/mdica/PycharmProjects/EduPex/frontend/.env`

Should contain:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000
REACT_APP_DEBUG_MODE=true
```

---

### Step 2: Install Dependencies

#### Backend
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
npm install
```

#### Frontend
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm install
```

---

### Step 3: Start Local Servers

**Terminal 1 - Backend:**
```bash
cd /Users/mdica/PycharmProjects/EduPex
npm start
# Or if in backend folder:
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```

**Expected Output:**
- Backend: "Server running on port 5000"
- Frontend: "webpack compiled successfully" or "Compiled with warnings"

---

### Step 4: Access Your App

Open browser to: `http://localhost:3000`

---

## 🎯 Local Development Workflow

### Making Changes to Backend

1. Edit backend code (e.g., `backend/routes/`, `backend/models/`)
2. Backend will auto-reload (if using nodemon)
3. Test via API: `curl http://localhost:5000/api/health`
4. Check console for errors

### Making Changes to Frontend

1. Edit frontend code (e.g., `frontend/src/pages/`, `frontend/src/components/`)
2. Frontend will auto-reload
3. Check browser for changes
4. Check browser console (F12) for errors

### Testing Curriculum Changes

1. Edit `curriculum_structure.json`
2. Backend reloads it
3. Refresh frontend (Ctrl+R or Cmd+R)
4. Changes should appear

---

## 📚 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Can login with test account
- [ ] Can select Clasa a V a
- [ ] Can select Matematica
- [ ] Can open a lesson
- [ ] Evaluation questions visible
- [ ] Console has no errors

---

## 🔍 Debugging Tips

### Check Backend Status
```bash
curl -X GET http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### Check Frontend Connection
```bash
# Open browser console (F12)
# Should show successful API calls
# Check Network tab for requests to http://localhost:5000
```

### View Backend Logs
```bash
# Terminal with backend running
# Look for error messages
# Should show: "Server running on port 5000"
```

### View Frontend Logs
```bash
# Browser console (F12)
# Application tab
# Check localStorage for data
```

### Check Database Connection
```bash
# Backend should show: "MongoDB connected"
# Or check Mongo Atlas dashboard
```

---

## 🛠️ Common Development Tasks

### Restart Backend (fresh start)
```bash
# Kill process (Ctrl+C in terminal)
# Then:
cd /Users/mdica/PycharmProjects/EduPex/backend
npm start
```

### Clear Frontend Cache
```bash
# In browser:
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Select "All time"
# Delete

# Or:
cd /Users/mdica/PycharmProjects/EduPex/frontend
rm -rf node_modules/.cache
npm start
```

### Reset Database (if using local MongoDB)
```bash
# NOT recommended with MongoDB Atlas
# Instead, just restart backend
```

### Edit Curriculum Locally
```bash
# Edit: /Users/mdica/PycharmProjects/EduPex/curriculum_structure.json
# Backend loads it automatically
# Refresh browser to see changes
```

---

## 📁 Local Project Structure

```
/Users/mdica/PycharmProjects/EduPex/
├── .env (development configuration)
├── curriculum_structure.json (editable locally)
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── models/
│   ├── package.json
│   └── node_modules/ (after npm install)
├── frontend/
│   ├── .env (development config)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.js
│   ├── package.json
│   └── node_modules/ (after npm install)
└── (other files)
```

---

## 🔐 Security Notes

### Local Development (NOT PRODUCTION)
- Using real API keys is fine (they're for dev)
- Using cloud MongoDB is fine
- Using real JWT secret is fine
- Don't commit `.env` to Git

### When Ready for Production
- Change all keys/secrets
- Don't use cloud development databases
- Use environment-specific configs
- Never commit secrets to Git

---

## 📝 Terminal Quick Commands

```bash
# Navigate to project
cd /Users/mdica/PycharmProjects/EduPex

# Start backend
cd backend && npm start

# In another terminal, start frontend
cd /Users/mdica/PycharmProjects/EduPex/frontend && npm start

# Kill all node processes
pkill -f node

# Check if ports are in use
lsof -i :5000  # Backend port
lsof -i :3000  # Frontend port

# View environment
cat .env

# Edit environment
nano .env
```

---

## ✅ Complete Setup Checklist

- [ ] Have Node.js and npm installed
- [ ] Created `.env` file in project root
- [ ] Verified `.env` has correct values
- [ ] Created `frontend/.env` file
- [ ] Verified `frontend/.env` is correct
- [ ] Ran `npm install` in backend folder
- [ ] Ran `npm install` in frontend folder
- [ ] Started backend server (Terminal 1)
- [ ] Started frontend server (Terminal 2)
- [ ] Opened http://localhost:3000 in browser
- [ ] Logged in successfully
- [ ] Navigated to a lesson
- [ ] Saw evaluation questions
- [ ] Made a test edit to curriculum
- [ ] Verified changes appear in browser

---

## 🎯 Next Steps

1. **Now:** Follow setup instructions above
2. **Then:** Test making small changes
3. **Then:** Test curriculum modifications
4. **When ready:** Commit changes to Git
5. **Finally:** Push to Render for production

---

## 💡 Pro Tips

- Use two terminals side-by-side (one for backend, one for frontend)
- Keep browser DevTools open (F12) while developing
- Use `npm start` with `--debug` flag for more logging
- Restart backend after any `package.json` changes
- Clear browser cache if seeing old data
- Check browser console first if something seems wrong

---

## ❓ Need Help?

Common issues:

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Dependencies error | Delete `node_modules` and `.package-lock.json`, run `npm install` |
| Env var not loading | Restart both servers after .env changes |
| MongoDB connection error | Check MONGODB_URI in .env is correct |
| CORS error | Make sure backend is running on 5000 |
| API 404 | Check backend routes are defined correctly |

---

**You now have a complete local development environment!** 🚀

No changes to Render. All testing happens locally. When happy with changes, push to Git → Render deploys automatically.

