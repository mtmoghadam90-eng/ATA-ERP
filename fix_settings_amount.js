import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// 1. Add operator options
content = content.replace(
  /<option value="equals">برابر باشد با<\/option>\s*<option value="not_equals">مخالف باشد با<\/option>/,
  `<option value="equals">برابر باشد با</option>
                              <option value="not_equals">مخالف باشد با</option>
                              <option value="greater_than">بزرگتر از</option>
                              <option value="less_than">کوچکتر از</option>`
);

// 2. Add proformaAmount field
content = content.replace(
  /\{ value: 'oldOutcome', label: 'وضعیت نهایی قبلی پیش‌فاکتور' \}/,
  `{ value: 'oldOutcome', label: 'وضعیت نهایی قبلی پیش‌فاکتور' },
                            { value: 'proformaAmount', label: 'مبلغ پیش‌فاکتور' }`
);

// 3. Render <input> instead of <select> if valueOptions is empty or field is amount
const renderValueCode = `<select
                              value={cond.value}
                              onChange={(e) => {
                                const updatedConds = [...editingRule.conditions];
                                updatedConds[condIdx].value = e.target.value;
                                setEditingRule({ ...editingRule, conditions: updatedConds });
                              }}
                              className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500"
                            >
                              <option value="">-- انتخاب مقدار --</option>
                              {valueOptions.map(val => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>`;

const newRenderValueCode = `
                            {cond.field === 'proformaAmount' || valueOptions.length === 0 ? (
                              <input
                                type="number"
                                value={cond.value}
                                onChange={(e) => {
                                  const updatedConds = [...editingRule.conditions];
                                  updatedConds[condIdx].value = e.target.value;
                                  setEditingRule({ ...editingRule, conditions: updatedConds });
                                }}
                                placeholder="مبلغ (ریال/ارز)"
                                className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500 font-mono text-left"
                              />
                            ) : (
                              <select
                                value={cond.value}
                                onChange={(e) => {
                                  const updatedConds = [...editingRule.conditions];
                                  updatedConds[condIdx].value = e.target.value;
                                  setEditingRule({ ...editingRule, conditions: updatedConds });
                                }}
                                className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500"
                              >
                                <option value="">-- انتخاب مقدار --</option>
                                {valueOptions.map(val => (
                                  <option key={val} value={val}>{val}</option>
                                ))}
                              </select>
                            )}
`;

content = content.replace(renderValueCode, newRenderValueCode);

fs.writeFileSync('src/components/SettingsView.tsx', content);

