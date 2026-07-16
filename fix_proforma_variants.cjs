const fs = require('fs');

let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

// 1. Update handleItemVariantChange
const oldVariantChange = `  const handleItemVariantChange = (index: number, variantId: string) => {
    const newItems = [...items];
    const item = newItems[index];
    const prod = products.find((p) => p.id === item.productId);
    if (!prod || !prod.hasVariants || !prod.variants) return;

    const variant = prod.variants.find((v) => v.id === variantId);
    if (!variant) return;

    let currentQty = item.quantity;
    const effectiveSupplyType = variant.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY");
    if (effectiveSupplyType !== "ORDER" && variant.stockLevel !== undefined) {
      if (currentQty > variant.stockLevel) {
        const confirmQty = window.confirm(
          \`موجودی کالا در انبار (\${variant.stockLevel} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${currentQty}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`
        );
        if (!confirmQty) {
          currentQty = variant.stockLevel;
        }
      }
    }

    const variantAttrs = Object.values(variant.attributes).join(' ، ');
    const newTechSpecs = item.techSpecs ? \`\${item.techSpecs}\\nمشخصات: \${variantAttrs}\` : \`مشخصات: \${variantAttrs}\`;

    newItems[index] = {
      ...item,
      variantId: variant.id,
      productCode: variant.sku,
      quantity: currentQty,
      supplyMethod: effectiveSupplyType === "ORDER" ? "ORDER" : "INVENTORY",
      unitPriceRIYAL: variant.priceRIYAL || item.unitPriceRIYAL,
      techSpecs: newTechSpecs,
    };
    setItems(newItems);
  };`;

const newVariantChange = `  const handleItemVariantChange = (index: number, variantId: string) => {
    const newItems = [...items];
    const item = newItems[index];
    const prod = products.find((p) => p.id === item.productId);
    if (!prod || !prod.hasVariants || !prod.variants) return;

    const variant = prod.variants.find((v) => v.id === variantId);
    if (!variant) return;

    let currentQty = item.quantity;
    const effectiveSupplyType = variant.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY");
    if (effectiveSupplyType !== "ORDER" && variant.stockLevel !== undefined) {
      if (currentQty > variant.stockLevel) {
        const confirmQty = window.confirm(
          \`موجودی کالا در انبار (\${variant.stockLevel} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${currentQty}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`
        );
        if (!confirmQty) {
          currentQty = variant.stockLevel;
        }
      }
    }

    let currentSpecs = item.techSpecs || "";
    const featureNames = prod.features?.map(f => f.name) || Object.keys(variant.attributes);
    const filteredLines = currentSpecs.split('\\n').filter(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('مشخصات:')) return false;
      return !featureNames.some(fn => trimmedLine.startsWith(\`\${fn}:\`));
    });
    
    const newGeneratedLines = Object.entries(variant.attributes).map(([k, v]) => \`\${k}: \${v}\`);
    const newTechSpecs = [...filteredLines, ...newGeneratedLines].filter(Boolean).join('\\n');

    newItems[index] = {
      ...item,
      variantId: variant.id,
      productCode: variant.sku,
      quantity: currentQty,
      supplyMethod: effectiveSupplyType === "ORDER" ? "ORDER" : "INVENTORY",
      unitPriceRIYAL: variant.priceRIYAL || item.unitPriceRIYAL,
      techSpecs: newTechSpecs,
    };
    setItems(newItems);
  };`;

content = content.replace(oldVariantChange, newVariantChange);

// 2. Remove old config button rendering from tech specs section
const oldConfigButtonRender = `                          {(() => {
                            const prod = products.find(
                              (p) => p.id === item.productId,
                            );
                            if (
                              prod &&
                              prod.features &&
                              prod.features.length > 0
                            ) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowConfigModal(idx);
                                    setConfigSelections({});
                                  }}
                                  className="text-[10px] bg-sky-50 text-sky-600 hover:bg-sky-100 px-2 py-1 rounded font-bold flex items-center gap-1 transition"
                                >
                                  <Settings size={12} />
                                  کانفیگ کالا
                                </button>
                              );
                            }
                            return null;
                          })()}`;

if (content.includes(oldConfigButtonRender)) {
    content = content.replace(oldConfigButtonRender, "");
} else {
    console.log("Could not find old config button render");
}

// 3. Move config button next to variant select
const oldVariantRender = `                                  {item.productId && products.find(p => p.id === item.productId)?.hasVariants && (
                                    <div className="flex gap-2">
                                      <select
                                        className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] bg-slate-50 focus:bg-white text-right outline-none focus:ring-1 focus:ring-sky-500"
                                        value={item.variantId || ""}
                                        onChange={(e) => handleItemVariantChange(idx, e.target.value)}
                                      >
                                        <option value="">-- انتخاب ترکیب مشخصات (SKU) --</option>
                                        {products.find(p => p.id === item.productId)?.variants?.map(v => (
                                          <option key={v.id} value={v.id}>
                                            {v.sku} - {Object.values(v.attributes).join(', ')} {(v.stockLevel || 0) > 0 ? \`(موجودی: \${v.stockLevel})\` : '(قابل سفارش)'}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}`;

const newVariantRender = `                                  {item.productId && (products.find(p => p.id === item.productId)?.hasVariants || products.find(p => p.id === item.productId)?.features?.length) && (
                                    <div className="flex gap-2 items-center">
                                      {(() => {
                                        const prod = products.find((p) => p.id === item.productId);
                                        if (prod && prod.features && prod.features.length > 0) {
                                          return (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setShowConfigModal(idx);
                                                const currentVariant = item.variantId ? prod.variants?.find(v => v.id === item.variantId) : null;
                                                const initialSelections: Record<string, string[]> = {};
                                                
                                                if (currentVariant) {
                                                  for (const feature of prod.features) {
                                                    const val = currentVariant.attributes[feature.name];
                                                    if (val) initialSelections[feature.id] = [val];
                                                  }
                                                } else if (item.techSpecs) {
                                                    const lines = item.techSpecs.split('\\n');
                                                    for (const feature of prod.features) {
                                                        const prefix = \`\${feature.name}: \`;
                                                        const line = lines.find(l => l.trim().startsWith(prefix));
                                                        if (line) {
                                                            const valStr = line.trim().substring(prefix.length);
                                                            initialSelections[feature.id] = valStr.split('،').map(s => s.trim());
                                                        }
                                                    }
                                                }
                                                setConfigSelections(initialSelections);
                                              }}
                                              className="shrink-0 text-[10px] bg-sky-50 text-sky-600 hover:bg-sky-100 px-2 py-1.5 rounded font-bold flex items-center gap-1 transition"
                                            >
                                              <Settings size={12} />
                                              کانفیگ کالا
                                            </button>
                                          );
                                        }
                                        return null;
                                      })()}
                                      {products.find(p => p.id === item.productId)?.hasVariants && (
                                          <select
                                            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] bg-slate-50 focus:bg-white text-right outline-none focus:ring-1 focus:ring-sky-500"
                                            value={item.variantId || ""}
                                            onChange={(e) => handleItemVariantChange(idx, e.target.value)}
                                          >
                                            <option value="">-- انتخاب ترکیب مشخصات (SKU) --</option>
                                            {products.find(p => p.id === item.productId)?.variants?.map(v => (
                                              <option key={v.id} value={v.id}>
                                                {v.sku} - {Object.values(v.attributes).join(', ')} {(v.stockLevel || 0) > 0 ? \`(موجودی: \${v.stockLevel})\` : '(قابل سفارش)'}
                                              </option>
                                            ))}
                                          </select>
                                      )}
                                    </div>
                                  )}`;

if (content.includes(oldVariantRender)) {
    content = content.replace(oldVariantRender, newVariantRender);
} else {
    console.log("Could not find old variant render");
}

// 4. Update handleConfirmConfig
const oldHandleConfirmConfig = `          const handleConfirmConfig = () => {
            // Construct the config string
            const configParts = [];
            for (const feature of prod.features!) {
              const selected = configSelections[feature.id] || [];
              if (selected.length > 0) {
                configParts.push(\`\${feature.name}: \${selected.join("، ")}\`);
              }
            }
            const configString = configParts.join("\\n");
            if (configString) {
              // Append to existing tech specs
              let existing = item.techSpecs || "";
              if (existing && !existing.endsWith("\\n")) {
                existing += "\\n";
              }
              existing += configString;
              handleItemFieldChange(itemIdx, "techSpecs", existing);
            }
            setShowConfigModal(null);
          };`;

const newHandleConfirmConfig = `          const handleConfirmConfig = () => {
            const configParts = [];
            let matchedVariantId = undefined;
            
            for (const feature of prod.features!) {
              const selected = configSelections[feature.id] || [];
              if (selected.length > 0) {
                configParts.push(\`\${feature.name}: \${selected.join("، ")}\`);
              }
            }
            
            if (prod.hasVariants && prod.variants) {
                const match = prod.variants.find(v => {
                    return Object.entries(v.attributes).every(([k, val]) => {
                        const feature = prod.features?.find(f => f.name === k);
                        if (!feature) return false;
                        const selected = configSelections[feature.id] || [];
                        return selected.length === 1 && selected[0] === val;
                    });
                });
                if (match) matchedVariantId = match.id;
            }

            let currentSpecs = item.techSpecs || "";
            const featureNames = prod.features?.map(f => f.name) || [];
            const filteredLines = currentSpecs.split('\\n').filter(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('مشخصات:')) return false;
                return !featureNames.some(fn => trimmedLine.startsWith(\`\${fn}:\`));
            });

            const newTechSpecs = [...filteredLines, ...configParts].filter(Boolean).join('\\n');

            const newItems = [...items];
            newItems[itemIdx] = {
                ...item,
                techSpecs: newTechSpecs,
            };
            if (matchedVariantId) {
                const variant = prod.variants!.find(v => v.id === matchedVariantId);
                newItems[itemIdx].variantId = matchedVariantId;
                if (variant) {
                    newItems[itemIdx].productCode = variant.sku;
                    newItems[itemIdx].unitPriceRIYAL = variant.priceRIYAL || item.unitPriceRIYAL;
                    const effectiveSupplyType = variant.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY");
                    newItems[itemIdx].supplyMethod = effectiveSupplyType === "ORDER" ? "ORDER" : "INVENTORY";
                }
            } else {
                newItems[itemIdx].variantId = undefined;
            }
            
            setItems(newItems);
            setShowConfigModal(null);
          };`;

if (content.includes(oldHandleConfirmConfig)) {
    content = content.replace(oldHandleConfirmConfig, newHandleConfirmConfig);
} else {
    console.log("Could not find old config confirm");
}

fs.writeFileSync('src/components/ProformasView.tsx', content);
console.log("Done patching");
