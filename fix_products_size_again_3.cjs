const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

content = content.replace(/                            \{p\.size && \(\n                              <span className="px-2 py-0\.5 bg-sky-50 text-sky-700 rounded-md font-medium">\n                                سایز: \{p\.size\}\n                              <\/span>\n                            \)\}\n/, '');

fs.writeFileSync('src/components/ProductsView.tsx', content);
