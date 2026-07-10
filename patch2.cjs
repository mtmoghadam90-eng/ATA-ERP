const fs = require('fs');
let code = fs.readFileSync('src/components/ReferralsView.tsx', 'utf8');

const target = `  const currentUserName = currentUser?.fullName || 'محمد توکل مقدم';
  const isManagerOrAdmin = currentUser?.role === 'admin' || currentUser?.isSystemAdmin;

  const [activeTab, setActiveTab] = useState<'toMe' | 'fromMe' | 'notifications'>('toMe');`;

const replacement = `  const currentUserName = currentUser?.fullName || 'محمد توکل مقدم';
  const isManagerOrAdmin = currentUser?.role === 'admin' || currentUser?.isSystemAdmin;

  const [activeTab, setActiveTab] = useState<'toMe' | 'fromMe' | 'notifications'>(initialTab || 'toMe');
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/ReferralsView.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
}
