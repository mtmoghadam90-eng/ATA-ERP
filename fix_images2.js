import fs from 'fs';

let content = fs.readFileSync('src/components/QuickAddModal.tsx', 'utf-8');

const imgBlockStart = content.indexOf('              {/* Product Images */}');
if (imgBlockStart === -1) {
  console.log('Cannot find imgBlockStart');
  process.exit(1);
}

const customFieldsStart = content.indexOf('              {/* Custom Fields */}', imgBlockStart);
if (customFieldsStart === -1) {
  console.log('Cannot find customFieldsStart');
  process.exit(1);
}

const productImagesBlock = content.slice(imgBlockStart, customFieldsStart);

// Remove the block from its current location
content = content.slice(0, imgBlockStart) + content.slice(customFieldsStart);

// Now find the REAL product form Custom Fields block
// We can find the product form by searching for `type === 'product' && (`
const productFormRender = content.indexOf("type === 'product' && (");
if (productFormRender === -1) {
  console.log('Cannot find productFormRender');
  process.exit(1);
}

const productCustomFieldsStart = content.indexOf('              {/* Custom Fields */}', productFormRender);
if (productCustomFieldsStart === -1) {
  console.log('Cannot find productCustomFieldsStart');
  process.exit(1);
}

content = content.slice(0, productCustomFieldsStart) + productImagesBlock + content.slice(productCustomFieldsStart);

fs.writeFileSync('src/components/QuickAddModal.tsx', content);
console.log('Fixed QuickAddModal.tsx correctly');
