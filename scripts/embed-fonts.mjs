import fs from 'node:fs';
import path from 'node:path';

const weights = [
  { name: 'StudioFeixenSansTRIAL-Regular.ttf', weight: 400, style: 'normal' },
  { name: 'StudioFeixenSansTRIAL-RegularItalic.ttf', weight: 400, style: 'italic' },
  { name: 'StudioFeixenSansTRIAL-Medium.ttf', weight: 500, style: 'normal' },
  { name: 'StudioFeixenSansTRIAL-MediumItalic.ttf', weight: 500, style: 'italic' },
  { name: 'StudioFeixenSansTRIAL-Semibold.ttf', weight: 600, style: 'normal' },
  { name: 'StudioFeixenSansTRIAL-SemiboldItalic.ttf', weight: 600, style: 'italic' },
  { name: 'StudioFeixenSansTRIAL-Bold.ttf', weight: 700, style: 'normal' },
  { name: 'StudioFeixenSansTRIAL-BoldItalic.ttf', weight: 700, style: 'italic' },
  { name: 'StudioFeixenSansTRIAL-Light.ttf', weight: 300, style: 'normal' },
  { name: 'StudioFeixenSansTRIAL-Ultralight.ttf', weight: 200, style: 'normal' }
];

let css = '/* --- Base64 Embedded Studio Feixen Sans --- */\n';
for (const w of weights) {
  const filePath = path.join('public', 'fonts', 'feixen-sans', w.name);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath).toString('base64');
    css += `@font-face {\n  font-family: 'Studio Feixen Sans';\n  src: url('data:font/truetype;charset=utf-8;base64,${data}') format('truetype');\n  font-weight: ${w.weight};\n  font-style: ${w.style};\n  font-display: swap;\n}\n\n`;
  }
}

fs.writeFileSync('src/app/fonts-embedded.css', css);
console.log('Successfully generated src/app/fonts-embedded.css, size:', fs.statSync('src/app/fonts-embedded.css').size);
