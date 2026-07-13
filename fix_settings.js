import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// 1. Add to the dropdown
content = content.replace(
  /<option value="purchase_order_status_change">تغییر وضعیت سفارش خرید<\/option>/,
  `<option value="purchase_order_status_change">تغییر وضعیت سفارش خرید</option>
                      <option value="packaging_delivery_created">ثبت بسته‌بندی و تحویل</option>
                      <option value="supplier_inquiry_status_change">تغییر وضعیت استعلام تامین‌کننده</option>
                      <option value="after_sales_service_status_change">تغییر وضعیت خدمات پس از فروش</option>`
);

// 2. Add to fieldMap
content = content.replace(
  /purchase_order_status_change: 'newStatus'/,
  `purchase_order_status_change: 'newStatus',
                          packaging_delivery_created: 'action',
                          supplier_inquiry_status_change: 'newStatus',
                          after_sales_service_status_change: 'newStatus'`
);

// 3. Add to the condition options
const newConds = `if (editingRule.triggerType === 'proforma_outcome_change') {`;
const extraConds = `if (editingRule.triggerType === 'packaging_delivery_created') {
                          fieldOptions = [
                            { value: 'action', label: 'عملیات' }
                          ];
                          valueOptions = ['ایجاد'];
                        } else if (editingRule.triggerType === 'supplier_inquiry_status_change') {
                          fieldOptions = [
                            { value: 'newStatus', label: 'وضعیت جدید' },
                            { value: 'oldStatus', label: 'وضعیت قبلی' }
                          ];
                          valueOptions = ['پیش‌نویس', 'ارسال شده', 'در انتظار پاسخ', 'پاسخ داده شده', 'لغو شده', 'برنده', 'بازنده'];
                        } else if (editingRule.triggerType === 'after_sales_service_status_change') {
                          fieldOptions = [
                            { value: 'newStatus', label: 'وضعیت جدید' },
                            { value: 'oldStatus', label: 'وضعیت قبلی' }
                          ];
                          valueOptions = ['در حال بررسی', 'در حال تعمیر/خدمات', 'تکمیل شده', 'تحویل داده شده'];
                        } else `;
content = content.replace(newConds, extraConds + newConds);

// 4. Add to triggerLabelMap
content = content.replace(
  /purchase_order_status_change: 'تغییر وضعیت سفارش خرید'/,
  `purchase_order_status_change: 'تغییر وضعیت سفارش خرید',
                        packaging_delivery_created: 'ثبت بسته‌بندی و تحویل',
                        supplier_inquiry_status_change: 'تغییر وضعیت استعلام تامین‌کننده',
                        after_sales_service_status_change: 'تغییر وضعیت خدمات پس از فروش'`
);

fs.writeFileSync('src/components/SettingsView.tsx', content);

