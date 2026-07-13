import fs from 'fs';

let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const regex = /<input\s*type="number"\s*value=\{historicalExchangeRate \|\| ''\}\s*onChange=\{\(e\) => setHistoricalExchangeRate\(Number\(e\.target\.value\)\)\}/;
const newRegex = `{/* 7. Lock historical rate if fully settled */}`;

const replaceCode = `
                      <input
                        type="number"
                        value={historicalExchangeRate || ''}
                        onChange={(e) => setHistoricalExchangeRate(Number(e.target.value))}
                        disabled={(() => {
                           if (!editingProforma) return false;
                           // Use our logic to determine if it's 100% settled
                           // Actually we have calculateProformaFinance
                           const rep = calculateProformaFinance(editingProforma, transactions, currentExchangeRates);
                           return rep.settlementPercent === 100 && rep.historicalExchangeRate > 0;
                        })()}
`;
content = content.replace(regex, replaceCode);

// Also need to import calculateProformaFinance if it's not imported
if (!content.includes('calculateProformaFinance')) {
   content = content.replace(/import \{ calculateProjectFinance/g, "import { calculateProformaFinance, calculateProjectFinance");
}

fs.writeFileSync('src/components/ProformasView.tsx', content);
