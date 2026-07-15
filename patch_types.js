import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf8');

// Remove InquiryStep
code = code.replace(/export interface InquiryStep \{[\s\S]*?\}/, '');

// Remove SupplierInquiryItem
code = code.replace(/export interface SupplierInquiryItem \{[\s\S]*?\}/, '');

// Remove SupplierInquiry
code = code.replace(/export interface SupplierInquiry \{[\s\S]*?\}/, '');

// Remove supplierInquiries? from User permissions
code = code.replace(/supplierInquiries\?: boolean;\n\s*/g, '');

// Remove supplierInquiries from audit log module
code = code.replace(/ \| 'supplierInquiries'/g, '');

// Remove supplierInquiryActionTypes from ERPSettings dropdownItems
code = code.replace(/supplierInquiryActionTypes\?: string\[\];\n\s*/g, '');

// Remove supplier_inquiry_status_change from workflow trigger type
code = code.replace(/ \| 'supplier_inquiry_status_change'/g, '');

fs.writeFileSync('src/types.ts', code);
