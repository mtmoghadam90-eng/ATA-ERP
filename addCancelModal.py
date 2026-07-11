with open('src/components/ProformasView.tsx', 'r') as f:
    content = f.read()

state_vars = """  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [proformaToDeleteId, setProformaToDeleteId] = useState<string | null>(null);
  const [proformaToDeleteNumber, setProformaToDeleteNumber] = useState<string>('');
  
  // Cancel all confirm state
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelProjectId, setCancelProjectId] = useState('');
  const [cancelProjectName, setCancelProjectName] = useState('');"""

content = content.replace("  // Delete confirm state\n  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);\n  const [proformaToDeleteId, setProformaToDeleteId] = useState<string | null>(null);\n  const [proformaToDeleteNumber, setProformaToDeleteNumber] = useState<string>('');", state_vars)

modal_code = """      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProformaToDeleteId(null);
          setProformaToDeleteNumber('');
        }}
        onConfirm={() => {
          if (proformaToDeleteId) {
            deleteProforma(proformaToDeleteId);
          }
        }}
        title="حذف پیش‌فاکتور"
        message={`آیا از حذف پیش‌فاکتور "${proformaToDeleteNumber}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />
      
      {/* Confirm Cancel All Modal */}
      <ConfirmModal
        isOpen={cancelConfirmOpen}
        onClose={() => {
          setCancelConfirmOpen(false);
          setCancelProjectId('');
          setCancelProjectName('');
        }}
        onConfirm={() => {
          if (cancelProjectId) {
            batchUpdateProjectProformasStatus(cancelProjectId, 'لغو شده');
            setCancelConfirmOpen(false);
          }
        }}
        title="لغو تمام نسخه‌ها"
        message={`آیا از لغو تمام نسخه‌های پیش‌فاکتور مربوط به پروژه "${cancelProjectName}" اطمینان دارید؟`}
        confirmText="بله، لغو شود"
      />"""

content = content.replace("""      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProformaToDeleteId(null);
          setProformaToDeleteNumber('');
        }}
        onConfirm={() => {
          if (proformaToDeleteId) {
            deleteProforma(proformaToDeleteId);
          }
        }}
        title="حذف پیش‌فاکتور"
        message={`آیا از حذف پیش‌فاکتور "${proformaToDeleteNumber}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />""", modal_code)

buttons_code = """                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelProjectId(project.id);
                          setCancelProjectName(project.name);
                          setCancelConfirmOpen(true);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 hover:border-amber-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="لغو تمام نسخه‌های پیش‌فاکتور این پروژه"
                      >
                        <Ban size={10} />
                        لغو تمام نسخه‌ها
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBulkModal(project.id, project.name);
                        }}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="ثبت باخت کلی تمام نسخه‌های پیش‌فاکتور این پروژه"
                      >
                        <XCircle size={10} />
                        ثبت باخت تمام نسخه‌ها
                      </button>"""

content = content.replace("""                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBulkModal(project.id, project.name);
                        }}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="ثبت باخت کلی تمام نسخه‌های پیش‌فاکتور این پروژه"
                      >
                        <XCircle size={10} />
                        ثبت باخت تمام نسخه‌ها
                      </button>""", buttons_code)

content = content.replace("import { Plus, X, Pencil, Trash2, Printer, Search, ArrowLeft, Building2, UserCircle, Briefcase, Calendar, ChevronDown, CheckCircle2, AlertTriangle, FileText, ChevronLeft, MapPin, Phone, Mail, Package, FileSignature, XCircle, CheckSquare, Save } from 'lucide-react';", "import { Plus, X, Pencil, Trash2, Printer, Search, ArrowLeft, Building2, UserCircle, Briefcase, Calendar, ChevronDown, CheckCircle2, AlertTriangle, FileText, ChevronLeft, MapPin, Phone, Mail, Package, FileSignature, XCircle, CheckSquare, Save, Ban } from 'lucide-react';")

with open('src/components/ProformasView.tsx', 'w') as f:
    f.write(content)
