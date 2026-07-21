const fs = require('fs');
let content = fs.readFileSync('src/components/AfterSalesServicesView.tsx', 'utf8');

content = content.replace(
  'onChange={(val) => {\n                            setItemProductDropdownVal(val);',
  'required={isFieldRequired(settings, \'afterSalesServices\', \'itemName\')}\n                          onChange={(val) => {\n                            setItemProductDropdownVal(val);'
);

content = content.replace(
  '<input\n                            type="text"\n                            value={itemCustomName}',
  '<input\n                            type="text"\n                            required={isFieldRequired(settings, \'afterSalesServices\', \'itemName\')}\n                            value={itemCustomName}'
);

content = content.replace(
  '<input\n                        type="text"\n                        value={itemCustomName}',
  '<input\n                        type="text"\n                        required={isFieldRequired(settings, \'afterSalesServices\', \'itemName\')}\n                        value={itemCustomName}'
);

fs.writeFileSync('src/components/AfterSalesServicesView.tsx', content);
