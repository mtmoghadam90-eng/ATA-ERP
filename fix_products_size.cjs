const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

// 1. Remove state declarations
content = content.replace(/  const \[size, setSize\] = useState\(''\);\n  const \[measurementRange, setMeasurementRange\] = useState\(''\);\n/, '');

// 2. Remove from handleOpenAdd
content = content.replace(/    setSize\(''\);\n    setMeasurementRange\(''\);\n/, '');

// 3. Remove from handleOpenEdit
content = content.replace(/    setSize\(prod.size \|\| ''\);\n    setMeasurementRange\(prod.measurementRange \|\| ''\);\n/, '');

// 4. Remove from save payload in handleSave (editingProduct and addProduct)
content = content.replace(/        size,\n        measurementRange,\n/g, '');

// 5. Remove from batch import header definition
content = content.replace(/      \{ header: "سایز", key: "size", width: 15 \},\n      \{ header: "رنج اندازه گیری", key: "mRange", width: 20 \},\n/, '');
content = content.replace(/      size: "2 inch", mRange: "0-10 bar",/g, '');
content = content.replace(/      size: "", mRange: "",/g, '');

// 6. Remove from row parsing in batch import
content = content.replace(/          const size = row\["سایز"\] \|\| "";\n          const mRange = row\["رنج اندازه گیری"\] \|\| "";\n/g, '');
content = content.replace(/            size,\n            measurementRange: mRange,\n/g, '');

// 7. Remove UI rendering of size and mRange in the list
const oldListUI = `                            {p.size && (
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-medium">
                                سایز: {p.size}
                              </span>
                            )}
                            {p.measurementRange && (
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-medium">
                                رنج: {p.measurementRange}
                              </span>
                            )}`;
content = content.replace(oldListUI, '');

// 8. Remove the form inputs
const oldInputs = `                  {/* Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">سایز</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="مثال: 2 اینچ"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>

                  {/* Measurement Range */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">رنج اندازه‌گیری (Range)</label>
                    <input
                      type="text"
                      value={measurementRange}
                      onChange={(e) => setMeasurementRange(e.target.value)}
                      placeholder="مثال: 0 to 10 bar"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>`;
content = content.replace(oldInputs, '');

// Fix any leftover resize-none match which might be from description or notes textarea (the textarea for size shouldn't exist)
// Let's also check if onChange={(e) => setSize(e.target.value)} has any leftover

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Removed size and measurementRange from ProductsView');
