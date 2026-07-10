const fs = require('fs');
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const targetState = `  const [moduleNotifications, setModuleNotifications] = useState<ModuleNotification[]>([]);
  const [projectCategoryGroups, setProjectCategoryGroups] = useState<ProjectCategoryGroup[]>([]);`;

const replaceState = `  const [moduleNotifications, setModuleNotifications] = useState<ModuleNotification[]>([]);
  const [projectCategoryGroups, setProjectCategoryGroups] = useState<ProjectCategoryGroup[]>([]);
  const [readItems, setReadItems] = useState<string[]>([]);`;
code = code.replace(targetState, replaceState);

const targetLoad = `      if (storedModuleNotifs) setModuleNotifications(JSON.parse(storedModuleNotifs));
      else {
        setModuleNotifications([]);
        localStorage.setItem('erp_module_notifications', JSON.stringify([]));
      }`;
const replaceLoad = `      if (storedModuleNotifs) setModuleNotifications(JSON.parse(storedModuleNotifs));
      else {
        setModuleNotifications([]);
        localStorage.setItem('erp_module_notifications', JSON.stringify([]));
      }
      if (mappedCurrentUser) {
        const storedReadItems = localStorage.getItem(\`read_notifications_\${mappedCurrentUser.id}\`);
        if (storedReadItems) setReadItems(JSON.parse(storedReadItems));
      }`;
code = code.replace(targetLoad, replaceLoad);

const targetMark = `    markAllModuleNotificationsAsRead,`;
const replaceMark = `    markAllModuleNotificationsAsRead,
    readItems,
    markItemsAsRead: (itemsToMark: string[]) => {
      setReadItems(prev => {
        const next = Array.from(new Set([...prev, ...itemsToMark]));
        if (currentUser) {
           localStorage.setItem(\`read_notifications_\${currentUser.id}\`, JSON.stringify(next));
        }
        return next;
      });
    },`;
code = code.replace(targetMark, replaceMark);

fs.writeFileSync('src/useERPStore.ts', code);
console.log('patched store');
