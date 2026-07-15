import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "setEditFinFileSize(inq.financialProposalFileSize || '');",
  "setEditFinFileSize(inq.financialProposalFileSize || '');\n        setEditTechFileUrl(inq.technicalProposalFileUrl || '');\n        setEditFinFileUrl(inq.financialProposalFileUrl || '');"
);

code = code.replace(
  "setEditFinFileSize(inq.financialProposalFileSize || '');",
  "setEditFinFileSize(inq.financialProposalFileSize || '');\n                                  setEditTechFileUrl(inq.technicalProposalFileUrl || '');\n                                  setEditFinFileUrl(inq.financialProposalFileUrl || '');"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
