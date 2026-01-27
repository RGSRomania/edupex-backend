# Local Development Environment Setup - Complete Guide

## ✅ Current Status
- ✅ Backend server running on `http://localhost:5000`
- ✅ MongoDB running locally on `mongodb://localhost:27017/edupex`
- ✅ Frontend accessible on `http://localhost:3000`
- ✅ Account creation working with local database
- ✅ `.env.local` configured with local credentials

---

## 📋 Environment Configuration

### What Was Set Up:

**1. `.env.local` (Local Development)**
- Location: `/backend/.env.local`
- Contains: Local MongoDB URI, local API URLs, and real API keys for testing
- This file is **NOT committed to GitHub** (protected by `.gitignore`)
- Used when: `NODE_ENV=development` (default on localhost)

**2. `.env` (Default/Fallback)**
- Location: `/backend/.env`
- Contains: Production-ready placeholders
- Used when: `NODE_ENV=production`

**3. `.env.production` (Render Deployment)**
- Location: `/backend/.env.production`
- Contains: Render environment variables
- Used when: Deployed to Render.com

### Server Configuration Updated:
The `server.js` file now intelligently loads the correct environment file:
```javascript
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });
```

---

## 🚀 How to Use

### For Local Testing (http://localhost:3000):

**Start MongoDB (if not running):**
```bash
mongod
```

**Start Backend Server:**
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
NODE_ENV=development npm start
```
This will:
- Load `.env.local` configuration
- Connect to local MongoDB at `mongodb://localhost:27017/edupex`
- Use local API URLs: `http://localhost:5000`

**Start Frontend:**
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```
This will open `http://localhost:3000` in your browser.

### For Building APK (Uses Render.com):

When building the APK, it will:
1. Use the backend URL from `frontend/.env.production` or similar
2. Connect to `https://edupex-backend.onrender.com` (Render deployment)
3. Use the Render environment variables for API keys and database

---

## 📊 Environment Variables Summary

| Variable | Local (.env.local) | Production (.env) | Purpose |
|----------|------------------|------------------|---------|
| `NODE_ENV` | `development` | `production` | Environment type |
| `MONGODB_URI` | `mongodb://localhost:27017/edupex` | Would be Render's MongoDB | Database connection |
| `PORT` | `5000` | `3000` (Render assigns) | Backend port |
| `JWT_SECRET` | Set (for local testing) | Set (changed in Render) | Token signing |
| `GROQ_API_KEY` | Real key in `.env.local` | Placeholder in `.env` | AI Assistant API |
| `FRONTEND_URL` | `http://localhost:3000` | Render frontend domain | CORS allowed origin |
| `BACKEND_URL` | `http://localhost:5000` | `https://edupex-backend.onrender.com` | Backend API URL |

---

## 🔒 Security Notes

### `.env.local` (Local Only):
- ✅ Contains REAL API keys for local testing
- ✅ Protected by `.gitignore` - won't be committed
- ✅ Safe to use on your machine
- ✅ Should NEVER be shared or pushed to GitHub

### `.env` (GitHub Safe):
- ✅ Contains only placeholders
- ✅ Safe to commit to GitHub
- ✅ Should NOT contain real API keys
- ✅ Production uses different environment variables

### `.env.production` (Render Dashboard):
- ✅ Real values set only in Render.com dashboard
- ✅ Not visible in GitHub repository
- ✅ Kept secret in Render environment

---

## ✅ Testing Checklist

- [ ] MongoDB is running: `pgrep mongod`
- [ ] Backend starts successfully: `NODE_ENV=development npm start`
- [ ] API responds: `curl http://localhost:5000/api/health`
- [ ] Can create account on `http://localhost:3000`
- [ ] User data saved to local MongoDB
- [ ] Login works with created account
- [ ] Can access lessons and lessons
- [ ] AI Assistant uses Groq API (in `.env.local`)

---

## 🔄 Workflow Summary

### Local Development Loop:
1. Edit code (frontend or backend)
2. Backend auto-reloads (if using nodemon)
3. Frontend auto-reloads (React dev server)
4. Test on `http://localhost:3000`
5. Uses local MongoDB for persistence

### For APK Release:
1. Build frontend with production env vars
2. Build APK with Render backend URL
3. APK connects to `https://edupex-backend.onrender.com`
4. Uses Render's MongoDB and API keys

---

## 📝 File Locations Reference

```
/Users/mdica/PycharmProjects/EduPex/
├── backend/
│   ├── .env                    ← Defaults (GitHub safe)
│   ├── .env.local             ← Local development (NOT on GitHub)
│   ├── .env.production        ← Production reference
│   ├── .gitignore             ← Protects .env.local
│   └── server.js              ← Updated to load correct env
├── frontend/
│   └── package.json           ← Uses backend at localhost:5000
└── curriculum_structure.json  ← Shared data file
```

---

## 🆘 Troubleshooting

### "Cannot create account" Error:
1. Check MongoDB is running: `pgrep mongod`
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check `.env.local` exists: `ls -la backend/.env.local`
4. Restart backend with `NODE_ENV=development npm start`

### "Wrong database being used" Error:
1. Verify `NODE_ENV=development` is set
2. Check `.env.local` has local MongoDB URI
3. Confirm MongoDB on localhost is running
4. Check logs show: "Loading environment from: .env.local"

### Database persistence not working:
1. Verify MongoDB is running on port 27017
2. Check MongoDB data folder exists and has write permissions
3. Verify `MONGODB_URI=mongodb://localhost:27017/edupex` in `.env.local`

---

## ✨ What's Different Now

### Before:
- Backend might load wrong environment variables
- Unclear which database was being used
- Hard to differentiate local vs production setup

### After:
- Backend intelligently loads `.env.local` for development
- Clear logging shows which environment file is loaded
- Explicit separation between local and production configs
- Easy to test locally before deploying to Render

---

## 🎯 Next Steps

1. ✅ Local development environment is ready
2. Test account creation on `http://localhost:3000`
3. Test lessons, progress tracking, and AI assistant locally
4. When ready for APK: Build with production environment variables
5. APK will use Render backend automatically


