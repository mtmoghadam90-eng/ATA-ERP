import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

const regex = /\{\/\* Expected Close Date & Key Dates \*\/\}([\s\S]*?)<\/td>/;

const newTd = `{/* Key Dates */}
                  <td className="p-3 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between gap-2 border-b border-dashed border-slate-100 pb-0.5">
                      <span className="text-slate-400">ثبت فرصت:</span>
                      <span className="font-mono">{p.opportunityDate || p.creationDate}</span>
                    </div>
                    {p.prepaymentDate && (
                      <div className="flex justify-between gap-2 text-indigo-600 font-bold border-b border-dashed border-indigo-100 pb-0.5">
                        <span>دریافت پیش‌پرداخت:</span>
                        <span className="font-mono">{p.prepaymentDate}</span>
                      </div>
                    )}
                    {p.winningDate && (
                      <div className="flex justify-between gap-2 text-emerald-600 font-bold border-b border-dashed border-emerald-100 pb-0.5">
                        <span>تاریخ تایید:</span>
                        <span className="font-mono">{p.winningDate}</span>
                      </div>
                    )}
                    {p.agreedDeliveryDate && (
                      <div className="flex justify-between gap-2 text-sky-600 font-bold border-b border-dashed border-sky-100 pb-0.5">
                        <span>توافق‌شده تحویل:</span>
                        <span className="font-mono">{p.agreedDeliveryDate}</span>
                      </div>
                    )}
                    {getActualDeliveryDate(p.id) && (
                      <div className="flex justify-between gap-2 text-amber-600 font-bold">
                        <span>تحویل قطعی:</span>
                        <span className="font-mono">{getActualDeliveryDate(p.id)}</span>
                      </div>
                    )}
                  </td>`;

content = content.replace(regex, newTd);
fs.writeFileSync('src/components/ProjectsView.tsx', content);
