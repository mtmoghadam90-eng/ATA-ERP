const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldBlock = `                              const combinations = getCombinations(features);
                              const newVariants = combinations.map((combo, i) => {
                                // check if exists
                                const existing = variants.find(v => {
                                  const vKeys = Object.keys(v.attributes);
                                  const cKeys = Object.keys(combo);
                                  if (vKeys.length !== cKeys.length) return false;
                                  return vKeys.every(k => v.attributes[k] === combo[k]);
                                });
                                if (existing) return existing;

                                return {
                                  id: \`var-\${Date.now()}-\${i}\`,
                                  sku: '',
                                  attributes: combo,
                                  stockLevel: 0,
                                  minStockLevel: 0
                                };
                              });
                              setVariants(newVariants);`;

const newBlock = `                              const combinations = getCombinations(features);
                              const pCode = productCode.trim() || 'SKU';
                              const newVariants = combinations.map((combo, i) => {
                                // Generate SKU
                                const skuParts = [pCode];
                                Object.entries(combo).forEach(([fName, fVal]) => {
                                  const feat = features.find(f => f.name === fName);
                                  const opt = feat?.options.find(o => o.value === fVal);
                                  if (opt && opt.code) {
                                    skuParts.push(opt.code);
                                  }
                                });
                                skuParts.push((i + 1).toString().padStart(3, '0'));
                                const generatedSku = skuParts.join('-');

                                // check if exists
                                const existing = variants.find(v => {
                                  const vKeys = Object.keys(v.attributes);
                                  const cKeys = Object.keys(combo);
                                  if (vKeys.length !== cKeys.length) return false;
                                  return vKeys.every(k => v.attributes[k] === combo[k]);
                                });
                                
                                if (existing) {
                                  return { ...existing, sku: existing.sku || generatedSku };
                                }

                                return {
                                  id: \`var-\${Date.now()}-\${i}\`,
                                  sku: generatedSku,
                                  attributes: combo,
                                  stockLevel: 0,
                                  minStockLevel: 0
                                };
                              });
                              setVariants(newVariants);`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Fixed variants SKU generation');
