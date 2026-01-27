# 🚀 LOCAL DEVELOPMENT - QUICK REFERENCE

## Start Local Development (One Command)
```bash
cd /Users/mdica/PycharmProjects/EduPex
./start-local-dev.sh
```

Then open: **http://localhost:3000**

---

## Or Start Manually

**Backend** (Terminal 1):
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
NODE_ENV=development npm start
```
✅ Runs on: http://localhost:5000
✅ Uses: Local MongoDB at mongodb://localhost:27017/edupex
✅ Loads: `.env.local` configuration

**Frontend** (Terminal 2):
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```
✅ Opens: http://localhost:3000
✅ Connects to: Local backend at http://localhost:5000

---

## ✅ Verify Everything Works

```bash
# Check MongoDB is running
pgrep mongod

# Check Backend
curl http://localhost:5000/api/health

# Create test account
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "gradeLevel":5
  }'

# Check database
mongosh
> use edupex
> db.users.find()
```

---

## 🎯 Key Points

| What | Where | Database |
|------|-------|----------|
| **Local Testing** | http://localhost:3000 | Local MongoDB |
| **APK Users** | Mobile Device | Render MongoDB |
| **Production** | https://edupex-render.com | Render MongoDB |

---

## 📁 Environment Files

- **`.env.local`** ← Used locally (NOT on GitHub)
- **`.env`** ← Defaults (on GitHub - safe)
- **`.env.production`** ← Production reference

---

## 🔑 Environment Variable

When starting backend, the key variable is:
```bash
NODE_ENV=development  # Loads .env.local
NODE_ENV=production   # Loads .env
```

---

## ❌ If Something Goes Wrong

```bash
# Kill any process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start fresh
./start-local-dev.sh
```

---

## 📍 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | For testing |
| Backend | http://localhost:5000 | API server |
| Backend Health | http://localhost:5000/api/health | Check if running |
| MongoDB | mongodb://localhost:27017 | Local database |

---

## 💡 Tips

✅ **First time?** Use `./start-local-dev.sh`
✅ **Developing?** Start in separate terminals for better logs
✅ **Testing API?** Use Postman or curl
✅ **Debugging?** Check browser console (Frontend) and terminal (Backend)
✅ **Fresh start?** Restart MongoDB: `brew services restart mongodb-community`

---

## ✨ That's It!

Your local development environment is ready to use.

Questions? Check:
- `LOCAL_DEVELOPMENT_ENVIRONMENT_SETUP.md` (detailed guide)
- `LOCAL_DEVELOPMENT_SETUP_COMPLETE.md` (full explanation)

Happy coding! 🎉

