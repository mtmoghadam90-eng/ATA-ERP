import fs from 'fs';

let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

content = content.replace(
  /disabled=\{\(\(\) => \{\s*if \(\!editingProforma\) return false;\s*\/\/ Use our logic to determine if it's 100% settled\s*\/\/ Actually we have calculateProformaFinance\s*const rep = calculateProformaFinance\(editingProforma, transactions, currentExchangeRates\);\s*return rep\.settlementPercent === 100 && rep\.historicalExchangeRate > 0;\s*\}\)\(\)\}/,
  `disabled={(() => {
                           if (!editingProforma) return false;
                           return editingProforma.outcome === 'تأیید شده (برنده)' && (editingProforma.historicalExchangeRate || 0) > 0;
                        })()}`
);

fs.writeFileSync('src/components/ProformasView.tsx', content);

