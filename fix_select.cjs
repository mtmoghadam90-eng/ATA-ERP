const fs = require('fs');
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');
content = content.replace(
  '                  <select\n                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm text-right bg-white focus:border-amber-400 outline-none mt-1.5"',
  '                  <select defaultValue=""\n                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm text-right bg-white focus:border-amber-400 outline-none mt-1.5"'
);
fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
