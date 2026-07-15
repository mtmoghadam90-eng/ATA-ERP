import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "import { useData } from '../context/DataContext';",
  "import { useData } from '../context/DataContext';\nimport { uploadFile } from '../imageUtils';"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
