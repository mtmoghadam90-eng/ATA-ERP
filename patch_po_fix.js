import fs from 'fs';
let code = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf8');

const hookStr = `  React.useEffect(() => {
    if (initialPrintDocId) {
      const po = purchaseOrders.find(p => p.id === initialPrintDocId);
      if (po) {
        setSelectedPO(po);
        setShowLandedModal(true);
      }
      onClearInitialPrintDocId?.();
    }
  }, [initialPrintDocId, purchaseOrders]);

  // Status Change State`;

code = code.replace("  // Status Change State", hookStr);

fs.writeFileSync('src/components/PurchaseOrdersView.tsx', code);
