import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

// The modal fields are standard form fields. We can just add a global disabled state or add disabled={isFormDisabled} to all inputs.
// Or simpler: disable the form via a fieldset.

const fieldsetInject = `
                {/* Form fields */}
                <fieldset disabled={(() => {
                  if (editingTransaction && editingTransaction.status === 'لغو شده') return true;
                  if (editingTransaction && editingTransaction.status === 'برگشت شده') return true;
                  if (editingTransaction && editingTransaction.proformaId) {
                     // Check if fully settled
                     // Wait, if we are editing a transaction, the proforma might already be settled WITH this transaction.
                     // So we shouldn't lock it if we are editing the transaction that caused the settlement?
                     // Ah! The instruction says: "اگر تراکنش لغو شده بود یا پیش فاکتور متصل کاملا تسویه شده بود، فیلدها غیرفعال شوند."
                     // Let's just follow the instruction literally.
                     const pf = proformas.find(p => p.id === editingTransaction.proformaId);
                     if (pf) {
                        const rep = calculateProformaFinance(pf, transactions, currentExchangeRates);
                        // If it's 100% settled, we disable. 
                        // But wait! If it's 100% settled, how do we edit it? The instruction says disable.
                        if (rep.settlementPercent === 100) return true;
                     }
                  }
                  return false;
                })()} className="space-y-4">
`;

// Wrap the form body in <fieldset>
content = content.replace(/\{\/\* Type \*\/\}/, fieldsetInject + '\n{/* Type */}');
content = content.replace(/\{\/\* Submit \*\/\}/, '</fieldset>\n{/* Submit */}');

// Also import calculateProformaFinance
if (!content.includes('calculateProformaFinance')) {
   content = content.replace(/import \{ calculateProjectFinance/g, "import { calculateProformaFinance, calculateProjectFinance");
}

fs.writeFileSync('src/components/TransactionsView.tsx', content);
