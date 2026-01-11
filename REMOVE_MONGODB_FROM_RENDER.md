# Instructions to Remove MONGODB_URI from Render

Render still has MONGODB_URI configured in its environment variables, which is causing the connection attempt.

## Quick Fix - Remove MongoDB URI from Render

1. Go to: https://dashboard.render.com
2. Click on your **edupex-backend** service
3. Click the **"Environment"** tab
4. Look for **MONGODB_URI** variable
5. Click the **trash/delete icon** next to it
6. Click **"Save"**
7. Render will auto-redeploy without MongoDB

---

If you don't see MONGODB_URI in the environment variables, it might be set in:
- The `render.yaml` file (check `/backend/render.yaml`)
- Or as a secret variable

Check the `render.yaml` file and look for:
```yaml
envVars:
  - key: MONGODB_URI
```

If found, remove that entire block and push the changes to GitHub.


