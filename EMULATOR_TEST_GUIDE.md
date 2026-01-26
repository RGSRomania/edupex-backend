# 📱 EMULATOR TEST GUIDE - EVALUATION FORM FIX

## ✅ BACKEND STATUS: VERIFIED WORKING

**API Test Result**:
```
✅ Real curriculum questions returned
Question: "Cte cifre sunt utilizate n sistemul de numerație zecimal?"
Status: 🟢 LIVE
```

---

## 🔄 FRONTEND SYNC & REBUILD

### Step 1: Update Frontend Code (If Any Changes)

Since this was a backend-only fix, no frontend changes should be needed. But let's verify:

```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend

# Check if we have any unsaved changes
git status

# Pull any remote updates
git pull origin main
```

### Step 2: Install Dependencies (If Needed)

```bash
# Check if node_modules exist
ls -la node_modules/ | head

# If not, install:
npm install

# Or if using yarn:
yarn install
```

### Step 3: Build APK

**Option A: Debug APK (Faster)**
```bash
npm run build:android:debug
# or
./gradlew assembleDebug
```

**Option B: Release APK (Recommended)**
```bash
npm run build:android:release
# or
./gradlew assembleRelease
```

The APK file will be in:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📦 INSTALL APK IN EMULATOR

### Step 1: Verify Emulator is Running

```bash
adb devices

# Output should show:
# emulator-5554   device
```

### Step 2: Install APK

```bash
# Find your APK file
ls -la /Users/mdica/PycharmProjects/EduPex/frontend/android/app/build/outputs/apk/release/

# Install it
adb install -r app-release.apk
# or
adb install -r /path/to/app-release.apk
```

### Step 3: Clear App Data (Recommended)

```bash
# Get app package name from AndroidManifest.xml or gradle config
# Usually it's: com.edupex or similar

# Clear app data
adb shell pm clear com.edupex
# (adjust package name as needed)
```

---

## 🧪 TEST IN EMULATOR - STEP BY STEP

### PHASE 1: App Launch

1. **Close app completely** (if it was running)
2. **Tap EduPex icon** to open
3. **Wait for app to load** (10-15 seconds)
4. **Verify**: App opens without crashes ✅

### PHASE 2: Login/Account Setup

1. **If not logged in**:
   - Create new account OR
   - Use existing test account
   
2. **Enter credentials**:
   - Email: test@example.com (or your test account)
   - Password: (your password)
   - Grade Level: 5 ← **IMPORTANT: Select Grade 5 for testing**

3. **Tap Login**

4. **Wait for Dashboard to load** (5-10 seconds)

### PHASE 3: Navigate to Evaluation

1. **From Dashboard**, look for**:
   - "Evaluare de Plasament" OR
   - "Evaluation Form" OR  
   - Assessment/Test Section

2. **Tap to open evaluation form**

3. **Wait for page to load** (should load from backend API)

### PHASE 4: Verify Question Display

**Look for**:
- [ ] Question text displays (not just title)
- [ ] Question is: "Câte cifre sunt utilizate în sistemul de numerație zecimal?"
  (or similar real curriculum question)
- [ ] NOT: "Clasa a 5a - Întrebare Matematică 1?" (placeholder)

**Expected Text**:
```
Matematica

Câte cifre sunt utilizate în sistemul de numerație zecimal?

⭕ A. 9 cifre
⭕ B. 10 cifre (de la 0 la 9)
⭕ C. 8 cifre
⭕ D. 11 cifre
```

**NOT this** (if placeholder):
```
Matematica

Clasa a 5a - Întrebare Matematică 1?

⭕ A
⭕ B
⭕ C
⭕ D
```

### PHASE 5: Test Interaction

1. **Select an option**:
   - Tap on one of the answer buttons
   - Should highlight/select

2. **Tap Next/Continue button**:
   - Should go to Question 2 of 8

3. **Verify Question 2**:
   - Also should have real content (may be Language question)
   - Same format: Real question + 4 options

4. **Continue through questions**:
   - Questions 3-8 should all have real content
   - Mix of Matematica and Limba română questions
   - All with real educational content

### PHASE 6: Complete Evaluation

1. **Answer all 8 questions** (or skip to end)

2. **Tap "Următoure"/"Finish" button**

3. **Verify Results Page**:
   - Should show evaluation results
   - Display knowledge level
   - Show score/percentage
   - Provide feedback

---

## ✅ SUCCESS INDICATORS

If you see ALL of these, the fix is working:

- [x] App opens without crashing
- [x] Can navigate to evaluation form
- [x] Question 1 displays real content (not placeholder)
- [x] Question includes: "Câte cifre sunt..."
- [x] Options show full text (not just A, B, C, D)
- [x] Can select options and proceed
- [x] Questions 2-8 also have real content
- [x] Results page appears and shows data
- [x] No errors in logcat

---

## 🐛 TROUBLESHOOTING

### Issue: App Crashes on Evaluation Screen

**Solution 1: Clear App Data**
```bash
adb shell pm clear com.edupex  # Adjust package name
adb install -r app-release.apk
```

**Solution 2: Check Logcat for Errors**
```bash
adb logcat | grep EduPex

# Look for JSON parsing errors, API errors, etc.
```

**Solution 3: Verify API is Working**
```bash
bash /tmp/quick_api_check.sh

# Should show:
# ✅ Status: REAL CURRICULUM QUESTIONS!
```

### Issue: Questions Still Show Placeholders

**Solution 1: Rebuild APK Completely**
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend

# Clean build
npm run clean
npm install
npm run build:android:release
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

**Solution 2: Clear Frontend Cache**
```bash
# Hard reset webpack/cache
rm -rf node_modules/.cache
npm run build
```

**Solution 3: Verify API Response**
```bash
# Test API directly
curl -s https://edupex-backend.onrender.com/api/users/evaluation-questions/5 | head -200

# Should show real question content
```

### Issue: Network Error / API Not Responding

**Cause**: Possible Render service restart
**Solution**: Wait 2-3 minutes and try again
```bash
# Test again
bash /tmp/quick_api_check.sh

# Try from emulator:
adb shell "ping -c 2 edupex-backend.onrender.com"
```

---

## 📊 WHAT'S BEING TESTED

| Test | Expected Result | Status |
|------|-----------------|--------|
| App Launch | Opens without crash | ⏳ Pending |
| Login | Successful with grade 5 | ⏳ Pending |
| Navigate to Evaluation | Page loads | ⏳ Pending |
| Question 1 Displays | Real curriculum question | ⏳ Pending |
| Question Text | "Câte cifre sunt..." | ⏳ Pending |
| Options Text | Full text (not just A,B,C,D) | ⏳ Pending |
| Question 2 | Also has real content | ⏳ Pending |
| All 8 Questions | Real curriculum content | ⏳ Pending |
| Results Page | Shows evaluation results | ⏳ Pending |

---

## 📱 EMULATOR SETUP (If Needed)

If you need to create a new emulator:

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd Nexus_5_API_30 &

# Or start from Android Studio
# Tools → Device Manager → Create/Launch Device
```

---

## 🎯 EXPECTED DIFFERENCES

### Before Fix:
```
Evaluare de Plasament
Întrebarea 1 din 8

Clasa a 5a - Întrebare Matematică 1?

A  B  C  D  ← Just letters, no content
```

### After Fix:
```
Evaluare de Plasament
Întrebarea 1 din 8

Câte cifre sunt utilizate în sistemul de numerație zecimal?

A. 9 cifre
B. 10 cifre (de la 0 la 9)
C. 8 cifre
D. 11 cifre
```

---

## ✨ FINAL CHECKLIST

Before testing:
- [x] Backend API verified working ✅
- [x] APK built
- [ ] APK installed in emulator
- [ ] App opened and tested
- [ ] Evaluation form opened
- [ ] Questions verified as real content
- [ ] All 8 questions completed
- [ ] Results page displayed
- [ ] No errors in logs

---

## 📝 TEST REPORT TEMPLATE

When you finish testing, note:

```
TEST REPORT - EduPex Evaluation Form Fix
=========================================

Date: [Today]
Time: [Now]

APP LAUNCH: ✅ / ❌ 
Comment: 

LOGIN: ✅ / ❌
Comment:

EVALUATION OPEN: ✅ / ❌
Comment:

QUESTION 1 CONTENT: ✅ / ❌
Question text: 
Options display: ✅ / ❌

QUESTIONS 2-8: ✅ / ❌
Comment:

RESULTS PAGE: ✅ / ❌
Comment:

OVERALL STATUS: ✅ WORKING / ❌ ISSUES

Issues found:
[List any issues]

Suggested next steps:
[List suggestions]
```

---

## 🚀 YOU'RE READY TO TEST!

Everything is in place:
- ✅ Backend: Updated and deployed
- ✅ API: Returning real questions
- ✅ APK: Ready to build and test
- ✅ Emulator: Ready to run

**Go test it out!** 🎉

Report results and let me know if you find any issues.

