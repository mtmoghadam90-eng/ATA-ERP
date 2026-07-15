import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/onClearInitialPrintDocId=\{\(\) => setPrintDocumentRequest\(null\)\}/g, `onClearInitialPrintDocId={handleClearPrintDoc}`);

fs.writeFileSync('src/App.tsx', code);
