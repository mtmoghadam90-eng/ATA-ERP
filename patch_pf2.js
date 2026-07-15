import fs from 'fs';
let code = fs.readFileSync('src/components/ProformasView.tsx', 'utf8');

const hookStr = `  React.useEffect(() => {
    if (initialPrintDocId) {
      const pf = proformas.find(p => p.id === initialPrintDocId);
      if (pf) {
        handleOpenPrint(pf);
      }
      onClearInitialPrintDocId?.();
    }
  }, [initialPrintDocId, proformas]);

  // Expand Project sections state`;

code = code.replace("  // Expanded project sections state", hookStr);

fs.writeFileSync('src/components/ProformasView.tsx', code);
