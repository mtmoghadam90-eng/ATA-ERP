import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  /onChange=\{e => setSelectedProjectId\(e\.target\.value\)\}/g,
  `onChange={e => {
                  const pid = e.target.value;
                  setSelectedProjectId(pid);
                  const proj = projects.find(p => p.id === pid);
                  if (proj && proj.itemsNeeded && proj.itemsNeeded.length > 0) {
                    setInquiryItems(proj.itemsNeeded.map((it, idx) => ({
                      id: \`inqitem-\${Date.now()}-\${idx}\`,
                      requestItemId: it.productId,
                      productName: it.name,
                      quantity: it.quantity,
                      priceForeign: 0,
                      priceRIYAL: 0,
                      currency: 'یورو',
                      deliveryTime: '',
                      notes: it.description || ''
                    })));
                  }
                }}`
);

code = code.replace(
  /onChange=\{e => setEditProjectId\(e\.target\.value\)\}/g,
  `onChange={e => {
                      const pid = e.target.value;
                      setEditProjectId(pid);
                      const proj = projects.find(p => p.id === pid);
                      if (proj && proj.itemsNeeded && proj.itemsNeeded.length > 0 && editItems.length === 0) {
                        setEditItems(proj.itemsNeeded.map((it, idx) => ({
                          id: \`inqitem-\${Date.now()}-\${idx}\`,
                          requestItemId: it.productId,
                          productName: it.name,
                          quantity: it.quantity,
                          priceForeign: 0,
                          priceRIYAL: 0,
                          currency: editCurrency || 'یورو',
                          deliveryTime: '',
                          notes: it.description || ''
                        })));
                      }
                    }}`
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
