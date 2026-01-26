# 🗄️ LOCAL MONGODB SETUP GUIDE

## Option 1: MongoDB Community Edition (Recommended)

### Install MongoDB on Mac

```bash
# Using Homebrew (recommended)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongo --version
mongo
```

If you see the MongoDB shell prompt (>), it's working!

### Stop MongoDB (when done)
```bash
brew services stop mongodb-community
```

---

## Option 2: Docker (Alternative)

### Using Docker Container

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name edupex-mongo mongo:latest

# Check it's running
docker ps

# Stop when done
docker stop edupex-mongo
```

---

## Option 3: MongoDB Atlas Cloud (Skip Local Setup)

If you prefer using the cloud (no local setup needed):

```
MONGODB_URI=mongodb+srv://contactrgsromania_db_user:7JPuzWaxFT85kb0R@edupex.6ry5jc8.mongodb.net/?appName=EduPex
```

---

## ✅ How to Check MongoDB is Running

### Method 1: Connect via MongoDB Shell
```bash
mongo
# or
mongosh
```

Should show:
```
MongoDB shell version v5.0.0
connecting to: mongodb://127.0.0.1:27017
```

### Method 2: Check Port 27017
```bash
lsof -i :27017
# Should show mongod process
```

### Method 3: Check Brew Services
```bash
brew services list
# Should show: mongodb-community started
```

---

## 🔧 Your Backend .env is Ready

The backend `.env` file is already configured with:

```
MONGODB_URI=mongodb://localhost:27017/edupex
```

This expects MongoDB running on:
- **Host:** localhost
- **Port:** 27017
- **Database:** edupex

---

## 🚀 Complete Setup Process

### Step 1: Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Step 2: Start MongoDB Service
```bash
brew services start mongodb-community
```

### Step 3: Verify Connection
```bash
mongo
```

You should see the MongoDB prompt. Type `exit` to quit.

### Step 4: Start Backend
```bash
cd /Users/mdica/PycharmProjects/EduPex/backend
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected
```

### Step 5: Start Frontend
```bash
cd /Users/mdica/PycharmProjects/EduPex/frontend
npm start
```

### Step 6: Test
```
http://localhost:3000
```

---

## 📊 Checking MongoDB Status

### See Installed Databases
```bash
mongo
> show dbs
```

### See Collections in edupex Database
```bash
mongo
> use edupex
> show collections
```

### Check Backend Connection
Look for this in backend logs:
```
✅ MongoDB connected to mongodb://localhost:27017/edupex
```

---

## ⚠️ Common Issues

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check MongoDB is running: `brew services list`
2. Start it: `brew services start mongodb-community`
3. Restart backend: Stop and run `npm start` again

### Issue: "Port 27017 already in use"
**Solution:**
```bash
# Find what's using port 27017
lsof -i :27017

# Kill the process
kill -9 <PID>

# Restart MongoDB
brew services restart mongodb-community
```

### Issue: "MongoDB not installed"
**Solution:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Issue: "Cannot find mongo/mongosh command"
**Solution:**
```bash
# Try direct path
/usr/local/bin/mongosh

# Or reinstall
brew reinstall mongodb-community
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed: `brew list | grep mongodb`
- [ ] MongoDB running: `brew services list` shows "started"
- [ ] Can connect: `mongosh` works
- [ ] Backend .env has: `MONGODB_URI=mongodb://localhost:27017/edupex`
- [ ] Backend shows: "✅ MongoDB connected" on startup
- [ ] Database created: `mongo` → `show dbs` shows "edupex"
- [ ] Can login in app: http://localhost:3000
- [ ] All working!

---

## 🎯 Quick Commands

```bash
# Install MongoDB
brew tap mongodb/brew && brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Check status
brew services list

# Connect to MongoDB
mongosh
# or older version
mongo

# Restart if having issues
brew services restart mongodb-community

# View logs
log stream --predicate 'process == "mongod"' --level debug
```

---

## 📝 Your Configuration

Your backend is configured to use:

```
Server: localhost
Port: 27017
Database: edupex
Connection: mongodb://localhost:27017/edupex
```

This is standard MongoDB local development setup.

---

## Next Steps

1. **Install MongoDB:** `brew install mongodb-community`
2. **Start MongoDB:** `brew services start mongodb-community`
3. **Verify:** Run `mongosh` to test connection
4. **Start Backend:** `npm start` in `/backend` folder
5. **Verify Backend:** Should show "✅ MongoDB connected"
6. **Start Frontend:** `npm start` in `/frontend` folder
7. **Test:** Open http://localhost:3000

---

**Your local MongoDB setup is ready to go!** 🚀

