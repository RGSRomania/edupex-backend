#!/usr/bin/env node

/**
 * Excel Export Script - Matematica Clasa 5
 *
 * This script creates an Excel file from the lesson structure
 * Install xlsx first: npm install xlsx
 *
 * Usage:
 * node backend/utils/generateExcel.js
 */

const fs = require('fs');
const path = require('path');

const matematica5Data = require('../Matematica_Clasa_5_Complete.json');

// Try to use xlsx if available, otherwise create a CSV
let useXLSX = false;
try {
  require('xlsx');
  useXLSX = true;
} catch (e) {
  console.log('⚠️  xlsx package not installed. Generating CSV instead.');
  console.log('To generate Excel: npm install xlsx');
}

async function generateExcel() {
  try {
    console.log('📊 Generating spreadsheet for Matematica Clasa 5...\n');

    if (useXLSX) {
      generateXLSX();
    } else {
      generateCSV();
    }
  } catch (error) {
    console.error('❌ Error generating spreadsheet:', error.message);
    process.exit(1);
  }
}

function generateXLSX() {
  const XLSX = require('xlsx');
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Matematica Clasa 5 - Lesson Structure'],
    [''],
    ['Capitol', 'Numere Capitole', 'Total Lectii'],
  ];

  let totalLectii = 0;
  for (const unitate of matematica5Data.unitati) {
    for (const capitol of unitate.capitole) {
      summaryData.push([
        capitol.name,
        'Licitii: ' + capitol.lectii.length,
        capitol.lectii.length
      ]);
      totalLectii += capitol.lectii.length;
    }
  }

  summaryData.push(['', '', '']);
  summaryData.push(['TOTAL', '', totalLectii]);

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Detailed Lectii sheet
  const lectiiData = [
    ['Capitol', 'Lectie', 'Summary', 'Dificultate', 'Timp Estimat (min)'],
  ];

  for (const unitate of matematica5Data.unitati) {
    for (const capitol of unitate.capitole) {
      for (const lectie of capitol.lectii) {
        lectiiData.push([
          capitol.name,
          lectie.title,
          lectie.summary,
          lectie.difficulty || 'medium',
          lectie.estimatedTime || 12
        ]);
      }
    }
  }

  const lectiiSheet = XLSX.utils.aoa_to_sheet(lectiiData);
  XLSX.utils.book_append_sheet(workbook, lectiiSheet, 'Lectii');

  // Save
  const outputPath = path.join(__dirname, '../../Matematica_Clasa_5.xlsx');
  XLSX.writeFile(workbook, outputPath);
  console.log(`✅ Excel file created: ${outputPath}`);
}

function generateCSV() {
  const csvContent = [
    'Capitol,Lectie,Summary,Dificultate,Timp Estimat'
  ];

  for (const unitate of matematica5Data.unitati) {
    for (const capitol of unitate.capitole) {
      for (const lectie of capitol.lectii) {
        const row = [
          `"${capitol.name}"`,
          `"${lectie.title}"`,
          `"${lectie.summary}"`,
          lectie.difficulty || 'medium',
          lectie.estimatedTime || 12
        ].join(',');
        csvContent.push(row);
      }
    }
  }

  const outputPath = path.join(__dirname, '../../Matematica_Clasa_5.csv');
  fs.writeFileSync(outputPath, csvContent.join('\n'), 'utf-8');
  console.log(`✅ CSV file created: ${outputPath}`);
  console.log('\nTo convert to Excel, open with Excel and save as .xlsx');
}

generateExcel();

