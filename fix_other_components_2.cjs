const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/p\.size \? \`سایز: \$\{p\.size\}\` : null,/g, "");
  content = content.replace(/p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : null,/g, "");
  content = content.replace(/p\.size \? \`سایز: \$\{p\.size\}\` : ''/g, "''");
  content = content.replace(/p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : ''/g, "''");
  content = content.replace(/size: '',\n/g, "");
  content = content.replace(/size: size,\n/g, "");
  content = content.replace(/measurementRange: mRange,\n/g, "");
  content = content.replace(/measurementRange: '',\n/g, "");
  
  // also for ProjectsView.tsx line 3159
  // let's just find `p.size`
  
  fs.writeFileSync(filePath, content);
}

['src/components/ProformasView.tsx', 'src/components/ProjectsView.tsx', 'src/components/PurchaseOrdersView.tsx', 'src/components/QuickAddModal.tsx', 'src/useERPStore.ts'].forEach(cleanFile);
