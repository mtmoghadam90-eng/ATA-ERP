const fs = require('fs');
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');

const variantChangeFn = `  const handleItemVariantChange = (index: number, variantId: string) => {
    const newItems = [...items];
    const item = newItems[index];
    const prod = products.find(p => p.id === item.productId);
    if (!prod || !prod.hasVariants || !prod.variants) return;

    const variant = prod.variants.find(v => v.id === variantId);
    if (!variant) return;

    newItems[index] = {
      ...item,
      variantId: variant.id,
      productCode: variant.sku,
    };
    setItems(newItems);
  };`;

content = content.replace(/\$\{variantChangeFn\}/g, variantChangeFn);
fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);

let projContent = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
const projVariantChangeFn = `  const handleItemVariantChange = (index: number, variantId: string) => {
    const newItems = [...itemsNeeded];
    const item = newItems[index];
    const prod = products.find(p => p.id === item.productId);
    if (!prod || !prod.hasVariants || !prod.variants) return;

    const variant = prod.variants.find(v => v.id === variantId);
    if (!variant) return;

    const effectiveST = variant.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY");
    
    newItems[index] = {
      ...item,
      variantId: variant.id,
      supplyMethod: effectiveST === "ORDER" ? "ORDER" : "INVENTORY",
    };
    setItemsNeeded(newItems);
  };`;

projContent = projContent.replace(/\$\{variantChangeFn\}/g, projVariantChangeFn);
fs.writeFileSync('src/components/ProjectsView.tsx', projContent);

