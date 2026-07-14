import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  '            users={store.users}\n',
  '            users={store.users}\n            transactions={store.transactions}\n            packagingDeliveries={store.packagingDeliveries}\n'
);
fs.writeFileSync('src/App.tsx', content);
