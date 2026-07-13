import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

const regex = /\{\/\* Amount \*\/\}\s*<div className="space-y-1\.5">\s*<label className="text-xs font-semibold text-slate-500">مبلغ نقد ریالی \*\<\/label>\s*<input\s*type="number"\s*required\s*value=\{amountRIYAL\}\s*onChange=\{\(e\) => setAmountRIYAL\(Number\(e\.target\.value\)\)\}\s*className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"\s*\/>\s*<\/div>/;

const newInputs = `{/* Financial Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">مبلغ ریالی (یا معادل ریالی) *</label>
                    <input
                      type="number"
                      required
                      value={amountRIYAL}
                      onChange={(e) => setAmountRIYAL(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">مبلغ ارزی (در صورت وجود)</label>
                    <input
                      type="number"
                      value={amountForeign}
                      onChange={(e) => setAmountForeign(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                    />
                  </div>
                  
                  {amountForeign > 0 && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">نرخ تبدیل / تسویه *</label>
                        <input
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(Number(e.target.value))}
                          required={amountForeign > 0}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                        />
                      </div>
                      
                      <div className="space-y-1.5 flex items-end">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 w-full cursor-pointer h-[38px]">
                          <input
                            type="checkbox"
                            checked={isDirectForeign}
                            onChange={(e) => setIsDirectForeign(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>دریافت مستقیم ارزی است</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>`;

if (!regex.test(content)) {
    console.error('Regex did not match!');
    process.exit(1);
}

content = content.replace(regex, newInputs);
fs.writeFileSync('src/components/TransactionsView.tsx', content);
