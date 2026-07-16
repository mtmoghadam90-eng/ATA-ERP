const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(/export interface ProductFeatureOption \{\n  id: string;\n  value: string;\n\}/, 
`export interface ProductFeatureOption {
  id: string;
  value: string;
  code?: string;
}`);

fs.writeFileSync('src/types.ts', content);
console.log('Fixed ProductFeatureOption type');
