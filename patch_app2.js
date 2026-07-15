import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("proformas={store.proformas}\n            addProject={store.addProject}", "proformas={store.proformas}\n            supplierInquiries={store.supplierInquiries}\n            addProject={store.addProject}");
fs.writeFileSync('src/App.tsx', code);
