const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Import routes (will create these next)
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const aiAssistantRoutes = require('./routes/aiAssistantRoutes');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Debug mode for AI Assistant
const DEBUG_MODE = true;
console.log('===================================================');
console.log('EduPex Server starting with DEBUG_MODE enabled');
console.log('AI Assistant debugging will show detailed logs');
console.log('===================================================');

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://*.onrender.com', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection with improved error handling and fallback options
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Only attempt connection if MONGODB_URI is explicitly set
    if (!mongoURI) {
      console.log('ℹ️  MongoDB URI not configured - running in Supabase-only mode');
      return;
    }

    // Set connection options with retries and timeouts
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoURI, options);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ MongoDB unavailable - app running in Supabase-only mode');
    console.log('💡 To enable MongoDB: Set MONGODB_URI in environment variables');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. In Network Access, allow IP 0.0.0.0/0');
    console.log('   3. Set MONGODB_URI environment variable on Render');

    // Continue running the application without MongoDB
    // In a production environment, you might want to handle this differently
  }
};

// Call the connect function
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assistant', aiAssistantRoutes);

// Base routes
app.get('/', (req, res) => {
  res.json({
    message: 'EduPex API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      lessons: '/api/lessons',
      progress: '/api/progress',
      assistant: '/api/assistant'
    }
  });
});

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'EduPex API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'API is operational',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This endpoint does not exist',
    path: req.path
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
