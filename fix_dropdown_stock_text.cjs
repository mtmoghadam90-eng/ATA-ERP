const fs = require('fs');

function getNewOptions(hasBrackets) {
  return `products.map((p) => {
                                        let stockText = "";
                                        if (p.hasVariants && p.variants) {
                                            const totalStock = p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0);
                                            const hasOrderVariant = p.variants.some(v => !v.stockLevel || v.stockLevel === 0);
                                            const hasInventoryVariant = p.variants.some(v => v.stockLevel && v.stockLevel > 0);
                                            
                                            if (hasInventoryVariant && hasOrderVariant) {
                                                stockText = \`${hasBrackets ? ' [' : ' | '}موجودی: \${totalStock} + تامین سفارشی\${hasBrackets ? ']' : ''}\`;
                                            } else if (hasInventoryVariant) {
                                                stockText = \`${hasBrackets ? ' [' : ' | '}موجودی: \${totalStock}\${hasBrackets ? ']' : ''}\`;
                                            } else {
                                                stockText = \`${hasBrackets ? ' [' : ' | '}تامین سفارشی\${hasBrackets ? ']' : ''}\`;
                                            }
                                        } else {
                                            const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                            stockText = effectiveST === "INVENTORY" ? \`${hasBrackets ? ' [' : ' | '}موجودی: \${p.stockLevel || 0}\${hasBrackets ? ']' : ''}\` : \`${hasBrackets ? ' [' : ' | '}تامین سفارشی\${hasBrackets ? ']' : ''}\`;
                                        }
                                        return {
                                          value: p.id,
                                          label: \`\${p.code} - \${p.displayName}\${stockText}\`
                                        };
                                      })`;
}

function updateProformas() {
  let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');
  const oldMap = `products.map((p) => {
                                        const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                        const stockText = effectiveST === "INVENTORY" ? \` | موجودی: \${p.stockLevel || 0}\` : " | تامین سفارشی";
                                        return {
                                          value: p.id,
                                          label: \`\${p.displayName}\${stockText}\`,
                                        };
                                      })`;
  
  const newMap = `products.map((p) => {
                                        let stockText = "";
                                        if (p.hasVariants && p.variants && p.variants.length > 0) {
                                            const totalStock = p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0);
                                            const hasOrderVariant = p.variants.some(v => !v.stockLevel || v.stockLevel === 0);
                                            const hasInventoryVariant = p.variants.some(v => v.stockLevel && v.stockLevel > 0);
                                            
                                            if (hasInventoryVariant && hasOrderVariant) {
                                                stockText = \` | موجودی: \${totalStock} + تامین سفارشی\`;
                                            } else if (hasInventoryVariant) {
                                                stockText = \` | موجودی: \${totalStock}\`;
                                            } else {
                                                stockText = \` | تامین سفارشی\`;
                                            }
                                        } else {
                                            const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                            stockText = effectiveST === "INVENTORY" ? \` | موجودی: \${p.stockLevel || 0}\` : " | تامین سفارشی";
                                        }
                                        return {
                                          value: p.id,
                                          label: \`\${p.displayName}\${stockText}\`,
                                        };
                                      })`;

  content = content.replace(oldMap, newMap);
  fs.writeFileSync('src/components/ProformasView.tsx', content);
}

function updateProjects() {
  let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
  const oldMap = `products.map(p => {
                                          const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                          const stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel} \${p.unit || 'عدد'}]\` : '') : ' [تامین سفارشی]';
                                          return {
                                            value: p.id,
                                            label: \`\${p.code} - \${p.displayName}\${stockText}\`
                                          };
                                        })`;
  const newMap = `products.map(p => {
                                          let stockText = "";
                                          if (p.hasVariants && p.variants && p.variants.length > 0) {
                                              const totalStock = p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0);
                                              const hasOrderVariant = p.variants.some(v => !v.stockLevel || v.stockLevel === 0);
                                              const hasInventoryVariant = p.variants.some(v => v.stockLevel && v.stockLevel > 0);
                                              
                                              if (hasInventoryVariant && hasOrderVariant) {
                                                  stockText = \` [موجودی: \${totalStock} \${p.unit || 'عدد'} + تامین سفارشی]\`;
                                              } else if (hasInventoryVariant) {
                                                  stockText = \` [موجودی: \${totalStock} \${p.unit || 'عدد'}]\`;
                                              } else {
                                                  stockText = \` [تامین سفارشی]\`;
                                              }
                                          } else {
                                              const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                              stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel} \${p.unit || 'عدد'}]\` : '') : ' [تامین سفارشی]';
                                          }
                                          return {
                                            value: p.id,
                                            label: \`\${p.code} - \${p.displayName}\${stockText}\`
                                          };
                                        })`;

  content = content.replace(oldMap, newMap);
  fs.writeFileSync('src/components/ProjectsView.tsx', content);
}

function updatePurchaseOrders() {
  let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');
  const oldMap = `products.map(p => {
                                  return {
                                    value: p.id,
                                    label: \`\${p.code} - \${p.displayName}\`
                                  };
                                })`;
  const newMap = `products.map(p => {
                                  let stockText = "";
                                  if (p.hasVariants && p.variants && p.variants.length > 0) {
                                      const totalStock = p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0);
                                      const hasOrderVariant = p.variants.some(v => !v.stockLevel || v.stockLevel === 0);
                                      const hasInventoryVariant = p.variants.some(v => v.stockLevel && v.stockLevel > 0);
                                      
                                      if (hasInventoryVariant && hasOrderVariant) {
                                          stockText = \` [موجودی: \${totalStock} + تامین سفارشی]\`;
                                      } else if (hasInventoryVariant) {
                                          stockText = \` [موجودی: \${totalStock}]\`;
                                      } else {
                                          stockText = \` [تامین سفارشی]\`;
                                      }
                                  } else {
                                      const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                      stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel}]\` : '') : ' [تامین سفارشی]';
                                  }
                                  return {
                                    value: p.id,
                                    label: \`\${p.code} - \${p.displayName}\${stockText}\`
                                  };
                                })`;

  content = content.replace(oldMap, newMap);
  fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
}

updateProformas();
updateProjects();
updatePurchaseOrders();

