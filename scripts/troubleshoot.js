#!/usr/bin/env node

/**
 * Troubleshoot why old content is still showing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Lectie, LectieQuestion } = require('../models/Lesson');

async function troubleshoot() {
  console.log('🔍 Troubleshooting Content Display Issue\n');

  try {
    // 1. Check MongoDB connection
    console.log('1️⃣  Checking MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Connected to MongoDB\n');

    // 2. Check if real content exists in DB
    console.log('2️⃣  Checking lesson content in database...');
    const lesson = await Lectie.findOne({ title: /L1/ });

    if (!lesson) {
      console.log('   ❌ No lessons found!');
      return;
    }

    console.log(`   ✅ Found lesson: ${lesson.title}`);
    console.log(`   Summary: ${lesson.summary?.substring(0, 60)}...`);
    console.log(`   Theory length: ${lesson.content?.theory?.length || 0} chars`);
    console.log(`   Examples: ${lesson.content?.examples?.length || 0}`);
    console.log(`   Tip length: ${lesson.content?.tips?.length || 0}\n`);

    // 3. Summary
    console.log('3️⃣  Summary:');
    const contentLength = lesson.content?.theory?.length || 0;
    const hasExamples = (lesson.content?.examples?.length || 0) > 0;
    const hasTips = (lesson.content?.tips?.length || 0) > 0;

    if (contentLength > 100 && hasExamples && hasTips) {
      console.log('   ✅ DATABASE HAS REAL CONTENT');
      console.log('   ✅ Content is properly saved');
      console.log('   ⚠️  ISSUE: Browser is showing cached old data\n');
      console.log('   SOLUTION: Clear browser cache and do hard refresh');
      console.log('   - Press Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)');
      console.log('   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)');
    } else {
      console.log('   ❌ DATABASE CONTENT IS INCOMPLETE');
      console.log(`   Content length: ${contentLength} chars (should be 200+)`);
      console.log(`   Has examples: ${hasExamples} (should be true)`);
      console.log(`   Has tips: ${hasTips} (should be true)`);
      console.log('\n   RUN THIS:');
      console.log('   cd /Users/mdica/PycharmProjects/EduPex');
      console.log('   node backend/scripts/populateFromManuals.js');
      console.log('   node backend/scripts/syncLessonsToDatabase.js');
    }

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Troubleshooting error:', error.message);
    process.exit(1);
  }
}

troubleshoot();

