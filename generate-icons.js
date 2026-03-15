/**
 * Script pour générer les icônes PNG depuis le SVG.
 * Requiert: npm install sharp
 * Usage: node generate-icons.js
 */
const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, 'www/icons/icon.svg');
const sizes = [192, 512];

(async () => {
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `www/icons/icon-${size}.png`));
    console.log(`✓ icon-${size}.png généré`);
  }
})();
