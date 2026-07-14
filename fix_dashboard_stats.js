import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const regex = /<div className="bg-slate-900 rounded-3xl[\s\S]*$/;
const index = content.search(regex);
if (index === -1) {
  console.log('Not found!');
  process.exit(1);
}

const replacement = `
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Conversion Rate Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Activity size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-800">نرخ تبدیل کلی پیش‌فاکتورها</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                درصد پیش‌فاکتورهایی که به قرارداد نهایی (برنده) تبدیل شده‌اند نسبت به کل پیش‌فاکتورهای تعیین تکلیف شده.
              </p>
            </div>
            
            <div className="flex items-end gap-6 pb-2">
              <div className="flex-1 relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 right-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: \`\${proformas.length > 0 ? Math.round((proformas.filter(p => { const outcome = getProformaOutcomeStatus(p); return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده'; }).length / Math.max(1, proformas.filter(p => { const outcome = getProformaOutcomeStatus(p); return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده' || outcome === 'باخته'; }).length)) * 100) : 0}%\` }}
                ></div>
              </div>
              <div className="text-4xl font-black text-slate-800 font-mono tracking-tighter">
                {proformas.length > 0 ? Math.round((proformas.filter(p => { const outcome = getProformaOutcomeStatus(p); return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده'; }).length / Math.max(1, proformas.filter(p => { const outcome = getProformaOutcomeStatus(p); return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده' || outcome === 'باخته'; }).length)) * 100) : 0}<span className="text-xl text-slate-400 font-sans">٪</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 size={14} />
                <span>برنده: {proformas.filter(p => { const outcome = getProformaOutcomeStatus(p); return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده'; }).length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-500">
                <AlertCircle size={14} />
                <span>باخته: {proformas.filter(p => getProformaOutcomeStatus(p) === 'باخته').length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <FileText size={14} />
                <span>کل صادر شده: {proformas.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate by Category Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-800">نرخ تبدیل به تفکیک دسته محصول</h3>
            </div>
            
            <div className="flex-1 overflow-auto max-h-[220px] pr-2 space-y-4">
              {(() => {
                const decidedProformas = proformas.filter(p => {
                  const outcome = getProformaOutcomeStatus(p);
                  return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده' || outcome === 'باخته';
                });
                
                const categoryStats: Record<string, { won: number, total: number }> = {};
                
                decidedProformas.forEach(p => {
                  const outcome = getProformaOutcomeStatus(p);
                  const isWon = outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده';
                  
                  const hasExplicitWon = p.items?.some(item => item.status === 'برنده');
                  
                  p.items?.forEach(item => {
                    let itemWon = false;
                    if (isWon) {
                       if (hasExplicitWon) {
                         itemWon = item.status === 'برنده';
                       } else {
                         itemWon = true;
                       }
                    }
                    
                    const product = products.find(prod => prod.id === item.productId);
                    const catName = product?.category || 'سایر تجهیزات';
                    
                    if (!categoryStats[catName]) {
                      categoryStats[catName] = { won: 0, total: 0 };
                    }
                    categoryStats[catName].total += item.quantity;
                    if (itemWon) {
                      categoryStats[catName].won += item.quantity;
                    }
                  });
                });
                
                const categoryConversionData = Object.entries(categoryStats).map(([name, stats]) => ({
                  name,
                  conversion: stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0,
                  total: stats.total,
                  won: stats.won
                })).sort((a, b) => b.total - a.total).slice(0, 5);

                if (categoryConversionData.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                      <FileSpreadsheet size={32} className="text-slate-300 mb-2 opacity-50" />
                      <p className="text-xs">داده کافی برای نمایش وجود ندارد.</p>
                    </div>
                  );
                }

                return categoryConversionData.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-slate-500 font-mono">{cat.conversion}٪</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: \`\${cat.conversion}%\` }}
                      ></div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}
`;

content = content.slice(0, index) + replacement;

fs.writeFileSync('src/components/DashboardView.tsx', content);

