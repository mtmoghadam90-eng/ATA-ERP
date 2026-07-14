import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// Update imports
if (!content.includes('PackagingDelivery')) {
  content = content.replace(
    "import { Project, Customer, Product, Proforma, ERPSettings, ProjectCategoryGroup, User } from '../types';",
    "import { Project, Customer, Product, Proforma, ERPSettings, ProjectCategoryGroup, User, PackagingDelivery } from '../types';"
  );
}

// Update Props
content = content.replace(
  'proformas: Proforma[];',
  'proformas: Proforma[];\n  packagingDeliveries?: PackagingDelivery[];'
);

// Update component signature
content = content.replace(
  'proformas,',
  'proformas,\n  packagingDeliveries = [],'
);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
