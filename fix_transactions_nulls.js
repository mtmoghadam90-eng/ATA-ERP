import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

// Replace usages of `p.summary.totalRealizedGainLoss.toLocaleString('fa-IR')` etc.
content = content.replace(
  /\{p\.summary\.totalRealizedGainLoss >= 0 \? '\+' : ''\}\{p\.summary\.totalRealizedGainLoss\.toLocaleString\('fa-IR'\)\} <span className="text-\[10px\] font-normal">ریال<\/span>/g,
  "{p.summary.totalRealizedGainLoss !== null ? <>{p.summary.totalRealizedGainLoss >= 0 ? '+' : ''}{p.summary.totalRealizedGainLoss.toLocaleString('fa-IR')} <span className=\"text-[10px] font-normal\">ریال</span></> : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

content = content.replace(
  /className=\{`text-xs sm:text-sm font-extrabold font-mono mt-1 \$\{p\.summary\.totalRealizedGainLoss >= 0 \? 'text-emerald-600' : 'text-red-600'\}`\}/g,
  "className={`text-xs sm:text-sm font-extrabold font-mono mt-1 ${p.summary.totalRealizedGainLoss === null ? 'text-red-500' : p.summary.totalRealizedGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}"
);

content = content.replace(
  /\{p\.summary\.totalUnrealizedGainLoss >= 0 \? '\+' : ''\}\{p\.summary\.totalUnrealizedGainLoss\.toLocaleString\('fa-IR'\)\} <span className="text-\[10px\] font-normal">ریال<\/span>/g,
  "{p.summary.totalUnrealizedGainLoss !== null ? <>{p.summary.totalUnrealizedGainLoss >= 0 ? '+' : ''}{p.summary.totalUnrealizedGainLoss.toLocaleString('fa-IR')} <span className=\"text-[10px] font-normal\">ریال</span></> : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

content = content.replace(
  /className=\{`text-xs sm:text-sm font-extrabold font-mono mt-1 \$\{p\.summary\.totalUnrealizedGainLoss >= 0 \? 'text-emerald-600' : 'text-red-600'\}`\}/g,
  "className={`text-xs sm:text-sm font-extrabold font-mono mt-1 ${p.summary.totalUnrealizedGainLoss === null ? 'text-red-500' : p.summary.totalUnrealizedGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}"
);

content = content.replace(
  /<td className="p-2 text-left font-mono">\{rep\.salesAmountHistoricalRiyal\.toLocaleString\('fa-IR'\)\}<\/td>/g,
  "<td className=\"p-2 text-left font-mono\">{rep.salesAmountHistoricalRiyal !== null ? rep.salesAmountHistoricalRiyal.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}</td>"
);

content = content.replace(
  /<td className="p-2 text-left font-mono font-bold text-amber-600">\{rep\.remainingAmountCurrentRiyal\.toLocaleString\('fa-IR'\)\}<\/td>/g,
  "<td className=\"p-2 text-left font-mono font-bold text-amber-600\">{rep.remainingAmountCurrentRiyal !== null ? rep.remainingAmountCurrentRiyal.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}</td>"
);


fs.writeFileSync('src/components/TransactionsView.tsx', content);

