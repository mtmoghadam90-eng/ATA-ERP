import fs from 'fs';
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');

code = code.replace(/\{ id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان' \},\n\s*/g, '');
code = code.replace(/'supplierInquiries',\n\s*/g, '');
code = code.replace(/\{ id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', desc: 'مدیریت استعلام‌های قیمتی تامین‌کنندگان کالا، مقایسه پیشنهادات و آفرها', icon: HelpCircle \},\n\s*/g, '');

fs.writeFileSync('src/components/SettingsView.tsx', code);
