import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

const regex = /const totalProjSales = computedProjectSummaries\.reduce\(\(sum, p\) => sum \+ p\.salesAmount, 0\);\s*const totalProjReceived = computedProjectSummaries\.reduce\(\(sum, p\) => sum \+ p\.paidAmount, 0\);\s*const totalProjRemaining = computedProjectSummaries\.reduce\(\(sum, p\) => sum \+ p\.remainingAmount, 0\);/g;

const replacement = `let totalProjSales: number | null = 0;
  let totalProjReceived = 0;
  let totalProjRemaining: number | null = 0;
  
  for (const p of computedProjectSummaries) {
    if (p.salesAmount === null) {
      totalProjSales = null;
    } else if (totalProjSales !== null) {
      totalProjSales += p.salesAmount;
    }
    
    totalProjReceived += p.paidAmount;
    
    if (p.remainingAmount === null) {
      totalProjRemaining = null;
    } else if (totalProjRemaining !== null) {
      totalProjRemaining += p.remainingAmount;
    }
  }`;

content = content.replace(regex, replacement);

content = content.replace(
  /\{totalProjSales\.toLocaleString\('fa-IR'\)\}/g,
  "{totalProjSales !== null ? totalProjSales.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

content = content.replace(
  /\{totalProjRemaining\.toLocaleString\('fa-IR'\)\}/g,
  "{totalProjRemaining !== null ? totalProjRemaining.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

content = content.replace(
  /\{p\.salesAmount\.toLocaleString\('fa-IR'\)\}/g,
  "{p.salesAmount !== null ? p.salesAmount.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

content = content.replace(
  /\{p\.remainingAmount\.toLocaleString\('fa-IR'\)\}/g,
  "{p.remainingAmount !== null ? p.remainingAmount.toLocaleString('fa-IR') : <span className=\"text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded text-[10px]\">⚠️ نامشخص</span>}"
);

fs.writeFileSync('src/components/TransactionsView.tsx', content);
