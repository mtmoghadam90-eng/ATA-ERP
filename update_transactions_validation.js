import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

const regex = /const handleSave = \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);/;

const validationCode = `const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. شناسه تراکنش
    if (!documentNumber || documentNumber.trim() === '') {
      alert('شناسه تراکنش (شماره سند) نباید خالی باشد.');
      return;
    }

    // 2. تاریخ
    if (!date) {
      alert('تاریخ نباید خالی باشد.');
      return;
    }

    // 4 & 5. شماره پیگیری برای حواله و چک
    if ((paymentType === 'حواله بانکی' || paymentType === 'چک') && (!referenceNumber || referenceNumber.trim() === '')) {
      alert('برای حواله بانکی یا چک، شماره پیگیری/شماره چک الزامی است.');
      return;
    }

    // 6. مبلغ
    if (amountRIYAL <= 0 && amountForeign <= 0) {
      alert('مبلغ باید بیشتر از 0 باشد.');
      return;
    }

    // 10. نرخ تبدیل برای ارزی
    if (amountForeign > 0 && (!exchangeRate || exchangeRate <= 0)) {
      alert('برای دریافت ارزی، وارد کردن نرخ تسویه (حتی 1 برای دریافت مستقیم) الزامی است.');
      return;
    }

    // 8. پیش‌پرداخت بدون پروژه
    if (receiptType === 'پیش‌پرداخت' && !proformaId && !projectId) {
      alert('برای ثبت پیش‌پرداخت بدون اتصال به پیش‌فاکتور، انتخاب پروژه الزامی است.');
      return;
    }

    // 13 & 15. Validation for editing
    if (editingTransaction) {
      if (editingTransaction.status === 'لغو شده' || editingTransaction.status === 'برگشت شده') {
        alert('تراکنش لغو شده یا برگشت شده قابل ویرایش نیست.');
        return;
      }
      
      // Prevent changing amount on existing confirmed transaction unless it's just a status update
      // Actually, if we want to be strict, only allow status changes
      if (editingTransaction.amountRIYAL !== amountRIYAL || editingTransaction.amountForeign !== amountForeign) {
         if (editingTransaction.status === 'تأیید شده') {
             alert('امکان تغییر مبلغ برای تراکنش تأیید شده وجود ندارد. در صورت نیاز باید تراکنش را ابطال یا برگشت وجه ثبت کنید.');
             return;
         }
      }
    }

    // 7 & 11. Overpayment check
    if (type === 'دریافت' && proformaId && status !== 'لغو شده' && status !== 'برگشت شده' && !reversalOfTransactionId) {
      const pf = proformas.find(p => p.id === proformaId);
      if (pf) {
        // Calculate remaining manually or use computed summaries
        // To keep it simple, we use the computed remaining from pf
        const summary = computedProjectSummaries.find(p => p.id === pf.projectId)?.proformas.find(p => p.proformaId === proformaId);
        if (summary) {
           let newAmountForeign = 0;
           if (amountForeign > 0) {
              if (isDirectForeign) {
                 newAmountForeign = amountForeign;
              } else {
                 newAmountForeign = exchangeRate > 0 ? (amountRIYAL / exchangeRate) : 0;
              }
           } else {
              newAmountForeign = pf.currency === 'ریال' ? amountRIYAL : (exchangeRate > 0 ? amountRIYAL / exchangeRate : 0);
           }
           
           // If we are editing, we should add back the old amount before checking
           let oldAmountForeign = 0;
           if (editingTransaction && editingTransaction.status === 'تأیید شده') {
              if (editingTransaction.amountForeign > 0) {
                 oldAmountForeign = editingTransaction.isDirectForeign ? editingTransaction.amountForeign : (editingTransaction.exchangeRate > 0 ? editingTransaction.amountRIYAL / editingTransaction.exchangeRate : 0);
              } else {
                 oldAmountForeign = pf.currency === 'ریال' ? editingTransaction.amountRIYAL : (editingTransaction.exchangeRate > 0 ? editingTransaction.amountRIYAL / editingTransaction.exchangeRate : 0);
              }
           }
           
           const actualRemaining = summary.remainingAmountForeign + oldAmountForeign;
           
           if (newAmountForeign > actualRemaining + 0.001) {
              const confirmOver = window.confirm('مبلغ دریافتی بیش از مانده پیش‌فاکتور است. آیا مطمئن هستید؟ (مبلغ مازاد به عنوان مبلغ تخصیص‌نیافته در سطح پروژه ذخیره خواهد شد)');
              if (!confirmOver) return;
           }
        }
      }
    }
`;

content = content.replace(regex, validationCode);
fs.writeFileSync('src/components/TransactionsView.tsx', content);
