const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/p\.size \|\| p\.measurementRange \? \` \(\$\{\[ p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : null\]\.filter\(Boolean\)\.join\(\', \'\)\}\)\` : \'\'/g, "''");
  
  content = content.replace(/const details = \[ p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : null\]\.filter\(Boolean\)\.join\(\', \'\);/g, "const details = '';");

  fs.writeFileSync(filePath, content);
}

['src/components/ProjectsView.tsx', 'src/components/PurchaseOrdersView.tsx', 'src/components/QuickAddModal.tsx'].forEach(cleanFile);
