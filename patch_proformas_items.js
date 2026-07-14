import fs from 'fs';
let content = fs.readFileSync('src/components/ProformasView.tsx', 'utf-8');

content = content.replace(
  '    updateProforma({\n      ...selectedProformaForItems,\n      items: editingItemsList\n    });',
  '    updateProforma({\n      ...selectedProformaForItems,\n      items: editingItemsList,\n      isCancelled: false,\n      status: selectedProformaForItems.status === "لغو شده" ? "ارسال شده" : selectedProformaForItems.status\n    });'
);

fs.writeFileSync('src/components/ProformasView.tsx', content);
