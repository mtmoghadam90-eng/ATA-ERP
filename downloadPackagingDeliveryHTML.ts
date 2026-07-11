  const downloadPackagingDeliveryHTML = (delivery: PackagingDelivery) => {
    const template = activeTemplate;
    if (!template) return;
    
    // Group items by box
    const itemsByBox = delivery.items.reduce((acc, item) => {
      const box = item.boxNumber || 'اقلام بدون شماره جعبه';
      if (!acc[box]) acc[box] = [];
      acc[box].push(item);
      return acc;
    }, {} as Record<string, typeof delivery.items>);

    const itemsTables = Object.entries(itemsByBox).map(([box, items], boxIdx) => {
      const itemsRows = items.map((item, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: center; font-family: monospace;">${index + 1}</td>
          <td style="padding: 12px; font-weight: bold; color: #1e293b;">${item.itemOrDocName}</td>
          <td style="padding: 12px; text-align: center; font-family: monospace; font-weight: bold;">${item.quantity}</td>
          <td style="padding: 12px; text-align: center;">${item.packageType}</td>
          <td style="padding: 12px; text-align: left; font-family: monospace;" dir="ltr">${item.dimensions}</td>
          <td style="padding: 12px; text-align: center; font-family: monospace;">${item.weight} Kg</td>
        </tr>
      `).join('');

      return `
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
          <div style="background-color: #f1f5f9; padding: 10px; font-weight: bold; font-size: 12px; border-bottom: 1px solid #cbd5e1;">
            بسته‌بندی / جعبه: ${box}
          </div>
          <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 11px;">
            <thead style="background-color: #f8fafc; color: #64748b;">
              <tr>
                <th style="padding: 12px; width: 40px;">ردیف</th>
                <th style="padding: 12px;">کالا / تجهیز / سند</th>
                <th style="padding: 12px; text-align: center; width: 60px;">تعداد</th>
                <th style="padding: 12px; width: 100px;">نوع بسته‌بندی</th>
                <th style="padding: 12px; width: 140px;">ابعاد بسته‌بندی</th>
                <th style="padding: 12px; text-align: center; width: 100px;">وزن (کیلوگرم)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    

    const preDeliveryNotes = delivery.preDeliveryTestNotes ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 10px;">گزارش تست قبل از تحویل تجهیز</h4>
        <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11px; line-height: 1.6;">
          ${delivery.preDeliveryTestNotes}
        </div>
      </div>
    ` : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پکینگ لیست - ${delivery.packingListNumber}</title>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
    <style>
        body {
            font-family: 'Vazirmatn', sans-serif;
            color: #0f172a;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
            background-color: #f8fafc;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid ${template.titleColor || '#0ea5e9'};
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .logo-box {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo {
            width: 48px;
            height: 48px;
            background-color: #0ea5e9;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
            border-radius: 8px;
        }
        .company-name {
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
            margin: 0;
        }
        .subtitle {
            font-size: 11px;
            color: #94a3b8;
            margin: 0;
            margin-top: 4px;
        }
        .title-box {
            text-align: left;
        }
        .title {
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            color: ${template.titleColor || '#0ea5e9'};
        }
        .doc-subtitle {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
        }
        .meta-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            background-color: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 24px;
            font-size: 11px;
        }
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .meta-label {
            color: #64748b;
        }
        .meta-value {
            font-weight: bold;
            color: #0f172a;
        }
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-top: 40px;
            text-align: center;
        }
        .signature-box {
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background-color: #f8fafc;
        }
        .signature-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 12px;
            color: #334155;
        }
        .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #ffffff;
            border-top: 1px solid #cbd5e1;
            padding: 10px 40px;
            font-size: 10px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
        }
        .print-footer-info {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        .page-number:after {
            content: "صفحه " counter(page);
        }
        @page {
            counter-reset: page 1;
        }
        @media print {
            body {
                counter-reset: page 1;
                background-color: #ffffff;
                padding: 0;
                padding-bottom: 60px;
            }
            .container {
                box-shadow: none;
                padding: 0;
            }
            .print-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 1px solid #94a3b8;
                padding: 10px 0;
                display: flex !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-box">
                ${template.showLogo ? `
                ${template.logoUrl ? `
                    <img src="${template.logoUrl}" alt="${template.companyName}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; background-color: #ffffff;" referrerPolicy="no-referrer" />
                ` : `
                    <div class="logo">ATA</div>
                `}
                <div>
                    <h4 class="company-name">${template.companyName}</h4>
                    <p class="subtitle">تامین تجهیزات اتوماسیون و ابزاردقیق</p>
                </div>
                ` : ''}
            </div>
            
            <div class="title-box">
                <h1 class="title">پکینگ لیست استاندارد کالا (Packing List)</h1>
                <p class="doc-subtitle">مجموعه اسناد رسمی ترخیص و لجستیک</p>
            </div>
        </div>

        <div class="meta-box">
            <div class="meta-item"><span class="meta-label">شماره پکینگ لیست:</span> <span class="meta-value">${delivery.packingListNumber}</span></div>
            <div class="meta-item"><span class="meta-label">تاریخ صدور / ارسال:</span> <span class="meta-value font-mono">${delivery.deliveryDate}</span></div>
            <div class="meta-item"><span class="meta-label">روش ارسال و تحویل:</span> <span class="meta-value">${delivery.shippingMethod}</span></div>
            <div class="meta-item"><span class="meta-label">پروژه (کارفرما):</span> <span class="meta-value">${delivery.projectName}</span></div>
            ${delivery.proformaNumber ? `<div class="meta-item"><span class="meta-label">پیش‌فاکتور مرجع:</span> <span class="meta-value font-mono">${delivery.proformaNumber}</span></div>` : ''}
            <div class="meta-item"><span class="meta-label">مسئول ثبت و کنترل:</span> <span class="meta-value">${currentUser?.fullName || 'مسئول انبار و لجستیک'}</span></div>
        </div>

        ${preDeliveryNotes}
        

        <div style="margin-bottom: 20px;">
            <h4 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 10px;">لیست کالاها و عدل‌بندی بسته‌بندی</h4>
            ${itemsTables}
        </div>

        <div class="signatures">
            <div>
                <div class="signature-title">امضا و تایید تحویل‌گیرنده (کارفرما):</div>
                <div class="signature-box"></div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; font-family: monospace;">نام و نام خانوادگی / تاریخ تحویل</div>
            </div>
            <div>
                <div class="signature-title">مسئول انبار و تایید خروج کالا:</div>
                <div class="signature-box" style="display: flex; flex-direction: row; gap: 16px; align-items: center; justify-content: center;">
                    ${template.companySealUrl ? `<img src="${template.companySealUrl}" style="height: 80px; object-fit: contain;" />` : ''}
                    ${currentUser?.signatureImage ? `<img src="${currentUser.signatureImage}" style="max-height: 60px; max-width: 120px; object-fit: contain;" />` : ''}
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; font-family: monospace;">${currentUser?.fullName || ''}</div>
            </div>
        </div>
        
        ${template.footerText ? `
        <div style="text-align: center; font-size: 10px; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            ${template.footerText}
        </div>
        ` : ''}
    </div>

    <!-- Running print footer repeating on all pages when printing -->
    <div class="print-footer">
        <div class="print-footer-info">
            <div><strong>آدرس شرکت:</strong> ${template.address || '-'}</div>
            <div><strong>تلفن تماس:</strong> ${template.phone || '-'}</div>
            <div><strong>پست الکترونیکی:</strong> ${template.email || '-'}</div>
        </div>
        <div class="page-number"></div>
    </div>

    <!-- Auto Print Script -->
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 300);
        };
    </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `پکینگ_لیست_${delivery.packingListNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
