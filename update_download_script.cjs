const fs = require('fs');
let code = fs.readFileSync('downloadPackagingDeliveryHTML.ts', 'utf8');

// Remove checklistRows
code = code.replace(/const checklistRows =[\s\S]*?` : '';/, '');
code = code.replace(/\$\{checklistRows\}/, '');

fs.writeFileSync('downloadPackagingDeliveryHTML.ts', code);
console.log('updated download script');
