const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up video converter tool structure...\n');

try {
  // Run the setup script
  execSync('node create-tool-dirs.js', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n✓ All files and directories created successfully!');
  console.log('\nNext steps:');
  console.log('1. Check components/tools/video/ for the modular components');
  console.log('2. Visit http://localhost:3000/tools/video/convert to see the tool');
  console.log('3. Run "npm run dev" if the dev server is not running');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
