# 🧪 Local Testing Guide - Account Creation System

**Date:** January 22, 2026
**Purpose:** Test registration and login locally before deploying to devices

---

## 🚀 Prerequisites

Make sure you have installed:
- ✅ Node.js (v18+)
- ✅ npm (v9+)
- ✅ MongoDB (local or Atlas connection)
- ✅ Git
- ✅ A code editor (VS Code recommended)

---

## 📋 Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service (macOS with Homebrew)
brew services start mongodb-community

# Or manually start it
mongod

# Verify it's running
mongo --eval "db.adminCommand('ping')"
```

### Option B: MongoDB Atlas (Cloud)
Already configured in `.env` file - no action needed

---

## 📋 Step 2: Set Up Environment Variables

### Backend (.env)
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend

# Check if .env exists
cat .env
```

Should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edupex
# OR for Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edupex

JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

If `.env` doesn't exist or is incomplete, create it:
```bash
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edupex
JWT_SECRET=dev_secret_key_12345
NODE_ENV=development
EOF
```

### Frontend (.env.development)
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend

# Should have:
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

If it doesn't exist:
```bash
cat > .env.development << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
EOF
```

---

## 📋 Step 3: Install Dependencies

### Backend
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend

# Install dependencies
npm install

# Verify server.js exists
ls -la server.js
```

### Frontend
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend

# Install dependencies
npm install

# Verify all packages installed
npm list | grep -E "react|redux"
```

---

## 📋 Step 4: Start Backend Server

### Terminal 1 - Backend
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend

# Start the server
npm start
# OR
node server.js

# Expected output:
# 🚀 Server running on port 5000
# ✅ MongoDB connected
# [Timestamp] GET /api/health
```

**Verify backend is running:**
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "healthy", ... }
```

---

## 📋 Step 5: Start Frontend (React Development Server)

### Terminal 2 - Frontend
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend

# Start React dev server
npm start

# Expected output:
# webpack compiled with ... warnings
# Compiled successfully!
# 
# You can now view edupex in the browser.
#   Local:            http://localhost:3000
```

Browser should open automatically to `http://localhost:3000`

---

## 🧪 Step 6: Test Registration Locally

### Test 1: Create New Account

1. **Open browser:** http://localhost:3000
2. **Click "Inregistreaza-te"** button
3. **Fill in form:**
   ```
   Username: testuser123
   Email: testuser123@test.com
   Password: TestPass123
   Confirm Password: TestPass123
   First Name: Test
   Last Name: User
   Grade Level: 5
   ```
4. **Click "Inregistreaza-te" button**

**Expected Result:**
- ✅ No errors
- ✅ Form submits
- ✅ Redirects to dashboard
- ✅ Can see lessons

**Check Backend Logs:**
```
POST /api/users/register
User registered successfully
```

**Check MongoDB:**
```bash
# In another terminal
mongo edupex
> db.users.findOne({ email: "testuser123@test.com" })
# Should show user document with hashed password
```

---

### Test 2: Try Duplicate Email

1. **Try to register same email again:**
   ```
   Username: anotheruser
   Email: testuser123@test.com  # Same email!
   Password: TestPass123
   ...
   ```

2. **Click register**

**Expected Result:**
- ✅ Error message: "Acest email este deja folosit..."
- ✅ Form doesn't submit
- ✅ User not created

**Check Backend Logs:**
```
EMAIL_ALREADY_EXISTS error returned
```

---

### Test 3: Try Duplicate Username

1. **Try to register same username:**
   ```
   Username: testuser123  # Same username!
   Email: anotheruser@test.com
   Password: TestPass123
   ...
   ```

2. **Click register**

**Expected Result:**
- ✅ Error message: "Acest nume de utilizator este deja folosit..."
- ✅ Form doesn't submit
- ✅ User not created

---

### Test 4: Password Mismatch

1. **Fill form with mismatched passwords:**
   ```
   Password: TestPass123
   Confirm Password: DifferentPass456
   ...
   ```

2. **Try to click register**

**Expected Result:**
- ✅ Client-side error before submission
- ✅ Error message: "Parolele nu coincid."
- ✅ Form won't submit

---

### Test 5: Login After Registration

1. **Logout** (if there's a logout button or refresh page)
2. **Go to Login page**
3. **Enter credentials:**
   ```
   Email: testuser123@test.com
   Password: TestPass123
   ```
4. **Click Login**

**Expected Result:**
- ✅ Login successful
- ✅ Redirects to dashboard
- ✅ Same user data appears
- ✅ Can access lessons

---

## 🔍 API Testing with Curl

### Test Register Endpoint
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "curl_test_user",
    "email": "curl_test@test.com",
    "password": "TestPass123",
    "firstName": "Curl",
    "lastName": "Test",
    "gradeLevel": 5
  }'

# Expected response:
# {
#   "message": "User registered successfully",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": "...", "username": "curl_test_user", ... }
# }
```

### Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl_test@test.com",
    "password": "TestPass123"
  }'

# Expected response:
# {
#   "message": "Login successful",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": "...", "username": "curl_test_user", ... }
# }
```

### Test with Invalid Email
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@test.com",
    "password": "TestPass123"
  }'

# Expected response:
# { "message": "Credențiale invalide" }
```

---

## 🗄️ MongoDB Verification

### Check Created Users
```bash
# Connect to MongoDB
mongo edupex

# List all users
db.users.find().pretty()

# Find specific user
db.users.findOne({ email: "testuser123@test.com" })

# Count users
db.users.countDocuments()

# Check if password is hashed
db.users.findOne({}, { password: 1 })
# Should show: "password" : "$2a$10$...[bcrypt hash]..."

# Exit MongoDB
exit
```

---

## 🐛 Troubleshooting Local Testing

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>

# Try starting again
npm start
```

### Can't connect to MongoDB
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community

# Or for Atlas, verify connection string in .env
cat .env | grep MONGODB_URI
```

### Frontend won't compile
```bash
# Clear cache and node_modules
rm -rf node_modules package-lock.json
npm install

# Try again
npm start
```

### CORS errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Backend already has CORS configured in `server.js`
- Make sure backend is running on http://localhost:5000
- Make sure frontend is running on http://localhost:3000
- Check that .env.development has correct API_URL

### API responds 500 error
```bash
# Check backend logs for detailed error
# Look at terminal where npm start is running

# Common issues:
# - MongoDB not connected
# - .env variables not set
# - Missing dependencies
```

---

## ✅ Complete Local Testing Checklist

- [ ] MongoDB running locally or Atlas configured
- [ ] Backend .env file created with correct settings
- [ ] Frontend .env.development file created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server started (`npm start` - should see "🚀 Server running")
- [ ] Frontend dev server started (`npm start` - should open browser)
- [ ] Can access http://localhost:3000 in browser
- [ ] Can see login/register page
- [ ] Register endpoint responds with `curl` test
- [ ] Create new account successfully
- [ ] Error on duplicate email
- [ ] Error on duplicate username
- [ ] Error on password mismatch
- [ ] Login works after registration
- [ ] JWT token received
- [ ] User data visible in MongoDB
- [ ] Can access lessons after login
- [ ] Logout and login again works
- [ ] Progress data persists


---

## 📊 Expected File Structure for Local Testing

```
EduPex/
├── backend/
│   ├── .env                 ← Create this
│   ├── server.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── package.json
│
├── frontend/
│   ├── .env.development     ← Create this
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Register.js
│   │   ├── redux/
│   │   │   └── actions/
│   │   │       └── userActions.js
│   │   └── utils/
│   │       └── api.js
│   └── package.json
```

---

## 🎯 Advanced: Debug Mode

### Enable Detailed Logging

**Backend - server.js already has logging**

Check for logs:
```bash
# Look for detailed API logs showing:
# - Request received
# - Validation steps
# - Database operations
# - Response sent
```

**Frontend - Check Browser Console**

Press `F12` → Console tab:
- Registration submission logs
- API request/response
- Redux action dispatch
- localStorage updates

---

## 📝 Sample Test Scenarios

### Scenario 1: Happy Path
```
1. Register: user1@test.com
2. See success message
3. Auto-login to dashboard
4. View lessons
5. Logout
6. Login with same email/password
7. Progress still there
```

### Scenario 2: Error Handling
```
1. Register: test@test.com
2. Try again with same email
3. See error
4. Change email slightly
5. Register successfully
6. Try wrong password
7. See error
8. Correct password works
```

### Scenario 3: Data Persistence
```
1. Register: john@test.com
2. Verify in MongoDB
3. Password is bcrypt hashed
4. Logout
5. Login with email/password
6. Same user data returned
7. Verify token in localStorage
```

---

## 🚀 Ready to Test!

You now have everything needed to test account creation locally:
1. Both servers running (backend + frontend)
2. MongoDB ready
3. Comprehensive test procedures
4. Troubleshooting guide
5. API testing examples

Start with **Test 1** and work through each scenario!

---

## 📞 Getting Help

If something doesn't work:
1. Check the **Troubleshooting** section above
2. Look at backend/frontend logs
3. Use curl to test API directly
4. Check MongoDB for data
5. Verify .env files are correct

---

**Happy Testing!** 🎉


