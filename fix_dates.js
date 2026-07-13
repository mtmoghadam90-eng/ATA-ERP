import fs from 'fs';

let utilsContent = fs.readFileSync('src/utils/finance.ts', 'utf-8');
utilsContent = "import { parsePersianDate } from './dateUtils';\n" + utilsContent.replace(
  /\.sort\(\(a, b\) => new Date\(a\.date\)\.getTime\(\) - new Date\(b\.date\)\.getTime\(\)\);/g,
  ".sort((a, b) => parsePersianDate(a.date).getTime() - parsePersianDate(b.date).getTime());"
);
fs.writeFileSync('src/utils/finance.ts', utilsContent);

let prodContent = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');
prodContent = "import { parsePersianDate } from '../dateUtils';\n" + prodContent.replace(
  /inventoryTransactions\.sort\(\(a, b\) => new Date\(b\.date\)\.getTime\(\) - new Date\(a\.date\)\.getTime\(\)\)/g,
  "inventoryTransactions.sort((a, b) => parsePersianDate(b.date).getTime() - parsePersianDate(a.date).getTime())"
);
fs.writeFileSync('src/components/ProductsView.tsx', prodContent);
