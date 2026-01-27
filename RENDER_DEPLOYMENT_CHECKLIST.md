📌 QUICK REFERENCE: RENDER DEPLOYMENT CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

BACKEND DEPLOYMENT (Web Service)
─────────────────────────────────
Repository:        RGSRomania/edupex-backend
Branch:            main
Start Command:     npm start
Environment Vars:  ✅ ADD THESE 9:
                   ☐ NODE_ENV=production
                   ☐ GROQ_API_KEY=<YOUR_GROQ_API_KEY_HERE>
                   ☐ GROQ_MODEL=llama-3.3-70b-versatile
                   ☐ LLM_PROVIDER=groq
                   ☐ JWT_SECRET=<YOUR_JWT_SECRET_HERE>
                   ☐ MONGODB_URI=[Your MongoDB URI]
                   ☐ CURRICULUM_JSON_PATH=./curriculum_structure.json
                   ☐ LOG_LEVEL=info
                   ☐ FRONTEND_URL=https://edupex-frontend.onrender.com

FRONTEND DEPLOYMENT (Static Site)
──────────────────────────────────
Repository:        RGSRomania/edupex-backend
Branch:            main
Build Command:     cd frontend && npm run build
Publish Directory: frontend/build
Environment Vars:  ❌ DON'T ADD ANY!
                   (Leave environment variables empty)

═══════════════════════════════════════════════════════════════════════════════

WHY DIFFERENT?

BACKEND                           FRONTEND
────────────────────────────────────────────
Needs Variables at RUNTIME        Needs Variables at BUILD TIME
Read from Render dashboard        Read from frontend/.env
Can change without rebuild        Must rebuild to change
Server accesses at startup        Built into static files

═══════════════════════════════════════════════════════════════════════════════

FRONTEND .env FILE ALREADY HAS:

✅ CI=false
✅ GENERATE_SOURCEMAP=false
✅ REACT_APP_CURRICULUM_SOURCE=local
✅ REACT_APP_DEBUG_MODE=false
✅ REACT_APP_ENABLE_NOTIFICATIONS=true
✅ REACT_APP_ENABLE_OFFLINE_MODE=true
✅ REACT_APP_API_TIMEOUT=30000
✅ REACT_APP_API_URL=https://edupex-backend.onrender.com/api

All Ready! No Changes Needed!

═══════════════════════════════════════════════════════════════════════════════

FINAL ANSWER: Frontend = NO environment variables on Render! ✅

═══════════════════════════════════════════════════════════════════════════════

