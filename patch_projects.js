import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

code = code.replace(/supplierInquiries\?: any\[\];\n\s*/g, '');
code = code.replace(/supplierInquiries = \[\],\n\s*/g, '');

const regexProjectInquiries = /const projectInquiries = \(supplierInquiries \|\| \[\]\)\.filter\(inq => inq\.projectId === p\.id\);\n\s*/g;
code = code.replace(regexProjectInquiries, '');

// also remove references to projectInquiries like this:
// {projectInquiries.length > 0 && (
//   <div className="flex justify-between text-slate-500 mb-1">
//      <span>استعلام‌ها:</span>
//      <span className="font-semibold text-slate-700">{projectInquiries.length}</span>
//   </div>
// )}
const inqBlockRegex = /\{projectInquiries\.length > 0 && \([\s\S]*?\}\)\}/g;
code = code.replace(inqBlockRegex, '');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
