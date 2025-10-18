const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Simple placeholder SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#FF0000"/>
  <circle cx="256" cy="256" r="180" fill="#FFFFFF"/>
  <circle cx="256" cy="256" r="120" fill="#FF0000"/>
  <text x="256" y="280" text-anchor="middle" font-size="80" font-weight="bold" fill="#FFFFFF">REC</text>
</svg>`;

// Save SVG icon
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

// Create simple placeholder PNG files (using data URL technique)
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Base64 encoded 1x1 red pixel PNG
const redPixelPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  console.log(`Creating ${filename}...`);

  // For now, we'll use the same placeholder for all sizes
  // In production, you would generate proper sized icons
  fs.writeFileSync(path.join(iconsDir, filename), redPixelPNG);
});

console.log('✅ Icon files created successfully!');
console.log('Note: These are placeholder icons. Use generate-icons.html to create proper icons.');