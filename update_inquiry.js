import fs from 'fs';

let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf-8');

// The items state
// Currently: const [inquiryItems, setInquiryItems] = useState<{id: string, productId: string, productName: string, quantity: number}[]>([]);
// Let's replace it with an extended one:
content = content.replace(
  /const \[inquiryItems, setInquiryItems\] = useState<\{id: string, productId: string, productName: string, quantity: number\}\[\]>\(\[\]\);/,
  `const [inquiryItems, setInquiryItems] = useState<any[]>([]);`
);

// We need an effect that when selectedProjectId changes, we populate inquiryItems from project.itemsNeeded
const effectCode = `  React.useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find(p => p.id === selectedProjectId);
      if (proj && proj.itemsNeeded) {
        setInquiryItems(proj.itemsNeeded.map(item => ({
          id: \`\${Date.now()}-\${Math.random()}\`,
          requestItemId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          priceForeign: 0,
          priceRIYAL: 0,
          currency: 'یورو',
          deliveryTime: '',
          notes: ''
        })));
      } else {
        setInquiryItems([]);
      }
    } else {
      setInquiryItems([]);
    }
  }, [selectedProjectId, projects]);
`;

content = content.replace(
  /const \[inquiryDate, setInquiryDate\] = useState<string>\(getTodayShamsi\(\)\);/,
  `const [inquiryDate, setInquiryDate] = useState<string>(getTodayShamsi());\n${effectCode}`
);

// Remove project required validation
content = content.replace(
  /if \(\!selectedProjectId \|\| \!selectedSupplierId\) \{/,
  `if (!selectedSupplierId) {`
);
content = content.replace(
  /alert\('لطفاً پروژه و تامین‌کننده را حتماً مشخص کنید\.'\);/,
  `alert('لطفاً تامین‌کننده را حتماً مشخص کنید.');`
);

// addSupplierInquiry payload map
const oldPayload = `      items: inquiryItems.map(item => ({
        id: \`inqitem-\${Date.now()}-\${item.productId}\`,
        requestItemId: item.productId,
        productName: item.productName,
        quantity: item.quantity
      })),`;
const newPayload = `      items: inquiryItems.map((item, idx) => ({
        id: \`inqitem-\${Date.now()}-\${idx}\`,
        requestItemId: item.requestItemId || '',
        productName: item.productName,
        quantity: item.quantity,
        priceForeign: item.priceForeign || undefined,
        priceRIYAL: item.priceRIYAL || undefined,
        currency: item.currency || undefined,
        deliveryTime: item.deliveryTime || undefined,
        notes: item.notes || undefined
      })),`;
content = content.replace(oldPayload, newPayload);


// Replace the grid section where price and currency are, to a new Table.
const gridReplaceRegex = /\{\/\* Quick Offer pricing if available \*\/\}.*?\{\/\* Notes \*\/\}/s;

const tableComponent = `
          {/* Items Table */}
          <div className="mt-8">
             <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-slate-700">اقلام استعلام و پیشنهاد سازنده</label>
                <button
                   type="button"
                   onClick={() => {
                     setInquiryItems([...inquiryItems, {
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
                   {inquiryItems.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/50">
                       <td className="p-2">
                         <input type="text" value={item.productName} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].productName = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="شرح کالا..." />
                       </td>
                       <td className="p-2">
                         <input type="number" min="1" value={item.quantity} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].quantity = Number(e.target.value);
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" />
                       </td>
                       <td className="p-2">
                         <input type="number" value={item.priceForeign || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
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
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                       </td>
                       <td className="p-2">
                         <select value={item.currency || 'یورو'} onChange={(e) => {
                           const newItems = [...inquiryItems];
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
                           setInquiryItems(newItems);
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
                           const newItems = [...inquiryItems];
                           newItems[idx].priceRIYAL = Number(e.target.value);
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                       </td>
                       <td className="p-2">
                         <input type="text" value={item.deliveryTime || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].deliveryTime = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="مثال: ۴ هفته" />
                       </td>
                       <td className="p-2">
                         <input type="text" value={item.notes || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].notes = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="..." />
                       </td>
                       <td className="p-2 text-center">
                         <button type="button" onClick={() => {
                           const newItems = [...inquiryItems];
                           newItems.splice(idx, 1);
                           setInquiryItems(newItems);
                         }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors">
                           <Trash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {inquiryItems.length === 0 && (
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

if (content.match(gridReplaceRegex)) {
  content = content.replace(gridReplaceRegex, tableComponent);
} else {
  console.log("Could not find gridReplaceRegex in first attempt");
}

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);

