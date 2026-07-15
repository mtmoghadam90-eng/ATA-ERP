import fs from 'fs';

// seedData.ts
let seedData = fs.readFileSync('src/seedData.ts', 'utf8');
seedData = seedData.replace(/supplierInquiryActionTypes: \['.*?'\],\n\s*/g, '');
fs.writeFileSync('src/seedData.ts', seedData);

// SettingsView.tsx
let settingsView = fs.readFileSync('src/components/SettingsView.tsx', 'utf8');
settingsView = settingsView.replace(/'supplierInquiryActionTypes',\n\s*/g, '');
settingsView = settingsView.replace(/supplierInquiryActionTypes: 'انواع اقدام ثبت شده \(استعلام‌ها\)',\n\s*/g, '');
settingsView = settingsView.replace(/supplierInquiryActionTypes: 'لیست انواع اقدام قابل انتخاب هنگام ثبت اقدامات جدید برای استعلام‌های قیمت از تامین‌کنندگان.',\n\s*/g, '');
fs.writeFileSync('src/components/SettingsView.tsx', settingsView);
