const mongoose = require('mongoose');
const { Materie, Clasa, UnitateDeInvatare, Capitol, Lectie } = require('./models/Lesson');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  // Get Materie Ids
  const materii = await Materie.find();
  console.log('\n=== MATERII ===');
  materii.forEach(m => console.log(`${m.name}: ${m._id}`));
  // Get Matematica ID
  const mat = await Materie.findOne({ name: 'Matematica' });
  const limba = await Materie.findOne({ name: 'Limba Romana' });
  console.log('\n=== CLASES FOR MATEMATICA ===');
  const clasasMat = await Clasa.find({ materieId: mat._id });
  const clasaVMat = clasasMat[0];
  console.log(`Clasa V ID: ${clasaVMat._id}`);
  console.log('\n=== CLASES FOR LIMBA ROMANA ===');
  const clasasLimba = await Clasa.find({ materieId: limba._id });
  const clasaVLimba = clasasLimba[0];
  console.log(`Clasa V ID: ${clasaVLimba._id}`);
  console.log('\n=== UNITATI FOR MATEMATICA CLASA V ===');
  const unitatiMat = await UnitateDeInvatare.find({ clasaId: clasaVMat._id });
  console.log(`Found ${unitatiMat.length} unitati`);
  unitatiMat.slice(0, 2).forEach(u => console.log(`${u.name}: ${u._id}`));
  console.log('\n=== CAPITOLE FOR FIRST UNITATE (MATEMATICA) ===');
  const capitoleMat = await Capitol.find({ unitateId: unitatiMat[0]._id });
  console.log(`Found ${capitoleMat.length} capitole`);
  capitoleMat.slice(0, 2).forEach(c => console.log(`${c.name}: ${c._id}, materieId: ${c.materieId}`));
  console.log('\n=== LECTII FROM FIRST CAPITOL (MATEMATICA) ===');
  const lectiiMat = await Lectie.find({ capitolId: capitoleMat[0]._id });
  console.log(`Found ${lectiiMat.length} lectii`);
  lectiiMat.slice(0, 3).forEach(l => console.log(`- ${l.title}`));
  console.log('\n=== UNITATI FOR LIMBA ROMANA CLASA V ===');
  const unitatiLimba = await UnitateDeInvatare.find({ clasaId: clasaVLimba._id });
  console.log(`Found ${unitatiLimba.length} unitati`);
  unitatiLimba.slice(0, 2).forEach(u => console.log(`${u.name}: ${u._id}`));
  console.log('\n=== CAPITOLE FOR FIRST UNITATE (LIMBA ROMANA) ===');
  const capitoleLimba = await Capitol.find({ unitateId: unitatiLimba[0]._id });
  console.log(`Found ${capitoleLimba.length} capitole`);
  capitoleLimba.slice(0, 2).forEach(c => console.log(`${c.name}: ${c._id}, materieId: ${c.materieId}`));
  console.log('\n=== LECTII FROM FIRST CAPITOL (LIMBA ROMANA) ===');
  const lectiiLimba = await Lectie.find({ capitolId: capitoleLimba[0]._id });
  console.log(`Found ${lectiiLimba.length} lectii`);
  lectiiLimba.slice(0, 3).forEach(l => console.log(`- ${l.title}`));
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
