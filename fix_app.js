import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  'resumeProjectCategoryGroup={store.resumeProjectCategoryGroup}',
  'resumeProjectCategoryGroup={store.resumeProjectCategoryGroup}\n            deleteProjectCategoryGroup={store.deleteProjectCategoryGroup}'
);
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed App.tsx');
