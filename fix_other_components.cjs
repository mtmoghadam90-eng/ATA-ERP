const fs = require('fs');

const files = [
  'src/components/ProformasView.tsx',
  'src/components/ProjectsView.tsx',
  'src/components/PurchaseOrdersView.tsx',
  'src/components/QuickAddModal.tsx',
  'src/useERPStore.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (file.includes('ProformasView.tsx')) {
    content = content.replace(/p\.size \? \`- \$\{p\.size\}\` : ''/g, "''");
    content = content.replace(/p\.measurementRange\n                                                    \? \`- \$\{p\.measurementRange\}\`\n                                                    : ''/g, "''");
  }
  
  if (file.includes('ProjectsView.tsx')) {
    content = content.replace(/p\.size \? \` - سایز: \$\{p\.size\}\` : ''/g, "''");
    content = content.replace(/p\.measurementRange \? \` - رنج: \$\{p\.measurementRange\}\` : ''/g, "''");
  }
  
  if (file.includes('PurchaseOrdersView.tsx')) {
    content = content.replace(/p\.size \? \` - سایز: \$\{p\.size\}\` : ''/g, "''");
    content = content.replace(/p\.measurementRange \? \` - رنج: \$\{p\.measurementRange\}\` : ''/g, "''");
  }
  
  if (file.includes('QuickAddModal.tsx')) {
    content = content.replace(/p\.size \|\| p\.measurementRange \? \` \(\$\{p\.size \? \`سایز: \$\{p\.size\}\` : ''\}\$\{p\.size && p\.measurementRange \? '، ' : ''\}\$\{p\.measurementRange \? \`رنج: \$\{p\.measurementRange\}\` : ''\}\)\` : ''/g, "''");
    content = content.replace(/size: '',\n/g, "");
    content = content.replace(/size: size,\n/g, "");
    // Also remove any size usage in QuickAddModal.tsx
  }

  if (file.includes('useERPStore.ts')) {
    // The previous replace left size: size, measurementRange: mRange, in some place?
    // Oh, I missed it in one place maybe. Let's see:
    content = content.replace(/            size: size,\n            measurementRange: mRange,\n/g, "");
    content = content.replace(/            size,\n            measurementRange: mRange,\n/g, "");
  }

  fs.writeFileSync(file, content);
}

console.log('Fixed other components');
