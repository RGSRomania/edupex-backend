#!/usr/bin/env node

/**
 * SUPER SIMPLE IMPORT - Just show if connection works
 */

const path = require('path');
const fs = require('fs');

// Load env explicitly
const envPath = path.join(__dirname, '../.env');
console.log('📁 Loading .env from:', envPath);
console.log('   File exists:', fs.existsSync(envPath));

require('dotenv').config({ path: envPath });

console.log('\n✅ Environment loaded');
console.log('   MONGODB_URI set:', !!process.env.MONGODB_URI);

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('\n❌ MONGODB_URI not in environment');
  process.exit(1);
}

console.log('\n🔌 Connecting to MongoDB...');
console.log(`   URI: ${uri.substring(0, 80)}...`);

mongoose.connect(uri)
  .then(async () => {
    console.log('✅ Connected!');

    const { Lectie } = require('../models/Lesson');
    const count = await Lectie.countDocuments();
    console.log(`\n📊 Lessons in database: ${count}`);

    await mongoose.disconnect();
    console.log('✅ Done\n');
  })
  .catch(err => {
    console.error('\n❌ Failed:', err.message, '\n');
    process.exit(1);
  });

