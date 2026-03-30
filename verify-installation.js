const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Video Converter Tool Installation...\n');

const checks = [
  {
    name: 'Components Directory',
    path: 'components/tools/video',
    type: 'directory'
  },
  {
    name: 'Main Converter Component',
    path: 'components/tools/video/video-to-jpg-converter.tsx',
    type: 'file'
  },
  {
    name: 'Features Component',
    path: 'components/tools/video/video-converter-features.tsx',
    type: 'file'
  },
  {
    name: 'FAQ Component',
    path: 'components/tools/video/video-converter-faq.tsx',
    type: 'file'
  },
  {
    name: 'Index Export',
    path: 'components/tools/video/index.ts',
    type: 'file'
  },
  {
    name: 'Convert Page',
    path: 'app/tools/video/convert/page.tsx',
    type: 'file'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const fullPath = path.join(__dirname, check.path);
  const exists = check.type === 'directory' 
    ? fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
    : fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  
  if (exists) {
    console.log(`✅ ${check.name}`);
    if (check.type === 'file') {
      const stats = fs.statSync(fullPath);
      console.log(`   └─ ${(stats.size / 1024).toFixed(2)} KB`);
    }
  } else {
    console.log(`❌ ${check.name} - NOT FOUND`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\n🎉 Installation successful!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/tools/video/convert');
  console.log('\nOr import components:');
  console.log('import { VideoToJpgConverter } from "@/components/tools/video"');
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('\n📝 To fix:');
  console.log('1. Run: node install-video-tool.js');
  console.log('2. Or double-click: install-video-tool.bat');
}

console.log('\n' + '='.repeat(50) + '\n');
