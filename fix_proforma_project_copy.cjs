const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const oldCopyCheck = `                                if (
                                  prod &&
                                  (prod.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY")) !== "ORDER" &&
                                  prod.stockLevel !== undefined
                                ) {
                                  if (qty > prod.stockLevel) {
                                    hasTruncated = true;
                                  }
                                }`;

const newCopyCheck = `                                let stockToCheck = undefined;
                                let isOrderOnly = false;
                                if (prod && item.variantId) {
                                  const variant = prod.variants?.find(v => v.id === item.variantId);
                                  if (variant) {
                                    stockToCheck = variant.stockLevel;
                                    isOrderOnly = variant.stockLevel === 0;
                                  }
                                } else if (prod) {
                                  stockToCheck = prod.stockLevel;
                                  isOrderOnly = prod.stockLevel === 0;
                                }

                                if (
                                  prod &&
                                  (!isOrderOnly && (prod.supplyType || "INVENTORY") !== "ORDER") &&
                                  stockToCheck !== undefined
                                ) {
                                  if (qty > stockToCheck) {
                                    hasTruncated = true;
                                  }
                                }`;

const oldTruncate = `                                    if (
                                      prod &&
                                      (prod.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY")) !== "ORDER" &&
                                      prod.stockLevel !== undefined
                                    ) {
                                      if (newItem.quantity > prod.stockLevel) {
                                        newItem.quantity = prod.stockLevel;
                                      }
                                    }`;

const newTruncate = `                                    let truncStock = undefined;
                                    let truncOrderOnly = false;
                                    if (prod && origItem.variantId) {
                                      const variant = prod.variants?.find(v => v.id === origItem.variantId);
                                      if (variant) {
                                        truncStock = variant.stockLevel;
                                        truncOrderOnly = variant.stockLevel === 0;
                                      }
                                    } else if (prod) {
                                      truncStock = prod.stockLevel;
                                      truncOrderOnly = prod.stockLevel === 0;
                                    }

                                    if (
                                      prod &&
                                      (!truncOrderOnly && (prod.supplyType || "INVENTORY") !== "ORDER") &&
                                      truncStock !== undefined
                                    ) {
                                      if (newItem.quantity > truncStock) {
                                        newItem.quantity = truncStock;
                                      }
                                    }`;

content = content.replace(oldCopyCheck, newCopyCheck).replace(oldTruncate, newTruncate);

// We should also map variantId and variant details into newItem
content = content.replace(/                                  productName: prod\?\.displayName \|\| item\.name,\n                                  productCode: prod\?\.code \|\| "",/g,
`                                  variantId: item.variantId,
                                  productName: prod?.displayName || item.name,
                                  productCode: (prod && item.variantId ? prod.variants?.find(v => v.id === item.variantId)?.sku : prod?.code) || "",`);

fs.writeFileSync('src/components/ProformasView.tsx', content);
