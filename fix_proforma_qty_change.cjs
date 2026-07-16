const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

const oldCheck = `    if (field === "quantity" || field === "unitPriceRIYAL") {
      if (typeof value === "string" && value === "") {
        sanitizedVal = 0;
      } else {
        const parsed = Number(value);
        sanitizedVal = isNaN(parsed) ? 0 : parsed;
        if (field === "quantity") {
          const prod = products.find((p) => p.id === newItems[index].productId);
          if (
            prod &&
            (prod.stockLevel === 0 ? "ORDER" : (prod.supplyType || "INVENTORY")) !== "ORDER" &&
            prod.stockLevel !== undefined
          ) {
            if (sanitizedVal > prod.stockLevel) {
              const confirmQty = window.confirm(
                \`موجودی کالا در انبار (\${prod.stockLevel} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${sanitizedVal}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`,
              );
              if (!confirmQty) {
                sanitizedVal = prod.stockLevel;
              }
            }
          }
        }
      }
    }`;

const newCheck = `    if (field === "quantity" || field === "unitPriceRIYAL") {
      if (typeof value === "string" && value === "") {
        sanitizedVal = 0;
      } else {
        const parsed = Number(value);
        sanitizedVal = isNaN(parsed) ? 0 : parsed;
        if (field === "quantity") {
          const item = newItems[index];
          const prod = products.find((p) => p.id === item.productId);
          
          let stockToCheck = undefined;
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
            if (sanitizedVal > stockToCheck) {
              const confirmQty = window.confirm(
                \`موجودی کالا در انبار (\${stockToCheck} \${prod.unit || "عدد"}) کمتر از تعداد درخواستی (\${sanitizedVal}) است.\\nآیا می‌خواهید با وجود کسر موجودی، مقدار درخواستی ثبت شود؟\`,
              );
              if (!confirmQty) {
                sanitizedVal = stockToCheck;
              }
            }
          }
        }
      }
    }`;

content = content.replace(oldCheck, newCheck);

fs.writeFileSync('src/components/ProformasView.tsx', content);
