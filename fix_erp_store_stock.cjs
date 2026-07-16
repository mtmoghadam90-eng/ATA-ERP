const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const oldLogic = `        if (variantId && p.hasVariants && p.variants) {
          const vIdx = p.variants.findIndex((v) => v.id === variantId);
          if (vIdx !== -1) {
            const newVariants = [...p.variants];
            newVariants[vIdx] = {
              ...newVariants[vIdx],
              stockLevel: Math.max(
                0,
                (newVariants[vIdx].stockLevel || 0) + amount,
              ),
            };
            return { ...p, variants: newVariants };
          }
        }
        return { ...p, stockLevel: Math.max(0, (p.stockLevel || 0) + amount) };`;

const newLogic = `        if (variantId && p.hasVariants && p.variants) {
          const vIdx = p.variants.findIndex((v) => v.id === variantId);
          if (vIdx !== -1) {
            const newVariants = [...p.variants];
            newVariants[vIdx] = {
              ...newVariants[vIdx],
              stockLevel: (newVariants[vIdx].stockLevel || 0) + amount,
            };
            
            // Also update total stockLevel
            const newTotalStock = newVariants.reduce((sum, v) => sum + (v.stockLevel || 0), 0);
            
            return { ...p, variants: newVariants, stockLevel: newTotalStock };
          }
        }
        return { ...p, stockLevel: (p.stockLevel || 0) + amount };`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/useERPStore.ts', content);
console.log('Fixed stockLevel calculation in useERPStore');
