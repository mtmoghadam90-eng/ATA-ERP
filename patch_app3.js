import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacementStr = `      case 'supplierInquiries':
        return (
          <SupplierInquiriesView 
            initialPrintDocId={printDocumentRequest?.module === 'supplierInquiries' ? printDocumentRequest.docId : undefined}
            onClearInitialPrintDocId={() => setPrintDocumentRequest(null)}
            projects={store.projects}`;

code = code.replace(`      case 'supplierInquiries':
        return (
          <SupplierInquiriesView 
            projects={store.projects}`, replacementStr);

fs.writeFileSync('src/App.tsx', code);
