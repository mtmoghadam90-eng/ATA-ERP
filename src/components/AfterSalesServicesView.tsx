import React, { useState, useMemo } from 'react';
import { AfterSalesService, Project, Proforma, User, ERPSettings } from '../types';
import { 
  Wrench, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { getTodayShamsi } from '../dateUtils';
import ShamsiDatePicker from './ShamsiDatePicker';

interface AfterSalesServicesViewProps {
  afterSalesServices: AfterSalesService[];
  projects: Project[];
  proformas: Proforma[];
  addAfterSalesService: (service: Omit<AfterSalesService, 'id' | 'createdAt'>) => void;
  updateAfterSalesService: (service: AfterSalesService) => void;
  deleteAfterSalesService: (id: string, deleteLogs?: boolean) => void;
  settings: ERPSettings;
  currentUser: User | null;
}

export default function AfterSalesServicesView({
  afterSalesServices,
  projects,
  proformas,
  addAfterSalesService,
  updateAfterSalesService,
  deleteAfterSalesService,
  settings,
  currentUser
}: AfterSalesServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AfterSalesService | null>(null);
  
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProformaNumber, setSelectedProformaNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [startDate, setStartDate] = useState(getTodayShamsi());
  const [endDate, setEndDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState<AfterSalesService['status']>('در حال بررسی');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [deleteActivitiesWithService, setDeleteActivitiesWithService] = useState(true);

  const resetForm = () => {
    setEditingService(null);
    setSelectedProjectId('');
    setSelectedProformaNumber('');
    setItemName('');
    setIssueDescription('');
    setActionsTaken('');
    setStartDate(getTodayShamsi());
    setEndDate('');
    setReturnDate('');
    setStatus('در حال بررسی');
  };

  const handleOpenModal = (service?: AfterSalesService) => {
    if (service) {
      setEditingService(service);
      setSelectedProjectId(service.projectId);
      setSelectedProformaNumber(service.proformaNumber || '');
      setItemName(service.itemName);
      setIssueDescription(service.issueDescription);
      setActionsTaken(service.actionsTaken);
      setStartDate(service.startDate);
      setEndDate(service.endDate || '');
      setReturnDate(service.returnDate || '');
      setStatus(service.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProjectId || !itemName || !issueDescription) {
      alert('لطفاً فیلدهای ضروری (پروژه، نام کالا/خدمات، مشکل/دلیل برگشت) را پر کنید.');
      return;
    }

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    const serviceData = {
      projectId: selectedProjectId,
      projectName: project.name,
      proformaNumber: selectedProformaNumber || undefined,
      itemName,
      issueDescription,
      actionsTaken,
      startDate,
      endDate: endDate || undefined,
      returnDate: returnDate || undefined,
      status,
      createdBy: currentUser?.fullName || 'سیستم'
    };

    if (editingService) {
      updateAfterSalesService({
        ...editingService,
        ...serviceData
      });
    } else {
      addAfterSalesService(serviceData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const filteredServices = useMemo(() => {
    return afterSalesServices.filter(s => {
      const matchesSearch = 
        s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.proformaNumber && s.proformaNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [afterSalesServices, searchTerm, statusFilter]);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'در حال بررسی': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'در حال تعمیر/خدمات': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'تکمیل شده': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'تحویل داده شده': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const selectedProjectProformas = useMemo(() => {
    if (!selectedProjectId) return [];
    return proformas.filter(p => p.projectId === selectedProjectId);
  }, [selectedProjectId, proformas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl">
              <Wrench className="text-indigo-600" size={24} />
            </div>
            خدمات پس از فروش
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            مدیریت کالاها و تجهیزات برگشتی، تعمیرات و خدمات پس از فروش پروژه‌ها
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>ثبت خدمات جدید</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="جستجو در خدمات (نام پروژه، نام کالا، شماره پیش‌فاکتور)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-700 min-w-[200px]"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="در حال بررسی">در حال بررسی</option>
          <option value="در حال تعمیر/خدمات">در حال تعمیر/خدمات</option>
          <option value="تکمیل شده">تکمیل شده</option>
          <option value="تحویل داده شده">تحویل داده شده</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(service.status)} mb-2`}>
                    {service.status}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg">{service.itemName}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setServiceToDelete(service.id);
                      setDeleteActivitiesWithService(true);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-6 flex justify-center text-slate-400"><Briefcase size={16} /></div>
                  <span className="font-bold">{service.projectName}</span>
                </div>
                {service.proformaNumber && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-6 flex justify-center text-slate-400"><FileText size={16} /></div>
                    <span className="font-mono">{service.proformaNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-6 flex justify-center text-slate-400"><Calendar size={16} /></div>
                  <span>تاریخ شروع: <span className="font-mono">{service.startDate}</span></span>
                </div>
                {(service.endDate || service.returnDate) && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-6 flex justify-center text-slate-400"><CheckCircle2 size={16} /></div>
                    <span>
                      {service.returnDate ? `تحویل: ${service.returnDate}` : `پایان: ${service.endDate}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 p-4 bg-slate-50 rounded-xl space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 font-bold block mb-1">دلیل برگشت/مشکل:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{service.issueDescription}</p>
                </div>
                {service.actionsTaken && (
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">اقدامات انجام شده:</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{service.actionsTaken}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>ثبت کننده: {service.createdBy}</span>
              <span className="font-mono">{service.createdAt.split(' ')[0]}</span>
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <Wrench className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-600 mb-2">هیچ رکورد خدمات پس از فروش یافت نشد</h3>
            <p className="text-slate-500 text-sm">برای ثبت خدمات جدید روی دکمه «ثبت خدمات جدید» کلیک کنید.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Wrench className="text-indigo-500" size={20} />
                {editingService ? 'ویرایش خدمات پس از فروش' : 'ثبت خدمات پس از فروش جدید'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">پروژه (مشتری) <span className="text-red-500">*</span></label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    required
                  >
                    <option value="">انتخاب پروژه...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">پیش‌فاکتور مرجع (اختیاری)</label>
                  <select
                    value={selectedProformaNumber}
                    onChange={(e) => setSelectedProformaNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium font-mono"
                    disabled={!selectedProjectId}
                  >
                    <option value="">انتخاب پیش‌فاکتور...</option>
                    {selectedProjectProformas.map(p => (
                      <option key={p.id} value={p.proformaNumber}>{p.proformaNumber}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">نام کالا یا خدمات درخواستی <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    placeholder="مثال: سنسور دما PT100"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">مشکل / دلیل برگشت <span className="text-red-500">*</span></label>
                  <select
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                    required
                  >
                    <option value="">انتخاب کنید...</option>
                    {settings.dropdownItems?.returnReasons?.map((reason, idx) => (
                      <option key={idx} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">اقدامات انجام شده</label>
                  <textarea
                    value={actionsTaken}
                    onChange={(e) => setActionsTaken(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium min-h-[100px] resize-y"
                    placeholder="شرح اقداماتی که برای رفع مشکل انجام شده است (تعمیر، تعویض، تنظیم مجدد و ...)"
                  />
                </div>

                <div className="space-y-2">
                  <ShamsiDatePicker
                    label="تاریخ دریافت کالا / شروع خدمات"
                    value={startDate}
                    onChange={(val) => setStartDate(val)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">وضعیت <span className="text-red-500">*</span></label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                    required
                  >
                    <option value="در حال بررسی">در حال بررسی</option>
                    <option value="در حال تعمیر/خدمات">در حال تعمیر/خدمات</option>
                    <option value="تکمیل شده">تکمیل شده</option>
                    <option value="تحویل داده شده">تحویل داده شده</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <ShamsiDatePicker
                    label="تاریخ پایان تعمیرات (تکمیل شده)"
                    value={endDate}
                    onChange={(val) => setEndDate(val)}
                    disabled={status === 'در حال بررسی' || status === 'در حال تعمیر/خدمات'}
                  />
                </div>

                <div className="space-y-2">
                  <ShamsiDatePicker
                    label="تاریخ تحویل مجدد به مشتری"
                    value={returnDate}
                    onChange={(val) => setReturnDate(val)}
                    disabled={status !== 'تحویل داده شده'}
                  />
                </div>

              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-bold"
                >
                  {editingService ? 'ذخیره تغییرات' : 'ثبت خدمات پس از فروش'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (serviceToDelete) {
            deleteAfterSalesService(serviceToDelete, deleteActivitiesWithService);
            setIsDeleteModalOpen(false);
          }
        }}
        title="حذف رکورد خدمات پس از فروش"
        message="آیا از حذف این رکورد خدمات پس از فروش اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
      >
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
          <input
            type="checkbox"
            id="deleteActivitiesWithService"
            checked={deleteActivitiesWithService}
            onChange={(e) => setDeleteActivitiesWithService(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="deleteActivitiesWithService" className="text-xs text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
            حذف لاگ‌های فعالیت پروژه مرتبط با این رکورد خدمات پس از فروش (در دسته‌بندی خدمات پس از فروش)
          </label>
        </div>
      </ConfirmModal>

    </div>
  );
}
