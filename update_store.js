import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const regex = /completeProjectCategoryGroup: \(categoryGroupId: string, createdBy\?: string\) => \{/;
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
        logAction('DELETE', 'فعالیت‌های پروژه', categoryGroupId, \`حذف کامل دسته‌بندی فعالیت: \${groupToDelete.categoryName}\`);
        return updated;
      });
    },
    
    `;

content = content.slice(0, index) + newMethod + content.slice(index);

// Also need to add it to the return object
const returnRegex = /completeProjectCategoryGroup,/;
const returnIndex = content.search(returnRegex);
if (returnIndex === -1) {
  console.log('Return not found!');
  process.exit(1);
}

content = content.slice(0, returnIndex) + 'deleteProjectCategoryGroup,\n    ' + content.slice(returnIndex);

fs.writeFileSync('src/useERPStore.ts', content);
console.log('Updated useERPStore.ts');
