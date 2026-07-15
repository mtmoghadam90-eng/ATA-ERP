import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

code = code.replace(/ \| 'supplier_inquiry_status_change'/g, '');
code = code.replace(/triggerType === 'supplier_inquiry_status_change' \? 'استعلام تامین‌کننده' : /g, '');

fs.writeFileSync('src/useERPStore.ts', code);
