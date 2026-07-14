import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');
content = content.replace(
  'resumeProjectCategoryGroup,\n',
  'resumeProjectCategoryGroup,\n    deleteProjectCategoryGroup,\n'
);
content = content.replace(
  'resumeProjectCategoryGroup,\r\n',
  'resumeProjectCategoryGroup,\r\n    deleteProjectCategoryGroup,\r\n'
);
fs.writeFileSync('src/useERPStore.ts', content);
console.log('Fixed return');
