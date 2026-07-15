import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const regex = /\/\/ --- Supplier Inquiries ---[\s\S]*?\/\/ --- Packaging & Delivery ---/m;
code = code.replace(regex, '// --- Packaging & Delivery ---');

code = code.replace(/const \[supplierInquiries, setSupplierInquiries\] = useState<SupplierInquiry\[\]>\(\[\]\);\n\s*/g, '');

fs.writeFileSync('src/useERPStore.ts', code);
