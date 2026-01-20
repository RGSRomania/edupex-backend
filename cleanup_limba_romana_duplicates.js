const mongoose = require('mongoose');
require('dotenv').config();
const { Materie, Capitol, Lectie, UnitateDeInvatare, LectieQuestion } = require('./models/Lesson');
async function cleanupDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    // Get Limba Romana
    const materie = await Materie.findOne({ name: 'Limba Romana' });
    if (!materie) {
      throw new Error('Limba Romana not found');
    }
    console.log(`Cleaning up duplicate unitati for Limba Romana (ID: ${materie._id})\n`);
    // Get all unitati for Limba Romana
    const unitati = await UnitateDeInvatare.find({ materieId: materie._id }).sort({ name: 1 });
    console.log(`Total unitati before cleanup: ${unitati.length}\n`);
    // Group unitati by their normalized names (extract the number)
    const grouped = {};
    for (const u of unitati) {
      // Extract unitate number - e.g., "1" from "UNITATEA 1 -..." or "Unitatea 1:..."
      const numberMatch = u.name.match(/(\d+)/);
      const unitNumber = numberMatch ? numberMatch[1] : u.name;
      if (!grouped[unitNumber]) {
        grouped[unitNumber] = [];
      }
      grouped[unitNumber].push(u);
    }
    // Find and delete duplicates (keep the one with "UNITATEA" format)
    let deletedCount = 0;
    for (const key in grouped) {
      if (grouped[key].length > 1) {
        console.log(`\nFound ${grouped[key].length} versions for unit ${key}:`);
        // Sort - keep the one with "UNITATEA" (uppercase)
        grouped[key].sort((a, b) => {
          const aHasUNITATEA = a.name.toUpperCase().includes('UNITATEA');
          const bHasUNITATEA = b.name.toUpperCase().includes('UNITATEA');
          return bHasUNITATEA - aHasUNITATEA;
        });
        console.log(`  Keeping: "${grouped[key][0].name}"`);
        // Delete the rest
        for (let i = 1; i < grouped[key].length; i++) {
          const unitateToDelete = grouped[key][i];
          console.log(`  Deleting: "${unitateToDelete.name}" (ID: ${unitateToDelete._id})`);
          // Delete all capitole, lectii, and questions for this unitate
          const capitole = await Capitol.find({ unitateId: unitateToDelete._id });
          for (const capitol of capitole) {
            const lectii = await Lectie.find({ capitolId: capitol._id });
            for (const lectie of lectii) {
              await LectieQuestion.deleteMany({ lectieId: lectie._id });
            }
            await Lectie.deleteMany({ capitolId: capitol._id });
          }
          await Capitol.deleteMany({ unitateId: unitateToDelete._id });
          // Delete the unitate
          await UnitateDeInvatare.findByIdAndDelete(unitateToDelete._id);
          deletedCount++;
        }
      }
    }
    console.log(`\n${'='*50}`);
    console.log(`✅ Cleanup complete!`);
    console.log(`Deleted ${deletedCount} duplicate unitati`);
    // Verify
    const verifyUnitati = await UnitateDeInvatare.find({ materieId: materie._id });
    const verifyCapitole = await Capitol.find({ materieId: materie._id });
    console.log(`\nRemaining unitati: ${verifyUnitati.length}`);
    console.log(`Remaining capitole: ${verifyCapitole.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}
cleanupDuplicates();
