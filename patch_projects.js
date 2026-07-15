import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const propsStr = `interface ProjectsViewProps {\n  onOpenDocument?: (module: string, docId: string) => void;`;
code = code.replace("interface ProjectsViewProps {", propsStr);

code = code.replace("const ProjectsView: React.FC<ProjectsViewProps> = ({", "const ProjectsView: React.FC<ProjectsViewProps> = ({\n  onOpenDocument,");

const newHandlePreview = `  const handlePreviewOrDownload = (doc: any) => {
    if (doc.type === 'system') {
      if (doc.id?.startsWith('proforma-') && onOpenDocument) {
        onOpenDocument('proformas', doc.id.replace('proforma-', ''));
      } else if (doc.id?.startsWith('po-') && onOpenDocument) {
        onOpenDocument('purchaseOrders', doc.id.replace('po-', ''));
      } else if (doc.id?.startsWith('delivery-') && onOpenDocument) {
        onOpenDocument('packagingDelivery', doc.id.replace('delivery-', ''));
      } else {
        setActivePreviewDoc(doc);
      }
      return;
    }

    if (doc.url !== '#' && !doc.url.startsWith('data:image/') && !doc.name.endsWith('.png') && !doc.name.endsWith('.jpg') && !doc.name.endsWith('.jpeg')) {
      window.open(doc.url, '_blank');
    } else {
      setActivePreviewDoc(doc);
    }
  };`;

const oldHandlePreviewRegex = /const handlePreviewOrDownload = \(doc: any\) => \{[\s\S]*?setActivePreviewDoc\(doc\);\n    \}\n  \};/;
code = code.replace(oldHandlePreviewRegex, newHandlePreview);

fs.writeFileSync('src/components/ProjectsView.tsx', code);
