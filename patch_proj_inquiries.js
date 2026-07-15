import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const newPreviewHandler = `      } else if (doc.id?.startsWith('inquiry-') && onOpenDocument) {
        let inqId = doc.id.replace('inquiry-tech-', '').replace('inquiry-fin-', '').replace('inquiry-', '');
        // handle step id if present (inquiry-tech-inqId-stepId)
        if (inqId.includes('-step-')) {
          inqId = inqId.split('-')[0];
        }
        onOpenDocument('supplierInquiries', inqId);`;

const updatedPreviewHandler = `      } else if (doc.id?.startsWith('inquiry-') && onOpenDocument) {
        // Just show it in the generic preview modal, not the form
        setActivePreviewDoc(doc);`;

code = code.replace(newPreviewHandler, updatedPreviewHandler);

fs.writeFileSync('src/components/ProjectsView.tsx', code);
