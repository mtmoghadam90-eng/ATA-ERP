const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

content = content.replace(
  "setStockAdjustType('IN');\n                              setStockModalOpen(true);",
  "setStockAdjustType('IN');\n                              setStockAdjustVariantId('');\n                              setStockModalOpen(true);"
);

fs.writeFileSync('src/components/ProductsView.tsx', content);
