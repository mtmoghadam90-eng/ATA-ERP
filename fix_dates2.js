import fs from 'fs';

let utilsContent = fs.readFileSync('src/utils/finance.ts', 'utf-8');
utilsContent = utilsContent.replace(
  /import \{ parsePersianDate \} from '\.\/dateUtils';/,
  "import { parsePersianDate } from '../dateUtils';"
);
fs.writeFileSync('src/utils/finance.ts', utilsContent);
