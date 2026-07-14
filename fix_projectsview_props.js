import fs from 'fs';

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(
  'resumeProjectCategoryGroup?: (categoryGroupId: string, createdBy?: string) => void;',
  'resumeProjectCategoryGroup?: (categoryGroupId: string, createdBy?: string) => void;\n  deleteProjectCategoryGroup?: (categoryGroupId: string) => void;'
);

content = content.replace(
  'resumeProjectCategoryGroup,\n  updateProjectActivity,',
  'resumeProjectCategoryGroup,\n  deleteProjectCategoryGroup,\n  updateProjectActivity,'
);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
console.log('Fixed ProjectsView props');
