import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

content = content.replace(/if \(!closingDate\) setClosingDate\(today\);/g, '');

fs.writeFileSync('src/components/ProjectsView.tsx', content);
