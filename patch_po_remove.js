import fs from 'fs';
let code = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf8');

const hookRegex = /\s*React\.useEffect\(\(\) => \{\n\s*if \(initialPrintDocId\) \{\n\s*const po = purchaseOrders\.find\(p => p\.id === initialPrintDocId\);\n\s*if \(po\) \{\n\s*handleOpenPrint\(po\);\n\s*\}\n\s*onClearInitialPrintDocId\?\.\(\);\n\s*\}\n\s*\}, \[initialPrintDocId, purchaseOrders\]\);/g;

code = code.replace(hookRegex, '');
fs.writeFileSync('src/components/PurchaseOrdersView.tsx', code);

code = fs.readFileSync('src/components/PackagingDeliveryView.tsx', 'utf8');
const hookRegex2 = /\s*React\.useEffect\(\(\) => \{\n\s*if \(initialPrintDocId\) \{\n\s*const pd = packagingDeliveries\.find\(p => p\.id === initialPrintDocId\);\n\s*if \(pd\) \{\n\s*handleOpenPrint\(pd\);\n\s*\}\n\s*onClearInitialPrintDocId\?\.\(\);\n\s*\}\n\s*\}, \[initialPrintDocId, packagingDeliveries\]\);/g;

code = code.replace(hookRegex2, '');
fs.writeFileSync('src/components/PackagingDeliveryView.tsx', code);
