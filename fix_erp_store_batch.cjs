const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// Remove size and mRange parsing
content = content.replace(/        const size = item\.size \|\| "";\n        const mRange = item\.mRange \|\| "";\n/, '');
content = content.replace(/            size: size,\n            measurementRange: mRange,\n/g, '');

// Update create product logic to handle variants
const oldCreate = `          const initialStock =
            supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
          const newProduct: Product = {
            id: \`prod-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
            code: finalCode,
            name: name,
            displayName: name,
            category: category,
            supplyType: supplyType,
            description: notes,
            images: [],
            brand: brand,
            modelNumber: "N/A",
            unit: "عدد",
            basePriceRIYAL: 0,
            minStockLevel: 0,
            stockLevel: initialStock,
            customValues: {},
            features: features,
          };`;

const newCreate = `          const initialStock =
            supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
            
          let hasVariants = features.length > 0;
          let variants = [];
          if (hasVariants) {
            const getCombinations = (featuresArr) => {
              if (featuresArr.length === 0) return [{}];
              const current = featuresArr[0];
              const rest = getCombinations(featuresArr.slice(1));
              const combos = [];
              if (current.options.length === 0) return rest;
              for (const opt of current.options) {
                for (const r of rest) {
                  combos.push({ ...r, [current.name]: opt.value });
                }
              }
              return combos;
            };
            const combinations = getCombinations(features);
            const pCode = finalCode;
            variants = combinations.map((combo, i) => {
              const skuParts = [pCode];
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
              return {
                id: \`var-\${Date.now()}-\${i}-\${Math.random().toString(36).substr(2, 5)}\`,
                sku: skuParts.join('-'),
                attributes: combo,
                stockLevel: 0, // initial stock goes to the first variant or we leave it 0? Let's assign to total only if variants exist, but usually we can't distribute. Let's just set 0 and user has to update specific SKUs.
                minStockLevel: 0
              };
            });
          }
          
          const newProduct = {
            id: \`prod-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
            code: finalCode,
            name: name,
            displayName: name,
            category: category,
            supplyType: supplyType,
            description: notes,
            images: [],
            brand: brand,
            modelNumber: "N/A",
            unit: "عدد",
            basePriceRIYAL: 0,
            minStockLevel: 0,
            stockLevel: hasVariants ? 0 : initialStock,
            customValues: {},
            features: features,
            hasVariants: hasVariants,
            variants: variants
          };`;

content = content.replace(oldCreate, newCreate);

// the else if(code) block
const oldElseIfCodeCreate = `          const initialStock =
              supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
            const newProduct: Product = {
              id: \`prod-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
              code: code,
              name: name,
              displayName: name,
              category: category,
              supplyType: supplyType,
              description: notes,
              images: [],
              brand: brand,
              modelNumber: "N/A",
              unit: "عدد",
              basePriceRIYAL: 0,
              minStockLevel: 0,
              stockLevel: initialStock,
              customValues: {},
              features: features,
            };`;

const newElseIfCodeCreate = `          const initialStock =
              supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
              
            let hasVariants = features.length > 0;
            let variants = [];
            if (hasVariants) {
              const getCombinations = (featuresArr) => {
                if (featuresArr.length === 0) return [{}];
                const current = featuresArr[0];
                const rest = getCombinations(featuresArr.slice(1));
                const combos = [];
                if (current.options.length === 0) return rest;
                for (const opt of current.options) {
                  for (const r of rest) {
                    combos.push({ ...r, [current.name]: opt.value });
                  }
                }
                return combos;
              };
              const combinations = getCombinations(features);
              const pCode = code;
              variants = combinations.map((combo, i) => {
                const skuParts = [pCode];
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
                return {
                  id: \`var-\${Date.now()}-\${i}-\${Math.random().toString(36).substr(2, 5)}\`,
                  sku: skuParts.join('-'),
                  attributes: combo,
                  stockLevel: 0,
                  minStockLevel: 0
                };
              });
            }

            const newProduct = {
              id: \`prod-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
              code: code,
              name: name,
              displayName: name,
              category: category,
              supplyType: supplyType,
              description: notes,
              images: [],
              brand: brand,
              modelNumber: "N/A",
              unit: "عدد",
              basePriceRIYAL: 0,
              minStockLevel: 0,
              stockLevel: hasVariants ? 0 : initialStock,
              customValues: {},
              features: features,
              hasVariants: hasVariants,
              variants: variants
            };`;

content = content.replace(oldElseIfCodeCreate, newElseIfCodeCreate);

const oldElseIfCodeUpdate = `        } else if (code) {
          const prodIndex = currentProducts.findIndex((p) => p.code === code);
          if (prodIndex >= 0) {
            const product = currentProducts[prodIndex];

            if (
              supplyType === "INVENTORY" &&
              !isNaN(amt) &&
              amt > 0 &&
              (type === "IN" || type === "OUT")
            ) {
              const adjustedAmt = type === "IN" ? amt : -amt;
              const beforeStock = product.stockLevel || 0;
              const afterStock = Math.max(0, beforeStock + adjustedAmt);

              currentProducts[prodIndex] = {
                ...product,
                stockLevel: afterStock,
              };

              newTransactions.push({
                id: \`inv-tr-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
                productId: product.id,
                date: dateVal || nowStr,
                type: adjustedAmt > 0 ? "IN" : "OUT",
                quantity: amt,
                referenceType: "MANUAL",
                notes,
              });
              successCount++;
              logAction(
                "UPDATE",
                "کالاها",
                product.id,
                \`تعدیل موجودی کالا (واردات گروهی): \${product.name} (کد: \${product.code}) از \${beforeStock} به \${afterStock}\`,
                product,
                currentProducts[prodIndex],
              );
            }
          }`;

const newElseIfCodeUpdate = `        } else if (code) {
          let prodIndex = currentProducts.findIndex((p) => p.code === code);
          let variantId;
          
          if (prodIndex === -1) {
            // Check if code matches a variant SKU
            prodIndex = currentProducts.findIndex(p => p.hasVariants && p.variants && p.variants.some(v => v.sku === code));
            if (prodIndex >= 0) {
              const v = currentProducts[prodIndex].variants.find(v => v.sku === code);
              if (v) variantId = v.id;
            }
          }

          if (prodIndex >= 0) {
            const product = currentProducts[prodIndex];

            if (
              supplyType === "INVENTORY" &&
              !isNaN(amt) &&
              amt > 0 &&
              (type === "IN" || type === "OUT")
            ) {
              // If it's a product with variants but no variant SKU is provided, we can't update stock
              if (product.hasVariants && !variantId) {
                // skip stock update for parent product
              } else {
                const adjustedAmt = type === "IN" ? amt : -amt;
                
                let beforeStock = 0;
                let afterStock = 0;
                
                if (variantId && product.hasVariants && product.variants) {
                  const vIdx = product.variants.findIndex(v => v.id === variantId);
                  if (vIdx !== -1) {
                    beforeStock = product.variants[vIdx].stockLevel || 0;
                    afterStock = Math.max(0, beforeStock + adjustedAmt);
                    const newVariants = [...product.variants];
                    newVariants[vIdx] = { ...newVariants[vIdx], stockLevel: afterStock };
                    const newTotalStock = newVariants.reduce((sum, v) => sum + (v.stockLevel || 0), 0);
                    currentProducts[prodIndex] = {
                      ...product,
                      variants: newVariants,
                      stockLevel: newTotalStock
                    };
                  }
                } else {
                  beforeStock = product.stockLevel || 0;
                  afterStock = Math.max(0, beforeStock + adjustedAmt);
                  currentProducts[prodIndex] = {
                    ...product,
                    stockLevel: afterStock,
                  };
                }

                newTransactions.push({
                  id: \`inv-tr-\${Date.now()}-\${index}-\${Math.random().toString(36).substr(2, 5)}\`,
                  productId: product.id,
                  variantId: variantId,
                  date: dateVal || nowStr,
                  type: adjustedAmt > 0 ? "IN" : "OUT",
                  quantity: amt,
                  referenceType: "MANUAL",
                  notes,
                });
                successCount++;
                logAction(
                  "UPDATE",
                  "کالاها",
                  product.id,
                  \`تعدیل موجودی کالا (واردات گروهی): \${product.name} (کد: \${variantId ? code : product.code}) از \${beforeStock} به \${afterStock}\`,
                  product,
                  currentProducts[prodIndex],
                );
              }
            }
          }`;

content = content.replace(oldElseIfCodeUpdate, newElseIfCodeUpdate);

fs.writeFileSync('src/useERPStore.ts', content);
console.log('Fixed batch import in useERPStore.ts');
