# ✅ MongoDB Setup - Updated Configuration

## Your Correct Connection String

```
mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
```

**Details**:
- **Username**: contactrgsromania_db_user
- **Password**: 7JPuzWaxFT85kb0R
- **Cluster**: edupex.6ry5jc8.mongodb.net
- **Database**: (default)

---

## ✅ What's Updated

### 1. `.env` File
- ✅ Updated with correct MONGODB_URI
- ✅ Now uses your actual MongoDB credentials

### 2. `createDemoUser.js` Script
- ✅ Updated to work with MongoDB v4+ (removed deprecated options)
- ✅ Better error messages for troubleshooting
- ✅ Ready to create test@edupex.com / test123

### 3. `render.yaml`
- ✅ Already has MONGODB_URI configured
- ✅ Ready to use when you add credentials to Render

---

## 🔧 Setup Steps

### Step 1: Check MongoDB Atlas IP Whitelist (Required!)

**This is the most likely issue - your IP needs to be whitelisted**

1. Go to: https://cloud.mongodb.com
2. Select your cluster
3. **Security** → **Network Access**
4. Look for your current IP or add it:
   - Get your IP: Go to https://www.whatismyipaddress.com/
   - Or just select "Allow Access from Anywhere" (0.0.0.0/0) for testing

5. Click **Edit** or **+ Add IP Address**
6. Add your IP or 0.0.0.0/0
7. Click **Confirm**

⏱️ **Changes apply in 1-5 minutes**

---

### Step 2: Verify .env Configuration

Check that `.env` has the correct string:

```bash
grep MONGODB_URI /Users/mdica/PycharmProjects/EduPex/backend/.env
```

Should show:
```
MONGODB_URI=mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
```

---

### Step 3: Create Demo User

Once IP is whitelisted, run:

```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
node createDemoUser.js
```

**Expected output**:
```
✅ Connected to MongoDB
✅ Demo user created successfully

📱 Demo Login Credentials:
   Email: test@edupex.com
   Password: test123
   Grade Level: 5
```

---

### Step 4: Update Render Environment

1. Go to: https://dashboard.render.com
2. Click **edupex-backend** service
3. Click **Environment** tab
4. Add new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex`
5. Click **Save**

Service will auto-redeploy with MongoDB connection.

---

## 🔍 Troubleshooting

### Error: "querySrv ENOTFOUND _mongodb._tcp.edupex.6ry5jc8.mongodb.net"

**This means**: MongoDB is unreachable, usually due to:
1. ❌ IP not whitelisted
2. ❌ Wrong connection string
3. ❌ Network connectivity issues
4. ❌ MongoDB Atlas cluster not running

**Fix**:
1. Check IP whitelist at https://cloud.mongodb.com/Security/NetworkAccess
2. Add your current IP or 0.0.0.0/0
3. Wait 1-5 minutes for changes to apply
4. Try script again

---

## 📋 Connection String Breakdown

```
mongodb+srv://username:password@cluster/database?options
          ↓       ↓          ↓       ↓       ↓      ↓
          srv     user       pass    host    db    params
```

Your string:
```
mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
```

- ✅ Correct format
- ✅ Includes credentials
- ✅ Points to correct cluster
- ✅ Includes appName parameter

---

## 🔑 Demo User Details

Once created, you can login with:

- **Email**: test@edupex.com
- **Password**: test123
- **Grade**: 5
- **Starting XP**: 0
- **Starting Level**: 1

Can be updated anytime by running `createDemoUser.js` again.

---

## Files Updated

✅ `.env` - Correct MONGODB_URI  
✅ `createDemoUser.js` - Updated for MongoDB v4+  
✅ `render.yaml` - Already configured  

All ready to push to GitHub.

---

## Quick Checklist

- [ ] Go to MongoDB Atlas Network Access
- [ ] Add your IP or whitelist 0.0.0.0/0
- [ ] Wait 1-5 minutes for changes
- [ ] Run: `node createDemoUser.js`
- [ ] See ✅ success message
- [ ] Update Render environment variable
- [ ] Verify backend connects to MongoDB

---

## Next

1. **Now**: Whitelist your IP on MongoDB Atlas
2. **Then**: Run demo user script
3. **Finally**: Update Render and redeploy

See `/Users/mdica/PycharmProjects/EduPex/MONGODB_SETUP_GUIDE.md` for more details.

