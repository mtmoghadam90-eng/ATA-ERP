const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/p\.measurementRange\n\s*\? \`رنج: \$\{p\.measurementRange\}\`\n\s*: null,/g, "");
  
  if (filePath.includes('ProjectsView.tsx')) {
    content = content.replace(/p\.measurementRange \? \` - رنج: \$\{p\.measurementRange\}\` : ''/g, "''");
    // Also remove p.measurementRange ? ... for anything
    content = content.replace(/\$\{p\.measurementRange \? \` - رنج: \$\{p\.measurementRange\}\` : ''\}/g, "");
  }
  
  if (filePath.includes('PurchaseOrdersView.tsx')) {
    content = content.replace(/\$\{p\.measurementRange \? \` - رنج: \$\{p\.measurementRange\}\` : ''\}/g, "");
  }
  
  if (filePath.includes('QuickAddModal.tsx')) {
    content = content.replace(/size: (.*),\n/g, "");
    content = content.replace(/measurementRange: (.*),\n/g, "");
    content = content.replace(/\$\{p\.size \|\| p\.measurementRange \? \` \(\$\{''\}\$\{''\}\$\{p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : ''\}\)\` : ''\}/g, "");
  }

  fs.writeFileSync(filePath, content);
}

['src/components/ProformasView.tsx', 'src/components/ProjectsView.tsx', 'src/components/PurchaseOrdersView.tsx', 'src/components/QuickAddModal.tsx'].forEach(cleanFile);
