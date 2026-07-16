const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

content = content.replace(/                            \{p\.size && \(\n                              <span className="px-2 py-0\.5 bg-slate-100 text-slate-600 rounded-md font-medium">\n                                سایز: \{p\.size\}\n                              <\/span>\n                            \)\}\n/, '');

// Also remove the <input value={size}>
const leftoverInput = /                  <div className="space-y-1\.5">\n                    <label className="text-xs font-semibold text-slate-500">سایز<\/label>\n                    <input\n                      type="text"\n                      value=\{size\}\n                      onChange=\{\(e\) => setSize\(e\.target\.value\)\}\n                      placeholder="مثال: 2 اینچ"\n                      className=".*?"\n                    \/>\n                  <\/div>\n/g;
content = content.replace(leftoverInput, '');

fs.writeFileSync('src/components/ProductsView.tsx', content);
