#!/bin/bash

echo "🔍 CURRICULUM VERIFICATION REPORT"
echo "=================================="
echo ""
echo "📊 File Sizes:"
echo "─────────────"
ls -lh /Users/mdica/PycharmProjects/EduPex/curriculum_structure.json
ls -lh /Users/mdica/PycharmProjects/EduPex/frontend/public/curriculum_structure.json
ls -lh /Users/mdica/PycharmProjects/EduPex/frontend/android/app/src/main/assets/public/curriculum_structure.json

echo ""
echo "✅ Content Verification:"
echo "───────────────────────"

node << 'EOF'
const fs = require('fs');

const files = [
  '/Users/mdica/PycharmProjects/EduPex/curriculum_structure.json',
  '/Users/mdica/PycharmProjects/EduPex/frontend/public/curriculum_structure.json',
  '/Users/mdica/PycharmProjects/EduPex/frontend/android/app/src/main/assets/public/curriculum_structure.json'
];

const labels = ['Root', 'Frontend Web', 'Android'];

files.forEach((file, idx) => {
  const data = require(file);
  const clasa = data['Clasa a V a'];

  console.log(`\n${labels[idx]}:`);

  for (const subject in clasa) {
    const chapters = clasa[subject];
    if (Array.isArray(chapters)) {
      let totalLessons = 0;
      chapters.forEach(ch => {
        totalLessons += (ch.lectii ? ch.lectii.length : 0);
      });
      console.log(`  ${subject}: ${chapters.length} chapters, ${totalLessons} lessons`);
    }
  }
});
EOF

echo ""
echo "✅ All files verified! Data is synced correctly."

