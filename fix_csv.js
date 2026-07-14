import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(
  "'تاریخ بسته شدن',\n      'موعد مقرر تحویل عمومی',",
  "'تاریخ دریافت پیش پرداخت',\n      'تاریخ تحویل قطعی',"
);
content = content.replace(
  "'تاریخ برنده شدن',",
  "'تاریخ تایید',"
);
fs.writeFileSync('src/components/ProjectsView.tsx', content);
