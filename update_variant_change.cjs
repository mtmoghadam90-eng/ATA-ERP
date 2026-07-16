const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const oldVariantChange = `    newItems[index] = {
      ...item,
      variantId: variant.id,
      productCode: variant.sku,
      quantity: currentQty,
      supplyMethod: effectiveSupplyType === "ORDER" ? "ORDER" : "INVENTORY",
      unitPriceRIYAL: variant.priceRIYAL || item.unitPriceRIYAL,
    };`;

const newVariantChange = `    const variantAttrs = Object.values(variant.attributes).join(' ، ');
    const newTechSpecs = item.techSpecs ? \`\${item.techSpecs}\\nمشخصات: \${variantAttrs}\` : \`مشخصات: \${variantAttrs}\`;

    newItems[index] = {
      ...item,
      variantId: variant.id,
      productCode: variant.sku,
      quantity: currentQty,
      supplyMethod: effectiveSupplyType === "ORDER" ? "ORDER" : "INVENTORY",
      unitPriceRIYAL: variant.priceRIYAL || item.unitPriceRIYAL,
      techSpecs: newTechSpecs,
    };`;

content = content.replace(oldVariantChange, newVariantChange);
fs.writeFileSync('src/components/ProformasView.tsx', content);
