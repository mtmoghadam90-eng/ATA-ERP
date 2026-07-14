import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

content = content.replace(
  '<div className="space-y-1.5" id="project-expected-close-date-picker-wrapper">\n                    <ShamsiDatePicker\n                      label="موعد مقرر تحویل عمومی (تعهد تحویل کالا)"\n                      value={expectedCloseDate}\n                      onChange={(val) => setExpectedCloseDate(val)}\n                    />\n                  </div>',
  `<div className="space-y-1.5" id="project-prepayment-date-picker-wrapper">
                    <ShamsiDatePicker
                      label="تاریخ دریافت پیش‌پرداخت"
                      value={prepaymentDate}
                      onChange={(val) => setPrepaymentDate(val)}
                    />
                  </div>`
);

content = content.replace(
  'const [expectedCloseDate, setExpectedCloseDate] = useState(\'\');',
  ''
);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
