const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldModalContent = `<form onSubmit={(e) => {
              e.preventDefault();
              const amt = Number(stockAdjustAmount);
              if (amt > 0) {
                const finalAmt = stockAdjustType === 'IN' ? amt : -amt;
                if (stockAdjustType === 'OUT' && (stockAdjustProd.stockLevel || 0) < amt) {
                   if (!window.confirm('موجودی ثبت شده در سیستم برای این خروج کافی نیست. آیا مایلید با وجود مغایرت، موجودی منفی را در دفاتر انبار ثبت کنید؟')) return;
                   return;
                }
                adjustProductStock(stockAdjustProd.id, finalAmt, undefined, 'MANUAL', stockAdjustNotes);
                setStockModalOpen(false);
              }
            }} className="p-6 space-y-4">
              
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <div className="font-bold text-slate-800 mb-1">{stockAdjustProd.displayName}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span>موجودی فعلی:</span>
                  <span className="font-bold">{stockAdjustProd.stockLevel || 0} عدد</span>
                </div>
              </div>`;

const newModalContent = `<form onSubmit={(e) => {
              e.preventDefault();
              const amt = Number(stockAdjustAmount);
              if (amt > 0) {
                if (stockAdjustProd.hasVariants && !stockAdjustVariantId) {
                  alert('لطفاً نوع (SKU) مورد نظر را انتخاب کنید.');
                  return;
                }
                
                const finalAmt = stockAdjustType === 'IN' ? amt : -amt;
                let currentStock = stockAdjustProd.stockLevel || 0;
                
                if (stockAdjustProd.hasVariants && stockAdjustVariantId) {
                  const variant = stockAdjustProd.variants?.find(v => v.id === stockAdjustVariantId);
                  if (variant) currentStock = variant.stockLevel || 0;
                }
                
                if (stockAdjustType === 'OUT' && currentStock < amt) {
                   if (!window.confirm('موجودی ثبت شده در سیستم برای این خروج کافی نیست. آیا مایلید با وجود مغایرت، موجودی منفی را در دفاتر انبار ثبت کنید؟')) return;
                }
                
                adjustProductStock(stockAdjustProd.id, finalAmt, stockAdjustVariantId || undefined, 'MANUAL', stockAdjustNotes);
                setStockModalOpen(false);
              }
            }} className="p-6 space-y-4">
              
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <div className="font-bold text-slate-800 mb-1">{stockAdjustProd.displayName}</div>
                {!stockAdjustProd.hasVariants && (
                  <div className="flex justify-between mt-2 text-xs">
                    <span>موجودی فعلی:</span>
                    <span className="font-bold">{stockAdjustProd.stockLevel || 0} عدد</span>
                  </div>
                )}
              </div>
              
              {stockAdjustProd.hasVariants && stockAdjustProd.variants && (
                <div className="space-y-1.5 mb-4">
                  <label className="text-xs font-semibold text-slate-500">انتخاب نوع (SKU) *</label>
                  <select
                    value={stockAdjustVariantId}
                    onChange={(e) => setStockAdjustVariantId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="">-- انتخاب کنید --</option>
                    {stockAdjustProd.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.sku} - {Object.values(v.attributes).join(', ')} (موجودی: {v.stockLevel || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}`;

content = content.replace(oldModalContent, newModalContent);

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Updated stock modal');
