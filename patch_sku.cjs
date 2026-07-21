const fs = require('fs');

const path = 'src/components/ProductsView.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                              const combinations = getCombinations(features);
                              const pCode = productCode.trim() || 'SKU';
                              const newVariants = combinations.map((combo, i) => {`;

const replacement = `                              const combinations = getCombinations(features);
                              
                              // Filter combinations based on configRules
                              const validCombinations = combinations.filter(combo => {
                                return !configRules.some(rule => {
                                  if (!rule.active) return false;
                                  
                                  // Check if all conditions match this combination
                                  const conditionsMatch = rule.conditions.every(cond => {
                                    if (!cond.values || cond.values.length === 0) return false;
                                    return cond.values.includes(combo[cond.featureName]);
                                  });
                                  
                                  if (!conditionsMatch) return false;
                                  
                                  // If conditions match, check if this combination uses a forbidden action value
                                  return rule.actions.values.includes(combo[rule.actions.featureName]);
                                });
                              });

                              const pCode = productCode.trim() || 'SKU';
                              const newVariants = validCombinations.map((combo, i) => {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content);
  console.log("Patched successfully");
} else {
  console.log("Could not find target string");
}
