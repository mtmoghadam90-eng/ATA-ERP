import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckSquare, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Edit, 
  Trash2, 
  User, 
  Calendar,
  X,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { Task, Customer, Project, ERPSettings } from '../types';
import { getTodayShamsi } from '../dateUtils';
import ShamsiDatePicker from './ShamsiDatePicker';
import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsDetailView from './CustomFieldsDetailView';
import QuickAddModal from './QuickAddModal';

interface TasksViewProps {
  tasks: Task[];
  customers: Customer[];
  projects: Project[];
  addTask: (task: Omit<Task, 'id'> & { customValues?: Record<string, any> }) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  settings: ERPSettings;
  currentUser?: { fullName: string; role?: string } | null;
  addCustomer?: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addProject?: (project: Omit<Project, 'id' | 'code' | 'creationDate'>) => Project;
}

export default function TasksView({
  tasks,
  customers,
  projects,
  addTask,
  updateTask,
  deleteTask,
  settings,
  currentUser,
  addCustomer,
  addProject
}: TasksViewProps) {
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'customer' | 'project' | 'supplier' | 'product' | null>(null);

  // Dynamic Custom Fields State
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [relatedToType, setRelatedToType] = useState<Task['relatedToType']>('عمومی');
  const [relatedToId, setRelatedToId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('متوسط');
  const [dueDate, setDueDate] = useState(getTodayShamsi());
  const [assignedTo, setAssignedTo] = useState(currentUser?.fullName || 'محمد توکل مقدم');
  const [status, setStatus] = useState<Task['status']>('در انتظار');

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setRelatedToType('عمومی');
    setRelatedToId('');
    setPriority('متوسط');
    setDueDate(getTodayShamsi());
    setAssignedTo(currentUser?.fullName || 'محمد توکل مقدم');
    setStatus('در انتظار');
    setCustomValues({});
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Fields Validation
    const moduleFields = (settings?.customFields || []).filter(f => f.module === 'tasks');
    for (const field of moduleFields) {
      if (field.required) {
        const val = customValues[field.id];
        if (val === undefined || val === null || val === '') {
          alert(`لطفاً فیلد سفارشی اجباری "${field.name}" را تکمیل کنید.`);
          return;
        }
      }
    }
    
    let resolvedRelatedName = '';
    if (relatedToType === 'مشتری') {
      resolvedRelatedName = customers.find(c => c.id === relatedToId)?.companyName || '';
    } else if (relatedToType === 'پروژه') {
      resolvedRelatedName = projects.find(p => p.id === relatedToId)?.name || '';
    }

    addTask({
      title,
      description,
      relatedToType,
      relatedToId: relatedToId || undefined,
      relatedToName: relatedToId ? resolvedRelatedName : undefined,
      priority,
      dueDate,
      assignedTo,
      status,
      customValues
    });

    setShowModal(false);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask({
      ...task,
      status: task.status === 'انجام شده' ? 'در انتظار' : 'انجام شده'
    });
  };

  const getPriorityClass = (pr: Task['priority']) => {
    switch (pr) {
      case 'فوری': return 'bg-red-50 text-red-700 border border-red-200';
      case 'بالا': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'متوسط': return 'bg-sky-50 text-sky-700 border border-sky-200';
      default: return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const getStatusBadge = (st: Task['status']) => {
    switch (st) {
      case 'انجام شده': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'در حال انجام': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'کنسل شده': return 'bg-slate-100 text-slate-500 border border-slate-200';
      default: return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.relatedToName && t.relatedToName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">وظایف کاری و پیگیری‌ها</h1>
          <p className="text-slate-500 text-sm mt-1">برنامه‌ریزی، تخصیص کارها و یادآوری اقدامات تجاری و بازرگانی برای اعضای تیم</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center gap-2"
        >
          <Plus size={16} />
          ثبت پیگیری / یادداشت جدید
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="جستجو در عنوان پیگیری، مخاطب یا شرح وظیفه..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
          />
        </div>

        <div className="relative w-full md:w-64 flex items-center gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="فوری">فوری</option>
            <option value="بالا">اولویت بالا</option>
            <option value="متوسط">اولویت متوسط</option>
            <option value="پایین">اولویت پایین</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition ${
              task.status === 'انجام شده' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1 w-full">
              {/* Checkbox */}
              <button
                onClick={() => handleToggleComplete(task)}
                className={`mt-1 rounded-md flex items-center justify-center border transition flex-shrink-0 ${
                  task.status === 'انجام شده' 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 hover:border-sky-500 w-5 h-5'
                }`}
              >
                {task.status === 'انجام شده' && <CheckCircle2 size={14} />}
              </button>
              
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className={`font-bold text-sm leading-snug break-words ${task.status === 'انجام شده' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 break-words">{task.description}</p>
                
                {task.relatedToName && (
                  <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-medium inline-block mt-1 max-w-full truncate">
                    مربوط به {task.relatedToType}: {task.relatedToName}
                  </span>
                )}

                {/* Dynamic Custom Fields Read-Only View */}
                <CustomFieldsDetailView
                  module="tasks"
                  customFields={settings?.customFields || []}
                  customValues={task.customValues}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end text-xs pt-3 md:pt-0 border-t border-slate-100 md:border-t-0">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityClass(task.priority)}`}>
                اولویت: {task.priority}
              </span>

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                وضعیت: {task.status}
              </span>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono bg-slate-50 px-2 py-1 rounded border">
                <Calendar size={12} />
                <span>سررسید: {task.dueDate}</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-sans bg-slate-50 px-2 py-1 rounded border">
                <User size={12} />
                <span>مسئول: {task.assignedTo}</span>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition mr-auto md:mr-0"
                title="حذف وظیفه"
              >
                <Trash2 size={14} />
              </button>
            </div>

          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <ListTodo className="mx-auto text-slate-300 mb-2" size={40} />
            وظیفه فعالی یافت نشد.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-in flex flex-col my-4 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">تعریف وظیفه و یادداشت پیگیری</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition" title="بستن فرم">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-right overflow-y-auto flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">عنوان وظیفه / پیگیری بازرگانی *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: ارسال اصلاحیه پروفرما به مهندسی مپنا"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">شرح جزئیات اقدام درخواستی</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="جزئیات استعلام قیمت ارزی، شرایط پرداخت توافق شده..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                  />
                </div>

                {/* Relation Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">مرتبط با ماژول</label>
                  <select
                    value={relatedToType}
                    onChange={(e) => setRelatedToType(e.target.value as Task['relatedToType'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    <option value="عمومی">عمومی (فاقد مرجع)</option>
                    <option value="مشتری">مشتریان</option>
                    <option value="پروژه">پروژه‌ها و مناقصات</option>
                  </select>
                </div>

                {/* Linked Target select */}
                {relatedToType === 'مشتری' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">مشتری هدف *</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={relatedToId}
                        onChange={(e) => setRelatedToId(e.target.value)}
                        required
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب مشتری --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.companyName}</option>
                        ))}
                      </select>
                      {addCustomer && (
                        <button
                          type="button"
                          onClick={() => setQuickAddType('customer')}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center font-bold"
                          title="تعریف سریع مشتری جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {relatedToType === 'پروژه' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">پروژه هدف *</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={relatedToId}
                        onChange={(e) => setRelatedToId(e.target.value)}
                        required
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب پروژه --</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                        ))}
                      </select>
                      {addProject && (
                        <button
                          type="button"
                          onClick={() => setQuickAddType('project')}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center font-bold"
                          title="تعریف سریع پروژه جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {relatedToType === 'عمومی' && <div className="hidden" />}

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">درجه اولویت</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    <option value="پایین">پایین (Low)</option>
                    <option value="متوسط">متوسط (Medium)</option>
                    <option value="بالا">بالا (High)</option>
                    <option value="فوری">فوری (Urgent) 🚨</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1.5" id="task-due-date-picker-wrapper">
                  <ShamsiDatePicker
                    label="مهلت انجام (سررسید)"
                    required
                    value={dueDate}
                    onChange={(val) => setDueDate(val)}
                  />
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">ارجاع کار به همکار</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    {(settings.dropdownItems?.salesExperts || ['محمد توکل مقدم', 'آنتونی فیرو', 'مهندس حسینی']).map((exp, idx) => (
                      <option key={idx} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Dynamic Custom Fields Form Section */}
              <div className="border-t border-slate-100 pt-5">
                <CustomFieldsForm
                  module="tasks"
                  customFields={settings?.customFields || []}
                  customValues={customValues}
                  onChange={setCustomValues}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15"
                >
                  افزودن به تقویم پیگیری
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {quickAddType && (
        <QuickAddModal
          isOpen={!!quickAddType}
          onClose={() => setQuickAddType(null)}
          type={quickAddType}
          settings={settings}
          customers={customers}
          addCustomer={addCustomer}
          addProject={addProject}
          onSuccess={(newEntity) => {
            if (newEntity && newEntity.id) {
              setRelatedToId(newEntity.id);
            }
          }}
        />
      )}

    </div>
  );
}
