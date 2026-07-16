const fs = require('fs');

function updatePurchaseOrdersView() {
  let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');

  // We need to find where supplyMethod is determined
  content = content.replace(/prod\.supplyType === "ORDER" \? "ORDER" : "INVENTORY"/g, `(prod.stockLevel === 0 ? "ORDER" : prod.supplyType) === "ORDER" ? "ORDER" : "INVENTORY"`);

  fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
}

function updateQuickAddModal() {
  let content = fs.readFileSync('src/components/QuickAddModal.tsx', 'utf-8');

  // Fix dropdown text
  content = content.replace(/\(موجودی: \$\{v\.stockLevel \|\| 0\}\)/g, `(\${(v.stockLevel || 0) > 0 ? \`موجودی: \${v.stockLevel}\` : 'قابل سفارش'})`);
  
  // For standard products
  // Wait, how are standard products rendered in QuickAddModal?
  content = content.replace(/\(موجودی: \$\{p\.stockLevel \|\| 0\}\)/g, `(\${(p.stockLevel || 0) > 0 ? \`موجودی: \${p.stockLevel}\` : 'قابل سفارش'})`);

  fs.writeFileSync('src/components/QuickAddModal.tsx', content);
}

updatePurchaseOrdersView();
updateQuickAddModal();
