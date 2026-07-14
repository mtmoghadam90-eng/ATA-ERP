import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const regex = /deleteProjectCategoryGroup: \(categoryGroupId: string\) => \{[\s\S]*?\},/;
const replacement = `
    deleteProjectCategoryGroup: (categoryGroupId: string) => {
      let categoryName = '';
      setProjectCategoryGroups(prev => {
        const groupToDelete = prev.find(g => g.id === categoryGroupId);
        if (!groupToDelete) return prev;
        categoryName = groupToDelete.categoryName;
        const updated = prev.filter(g => g.id !== categoryGroupId);
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });
      if (categoryName) {
        logAction('DELETE', 'فعالیت‌های پروژه', categoryGroupId, \`حذف کامل دسته‌بندی فعالیت: \${categoryName}\`);
      }
    },
`;

content = content.replace(regex, replacement.trim() + ',');
fs.writeFileSync('src/useERPStore.ts', content);
console.log('Fixed useERPStore.ts delete method');
