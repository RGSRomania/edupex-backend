// Test script to demonstrate text cleaning without database import
const fs = require('fs');
const path = require('path');

/**
 * Cleans and formats text content to make it more readable
 * @param {string} content - The raw content from text files
 * @returns {string} - Cleaned and formatted content
 */
function cleanTextContent(content) {
  if (!content) return '';

  // Replace common OCR errors for Romanian characters
  let cleaned = content;
  cleaned = cleaned.replace(/\bn\b/g, 'în');
  cleaned = cleaned.replace(/\bsi\b/g, 'și');
  cleaned = cleaned.replace(/\bdreapt\\\s*([a-z])/gi, 'dreapta $1');
  cleaned = cleaned.replace(/distan\\ei/g, 'distanței');
  cleaned = cleaned.replace(/distan\\a/g, 'distanța');
  cleaned = cleaned.replace(/\\\s*([a-z])/g, 'ț$1');
  cleaned = cleaned.replace(/@n/g, 'în');
  cleaned = cleaned.replace(/@î/g, 'în');
  cleaned = cleaned.replace(/\[/g, 'ă');
  cleaned = cleaned.replace(/fi\\/g, 'și');
  cleaned = cleaned.replace(/calculat\[\s+/g, 'calculată ');
  cleaned = cleaned.replace(/Av`nd/g, 'Având');
  cleaned = cleaned.replace(/g[a\[]sim/g, 'găsim');
  cleaned = cleaned.replace(/ob\\inem/g, 'obținem');
  cleaned = cleaned.replace(/Calcula\\i/g, 'Calculați');

  // Fix mathematical symbols
  cleaned = cleaned.replace(/∢/g, 'unghiul');
  cleaned = cleaned.replace(/∆/g, 'triunghiul');
  cleaned = cleaned.replace(/≡/g, '≡');
  cleaned = cleaned.replace(/perpendicular[a]?\s*\./g, 'perpendiculara ');

  // Fix special notation for points, angles, triangles
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])\b/g, '$1$2$3');
  cleaned = cleaned.replace(/\b([A-Z])\s+([A-Z])\b/g, '$1$2');
  cleaned = cleaned.replace(/\b([A-Z])\s*⊥\s*([A-Z])/g, '$1 perpendicular pe $2');
  cleaned = cleaned.replace(/\b∠\s*([A-Z])/g, 'unghiul $1');

  // Fix mathematical operations
  cleaned = cleaned.replace(/(\d+)\s*\^\s*(\d+)/g, '$1^$2');
  cleaned = cleaned.replace(/(\d+)\s*\*\s*(\d+)/g, '$1×$2');

  // Fix special paragraphs for problem solving
  cleaned = cleaned.replace(/Problem[a\[]?\s*rezolvat[a\[]?/g, 'Problemă rezolvată:');
  cleaned = cleaned.replace(/Solu\\ie/g, 'Soluție:');

  // Better handling of parentheses in mathematical expressions
  cleaned = cleaned.replace(/\(\s*([A-Za-z0-9]+)\s*,\s*([A-Za-z0-9]+)\s*\)/g, '($1,$2)');
  cleaned = cleaned.replace(/d\s*\(\s*([A-Za-z])\s*,\s*([A-Za-z0-9]+)\s*\)/g, 'd($1,$2)');

  // Fix distance notation
  cleaned = cleaned.replace(/d\s*\(\s*([A-Z])\s*,\s*([A-Z][A-Z])\s*\)/g, 'distanța de la $1 la dreapta $2');

  // Fix measurement units
  cleaned = cleaned.replace(/(\d+)\s*cm/g, '$1 cm');

  // Replace strange characters with their common equivalents
  cleaned = cleaned.replace(/…/g, '...');
  cleaned = cleaned.replace(/◗/g, '-');

  // Special case for "in triunghiul"
  cleaned = cleaned.replace(/@în triunghiul/g, 'În triunghiul');
  cleaned = cleaned.replace(/@n triunghiul/g, 'În triunghiul');

  // Special case for angle measurements
  cleaned = cleaned.replace(/([A-Z])\s*=\s*(\d+)/g, '$1 = $2°');

  // Format nicely with paragraphs - mathematical text needs better separation
  cleaned = cleaned.split(/\.(?=\s*[A-Z])/).filter(p => p.trim()).join('.\n\n');

  // Keep lowercase letters after period in same paragraph
  cleaned = cleaned.replace(/\.\n\n\s*([a-z])/g, '. $1');

  return cleaned;
}

// Main function to demonstrate text cleaning
async function demonstrateTextCleaning() {
  const txtPath = '/Users/mdica/Downloads/Manuale/Clasa V/Matematica/exemplu-matematica.txt';

  if (!fs.existsSync(txtPath)) {
    console.error(`File not found: ${txtPath}`);
    return;
  }

  // Read raw text content
  const rawText = fs.readFileSync(txtPath, 'utf8');

  // Clean the text content
  const cleanedText = cleanTextContent(rawText);

  console.log('========== ORIGINAL TEXT WITH OCR ARTIFACTS ==========');
  console.log(rawText.substring(0, 500) + '...');
  console.log('\n\n========== CLEANED TEXT WITH FIXES ==========');
  console.log(cleanedText.substring(0, 500) + '...');

  // Also save the cleaned content to a new file
  const cleanedFilePath = '/Users/mdica/Downloads/Manuale/Clasa V/Matematica/exemplu-matematica-cleaned.txt';
  fs.writeFileSync(cleanedFilePath, cleanedText);
  console.log(`\nCleaned text has been saved to: ${cleanedFilePath}`);
}

demonstrateTextCleaning().catch(err => {
  console.error('Error:', err);
});
