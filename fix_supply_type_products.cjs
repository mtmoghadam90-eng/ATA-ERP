const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

// Inside the table rendering for ProductsView
// First, find the span that renders supplyType
const oldBadge = `<span className={\`text-xs font-semibold px-2 py-1 rounded-md inline-block w-max \${
                          p.supplyType === 'INVENTORY' ? 'bg-indigo-50 text-indigo-700' :
                          p.supplyType === 'ORDER' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }\`}>
                          {p.supplyType === 'ORDER' ? 'قابل سفارش' : 'موجود در انبار'}
                        </span>`;

const newBadge = `
                        {(() => {
                          const totalStock = p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : (p.stockLevel || 0);
                          const effectiveSupplyType = totalStock === 0 ? 'ORDER' : (p.supplyType || 'INVENTORY');
                          return (
                            <span className={\`text-xs font-semibold px-2 py-1 rounded-md inline-block w-max \${
                              effectiveSupplyType === 'INVENTORY' ? 'bg-indigo-50 text-indigo-700' :
                              effectiveSupplyType === 'ORDER' ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }\`}>
                              {effectiveSupplyType === 'ORDER' ? 'قابل سفارش' : 'موجود در انبار'}
                            </span>
                          );
                        })()}`;

content = content.replace(oldBadge, newBadge);

const oldStockVisibility = `{(p.supplyType === 'INVENTORY' || !p.supplyType) && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-slate-500 text-xs">موجودی:</span>`;
                            
const newStockVisibility = `{(() => {
                          const totalStock = p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : (p.stockLevel || 0);
                          const effectiveSupplyType = totalStock === 0 ? 'ORDER' : (p.supplyType || 'INVENTORY');
                          return (effectiveSupplyType === 'INVENTORY') && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-slate-500 text-xs">موجودی:</span>`;

content = content.replace(oldStockVisibility, newStockVisibility);

// We need to close the IIFE for newStockVisibility where the old one ended:
// old: `</span></div>)}`
// new: `</span></div>)})()}`
content = content.replace(/<\/span>\n                          <\/div>\n                        \)\}/g, `</span>\n                          </div>\n                        )})()}`);

fs.writeFileSync('src/components/ProductsView.tsx', content);
