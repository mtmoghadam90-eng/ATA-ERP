import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import SupplierInquiriesView from './components/SupplierInquiriesView';\n", '');

const caseBlock = `      case 'supplierInquiries':
        return (
          <SupplierInquiriesView 
            initialPrintDocId={printDocumentRequest?.module === 'supplierInquiries' ? printDocumentRequest.docId : undefined}
            onClearInitialPrintDocId={handleClearPrintDoc}
            projects={store.projects}
            proformas={store.proformas}
            suppliers={store.suppliers}
            supplierInquiries={store.supplierInquiries}
            addSupplierInquiry={store.addSupplierInquiry}
            updateSupplierInquiry={store.updateSupplierInquiry}
            deleteSupplierInquiry={store.deleteSupplierInquiry}
            addSupplierInquiryStep={store.addSupplierInquiryStep}
            selectSupplierInquiryWinner={store.selectSupplierInquiryWinner}
            settings={store.settings}
            currentUser={store.currentUser}
            exchangeRates={store.exchangeRates}
          />
        );
`;

code = code.replace(caseBlock, '');

// Also remove from the Title map:
// activeView === 'supplierInquiries' ? 'استعلام از تأمین‌کنندگان' :
code = code.replace("              activeView === 'supplierInquiries' ? 'استعلام از تأمین‌کنندگان' :\n", '');

fs.writeFileSync('src/App.tsx', code);
