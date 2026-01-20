const mongoose = require('mongoose');
require('dotenv').config();
const { Materie, Capitol, UnitateDeInvatare } = require('./models/Lesson');
async function checkCapitole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    // Get Matematica
    const materie = await Materie.findOne({ name: 'Matematica' });
    console.log('Matematica ID:', materie?._id);
    if (materie) {
      // Count unitati for Matematica
      const unitati = await UnitateDeInvatare.find({ materieId: materie._id });
      console.log(`\nTotal Unitati for Matematica: ${unitati.length}`);
      for (const unitate of unitati) {
        const capitole = await Capitol.find({ unitateId: unitate._id });
        console.log(`  ${unitate.name}: ${capitole.length} capitole`);
      }
      // Total capitole
      const totalCapitole = await Capitol.find({ materieId: materie._id });
      console.log(`\nTotal Capitole for Matematica: ${totalCapitole.length}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
checkCapitole();
