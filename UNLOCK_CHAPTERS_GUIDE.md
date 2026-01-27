# How to Unlock Chapters 1-5 for test@edupex.com

## Summary

We have successfully created Progress records in MongoDB for all 24 lessons from chapters 1-5. However, the frontend app uses **localStorage** to track completed lessons. To make chapters 1-5 visible and unlocked in the app, you need to set localStorage with the completion data.

## Steps to Unlock Chapters 1-5

### Option 1: Using Browser Console (Quickest)

1. **Open the app** in your browser and log in as test@edupex.com
2. **Open Developer Tools** by pressing `F12` (or `Cmd+Option+I` on Mac)
3. **Go to the Console tab**
4. **Copy and paste the following command:**

```javascript
localStorage.setItem('lessonProgress', '{"Matematica_1_1":"completed","Matematica_1_2":"completed","Matematica_1_3":"completed","Matematica_1_4":"completed","Matematica_1_5":"completed","Matematica_1_6":"completed","Matematica_1_7":"completed","Matematica_1_8":"completed","Matematica_1_9":"completed","Matematica_1_10":"completed","Matematica_1_11":"completed","Matematica_1_12":"completed","Matematica_1_13":"completed","Matematica_2_1":"completed","Matematica_2_2":"completed","Matematica_2_3":"completed","Matematica_2_4":"completed","Matematica_2_5":"completed","Matematica_3_1":"completed","Matematica_3_2":"completed","Matematica_3_3":"completed","Matematica_4_1":"completed","Matematica_4_2":"completed","Matematica_4_3":"completed","Matematica_4_4":"completed","Matematica_4_5":"completed","Matematica_4_6":"completed","Matematica_4_7":"completed","Matematica_4_8":"completed","Matematica_4_9":"completed","Matematica_4_10":"completed","Matematica_5_1":"completed","Matematica_5_2":"completed","Matematica_5_3":"completed","Matematica_5_4":"completed","Matematica_5_5":"completed","Matematica_5_6":"completed","Matematica_5_7":"completed","Matematica_5_8":"completed","Matematica_5_9":"completed"}');
```

5. **Press Enter**
6. **Refresh the page** (F5 or Cmd+R)
7. ✅ **All chapters 1-5 should now be unlocked!**

### Option 2: Save Command to a File

A file has been saved at: `/Users/mdica/PycharmProjects/EduPex/unlock_chapters_1_5.txt`

You can open this file and copy the command from there.

## What Was Done

### ✅ Step 1: Found the User
- User: test@edupex.com
- Username: testuser
- User ID: 6963708ebd2c43f11a070054
- Grade Level: 5

### ✅ Step 2: Created Progress Records in MongoDB
- Created 24 Progress records with `completed: true`
- Covered all lessons from chapters 1-5:
  - **Chapter 1**: 13 lessons
  - **Chapter 2**: 5 lessons
  - **Chapter 3**: 3 lessons
  - **Chapter 4**: 10 lessons
  - **Chapter 5**: 9 lessons

### ✅ Step 3: Generated localStorage Sync
- Created JavaScript command to sync all completed lessons to localStorage
- This unlocks chapters 1-5 in the frontend interface

## Technical Details

### Chapter Unlock Logic
The app uses a sequential unlock system:
- **Chapter 1** is always unlocked
- **Chapter 2** unlocks when all lessons in Chapter 1 are completed
- **Chapter 3** unlocks when all lessons in Chapter 2 are completed
- **And so on...**

### localStorage Format
- Key: `lessonProgress`
- Value: JSON object where:
  - Key format: `{Subject}_{ChapterNumber}_{LessonNumber}`
  - Value: `"completed"`
  - Example: `"Matematica_1_1": "completed"`

## Verification

After applying the localStorage command and refreshing:
- Navigate to Chapters page
- All 5 chapters should be visible and unlocked
- Progress bars should show 100% for chapters 1-5
- Chapter 6 will remain locked until chapter 5 is completed

## Files Generated

- `unlock_chapters_1_5.txt` - Contains the localStorage command
- `unlock_all_chapters_1_5.js` - Node script that generates the command
- `create_progress_records.js` - Script that created the MongoDB Progress records
- `sync_progress_to_localstorage.js` - Script that generates localStorage from database

## Need Help?

If chapters don't unlock after applying the command:
1. Make sure you're logged in as test@edupex.com
2. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
3. Close and reopen the app
4. Try the localStorage command again
5. Refresh the page (F5)

