import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

const propsStr = `interface SupplierInquiriesViewProps {
  initialPrintDocId?: string;
  onClearInitialPrintDocId?: () => void;`;

code = code.replace(`interface SupplierInquiriesViewProps {`, propsStr);

const funcDecl = `export default function SupplierInquiriesView({
  initialPrintDocId,
  onClearInitialPrintDocId,
  projects,
  proformas,`;

code = code.replace(`export default function SupplierInquiriesView({
  projects,
  proformas,`, funcDecl);

const hookStr = `  const [editStatus, setEditStatus] = useState<string>('پیش‌نویس');
  const [editItems, setEditItems] = useState<any[]>([]);

  React.useEffect(() => {
    if (initialPrintDocId) {
      const inq = supplierInquiries.find(p => p.id === initialPrintDocId);
      if (inq) {
        setEditingInquiry(inq);
        setEditProjectId(inq.projectId || '');
        setEditProformaId(inq.proformaId || '');
        setEditProformaItemId(inq.proformaItemId || '');
        setEditSupplierId(inq.supplierId);
        setEditInquiryDate(inq.inquiryDate);
        setEditPriceRIYAL(inq.priceRIYAL || 0);
        setEditPriceForeign(inq.priceForeign || 0);
        setEditCurrency(inq.currency || 'یورو');
        setEditDeliveryTime(inq.deliveryTime || '');
        setEditTechFileName(inq.technicalProposalFile || '');
        setEditFinFileName(inq.financialProposalFile || '');
        setEditTechFileSize(inq.technicalProposalFileSize || '');
        setEditFinFileSize(inq.financialProposalFileSize || '');
        setEditNotes(inq.notes || '');
        setEditStatus(inq.status);
      }
      onClearInitialPrintDocId?.();
    }
  }, [initialPrintDocId, supplierInquiries]);`;

code = code.replace(`  const [editStatus, setEditStatus] = useState<string>('پیش‌نویس');
  const [editItems, setEditItems] = useState<any[]>([]);`, hookStr);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
