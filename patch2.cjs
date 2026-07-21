const fs = require('fs');
let content = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

content = content.replace(
  "import { getTodayShamsi } from '../dateUtils';",
  "import { getTodayShamsi } from '../dateUtils';\nimport { isFieldRequired, renderFieldLabelWithAsterisk, getFieldAsterisk } from '../utils/requiredFields';"
);

content = content.replace(
  '<label className="text-xs font-bold text-slate-500">انتخاب پروژه <span className="text-rose-500">*</span></label>',
  '<label className="text-xs font-bold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'supplierInquiries\', \'projectId\', \'انتخاب پروژه\')}</label>'
);
content = content.replace(
  'onChange={(e) => {\n              const newProjId = e.target.value;\n              setProjectId(newProjId);\n              if (!editingInquiry) {\n                const targetProj = projects.find(p => p.id === newProjId);\n                if (targetProj && targetProj.itemsNeeded) {\n                  setItems(targetProj.itemsNeeded.map((item, idx) => ({\n                    id: idx.toString(),\n                    name: item.name,\n                    quantity: item.quantity,\n                    unit: item.unit,\n                    price: 0,\n                    currency: \'دلار\',\n                    priceRiyal: 0,\n                    notes: \'\',\n                    tagNumber: item.tagNumber\n                  })));\n                } else {\n                  setItems([]);\n                }\n              }\n            }}\n            required\n            disabled',
  'onChange={(e) => {\n              const newProjId = e.target.value;\n              setProjectId(newProjId);\n              if (!editingInquiry) {\n                const targetProj = projects.find(p => p.id === newProjId);\n                if (targetProj && targetProj.itemsNeeded) {\n                  setItems(targetProj.itemsNeeded.map((item, idx) => ({\n                    id: idx.toString(),\n                    name: item.name,\n                    quantity: item.quantity,\n                    unit: item.unit,\n                    price: 0,\n                    currency: \'دلار\',\n                    priceRiyal: 0,\n                    notes: \'\',\n                    tagNumber: item.tagNumber\n                  })));\n                } else {\n                  setItems([]);\n                }\n              }\n            }}\n            required={isFieldRequired(settings, \'supplierInquiries\', \'projectId\')}\n            disabled'
);

content = content.replace(
  '<label className="text-xs font-bold text-slate-500">انتخاب تأمین‌کننده <span className="text-rose-500">*</span></label>',
  '<label className="text-xs font-bold text-slate-500">{renderFieldLabelWithAsterisk(settings, \'supplierInquiries\', \'supplierId\', \'انتخاب تأمین‌کننده\')}</label>'
);
content = content.replace(
  'onChange={(e) => setSupplierId(e.target.value)}\n            required\n            disabled',
  'onChange={(e) => setSupplierId(e.target.value)}\n            required={isFieldRequired(settings, \'supplierInquiries\', \'supplierId\')}\n            disabled'
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', content);
