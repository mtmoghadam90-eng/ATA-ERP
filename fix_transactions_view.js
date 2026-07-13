import fs from 'fs';

let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

content = content.replace(
  /const summary = computedProjectSummaries\.find\(p => p\.id === pf\.projectId\)\?\.proformas\.find\(p => p\.proformaId === proformaId\);/,
  `const summary = computedProjectSummaries.find(p => p.id === pf.projectId)?.summary.proformas.find(p => p.proformaId === proformaId);`
);

// We should also check the fieldset injection from the previous agent invocation
// Oh wait, the previous invocation had a fieldset Injection in TransactionsView which actually had a bug too?
// Let's see if the fieldset injection had an error.
// The error TS2339 is what we just fixed.
// Is there any other error?
// No, the tsc output just had this for TransactionsView.

fs.writeFileSync('src/components/TransactionsView.tsx', content);
