const fs = require('fs');
let content = fs.readFileSync('src/components/TasksView.tsx', 'utf8');

content = content.replace(
  "import { getTodayShamsi } from '../dateUtils';",
  "import { getTodayShamsi } from '../dateUtils';\nimport { isFieldRequired, renderFieldLabelWithAsterisk, getFieldAsterisk } from '../utils/requiredFields';"
);

content = content.replace(
  '<label className="text-xs font-semibold text-slate-500">عنوان وظیفه / پیگیری بازرگانی *</label>',
  '<label className="text-xs font-semibold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'tasks\', \'title\', \'عنوان وظیفه / پیگیری بازرگانی\')}</label>'
);
content = content.replace(
  '<input\n                    type="text"\n                    required\n                    value={title}',
  '<input\n                    type="text"\n                    required={isFieldRequired(settings, \'tasks\', \'title\')}\n                    value={title}'
);

content = content.replace(
  '<label className="text-xs font-semibold text-slate-500">شرح جزئیات اقدام درخواستی</label>',
  '<label className="text-xs font-semibold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'tasks\', \'description\', \'شرح جزئیات اقدام درخواستی\')}</label>'
);
content = content.replace(
  '<textarea\n                    rows={2}\n                    value={description}',
  '<textarea\n                    rows={2}\n                    required={isFieldRequired(settings, \'tasks\', \'description\')}\n                    value={description}'
);

content = content.replace(
  '<label className="text-xs font-semibold text-slate-500">درجه اولویت</label>',
  '<label className="text-xs font-semibold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'tasks\', \'priority\', \'درجه اولویت\')}</label>'
);
content = content.replace(
  '<select\n                    value={priority}',
  '<select\n                    value={priority}\n                    required={isFieldRequired(settings, \'tasks\', \'priority\')}'
);

content = content.replace(
  'label="مهلت انجام (سررسید)"\n                    required\n                    value={dueDate}',
  'label={`مهلت انجام (سررسید)${getFieldAsterisk(settings, \'tasks\', \'dueDate\')}`}\n                    required={isFieldRequired(settings, \'tasks\', \'dueDate\')}\n                    value={dueDate}'
);

content = content.replace(
  '<label className="text-xs font-semibold text-slate-500">ارجاع کار به همکار (اختیاری)</label>',
  '<label className="text-xs font-semibold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'tasks\', \'assignedTo\', \'ارجاع کار به همکار\')}</label>'
);
content = content.replace(
  '<select\n                    value={assignedTo}',
  '<select\n                    value={assignedTo}\n                    required={isFieldRequired(settings, \'tasks\', \'assignedTo\')}'
);

fs.writeFileSync('src/components/TasksView.tsx', content);
