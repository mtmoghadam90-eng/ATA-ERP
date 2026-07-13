import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /operator: 'equals' \| 'not_equals';/,
  "operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than';"
);

fs.writeFileSync('src/types.ts', content);

