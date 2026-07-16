const fs = require('fs');
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');

// Update imports
content = content.replace(
  `import { PurchaseOrder, Supplier, Project, Product, PurchaseOrderItem, ExchangeRate, ERPSettings, Proforma, Customer } from '../types';`,
  `import { PurchaseOrder, Supplier, Project, Product, PurchaseOrderItem, ExchangeRate, ERPSettings, Proforma, Customer, SupplierInquiry } from '../types';`
);

// Update props interface
content = content.replace(
  `  products: Product[];`,
  `  products: Product[];
  supplierInquiries?: SupplierInquiry[];`
);

// Update component signature
content = content.replace(
  `  proformas,`,
  `  proformas,
  supplierInquiries = [],`
);

fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
