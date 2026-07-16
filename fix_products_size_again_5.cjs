const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldInputBlock = `                  {/* Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">سایز (Size)</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="مثال: '2 یا DN50"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-medium"
                    />
                  </div>`;

// Wait, the div above is a grid. Let's see how it looks if we remove Size.
// `grid grid-cols-2 gap-4` -> maybe supplyType needs to take full width or there's another item.
// Let's first replace oldInputBlock
content = content.replace(oldInputBlock, '');

// Also clean up <div className="grid grid-cols-2 gap-4"> if it only has Supply Type now.
// Actually, let's let SupplyType be in the grid, it's fine.

fs.writeFileSync('src/components/ProductsView.tsx', content);
