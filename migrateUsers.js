const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const migrateUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;

      // Check and add missing preferences
      if (!user.preferences) {
        user.preferences = {
          aiTeacherGender: 'female',
          notificationsEnabled: true,
          dailyGoal: 50
        };
        needsUpdate = true;
        console.log(`Added preferences to user: ${user.email}`);
      }

      // Check and add missing evaluationScores
      if (!user.evaluationScores) {
        user.evaluationScores = {
          matematica: 0,
          limba: 0,
          total: 0
        };
        needsUpdate = true;
        console.log(`Added evaluationScores to user: ${user.email}`);
      }

      // Check and add missing streak
      if (user.streak === undefined || user.streak === null) {
        user.streak = 0;
        needsUpdate = true;
      }

      // Check and add missing hearts
      if (user.hearts === undefined || user.hearts === null) {
        user.hearts = 5;
        needsUpdate = true;
      }

      // Check and add missing level
      if (user.level === undefined || user.level === null) {
        user.level = 1;
        needsUpdate = true;
      }

      // Check and add missing xpPoints
      if (user.xpPoints === undefined || user.xpPoints === null) {
        user.xpPoints = 0;
        needsUpdate = true;
      }

      if (needsUpdate) {
        try {
          await user.save();
          updatedCount++;
        } catch (saveError) {
          console.error(`Error saving user ${user.email}:`, saveError.message);
        }
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();

