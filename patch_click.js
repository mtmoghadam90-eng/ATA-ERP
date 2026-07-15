import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "setEditNotes(inq.notes || '');\n                                  setEditStatus(inq.status);",
  "setEditNotes(inq.notes || '');\n                                  setEditStatus(inq.status);\n                                  setEditItems(inq.items || []);"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
