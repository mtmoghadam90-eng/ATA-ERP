import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  `        setEditNotes(inq.notes || '');
        setEditStatus(inq.status);
      }
      onClearInitialPrintDocId?.();`,
  `        setEditNotes(inq.notes || '');
        setEditStatus(inq.status);
      }`
);

code = code.replace(
  /onClick=\{\(\) => \{ setEditingInquiry\(null\); setIsEditInquiryFullscreen\(false\); \}\}/g,
  `onClick={() => { setEditingInquiry(null); setIsEditInquiryFullscreen(false); onClearInitialPrintDocId?.(); }}`
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
