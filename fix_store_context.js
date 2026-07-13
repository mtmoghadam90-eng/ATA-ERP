import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

content = content.replace(
  /newStatus\?: string;\s*salesExpert\?: string;\s*proformaAmount\?: number;\s*\}/,
  `newStatus?: string;
      salesExpert?: string;
      proformaAmount?: number;
      inquiryId?: string;
      deliveryId?: string;
      serviceId?: string;
      action?: string;
    }`
);

fs.writeFileSync('src/useERPStore.ts', content);

