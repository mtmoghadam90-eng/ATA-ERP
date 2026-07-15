import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "import { getTodayShamsi } from '../dateUtils';",
  "import { getTodayShamsi } from '../dateUtils';\nimport { uploadFile } from '../imageUtils';"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
