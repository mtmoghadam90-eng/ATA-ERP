import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

// Replace handleEditInquirySubmit submit button
code = code.replace(
  /<button\n\s*type="submit"\n\s*className="bg-sky-500 text-white text-xs font-bold px-5 py-2\.5 rounded-lg hover:bg-sky-600 transition"\n\s*>\n\s*ذخیره تغییرات/g,
  '<button\n                type="submit"\n                disabled={isUploadingEditTech || isUploadingEditFin}\n                className="bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-sky-600 transition disabled:opacity-50"\n              >\n                ذخیره تغییرات'
);

code = code.replace(
  /<button\n\s*type="submit"\n\s*className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition"\n\s*>\n\s*ثبت آفر و بروزرسانی استعلام به «پاسخ داده شده»/g,
  '<button\n                type="submit"\n                disabled={isUploadingAnswerTech || isUploadingAnswerFin}\n                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"\n              >\n                ثبت آفر و بروزرسانی استعلام به «پاسخ داده شده»'
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
