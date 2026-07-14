import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The replacement was:
// content.replace(
//   '            users={store.users}\n',
//   '            users={store.users}\n            transactions={store.transactions}\n            packagingDeliveries={store.packagingDeliveries}\n'
// );
// which only replaced the first occurrence (maybe inside CustomersView or somewhere else).

content = content.replace(
  '            users={store.users}\n            initialSelectedProjectId={selectedProjectIdForActivities}',
  '            users={store.users}\n            transactions={store.transactions}\n            packagingDeliveries={store.packagingDeliveries}\n            initialSelectedProjectId={selectedProjectIdForActivities}'
);

fs.writeFileSync('src/App.tsx', content);
