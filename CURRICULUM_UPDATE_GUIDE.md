# 🎓 CURRICULUM UPDATE GUIDE - FIXED!

## The Problem (SOLVED)

The application has **4 separate copies** of `curriculum_structure.json`:

```
1. /curriculum_structure.json ← YOU WERE EDITING THIS
2. /frontend/public/curriculum_structure.json ← FRONTEND USES THIS (was outdated!)
3. /frontend/src/data/curriculum_structure.json ← FALLBACK (was outdated!)
4. /backend/curriculum_structure.json ← BACKEND USES THIS (was outdated!)
```

### Why Updates Weren't Working:
- ❌ You updated `/curriculum_structure.json` (root)
- ❌ Frontend fetches from `/curriculum_structure.json` → served from `/frontend/public/`
- ❌ Browser cached the OLD file from `/frontend/public/`
- ❌ Restarting servers didn't help because it was a browser cache issue
- ❌ The 3 other copies were stale

---

## The Solution (APPLIED)

All 4 files are now **synchronized** with the new curriculum!

**Verification (all should be same MD5):**
```bash
md5 curriculum_structure.json \
    frontend/public/curriculum_structure.json \
    frontend/src/data/curriculum_structure.json \
    backend/curriculum_structure.json
```

Current MD5: `4b5967722b0a0ea9ce2455a17a37011a` ✅

---

## How to Update Curriculum Going Forward

### Step 1: Edit the Main File
Edit `/curriculum_structure.json` with your new lesson data.

### Step 2: Sync All Copies
Run this command to copy it to all 3 locations:

```bash
cd /Users/mdica/PycharmProjects/EduPex
./sync_curriculum.sh
```

### Step 3: Clear Browser Cache & Refresh
1. **Open DevTools:** `F12`
2. **Clear Cache:** Go to "Application" → "Cache Storage" → Delete all
3. **Hard Refresh:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
4. **Go to app:** http://localhost:3000
5. **Login and view lesson** → You'll see the NEW content! ✅

---

## What the Script Does

The `sync_curriculum.sh` script:
- ✅ Copies `/curriculum_structure.json` → `/frontend/public/`
- ✅ Copies `/curriculum_structure.json` → `/frontend/src/data/`
- ✅ Copies `/curriculum_structure.json` → `/backend/`
- ✅ Verifies all files are identical (same MD5)
- ✅ Tells you if there's a problem

---

## Why NO Server Restart Needed

The curriculum is served as:
1. **Static file** from frontend/public → loaded by browser
2. **JSON file** read by backend when needed → no server restart required

So after syncing, just:
- Clear browser cache
- Hard refresh
- Done! ✅

---

## Quick Reference

**Problem Summary:**
```
Updated /curriculum_structure.json
  ↓
Frontend reads from /frontend/public/curriculum_structure.json
  ↓
That file was old (browser cached it)
  ↓
Nothing was updated on screen!
```

**Solution:**
```
Updated /curriculum_structure.json
  ↓
Run ./sync_curriculum.sh
  ↓
All 4 copies are now identical
  ↓
Clear browser cache + hard refresh
  ↓
See new curriculum! ✅
```

---

## Example Workflow

```bash
# 1. Edit the main curriculum
nano curriculum_structure.json

# 2. Sync all copies
./sync_curriculum.sh

# Expected output:
# ✅ Synced: frontend/public/curriculum_structure.json
# ✅ Synced: frontend/src/data/curriculum_structure.json
# ✅ Synced: backend/curriculum_structure.json
# ✅ All curriculum files are synchronized!

# 3. Now clear browser cache and refresh - done!
```

---

## Files Involved

| File | Purpose | Used By |
|------|---------|---------|
| `/curriculum_structure.json` | **SOURCE** - Edit this! | Reference/documentation |
| `/frontend/public/curriculum_structure.json` | **FRONTEND** - Fetched as static asset | React app (browser reads from `/curriculum_structure.json`) |
| `/frontend/src/data/curriculum_structure.json` | **FALLBACK** - Used by some components | React components (rare) |
| `/backend/curriculum_structure.json` | **BACKEND** - Used for API responses | Node.js API server |

---

## If Something Goes Wrong

**Check file synchronization:**
```bash
./sync_curriculum.sh
```

**Verify files match:**
```bash
md5 curriculum_structure.json frontend/public/curriculum_structure.json
# Should output: same MD5 hash for both
```

**Clear everything:**
```bash
# 1. Close browser
# 2. Delete node_modules/.cache (frontend)
# 3. Clear browser cache completely
# 4. Hard refresh
# 5. Restart servers if needed
```

---

## Questions?

- **Old content still showing?** → Clear browser cache + hard refresh (Cmd+Shift+R)
- **Files not syncing?** → Run `./sync_curriculum.sh` manually
- **Server errors?** → Check `/tmp/backend.log` for error messages

---

**Last Updated:** January 27, 2026
**Status:** ✅ WORKING - All curriculum files synchronized

