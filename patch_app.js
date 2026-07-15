import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateHookStr = `  const [activeReminderTask, setActiveReminderTask] = useState<any>(null);\n  const [printDocumentRequest, setPrintDocumentRequest] = useState<{ module: string, docId: string } | null>(null);\n\n  const handleOpenDocument = (module: string, docId: string) => {\n    setPrintDocumentRequest({ module, docId });\n    setActiveView(module);\n  };`;

code = code.replace("  const [activeReminderTask, setActiveReminderTask] = useState<any>(null);", stateHookStr);

const projectsViewStr = `<ProjectsView \n            onOpenDocument={handleOpenDocument}`;
code = code.replace("<ProjectsView ", projectsViewStr);

const proformasViewStr = `<ProformasView \n            initialPrintDocId={printDocumentRequest?.module === 'proformas' ? printDocumentRequest.docId : undefined}\n            onClearInitialPrintDocId={() => setPrintDocumentRequest(null)}`;
code = code.replace("<ProformasView ", proformasViewStr);

const purchaseOrdersViewStr = `<PurchaseOrdersView \n            initialPrintDocId={printDocumentRequest?.module === 'purchaseOrders' ? printDocumentRequest.docId : undefined}\n            onClearInitialPrintDocId={() => setPrintDocumentRequest(null)}`;
code = code.replace("<PurchaseOrdersView ", purchaseOrdersViewStr);

const packagingDeliveryViewStr = `<PackagingDeliveryView \n            initialPrintDocId={printDocumentRequest?.module === 'packagingDelivery' ? printDocumentRequest.docId : undefined}\n            onClearInitialPrintDocId={() => setPrintDocumentRequest(null)}`;
code = code.replace("<PackagingDeliveryView ", packagingDeliveryViewStr);

fs.writeFileSync('src/App.tsx', code);
