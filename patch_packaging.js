import fs from 'fs';
let content = fs.readFileSync('src/components/PackagingDeliveryView.tsx', 'utf-8');

// 1. Add ShamsiDatePicker import
if (!content.includes('import ShamsiDatePicker')) {
  content = content.replace(
    "import { getTodayShamsi, generateId } from '../dateUtils';",
    "import { getTodayShamsi, generateId } from '../dateUtils';\nimport ShamsiDatePicker from './ShamsiDatePicker';"
  );
}

// 2. Add state
content = content.replace(
  "const [deliveryDate, setDeliveryDate] = useState<string>(getTodayShamsi());",
  "const [deliveryDate, setDeliveryDate] = useState<string>(getTodayShamsi());\n  const [dispatchDate, setDispatchDate] = useState<string>('');\n  const [actualDeliveryDate, setActualDeliveryDate] = useState<string>('');"
);

// 3. handleEdit
content = content.replace(
  "setDeliveryDate(delivery.deliveryDate);",
  "setDeliveryDate(delivery.deliveryDate);\n    setDispatchDate(delivery.dispatchDate || '');\n    setActualDeliveryDate(delivery.actualDeliveryDate || '');"
);

// 4. handleSubmit (add)
content = content.replace(
  "deliveryDate,\n          shippingMethod,",
  "deliveryDate,\n          dispatchDate,\n          actualDeliveryDate,\n          shippingMethod,"
);

// 5. handleSubmit (update)
content = content.replace(
  "deliveryDate,\n        shippingMethod,",
  "deliveryDate,\n        dispatchDate,\n        actualDeliveryDate,\n        shippingMethod,"
);

// 6. Reset states
content = content.replace(
  "setDeliveryDate(getTodayShamsi());",
  "setDeliveryDate(getTodayShamsi());\n    setDispatchDate('');\n    setActualDeliveryDate('');"
);

// 7. Update UI to use ShamsiDatePicker instead of input for deliveryDate and add others
content = content.replace(
  /<div className="space-y-1">\s*<label className="block text-xs font-bold text-slate-700">تاریخ صدور \/ ارسال<\/label>\s*<input\s*type="text"\s*value=\{deliveryDate\}\s*onChange=\{e => setDeliveryDate\(e\.target\.value\)\}\s*required\s*placeholder="مثال: ۱۴۰۵\/۰۴\/۱۸"\s*className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-left focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"\s*dir="ltr"\s*\/>\s*<\/div>/,
  `
            <div className="space-y-1">
              <ShamsiDatePicker
                label="تاریخ صدور پکینگ لیست *"
                required
                value={deliveryDate}
                onChange={setDeliveryDate}
              />
            </div>
            
            <div className="space-y-1">
              <ShamsiDatePicker
                label="تاریخ ارسال / خروج کالا (اختیاری)"
                value={dispatchDate}
                onChange={setDispatchDate}
              />
            </div>

            <div className="space-y-1">
              <ShamsiDatePicker
                label="تاریخ تحویل به مشتری (اختیاری)"
                value={actualDeliveryDate}
                onChange={setActualDeliveryDate}
              />
            </div>
  `
);

// 8. Update listing to show the dates
content = content.replace(
  /<div className="text-\[11px\] text-slate-500 flex justify-between">\s*<span>تاریخ صدور:<\/span>\s*<span className="font-mono text-slate-700">\{delivery\.deliveryDate\}<\/span>\s*<\/div>/,
  `<div className="text-[11px] text-slate-500 flex justify-between pb-1 border-b border-dashed border-slate-100">
                                <span>تاریخ صدور پکینگ لیست:</span>
                                <span className="font-mono text-slate-700">{delivery.deliveryDate}</span>
                              </div>
                              {delivery.dispatchDate && (
                                <div className="text-[11px] text-sky-600 flex justify-between pb-1 border-b border-dashed border-sky-100/50">
                                  <span>تاریخ خروج/ارسال:</span>
                                  <span className="font-mono font-bold">{delivery.dispatchDate}</span>
                                </div>
                              )}
                              {delivery.actualDeliveryDate && (
                                <div className="text-[11px] text-emerald-600 flex justify-between">
                                  <span>تاریخ تحویل نهایی:</span>
                                  <span className="font-mono font-bold">{delivery.actualDeliveryDate}</span>
                                </div>
                              )}`
);

// 9. Update print view HTML
content = content.replace(
  '<div class="meta-item"><span class="meta-label">تاریخ صدور / ارسال:</span> <span class="meta-value font-mono">${delivery.deliveryDate}</span></div>',
  '<div class="meta-item"><span class="meta-label">تاریخ صدور پکینگ لیست:</span> <span class="meta-value font-mono">${delivery.deliveryDate}</span></div>\n            ${delivery.dispatchDate ? `<div class="meta-item"><span class="meta-label">تاریخ ارسال/خروج:</span> <span class="meta-value font-mono">${delivery.dispatchDate}</span></div>` : \'\'}\n            ${delivery.actualDeliveryDate ? `<div class="meta-item"><span class="meta-label">تاریخ تحویل کالا:</span> <span class="meta-value font-mono">${delivery.actualDeliveryDate}</span></div>` : \'\'}'
);

// 10. Also update the View Modal
content = content.replace(
  '<div className="text-xs text-slate-600 flex items-center gap-1.5">\n                    <span className="text-slate-400">تاریخ صدور / ارسال:</span>\n                    <strong className="text-slate-800 font-mono font-bold">{selectedDelivery.deliveryDate}</strong>\n                  </div>',
  `<div className="text-xs text-slate-600 flex items-center gap-1.5 border-b border-slate-50 pb-1">
                    <span className="text-slate-400">تاریخ صدور پکینگ لیست:</span>
                    <strong className="text-slate-800 font-mono font-bold">{selectedDelivery.deliveryDate}</strong>
                  </div>
                  {selectedDelivery.dispatchDate && (
                    <div className="text-xs text-sky-600 flex items-center gap-1.5 border-b border-sky-50 pb-1">
                      <span className="text-sky-500/80">تاریخ ارسال / خروج:</span>
                      <strong className="font-mono font-bold">{selectedDelivery.dispatchDate}</strong>
                    </div>
                  )}
                  {selectedDelivery.actualDeliveryDate && (
                    <div className="text-xs text-emerald-600 flex items-center gap-1.5 border-b border-emerald-50 pb-1">
                      <span className="text-emerald-500/80">تاریخ تحویل نهایی:</span>
                      <strong className="font-mono font-bold">{selectedDelivery.actualDeliveryDate}</strong>
                    </div>
                  )}`
);


fs.writeFileSync('src/components/PackagingDeliveryView.tsx', content);
