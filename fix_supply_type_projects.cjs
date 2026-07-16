const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// replace selectedProd.supplyType
content = content.replace(/selectedProd\.supplyType === "ORDER" \? "ORDER" : "INVENTORY"/g, `(selectedProd.stockLevel === 0 ? "ORDER" : selectedProd.supplyType) === "ORDER" ? "ORDER" : "INVENTORY"`);

// replace matchedProd.supplyType === 'ORDER'
content = content.replace(/matchedProd\.supplyType === 'ORDER'/g, `(matchedProd.stockLevel === 0 ? 'ORDER' : matchedProd.supplyType) === 'ORDER'`);

// replace resolvedSupplyMethod
content = content.replace(/resolvedSupplyMethod = matchedProd\.supplyType;/g, `resolvedSupplyMethod = matchedProd.stockLevel === 0 ? 'ORDER' : matchedProd.supplyType;`);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
