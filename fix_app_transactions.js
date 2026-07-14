import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  'packagingDeliveries={store.packagingDeliveries}',
  'packagingDeliveries={store.packagingDeliveries}\n            transactions={store.transactions}'
);
fs.writeFileSync('src/App.tsx', content);
