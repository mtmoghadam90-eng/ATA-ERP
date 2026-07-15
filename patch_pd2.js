import fs from 'fs';
let code = fs.readFileSync('src/components/PackagingDeliveryView.tsx', 'utf8');

const hookStr = `  React.useEffect(() => {
    if (initialPrintDocId) {
      const pd = packagingDeliveries.find(p => p.id === initialPrintDocId);
      if (pd) {
        handleOpenPrint(pd);
      }
      onClearInitialPrintDocId?.();
    }
  }, [initialPrintDocId, packagingDeliveries]);

  // Filter States`;

code = code.replace("  // Filter States", hookStr);

fs.writeFileSync('src/components/PackagingDeliveryView.tsx', code);
