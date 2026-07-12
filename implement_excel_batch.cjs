const fs = require('fs');
let code = fs.readFileSync('src/components/ProductsView.tsx', 'utf8');

// 1. Add import for * as XLSX from 'xlsx'
code = code.replace(
  `import { uploadFile } from '../imageUtils';`,
  `import { uploadFile } from '../imageUtils';\nimport * as XLSX from 'xlsx';`
);

// 2. Add state for batch upload modal
code = code.replace(
  `  // Stock adjust modal state`,
  `  // Batch upload modal state
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);

  // Stock adjust modal state`
);

// 3. Add handleDownloadTemplate function
const templateFunc = `
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "کد کالا": "EQ-12345", "تعداد تغییر": 10, "نوع تغییر": "IN", "توضیحات": "خرید جدید" },
      { "کد کالا": "EQ-67890", "تعداد تغییر": 5, "نوع تغییر": "OUT", "توضیحات": "مصرف پروژه" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory_Template");
    XLSX.writeFile(wb, "Batch_Inventory_Template.xlsx");
  };

  const handleProcessBatch = async () => {
    if (!batchFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        let successCount = 0;
        jsonData.forEach(row => {
          const code = row["کد کالا"];
          let amt = Number(row["تعداد تغییر"]);
          const type = row["نوع تغییر"];
          const notes = row["توضیحات"] || "ویرایش گروهی";

          if (code && !isNaN(amt) && amt > 0) {
            const product = products.find(p => p.code === code);
            if (product && product.supplyType !== 'ORDER') {
              if (type === 'OUT' || type === 'out') {
                if ((product.stockLevel || 0) < amt) {
                  // Not enough stock, skip or force? Let's skip.
                  return;
                }
                amt = -amt;
              }
              adjustProductStock(product.id, amt, undefined, 'MANUAL', notes);
              successCount++;
            }
          }
        });
        
        alert(\`عملیات موفقیت آمیز بود. \${successCount} کالا بروزرسانی شد.\`);
        setBatchModalOpen(false);
        setBatchFile(null);
      } catch (err) {
        alert('خطا در پردازش فایل اکسل');
      }
    };
    reader.readAsArrayBuffer(batchFile);
  };
`;
code = code.replace(
  `  const handleSave = (e: React.FormEvent) => {`,
  templateFunc + `\n  const handleSave = (e: React.FormEvent) => {`
);

// 4. Add the button in the header
code = code.replace(
  `            <button
              onClick={handleOpenAdd}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} />
              تعریف تجهیز جدید
            </button>`,
  `            <div className="flex gap-2">
              <button
                onClick={() => { setBatchFile(null); setBatchModalOpen(true); }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/20"
              >
                <Package size={18} />
                ورود/خروج گروهی
              </button>
              <button
                onClick={handleOpenAdd}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                <Plus size={18} />
                تعریف تجهیز جدید
              </button>
            </div>`
);

// 5. Add Batch Modal JSX
const batchModalJSX = `
      {/* Batch Upload Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                ورود و خروج گروهی با اکسل
              </h3>
              <button 
                onClick={() => setBatchModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                برای ویرایش گروهی موجودی انبار، ابتدا فایل نمونه را دانلود کرده و مقادیر را وارد کنید. 
                دقت کنید <strong>نوع تغییر</strong> باید مقدار <code>IN</code> برای ورود به انبار و <code>OUT</code> برای خروج از انبار باشد.
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition text-sm flex items-center gap-2"
                >
                  دانلود قالب اکسل
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">آپلود فایل تکمیل شده</label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleProcessBatch}
                  disabled={!batchFile}
                  className="flex-1 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-500/20"
                >
                  پردازش و اعمال تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `      {/* Confirm Delete Modal */}`,
  batchModalJSX + `\n      {/* Confirm Delete Modal */}`
);

fs.writeFileSync('src/components/ProductsView.tsx', code);
