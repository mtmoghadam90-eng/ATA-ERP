import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(
  "import { Project, Customer, ERPSettings, Product, Proforma, ProjectCategoryGroup, ProjectActivity, User as ERPUser, PackagingDelivery } from '../types';",
  "import { Project, Customer, ERPSettings, Product, Proforma, ProjectCategoryGroup, ProjectActivity, User as ERPUser, PackagingDelivery, Transaction } from '../types';"
);

content = content.replace(
  'packagingDeliveries?: PackagingDelivery[];',
  'packagingDeliveries?: PackagingDelivery[];\n  transactions?: Transaction[];'
);

content = content.replace(
  'packagingDeliveries = [],',
  'packagingDeliveries = [],\n  transactions = [],'
);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
