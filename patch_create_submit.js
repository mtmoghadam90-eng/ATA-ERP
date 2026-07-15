import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  /<button\n\s*type="submit"\n\s*className="bg-sky-500 text-white text-xs font-bold px-5 py-2\.5 rounded-lg hover:bg-sky-600 transition"\n\s*>\n\s*ثبت نهایی و ایجاد پرونده استعلام/g,
  '<button\n              type="submit"\n              disabled={isUploadingTech || isUploadingFin}\n              className="bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-sky-600 transition disabled:opacity-50"\n            >\n              ثبت نهایی و ایجاد پرونده استعلام'
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
