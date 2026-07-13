import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /relatedToType: 'مشتری' \| 'پروژه' \| 'پیش‌فاکتور' \| 'سفارش خرید' \| 'عمومی';/,
  `relatedToType: 'مشتری' | 'پروژه' | 'پیش‌فاکتور' | 'سفارش خرید' | 'عمومی' | 'خدمات پس از فروش' | 'بسته‌بندی و تحویل' | 'استعلام تامین‌کننده';`
);

fs.writeFileSync('src/types.ts', content);

