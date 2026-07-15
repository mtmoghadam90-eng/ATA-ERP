import fs from 'fs';
let code = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf8');

code = code.replace(
  `      if (po) {
        setSelectedPO(po);
        setShowLandedModal(true);
      }
      onClearInitialPrintDocId?.();`,
  `      if (po) {
        setSelectedPO(po);
        setShowLandedModal(true);
      }`
);

code = code.replace(
  `onClick={() => { setShowLandedModal(false); setIsLandedModalFullscreen(false); }}`,
  `onClick={() => { setShowLandedModal(false); setIsLandedModalFullscreen(false); onClearInitialPrintDocId?.(); }}`
);

fs.writeFileSync('src/components/PurchaseOrdersView.tsx', code);
