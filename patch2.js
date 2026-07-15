import fs from 'fs';
let code = fs.readFileSync('src/components/ProformasView.tsx', 'utf8');

code = code.replaceAll('setNotes(prevNotes => updateNotesWithDelivery(prevNotes, newItems));', 'setNotes(prevNotes => updateNotesWithDelivery(prevNotes, newItems, isEqualDelivery));');
code = code.replaceAll('setNotes(prev => updateNotesWithDelivery(prev, newItems));', 'setNotes(prev => updateNotesWithDelivery(prev, newItems, isEqualDelivery));');

fs.writeFileSync('src/components/ProformasView.tsx', code);
