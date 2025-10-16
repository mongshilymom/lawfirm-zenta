#!/usr/bin/env node

/**
 * Build and Package Script for Zenta Law Firm Template
 * Creates a commercial-ready zip file for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Starting Zenta Template Build Process...\n');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');
const PACKAGE_NAME = 'zenta-lawfirm-template';
const VERSION = require('../package.json').version;

// Files and folders to exclude from the package
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  '.vercel',
  '.env',
  '.env.local',
  'tsconfig.tsbuildinfo',
  '*.log',
  '.DS_Store',
  'Thumbs.db'
];

// Step 1: Clean previous builds
console.log('📁 Cleaning previous builds...');
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Step 2: Run type check
console.log('🔍 Running type check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.error('❌ Type check failed. Please fix TypeScript errors before packaging.\n');
  process.exit(1);
}

// Step 3: Run linting
console.log('🧹 Running ESLint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.warn('⚠️  Linting warnings found, but continuing...\n');
}

// Step 4: Build Next.js project
console.log('🏗️  Building Next.js project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed. Please fix errors before packaging.\n');
  process.exit(1);
}

// Step 5: Create clean package directory
console.log('📦 Creating package directory...');
const packageDir = path.join(OUTPUT_DIR, PACKAGE_NAME);
fs.mkdirSync(packageDir, { recursive: true });

// Step 6: Copy files (excluding patterns)
console.log('📋 Copying files...');
function shouldExclude(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (shouldExclude(src)) return;
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else if (stats.isFile()) {
    if (shouldExclude(src)) return;
    
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

const rootDir = path.join(__dirname, '..');
copyRecursive(rootDir, packageDir);
console.log('✅ Files copied\n');

// Step 7: Create .env.example if it doesn't exist
console.log('📝 Creating .env.example...');
const envExample = `# Zenta Law Firm Template Environment Variables

# Required: Your domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Required: Supabase credentials (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Formspree contact form (get from https://formspree.io/)
# Replace in app/contact/page.tsx
`;

fs.writeFileSync(path.join(packageDir, '.env.example'), envExample);
console.log('✅ .env.example created\n');

// Step 8: Create zip file
console.log('🗜️  Creating zip file...');
const zipFile = path.join(OUTPUT_DIR, `${PACKAGE_NAME}-v${VERSION}.zip`);

try {
  // Use platform-specific zip command
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync(`powershell Compress-Archive -Path "${packageDir}\\*" -DestinationPath "${zipFile}" -Force`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${OUTPUT_DIR}" && zip -r "${path.basename(zipFile)}" "${PACKAGE_NAME}"`, { stdio: 'inherit' });
  }
  console.log('✅ Zip file created\n');
} catch (error) {
  console.error('❌ Failed to create zip file:', error.message);
  process.exit(1);
}

// Step 9: Calculate file size
const stats = fs.statSync(zipFile);
const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('🎉 Package built successfully!\n');
console.log('📦 Package details:');
console.log(`   Name: ${PACKAGE_NAME}`);
console.log(`   Version: ${VERSION}`);
console.log(`   Size: ${fileSizeMB} MB`);
console.log(`   Location: ${zipFile}\n`);
console.log('✨ Ready for distribution!');
