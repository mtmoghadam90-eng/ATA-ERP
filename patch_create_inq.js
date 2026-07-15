import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "financialProposalFileSize: finFileSize || (finFileName ? '980 KB' : undefined),",
  "financialProposalFileSize: finFileSize || (finFileName ? '980 KB' : undefined),\n      technicalProposalFileUrl: techFileUrl || undefined,\n      financialProposalFileUrl: finFileUrl || undefined,"
);

const newUploadUI = `          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Tech File Upload */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">بارگذاری پروپوزال فنی</label>
              
              {!techFileName ? (
                <div 
                  className="border border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-white hover:bg-sky-50/20 group relative"
                  onClick={() => document.getElementById('new-tech-file-input')?.click()}
                >
                  <input 
                    type="file" 
                    id="new-tech-file-input" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'tech');
                      }
                    }}
                  />
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs font-medium text-slate-600">انتخاب پروپوزال فنی</div>
                  <div className="text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</div>
                </div>
              ) : isUploadingTech ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-white relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 h-1 bg-sky-500 transition-all duration-300" style={{ width: \`\${uploadProgressTech}%\` }}></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center shrink-0">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{techFileName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">در حال بارگذاری... {uploadProgressTech}%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 flex items-center gap-3 group relative">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700 truncate">{techFileName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{techFileSize}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTechFileName('');
                      setTechFileSize(''); setTechFileUrl('');
                    }}
                    className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                    title="حذف فایل"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Fin File Upload */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">بارگذاری آفر مالی</label>
              
              {!finFileName ? (
                <div 
                  className="border border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-white hover:bg-sky-50/20 group relative"
                  onClick={() => document.getElementById('new-fin-file-input')?.click()}
                >
                  <input 
                    type="file" 
                    id="new-fin-file-input" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'fin');
                      }
                    }}
                  />
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs font-medium text-slate-600">انتخاب آفر مالی</div>
                  <div className="text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</div>
                </div>
              ) : isUploadingFin ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-white relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 h-1 bg-sky-500 transition-all duration-300" style={{ width: \`\${uploadProgressFin}%\` }}></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center shrink-0">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{finFileName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">در حال بارگذاری... {uploadProgressFin}%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 flex items-center gap-3 group relative">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700 truncate">{finFileName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{finFileSize}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFinFileName('');
                      setFinFileSize(''); setFinFileUrl('');
                    }}
                    className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                    title="حذف فایل"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Notes */}`;

code = code.replace("          </div>\n          \n          {/* Notes */}", newUploadUI);


fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
