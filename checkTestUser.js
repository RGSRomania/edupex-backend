const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAndCreateTestUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupex';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if test user exists
    const testEmail = 'test@edupex.com';
    let user = await User.findOne({ email: testEmail });

    if (user) {
      console.log('\n✅ Test user exists!');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('First Name:', user.firstName);
      console.log('Last Name:', user.lastName);
      console.log('Grade Level:', user.gradeLevel);
      console.log('\nTesting password...');

      const isPasswordValid = await user.isValidPassword('test123');
      console.log('Password "test123" is valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('\n⚠️  Password is incorrect. Updating password to "test123"...');
        user.password = 'test123';
        await user.save();
        console.log('✅ Password updated successfully!');
      }
    } else {
      console.log('\n⚠️  Test user does not exist. Creating...');

      user = new User({
        username: 'testedupex',
        email: testEmail,
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        gradeLevel: 5
      });

      await user.save();
      console.log('✅ Test user created successfully!');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('Password: test123');
    }

    console.log('\n📝 You can now login with:');
    console.log('   Email: test@edupex.com');
    console.log('   Password: test123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

checkAndCreateTestUser();

