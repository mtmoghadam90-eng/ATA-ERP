const fs = require('fs');
const lines = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8').split('\n');
console.log(lines.slice(3610, 3650).join('\n'));
