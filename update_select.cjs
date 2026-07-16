const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const oldSelect = `                              ) : (
                                <SearchableSelect
                                  wrapperClassName="flex-1 min-w-0"
                                  value={item.productId}
                                  onChange={(val) =>
                                    handleItemProductChange(idx, val)
                                  }
                                  options={[
                                    { value: "", label: "-- انتخاب کالا --" },
                                    ...products.map((p) => {
                                      const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                      const stockText =
                                        effectiveST === "INVENTORY"
                                          ? \` | موجودی: \${p.stockLevel || 0}\`
                                          : " | تامین سفارشی";
                                      const details = [
                                        
                                        
                                      ]
                                        .filter(Boolean)
                                        .join(", ");
                                      const detailsText = details
                                        ? \` (\${details})\`
                                        : "";
                                      return {
                                        value: p.id,
                                        label: \`\${p.displayName}\${detailsText}\${stockText}\`,
                                      };
                                    }),
                                  ]}
                                  placeholder="-- انتخاب کالا --"
                                  className="text-xs"
                                />
                              )}`;

const newSelect = `                              ) : (
                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                  <SearchableSelect
                                    wrapperClassName="w-full min-w-0"
                                    value={item.productId}
                                    onChange={(val) => handleItemProductChange(idx, val)}
                                    options={[
                                      { value: "", label: "-- انتخاب کالا --" },
                                      ...products.map((p) => {
                                        const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                        const stockText = effectiveST === "INVENTORY" ? \` | موجودی: \${p.stockLevel || 0}\` : " | تامین سفارشی";
                                        return {
                                          value: p.id,
                                          label: \`\${p.displayName}\${stockText}\`,
                                        };
                                      }),
                                    ]}
                                    placeholder="-- انتخاب کالا --"
                                    className="text-xs"
                                  />
                                  {item.productId && products.find(p => p.id === item.productId)?.hasVariants && (
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
                                  )}
                                </div>
                              )}`;

content = content.replace(oldSelect, newSelect);
fs.writeFileSync('src/components/ProformasView.tsx', content);
