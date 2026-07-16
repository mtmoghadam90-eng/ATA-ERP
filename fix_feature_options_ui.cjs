const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldUI = `                          {feature.options.map((opt, oIndex) => (
                            <div key={opt.id} className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                              <span className="px-2 text-xs font-medium">{opt.value}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newF = [...features];
                                  newF[fIndex] = {
                                    ...newF[fIndex],
                                    options: newF[fIndex].options.filter((_, idx) => idx !== oIndex)
                                  };
                                  setFeatures(newF);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>`;

const newUI = `                          {feature.options.map((opt, oIndex) => (
                            <div key={opt.id} className="flex items-center bg-white border border-slate-200 rounded-md p-1 shadow-sm gap-1">
                              <span className="px-2 text-xs font-medium">{opt.value}</span>
                              <input
                                type="text"
                                placeholder="کد"
                                value={opt.code || ''}
                                onChange={(e) => {
                                  const newF = [...features];
                                  newF[fIndex].options[oIndex].code = e.target.value;
                                  setFeatures(newF);
                                }}
                                className="w-16 border border-slate-200 rounded text-xs px-1 py-0.5 outline-none focus:border-sky-500 text-center"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newF = [...features];
                                  newF[fIndex] = {
                                    ...newF[fIndex],
                                    options: newF[fIndex].options.filter((_, idx) => idx !== oIndex)
                                  };
                                  setFeatures(newF);
                                }}
                                className="px-1.5 py-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>`;

content = content.replace(oldUI, newUI);
fs.writeFileSync('src/components/ProductsView.tsx', content);
console.log('Fixed feature options UI');
