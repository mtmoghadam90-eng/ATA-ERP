const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

// 1. Fix adjustProductStock prop type
content = content.replace(
  /adjustProductStock: \(id: string, amount: number, referenceId\?: string, referenceType\?: 'MANUAL' \| 'PURCHASE_ORDER' \| 'PROFORMA', notes\?: string, transactionDate\?: string\) => void;/,
  "adjustProductStock: (id: string, amount: number, variantId?: string, referenceId?: string, referenceType?: 'MANUAL' | 'PURCHASE_ORDER' | 'PROFORMA', notes?: string, transactionDate?: string) => void;"
);

// 2. Fix the sum in display
const oldTotalStock = `<span className={\`text-sm font-bold \${(p.stockLevel || 0) > 0 ? 'text-emerald-600' : 'text-red-500'}\`}>
                              {p.stockLevel || 0}
                            </span>`;
const newTotalStock = `<span className={\`text-sm font-bold \${(p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : p.stockLevel || 0) > 0 ? 'text-emerald-600' : 'text-red-500'}\`}>
                              {p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : p.stockLevel || 0}
                            </span>`;
content = content.replace(oldTotalStock, newTotalStock);

// 3. Fix initial stock computation when saving a product (addProduct/updateProduct)
const oldStockCalc = `stockLevel: supplyType === 'INVENTORY' ? Number(initialStock) || 0 : 0,`;
const newStockCalc = `stockLevel: supplyType === 'INVENTORY' ? (hasVariants ? variants.reduce((sum, v) => sum + (v.stockLevel || 0), 0) : Number(initialStock) || 0) : 0,`;
content = content.replace(/stockLevel: supplyType === 'INVENTORY' \? Number\(initialStock\) \|\| 0 : 0,/g, newStockCalc);

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Fixed stock calculations');
