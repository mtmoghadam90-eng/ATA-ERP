import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

const oldBtns = `                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">`;

const newBtns = `                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                      {inq.status === 'پیش‌نویس' && (
                                        <button
                                          onClick={() => {
                                            setActiveInquiryForSent(inq);
                                          }}
                                          className="bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-sky-600 transition flex items-center gap-1 flex-1 justify-center"
                                        >
                                          <Send size={14} />
                                          ثبت ارسال استعلام
                                        </button>
                                      )}`;

code = code.replace(oldBtns, newBtns);
fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
