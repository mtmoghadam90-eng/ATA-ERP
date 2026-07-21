const fs = require('fs');
let content = fs.readFileSync('src/components/AfterSalesServicesView.tsx', 'utf8');

content = content.replace(
  'onChange={(val) => {\n                      setSelectedProjectId(val);\n                      setSelectedProformaNumber(\'\');\n                      resetItemForm();\n                      setServiceItems([]);\n                    }}\n                    options={[',
  'onChange={(val) => {\n                      setSelectedProjectId(val);\n                      setSelectedProformaNumber(\'\');\n                      resetItemForm();\n                      setServiceItems([]);\n                    }}\n                    required={isFieldRequired(settings, \'afterSalesServices\', \'projectId\')}\n                    options={['
);

fs.writeFileSync('src/components/AfterSalesServicesView.tsx', content);
