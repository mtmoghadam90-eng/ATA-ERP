const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

content = content.replace(
  "const [stockAdjustNotes, setStockAdjustNotes] = useState('');",
  "const [stockAdjustNotes, setStockAdjustNotes] = useState('');\n  const [stockAdjustVariantId, setStockAdjustVariantId] = useState('');"
);

fs.writeFileSync('src/components/ProductsView.tsx', content);
