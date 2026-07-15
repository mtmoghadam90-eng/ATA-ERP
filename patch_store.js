import fs from 'fs';
let code = fs.readFileSync('src/useERPStore.ts', 'utf8');

// remove SupplierInquiry, InquiryStep from imports
code = code.replace(/SupplierInquiry,\n\s*/, '');
code = code.replace(/InquiryStep,\n\s*/, '');
code = code.replace(/SupplierInquiry,\s*/, '');
code = code.replace(/InquiryStep,\s*/, '');

// remove state
code = code.replace(/const \[supplierInquiries, setSupplierInquiries\] = useState[^;]+;\n/g, '');

// remove functions
const removeFunc = (funcName) => {
  const regex = new RegExp("const " + funcName + " = [\\s\\S]*?^  };", "gm");
  code = code.replace(regex, "");
}
// since my regex might fail due to indentation, I'll just use a more robust way: string replacement
