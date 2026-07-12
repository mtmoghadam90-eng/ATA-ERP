const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /<option key={p\.id} value={p\.id}>{p\.code} - {p\.displayName}<\/option>/g,
    "<option key={p.id} value={p.id}>{p.code} - {p.displayName}{p.size || p.measurementRange ? ` (${[p.size ? `سایز: ${p.size}` : null, p.measurementRange ? `رنج: ${p.measurementRange}` : null].filter(Boolean).join(', ')})` : ''}</option>"
  );
  fs.writeFileSync(filePath, content);
  console.log("Updated " + filePath);
}

updateFile('src/components/ProjectsView.tsx');
updateFile('src/components/QuickAddModal.tsx');
