🚀 DEPLOY FRONTEND TO RENDER.COM - STEP BY STEP
═══════════════════════════════════════════════════════════════════════════════

Why Render.com?
───────────────
✅ Same hosting as your backend
✅ Easy to manage from one dashboard
✅ Automatic deployments from GitHub
✅ Free tier available
✅ Easy CORS configuration
✅ Great performance

═══════════════════════════════════════════════════════════════════════════════

📋 STEP-BY-STEP FRONTEND DEPLOYMENT
═══════════════════════════════════════════════════════════════════════════════

STEP 1: Ensure Frontend Code is Ready
──────────────────────────────────────

Location: /Users/mdica/PycharmProjects/EduPex/frontend/
Repository: https://github.com/RGSRomania/edupex-frontend.git

✓ Frontend code exists locally
✓ Synced to GitHub
✓ Build folder ready: /frontend/build/

ACTION: Nothing to do - already ready!


STEP 2: Go to Render.com Dashboard
──────────────────────────────────

URL: https://dashboard.render.com
Login: Your Render.com account
Status: You should already have an account (for backend)


STEP 3: Create New Service for Frontend
───────────────────────────────────────

In Render Dashboard:

1. Click "New +" button (top right)
2. Select "Static Site"
   └─ This is for serving React static files
   └─ Perfect for frontend applications

3. If not connected, click "Connect GitHub"
   └─ Authorize Render to access your GitHub
   └─ Grant permissions for RGSRomania repositories

4. Select Repository:
   Name: edupex-backend (contains both frontend and backend)
   Owner: RGSRomania
   Note: The frontend is in the frontend/ folder of this repo


STEP 4: Configure Static Site Settings
──────────────────────────────────────

Set these values in Render:

Field: Build Command
Value: cd frontend && npm run build
Purpose: Builds the React app for production (from frontend folder)

Field: Publish Directory
Value: frontend/build
Purpose: The directory to serve (React build output from frontend folder)

Field: Environment Variables
Value: (Leave empty - not needed for frontend)
Note: Frontend .env is already configured

Field: Name (Auto-filled)
Value: edupex-frontend
Purpose: Your service name


STEP 5: Review and Deploy
─────────────────────────

Review Configuration:
  ✓ Repository: RGSRomania/edupex-frontend
  ✓ Build Command: npm run build
  ✓ Publish Directory: build
  ✓ Branch: main

Click: "Create Static Site"
Wait: Deployment to complete (2-3 minutes)
Monitor: Logs for any errors


STEP 6: Get Your Frontend URL
─────────────────────────────

After deployment completes:

Your Frontend URL will be:
https://edupex-frontend.onrender.com

(Render generates this automatically)

Note: This URL will be shown on your service page


STEP 7: Verify Frontend is Running
──────────────────────────────────

1. Visit: https://edupex-frontend.onrender.com
2. You should see:
   ✅ EduPex login page
   ✅ Navigation and UI loading
   ✅ No errors in console

If something is wrong:
  1. Go to Render dashboard
  2. Click on edupex-frontend service
  3. Go to "Logs" tab
  4. Check for build or runtime errors


STEP 8: Update Backend with Frontend URL
─────────────────────────────────────────

Now update your backend on Render:

1. Go to Render dashboard
2. Select: edupex-backend service
3. Go to: Environment tab
4. Find: FRONTEND_URL variable
5. Change from: [Your frontend domain]
6. Change to: https://edupex-frontend.onrender.com
7. Click: Save Changes
8. Click: Manual Deploy (to apply the change)

This allows your backend to accept requests from this frontend domain.


STEP 9: Test the Full Integration
─────────────────────────────────

Test in browser:

1. Go to: https://edupex-frontend.onrender.com
2. Try to login
3. Check that:
   ✅ API calls work
   ✅ Lessons load
   ✅ No CORS errors
   ✅ AI assistant responds

If you get CORS errors:
  └─ Go back to Step 8
  └─ Make sure FRONTEND_URL is set correctly on backend
  └─ Wait a few minutes for changes to take effect


═══════════════════════════════════════════════════════════════════════════════

🎯 SUMMARY TABLE

STEP    ACTION                          RESULT
────────────────────────────────────────────────────────────────────────
1       Verify frontend ready           ✅ Code ready
2       Login to Render.com             ✅ Dashboard open
3       Create new Static Site          ✅ Service created
4       Configure build settings        ✅ Configured
5       Deploy                          ✅ Deployment started
6       Get frontend URL                ✅ https://edupex-frontend.onrender.com
7       Verify frontend loads           ✅ Frontend running
8       Update backend FRONTEND_URL     ✅ Backend configured
9       Test full integration           ✅ Everything works

═══════════════════════════════════════════════════════════════════════════════

⚙️ DETAILED RENDER.COM CONFIGURATION

Build Command:
──────────────
npm run build

This command:
  1. Installs dependencies
  2. Compiles React code
  3. Optimizes for production
  4. Creates /build/ folder

Publish Directory:
──────────────────
build

This directory contains:
  1. index.html (main HTML file)
  2. Static JS and CSS files
  3. All assets and images
  4. Manifest and service worker


═══════════════════════════════════════════════════════════════════════════════

🔍 TROUBLESHOOTING

Problem: Build fails
─────────────────────
Check logs → Look for error messages
Common causes:
  • Node version mismatch
  • Missing dependencies
  • Environment variable issues
Solution: Check frontend/.env configuration


Problem: Frontend loads but API calls fail
──────────────────────────────────────────
Check CORS configuration
Solution:
  1. Ensure FRONTEND_URL is set on backend
  2. Backend must allow requests from frontend URL
  3. Wait a few minutes for changes to propagate


Problem: Pages are blank
────────────────────────
Check browser console for errors
Possible causes:
  • API endpoint incorrect
  • Missing curriculum data
Solution:
  1. Verify REACT_APP_API_URL points to backend
  2. Check that backend is running
  3. View browser console (F12 → Console tab)


═══════════════════════════════════════════════════════════════════════════════

📊 DEPLOYMENT CHECKLIST

Before Starting:
  ☐ Frontend code committed to GitHub
  ☐ Render.com account exists
  ☐ Backend is deployed on Render

During Deployment:
  ☐ Connected GitHub to Render
  ☐ Selected correct repository
  ☐ Set build command to: npm run build
  ☐ Set publish directory to: build
  ☐ Deployment completed successfully

After Deployment:
  ☐ Got frontend URL (edupex-frontend.onrender.com)
  ☐ Updated backend FRONTEND_URL variable
  ☐ Redeployed backend
  ☐ Verified frontend loads
  ☐ Tested API integration

═══════════════════════════════════════════════════════════════════════════════

✅ NEXT STEPS
═══════════════════════════════════════════════════════════════════════════════

1. Go to https://dashboard.render.com
2. Create new Static Site for frontend
3. Connect GitHub: RGSRomania/edupex-frontend
4. Set build command: npm run build
5. Set publish directory: build
6. Deploy!
7. Get your frontend URL
8. Update backend FRONTEND_URL
9. Test everything works!

═══════════════════════════════════════════════════════════════════════════════

🎉 YOUR COMPLETE DEPLOYMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════════

                          Render.com Dashboard
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            Frontend Service   Backend Service   Database
                    │              │              │
         edupex-    │     edupex-  │    MongoDB   │
         frontend   │     backend   │    (if used) │
         onrender   │     onrender  │              │
         .com       │     .com      │              │
                    │              │              │
         ┌──────────┴┐         ┌────┴──────────┐
         │ React App │         │ Node.js API  │
         │ Static    │◄────────┤ + Groq AI    │
         │ Files     │         │ + Auth       │
         └───────────┘         └──────────────┘
              │                       │
              └───────────┬───────────┘
                          │
                    CORS Enabled
                   (via FRONTEND_URL)

═══════════════════════════════════════════════════════════════════════════════

💡 FINAL NOTES
═══════════════════════════════════════════════════════════════════════════════

JWT_SECRET:
  Keep: RY7VCg2pK9XD8LqkwZfA4mH5tsBjE3QxNuP6JbTz1h0MUneSdF
  Use on: Both local and Render.com backend
  Reason: Secure and already in use

FRONTEND_URL:
  After deployment: https://edupex-frontend.onrender.com
  Where: Render.com backend environment variables
  Why: Allows CORS communication with frontend

Both Services on Render.com:
  ✅ Easy to manage
  ✅ CORS automatically configured
  ✅ Same dashboard
  ✅ Both have free tier
  ✅ Perfect setup for this project

═══════════════════════════════════════════════════════════════════════════════

You're ready to deploy! Start with Step 1. 🚀

═══════════════════════════════════════════════════════════════════════════════

