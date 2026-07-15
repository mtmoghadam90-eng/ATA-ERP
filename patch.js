const fs = require('fs');
let code = fs.readFileSync('src/components/ProformasView.tsx', 'utf8');

code = code.replace(/updateNotesWithDelivery\(initialNotes, defaultItems\)/g, 'updateNotesWithDelivery(initialNotes, defaultItems, isEqualDelivery)');
code = code.replace(/updateNotesWithDelivery\(pf\.notes \|\| '', loadedItems\)/g, "updateNotesWithDelivery(pf.notes || '', loadedItems, isEqualDelivery)");
code = code.replace(/updateNotesWithDelivery\(prevNotes, newItems\)/g, 'updateNotesWithDelivery(prevNotes, newItems, isEqualDelivery)');
code = code.replace(/updateNotesWithDelivery\(prevNotes, updatedItems\)/g, 'updateNotesWithDelivery(prevNotes, updatedItems, checked)');

fs.writeFileSync('src/components/ProformasView.tsx', code);
