const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

const variantChangeFn = `  const handleItemVariantChange = (index: number, variantId: string) => {
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

content = content.replace(/  const handleItemCategoryChange/g, `\${variantChangeFn}\n  const handleItemCategoryChange`);

content = content.replace(/          productId: prodId,\n          name: selectedProd\.displayName,/g, 
`          productId: prodId,
          variantId: undefined,
          name: selectedProd.displayName,`);

const oldSelect = `                                    <SearchableSelect wrapperClassName="flex-1 min-w-0"
                                      value={item.productId}
                                      onChange={(val) => handleItemProductChange(index, val)}
                                      options={products.map(p => {
                                        const details = '';
                                        const detailsText = details ? \` (\${details})\` : '';
                                        const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                        const stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel} \${p.unit || 'عدد'}]\` : '') : ' [تامین سفارشی]';
                                        return {
                                          value: p.id,
                                          label: \`\${p.code} - \${p.displayName}\${detailsText}\${stockText}\`
                                        };
                                      })}
                                      placeholder="-- انتخاب کالا --"
                                    />`;

const newSelect = `                                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                                      <SearchableSelect wrapperClassName="w-full min-w-0"
                                        value={item.productId}
                                        onChange={(val) => handleItemProductChange(index, val)}
                                        options={products.map(p => {
                                          const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                          const stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel} \${p.unit || 'عدد'}]\` : '') : ' [تامین سفارشی]';
                                          return {
                                            value: p.id,
                                            label: \`\${p.code} - \${p.displayName}\${stockText}\`
                                          };
                                        })}
                                        placeholder="-- انتخاب کالا --"
                                      />
                                      {item.productId && item.productId !== "generic" && products.find(p => p.id === item.productId)?.hasVariants && (
                                        <select
                                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] bg-slate-50 focus:bg-white text-right outline-none"
                                          value={item.variantId || ""}
                                          onChange={(e) => handleItemVariantChange(index, e.target.value)}
                                        >
                                          <option value="">-- انتخاب ترکیب مشخصات (SKU) --</option>
                                          {products.find(p => p.id === item.productId)?.variants?.map(v => (
                                            <option key={v.id} value={v.id}>
                                              {v.sku} - {Object.values(v.attributes).join(', ')} {(v.stockLevel || 0) > 0 ? \`(موجودی: \${v.stockLevel})\` : '(قابل سفارش)'}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    </div>`;

content = content.replace(oldSelect, newSelect);
content = content.replace(/\$\{variantChangeFn\}/g, variantChangeFn); // just in case

fs.writeFileSync('src/components/ProjectsView.tsx', content);
