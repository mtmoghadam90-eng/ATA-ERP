const fs = require('fs');
let content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');

// 1. handleItemProductChange
// We need to add variantId to PurchaseOrderItem
// We also need to define handleItemVariantChange
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

content = content.replace(/  const handleItemFieldChange/g, `\${variantChangeFn}\n  const handleItemFieldChange`);

// Reset variantId when changing product
content = content.replace(/      productId: prodId,\n      productName: prod\.displayName,\n      productCode: prod\.code,/g, 
`      productId: prodId,
      variantId: undefined,
      productName: prod.displayName,
      productCode: prod.code,`);

// Update SearchableSelect rendering
const oldSelect = `                          <SearchableSelect wrapperClassName="flex-1 min-w-0"
                            value={item.productId}
                            onChange={(val) => handleItemProductChange(idx, val)}
                            options={[
                              { value: '', label: '-- انتخاب کالا --' },
                              ...products.map(p => {
                                const details = '';
                                const detailsText = details ? \` (\${details})\` : '';
                                return {
                                  value: p.id,
                                  label: \`\${p.code} - \${p.displayName}\${detailsText}\`
                                };
                              })
                            ]}
                            placeholder="-- انتخاب کالا --"
                            className="text-xs"
                          />`;

const newSelect = `                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <SearchableSelect wrapperClassName="w-full min-w-0"
                              value={item.productId}
                              onChange={(val) => handleItemProductChange(idx, val)}
                              options={[
                                { value: '', label: '-- انتخاب کالا --' },
                                ...products.map(p => {
                                  return {
                                    value: p.id,
                                    label: \`\${p.code} - \${p.displayName}\`
                                  };
                                })
                              ]}
                              placeholder="-- انتخاب کالا --"
                              className="text-xs"
                            />
                            {item.productId && products.find(p => p.id === item.productId)?.hasVariants && (
                              <select
                                className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] bg-slate-50 focus:bg-white text-right outline-none"
                                value={item.variantId || ""}
                                onChange={(e) => handleItemVariantChange(idx, e.target.value)}
                              >
                                <option value="">-- انتخاب ترکیب مشخصات (SKU) --</option>
                                {products.find(p => p.id === item.productId)?.variants?.map(v => (
                                  <option key={v.id} value={v.id}>
                                    {v.sku} - {Object.values(v.attributes).join(', ')}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);
