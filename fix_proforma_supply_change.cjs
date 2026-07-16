const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const oldCheck = `                                          const prod = products.find(
                                            (p) => p.id === item.productId,
                                          );
                                          if (
                                            prod &&
                                            prod.stockLevel !== undefined &&
                                            newItems[idx].quantity >
                                              prod.stockLevel
                                          ) {
                                            const confirmQty = window.confirm(
                                              \`موجودی کالا در انبار (\${prod.stockLevel} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${newItems[idx].quantity}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`,
                                            );
                                            if (!confirmQty) {
                                              newItems[idx].quantity =
                                                prod.stockLevel;
                                            }
                                          }`;

const newCheck = `                                          const prod = products.find(
                                            (p) => p.id === item.productId,
                                          );
                                          let stockToCheck = undefined;
                                          if (prod && item.variantId) {
                                            const variant = prod.variants?.find(v => v.id === item.variantId);
                                            if (variant) stockToCheck = variant.stockLevel;
                                          } else if (prod) {
                                            stockToCheck = prod.stockLevel;
                                          }

                                          if (
                                            prod &&
                                            stockToCheck !== undefined &&
                                            newItems[idx].quantity > stockToCheck
                                          ) {
                                            const confirmQty = window.confirm(
                                              \`موجودی کالا در انبار (\${stockToCheck} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${newItems[idx].quantity}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`,
                                            );
                                            if (!confirmQty) {
                                              newItems[idx].quantity = stockToCheck;
                                            }
                                          }`;

content = content.replace(oldCheck, newCheck);

fs.writeFileSync('src/components/ProformasView.tsx', content);
