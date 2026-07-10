const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [activeView, setActiveView] = useState('dashboard');`;
const replacementState = `  const [activeView, setActiveView] = useState('dashboard');
  const [referralsTab, setReferralsTab] = useState<'toMe' | 'fromMe' | 'notifications'>('toMe');`;

code = code.replace(targetState, replacementState);

const targetHeaderBtn = `onClick={() => setActiveView('referrals')}`;
const replaceHeaderBtn = `onClick={() => { setReferralsTab('toMe'); setActiveView('referrals'); }}`;
code = code.replace(targetHeaderBtn, replaceHeaderBtn);

const targetHeaderBtn2 = `onClick={() => setActiveView('dashboard')} 
               title="اعلان‌های سیستم"`;
const replaceHeaderBtn2 = `onClick={() => { setReferralsTab('notifications'); setActiveView('referrals'); }} 
               title="اعلان‌های سیستم"`;
code = code.replace(targetHeaderBtn2, replaceHeaderBtn2);

const targetReferralsRender = `<ReferralsView 
            projectCategoryGroups={store.projectCategoryGroups}`;
const replaceReferralsRender = `<ReferralsView 
            initialTab={referralsTab}
            projectCategoryGroups={store.projectCategoryGroups}`;
code = code.replace(targetReferralsRender, replaceReferralsRender);

const targetUnread = `  const unreadNotifs = (store.moduleNotifications || []).filter(n => !n.read && n.responsibleName === store.currentUser?.fullName);
  const pendingReferrals = (store.projectCategoryGroups || []).flatMap(g => g.activities || [])
    .filter(a => a.referral && a.referral.status === 'در انتظار اقدام' && a.referral.assignedTo === (store.currentUser?.fullName || 'محمد توکل مقدم'));`;

const replaceUnread = `  const currentUserName = store.currentUser?.fullName || 'محمد توکل مقدم';
  const isManagerOrAdmin = store.currentUser?.role === 'admin' || store.currentUser?.isSystemAdmin;

  let readItems: Set<string>;
  try {
    const readItemsStr = localStorage.getItem(\`read_notifications_\${store.currentUser?.id}\`);
    readItems = new Set(readItemsStr ? JSON.parse(readItemsStr) : []);
  } catch {
    readItems = new Set();
  }

  let groupedNotifsUnread = 0;
  (store.projectCategoryGroups || []).forEach(group => {
    const cat = store.settings?.activityCategories?.find(c => c.id === group.categoryId);
    const isResponsible = isManagerOrAdmin || cat?.responsibleUserId === currentUserName;
    
    (group.activities || []).forEach((act) => {
      if (isResponsible) {
        if (!readItems.has(act.id)) groupedNotifsUnread++;
      }
      if (act.referral) {
        const messages = act.referral.messages || [];
        if (messages.length === 0 && act.referral.response) {
          messages.push(act.referral.response);
        }
        messages.forEach((msg: any, idx: number) => {
           if (isResponsible || act.referral?.assignedBy === currentUserName) {
             const id = msg.id || \`\${act.id}-msg-\${msg.timestamp || parseInt(act.id.split('-').pop() || '0', 10) + idx + 1}\`;
             if (!readItems.has(id)) groupedNotifsUnread++;
           }
        });
      }
    });
  });

  const unreadNotifsCount = (store.moduleNotifications || []).filter(n => !n.read && n.responsibleName === currentUserName).length;
  const totalUnreadCount = unreadNotifsCount + groupedNotifsUnread;

  const pendingReferrals = (store.projectCategoryGroups || []).flatMap(g => g.activities || [])
    .filter(a => a.referral && a.referral.status === 'در انتظار اقدام' && a.referral.assignedTo === currentUserName);`;

code = code.replace(targetUnread, replaceUnread);

const targetUnreadLength = `{unreadNotifs.length > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] font-bold flex justify-center items-center rounded-full text-white shadow-sm border-2 border-white">
                   {unreadNotifs.length}
                 </span>`;
const replaceUnreadLength = `{totalUnreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] font-bold flex justify-center items-center rounded-full text-white shadow-sm border-2 border-white">
                   {totalUnreadCount}
                 </span>`;
code = code.replace(targetUnreadLength, replaceUnreadLength);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app');
