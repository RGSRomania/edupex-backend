# MongoDB Atlas Setup for EduPex Backend

## Quick Setup Guide

### 1. Create a Free MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Start Free"
- Sign up with your email

### 2. Create a Cluster
- Choose the free tier (M0)
- Select a region (closest to you)
- Click "Create Cluster"
- Wait 2-5 minutes for it to be created

### 3. Create a Database User
- Go to "Security" → "Database Access"
- Click "Add New Database User"
- Username: `edupex`
- Password: Create a strong password (e.g., `edupex123`)
- Click "Add User"

### 4. Whitelist IP Addresses
- Go to "Security" → "Network Access"
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (for development)
- Click "Confirm"

### 5. Get Your Connection String
- Go to "Databases" → Click "Connect"
- Choose "Drivers"
- Select "Node.js" and "4.x"
- Copy the connection string

### 6. Update Your .env File
Replace the MONGODB_URI in `.env` with your connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/edupex?retryWrites=true&w=majority
```

Replace:
- `username` with your database user (default: `edupex`)
- `password` with your database password
- `cluster0` with your actual cluster name

### 7. On Render.com
Add the MONGODB_URI as an environment variable:
1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Add new variable: `MONGODB_URI` = your connection string
5. Click "Save"
6. Service will auto-redeploy with MongoDB connected

## Testing Your Connection

```bash
# Local testing
curl http://localhost:5000/api/

# Render testing
curl https://edupex-backend.onrender.com/api/
```

## Troubleshooting

**Still getting connection errors?**
- Check that your IP is whitelisted in Network Access
- Verify username and password are correct
- Make sure the connection string format is correct
- Check that Render environment variable is set correctly


