const rules = [
  {
    active: true,
    conditions: [{ featureName: 'Size', values: ['1 Inch'] }],
    actions: { featureName: 'Liner', values: ['Rubber'] }
  }
];
const combo = { 'Size': '1 Inch', 'Liner': 'Rubber' };

const isValid = !rules.some(rule => {
  if (!rule.active) return false;
  // all conditions must match
  const conditionsMatch = rule.conditions.every(cond => {
    if (!cond.values || cond.values.length === 0) return false; // Or true? If no values selected, does it match anything?
    return cond.values.includes(combo[cond.featureName]);
  });
  if (!conditionsMatch) return false;
  // if conditions match, check if action violates
  return rule.actions.values.includes(combo[rule.actions.featureName]);
});
console.log(isValid);
