# 🏗️ ARCHITECTURE - LOCAL vs PRODUCTION

## LOCAL DEVELOPMENT ENVIRONMENT

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR MACHINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐           ┌──────────────────────┐    │
│  │  http://localhost│           │  http://localhost    │    │
│  │  :3000           │────────────│  :5000               │    │
│  │                  │           │  (Backend)           │    │
│  │  FRONTEND        │  Requests │                      │    │
│  │  (React App)     │  ◄────────│  NODE_ENV=develop   │    │
│  │                  │  Responses│  Loads: .env.local   │    │
│  └──────────────────┘           │                      │    │
│         │                        │  ┌─────────────────┐│    │
│         │                        │  │ .env.local      ││    │
│         │                        │  │                 ││    │
│         │                        │  │ MONGODB_URI=    ││    │
│         │                        │  │ localhost:27017 ││    │
│         │                        │  │ GROQ_API_KEY=   ││    │
│         │                        │  │ <real key>      ││    │
│         │                        │  │ PORT=5000       ││    │
│         │                        │  └─────────────────┘│    │
│         │                        │                      │    │
│         │                        └──────────────────────┘    │
│         │                                  │                 │
│         │                      mongodb://localhost:27017    │
│         │                                  │                 │
│         │                        ┌─────────▼─────────┐      │
│         │                        │  LOCAL MONGODB    │      │
│         │                        │  (Running on Mac) │      │
│         │                        │                   │      │
│         │                        │  Database:        │      │
│         │                        │  edupex           │      │
│         │                        │                   │      │
│         │                        │  Collections:     │      │
│         │                        │  - users          │      │
│         │                        │  - lessons        │      │
│         │                        │  - progress       │      │
│         └────────────────────────┘                   │      │
│              (All data stays here - LOCAL)           │      │
│                                                       │      │
│            ✅ Safe for development & testing         │      │
│            ✅ No impact on APK users                │      │
│                                                       │      │
│                  YOU CAN CREATE ACCOUNTS             │      │
│                   AND TEST EVERYTHING!               │      │
│                                                      │      │
└──────────────────────────────────────────────────────┘      │
```

---

## APK / PRODUCTION ENVIRONMENT

```
┌──────────────────────────────────────────────────────────────┐
│                      RENDER.COM (Cloud)                       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────┐      │
│  │  https://edupex-backend.onrender.com               │      │
│  │                                                     │      │
│  │  Backend Service                                   │      │
│  │  NODE_ENV=production                              │      │
│  │                                                     │      │
│  │  ┌──────────────────────────────────────────────┐ │      │
│  │  │ Environment Variables (Set in Render)        │ │      │
│  │  │                                              │ │      │
│  │  │ MONGODB_URI= Render's MongoDB cluster       │ │      │
│  │  │ GROQ_API_KEY= (Set in Render dashboard)    │ │      │
│  │  │ JWT_SECRET= (Set in Render)                │ │      │
│  │  │ PORT= (Assigned by Render)                 │ │      │
│  │  └──────────────────────────────────────────────┘ │      │
│  └────────────────────────────────────────────────────┘      │
│                             │                                  │
│          ┌──────────────────▼─────────────────────┐           │
│          │  Render MongoDB Cluster (Cloud)        │           │
│          │                                        │           │
│          │  Database: edupex                      │           │
│          │  (Separate from local)                 │           │
│          │                                        │           │
│          │  ✅ Accessible only from APK          │           │
│          │  ✅ Automatically backed up            │           │
│          │  ✅ Secure & private                  │           │
│          └────────────────────────────────────────┘           │
│                                                                │
│                                                                │
│  ┌────────────────────────────────┐                           │
│  │  USER'S DEVICE (Mobile)        │                           │
│  │  ┌──────────────────────────┐  │                           │
│  │  │  EduPex APK              │  │                           │
│  │  │  (React Native App)      │  │                           │
│  │  │                          │  │                           │
│  │  │  Connects to:            │  │                           │
│  │  │  https://edupex-        │  │                           │
│  │  │  backend.onrender.com   │  │                           │
│  │  └──────────────────────────┘  │                           │
│  │                                 │                           │
│  │  User creates account          │                           │
│  │  Data saved to Render MongoDB  │                           │
│  └────────────────────────────────┘                           │
│           │                                                    │
│           ▼ (HTTPS)                                            │
│           ├─────────────────────────────────────────────┐     │
│           └──────────────────────►(Already shown above)      │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## SIDE BY SIDE COMPARISON

```
┌────────────────────────────────┬────────────────────────────────┐
│     LOCAL DEVELOPMENT          │      PRODUCTION (APK)          │
├────────────────────────────────┼────────────────────────────────┤
│ Frontend: localhost:3000       │ Frontend: Mobile Device        │
│ Backend:  localhost:5000       │ Backend:  Render.com           │
│ Database: MongoDB (localhost)  │ Database: Render's MongoDB     │
│                                │                                │
│ Configuration: .env.local      │ Config: Render Dashboard       │
│ Set by: NODE_ENV=development   │ Set by: Environment Variables │
│                                │                                │
│ Data: ALL LOCAL (your machine) │ Data: CLOUD (accessible only) │
│                                │ to APK                         │
│ Access: Only you (localhost)   │ Access: APK users + cloud      │
│                                │                                │
│ Network: Not needed            │ Network: HTTPS encryption      │
│ (Everything on your machine)   │                                │
│                                │                                │
│ Cost: Free (your computer)     │ Cost: Render.com charges       │
│                                │ (pay-as-you-go)               │
│                                │                                │
│ Restart: Manual                │ Restart: Automatic (Render)   │
│                                │                                │
│ Logs: Terminal on your machine │ Logs: Render dashboard         │
│                                │                                │
│ Backup: Your responsibility    │ Backup: Render automatic       │
│                                │                                │
│ Security: Not critical         │ Security: CRITICAL             │
│ (test data only)               │ (user data)                    │
└────────────────────────────────┴────────────────────────────────┘
```

---

## DATA FLOW COMPARISON

### LOCAL (Development)
```
You Type in Browser (localhost:3000)
      ↓
Frontend (React) on localhost:3000
      ↓
Sends HTTPS request to http://localhost:5000
      ↓
Backend (Node.js) on localhost:5000
      ↓
Reads from .env.local
      ↓
Connects to MongoDB (your machine, port 27017)
      ↓
Saves/Retrieves Data (stays on your machine)
      ↓
Returns response to Frontend
      ↓
You see results in Browser
```

### PRODUCTION (APK)
```
User Opens APK on Phone
      ↓
APK (React Native) app
      ↓
Sends HTTPS request to https://edupex-backend.onrender.com
      ↓
Backend (Node.js) on Render.com
      ↓
Reads from Render Environment Variables
      ↓
Connects to Render's MongoDB Cluster (Cloud)
      ↓
Saves/Retrieves Data (stored in cloud)
      ↓
Returns response to APK
      ↓
User sees results on Phone Screen
```

---

## KEY POINTS

✅ **Completely Separated**
- Local data stays on your machine
- Cloud data stays on Render's servers
- They never interfere with each other

✅ **Easy to Switch**
- Just change `NODE_ENV` environment variable
- Or modify backend URL in APK config

✅ **Perfect for Development**
- Test locally without worrying about production
- Create dummy accounts, test features
- Delete and restart as needed

✅ **Safe for Users**
- APK users get real production setup
- Their data is secure and persistent
- Not affected by your local testing

---

## HOW ENVIRONMENT FILES CONTROL THIS

```javascript
// In server.js:

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

// When NODE_ENV=development (localhost):
// ├─ Loads .env.local
// ├─ Connects to mongodb://localhost:27017/edupex
// └─ Uses http://localhost:5000

// When NODE_ENV=production (Render):
// ├─ Loads .env (placeholders, actual values from Render)
// ├─ Connects to Render's MongoDB
// └─ Uses https://edupex-backend.onrender.com
```

---

## SUMMARY

Your setup is perfect for:
1. ✅ **Developing locally** - Use localhost
2. ✅ **Testing thoroughly** - Use local MongoDB
3. ✅ **Building APK** - Use Render backend
4. ✅ **Deploying safely** - Different databases

Everything is separated and working independently!

