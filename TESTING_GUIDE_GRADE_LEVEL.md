# 🧪 TESTING GUIDE - GRADE LEVEL FIX

## Quick Test Steps

### Test 1: Clasa VI Account Lessons
1. Create new account with **Clasa a VI-a** selected
2. Login
3. Go to Lessons
4. **Expected**: Title shows "Matematica - Clasa a VI a"
5. **Expected**: See Clasa VI chapter names (not Clasa V names)

### Test 2: Clasa VII Account Lessons
1. Create new account with **Clasa a VII-a** selected
2. Login
3. Go to Lessons
4. **Expected**: Title shows "Matematica - Clasa a VII a"
5. **Expected**: Chapters are different from Clasa VI

### Test 3: Change Grade Level in Profile
1. Login as any user
2. Go to Profile
3. Click "Edit" button
4. Find "Clasa" dropdown
5. Change from current grade to different grade (e.g., V → VII)
6. Click "Save"
7. Go back to Lessons
8. **Expected**: Title updates to new grade
9. **Expected**: Chapter names change to match new grade

### Test 4: Both Subjects
1. Go to Lessons → Matematica (should show your current grade)
2. Switch to Limba și literatura română
3. **Expected**: Same grade level, but different subject lessons

### Test 5: Chapter Navigation
1. Select a grade level user
2. Go to Lessons
3. Click on a chapter
4. **Expected**: See lessons from correct grade/chapter
5. Click on a lesson
6. **Expected**: See lesson content and questions

---

## ✅ Success Criteria

- [ ] Clasa V accounts show V lessons
- [ ] Clasa VI accounts show VI lessons
- [ ] Clasa VII accounts show VII lessons
- [ ] Clasa VIII accounts show VIII lessons
- [ ] Page titles show correct grade
- [ ] Changing grade in Profile updates lessons
- [ ] Both Matematica and Limba work correctly
- [ ] No errors in browser console

---

## 🔍 Debugging Tips

If tests fail, check:

1. **Browser Console** - Look for errors
   ```javascript
   // Should see logs like:
   // "Found curriculum at: /curriculum_structure.json"
   // "Class loaded successfully"
   ```

2. **Check localStorage** in browser dev tools
   - User object should have `gradeLevel: 5|6|7|8`

3. **Check Network tab**
   - curriculum_structure.json should load
   - Should be loaded only once

4. **Check React DevTools**
   - User state should update when loading
   - Should have correct gradeLevel

---

## 🎯 Expected Lesson Differences

### Clasa V
- Chapters like "Operații cu numere", "Metode aritmetice", etc.

### Clasa VI
- Different chapters specific to Clasa VI curriculum

### Clasa VII
- Different chapters specific to Clasa VII curriculum

### Clasa VIII
- Different chapters specific to Clasa VIII curriculum

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Still showing Clasa V | Clear localStorage, reload page |
| Grade not saving | Check backend profile endpoint |
| Lessons don't update | Hard refresh browser (Cmd+Shift+R) |
| Wrong chapter names | Check curriculum_structure.json is loaded |

---

**All tests passing = Fix is complete!** ✅

