#!/usr/bin/env node

/**
 * Test MongoDB Connection
 * Verifies that MONGODB_URI is loaded and connection works
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

async function testConnection() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING MONGODB CONNECTION');
  console.log('='.repeat(80) + '\n');

  try {
    // Check if MONGODB_URI is loaded
    const uri = process.env.MONGODB_URI;
    console.log('📌 Checking MONGODB_URI...');
    if (!uri) {
      console.error('❌ MONGODB_URI not found in environment');
      process.exit(1);
    }
    console.log('✅ MONGODB_URI is set');
    console.log(`   First 60 chars: ${uri.substring(0, 60)}...`);

    // Attempt connection
    console.log('\n🔌 Attempting MongoDB connection...');
    console.log('   This may take a few seconds...\n');

    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Successfully connected to MongoDB!`);
    console.log(`   Connection time: ${duration}ms`);

    // Get database info
    const dbName = mongoose.connection.db.getName();
    console.log(`   Database: ${dbName}`);

    // List collections
    console.log('\n📊 Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Found ${collections.length} collections`);

    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`     • ${col.name}`);
      });
    }

    // Get collection counts
    console.log('\n📈 Document counts:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`     • ${col.name}: ${count} documents`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected\n');
    console.log('=' .repeat(80));
    console.log('✅ CONNECTION TEST SUCCESSFUL!');
    console.log('='.repeat(80) + '\n');
    console.log('You can now run the import script:');
    console.log('  node backend/scripts/directImport.js\n');

  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!');
    console.error(`   Error: ${error.message}\n`);

    if (error.message.includes('authentication failed')) {
      console.log('💡 Tip: Check your MongoDB Atlas credentials');
      console.log('   Make sure your IP is whitelisted in Network Access\n');
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('💡 Tip: Check your internet connection');
      console.log('   MongoDB Atlas requires an active internet connection\n');
    }

    process.exit(1);
  }
}

testConnection();

