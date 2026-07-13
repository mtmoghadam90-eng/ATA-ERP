import fs from 'fs';

let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf-8');

const itemsTableStr = `                          {/* Items Table Full Width */}
                          {inq.items && inq.items.length > 0 && (
                            <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded-xl border border-slate-100">
                              <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 mb-3">اقلام استعلام و پیشنهاد سازنده</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-right">
                                  <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                      <th className="p-2 font-semibold">شرح کالا</th>
                                      <th className="p-2 font-semibold text-center w-16">تعداد</th>
                                      <th className="p-2 font-semibold w-24">قیمت ارزی</th>
                                      <th className="p-2 font-semibold w-32">قیمت ریالی</th>
                                      <th className="p-2 font-semibold w-24">زمان تحویل</th>
                                      <th className="p-2 font-semibold">ملاحظات</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {inq.items.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="p-2 font-medium text-slate-700">{item.productName}</td>
                                        <td className="p-2 text-center text-slate-600 font-mono">{item.quantity}</td>
                                        <td className="p-2 font-mono text-slate-600">{item.priceForeign ? \`\${item.priceForeign.toLocaleString('fa-IR')} \${item.currency}\` : '-'}</td>
                                        <td className="p-2 font-mono text-slate-600">{item.priceRIYAL ? \`\${item.priceRIYAL.toLocaleString('fa-IR')} ریال\` : '-'}</td>
                                        <td className="p-2 text-slate-600">{item.deliveryTime || '-'}</td>
                                        <td className="p-2 text-slate-500">{item.notes || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}`;

content = content.replace(
  /\{\/\* Column 1: Details & Files \*\/\}/,
  itemsTableStr + '\n                          {/* Column 1: Details & Files */}'
);

// We should also modify the "قیمت ریالی" and "قیمت ارزی" in the header to show the total price if it's not set on the parent.
// Or we can just calculate total price from items on the fly for the list header.
// Let's replace the header price rendering
const headerPriceRegex = /\{inq\.priceForeign \? \([\s\S]*?\} \)\}/;
// Actually, let's just let it show what's there, but we can update how edit works.
// Where is Edit Modal?

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);

