import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(
  'closingDate?: string;             // تاریخ بسته شدن\n  attachments?: { name: string; url: string; }[];',
  'closingDate?: string;             // تاریخ بسته شدن\n  prepaymentDate?: string;          // تاریخ دریافت پیش‌پرداخت\n  attachments?: { name: string; url: string; }[];'
);
fs.writeFileSync('src/types.ts', content);
