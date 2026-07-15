import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

const regexList = /\{\/\* Cards List \*\/\}.*?\{\/\* TAB 3: REGISTER NEW INQUIRY \*\/\}/s;

const newListView = `{/* Cards List */}
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle size={32} />
              </div>
              <h3 className="font-bold text-slate-700">هیچ استعلامی یافت نشد</h3>
              <p className="text-xs text-slate-400">اطلاعاتی متناسب با فیلترهای انتخابی شما در سیستم وجود ندارد.</p>
              <button 
                onClick={() => setActiveTab('new')} 
                className="mt-2 bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition"
              >
                ثبت اولین استعلام از تامین‌کننده
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                filteredInquiries.reduce((acc, inq) => {
                  const pName = inq.projectName || 'استعلام‌های بدون پروژه';
                  if (!acc[pName]) acc[pName] = [];
                  acc[pName].push(inq);
                  return acc;
                }, {} as Record<string, typeof filteredInquiries>)
              ).map(([pName, inqs]) => {
                const isProjectExpanded = expandedInquiries[pName] !== false; // default true or false? let's manage by string
                return (
                  <div key={pName} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedInquiries(prev => ({ ...prev, [pName]: !isProjectExpanded }))}
                      className="w-full bg-slate-50 p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-slate-400" size={20} />
                        <h3 className="font-bold text-slate-800">{pName}</h3>
                        <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{inqs.length}</span>
                      </div>
                      {isProjectExpanded ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                    </button>
                    
                    {isProjectExpanded && (
                      <div className="p-4 bg-slate-50/30 overflow-x-auto">
                        <div className="flex gap-4 min-w-max pb-2">
                          {inqs.map(inq => {
                            const lastStep = inq.steps[inq.steps.length - 1];
                            const isCardExpanded = !!expandedInquiries[inq.id];
                            return (
                              <div 
                                key={inq.id}
                                className={\`w-80 sm:w-96 shrink-0 bg-white rounded-xl border transition-all duration-200 shadow-sm \${
                                  inq.isWinner 
                                    ? 'border-emerald-200 bg-emerald-50/10 ring-1 ring-emerald-100' 
                                    : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
                                }\`}
                              >
                                {/* Header Summary */}
                                <div className="p-4 space-y-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <h4 className="font-bold text-slate-800 text-sm">{inq.supplierName}</h4>
                                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {inq.inquiryDate}
                                      </div>
                                    </div>
                                    {inq.isWinner && (
                                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Award size={12} /> برنده
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2">
                                    <div>
                                      <div className="text-slate-400 mb-0.5">قیمت ارزی</div>
                                      <div className="font-bold text-slate-700">{inq.priceForeign ? \`\${inq.priceForeign.toLocaleString()} \${inq.currency}\` : '-'}</div>
                                    </div>
                                    <div>
                                      <div className="text-slate-400 mb-0.5">زمان تحویل</div>
                                      <div className="font-bold text-slate-700">{inq.deliveryTime || '-'}</div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                    <div className={\`px-2 py-1 rounded-md font-semibold \${
                                      inq.status === 'برنده' ? 'bg-emerald-100 text-emerald-700' :
                                      inq.status === 'بازنده' ? 'bg-rose-100 text-rose-700' :
                                      inq.status === 'پاسخ داده شده' ? 'bg-sky-100 text-sky-700' :
                                      inq.status === 'لغو شده' ? 'bg-slate-100 text-slate-600' :
                                      inq.status === 'در انتظار پاسخ' ? 'bg-amber-100 text-amber-700' :
                                      'bg-slate-100 text-slate-600'
                                    }\`}>
                                      {inq.status}
                                    </div>
                                    <button 
                                      onClick={() => setExpandedInquiries(prev => ({ ...prev, [inq.id]: !isCardExpanded }))}
                                      className="text-sky-600 hover:text-sky-700 font-medium hover:bg-sky-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                    >
                                      {isCardExpanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}
                                      {isCardExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Details */}
                                {isCardExpanded && (
                                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                      {inq.status === 'در انتظار پاسخ' && (
                                        <button
                                          onClick={() => {
                                            setActiveInquiryForAnswer(inq);
                                          }}
                                          className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-emerald-600 transition flex items-center gap-1 flex-1 justify-center"
                                        >
                                          <CheckCircle2 size={14} />
                                          ثبت پاسخ سازنده
                                        </button>
                                      )}

                                      {(!inq.isWinner && inq.status !== 'لغو شده') && (
                                        <button
                                          onClick={() => {
                                            if (confirm('آیا مطمئن هستید که این تامین‌کننده به عنوان برنده انتخاب شود؟')) {
                                              handleSetWinner(inq.id);
                                            }
                                          }}
                                          className="bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold px-3 py-1.5 rounded hover:bg-sky-100 transition flex items-center gap-1 flex-1 justify-center"
                                        >
                                          <Award size={14} />
                                          انتخاب به عنوان برنده
                                        </button>
                                      )}
                                      
                                      <button
                                        onClick={() => {
                                          setActiveInquiryForStep(inq.id);
                                        }}
                                        className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded hover:bg-slate-50 transition flex items-center gap-1 flex-1 justify-center"
                                      >
                                        <Plus size={14} />
                                        ثبت اقدام جدید
                                      </button>
                                    </div>

                                    {/* Files */}
                                    {(inq.technicalProposalFile || inq.financialProposalFile) && (
                                      <div className="space-y-2">
                                        <h5 className="text-[11px] font-bold text-slate-700">فایل‌های پیوست</h5>
                                        <div className="flex flex-col gap-1.5">
                                          {inq.technicalProposalFile && (
                                            <a href={inq.technicalProposalFileUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] sm:text-xs text-sky-600 bg-sky-50 hover:bg-sky-100 p-1.5 sm:p-2 rounded-lg transition-colors overflow-hidden">
                                              <FileText size={14} className="shrink-0" />
                                              <span className="truncate" title={inq.technicalProposalFile}>فنی: {inq.technicalProposalFile}</span>
                                            </a>
                                          )}
                                          {inq.financialProposalFile && (
                                            <a href={inq.financialProposalFileUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 sm:p-2 rounded-lg transition-colors overflow-hidden">
                                              <FileSpreadsheet size={14} className="shrink-0" />
                                              <span className="truncate" title={inq.financialProposalFile}>مالی: {inq.financialProposalFile}</span>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Steps Timeline */}
                                    <div className="space-y-2">
                                      <h5 className="text-[11px] font-bold text-slate-700">تاریخچه اقدامات</h5>
                                      <div className="space-y-3 relative before:absolute before:inset-y-0 before:right-[7px] before:w-[2px] before:bg-slate-200">
                                        {inq.steps.map(step => (
                                          <div key={step.id} className="relative pr-6">
                                            <div className={\`absolute right-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center \${
                                              step.type === 'creation' ? 'bg-slate-400' :
                                              step.type === 'sent' ? 'bg-sky-500' :
                                              step.type === 'response' ? 'bg-emerald-500' :
                                              step.type === 'winner' ? 'bg-amber-400' :
                                              'bg-indigo-400'
                                            }\`}></div>
                                            <div className="bg-white border border-slate-100 p-2 sm:p-3 rounded-xl shadow-sm">
                                              <div className="flex justify-between items-start gap-2 mb-1 sm:mb-1.5">
                                                <span className="text-[10px] sm:text-xs font-bold text-slate-700">{step.title}</span>
                                                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 shrink-0">{step.date}</span>
                                              </div>
                                              <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Delete/Edit Buttons */}
                                    <div className="flex justify-between pt-2 border-t border-slate-200">
                                      <button
                                        onClick={() => {
                                          setDeleteInquiryId(inq.id);
                                          setDeleteActivitiesWithInquiry(true);
                                        }}
                                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded transition"
                                        title="حذف"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingInquiry(inq);
                                          setEditProjectId(inq.projectId || '');
                                          setEditProformaId(inq.proformaId || '');
                                          setEditProformaItemId(inq.proformaItemId || '');
                                          setEditSupplierId(inq.supplierId);
                                          setEditInquiryDate(inq.inquiryDate);
                                          setEditPriceRIYAL(inq.priceRIYAL || 0);
                                          setEditPriceForeign(inq.priceForeign || 0);
                                          setEditCurrency(inq.currency || 'یورو');
                                          setEditDeliveryTime(inq.deliveryTime || '');
                                          setEditTechFileName(inq.technicalProposalFile || '');
                                          setEditFinFileName(inq.financialProposalFile || '');
                                          setEditTechFileSize(inq.technicalProposalFileSize || '');
                                          setEditFinFileSize(inq.financialProposalFileSize || '');
                                          setEditTechFileUrl(inq.technicalProposalFileUrl || '');
                                          setEditFinFileUrl(inq.financialProposalFileUrl || '');
                                          setEditItems(inq.items || []);
                                          setEditNotes(inq.notes || '');
                                          setEditStatus(inq.status);
                                        }}
                                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded transition"
                                        title="ویرایش"
                                      >
                                        <Edit size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGISTER NEW INQUIRY */}`;

code = code.replace(regexList, newListView);
fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
