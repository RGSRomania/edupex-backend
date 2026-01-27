const mongoose = require('mongoose');
require('dotenv').config();

const LectieSchema = new mongoose.Schema({}, { strict: false });
const Lectie = mongoose.model('Lectie', LectieSchema);

// Test the regex patterns with proper handling
function testFixes(text) {
  console.log('Original:', text);

  let fixed = text;

  // Test individual fixes - with proper Unicode character support
  const testCases = [
    [/\bn a /g, 'în a ', '"n a" → "în a"'],
    [/\bn e /g, 'în e ', '"n e" → "în e"'],
    [/nmultă/gi, 'înmultă', '"nmultă" → "înmultă"'],
    [/nmulți/gi, 'înmulți', '"nmulți" → "înmulți"'],
    [/nmulț/gi, 'înmulț', '"nmulț" → "înmulț"'],  // Handle ț specifically
    [/nmult/gi, 'înmult', '"nmult" → "înmult"'],
  ];

  testCases.forEach(([pattern, replacement, desc]) => {
    const original = fixed;
    fixed = fixed.replace(pattern, replacement);
    if (original !== fixed) {
      console.log(`✓ Applied: ${desc}`);
    } else {
      console.log(`✗ No match for: ${desc}`);
    }
  });

  console.log('Fixed:', fixed);
  console.log('');
}

// Test cases with actual Romanian text
console.log('=== Testing Regex Patterns ===\n');
testFixes('constă n a afla valoarea');
testFixes('nmulțește cu numărul');
testFixes('n e bună');

