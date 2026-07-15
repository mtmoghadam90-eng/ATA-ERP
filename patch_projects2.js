import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const regex = /\/\/ 3\.5\. Supplier Inquiries[\s\S]*?\/\/ 4\. System Documents/m;
code = code.replace(regex, '// 4. System Documents');

// I also see folderFiles['استعلام از تامین‌کنندگان'] being defined somewhere.
code = code.replace(/'استعلام از تامین‌کنندگان': \[\](?:,\n\s*)?/, '');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
