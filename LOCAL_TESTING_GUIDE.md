# 🧪 LOCAL TESTING GUIDE - MATEMATICA EXTRACTION

## Quick Start - Test Everything Locally

### Prerequisites Check
```bash
# Verify MongoDB is ready
brew services list | grep mongodb

# Verify you have 3 terminal windows ready
```

---

## Step-by-Step Local Testing

### Terminal 1: Start MongoDB
```bash
brew services start mongodb-community
# Wait for it to start (2-3 seconds)
```

### Terminal 2: Start Backend
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
npm start
```

**Wait for:**
```
✅ Server running on port 5000
✅ Connected to MongoDB successfully
```

### Terminal 3: Start Frontend
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```

**Wait for:**
```
webpack compiled successfully
```

Then browser auto-opens to: `http://localhost:3000`

---

## Testing the Matematica Extraction

### Step 1: Login
1. Browser should show login page at `http://localhost:3000`
2. Enter:
   - Email: `test@edupex.com`
   - Password: `test123`
3. Click "Autentificare"

### Step 2: Navigate to Matematica
1. After login, you should see "Acasă" or main page
2. Look for navigation to "Clasa a V a"
3. Select "Matematica"
4. You should see the 13 lessons

### Step 3: Open a Lesson
1. Click any lesson (e.g., "Punct, dreaptă, plan")
2. Check:
   - ✅ Title appears
   - ✅ Summary text is visible (from PDF extraction)
   - ✅ Images are loading (619 extracted images)
   - ✅ Content is readable

### Step 4: Verify Images
1. In browser, open DevTools (F12)
2. Go to Network tab
3. Look for requests to:
   - `http://localhost:5000/api/curriculum` (serving content)
   - `/extracted_images/lesson_image_*.png` (loading images)
4. Images should show 200 OK status

### Step 5: Check Console
1. Open DevTools Console (F12 → Console)
2. Should see NO red errors
3. Only warnings are OK

---

## What to Verify

### Content Verification

- [ ] Lesson summaries are NOT empty
- [ ] Summaries are 1,400+ characters
- [ ] Text includes definitions and examples
- [ ] Content looks like it came from the manual

### Image Verification

- [ ] Images appear in lessons
- [ ] Images are not broken/404
- [ ] Multiple images per lesson visible
- [ ] Images are clear and readable

### Lesson Verification

- [ ] All 13 lessons are accessible
- [ ] Each lesson has unique title
- [ ] Each lesson has content
- [ ] Each lesson has images

### API Verification

- [ ] Backend serves curriculum at: `/api/curriculum`
- [ ] Images served from: `/public/extracted_images/`
- [ ] No 404 errors
- [ ] All requests return 200 OK

---

## If Something Doesn't Work

### No Images Showing?
1. Check if `frontend/public/extracted_images/` has files:
   ```bash
   ls -la /Users/mdica/PycharmProjects/EduPex/frontend/public/extracted_images/ | wc -l
   # Should show ~620 (including . and ..)
   ```

2. Check backend can serve them:
   ```bash
   curl http://localhost:5000/public/extracted_images/lesson_image_0_0.png > /tmp/test.png
   ls -lh /tmp/test.png
   # Should be > 0 bytes
   ```

3. Hard refresh browser: `Cmd+Shift+R`

### Content Empty/Missing?
1. Check curriculum_structure.json was updated:
   ```bash
   cd /Users/mdica/PycharmProjects/EduPex
   node -e "const d = require('./curriculum_structure.json'); console.log('Lessons:', d['Clasa a V a']['Matematica'].length); console.log('Lesson 1 summary length:', d['Clasa a V a']['Matematica'][0].summary.length)"
   ```

2. Should show:
   - `Lessons: 13`
   - `Summary length: 1400+`

3. If not, curriculum wasn't updated. Re-run mapping script:
   ```bash
   python3 /Users/mdica/PycharmProjects/EduPex/map_content_to_lessons.py
   cp curriculum_structure_updated.json curriculum_structure.json
   ```

### Backend Won't Start?
1. Check MongoDB:
   ```bash
   lsof -i :27017
   # Should show mongod process
   ```

2. Check if port 5000 is free:
   ```bash
   lsof -i :5000
   # If something is using it, kill it:
   kill -9 <PID>
   ```

3. Restart backend

### Frontend Won't Compile?
1. Clear cache:
   ```bash
   rm -rf /Users/mdica/PycharmProjects/EduPex/frontend/node_modules/.cache
   ```

2. Restart npm:
   ```bash
   cd frontend && npm start
   ```

---

## Expected Output When Everything Works

**Terminal 1 (MongoDB):**
```
(no output, just running)
```

**Terminal 2 (Backend):**
```
Server running on port 5000
Connected to MongoDB successfully
[API requests logging]
```

**Terminal 3 (Frontend):**
```
webpack compiled successfully
Compiled successfully!
[Module requests logging]
```

**Browser:**
```
Login Page → Login → Clasa V a → Matematica → 13 Lessons Listed
Click Lesson → Full content displays with images ✅
```

---

## Once Everything Works Locally

Then we can:
1. ✅ Verify extraction is correct
2. ✅ Test all 13 lessons load properly
3. ✅ Confirm images display correctly
4. ✅ Check content quality
5. ✅ Then safely push to GitHub

---

## Troubleshooting Checklist

- [ ] MongoDB running on port 27017
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with test@edupex.com / test123
- [ ] Can navigate to Matematica
- [ ] Can see 13 lessons listed
- [ ] Can open a lesson
- [ ] Lesson has summary text (long text, not empty)
- [ ] Lesson shows images
- [ ] Images load without 404 errors
- [ ] No red errors in browser console

If all checked: **Extraction is working perfectly!** ✅

---

## Test Data

**Test User:**
- Email: `test@edupex.com`
- Password: `test123`

**Test Subject:**
- Class: Clasa a V a
- Subject: Matematica
- Lessons: 13 (all with PDF content + 619 images)

---

**Start with Terminal 1, then 2, then 3. Then test in browser!**

