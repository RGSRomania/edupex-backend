// Direct test without mongoose
function testFixes(text) {
  console.log('Original:', JSON.stringify(text));

  let fixed = text;

  // Direct simple replacements
  fixed = fixed.replace(/\bn a /g, 'în a ');
  console.log('After "n a" fix:', JSON.stringify(fixed));

  fixed = fixed.replace(/\bn e /g, 'în e ');
  console.log('After "n e" fix:', JSON.stringify(fixed));

  fixed = fixed.replace(/nmulț/gi, 'înmulț');
  console.log('After "nmulț" fix:', JSON.stringify(fixed));

  return fixed;
}

console.log('=== Test 1: "n a" pattern ===');
let result1 = testFixes('constă n a afla valoarea');
console.log('Final:', result1);

console.log('\n=== Test 2: "nmulț" pattern ===');
let result2 = testFixes('nmulțește cu numărul');
console.log('Final:', result2);

console.log('\n=== Test 3: "n e" pattern ===');
let result3 = testFixes('n e bună');
console.log('Final:', result3);

