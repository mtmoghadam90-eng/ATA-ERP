import fs from 'fs';
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');
content = content.replace(
  '<div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-center">',
  '<div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-start">'
);
fs.writeFileSync('src/components/ProformasView.tsx', content);
