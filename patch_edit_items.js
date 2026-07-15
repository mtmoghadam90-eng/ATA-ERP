import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  /setEditFinFileUrl\(inq.financialProposalFileUrl \|\| ''\);/g,
  "setEditFinFileUrl(inq.financialProposalFileUrl || '');\n                                  setEditItems(inq.items || []);"
);

code = code.replace(
  "setEditItems(inq.items || []);\n        setEditTechFileUrl(inq.technicalProposalFileUrl || '');",
  "setEditTechFileUrl(inq.technicalProposalFileUrl || '');"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
