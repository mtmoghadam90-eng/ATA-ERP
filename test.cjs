const fs = require('fs');
const content = fs.readFileSync('src/useERPStore.ts', 'utf-8');
const match = content.match(/const saveToStorage =[\s\S]*?};/);
console.log(match[0]);
