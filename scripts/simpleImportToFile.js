#!/usr/bin/env node

/**
 * SIMPLE IMPORT TO FILE
 * Writes all output to a file instead of console
 */

const path = require('path');
const fs = require('fs');

const logFile = '/tmp/edupex_import.log';
const logStream = fs.createWriteStream(logFile, { flags: 'w' });

function log(msg) {
  console.log(msg);
  logStream.write(msg + '\n');
}

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie, LectieQuestion } = require('../models/Lesson');

async function main() {
  try {
    log('='.repeat(80));
    log('STARTING IMPORT');
    log('='.repeat(80));

    const uri = process.env.MONGODB_URI;
    log(`MongoDB URI: ${uri ? 'SET' : 'NOT SET'}`);

    if (!uri) {
      log('ERROR: MONGODB_URI not set');
      logStream.end();
      process.exit(1);
    }

    log('\nConnecting to MongoDB...');
    await mongoose.connect(uri);
    log('Connected!');

    log('\nCreating subjects...');
    await Materie.updateOne(
      { name: 'Matematica' },
      { $set: { name: 'Matematica', description: 'Matematică' } },
      { upsert: true }
    );
    await Materie.updateOne(
      { name: 'Limba Romana' },
      { $set: { name: 'Limba Romana', description: 'Limba și literatura română' } },
      { upsert: true }
    );
    log('Subjects created');

    log('\nReading JSON files...');
    const file1Path = path.join(__dirname, '../../Matematica_Clasa_V_CORRECT.json');
    const file2Path = path.join(__dirname, '../../LimbaRomana_Clasa_V_CORRECT.json');

    if (!fs.existsSync(file1Path)) {
      log(`ERROR: File not found: ${file1Path}`);
      logStream.end();
      process.exit(1);
    }

    log(`File exists: ${file1Path}`);

    const data1 = JSON.parse(fs.readFileSync(file1Path, 'utf8'));
    log(`Loaded Matematica: ${data1.unitati.length} units`);

    if (fs.existsSync(file2Path)) {
      const data2 = JSON.parse(fs.readFileSync(file2Path, 'utf8'));
      log(`Loaded Limba Romana: ${data2.unitati.length} units`);
    }

    log('\nCounting documents in database...');
    const materieCount = await Materie.countDocuments();
    const clasaCount = await Clasa.countDocuments();
    const unitateCount = await UnitateDeInvatare.countDocuments();
    const lectieCount = await Lectie.countDocuments();
    const questionCount = await LectieQuestion.countDocuments();

    log(`Materii: ${materieCount}`);
    log(`Clase: ${clasaCount}`);
    log(`Unitati: ${unitateCount}`);
    log(`Lectii: ${lectieCount}`);
    log(`Questions: ${questionCount}`);

    log('\nDone!');
    log('='.repeat(80));

    await mongoose.disconnect();
    logStream.end();

  } catch (error) {
    log(`\nERROR: ${error.message}`);
    log(error.stack);
    logStream.end();
    process.exit(1);
  }
}

main();

// Flush log after a delay to ensure file is written
setTimeout(() => {
  process.exit(0);
}, 2000);

