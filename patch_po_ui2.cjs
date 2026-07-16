const fs = require('fs');
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');

const supplierInquiryField = `
                {/* Winner Supplier Inquiry Selection */}
                <div className="space-y-1.5 sm:col-span-2 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <label className="text-xs font-semibold text-amber-800">تکمیل خودکار از طریق استعلام‌های برنده (اختیاری)</label>
                  <select
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm text-right bg-white focus:border-amber-400 outline-none mt-1.5"
                    onChange={(e) => {
                      const inqId = e.target.value;
                      if (!inqId) return;
                      const inq = supplierInquiries.find(i => i.id === inqId);
                      if (inq) {
                        setSupplierId(inq.supplierId);
                        if (inq.projectId) setProjectId(inq.projectId);
                        
                        setCurrency(inq.items[0]?.currency || 'دلار');
                        
                        const poItems = inq.items.map((inqItem, idx) => ({
                          id: \`poi-\${Date.now()}-\${idx}\`,
                          productId: 'generic',
                          productName: inqItem.name,
                          productCode: '',
                          quantity: inqItem.quantity,
                          unitPriceForeign: inqItem.priceForeign,
                          customsDutyRate: 0,
                          shippingCostForeignRate: 0,
                          supplierNotes: inqItem.notes || (inqItem.deliveryTime ? \`زمان تحویل: \${inqItem.deliveryTime}\` : '')
                        }));
                        setItems(poItems);
                        e.target.value = ""; // Reset after loading
                      }
                    }}
                  >
                    <option value="">-- انتخاب از استعلام‌های برنده --</option>
                    {supplierInquiries.filter(i => i.isWinner).map(inq => (
                      <option key={inq.id} value={inq.id}>
                        {inq.supplierName} - اقلام: {inq.items.length} عدد (پروژه: {projects.find(p => p.id === inq.projectId)?.name || 'بدون پروژه'})
                      </option>
                    ))}
                  </select>
                </div>
`;

content = content.replace(
  '{/* Supplier select */}',
  supplierInquiryField + '\n                {/* Supplier select */}'
);

fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
