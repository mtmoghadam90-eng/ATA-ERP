import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

const closingDateBlock = `                  {/* Close Date */}
                  {(status === 'برنده (موفق)' || status === 'نیمه برنده' || status === 'باخته' || status === 'لغو شده') && (
                    <div className="space-y-1.5">
                      <ShamsiDatePicker
                        label="تاریخ بسته شدن پرونده *"
                        required
                        value={closingDate}
                        onChange={(val) => setClosingDate(val)}
                      />
                    </div>
                  )}`;

content = content.replace(closingDateBlock, '');

// Also I should ensure the 'تاریخ برنده شدن (ابلاغ قرارداد) *' label is changed to 'تاریخ تایید (ابلاغ قرارداد) *'
content = content.replace(
  'label="تاریخ برنده شدن (ابلاغ قرارداد) *"',
  'label="تاریخ تایید (ابلاغ قرارداد) *"'
);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
