const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({ email: String });
const ProgressSchema = new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId, lesson: mongoose.Schema.Types.ObjectId, completed: Boolean });

const User = mongoose.model('User', UserSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: false, useUnifiedTopology: false });

    console.log('\n🔍 VERIFICATION REPORT\n');
    console.log('═'.repeat(60));

    // Verify user
    const user = await User.findOne({ email: 'test@edupex.com' });
    console.log(`\n✅ User Found:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user._id}`);

    // Count progress records
    const progressCount = await Progress.countDocuments({ user: user._id, completed: true });
    console.log(`\n✅ Progress Records:`);
    console.log(`   Total completed: ${progressCount}`);

    // Show breakdown
    const progressRecords = await Progress.find({ user: user._id, completed: true }).limit(10);
    console.log(`\n✅ Sample Progress Records:`);
    progressRecords.forEach((p, i) => {
      console.log(`   ${i+1}. Lesson: ${p.lesson} - Completed: ${p.completed}`);
    });

    console.log(`\n${'═'.repeat(60)}`);
    console.log('\n🎯 Ready to Unlock!\n');
    console.log('Execute this in browser console:\n');
    console.log('localStorage.setItem(\'lessonProgress\', \'{"Matematica_1_1":"completed","Matematica_1_2":"completed","Matematica_1_3":"completed","Matematica_1_4":"completed","Matematica_1_5":"completed","Matematica_1_6":"completed","Matematica_1_7":"completed","Matematica_1_8":"completed","Matematica_1_9":"completed","Matematica_1_10":"completed","Matematica_1_11":"completed","Matematica_1_12":"completed","Matematica_1_13":"completed","Matematica_2_1":"completed","Matematica_2_2":"completed","Matematica_2_3":"completed","Matematica_2_4":"completed","Matematica_2_5":"completed","Matematica_3_1":"completed","Matematica_3_2":"completed","Matematica_3_3":"completed","Matematica_4_1":"completed","Matematica_4_2":"completed","Matematica_4_3":"completed","Matematica_4_4":"completed","Matematica_4_5":"completed","Matematica_4_6":"completed","Matematica_4_7":"completed","Matematica_4_8":"completed","Matematica_4_9":"completed","Matematica_4_10":"completed","Matematica_5_1":"completed","Matematica_5_2":"completed","Matematica_5_3":"completed","Matematica_5_4":"completed","Matematica_5_5":"completed","Matematica_5_6":"completed","Matematica_5_7":"completed","Matematica_5_8":"completed","Matematica_5_9":"completed"}\');\n');

    console.log('\nThen refresh page (F5)\n');
    console.log('✅ All chapters 1-5 should be unlocked!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();

