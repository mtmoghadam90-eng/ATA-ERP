const fs = require('fs');

function addValidation(file, module, fields) {
  let content = fs.readFileSync(file, 'utf8');
  let validations = fields.map(f => {
    return `
    if (isFieldRequired(settings, '${module}', '${f.key}') && !${f.varName}) {
      alert('فیلد "${f.label}" الزامی است.');
      return;
    }`;
  }).join('');
  
  if (content.includes('e.preventDefault();')) {
    content = content.replace('e.preventDefault();', 'e.preventDefault();\n' + validations);
    fs.writeFileSync(file, content);
  } else {
    console.log("Could not find e.preventDefault() in", file);
  }
}

addValidation('src/components/SupplierInquiriesView.tsx', 'supplierInquiries', [
  {key: 'projectId', varName: 'projectId', label: 'پروژه'},
  {key: 'supplierId', varName: 'supplierId', label: 'تأمین‌کننده'}
]);

