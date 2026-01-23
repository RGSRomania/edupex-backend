const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  hearts: {
    type: Number,
    default: 5
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  nivelCunostinte: {
    type: String,
    enum: ['Incepator', 'Mediu', 'Avansat'],
    default: 'Incepator'
  },
  evaluationScores: {
    matematica: {
      type: Number,
      default: 0
    },
    limba: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date
    }
  },
  preferences: {
    aiTeacherGender: {
      type: String,
      enum: ['female', 'male'],
      default: 'female'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    dailyGoal: {
      type: Number,
      default: 50 // XP points
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
