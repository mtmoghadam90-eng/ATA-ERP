import fs from 'fs';
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
code = code.replace(/\{ id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', icon: HelpCircle \},\n/g, '');
fs.writeFileSync('src/components/Sidebar.tsx', code);
