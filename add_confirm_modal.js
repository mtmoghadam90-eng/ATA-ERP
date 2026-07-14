import fs from 'fs';

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// Add state for groupToDelete
const stateIndex = content.indexOf('  const [showModal, setShowModal] = useState(false);');
if (stateIndex === -1) {
  console.log('Not found stateIndex!');
  process.exit(1);
}

const newState = `
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
`;

content = content.slice(0, stateIndex) + newState + content.slice(stateIndex);

// Replace the window.confirm logic
const confirmRegex = /if \(window\.confirm\('آیا از حذف این دسته فعالیت و تمام سوابق آن اطمینان دارید\؟ این عمل غیرقابل بازگشت است\.'\)\) \{\s*if \(deleteProjectCategoryGroup\) \{\s*deleteProjectCategoryGroup\(group\.id\);\s*\}\s*\}/g;

content = content.replace(confirmRegex, `setGroupToDelete(group.id);`);

// Add the modal component at the end of the return statement
// Find the last closing div
const lastDivIndex = content.lastIndexOf('</div>\n    </div>\n  );\n}');
if (lastDivIndex === -1) {
  console.log('Not found lastDivIndex!');
  process.exit(1);
}

const modalCode = `
      {/* Delete Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-600">
                <Trash2 size={20} />
                <h3 className="font-extrabold text-sm">حذف دسته فعالیت</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                آیا از حذف این دسته فعالیت و تمام سوابق آن اطمینان دارید؟ این عمل غیرقابل بازگشت است.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setGroupToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteProjectCategoryGroup && groupToDelete) {
                    deleteProjectCategoryGroup(groupToDelete);
                  }
                  setGroupToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.slice(0, lastDivIndex) + modalCode + content.slice(lastDivIndex);

fs.writeFileSync('src/components/ProjectsView.tsx', content);
console.log('Added confirm modal');
