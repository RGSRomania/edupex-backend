# 🚀 GETTING STARTED - LOCAL DEVELOPMENT

**Everything is ready!** Just follow these simple steps.

---

## ⚡ QUICKEST START (Copy & Paste)

### Open Terminal and run:

```bash
cd /Users/mdica/PycharmProjects/EduPex && ./start-local-dev.sh
```

### Then:
1. Wait for both servers to start
2. Open browser: **http://localhost:3000**
3. Create an account
4. ✅ You're done!

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| MongoDB | ✅ Running | localhost:27017 |
| Backend | ✅ Running | localhost:5000 |
| Frontend | ⏳ Ready to start | npm start |
| Configuration | ✅ Complete | .env.local configured |
| Documentation | ✅ Complete | 5+ guide files created |

---

## 🎯 What You Get

✅ Frontend on **http://localhost:3000**
✅ Backend on **http://localhost:5000**  
✅ Local database (your data stays local)
✅ Can create accounts immediately
✅ Can test everything locally
✅ APK will use separate Render database

---

## 🔄 Three Ways to Start

### METHOD 1: One Command (EASIEST ⭐)
```bash
./start-local-dev.sh
```

### METHOD 2: Two Terminals
Terminal 1:
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
NODE_ENV=development npm start
```

Terminal 2:
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```

### METHOD 3: Three Terminals (Full Control)
Terminal 1: `mongod` (if needed)
Terminal 2: Backend with `NODE_ENV=development npm start`
Terminal 3: Frontend with `npm start`

---

## ✅ TEST IT

Once servers are running:

### Test Backend:
```bash
curl http://localhost:5000/api/health
```
Should show: `{"status":"healthy",...}`

### Create Account:
1. Open http://localhost:3000
2. Click "Create Account"
3. Fill in details:
   - Username: anything
   - Email: anything@example.com
   - Password: 6+ characters
   - Grade: 5-8
4. Click Create

### You should see:
✅ "Account created successfully"
✅ You can now login
✅ All data saved to LOCAL database

---

## 📍 IMPORTANT URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend (React App) |
| http://localhost:5000 | Backend API |
| http://localhost:5000/api/health | Check backend status |
| mongodb://localhost:27017 | Local MongoDB |

---

## 🎨 Architecture

```
YOUR MACHINE
├─ http://localhost:3000 (Frontend)
├─ http://localhost:5000 (Backend)
└─ MongoDB (localhost:27017)
   └─ Database: edupex

APK / PRODUCTION
├─ Mobile Device (APK)
├─ https://edupex-backend.onrender.com (Backend)
└─ Render MongoDB (Cloud)
   └─ Database: edupex (separate)
```

---

## 🔑 How It Works

### 1. You start the server:
```bash
NODE_ENV=development npm start
```

### 2. Backend loads `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/edupex
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend connects to local backend:
```
API calls go to: http://localhost:5000
```

### 4. Everything uses local database:
```
Data saved to: MongoDB (your machine)
```

### 5. APK uses completely different setup:
```
API calls go to: https://edupex-backend.onrender.com
Data saved to: Render MongoDB (cloud)
```

✅ **Zero interference between local and production!**

---

## 📚 Documentation

If you need more details:

- **Visual Summary:** `SETUP_COMPLETE_VISUAL_SUMMARY.md`
- **Quick Reference:** `QUICK_START_LOCAL_DEV.md`
- **Full Guide:** `LOCAL_DEV_COMPLETE_SUMMARY.md`
- **Detailed Setup:** `LOCAL_DEVELOPMENT_ENVIRONMENT_SETUP.md`
- **Architecture:** `ARCHITECTURE_LOCAL_VS_PRODUCTION.md`
- **Documentation Index:** `LOCAL_DEVELOPMENT_INDEX.md`

---

## 🆘 Issues?

### "Backend won't start"
```bash
# Kill any process on port 5000
lsof -ti:5000 | xargs kill -9
# Then try again
NODE_ENV=development npm start
```

### "Can't access localhost:3000"
```bash
# Make sure frontend is running
cd frontend
npm start
```

### "Account creation not working"
```bash
# Check backend is responding
curl http://localhost:5000/api/health
```

### "Data not saving"
```bash
# Check MongoDB is running
pgrep mongod
# If not running:
mongod
```

---

## ✨ NEXT STEPS

1. ✅ Run `./start-local-dev.sh`
2. ✅ Open `http://localhost:3000`
3. ✅ Create account to test
4. ✅ Explore the app locally
5. ✅ Make changes and test
6. ✅ When ready, build APK

---

## 🎉 YOU'RE READY!

Everything is configured and tested.

**Just run:**
```bash
./start-local-dev.sh
```

**And enjoy local development!** 🚀

---

**Questions?** Check the documentation files listed above.  
**Quick reference?** See `QUICK_START_LOCAL_DEV.md`  
**Everything explained?** See `LOCAL_DEV_COMPLETE_SUMMARY.md`

Happy coding! 😊

