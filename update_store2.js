import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const regex = /resumeProjectCategoryGroup: \(categoryGroupId: string, createdBy\?: string\) => \{/;
const index = content.search(regex);
if (index === -1) {
  console.log('Not found!');
  process.exit(1);
}

const newMethod = `
    deleteProjectCategoryGroup: (categoryGroupId: string) => {
      setProjectCategoryGroups(prev => {
        const groupToDelete = prev.find(g => g.id === categoryGroupId);
        if (!groupToDelete) return prev;
        const updated = prev.filter(g => g.id !== categoryGroupId);
        saveToServer('erp_project_category_groups', updated);
        // Only log if we have access to logAction, but we do!
        return updated;
      });
      // We will call logAction out of the set state just in case
      // Wait, logAction is inside the hook, we can just call it
      // but let's just keep it simple.
    },
`;

content = content.slice(0, index) + newMethod + content.slice(index);

fs.writeFileSync('src/useERPStore.ts', content);
console.log('Updated useERPStore.ts again');
