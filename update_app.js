import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  'proformas={store.proformas}',
  'proformas={store.proformas}\n            packagingDeliveries={store.packagingDeliveries}'
);
fs.writeFileSync('src/App.tsx', content);
