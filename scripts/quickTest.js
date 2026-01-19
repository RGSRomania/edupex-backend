#!/usr/bin/env node

// MINIMAL TEST - Just output to prove script runs
console.log('TEST OUTPUT - Script started at:', new Date().toISOString());

require('dotenv').config();
console.log('✅ dotenv loaded');

const mongoose = require('mongoose');
console.log('✅ mongoose loaded');

const path = require('path');
const fs = require('fs');
console.log('✅ path and fs loaded');

async function quickTest() {
  try {
    console.log('\n=== STARTING QUICK TEST ===\n');

    // Test files exist
    const files = [
      'Matematica_Clasa_V_CORRECT.json',
      'LimbaRomana_Clasa_V_CORRECT.json'
    ];

    console.log('Checking files:');
    for (const f of files) {
      const p = path.join(__dirname, '../../', f);
      const exists = fs.existsSync(p);
      console.log(`  ${f}: ${exists ? '✅ YES' : '❌ NO'}`);
    }

    // Test MongoDB URI
    const uri = process.env.MONGODB_URI;
    console.log(`\nMongoDB URI set: ${uri ? '✅ YES' : '❌ NO'}`);
    if (uri) {
      console.log(`  (First 50 chars: ${uri.substring(0, 50)}...)`);
    }

    // Test connection
    console.log('\nAttempting MongoDB connection...');
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );

    const connection = mongoose.connect(uri);
    await Promise.race([connection, timeout]);

    console.log('✅ Connected to MongoDB');

    // Count documents
    const {Lectie} = require('../models/Lesson');
    const count = await Lectie.countDocuments();
    console.log(`\nLessons in database: ${count}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }

  process.exit(0);
}

quickTest();

