import fs from 'fs';

let content = fs.readFileSync('src/utils/finance.ts', 'utf-8');

const helpers = `export function roundCurrency(val: number): number {
  return Math.round(val * 100) / 100;
}

export function roundRiyal(val: number): number {
  return Math.round(val);
}

export function isAlmostZero(val: number): boolean {
  return Math.abs(val) < 0.001;
}

export function safeDivide(num: number, denom: number): number {
  if (isAlmostZero(denom)) return 0;
  return num / denom;
}
`;

content = content.replace(/import \{ parsePersianDate \} from '\.\.\/dateUtils';\n/, "import { parsePersianDate } from '../dateUtils';\n" + helpers);

// Find === comparisons of amounts in the file to replace with isAlmostZero
content = content.replace(/amountForeign === 0/g, 'isAlmostZero(amountForeign)');
content = content.replace(/val === 0/g, 'isAlmostZero(val)');

fs.writeFileSync('src/utils/finance.ts', content);
