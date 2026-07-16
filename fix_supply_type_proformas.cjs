const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

// Inside handleItemProductChange
const oldLogic = `if (prod.supplyType !== "ORDER" && prod.stockLevel !== undefined) {
      if (currentQty > prod.stockLevel) {`;
const newLogic = `const effectiveSupplyType = prod.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY");
    if (effectiveSupplyType !== "ORDER" && prod.stockLevel !== undefined) {
      if (currentQty > prod.stockLevel) {`;

content = content.replace(oldLogic, newLogic);

// Inside add bulk to proforma
const oldBulk = `firstProd.supplyType !== "ORDER" &&`;
const newBulk = `(firstProd.stockLevel === 0 ? "ORDER" : (firstProd.supplyType || "INVENTORY")) !== "ORDER" &&`;
content = content.replace(oldBulk, newBulk);

// Inside selected prod dropdown in UI
const oldSelectUI = `const stockText =
                                        p.supplyType === "INVENTORY" ||
                                        !p.supplyType
                                          ? \` | موجودی: \${p.stockLevel || 0}\`
                                          : "";`;
const newSelectUI = `const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                      const stockText =
                                        effectiveST === "INVENTORY"
                                          ? \` | موجودی: \${p.stockLevel || 0}\`
                                          : " | تامین سفارشی";`;
content = content.replace(oldSelectUI, newSelectUI);

// Inside checking quantity changes
const oldQtyChange = `prod.supplyType !== "ORDER" &&`;
const newQtyChange = `(prod.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY")) !== "ORDER" &&`;
content = content.replace(new RegExp(oldQtyChange.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), newQtyChange);


fs.writeFileSync('src/components/ProformasView.tsx', content);
