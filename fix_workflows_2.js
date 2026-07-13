import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

content = content.replace(
  /triggerType: 'proforma_outcome_change' \| 'project_status_change' \| 'purchase_order_status_change',/,
  "triggerType: 'proforma_outcome_change' | 'project_status_change' | 'purchase_order_status_change' | 'packaging_delivery_created' | 'supplier_inquiry_status_change' | 'after_sales_service_status_change',"
);

// We should also check where relatedToType is assigned
content = content.replace(
  /relatedToType: triggerType === 'proforma_outcome_change' \? 'پیش‌فاکتور' : triggerType === 'project_status_change' \? 'پروژه' : 'سفارش خرید',/,
  "relatedToType: triggerType === 'proforma_outcome_change' ? 'پیش‌فاکتور' : triggerType === 'project_status_change' ? 'پروژه' : triggerType === 'packaging_delivery_created' ? 'بسته‌بندی و تحویل' : triggerType === 'supplier_inquiry_status_change' ? 'استعلام تامین‌کننده' : triggerType === 'after_sales_service_status_change' ? 'خدمات پس از فروش' : 'سفارش خرید',"
);

fs.writeFileSync('src/useERPStore.ts', content);

