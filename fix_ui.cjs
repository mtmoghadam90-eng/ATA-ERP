const fs = require('fs');

let pv = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const attachUI = `                </div>

                {/* Attachments */}
                <div className="space-y-1.5 md:col-span-2 pt-3 border-t border-slate-100 mt-2">
                  <label className="text-xs font-semibold text-slate-500">فایل‌های پیوست (نقشه‌ها، استعلام‌ها و ...)</label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-4 transition text-center cursor-pointer bg-slate-50 relative">
                    <input
                      type="file"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files) {
                          setIsUploading(true);
                          try {
                            for (const file of Array.from(files)) {
                              const url = await uploadFile(file);
                              setAttachments(prev => [...prev, { name: file.name, url, size: file.size }]);
                            }
                          } catch (err: any) {
                            alert(err.message || 'خطا در بارگذاری فایل');
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      disabled={isUploading}
                    />
                    <div className="text-slate-500 space-y-1">
                      <div className="text-xs font-bold text-slate-700">
                        {isUploading ? 'در حال بارگذاری...' : 'انتخاب یا رها کردن فایل‌ها'}
                      </div>
                      <div className="text-[10px] text-slate-400">PDF, Excel, Word, Images - ذخیره‌سازی ابری</div>
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div className="flex flex-col overflow-hidden max-w-[85%]">
                            <span className="truncate font-semibold text-slate-700" title={file.name}>{file.name}</span>
                            <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="flex gap-2">
                            <a href={file.url} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-800" title="مشاهده">
                              مشاهده
                            </a>
                            <button
                              type="button"
                              onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 transition"
                              title="حذف فایل"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>`;

pv = pv.replace(
  "                </div>\n\n              </div>\n\n              {/* Custom Fields */}",
  attachUI + "\n\n              {/* Custom Fields */}"
);

fs.writeFileSync('src/components/ProjectsView.tsx', pv);
