import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(/<button\s+onClick=\{\(\) => \{[^}]+\}\}\s+className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1\.5 rounded-lg transition-colors shrink-0"/g, '<button type="button" onClick={(e) => { e.preventDefault(); ' + "className=\"text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0\"".replace(/className/, ''));

code = code.replace(/<button\s+onClick=\{\(\) => document\.getElementById/g, '<button type="button" onClick={() => document.getElementById');

code = code.replace(/<button\s+onClick=\{\(\) => \{ setEditingInquiry\(null\)/g, '<button type="button" onClick={() => { setEditingInquiry(null)');

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
