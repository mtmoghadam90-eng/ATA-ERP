const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldHeader = `                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], name: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="نام ویژگی (مثل: سایز)"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                          />
                          <input
                            type="text"
                            value={feature.code || ''}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], code: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="کد (مثل: s)"
                            className="w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500 text-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newF = [...features];
                            newF.splice(fIndex, 1);
                            setFeatures(newF);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>`;

const newHeader = `                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], name: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="نام ویژگی (مثل: سایز)"
                            className="w-full sm:flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                          />
                          <input
                            type="text"
                            value={feature.code || ''}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], code: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="کد (مثل: s)"
                            className="w-full sm:w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500 sm:text-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newF = [...features];
                            newF.splice(fIndex, 1);
                            setFeatures(newF);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-0.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>`;

if (content.includes(oldHeader)) {
    content = content.replace(oldHeader, newHeader);
    console.log("Successfully replaced header");
} else {
    console.log("Could not find header");
}

fs.writeFileSync('src/components/ProductsView.tsx', content);
