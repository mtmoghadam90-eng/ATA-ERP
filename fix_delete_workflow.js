import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// 1. Add 'workflow' to deleteType type
content = content.replace(
  /const \[deleteType, setDeleteType\] = useState\<'dropdownItem' \| 'activityCategory' \| 'lossReason' \| 'customField' \| 'clearData' \| null\>\(null\);/,
  `const [deleteType, setDeleteType] = useState<'dropdownItem' | 'activityCategory' | 'lossReason' | 'customField' | 'clearData' | 'workflow' | null>(null);`
);

// 2. Modify handleDeleteWorkflowRule
content = content.replace(
  /const handleDeleteWorkflowRule = \(ruleId: string\) => \{[\s\S]*?\}\s*\}\s*\};\s*const handleSaveWorkflowRule =/m,
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

// 3. Update handleConfirmDelete
content = content.replace(
  /\} else if \(deleteType === "clearData"\) \{/,
  `} else if (deleteType === 'workflow') {
      const rules = settings.workflows || [];
      const updated = rules.filter(r => r.id !== deleteTargetId);
      updateSettings({
        ...settings,
        workflows: updated
      });
    } else if (deleteType === "clearData") {`
);

// 4. Update Modal title and message
content = content.replace(
  /deleteType === 'clearData' \? 'هشدار: پاکسازی کامل داده‌ها' : 'تایید حذف'/,
  `deleteType === 'clearData' ? 'هشدار: پاکسازی کامل داده‌ها' : 
           deleteType === 'workflow' ? 'حذف گردش کار' : 'تایید حذف'`
);

content = content.replace(
  /deleteType === 'clearData' \? 'آیا مطمئن هستید که می‌خواهید تمامی داده‌های نرم‌افزار \(شامل مشتریان، کالاها، پروژه‌ها و \.\.\.\) را به طور کامل پاک کنید؟ این عملیات غیرقابل بازگشت است\.' : ''/,
  `deleteType === 'clearData' ? 'آیا مطمئن هستید که می‌خواهید تمامی داده‌های نرم‌افزار (شامل مشتریان، کالاها، پروژه‌ها و ...) را به طور کامل پاک کنید؟ این عملیات غیرقابل بازگشت است.' :
           deleteType === 'workflow' ? \`آیا از حذف گردش کار "\${deleteTargetName}" اطمینان دارید؟\` : ''`
);

// 5. Remove window.confirm from onClick in the delete button
const deleteBtnPattern = /onClick=\{\(\) => \{\s*if \(confirm\('آیا از حذف این قانون مطمئن هستید؟'\)\) \{\s*handleDeleteWorkflowRule\(rule\.id\);\s*\}\s*\}\}/;

content = content.replace(
  deleteBtnPattern,
  `onClick={() => handleDeleteWorkflowRule(rule.id)}`
);

fs.writeFileSync('src/components/SettingsView.tsx', content);

