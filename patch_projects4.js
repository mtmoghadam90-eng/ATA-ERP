import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

// I will just use sed or manually replace the block.
const blockToRemove = code.substring(code.indexOf('projectInquiries.forEach(inq => {'), code.indexOf('// 4. Packaging Deliveries'));
code = code.replace(blockToRemove, '');
code = code.replace(/    ,      \{ id: 'supplier_inquiry', name: 'استعلام از تامین‌کنندگان', desc: 'اسناد و فرم‌های استعلام از تامین‌کنندگان خارجی و داخلی', iconBg: 'bg-orange-50 text-orange-600 border-orange-100', icon: Briefcase \}\];/g, '];');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
