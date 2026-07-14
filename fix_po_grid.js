import fs from 'fs';
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');
content = content.replace(
  '<div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150 items-center">',
  '<div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150 items-start">'
);
fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
