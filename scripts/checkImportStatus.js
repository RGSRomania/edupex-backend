#!/usr/bin/env node

/**
 * CHECK IMPORT STATUS
 * Verify how many documents were imported
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Lectie, LectieQuestion, Materie, Clasa, UnitateDeInvatare } = require('../models/Lesson');

async function checkStatus() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }

    console.log('\n🔍 CHECKING IMPORT STATUS...\n');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Check counts
    const materieCount = await Materie.countDocuments();
    const clasaCount = await Clasa.countDocuments();
    const unitateCount = await UnitateDeInvatare.countDocuments();
    const lectieCount = await Lectie.countDocuments();
    const questionCount = await LectieQuestion.countDocuments();

    console.log('📊 DOCUMENT COUNTS:');
    console.log(`   Materii (Subjects): ${materieCount}`);
    console.log(`   Clase (Grades): ${clasaCount}`);
    console.log(`   Unitati (Units): ${unitateCount}`);
    console.log(`   Lectii (Lessons): ${lectieCount}`);
    console.log(`   Questions: ${questionCount}`);

    console.log('\n' + '='.repeat(60));

    if (lectieCount >= 100) {
      console.log('✅ IMPORT SUCCESSFUL!');
      console.log(`   ${lectieCount} lessons imported`);
      console.log(`   ${questionCount} questions imported`);
    } else if (lectieCount > 0) {
      console.log('⏳ IMPORT IN PROGRESS...');
      console.log(`   ${lectieCount}${lectieCount < 50 ? '/114' : ''} lessons imported`);
    } else {
      console.log('❌ NO DATA IMPORTED YET');
      console.log('   The import might still be running...');
    }

    console.log('='.repeat(60) + '\n');

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStatus();

