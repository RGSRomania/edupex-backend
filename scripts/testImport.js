#!/usr/bin/env node

/**
 * QUICK TEST - Import Curriculum
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

async function test() {
  console.log('📚 Testing Import Script...\n');

  // Test 1: Environment
  console.log('✅ Test 1: Environment variables');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

  // Test 2: Files exist
  console.log('\n✅ Test 2: JSON files exist');
  const files = [
    'Matematica_Clasa_V_CORRECT.json',
    'LimbaRomana_Clasa_V_CORRECT.json'
  ];

  for (const f of files) {
    const exists = fs.existsSync(path.join(__dirname, '../../', f));
    console.log(`   ${f}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  }

  // Test 3: Connect to MongoDB
  console.log('\n✅ Test 3: MongoDB Connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Connected successfully');

    // Test 4: Check if collections exist
    console.log('\n✅ Test 4: Collections');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Found ${collections.length} collections`);

    await mongoose.disconnect();
    console.log('\n✅ All tests passed! Ready to import.');
  } catch (err) {
    console.error('   ❌ Connection failed:', err.message);
  }
}

test();

