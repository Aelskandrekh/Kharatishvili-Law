#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate version based on current timestamp
const version = Date.now();
const versionString = `v=${version}`;

console.log(`🚀 Building with version: ${version}`);

// Files to update with cache-busting parameters
const htmlFiles = [
  'index.html',
  'about.html',
  'services.html',
  'contact.html', 
  'resources.html',
  'admin.html',
  'article.html',
  'services-new.html',
  // Georgian language files
  'index-ka.html',
  'about-ka.html', 
  'services-ka.html',
  'contact-ka.html',
  'resources-ka.html',
  'team-ka.html'
];

// Function to update asset references in HTML file
function updateAssetReferences(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS references
  const cssRegex = /href="styles\.css(\?v=\d+)?"/g;
  if (content.match(cssRegex)) {
    content = content.replace(cssRegex, `href="styles.css?${versionString}"`);
    updated = true;
  }

  // Update JS references 
  const jsRegex = /src="script\.js(\?v=\d+)?"/g;
  if (content.match(jsRegex)) {
    content = content.replace(jsRegex, `src="script.js?${versionString}"`);
    updated = true;
  }

  // Update admin.js references
  const adminJsRegex = /src="admin\.js(\?v=\d+)?"/g;
  if (content.match(adminJsRegex)) {
    content = content.replace(adminJsRegex, `src="admin.js?${versionString}"`);
    updated = true;
  }

  // Update service worker registration to force update
  const swRegex = /navigator\.serviceWorker\.register\('\/sw\.js(\?v=\d+)?'\)/g;
  if (content.match(swRegex)) {
    content = content.replace(swRegex, `navigator.serviceWorker.register('/sw.js?${versionString}')`);
    updated = true;
  }

  // Also update preload references if they exist
  const preloadCssRegex = /href="styles\.css(\?v=\d+)?" as="style"/g;
  if (content.match(preloadCssRegex)) {
    content = content.replace(preloadCssRegex, `href="styles.css?${versionString}" as="style"`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ️  No updates needed: ${path.basename(filePath)}`);
  }
}

// Update service worker with new cache version
function updateServiceWorker() {
  const swPath = 'sw.js';
  if (!fs.existsSync(swPath)) {
    console.log(`⚠️  Service worker not found: ${swPath}`);
    return;
  }

  let content = fs.readFileSync(swPath, 'utf8');
  
  // Update cache version in service worker
  const cacheVersionRegex = /const CACHE_VERSION = \d+;/;
  content = content.replace(cacheVersionRegex, `const CACHE_VERSION = ${version};`);
  
  fs.writeFileSync(swPath, content);
  console.log(`✅ Updated service worker cache version: ${version}`);
}

// Main build process
function build() {
  console.log('🔧 Starting build process...\n');

  // Update all HTML files
  htmlFiles.forEach(file => {
    updateAssetReferences(file);
  });

  // Update service worker
  updateServiceWorker();

  console.log(`\n🎉 Build completed successfully!`);
  console.log(`📦 Version: ${version}`);
  console.log(`🚀 Ready to deploy with cache-busting enabled`);
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build, version };