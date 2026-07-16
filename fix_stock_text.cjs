const fs = require('fs');

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(/const stockText = p\.stockLevel !== undefined && p\.stockLevel > 0 \? \` \[موجودی: \$\{p\.stockLevel\} \$\{p\.unit \|\| 'عدد'\}\]\` : '';/,
`const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                        const stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel} \${p.unit || 'عدد'}]\` : '') : ' [تامین سفارشی]';`);
fs.writeFileSync('src/components/ProjectsView.tsx', content);

content = fs.readFileSync('src/components/PurchaseOrdersView.tsx', 'utf-8');
content = content.replace(/const stockText = p\.stockLevel !== undefined && p\.stockLevel > 0 \? \` \[موجودی: \$\{p\.stockLevel\}\]\` : '';/,
`const effectiveST = p.stockLevel === 0 ? "ORDER" : (p.supplyType || "INVENTORY");
                                        const stockText = effectiveST === "INVENTORY" ? (p.stockLevel !== undefined ? \` [موجودی: \${p.stockLevel}]\` : '') : ' [تامین سفارشی]';`);
fs.writeFileSync('src/components/PurchaseOrdersView.tsx', content);

