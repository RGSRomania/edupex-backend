# 🔄 Force Redeploy on Render

The code has been pushed to GitHub, but Render needs to redeploy to pick up the changes.

## Option 1: Manual Redeploy (Recommended)

1. Go to: https://dashboard.render.com
2. Click on your **edupex-backend** service
3. Click the **"Deployments"** tab
4. Click the **"Clear build cache and deploy"** button (or just **"Deploy"** button)
5. Wait for the deployment to complete (check the logs)
6. Once deployment shows "Deploy successful", test the API

---

## Option 2: Trigger via Push

Push an empty commit to trigger redeploy:
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
git commit --allow-empty -m "Trigger redeploy on Render"
git push origin main
```

Then Render will auto-detect and redeploy within 1-2 minutes.

---

## What Changed in the Code

✅ `/backend/server.js` - Added `/api` endpoint  
✅ `/backend/render.yaml` - Removed MONGODB_URI  
✅ Various documentation files  

## After Redeploy, Test:

```bash
curl https://edupex-backend.onrender.com/api/
```

Should return JSON with `"status": "healthy"`


