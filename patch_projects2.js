import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const propsStr = `interface ProjectsViewProps {
  onOpenDocument?: (module: string, docId: string) => void;
  projects: Project[];
  customers: Customer[];
  products: Product[];
  proformas: Proforma[];
  supplierInquiries?: any[];`;

code = code.replace(`interface ProjectsViewProps {
  onOpenDocument?: (module: string, docId: string) => void;
  projects: Project[];
  customers: Customer[];
  products: Product[];
  proformas: Proforma[];`, propsStr);

const funcDecl = `export default function ProjectsView({
  onOpenDocument,
  projects,
  customers,
  products,
  proformas,
  supplierInquiries = [],`;

code = code.replace(`export default function ProjectsView({
  onOpenDocument,
  projects,
  customers,
  products,
  proformas,`, funcDecl);

const foldersRegex = /const folders = \[([\s\S]*?)\];/;
const foldersMatch = code.match(foldersRegex);
if (foldersMatch) {
  let foldersArr = foldersMatch[1];
  foldersArr = foldersArr + `,
      { id: 'supplier_inquiry', name: 'استعلام از تامین‌کنندگان', desc: 'اسناد و فرم‌های استعلام از تامین‌کنندگان خارجی و داخلی', iconBg: 'bg-orange-50 text-orange-600 border-orange-100', icon: Briefcase }`;
  code = code.replace(foldersMatch[1], foldersArr);
}

const posCodeStr = `    const projectPOs = (purchaseOrders || []).filter(po => po.projectId === p.id);
    projectPOs.forEach(po => {
      folderFiles['سفارشات خرید تامین‌کنندگان'].push({
        id: \`po-\${po.id}\`,
        name: \`سفارش خرید \${po.poNumber} - تامین‌کننده: \${po.supplierName}.pdf\`,
        url: '#',
        size: \`\${po.items?.length || 0} ردیف کالا\`,
        date: po.orderDate,
        type: 'system',
        originalEntity: po
      });
    });

    // 3.5. Supplier Inquiries
    const projectInquiries = (supplierInquiries || []).filter(inq => inq.projectId === p.id);
    projectInquiries.forEach(inq => {
      folderFiles['استعلام از تامین‌کنندگان'].push({
        id: \`inquiry-\${inq.id}\`,
        name: \`فرم استعلام تامین‌کننده - \${inq.supplierName || 'نامشخص'}.pdf\`,
        url: '#',
        size: \`\${inq.items?.length || 0} ردیف کالا\`,
        date: inq.createdAt || 'نامشخص',
        type: 'system',
        originalEntity: inq
      });
    });`;

code = code.replace(`    const projectPOs = (purchaseOrders || []).filter(po => po.projectId === p.id);
    projectPOs.forEach(po => {
      folderFiles['سفارشات خرید تامین‌کنندگان'].push({
        id: \`po-\${po.id}\`,
        name: \`سفارش خرید \${po.poNumber} - تامین‌کننده: \${po.supplierName}.pdf\`,
        url: '#',
        size: \`\${po.items?.length || 0} ردیف کالا\`,
        date: po.orderDate,
        type: 'system',
        originalEntity: po
      });
    });`, posCodeStr);

const handlePreviewRegex = /} else if \(doc\.id\?\.startsWith\('delivery-'\) && onOpenDocument\) {/
code = code.replace(handlePreviewRegex, `} else if (doc.id?.startsWith('inquiry-') && onOpenDocument) {
        onOpenDocument('supplierInquiries', doc.id.replace('inquiry-', ''));
      } else if (doc.id?.startsWith('delivery-') && onOpenDocument) {`);

fs.writeFileSync('src/components/ProjectsView.tsx', code);
