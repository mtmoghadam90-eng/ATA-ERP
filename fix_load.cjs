const fs = require('fs');
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

const target1 = `      if (currentUser) {
        const storedReadItems = localStorage.getItem(\`read_notifications_\${currentUser.id}\`);
        if (storedReadItems) setReadItems(JSON.parse(storedReadItems));
      }`;
code = code.replace(target1, '');

const target2 = `      const storedCurrentUser = localStorage.getItem('erp_current_user');
      if (storedCurrentUser) {
        const u = JSON.parse(storedCurrentUser);
        setCurrentUser(u);
        setUserRole(u.role);
        localStorage.setItem('erp_simulated_role', u.role);
      } else {
        setCurrentUser(SEED_USERS[0]);
        setUserRole('admin');
        localStorage.setItem('erp_current_user', JSON.stringify(SEED_USERS[0]));
        localStorage.setItem('erp_simulated_role', 'admin');
      }`;
const replace2 = `      const storedCurrentUser = localStorage.getItem('erp_current_user');
      let loadedUser = null;
      if (storedCurrentUser) {
        const u = JSON.parse(storedCurrentUser);
        loadedUser = u;
        setCurrentUser(u);
        setUserRole(u.role);
        localStorage.setItem('erp_simulated_role', u.role);
      } else {
        loadedUser = SEED_USERS[0];
        setCurrentUser(loadedUser);
        setUserRole('admin');
        localStorage.setItem('erp_current_user', JSON.stringify(loadedUser));
        localStorage.setItem('erp_simulated_role', 'admin');
      }
      
      if (loadedUser) {
        const storedReadItems = localStorage.getItem(\`read_notifications_\${loadedUser.id}\`);
        if (storedReadItems) setReadItems(JSON.parse(storedReadItems));
      }`;
code = code.replace(target2, replace2);

fs.writeFileSync('src/useERPStore.ts', code);
console.log('Fixed load');
