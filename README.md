# EduPex Backend

Educational platform backend for Math and Romanian language learning.

## Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env.production` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000
```

### Run Server
```bash
npm start
```

Server runs on port 5000 by default.

## API Endpoints

- POST `/api/users/login` - User login
- POST `/api/users/register` - User registration
- GET `/api/lessons` - Get lessons
- GET `/api/progress` - Get user progress
- POST `/api/progress` - Save progress
- GET `/api/assistant/help` - AI assistant help

## Deployment

Deploy to Render.com:
1. Push to GitHub
2. Create Web Service on Render
3. Connect GitHub repo
4. Configure environment variables
5. Deploy

## Tech Stack

- Node.js + Express
- MongoDB
- JWT Authentication
- Mongoose ODM

