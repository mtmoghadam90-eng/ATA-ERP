const fs = require('fs');
let content = fs.readFileSync('src/components/AfterSalesServicesView.tsx', 'utf8');

content = content.replace(
  "import { getTodayShamsi } from '../dateUtils';",
  "import { getTodayShamsi } from '../dateUtils';\nimport { isFieldRequired, renderFieldLabelWithAsterisk, getFieldAsterisk } from '../utils/requiredFields';"
);

content = content.replace(
  '<label className="text-sm font-bold text-slate-700">پروژه (مشتری) <span className="text-red-500">*</span></label>',
  '<label className="text-sm font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'afterSalesServices\', \'projectId\', \'پروژه (مشتری)\')}</label>'
);
content = content.replace(
  'onChange={(val) => {\n                      setSelectedProjectId(val);\n                      setSelectedProformaNumber(\'\');\n                      setServiceItems([]);\n                      resetItemForm();\n                    }}\n                    required',
  'onChange={(val) => {\n                      setSelectedProjectId(val);\n                      setSelectedProformaNumber(\'\');\n                      setServiceItems([]);\n                      resetItemForm();\n                    }}\n                    required={isFieldRequired(settings, \'afterSalesServices\', \'projectId\')}'
);

content = content.replace(
  '<label className="text-xs font-bold text-slate-700">نام کالا / تجهیز برگشتی <span className="text-red-500">*</span></label>',
  '<label className="text-xs font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'afterSalesServices\', \'itemName\', \'نام کالا / تجهیز برگشتی\')}</label>'
);

content = content.replace(
  '<label className="text-xs font-bold text-slate-700">علت برگشت / نوع مشکل <span className="text-red-500">*</span></label>',
  '<label className="text-xs font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'afterSalesServices\', \'issueDescription\', \'علت برگشت / نوع مشکل\')}</label>'
);
// For required in <select value={itemIssue} ...
content = content.replace(
  '<select\n                      value={itemIssue}\n                      onChange={(e) => setItemIssue(e.target.value)}\n                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium text-slate-750"\n                      disabled={!selectedProjectId}',
  '<select\n                      value={itemIssue}\n                      onChange={(e) => setItemIssue(e.target.value)}\n                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium text-slate-750"\n                      required={isFieldRequired(settings, \'afterSalesServices\', \'issueDescription\')}\n                      disabled={!selectedProjectId}'
);

content = content.replace(
  '<label className="text-xs font-bold text-slate-700">اقدامات انجام شده</label>',
  '<label className="text-xs font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'afterSalesServices\', \'actionsTaken\', \'اقدامات انجام شده\')}</label>'
);
content = content.replace(
  '<input\n                      type="text"\n                      value={itemAction}',
  '<input\n                      type="text"\n                      required={isFieldRequired(settings, \'afterSalesServices\', \'actionsTaken\')}\n                      value={itemAction}'
);

content = content.replace(
  'label="تاریخ دریافت کالا"\n                      value={itemStartDate}',
  'label={`تاریخ دریافت کالا${getFieldAsterisk(settings, \'afterSalesServices\', \'startDate\')}`}\n                      required={isFieldRequired(settings, \'afterSalesServices\', \'startDate\')}\n                      value={itemStartDate}'
);

fs.writeFileSync('src/components/AfterSalesServicesView.tsx', content);
