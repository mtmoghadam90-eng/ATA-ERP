import fs from 'fs';

function patchView(filename, viewName) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add printModeOnly to interface
  if (code.includes(`interface ${viewName}Props {`)) {
    code = code.replace(`interface ${viewName}Props {`, `interface ${viewName}Props {\n  printModeOnly?: boolean;`);
  }

  // Add printModeOnly to function signature
  if (code.includes(`export default function ${viewName}({`)) {
    code = code.replace(`export default function ${viewName}({`, `export default function ${viewName}({\n  printModeOnly,`);
  }

  // Wrap the main content
  // Look for the first return statement of the component
  // It usually starts with `return (` followed by `    <div`
  const returnRegex = /return \(\s*<div className="space-y-6/g;
  if (returnRegex.test(code)) {
    code = code.replace(/return \(\s*(<div className="space-y-[^>]+>)([\s\S]*?)(\s*\{\/\* modals \*\/|\s*\{\/\* modals |\s*\{\/\* Modals|\s*\{\/\* .*Modal |\s*\{\/\* Create\/Edit)/i, (match, div, content, modals) => {
        // This regex is tricky. Let's just wrap the first <div className="space-y-6..."> with {!printModeOnly && ( ... )}
        return `return (\n    <>\n      {!printModeOnly && (\n        ${div}${content}\n      )}\n      ${modals}`;
    });
  }

  fs.writeFileSync(filename, code);
}
// We'll write a better regex or use simple string replacements
