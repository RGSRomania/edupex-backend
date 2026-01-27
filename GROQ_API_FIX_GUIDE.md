# 🔴 GROQ API KEY ISSUE - FIX GUIDE

## Problem Identified ✓

Your Groq API key is **INVALID or EXPIRED**.

**Error Code**: 401 Unauthorized  
**Reason**: The API key in your `.env` file is no longer accepted by Groq's servers

---

## Why This Happened

- API keys expire or get revoked
- Account may have been deactivated
- Key may have been regenerated on the Groq console

---

## Solution: Get a New API Key (5 minutes)

### Step 1: Get New API Key

1. Go to: **https://console.groq.com/keys**
2. Log in with your Groq account
3. Look for your old API key and **DELETE** it
4. Click **"Create API Key"**
5. Copy the NEW key (it will look like: `gsk_...`)

### Step 2: Update Your `.env` File

Location: `/Users/mdica/PycharmProjects/EduPex/backend/.env`

Find this line:
```
GROQ_API_KEY=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
```

Replace it with your NEW key:
```
GROQ_API_KEY=gsk_YOUR_NEW_KEY_HERE
```

### Step 3: Restart Backend Server

Kill the current process and restart:

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
cd /Users/mdica/PycharmProjects/EduPex/backend
npm start
```

### Step 4: Clear Browser Cache and Refresh

1. **Hard refresh** browser (Cmd+Shift+R on Mac)
2. Try asking a question to the AI Assistant

---

## Verification

To verify the new key works, run this test:

```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
node test-groq-api.js
```

Expected output:
```
✅ SUCCESS! Groq API is working correctly
```

---

## What Should Work After Fix

✅ AI Assistant will respond to questions  
✅ Curriculum search will work  
✅ Quiz questions will be generated  
✅ Chat history will persist  
✅ No more "Invalid API Key" errors  

---

## If You Don't Have a Groq Account

1. Go to: https://console.groq.com/
2. Sign up (free)
3. Go to "Keys" section
4. Create your first API key
5. Copy and paste into `.env`

---

## Troubleshooting

### Still getting 401 error?
- Make sure you copied the ENTIRE key (starts with `gsk_`)
- Check for extra spaces before/after the key
- Make sure you restarted the backend server
- Hard refresh the browser

### Want to test without restarting everything?
```bash
# In backend directory:
node test-groq-api.js
```

This will tell you if the key works!

---

## Files Modified

✅ `/backend/controllers/assistantController.js` - Better error handling  
✅ `/backend/test-groq-api.js` - New test script  

---

## Support

**Problem**: 401 Unauthorized  
**Solution**: Get new API key from https://console.groq.com/keys  
**Time to fix**: ~5 minutes  

Good luck! 🚀

