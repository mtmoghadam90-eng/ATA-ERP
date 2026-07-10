const fs = require('fs');
let code = fs.readFileSync('src/components/ReferralsView.tsx', 'utf8');

const targetState = `  const [readItems, setReadItems] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(\`read_notifications_\${currentUser?.id}\`) || '[]'));
    } catch {
      return new Set();
    }
  });`;
const replaceState = ``;
code = code.replace(targetState, replaceState);

const targetProps = `  currentUser: User | null;
}`;
const replaceProps = `  currentUser: User | null;
  readItems: string[];
  markItemsAsRead: (items: string[]) => void;
}`;
code = code.replace(targetProps, replaceProps);

const targetProps2 = `  initialTab,
  currentUser
}: ReferralsViewProps) {`;
const replaceProps2 = `  initialTab,
  currentUser,
  readItems,
  markItemsAsRead
}: ReferralsViewProps) {
  const readItemsSet = new Set(readItems);`;
code = code.replace(targetProps2, replaceProps2);

const targetRead = `!readItems.has`;
const replaceRead = `!readItemsSet.has`;
code = code.replaceAll(targetRead, replaceRead);

const targetToggle = `        setReadItems(prevRead => {
          const next = new Set(prevRead);
          let changed = false;
          items.forEach(item => {
            const id = item.type === 'message' ? (item.message.id || \`\${item.activity.id}-msg-\${item.timestamp}\`) : item.activity.id;
            if (!next.has(id)) {
              next.add(id);
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem(\`read_notifications_\${currentUser?.id}\`, JSON.stringify(Array.from(next)));
          }
          return next;
        });`;
const replaceToggle = `        const toMark: string[] = [];
        items.forEach(item => {
          const id = item.type === 'message' ? (item.message.id || \`\${item.activity.id}-msg-\${item.timestamp}\`) : item.activity.id;
          if (!readItemsSet.has(id)) toMark.push(id);
        });
        if (toMark.length > 0) markItemsAsRead(toMark);`;
code = code.replace(targetToggle, replaceToggle);

fs.writeFileSync('src/components/ReferralsView.tsx', code);
console.log('patched referrals');
