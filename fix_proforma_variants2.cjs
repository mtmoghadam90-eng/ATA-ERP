const fs = require('fs');
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

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
    console.log("Successfully replaced config confirm");
} else {
    console.log("Still could not find config confirm block.");
}

fs.writeFileSync('src/components/ProformasView.tsx', content);
