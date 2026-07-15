import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

code = code.replace(/addProjectCategoryGroup: \(g: any\) => void;/g, 'addProjectCategoryGroup: any;');
code = code.replace(/addProjectActivity: \(projectId: string, categoryId: string, activity: any\) => void;/g, 'addProjectActivity: any;');
code = code.replace(/onOpenDocument\?: \(doc: any\) => void;/g, 'onOpenDocument?: any;');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
