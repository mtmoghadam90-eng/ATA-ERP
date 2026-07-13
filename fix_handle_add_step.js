import fs from 'fs';

let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf-8');

const handleAddStepCode = `
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForStep) return;

    addSupplierInquiryStep(activeInquiryForStep.id, {
      date: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      title: stepActionType || 'ثبت اقدام',
      description: stepDesc,
      type: 'sent'
    });

    setActiveInquiryForStep(null);
    setStepActionType('');
    setStepDesc('');
  };
`;

content = content.replace(
  /const handleAddAnswer = \(e: React.FormEvent\) => \{/,
  handleAddStepCode + '\n  const handleAddAnswer = (e: React.FormEvent) => {'
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);

