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

addValidation('src/components/PackagingDeliveryView.tsx', 'packagingDelivery', [
  {key: 'projectId', varName: 'selectedProjectId', label: 'پروژه'},
  {key: 'shippingMethod', varName: 'shippingMethod', label: 'نحوه ارسال کالا'},
  {key: 'deliveryDate', varName: 'deliveryDate', label: 'تاریخ صدور پکینگ لیست'}
]);

