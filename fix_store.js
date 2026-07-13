import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// For addTransaction
content = content.replace(
  /notifyModuleResponsible\('transactions', 'ثبت تراکنش جدید', `یک تراکنش \$\{newTransaction\.type === 'دریافت' \? 'دریافتی' : 'پرداختی'\} به مبلغ \$\{newTransaction\.amountRIYAL\.toLocaleString\('fa-IR'\)\} ریال ثبت شد\.`, newTransaction\.projectId\);/,
  `notifyModuleResponsible('transactions', 'ثبت تراکنش جدید', \`یک تراکنش \${newTransaction.type === 'دریافت' ? 'دریافتی' : 'پرداختی'} به مبلغ \${newTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال ثبت شد.\`, newTransaction.projectId);\n    logAction('CREATE', 'دریافت و پرداخت', newTransaction.id, \`ثبت تراکنش \${newTransaction.type === 'دریافت' ? 'دریافتی' : 'پرداختی'} جدید به شماره \${newTransaction.documentNumber} و مبلغ \${newTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال\`, undefined, newTransaction);`
);

// For updateTransaction
content = content.replace(
  /const updated = transactions\.map\(t => t\.id === updatedTransaction\.id \? updatedTransaction : t\);\s*saveToStorage\('erp_transactions', updated, setTransactions\);\s*notifyModuleResponsible\('transactions', 'ویرایش تراکنش', `تراکنش شماره \$\{updatedTransaction\.documentNumber\} ویرایش شد\.`, updatedTransaction\.projectId\);/,
  `const before = transactions.find(t => t.id === updatedTransaction.id);\n    const updated = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);\n    saveToStorage('erp_transactions', updated, setTransactions);\n    \n    notifyModuleResponsible('transactions', 'ویرایش تراکنش', \`تراکنش شماره \${updatedTransaction.documentNumber} ویرایش شد.\`, updatedTransaction.projectId);\n    if (before) {\n      logAction('UPDATE', 'دریافت و پرداخت', updatedTransaction.id, \`ویرایش تراکنش \${updatedTransaction.type} به شماره \${updatedTransaction.documentNumber}\`, before, updatedTransaction);\n    }`
);

fs.writeFileSync('src/useERPStore.ts', content);

