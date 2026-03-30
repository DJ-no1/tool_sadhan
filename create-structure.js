const fs = require('fs');
const path = require('path');

// Define all directories to create (using forward slashes - Node will handle conversion)
const directories = [
  'lib',
  'types',
  'docs',
  'components/ui',
  'components/layout',
  'components/shared',
  'app/tools/pdf',
  'app/tools/pdf/merge',
  'app/tools/pdf/compress',
  'app/tools/pdf/split',
  'app/tools/pdf/convert',
  'app/tools/image',
  'app/tools/image/compress',
  'app/tools/image/resize',
  'app/tools/image/convert',
  'app/tools/video',
  'app/tools/video/compress',
  'app/tools/video/convert'
];

// First, remove incorrectly named flat directories if they exist
const incorrectDirs = [
  'componentsui',
  'componentslayout', 
  'componentsshared',
  'apptoolspdf',
  'apptoolsimage',
  'apptoolsvideo'
];

console.log('🧹 Cleaning up incorrect folders...\n');
incorrectDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✓ Removed ${dir}`);
  }
});

// Create proper nested directories
console.log('\n🚀 Creating proper folder structure...\n');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created ${dir}`);
  } else {
    console.log(`→ ${dir} already exists`);
  }
});

console.log('\n✨ Directory structure created successfully!');
console.log('\nYou should now see:');
console.log('  components/');
console.log('    ├── ui/');
console.log('    ├── layout/');
console.log('    └── shared/');
console.log('  app/tools/');
console.log('    ├── pdf/ (with merge, compress, split, convert)');
console.log('    ├── image/ (with compress, resize, convert)');
console.log('    └── video/ (with compress, convert)');
