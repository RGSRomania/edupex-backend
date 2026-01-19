const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  gradeLevel: {
    type: Number,
    enum: [5, 6, 7, 8],
    required: true
  },
  xpPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', UserSchema);

async function createDemoUser() {
  try {
    console.log('Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: false, // These options are deprecated in v4+
      useUnifiedTopology: false
    });

    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'test@edupex.com' });

    if (existingUser) {
      console.log('ℹ️  Demo user already exists. Updating password...');
      existingUser.password = 'test123';
      await existingUser.save();
      console.log('✅ Demo user password updated successfully');
    } else {
      // Create new demo user
      const demoUser = new User({
        username: 'testuser',
        email: 'test@edupex.com',
        password: 'test123',
        firstName: 'Demo',
        lastName: 'User',
        gradeLevel: 5,
        xpPoints: 0,
        level: 1,
        streak: 0
      });

      await demoUser.save();
      console.log('✅ Demo user created successfully');
    }

    console.log('');
    console.log('📱 Demo Login Credentials:');
    console.log('   Email: test@edupex.com');
    console.log('   Password: test123');
    console.log('   Grade Level: 5');
    console.log('');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Check MongoDB Atlas IP whitelist');
    console.log('   2. Verify MONGODB_URI in .env file');
    console.log('   3. Ensure MongoDB cluster is running');
    console.log('   4. Check network connectivity to MongoDB');
    process.exit(1);
  }
}

// Run the function
createDemoUser();

