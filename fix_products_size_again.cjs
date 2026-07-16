const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

// Props definition
content = content.replace(/    size\?: string;\n    measurementRange\?: string;\n/, '');

// Leftover rendering
content = content.replace(/                            \{p\.measurementRange && \(\n                              <span className="px-2 py-0\.5 bg-sky-50 text-sky-700 rounded-md font-medium">\n                                رنج: \{p\.measurementRange\}\n                              <\/span>\n                            \)\}\n/, '');

// Leftover input
const leftoverInput = `                  {/* Measurement Range */}
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
content = content.replace(leftoverInput, '');

fs.writeFileSync('src/components/ProductsView.tsx', content);
