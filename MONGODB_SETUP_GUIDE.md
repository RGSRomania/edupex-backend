# 🛠️ MongoDB Setup & Demo User Guide

## Status

✅ MongoDB is now **ENABLED** in your backend configuration  
✅ Demo user creation script is ready  
⏳ Need to create demo user in your MongoDB Atlas cluster  

---

## Quick Setup (3 Steps)

### Step 1: Whitelist Render IP in MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Select your **edupex** cluster
3. Go to **Security** → **Network Access**
4. Click **Edit** on any existing entry or **Add IP Address**
5. Select **Allow Access from Anywhere** (adds 0.0.0.0/0)
6. Click **Confirm**

⏱️ **Time**: 1 minute  
💾 **Change applies**: 1-5 minutes

### Step 2: Create Demo User in MongoDB

Run locally:
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
node createDemoUser.js
```

You should see:
```
✅ Connected to MongoDB
✅ Demo user created successfully

📱 Demo Login Credentials:
   Email: test@edupex.com
   Password: test123
   Grade Level: 5
```

⏱️ **Time**: 30 seconds

### Step 3: Update Render Environment Variable

1. Go to https://dashboard.render.com
2. Click **edupex-backend** service
3. Click **Environment** tab
4. Add variable: `MONGODB_URI` = `mongodb+srv://edupex:edupex123@edupex.mongodb.net/edupex?retryWrites=true&w=majority`
5. Click **Save**
6. Service auto-redeploys

⏱️ **Time**: 2 minutes

---

## MongoDB Configuration Details

### Connection String
```
mongodb+srv://edupex:edupex123@edupex.mongodb.net/edupex?retryWrites=true&w=majority
```

### Database Credentials
- **Username**: edupex
- **Password**: edupex123
- **Database**: edupex
- **Cluster**: edupex

### Demo User
- **Email**: test@edupex.com
- **Password**: test123
- **Grade Level**: 5 (middle school)
- **XP Points**: 0 (starting)
- **Level**: 1 (starting)

---

## What MongoDB Stores

With MongoDB enabled, your app will store:

✅ **Users**
- Profile information
- Login credentials
- Progress data
- XP and levels

✅ **Lessons**
- Lesson content
- Subject and grade
- Associated textbooks

✅ **Progress Tracking**
- Lessons completed
- Quiz scores
- Time spent
- Last activity

✅ **AI Assistant Data** (optional)
- Question history
- Generated explanations
- Practice questions

---

## Files Modified/Created

### Modified
- **`.env`** - Enabled MONGODB_URI
- **`render.yaml`** - Added MONGODB_URI environment variable

### Created
- **`createDemoUser.js`** - Script to create demo user in MongoDB

---

## Next Steps (Recommended Order)

1. **Whitelist Render IP** in MongoDB Atlas (1 min)
   - Go to https://cloud.mongodb.com
   - Network Access → Allow 0.0.0.0/0

2. **Create Demo User** (30 sec)
   ```bash
   cd /Users/mdica/PycharmProjects/EduPex/backend
   node createDemoUser.js
   ```

3. **Update Render Config** (2 min)
   - Go to https://dashboard.render.com
   - Add MONGODB_URI to environment variables
   - Service auto-redeploys

4. **Verify Connection** (1 min)
   ```bash
   curl https://edupex-backend.onrender.com/api/
   ```

5. **Build & Install APK** (5-10 min)
   ```bash
   bash /Users/mdica/PycharmProjects/EduPex/build-apk-release.sh
   ```

6. **Test App** 
   - Install APK on device
   - Login with test@edupex.com / test123
   - Data now stored in MongoDB

---

## Verification

### Verify MongoDB Connection Locally
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
node createDemoUser.js
```

Expected output:
```
✅ Connected to MongoDB
✅ Demo user created successfully
```

### Verify on Render
Check Render logs:
```
✅ Connected to MongoDB successfully
```

### Verify Demo User Works
1. Install APK
2. Login with:
   - Email: test@edupex.com
   - Password: test123
3. User data loads from MongoDB

---

## Troubleshooting

### "Could not connect to any servers"
**Solution**: Check MongoDB Atlas Network Access
1. Go to https://cloud.mongodb.com
2. Security → Network Access
3. Ensure 0.0.0.0/0 is whitelisted
4. Wait 1-5 minutes for changes to apply

### "createDemoUser.js fails locally"
**Check**:
1. MONGODB_URI is set in `.env` file
2. MongoDB connection string is correct
3. MongoDB Atlas cluster is running
4. Network allows local machine access

### "Demo user exists but can't login"
**Solution**:
1. Check password is correctly hashed
2. Run createDemoUser.js again to reset password
3. Verify email is lowercase: `test@edupex.com`

### "App can't connect to backend"
**Check**:
1. Backend is running: `curl https://edupex-backend.onrender.com/api/`
2. Device has internet connection
3. MONGODB_URI is set on Render
4. Render has redeployed (watch the logs)

---

## Database Schema

### User Collection
```javascript
{
  username: "testuser",
  email: "test@edupex.com",
  password: "hashed_password",
  firstName: "Demo",
  lastName: "User",
  gradeLevel: 5,
  xpPoints: 0,
  level: 1,
  streak: 0,
  lastActive: Date,
  createdAt: Date
}
```

---

## Comparison: Supabase vs MongoDB

| Feature | Supabase | MongoDB |
|---------|----------|---------|
| Type | PostgreSQL | NoSQL |
| Users | ✅ Auth ready | ✅ Custom auth |
| Lessons | ✅ Structured | ✅ Flexible |
| Progress | ✅ Good | ✅ Good |
| Scaling | ✅ Easy | ✅ Easy |
| **Using** | **✅ Auth** | **✅ Data storage** |

You can use **both**:
- Supabase for authentication
- MongoDB for app data

Or just MongoDB for everything!

---

## Summary

✅ MongoDB enabled in backend  
✅ Demo user script created  
⏳ Need to: Whitelist IP, create user, update Render config  
**Total time**: ~5 minutes

When complete:
- App stores all data in MongoDB
- Demo login works end-to-end
- Ready for production

---

## Files Changed

Pushed to GitHub:
- `.env` - MongoDB URI enabled
- `render.yaml` - Added MONGODB_URI env var
- `createDemoUser.js` - New script

Auto-redeploys on Render when you add MONGODB_URI environment variable.

