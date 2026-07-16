const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The naive replace duplicated the prop everywhere `projects={store.projects}` was.
// We should remove all occurrences of `\n            supplierInquiries={store.supplierInquiries}`
// And only keep it where needed.

// Remove all injected duplicates
content = content.replace(/\n\s*supplierInquiries=\{store\.supplierInquiries\}/g, '');

// Now only add to PurchaseOrdersView
content = content.replace(
  `<PurchaseOrdersView \n            initialPrintDocId={printDocumentRequest?.module === 'purchaseOrders' ? printDocumentRequest.docId : undefined}\n            onClearInitialPrintDocId={handleClearPrintDoc}\n            purchaseOrders={store.purchaseOrders}\n            suppliers={store.suppliers}\n            projects={store.projects}\n            products={store.products}\n            exchangeRates={store.exchangeRates}\n            proformas={store.proformas}\n            addPurchaseOrder={store.addPurchaseOrder}`,
  `<PurchaseOrdersView \n            initialPrintDocId={printDocumentRequest?.module === 'purchaseOrders' ? printDocumentRequest.docId : undefined}\n            onClearInitialPrintDocId={handleClearPrintDoc}\n            purchaseOrders={store.purchaseOrders}\n            suppliers={store.suppliers}\n            projects={store.projects}\n            products={store.products}\n            exchangeRates={store.exchangeRates}\n            proformas={store.proformas}\n            supplierInquiries={store.supplierInquiries || []}\n            addPurchaseOrder={store.addPurchaseOrder}`
);

fs.writeFileSync('src/App.tsx', content);
