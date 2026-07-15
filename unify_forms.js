import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

const regexNewUploads = /\{\/\* Tech File Upload \*\/\}[\s\S]*?\{\/\* Notes \*\/\}/m;

const newUploadUI = `{/* Tech File Upload */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">بارگذاری پروپوزال فنی</label>
              
              {!techFileName ? (
                <div 
                  className="border border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-white hover:bg-sky-50/20 group relative"
                  onClick={() => document.getElementById('new-tech-file-input')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-sky-400', 'bg-sky-50/40');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0], 'tech');
                    }
                  }}
                >
                  <input 
                    type="file" 
                    id="new-tech-file-input" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'tech');
                      }
                      if (e.target) e.target.value = '';
                    }}
                  />
                  <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-sky-500 transition-colors" size={20} />
                  <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب پروپوزال فنی</span>
                  <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                </div>
              ) : isUploadingTech ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span className="font-medium animate-pulse">در حال آپلود پروپوزال فنی...</span>
                    <span className="font-mono font-bold text-sky-600">{uploadProgressTech}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-1.5 rounded-full transition-all duration-100"
                      style={{ width: \`\${uploadProgressTech}%\` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-700 truncate" title={techFileName}>{techFileName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{techFileSize || '1.4 MB'}</div>
                    </div>
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-sky-400', 'bg-sky-50/40');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0], 'fin');
                    }
                  }}
                >
                  <input 
                    type="file" 
                    id="new-fin-file-input" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'fin');
                      }
                      if (e.target) e.target.value = '';
                    }}
                  />
                  <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-sky-500 transition-colors" size={20} />
                  <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب آفر مالی</span>
                  <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                </div>
              ) : isUploadingFin ? (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span className="font-medium animate-pulse">در حال آپلود آفر مالی...</span>
                    <span className="font-mono font-bold text-sky-600">{uploadProgressFin}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-1.5 rounded-full transition-all duration-100"
                      style={{ width: \`\${uploadProgressFin}%\` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-700 truncate" title={finFileName}>{finFileName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{finFileSize || '980 KB'}</div>
                    </div>
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

code = code.replace(regexNewUploads, newUploadUI);
fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
