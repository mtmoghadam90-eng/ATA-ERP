import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  `    updateSupplierInquiry(updated);

    setStepActionType('');
    setStepDesc('');
    setActiveInquiryForStep(null);
  };`,
  `    updateSupplierInquiry(updated);

    setEditingInquiry(null);
    setIsEditInquiryFullscreen(false);
    onClearInitialPrintDocId?.();
  };`
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
