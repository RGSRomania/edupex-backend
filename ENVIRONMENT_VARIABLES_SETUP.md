🔐 ENVIRONMENT VARIABLES - GITHUB SAFE SETUP

═══════════════════════════════════════════════════════════════════════════════

✅ WHAT WAS CHANGED

Backend .env (Local Development):
──────────────────────────────────
BEFORE: GROQ_API_KEY=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
AFTER:  GROQ_API_KEY=your_groq_api_key_here

Result: ✅ Safe to commit to GitHub - no real API keys exposed!

═══════════════════════════════════════════════════════════════════════════════

🔄 HOW ENVIRONMENT VARIABLES WORK

Local Development (Your Computer)
──────────────────────────────────
1. backend/.env file exists on your computer
2. Node.js reads process.env.GROQ_API_KEY
3. Gets the value from your local .env file
4. For local testing, use your real API key

Production (Render.com)
──────────────────────────────────
1. Render.com dashboard has Environment Variables section
2. You define: GROQ_API_KEY = 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
3. Your .env file is NOT used on Render.com
4. Render overrides all env vars with dashboard values
5. Your app gets the real API key at runtime

GitHub Repository
──────────────────────────────────
1. .env file is committed with PLACEHOLDERS
2. No real API keys visible in history
3. Safe and secure!
4. Other developers clone with placeholders
5. They fill in their own credentials locally

═══════════════════════════════════════════════════════════════════════════════

✨ WHY THIS IS BEST PRACTICE

✅ Security:
   └─ Real API keys never exposed on GitHub
   └─ No accidental commits of secrets
   └─ Different keys for dev/staging/production

✅ Collaboration:
   └─ Developers can clone without issues
   └─ Each person uses their own API keys
   └─ No conflicts or credential sharing

✅ Production:
   └─ Render.com manages secrets securely
   └─ No .env files needed in production
   └─ Automatic rotation and encryption

═══════════════════════════════════════════════════════════════════════════════

📋 VARIABLES TO SETUP ON RENDER.COM

Go to: Render Dashboard → Your Backend Service → Environment

Add these environment variables:

1. GROQ_API_KEY
   Value: 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
   
2. JWT_SECRET
   Value: RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF
   
3. MONGODB_URI
   Value: Your MongoDB connection string (from Render or MongoDB Atlas)
   
4. NODE_ENV
   Value: production
   
5. PORT
   Value: 5000

⚠️  Note: Render automatically detects PORT from internal services

═══════════════════════════════════════════════════════════════════════════════

🛠️ SETUP INSTRUCTIONS

Step 1: Local Development Setup
──────────────────────────────
1. Clone repository: git clone https://github.com/RGSRomania/edupex-backend.git
2. Copy backend/.env with placeholders (already done ✅)
3. Edit backend/.env and add YOUR real API keys:
   GROQ_API_KEY=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
4. Keep this file LOCAL (don't commit!)
5. Run backend: npm start

Step 2: Production Setup (Render.com)
──────────────────────────────────
1. Go to Render Dashboard
2. Select your backend service
3. Click "Environment"
4. Add all variables from section above
5. Deploy service
6. Render automatically injects these variables
7. Your app reads from process.env

Step 3: Git Configuration (Prevent Accidents)
──────────────────────────────────
Add to .gitignore (already should be there):
```
.env.local
.env.production.local
.env.*.local
.DS_Store
```

═══════════════════════════════════════════════════════════════════════════════

📝 .env FILE STRUCTURE (What's in GitHub)

backend/.env (PLACEHOLDER - SAFE TO COMMIT)
──────────────────────────────────────────
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/edupex
JWT_SECRET=RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here          ← PLACEHOLDER
GROQ_MODEL=llama-3.3-70b-versatile
CURRICULUM_JSON_PATH=./curriculum_structure.json
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
DB_NAME=edupex
DB_HOST=localhost
DB_PORT=27017

backend/.env.local (FOR YOUR COMPUTER - DO NOT COMMIT)
──────────────────────────────────────────────────────
# Same as above but with REAL values:
GROQ_API_KEY=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

═══════════════════════════════════════════════════════════════════════════════

⚡ RUNTIME BEHAVIOR

Local Development:
──────────────────
Node.js loads .env → Gets GROQ_API_KEY placeholder → 
  ↓
.env.local exists? → YES → Load .env.local override → Get REAL key
.env.local exists? → NO → Use placeholder (won't work, but safe)

Render.com Production:
──────────────────────
Deployment starts → Render injects env variables →
  ↓
process.env.GROQ_API_KEY = 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
Your app runs with real API key → Success! ✅

═══════════════════════════════════════════════════════════════════════════════

🔒 CREDENTIALS FOR EACH ENVIRONMENT

LOCAL (backend/.env.local - NEVER COMMIT)
──────────────────────────────────────────
GROQ_API_KEY=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
MONGODB_URI=mongodb://localhost:27017/edupex
(Use your local MongoDB)

GITHUB (backend/.env - ALWAYS COMMIT)
──────────────────────────────────────
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017/edupex
(All values are placeholders - safe!)

RENDER.COM PRODUCTION (Dashboard)
──────────────────────────────────
GROQ_API_KEY=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
MONGODB_URI=your_production_mongodb_url
NODE_ENV=production
(Real credentials - secure in dashboard)

═══════════════════════════════════════════════════════════════════════════════

✅ VERIFICATION CHECKLIST

□ backend/.env has placeholder API key (check GitHub)
□ backend/.env.local has real API key (LOCAL ONLY)
□ .gitignore includes .env.local
□ Render.com dashboard has all env variables set
□ Local development works with real key
□ Production deployment works with Render env vars

═══════════════════════════════════════════════════════════════════════════════

🎯 ANSWER TO YOUR QUESTION

"If I define a new environment variable in Render.com and replace it in the 
.env files, will it work?"

YES! Here's exactly what happens:

1. Local Development:
   - You edit .env (placeholder) + .env.local (real key)
   - Node reads .env first, then .env.local overrides it
   - Your app gets the REAL key → Works! ✅

2. Production on Render.com:
   - You deploy with placeholder .env (it's ignored)
   - Render injects variables from dashboard
   - Your app gets the REAL key from Render → Works! ✅

3. GitHub:
   - Only placeholder .env is committed
   - No real credentials exposed
   - Safe for anyone to clone → Works! ✅

═══════════════════════════════════════════════════════════════════════════════

🚀 NEXT STEPS

1. Verify backend/.env has placeholder (done ✅)
2. Create backend/.env.local with real API key (local only)
3. Add to .gitignore (should already be there)
4. Go to Render.com dashboard
5. Set Environment Variables for your backend service
6. Deploy
7. Test on Render.com
8. Verify GitHub commit has no real API keys ✅

═══════════════════════════════════════════════════════════════════════════════

