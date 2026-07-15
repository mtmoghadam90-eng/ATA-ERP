import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const regexFuncs = /\/\/ --- Supplier Inquiries ---[\s\S]*?\/\/ --- Packaging & Delivery ---/m;
code = code.replace(regexFuncs, '// --- Packaging & Delivery ---');

// permissions defaults
code = code.replace(/supplierInquiries: true,\n\s*/g, '');

// from return object
code = code.replace(/supplierInquiries,\n\s*/g, '');
code = code.replace(/addSupplierInquiry,\n\s*/g, '');
code = code.replace(/updateSupplierInquiry,\n\s*/g, '');
code = code.replace(/deleteSupplierInquiry,\n\s*/g, '');
code = code.replace(/addSupplierInquiryStep,\n\s*/g, '');
code = code.replace(/selectSupplierInquiryWinner,\n\s*/g, '');

fs.writeFileSync('src/useERPStore.ts', code);
