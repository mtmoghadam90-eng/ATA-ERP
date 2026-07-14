import fs from 'fs';

let content = fs.readFileSync('src/components/QuickAddModal.tsx', 'utf-8');

const imgBlockStart = content.indexOf('              {/* Product Images */}');
if (imgBlockStart === -1) {
  console.log('Cannot find imgBlockStart');
  process.exit(1);
}

// Find the end of the Product Images block, which is right before "              {/* Custom Fields */}" inside the Customer form
const customFieldsStart = content.indexOf('              {/* Custom Fields */}', imgBlockStart);
if (customFieldsStart === -1) {
  console.log('Cannot find customFieldsStart');
  process.exit(1);
}

const productImagesBlock = content.slice(imgBlockStart, customFieldsStart);

// Remove the block from its current location
content = content.slice(0, imgBlockStart) + content.slice(customFieldsStart);

// Now, insert the block into the Product form, right after the description block and before the Custom Fields block.
const productCustomFieldsStart = content.indexOf('              {/* Custom Fields */}', content.indexOf('type === \'product\''));
if (productCustomFieldsStart === -1) {
  console.log('Cannot find productCustomFieldsStart');
  process.exit(1);
}

content = content.slice(0, productCustomFieldsStart) + productImagesBlock + content.slice(productCustomFieldsStart);

fs.writeFileSync('src/components/QuickAddModal.tsx', content);
console.log('Fixed QuickAddModal.tsx');
