import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(
  'prepaymentDate?: string;          // تاریخ دریافت پیش‌پرداخت',
  ''
);
fs.writeFileSync('src/types.ts', content);
