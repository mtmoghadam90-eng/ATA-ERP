import fs from 'fs';
let code = fs.readFileSync('src/components/UsersView.tsx', 'utf8');

code = code.replace(/supplierInquiries: true,\n\s*/g, '');
code = code.replace(/\{ id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', desc: 'ثبت استعلام قیمت، مقایسه آفرها و انتخاب آفر برنده تامین‌کنندگان' \},\n\s*/g, '');

fs.writeFileSync('src/components/UsersView.tsx', code);
