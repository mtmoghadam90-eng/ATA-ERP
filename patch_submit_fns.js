import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "financialProposalFileSize: finFileSize || undefined,",
  "financialProposalFileSize: finFileSize || undefined,\n      technicalProposalFileUrl: techFileUrl || undefined,\n      financialProposalFileUrl: finFileUrl || undefined,"
);

code = code.replace(
  "financialProposalFileSize: answerFinFileSize || (answerFinFile ? '1.1 MB' : undefined),",
  "financialProposalFileSize: answerFinFileSize || (answerFinFile ? '1.1 MB' : undefined),\n      technicalProposalFileUrl: answerTechFileUrl || undefined,\n      financialProposalFileUrl: answerFinFileUrl || undefined,"
);

code = code.replace(
  "type: 'response'",
  "type: 'response',\n      technicalProposalFile: answerTechFile || undefined,\n      financialProposalFile: answerFinFile || undefined,\n      technicalProposalFileSize: answerTechFileSize || undefined,\n      financialProposalFileSize: answerFinFileSize || undefined,\n      technicalProposalFileUrl: answerTechFileUrl || undefined,\n      financialProposalFileUrl: answerFinFileUrl || undefined"
);

code = code.replace(
  "financialProposalFileSize: editFinFileSize || undefined,",
  "financialProposalFileSize: editFinFileSize || undefined,\n      technicalProposalFileUrl: editTechFileUrl || undefined,\n      financialProposalFileUrl: editFinFileUrl || undefined,"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
