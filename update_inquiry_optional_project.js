import fs from 'fs';

let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf-8');

content = content.replace(
  /<label className="block text-xs font-bold text-slate-700 mb-2">انتخاب پروژه \(کارفرما\) <span className="text-rose-500">\*<\/span><\/label>/g,
  `<label className="block text-xs font-bold text-slate-700 mb-2">انتخاب پروژه (کارفرما) <span className="text-slate-400 font-normal">(اختیاری)</span></label>`
);

content = content.replace(
  /onChange=\{e => \{\s*setSelectedProjectId\(e\.target\.value\);\s*\}\}\s*required/g,
  `onChange={e => setSelectedProjectId(e.target.value)}`
);

content = content.replace(
  /onChange=\{e => \{\s*setEditProjectId\(e\.target\.value\);\s*\}\}\s*required/g,
  `onChange={e => setEditProjectId(e.target.value)}`
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);

