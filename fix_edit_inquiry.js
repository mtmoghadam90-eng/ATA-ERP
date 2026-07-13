import fs from 'fs';

let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf-8');

// Add editItems state
content = content.replace(
  /const \[editStatus, setEditStatus\] = useState<string>\('پیش‌نویس'\);/,
  `const [editStatus, setEditStatus] = useState<string>('پیش‌نویس');
  const [editItems, setEditItems] = useState<any[]>([]);`
);

// Populate editItems in handleEditClick
const handleEditClickRegex = /const handleEditClick = \(inq: SupplierInquiry\) => \{[\s\S]*?setEditingInquiry\(inq\);\s*\};/g;

// Let's replace the whole handleEditClick
content = content.replace(
  handleEditClickRegex,
  `const handleEditClick = (inq: SupplierInquiry) => {
    setEditProjectId(inq.projectId || '');
    setEditProformaId(inq.proformaId || '');
    setEditProformaItemId(inq.proformaItemId || '');
    setEditSupplierId(inq.supplierId);
    setEditInquiryDate(inq.inquiryDate);
    setEditPriceRIYAL(inq.priceRIYAL || 0);
    setEditPriceForeign(inq.priceForeign || 0);
    setEditCurrency(inq.currency as any || 'یورو');
    setEditDeliveryTime(inq.deliveryTime || '');
    setEditTechFileName(inq.technicalProposalFile || '');
    setEditFinFileName(inq.financialProposalFile || '');
    setEditTechFileSize(inq.technicalProposalFileSize || '');
    setEditFinFileSize(inq.financialProposalFileSize || '');
    setEditNotes(inq.notes || '');
    setEditStatus(inq.status);
    setEditItems(inq.items || []);
    setEditingInquiry(inq);
  };`
);

// Replace in handleEditInquirySubmit
const handleEditSubmitRegex = /const updated: SupplierInquiry = \{[\s\S]*?\}\);/g;

content = content.replace(
  handleEditSubmitRegex,
  `const updated: SupplierInquiry = {
      ...editingInquiry,
      projectId: editProjectId || undefined,
      projectName: proj?.name || undefined,
      supplierId: editSupplierId,
      supplierName: supp?.name || '',
      inquiryDate: editInquiryDate,
      priceRIYAL: editPriceRIYAL || undefined,
      priceForeign: editPriceForeign || undefined,
      currency: editCurrency,
      deliveryTime: editDeliveryTime || undefined,
      technicalProposalFile: editTechFileName || undefined,
      financialProposalFile: editFinFileName || undefined,
      technicalProposalFileSize: editTechFileSize || undefined,
      financialProposalFileSize: editFinFileSize || undefined,
      notes: editNotes || undefined,
      status: editStatus as any,
      items: editItems
    };

    updateSupplierInquiry(updated);`
);

// Find the modal rendering code.
// It looks like: {editingInquiry && ( ... <form onSubmit={handleEditInquirySubmit}
// Let's inject the table inside the edit modal
const editModalRegex = /\{\/\* Quick Offer pricing if available \*\/\}.*?\{\/\* Notes \*\/\}/s;

const editTableComponent = `
                        {/* Items Table */}
                        <div className="md:col-span-2 mt-4">
                           <div className="flex justify-between items-center mb-4">
                              <label className="block text-sm font-bold text-slate-700">اقلام استعلام و پیشنهاد سازنده</label>
                              <button
                                 type="button"
                                 onClick={() => {
                                   setEditItems([...editItems, {
                                     id: \`new-\${Date.now()}\`,
                                     requestItemId: '',
                                     productName: '',
                                     quantity: 1,
                                     priceForeign: 0,
                                     priceRIYAL: 0,
                                     currency: 'یورو',
                                     deliveryTime: '',
                                     notes: ''
                                   }]);
                                 }}
                                 className="text-xs flex items-center gap-1 text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                 <Plus size={14} />
                                 افزودن ردیف دستی
                              </button>
                           </div>
                           
                           <div className="overflow-x-auto border border-slate-200 rounded-xl">
                             <table className="w-full text-xs text-right">
                               <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                 <tr>
                                   <th className="p-3 font-semibold">شرح کالا</th>
                                   <th className="p-3 font-semibold w-24">تعداد</th>
                                   <th className="p-3 font-semibold w-32">قیمت ارزی</th>
                                   <th className="p-3 font-semibold w-24">ارز</th>
                                   <th className="p-3 font-semibold w-36">قیمت ریالی</th>
                                   <th className="p-3 font-semibold w-32">زمان تحویل</th>
                                   <th className="p-3 font-semibold">ملاحظات</th>
                                   <th className="p-3 font-semibold w-12 text-center">حذف</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 {editItems.map((item, idx) => (
                                   <tr key={item.id || idx} className="hover:bg-slate-50/50">
                                     <td className="p-2">
                                       <input type="text" value={item.productName} onChange={(e) => {
                                         const newItems = [...editItems];
                                         newItems[idx].productName = e.target.value;
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="شرح کالا..." />
                                     </td>
                                     <td className="p-2">
                                       <input type="number" min="1" value={item.quantity} onChange={(e) => {
                                         const newItems = [...editItems];
                                         newItems[idx].quantity = Number(e.target.value);
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" />
                                     </td>
                                     <td className="p-2">
                                       <input type="number" value={item.priceForeign || ''} onChange={(e) => {
                                         const newItems = [...editItems];
                                         const pf = Number(e.target.value);
                                         newItems[idx].priceForeign = pf;
                                         // Auto calc rial
                                         if (newItems[idx].currency === 'ریال') {
                                            newItems[idx].priceRIYAL = pf;
                                         } else {
                                            const mapping: any = { 'دلار': 'USD', 'یورو': 'EUR', 'درهم': 'AED', 'یوان': 'CNY' };
                                            const rateObj = exchangeRates.find(r => r.currency === mapping[newItems[idx].currency]);
                                            if (rateObj) newItems[idx].priceRIYAL = Math.round(pf * rateObj.rateToRIYAL);
                                         }
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                                     </td>
                                     <td className="p-2">
                                       <select value={item.currency || 'یورو'} onChange={(e) => {
                                         const newItems = [...editItems];
                                         const curr = e.target.value as any;
                                         newItems[idx].currency = curr;
                                         // Re-calc
                                         if (curr === 'ریال') {
                                            newItems[idx].priceRIYAL = newItems[idx].priceForeign;
                                         } else {
                                            const mapping: any = { 'دلار': 'USD', 'یورو': 'EUR', 'درهم': 'AED', 'یوان': 'CNY' };
                                            const rateObj = exchangeRates.find(r => r.currency === mapping[curr]);
                                            if (rateObj) newItems[idx].priceRIYAL = Math.round((newItems[idx].priceForeign || 0) * rateObj.rateToRIYAL);
                                         }
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400">
                                         <option value="یورو">یورو</option>
                                         <option value="دلار">دلار</option>
                                         <option value="درهم">درهم</option>
                                         <option value="یوان">یوان</option>
                                         <option value="ریال">ریال</option>
                                       </select>
                                     </td>
                                     <td className="p-2">
                                       <input type="number" value={item.priceRIYAL || ''} onChange={(e) => {
                                         const newItems = [...editItems];
                                         newItems[idx].priceRIYAL = Number(e.target.value);
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                                     </td>
                                     <td className="p-2">
                                       <input type="text" value={item.deliveryTime || ''} onChange={(e) => {
                                         const newItems = [...editItems];
                                         newItems[idx].deliveryTime = e.target.value;
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="مثال: ۴ هفته" />
                                     </td>
                                     <td className="p-2">
                                       <input type="text" value={item.notes || ''} onChange={(e) => {
                                         const newItems = [...editItems];
                                         newItems[idx].notes = e.target.value;
                                         setEditItems(newItems);
                                       }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="..." />
                                     </td>
                                     <td className="p-2 text-center">
                                       <button type="button" onClick={() => {
                                         const newItems = [...editItems];
                                         newItems.splice(idx, 1);
                                         setEditItems(newItems);
                                       }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors">
                                         <Trash2 size={16} />
                                       </button>
                                     </td>
                                   </tr>
                                 ))}
                                 {editItems.length === 0 && (
                                   <tr>
                                     <td colSpan={8} className="p-6 text-center text-slate-400">ردیفی اضافه نشده است.</td>
                                   </tr>
                                 )}
                               </tbody>
                             </table>
                           </div>
                        </div>
                        
                        {/* Notes */}
`;

// There are multiple instances of the form fields: one in the Create tab, one in the Edit Modal.
// The create tab regex already matched the first one. Let's make sure we find the one in the edit modal.
// In edit modal: <label className="block text-xs font-bold text-slate-700 mb-2">زمان تحویل پیشنهاد شده</label>
content = content.replace(
  /\{\/\* Quick Offer pricing if available \*\/\}.*?\{\/\* Notes \*\/\}/s,
  editTableComponent
);


fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);
