const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

content = content.replace(/const \[displayName, setDisplayName\] = useState\(''\);/, 'const [displayName, setDisplayName] = useState(\'\');\n  const [productCode, setProductCode] = useState(\'\');');

content = content.replace(/setInitialStock\('0'\);/, 'setInitialStock(\'0\');\n    setProductCode(\'\');');

content = content.replace(/setEditingProduct\(prod\);/, 'setEditingProduct(prod);\n    setProductCode(prod.code || \'\');');

let handleSave = `    if (!productCode.trim()) {
      alert('لطفاً کد کالا را وارد کنید.');
      return;
    }
    
    // Check for duplicate code
    const duplicate = products.find(p => p.code === productCode.trim() && p.id !== editingProduct?.id);
    if (duplicate) {
      alert('کد کالای وارد شده تکراری است. لطفاً کد دیگری انتخاب کنید.');
      return;
    }

    if (editingProduct) {`;

content = content.replace(/    if \(editingProduct\) \{/, handleSave);

content = content.replace(/code: "EQ-" \+ Math.floor\(10000 \+ Math.random\(\) \* 90000\),/, 'code: productCode.trim(),');
content = content.replace(/        supplyType,\n        customValues,/, '        supplyType,\n        code: productCode.trim(),\n        customValues,');

fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Fixed ProductsView product code');
