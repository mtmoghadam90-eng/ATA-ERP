const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const codeInput = `                {/* Product Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">کد کالا *</label>
                  <input
                    type="text"
                    required
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="مثال: PRD-001"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-500">کد کالا باید یکتا باشد.</p>
                </div>

                {/* Equipment Type / Display Name */}`;

content = content.replace(/                \{\/\* Equipment Type \/ Display Name \*\/\}/, codeInput);

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Added product code input UI');
