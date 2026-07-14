import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// Define getProjectPrepaymentDate function
const helperFunc = `  const getActualDeliveryDate = (projectId: string) => {`;
const newHelperFunc = `  const getProjectPrepaymentDate = (projectId: string) => {
    const projectTx = transactions
      .filter(tx => tx.projectId === projectId && tx.type === 'دریافت')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return projectTx.length > 0 ? projectTx[0].date : null;
  };

  const getActualDeliveryDate = (projectId: string) => {`;
content = content.replace(helperFunc, newHelperFunc);

// Remove form state
content = content.replace(
  'const [prepaymentDate, setPrepaymentDate] = useState(\'\');',
  ''
);

// Remove from handleOpenEdit
content = content.replace(
  'setPrepaymentDate(proj.prepaymentDate || \'\');',
  ''
);

// Remove from form submission object
content = content.replace(
  '      prepaymentDate,\n',
  ''
);

// Update CSV export
content = content.replace(
  "p.prepaymentDate || '',",
  "getProjectPrepaymentDate(p.id) || '',"
);

// Update Key Dates UI
content = content.replace(
  '{p.prepaymentDate && (',
  '{getProjectPrepaymentDate(p.id) && ('
);
content = content.replace(
  '<span className="font-mono">{p.prepaymentDate}</span>',
  '<span className="font-mono">{getProjectPrepaymentDate(p.id)}</span>'
);

// Remove the input field completely
const datePickerBlock = `<div className="space-y-1.5" id="project-prepayment-date-picker-wrapper">
                    <ShamsiDatePicker
                      label="تاریخ دریافت پیش‌پرداخت"
                      value={prepaymentDate}
                      onChange={(val) => setPrepaymentDate(val)}
                    />
                  </div>`;
content = content.replace(datePickerBlock, '');

// Clean up comments
content = content.replace('// Replaced by prepaymentDate logic if needed', '');

fs.writeFileSync('src/components/ProjectsView.tsx', content);
