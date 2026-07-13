import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const evaluateRegex = /if \(cond\.operator === 'equals'\) \{\s*if \(actualValue !== cond\.value\) \{\s*conditionsMet = false;\s*break;\s*\}\s*\} else if \(cond\.operator === 'not_equals'\) \{\s*if \(actualValue === cond\.value\) \{\s*conditionsMet = false;\s*break;\s*\}\s*\}/;

const newEvaluate = `if (cond.operator === 'equals') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) !== Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (actualValue !== cond.value) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'not_equals') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) === Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (actualValue === cond.value) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'greater_than') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) <= Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (Number(actualValue) <= Number(cond.value)) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'less_than') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) >= Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (Number(actualValue) >= Number(cond.value)) { conditionsMet = false; break; }
          }
        }`;

if (content.match(evaluateRegex)) {
  content = content.replace(evaluateRegex, newEvaluate);
} else {
  console.log("Could not find evaluation regex!");
}

fs.writeFileSync('src/useERPStore.ts', content);

