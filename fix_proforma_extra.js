import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /finalAmount: number;/,
  `finalAmount: number;
  extraCosts?: number;`
);

fs.writeFileSync('src/types.ts', content);

