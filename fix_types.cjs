const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(/  variantId\?: string;\n  variantId\?: string;/g, '  variantId?: string;');
fs.writeFileSync('src/types.ts', content);
