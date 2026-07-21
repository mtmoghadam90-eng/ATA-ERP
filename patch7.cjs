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
  
  // Try to find the submit handler
  if (content.includes('e.preventDefault();')) {
    content = content.replace('e.preventDefault();', 'e.preventDefault();\n' + validations);
    fs.writeFileSync(file, content);
  } else {
    console.log("Could not find e.preventDefault() in", file);
  }
}

addValidation('src/components/TasksView.tsx', 'tasks', [
  {key: 'title', varName: 'title', label: 'عنوان وظیفه'},
  {key: 'description', varName: 'description', label: 'شرح جزئیات'},
  {key: 'priority', varName: 'priority', label: 'درجه اولویت'},
  {key: 'dueDate', varName: 'dueDate', label: 'مهلت انجام'},
  {key: 'assignedTo', varName: 'assignedTo', label: 'ارجاع کار به همکار'}
]);

