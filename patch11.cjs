const fs = require('fs');
let content = fs.readFileSync('src/components/AfterSalesServicesView.tsx', 'utf8');

content = content.replace(
  '                    placeholder="انتخاب پروژه..."\n                    required',
  '                    placeholder="انتخاب پروژه..."'
);

fs.writeFileSync('src/components/AfterSalesServicesView.tsx', content);
