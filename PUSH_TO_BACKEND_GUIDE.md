# PUSH TO EDUPEX-BACKEND & CLEANUP GUIDE

## Current Status
You have:
1. ✅ Fixed evaluation form code in EduPex folder
2. ❌ Wrong remote (pointing to old EduPex repo on GitHub)
3. ❌ Need to push to edupex-backend instead

## Solution (3 Steps)

### Step 1: Change Remote to edupex-backend

```bash
cd /Users/mdica/PycharmProjects/EduPex

# Remove old remote
git remote remove origin

# Add correct backend remote (use your edupex-backend repo URL)
git remote add origin https://github.com/YOUR_USERNAME/edupex-backend.git

# Verify
git remote -v
```

### Step 2: Push the Evaluation Form Fix

```bash
# Push to edupex-backend
git push -u origin main
```

This will push:
- ✅ `backend/curriculum_structure.json` (903 KB curriculum file)
- ✅ `backend/routes/userRoutes.js` (enhanced path resolution)
- ✅ All documentation

### Step 3: Cleanup - Delete Old EduPex Repo

```bash
# Optional: Back up if needed
# No need to - just delete the folder

rm -rf /Users/mdica/PycharmProjects/EduPex
```

Then create a symlink to the backend repo:
```bash
cd /Users/mdica/PycharmProjects
git clone https://github.com/YOUR_USERNAME/edupex-backend.git
```

---

## Manual Steps (If Above Doesn't Work)

### Step 1: Check Current Remote
```bash
cd /Users/mdica/PycharmProjects/EduPex
git remote -v
```

### Step 2: Update Remote
```bash
# If origin exists
git remote set-url origin https://github.com/YOUR_USERNAME/edupex-backend.git

# If origin doesn't exist
git remote add origin https://github.com/YOUR_USERNAME/edupex-backend.git
```

### Step 3: Push
```bash
git push -u origin main
```

---

## Important URLs You'll Need

**edupex-backend Repo URL**: 
Get this from your GitHub account under edupex-backend repository

Example: `https://github.com/YOUR_USERNAME/edupex-backend.git`

---

## Quick Bash Script

Create a file: `/Users/mdica/push-to-backend.sh`

```bash
#!/bin/bash
set -e

BACKEND_REPO_URL="https://github.com/YOUR_USERNAME/edupex-backend.git"
PROJECT_PATH="/Users/mdica/PycharmProjects/EduPex"

cd "$PROJECT_PATH"

echo "Updating remote to edupex-backend..."
git remote set-url origin "$BACKEND_REPO_URL" 2>/dev/null || git remote add origin "$BACKEND_REPO_URL"

echo "Staging all changes..."
git add -A

echo "Committing..."
git commit -m "Fix: Evaluation form questions - Add curriculum to backend"

echo "Pushing to edupex-backend..."
git push -u origin main

echo "✅ Done! Backend will auto-deploy on Render."
echo "Monitor at: https://dashboard.render.com"
```

Then run:
```bash
chmod +x /Users/mdica/push-to-backend.sh
/Users/mdica/push-to-backend.sh
```

---

## What NOT to Do

❌ Don't delete the folder without pushing first
❌ Don't lose the curriculum_structure.json file
❌ Don't delete your GitHub repo directly yet

## What to Do

✅ Push to edupex-backend repo
✅ Verify Render redeploys
✅ Test the API
✅ Then delete EduPex folder if needed

---

## After You Push

1. GitHub will receive your push to edupex-backend
2. Render webhook will trigger
3. Render will build with curriculum file in backend
4. Backend will redeploy (2-5 minutes)
5. API will return real questions (5-10 minutes)
6. Emulator will show proper evaluation questions ✅

---

Need your edupex-backend GitHub URL to complete the push.

