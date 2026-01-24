const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    // Find test@edupex.com user
    const testUser = await User.findOne({ email: 'test@edupex.com' });
    if (!testUser) {
      console.log('⚠️  test@edupex.com user not found, creating one...');
      const newUser = new User({
        username: 'testedupex',
        email: 'test@edupex.com',
        password: 'Test123456',
        firstName: 'Test',
        lastName: 'EduPex',
        gradeLevel: 5
      });
      await newUser.save();
      console.log('✅ Created test@edupex.com user');
    } else {
      console.log(`✅ Found test@edupex.com user (ID: ${testUser._id})`);
    }
    // Delete all other users
    const result = await User.deleteMany({ email: { $ne: 'test@edupex.com' } });
    console.log(`✅ Deleted ${result.deletedCount} users`);
    // Show remaining users
    const allUsers = await User.find({});
    console.log(`\n📊 Remaining users in database: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });
    await mongoose.connection.close();
    console.log('\n✅ Database cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
cleanDatabase();
