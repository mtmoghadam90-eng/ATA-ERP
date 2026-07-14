import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(
  "import { Project, Customer, ERPSettings, Product, Proforma, ProjectCategoryGroup, ProjectActivity, User as ERPUser } from '../types';",
  "import { Project, Customer, ERPSettings, Product, Proforma, ProjectCategoryGroup, ProjectActivity, User as ERPUser, PackagingDelivery } from '../types';"
);
fs.writeFileSync('src/components/ProjectsView.tsx', content);
