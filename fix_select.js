import fs from 'fs';
let content = fs.readFileSync('src/components/SearchableSelect.tsx', 'utf-8');
content = content.replace(
  '<div className="absolute z-50 mt-1 w-full rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-fade-in text-right">',
  '<div className="absolute z-[100] mt-1 min-w-full w-max max-w-[90vw] sm:max-w-2xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-fade-in text-right">'
);
content = content.replace(
  '<span className="truncate flex-1">{opt.label}</span>',
  '<span className="flex-1 whitespace-normal break-words leading-relaxed text-right">{opt.label}</span>'
);
fs.writeFileSync('src/components/SearchableSelect.tsx', content);
