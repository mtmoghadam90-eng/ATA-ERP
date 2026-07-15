import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

// remove the supplierInquiries block from getProjectFoldersAndFiles
const start = code.indexOf('const projectInquiries = (supplierInquiries || []).filter((inq) => inq.projectId === p.id);');
if (start !== -1) {
  const end = code.indexOf('const projectDeliveries = (packagingDeliveries || []).filter((del) => del.projectId === p.id);');
  if (end !== -1) {
    code = code.substring(0, start) + code.substring(end);
  }
}

// remove 'استعلام از تامین‌کنندگان' from folders config inside getProjectFoldersAndFiles
code = code.replace(/,\n\s*\{ id: "supplier_inquiry".*?\}/, '');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
