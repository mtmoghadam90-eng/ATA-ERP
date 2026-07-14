import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');
content = content.replace(
  "p.prepaymentDate || '',\n      p.itemsNeeded",
  "p.prepaymentDate || '',\n      getActualDeliveryDate(p.id) || '',\n      p.itemsNeeded"
);
fs.writeFileSync('src/components/ProjectsView.tsx', content);
