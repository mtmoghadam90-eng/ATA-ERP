import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

code = code.replace(/completeProjectCategoryGroup: \(projectId: string, categoryId: string, logs\?: any\) => void;/g, 'completeProjectCategoryGroup: any;');
code = code.replace(/resumeProjectCategoryGroup: \(projectId: string, categoryId: string, logs\?: any\) => void;/g, 'resumeProjectCategoryGroup: any;');
code = code.replace(/deleteProjectCategoryGroup: \(projectId: string, categoryId: string, logs\?: any\) => void;/g, 'deleteProjectCategoryGroup: any;');
code = code.replace(/updateProjectActivity: \(projectId: string, categoryId: string, activityId: string, newAct: any\) => void;/g, 'updateProjectActivity: any;');
code = code.replace(/deleteProjectActivity: \(projectId: string, categoryId: string, activityId: string\) => void;/g, 'deleteProjectActivity: any;');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
