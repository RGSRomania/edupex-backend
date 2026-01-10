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
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection with improved error handling and fallback options
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex';

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
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️ Starting server without MongoDB - some features may be limited');

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

// Base route
app.get('/', (req, res) => {
  res.send('EduPex API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
