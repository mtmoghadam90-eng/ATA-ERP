const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(/export interface ProductFeature \{\n  id: string;\n  name: string;\n  options: ProductFeatureOption\[\];\n\}/, 
`export interface ProductFeature {
  id: string;
  name: string;
  code?: string;
  options: ProductFeatureOption[];
}`);

fs.writeFileSync('src/types.ts', content);
console.log('Fixed ProductFeature type');
