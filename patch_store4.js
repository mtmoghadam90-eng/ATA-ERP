import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const regex = /\/\/ --- Supplier Inquiries CRUD ---[\s\S]*?\/\/ --- Packaging & Delivery ---/m;
code = code.replace(regex, '// --- Packaging & Delivery ---');

// And remove from imports
code = code.replace(/SupplierInquiry,\n\s*/g, '');
code = code.replace(/InquiryStep,\n\s*/g, '');

// Also remove from localForage fetches
code = code.replace(/fetchKey\('erp_supplier_inquiries', setSupplierInquiries, \[\]\),\n\s*/g, '');

fs.writeFileSync('src/useERPStore.ts', code);
