import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const regex = /\/\/ --- Supplier Inquiries CRUD ---[\s\S]*?\/\/ --- Tasks CRUD ---/m;
code = code.replace(regex, '// --- Tasks CRUD ---');

fs.writeFileSync('src/useERPStore.ts', code);
