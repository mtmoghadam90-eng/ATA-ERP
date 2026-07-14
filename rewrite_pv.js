import fs from 'fs';

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// Replace states
content = content.replace(
  'const [closingDate, setClosingDate] = useState(\'\');',
  'const [prepaymentDate, setPrepaymentDate] = useState(\'\');'
);

content = content.replace(
  'const [expectedCloseDate, setExpectedCloseDate] = useState(\'\');',
  ''
);

// Replace handleStatusChange
content = content.replace(
  'if (!closingDate) setClosingDate(today);',
  '// if (!closingDate) setClosingDate(today); // Replaced by prepaymentDate logic if needed'
);
content = content.replace(
  'if (!closingDate) setClosingDate(today);',
  ''
);

// Replace editing project setter
content = content.replace(
  'setClosingDate(proj.closingDate || \'\');',
  'setPrepaymentDate(proj.prepaymentDate || \'\');'
);
content = content.replace(
  'setExpectedCloseDate(proj.expectedCloseDate || \'\');',
  ''
);

// Replace form submission data
content = content.replace(
  'expectedCloseDate: expectedCloseDate || undefined,',
  ''
);
content = content.replace(
  'closingDate,',
  'prepaymentDate,'
);

// Replace CSV export
content = content.replace(
  "p.closingDate || '',\n      p.expectedCloseDate || '',",
  "p.prepaymentDate || '',"
);
content = content.replace(
  "'تاریخ بسته شدن',\n      'موعد تحویل (تایید شده)',\n      'موعد مقرر تحویل',",
  "'تاریخ دریافت پیش پرداخت',\n      'تاریخ تحویل قطعی',"
);
content = content.replace(
  'getApprovedProformaDeliveryDate(p.id) || \'\',',
  'getActualDeliveryDate(p.id) || \'\','
);

// Provide getActualDeliveryDate
const getApprovedFunc = `const getApprovedProformaDeliveryDate = (projectId: string) => {`;
const actualDeliveryFunc = `const getActualDeliveryDate = (projectId: string) => {
    const delivery = packagingDeliveries.find(d => d.projectId === projectId);
    return delivery?.deliveryDate;
  };
  
  const getApprovedProformaDeliveryDate = (projectId: string) => {`;
content = content.replace(getApprovedFunc, actualDeliveryFunc);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
