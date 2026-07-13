import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// addPackagingDelivery
content = content.replace(
  /const logText = `ثبت پکینگ لیست و تحویل کالا به شماره \$\{packingListNumber\}`;/,
  `const logText = \`ثبت پکینگ لیست و تحویل کالا به شماره \${packingListNumber}\`;
    
    runWorkflows('packaging_delivery_created', {
       projectId: newDelivery.projectId,
       action: 'ایجاد',
       deliveryId: newDelivery.id
    });`
);

// updateSupplierInquiry
content = content.replace(
  /const logText = `بروزرسانی استعلام تامین‌کننده \$\{updatedInquiry\.supplierName\} - وضعیت جدید: \$\{updatedInquiry\.status\}`;/,
  `const logText = \`بروزرسانی استعلام تامین‌کننده \${updatedInquiry.supplierName} - وضعیت جدید: \${updatedInquiry.status}\`;
    
    const oldInquiry = supplierInquiries.find(i => i.id === updatedInquiry.id);
    if (oldInquiry && oldInquiry.status !== updatedInquiry.status) {
       runWorkflows('supplier_inquiry_status_change', {
         projectId: updatedInquiry.projectId,
         newStatus: updatedInquiry.status,
         oldStatus: oldInquiry.status,
         inquiryId: updatedInquiry.id
       });
    }`
);

// addSupplierInquiry
content = content.replace(
  /const logText = `ثبت استعلام جدید برای تامین‌کننده \$\{newInquiry\.supplierName\}`;/,
  `const logText = \`ثبت استعلام جدید برای تامین‌کننده \${newInquiry.supplierName}\`;
    
    runWorkflows('supplier_inquiry_status_change', {
       projectId: newInquiry.projectId,
       newStatus: newInquiry.status,
       oldStatus: '',
       inquiryId: newInquiry.id
    });`
);

// updateAfterSalesService
content = content.replace(
  /const logText = `بروزرسانی خدمات پس از فروش برای کالای \$\{updatedService\.itemName\}`;/,
  `const logText = \`بروزرسانی خدمات پس از فروش برای کالای \${updatedService.itemName}\`;
    
    const oldService = afterSalesServices.find(s => s.id === updatedService.id);
    if (oldService && oldService.status !== updatedService.status) {
       runWorkflows('after_sales_service_status_change', {
         projectId: updatedService.projectId,
         newStatus: updatedService.status,
         oldStatus: oldService.status,
         serviceId: updatedService.id
       });
    }`
);

// addAfterSalesService
content = content.replace(
  /const logText = `ثبت خدمات پس از فروش جدید برای کالای \$\{service\.itemName\}`;/,
  `const logText = \`ثبت خدمات پس از فروش جدید برای کالای \${service.itemName}\`;
    
    runWorkflows('after_sales_service_status_change', {
       projectId: newService.projectId,
       newStatus: newService.status,
       oldStatus: '',
       serviceId: newService.id
    });`
);

fs.writeFileSync('src/useERPStore.ts', content);

