import fs from 'fs';
let code = fs.readFileSync('src/components/ProformasView.tsx', 'utf8');

code = code.replace(
  `      if (pf) {
        handleOpenPrint(pf);
      }
      onClearInitialPrintDocId?.();`,
  `      if (pf) {
        handleOpenPrint(pf);
      }`
);

code = code.replace(
  `onClick={() => setShowPrintView(false)}`,
  `onClick={() => { setShowPrintView(false); onClearInitialPrintDocId?.(); }}`
);

fs.writeFileSync('src/components/ProformasView.tsx', code);
