import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /export interface SupplierInquiryItem \{\s*id: string;\s*requestItemId: string; \/\/ The ID of the item needed from the project\s*productName: string;\s*quantity: number;\s*\}/,
  `export interface SupplierInquiryItem {
  id: string;
  requestItemId?: string; // The ID of the item needed from the project (optional)
  productName: string;
  quantity: number;
  priceForeign?: number;
  priceRIYAL?: number;
  currency?: 'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان';
  deliveryTime?: string;
  notes?: string;
}`
);

content = content.replace(
  /export interface SupplierInquiry \{\s*id: string;\s*projectId: string;\s*projectName: string;/,
  `export interface SupplierInquiry {
  id: string;
  projectId?: string;
  projectName?: string;`
);

fs.writeFileSync('src/types.ts', content);

