import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const oldInquiriesCode = `    // 3.5. Supplier Inquiries
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

const newInquiriesCode = `    // 3.5. Supplier Inquiries
    const projectInquiries = (supplierInquiries || []).filter(inq => inq.projectId === p.id);
    projectInquiries.forEach(inq => {
      if (inq.technicalProposalFile) {
        folderFiles['استعلام از تامین‌کنندگان'].push({
          id: \`inquiry-tech-\${inq.id}\`,
          name: \`پروپوزال فنی - \${inq.supplierName || 'نامشخص'} - \${inq.technicalProposalFile}\`,
          url: '#',
          size: inq.technicalProposalFileSize || 'نامشخص',
          date: inq.inquiryDate || inq.createdAt || 'نامشخص',
          type: 'system',
          originalEntity: inq
        });
      }
      if (inq.financialProposalFile) {
        folderFiles['استعلام از تامین‌کنندگان'].push({
          id: \`inquiry-fin-\${inq.id}\`,
          name: \`آفر مالی - \${inq.supplierName || 'نامشخص'} - \${inq.financialProposalFile}\`,
          url: '#',
          size: inq.financialProposalFileSize || 'نامشخص',
          date: inq.inquiryDate || inq.createdAt || 'نامشخص',
          type: 'system',
          originalEntity: inq
        });
      }
      
      // Also add files from steps
      if (inq.steps && inq.steps.length > 0) {
        inq.steps.forEach(step => {
           if (step.technicalProposalFile) {
             folderFiles['استعلام از تامین‌کنندگان'].push({
                id: \`inquiry-tech-\${inq.id}-\${step.id}\`,
                name: \`پاسخ فنی - \${inq.supplierName || 'نامشخص'} - \${step.technicalProposalFile}\`,
                url: '#',
                size: step.technicalProposalFileSize || 'نامشخص',
                date: step.date || 'نامشخص',
                type: 'system',
                originalEntity: inq
             });
           }
           if (step.financialProposalFile) {
             folderFiles['استعلام از تامین‌کنندگان'].push({
                id: \`inquiry-fin-\${inq.id}-\${step.id}\`,
                name: \`پاسخ مالی - \${inq.supplierName || 'نامشخص'} - \${step.financialProposalFile}\`,
                url: '#',
                size: step.financialProposalFileSize || 'نامشخص',
                date: step.date || 'نامشخص',
                type: 'system',
                originalEntity: inq
             });
           }
        });
      }
    });`;

code = code.replace(oldInquiriesCode, newInquiriesCode);

const oldPreviewHandler = `      } else if (doc.id?.startsWith('inquiry-') && onOpenDocument) {
        onOpenDocument('supplierInquiries', doc.id.replace('inquiry-', ''));
      } else if (doc.id?.startsWith('delivery-') && onOpenDocument) {`;

const newPreviewHandler = `      } else if (doc.id?.startsWith('inquiry-') && onOpenDocument) {
        let inqId = doc.id.replace('inquiry-tech-', '').replace('inquiry-fin-', '').replace('inquiry-', '');
        // handle step id if present (inquiry-tech-inqId-stepId)
        if (inqId.includes('-step-')) {
          inqId = inqId.split('-')[0];
        }
        onOpenDocument('supplierInquiries', inqId);
      } else if (doc.id?.startsWith('delivery-') && onOpenDocument) {`;

code = code.replace(oldPreviewHandler, newPreviewHandler);

fs.writeFileSync('src/components/ProjectsView.tsx', code);
