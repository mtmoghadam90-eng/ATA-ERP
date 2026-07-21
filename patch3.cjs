const fs = require('fs');
let content = fs.readFileSync('src/components/PackagingDeliveryView.tsx', 'utf8');

content = content.replace(
  "import { getTodayShamsi } from '../dateUtils';",
  "import { getTodayShamsi } from '../dateUtils';\nimport { isFieldRequired, renderFieldLabelWithAsterisk, getFieldAsterisk } from '../utils/requiredFields';"
);

content = content.replace(
  '<label className="block text-xs font-bold text-slate-700">انتخاب پروژه <span className="text-rose-500">*</span></label>',
  '<label className="block text-xs font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'packagingDelivery\', \'projectId\', \'انتخاب پروژه\')}</label>'
);
content = content.replace(
  'onChange={e => handleProjectChange(e.target.value)}\n                required',
  'onChange={e => handleProjectChange(e.target.value)}\n                required={isFieldRequired(settings, \'packagingDelivery\', \'projectId\')}'
);

content = content.replace(
  '<label className="block text-xs font-bold text-slate-700">نحوه ارسال کالا</label>',
  '<label className="block text-xs font-bold text-slate-700">{renderFieldLabelWithAsterisk(settings, \'packagingDelivery\', \'shippingMethod\', \'نحوه ارسال کالا\')}</label>'
);
content = content.replace(
  'onChange={e => setShippingMethod(e.target.value)}\n                className="w-full',
  'onChange={e => setShippingMethod(e.target.value)}\n                required={isFieldRequired(settings, \'packagingDelivery\', \'shippingMethod\')}\n                className="w-full'
);

content = content.replace(
  'label="تاریخ صدور پکینگ لیست *"\n                required\n                value={deliveryDate}',
  'label={`تاریخ صدور پکینگ لیست${getFieldAsterisk(settings, \'packagingDelivery\', \'deliveryDate\')}`}\n                required={isFieldRequired(settings, \'packagingDelivery\', \'deliveryDate\')}\n                value={deliveryDate}'
);

// I don't see packingListNumber as an input in the first lines, but I'll try to find it.

fs.writeFileSync('src/components/PackagingDeliveryView.tsx', content);
