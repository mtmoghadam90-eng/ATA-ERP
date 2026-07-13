import fs from 'fs';

let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// Add proformaAmount? to context
content = content.replace(
  /newStatus\?: string;\s*salesExpert\?: string;\s*\}/,
  `newStatus?: string;
      salesExpert?: string;
      proformaAmount?: number;
    }`
);

// Add evaluation logic for greater_than and less_than
const evaluateRegex = /if \(actualValue !== cond\.value\) \{\s*conditionsMet = false;\s*\}\s*\} else if \(cond\.operator === 'not_equals'\) \{\s*if \(actualValue === cond\.value\) \{\s*conditionsMet = false;\s*\}\s*\}/;

const newEvaluate = `if (actualValue !== cond.value) {
            conditionsMet = false;
          }
        } else if (cond.operator === 'not_equals') {
          if (actualValue === cond.value) {
            conditionsMet = false;
          }
        } else if (cond.operator === 'greater_than') {
          if (cond.field === 'proformaAmount') {
             if ((context.proformaAmount || 0) <= Number(cond.value)) conditionsMet = false;
          } else {
             if (Number(actualValue) <= Number(cond.value)) conditionsMet = false;
          }
        } else if (cond.operator === 'less_than') {
          if (cond.field === 'proformaAmount') {
             if ((context.proformaAmount || 0) >= Number(cond.value)) conditionsMet = false;
          } else {
             if (Number(actualValue) >= Number(cond.value)) conditionsMet = false;
          }
        }`;

if (content.match(evaluateRegex)) {
  content = content.replace(evaluateRegex, newEvaluate);
} else {
  console.log("Could not find evaluation regex!");
}

// Make sure that runWorkflows is called with proformaAmount in updateProforma etc.
content = content.replace(
  /runWorkflows\('proforma_outcome_change', \{\s*projectId: pf\.projectId,\s*proformaNumber: pf\.proformaNumber,\s*oldOutcome: oldPf\?\.outcome \|\| '',\s*newOutcome: finalUpdatedPf\.outcome,\s*salesExpert: finalUpdatedPf\.salesExpert\s*\}\);/,
  `runWorkflows('proforma_outcome_change', {
        projectId: pf.projectId,
        proformaNumber: pf.proformaNumber,
        oldOutcome: oldPf?.outcome || '',
        newOutcome: finalUpdatedPf.outcome,
        salesExpert: finalUpdatedPf.salesExpert,
        proformaAmount: finalUpdatedPf.totalAmount
      });`
);

// Also in addProforma? Wait, do we run proforma_outcome_change in addProforma?
content = content.replace(
  /runWorkflows\('proforma_outcome_change', \{\s*projectId: newProforma\.projectId,\s*proformaNumber: newProforma\.proformaNumber,\s*newOutcome: newProforma\.outcome,\s*salesExpert: newProforma\.salesExpert\s*\}\);/,
  `runWorkflows('proforma_outcome_change', {
      projectId: newProforma.projectId,
      proformaNumber: newProforma.proformaNumber,
      newOutcome: newProforma.outcome,
      salesExpert: newProforma.salesExpert,
      proformaAmount: newProforma.totalAmount
    });`
);


fs.writeFileSync('src/useERPStore.ts', content);

