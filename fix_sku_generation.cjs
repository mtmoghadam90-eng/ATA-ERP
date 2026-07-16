const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldSkuGen = `                                const skuParts = [pCode];
                                Object.entries(combo).forEach(([fName, fVal]) => {
                                  const feat = features.find(f => f.name === fName);
                                  const opt = feat?.options.find(o => o.value === fVal);
                                  if (opt && opt.code) {
                                    skuParts.push(opt.code);
                                  }
                                });
                                skuParts.push((i + 1).toString().padStart(3, '0'));
                                const generatedSku = skuParts.join('-');`;

const newSkuGen = `                                const skuParts = [pCode];
                                Object.entries(combo).forEach(([fName, fVal]) => {
                                  const feat = features.find(f => f.name === fName);
                                  if (feat) {
                                    const optIndex = feat.options.findIndex(o => o.value === fVal);
                                    if (optIndex !== -1) {
                                      const prefix = feat.code ? feat.code : '';
                                      skuParts.push(\`\${prefix}\${optIndex + 1}\`);
                                    }
                                  }
                                });
                                const generatedSku = skuParts.join('-');`;

content = content.replace(oldSkuGen, newSkuGen);
fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Fixed SKU generation logic');
