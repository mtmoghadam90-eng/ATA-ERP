import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `const [printDocumentRequest, setPrintDocumentRequest] = useState<{ module: string, docId: string } | null>(null);`,
  `const [printDocumentRequest, setPrintDocumentRequest] = useState<{ module: string, docId: string } | null>(null);
  const [previousView, setPreviousView] = useState<string | null>(null);`
);

code = code.replace(
  `  const handleOpenDocument = (module: string, docId: string) => {
    setPrintDocumentRequest({ module, docId });
    setActiveView(module);
  };`,
  `  const handleOpenDocument = (module: string, docId: string) => {
    setPreviousView(activeView);
    setPrintDocumentRequest({ module, docId });
    setActiveView(module);
  };

  const handleClearPrintDoc = () => {
    setPrintDocumentRequest(null);
    if (previousView) {
      setActiveView(previousView as any);
      setPreviousView(null);
    }
  };`
);

fs.writeFileSync('src/App.tsx', code);
