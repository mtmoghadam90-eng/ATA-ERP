const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const regex = /                  \{\/\* Measurement Range \*\/\}\n                  <div className="space-y-1\.5">\n                    <label className="text-xs font-semibold text-slate-500">رنج اندازه‌گیری \(Range\)<\/label>\n                    <input\n                      type="text"\n                      value=\{measurementRange\}\n                      onChange=\{\(e\) => setMeasurementRange\(e\.target\.value\)\}\n                      placeholder="مثال: 0 to 10 bar"\n                      className=".*?"\n                    \/>\n                  <\/div>/g;

content = content.replace(regex, '');

fs.writeFileSync('src/components/ProductsView.tsx', content);
