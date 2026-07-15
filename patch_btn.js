import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

// Replace all delete buttons that use Trash2
code = code.replace(/<button(\s+onClick=\{[^\}]+\}\s+className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1\.5 rounded-lg transition-colors shrink-0"\s+title="حذف فایل"\s*>)/g, '<button type="button"$1');

// there is another trash button inside table:
// <button type="button" onClick={() => { ...  <Trash2 size={16} />  </button>
// It already has type="button"

// Wait, let's just make sure all <button> tags with "Trash2" inside them and no "type=" have type="button"
// I will just replace the exact tags.
const regex = /<button(\s+onClick=\{[^\}]+\}\s+className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1\.5 rounded-lg transition-colors shrink-0"\s+title="حذف فایل"\s*>)/g;
code = code.replace(regex, '<button type="button"$1');

// What about `<button onClick={() => { setEditingInquiry(null); setIsEditInquiryFullscreen(false); onClearInitialPrintDocId?.(); }}`?
code = code.replace(/<button\s+onClick=\{\(\) => \{ setEditingInquiry\(null\);/g, '<button type="button" onClick={() => { setEditingInquiry(null);');

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
