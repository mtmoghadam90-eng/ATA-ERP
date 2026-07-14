import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

content = content.replace(
  /const handleDeleteWorkflowRule = \(ruleId: string\) => \{[\s\S]*?\}\);\s*\};\s*const handleSaveWorkflowRule =/m,
  `const handleDeleteWorkflowRule = (ruleId: string) => {
    const rules = settings.workflows || [];
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    setDeleteType('workflow');
    setDeleteTargetId(ruleId);
    setDeleteTargetName(rule.name);
    setDeleteConfirmOpen(true);
  };

  const handleSaveWorkflowRule =`
);

fs.writeFileSync('src/components/SettingsView.tsx', content);

