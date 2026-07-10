const fs = require('fs');
let code = fs.readFileSync('src/components/ReferralsView.tsx', 'utf8');

const targetToggle = `  const toggleNotificationGroup = (groupId: string, items: any[]) => {
    setExpandedNotificationGroups(prev => {
      const isExpanded = prev[groupId] ?? false;
      if (!isExpanded) {
        const toMark: string[] = [];
        items.forEach(item => {
          const id = item.type === 'message' ? (item.message.id || \`\${item.activity.id}-msg-\${item.timestamp}\`) : item.activity.id;
          if (!readItemsSet.has(id)) toMark.push(id);
        });
        if (toMark.length > 0) markItemsAsRead(toMark);
      }
      return {
        ...prev,
        [groupId]: !isExpanded
      };
    });
  };`;

const replaceToggle = `  const toggleNotificationGroup = (groupId: string, items: any[]) => {
    const isExpanded = expandedNotificationGroups[groupId] ?? false;
    if (!isExpanded) {
      const toMark: string[] = [];
      items.forEach(item => {
        const id = item.type === 'message' ? (item.message.id || \`\${item.activity.id}-msg-\${item.timestamp}\`) : item.activity.id;
        if (!readItemsSet.has(id)) toMark.push(id);
      });
      if (toMark.length > 0) markItemsAsRead(toMark);
    }
    setExpandedNotificationGroups(prev => ({
      ...prev,
      [groupId]: !isExpanded
    }));
  };`;

code = code.replace(targetToggle, replaceToggle);

const targetCard = `  const toggleCard = (groupId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };`;

// nothing wrong with toggleCard, so I will just write.
fs.writeFileSync('src/components/ReferralsView.tsx', code);
console.log('Fixed toggle');
