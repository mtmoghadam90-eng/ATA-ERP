import fs from 'fs';
let code = fs.readFileSync('src/components/PackagingDeliveryView.tsx', 'utf8');

code = code.replace(
  `      if (pd) {
        setSelectedDelivery(pd);
      }
      onClearInitialPrintDocId?.();`,
  `      if (pd) {
        setSelectedDelivery(pd);
      }`
);

code = code.replace(
  /onClick=\{\(\) => \{ setSelectedDelivery\(null\); setIsDetailModalFullscreen\(false\); \}\}/g,
  `onClick={() => { setSelectedDelivery(null); setIsDetailModalFullscreen(false); onClearInitialPrintDocId?.(); }}`
);

code = code.replace(
  /onClick=\{\(\) => setSelectedDelivery\(null\)\}/g,
  `onClick={() => { setSelectedDelivery(null); onClearInitialPrintDocId?.(); }}`
);

fs.writeFileSync('src/components/PackagingDeliveryView.tsx', code);
