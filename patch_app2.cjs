const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetUnread = `  let readItems: Set<string>;
  try {
    const readItemsStr = localStorage.getItem(\`read_notifications_\${store.currentUser?.id}\`);
    readItems = new Set(readItemsStr ? JSON.parse(readItemsStr) : []);
  } catch {
    readItems = new Set();
  }`;

const replaceUnread = `  const readItems = new Set(store.readItems || []);`;
code = code.replace(targetUnread, replaceUnread);

const targetRender = `<ReferralsView 
            initialTab={referralsTab}`;
const replaceRender = `<ReferralsView 
            initialTab={referralsTab}
            readItems={store.readItems}
            markItemsAsRead={store.markItemsAsRead}`;
code = code.replace(targetRender, replaceRender);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app2');
