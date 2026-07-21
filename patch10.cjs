const fs = require('fs');
let content = fs.readFileSync('src/components/AfterSalesServicesView.tsx', 'utf8');

const itemValidation = `
    if (isFieldRequired(settings, 'afterSalesServices', 'itemName') && !finalProductName) {
      alert('فیلد "نام کالا" الزامی است.');
      return;
    }
    if (isFieldRequired(settings, 'afterSalesServices', 'issueDescription') && !itemIssue) {
      alert('فیلد "علت برگشت / نوع مشکل" الزامی است.');
      return;
    }
    if (isFieldRequired(settings, 'afterSalesServices', 'actionsTaken') && !itemAction) {
      alert('فیلد "اقدامات انجام شده" الزامی است.');
      return;
    }
    if (isFieldRequired(settings, 'afterSalesServices', 'startDate') && !itemStartDate) {
      alert('فیلد "تاریخ دریافت کالا" الزامی است.');
      return;
    }
`;

content = content.replace('    if (!itemIssue) {', itemValidation + '    if (!itemIssue) {');

const submitValidation = `
    if (isFieldRequired(settings, 'afterSalesServices', 'projectId') && !selectedProjectId) {
      alert('فیلد "پروژه (مشتری)" الزامی است.');
      return;
    }
`;

content = content.replace('const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();', 'const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n' + submitValidation);

fs.writeFileSync('src/components/AfterSalesServicesView.tsx', content);
