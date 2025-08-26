const fs = require('fs');
const path = require('path');

// Simple SVG icon generator for Upraze
function generateSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <path d="M${size * 0.3} ${size * 0.4} L${size * 0.5} ${size * 0.6} L${size * 0.7} ${size * 0.4}" 
        stroke="white" stroke-width="${size * 0.08}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${size * 0.5}" cy="${size * 0.3}" r="${size * 0.08}" fill="white"/>
</svg>`;
}

// Sizes for PWA icons
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(publicDir, filename);
  
  // For now, we'll create a simple text file with SVG content
  // In production, you'd use a library like sharp to convert SVG to PNG
  fs.writeFileSync(filepath.replace('.png', '.svg'), svg);
  console.log(`Generated ${filename.replace('.png', '.svg')}`);
});

// Create apple touch icon
const appleIcon = generateSVG(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleIcon);
console.log('Generated apple-touch-icon.svg');

console.log('\nNote: These are SVG placeholders. For production, convert to PNG using a tool like sharp.');
