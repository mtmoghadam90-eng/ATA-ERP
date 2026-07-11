with open("src/components/ProformasView.tsx", "r") as f:
    content = f.read()

# 1. Add the column header
header_target = """                        <th className="p-4 text-center w-36">وضعیت ارسال</th>
                        <th className="p-4 text-center w-60">عملیات مدیریت</th>"""

header_replacement = """                        <th className="p-4 text-center w-36">وضعیت ارسال</th>
                        <th className="p-4 text-center w-32">وضعیت پیش‌فاکتور</th>
                        <th className="p-4 text-center w-60">عملیات مدیریت</th>"""

content = content.replace(header_target, header_replacement)

# 2. Add the column cell
row_target = """                          {/* Status Badge */}
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${getStatusColor(pf.status)}`}>
                                {pf.status}
                              </span>
                              {pf.lossReason && (
                                <span className="text-[9px] text-red-500 max-w-xs font-bold bg-red-50 px-1 py-0.5 rounded border border-red-100" title="علت باخت">
                                  علت: {pf.lossReason}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Actions */}"""

row_replacement = """                          {/* Status Badge */}
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${getStatusColor(pf.status)}`}>
                                {pf.status}
                              </span>
                              {pf.lossReason && (
                                <span className="text-[9px] text-red-500 max-w-xs font-bold bg-red-50 px-1 py-0.5 rounded border border-red-100" title="علت باخت">
                                  علت: {pf.lossReason}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Computed Status Badge */}
                          <td className="p-4 text-center">
                            {(() => {
                               const items = pf.items || [];
                               if (items.length === 0) return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-slate-100 text-slate-600 border-slate-200">بررسی نشده</span>;
                               const wonCount = items.filter(i => i.status === 'برنده').length;
                               const lostCount = items.filter(i => i.status === 'بازنده').length;
                               
                               if (wonCount === items.length) return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10">برنده</span>;
                               if (lostCount === items.length) return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10">بازنده</span>;
                               if (wonCount > 0) return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/10">نیمه برنده</span>;
                               if (lostCount > 0) return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-orange-50 text-orange-700 border-orange-200">نیمه بازنده</span>;
                               return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-sky-50 text-sky-700 border-sky-200">جاری</span>;
                            })()}
                          </td>
                          {/* Actions */}"""

content = content.replace(row_target, row_replacement)

with open("src/components/ProformasView.tsx", "w") as f:
    f.write(content)

