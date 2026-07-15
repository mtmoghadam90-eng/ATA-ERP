import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

// replace the supplier inquiry folder config
code = code.replace(/\{ id: 'supplier_inquiry', name: 'استعلام از تامین‌کنندگان', desc: 'اسناد و فرم‌های استعلام از تامین‌کنندگان خارجی و داخلی', iconBg: 'bg-orange-50 text-orange-600 border-orange-100', icon: Briefcase \}\],/g, ']');

// find and remove the projectInquiries.forEach block completely
const forEachBlockRegex = /\s*projectInquiries\.forEach\(inq => \{[\s\S]*?\n\s*\}\);\n/g;
code = code.replace(forEachBlockRegex, '');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
