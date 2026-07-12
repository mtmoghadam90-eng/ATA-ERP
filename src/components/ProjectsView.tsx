import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  X,
  Target,
  FileSpreadsheet,
  Clock,
  Sliders,
  User,
  Paperclip,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  MessageSquare,
  Calendar,
  History,
  Check
} from 'lucide-react';
import { Project, Customer, ERPSettings, Product, Proforma, ProjectCategoryGroup, ProjectActivity, User as ERPUser } from '../types';
import { getTodayShamsi } from '../dateUtils';
import { getProformaOutcomeStatus } from '../useERPStore';
import ShamsiDatePicker from './ShamsiDatePicker';
import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsDetailView from './CustomFieldsDetailView';
import { exportToCSV } from '../excelUtils';
import ConfirmModal from './ConfirmModal';
import QuickAddModal from './QuickAddModal';
import { compressImage } from '../imageUtils';

interface ProjectsViewProps {
  projects: Project[];
  customers: Customer[];
  products: Product[];
  proformas: Proforma[];
  addProject: (project: Omit<Project, 'id' | 'code' | 'creationDate'> & { customValues?: Record<string, any> }) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  settings: ERPSettings;
  addCustomer?: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addProduct?: (product: Omit<Product, 'id' | 'stockLevel'> & { stockLevel?: number }) => Product;
  projectCategoryGroups?: ProjectCategoryGroup[];
  addProjectCategoryGroup?: (projectId: string, categoryId: string, categoryName: string) => { success: boolean; error?: string; group?: ProjectCategoryGroup };
  addProjectActivity?: (
    projectId: string,
    categoryGroupId: string,
    text: string,
    attachment: { name: string; size: string; content?: string } | null,
    referral: { assignedTo: string; actionRequired: string; assignedBy: string } | null,
    createdBy?: string
  ) => any;
  completeProjectCategoryGroup?: (categoryGroupId: string, createdBy?: string) => void;
  resumeProjectCategoryGroup?: (categoryGroupId: string, createdBy?: string) => void;
  updateProjectActivity?: (projectId: string, categoryGroupId: string, activityId: string, newText: string) => void;
  deleteProjectActivity?: (projectId: string, categoryGroupId: string, activityId: string) => void;
  currentUser?: ERPUser | null;
  users?: ERPUser[];
  initialSelectedProjectId?: string | null;
  onClearInitialSelectedProject?: () => void;
}

export default function ProjectsView({
  projects,
  customers,
  products,
  proformas,
  addProject,
  updateProject,
  deleteProject,
  settings,
  addCustomer,
  addProduct,
  projectCategoryGroups = [],
  addProjectCategoryGroup,
  addProjectActivity,
  completeProjectCategoryGroup,
  resumeProjectCategoryGroup,
  updateProjectActivity,
  deleteProjectActivity,
  currentUser,
  users = [],
  initialSelectedProjectId,
  onClearInitialSelectedProject
}: ProjectsViewProps) {
  const [search, setSearch] = useState('');
  const [colFilters, setColFilters] = useState<Record<string, string>>({});
  const [customFieldFilters, setCustomFieldFilters] = useState<Record<string, string>>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingActivityText, setEditingActivityText] = useState<string>('');


  // Quick Add State
  const [quickAddType, setQuickAddType] = useState<'customer' | 'project' | 'supplier' | 'product' | null>(null);
  const [quickAddCustomerTarget, setQuickAddCustomerTarget] = useState<'customerId' | 'endUser' | 'financialContact' | 'technicalContact' | null>(null);
  const [quickAddProductIndex, setQuickAddProductIndex] = useState<number | null>(null);

  // Activities panel states
  const [selectedProjectForActivities, setSelectedProjectForActivities] = useState<Project | null>(null);

  React.useEffect(() => {
    if (selectedProjectForActivities) {
      const updatedProject = projects.find(p => p.id === selectedProjectForActivities.id);
      if (updatedProject && updatedProject !== selectedProjectForActivities) {
        setSelectedProjectForActivities(updatedProject);
      }
    }
  }, [projects, selectedProjectForActivities]);

  React.useEffect(() => {
    if (initialSelectedProjectId) {
      const proj = projects.find(p => p.id === initialSelectedProjectId);
      if (proj) {
        setSelectedProjectForActivities(proj);
      }
      if (onClearInitialSelectedProject) {
        onClearInitialSelectedProject();
      }
    }
  }, [initialSelectedProjectId, projects, onClearInitialSelectedProject]);
  const [newActivityText, setNewActivityText] = useState<Record<string, string>>({});
  const [newActivityAttachment, setNewActivityAttachment] = useState<Record<string, { name: string; size: string; content?: string } | null>>({});
  const [referralEnabled, setReferralEnabled] = useState<Record<string, boolean>>({});
  const [referralAssignedTo, setReferralAssignedTo] = useState<Record<string, string>>({});
  const [referralAction, setReferralAction] = useState<Record<string, string>>({});
  const [selectedCategoryToCreate, setSelectedCategoryToCreate] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Dynamic Custom Fields State
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [projectToDeleteName, setProjectToDeleteName] = useState<string>('');

  const [activityDeleteConfirmOpen, setActivityDeleteConfirmOpen] = useState(false);
  const [activityToDeleteGroupId, setActivityToDeleteGroupId] = useState<string | null>(null);
  const [activityToDeleteId, setActivityToDeleteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [status, setStatus] = useState<Project['status']>('جدید');
  const [description, setDescription] = useState('');
  const [itemsNeeded, setItemsNeeded] = useState<{ productId: string; name: string; quantity: number }[]>([]);
  const [lossReason, setLossReason] = useState('');

  // Quick Customer Creation States
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [quickCustType, setQuickCustType] = useState<'حقوقی' | 'حقیقی'>('حقوقی');
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustFirstName, setQuickCustFirstName] = useState('');
  const [quickCustLastName, setQuickCustLastName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');
  const [quickCustEmail, setQuickCustEmail] = useState('');
  const [quickCustIndustry, setQuickCustIndustry] = useState('نفت و گاز');
  const [quickCustKeyPerson, setQuickCustKeyPerson] = useState('');
  const [quickCustPosition, setQuickCustPosition] = useState('');

  // New Requested Fields Form State
  const [salesExpert, setSalesExpert] = useState('');
  const [marketingChannel, setMarketingChannel] = useState('');
  const [leadQuality, setLeadQuality] = useState('متوسط');
  const [referrerName, setReferrerName] = useState('');
  const [financialContact, setFinancialContact] = useState('');
  const [technicalContact, setTechnicalContact] = useState('');
  const [communicationMethod, setCommunicationMethod] = useState('تلفن');
  const [opportunityDate, setOpportunityDate] = useState('');
  const [customerInquiryNumber, setCustomerInquiryNumber] = useState('');
  const [winningDate, setWinningDate] = useState('');
  const [agreedDeliveryDate, setAgreedDeliveryDate] = useState('');
  const [endUser, setEndUser] = useState('');
  const [closingDate, setClosingDate] = useState('');

  // Helper to get latest proforma of a project
  const getLatestProformaOfProject = (projectId: string) => {
    const projectProformas = proformas.filter(pf => pf.projectId === projectId);
    if (projectProformas.length === 0) return undefined;
    return [...projectProformas].sort((a, b) => {
      const dateCompare = b.issueDate.localeCompare(a.issueDate);
      if (dateCompare !== 0) return dateCompare;
      return b.id.localeCompare(a.id);
    })[0];
  };

  const getPipelineValue = (projectId: string) => {
    const latest = getLatestProformaOfProject(projectId);
    return latest ? latest.finalAmount : 0;
  };

  const getCustomerDisplayName = (idOrName: string) => {
    const cust = customers.find(c => c.id === idOrName);
    if (!cust) return idOrName;
    return cust.customerType === 'حقوقی' ? cust.companyName : `${cust.firstName || ''} ${cust.lastName || ''}`.trim();
  };

  const getApprovedProformaDeliveryDate = (projectId: string) => {
    const approved = proformas.find(pf => {
      if (pf.projectId !== projectId) return false;
      const outcome = getProformaOutcomeStatus(pf);
      return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده';
    });
    return approved?.deliveryDate;
  };

  // Items lines management helpers
  const handleAddItemLine = () => {
    if (products.length === 0) return;
    const defaultProduct = products[0];
    setItemsNeeded([
      ...itemsNeeded,
      {
        productId: defaultProduct.id,
        name: defaultProduct.displayName,
        quantity: 1
      }
    ]);
  };

  const handleRemoveItemLine = (index: number) => {
    setItemsNeeded(itemsNeeded.filter((_, i) => i !== index));
  };

  const handleItemProductChange = (index: number, prodId: string) => {
    const selectedProd = products.find(p => p.id === prodId);
    if (!selectedProd) return;
    setItemsNeeded(
      itemsNeeded.map((item, i) =>
        i === index
          ? { ...item, productId: prodId, name: selectedProd.displayName }
          : item
      )
    );
  };

  const handleItemQuantityChange = (index: number, qty: number) => {
    setItemsNeeded(
      itemsNeeded.map((item, i) =>
        i === index ? { ...item, quantity: qty } : item
      )
    );
  };

  // Status Change auto updater
  const handleStatusChange = (newStatus: Project['status']) => {
    setStatus(newStatus);
    const today = getTodayShamsi();
    if (newStatus === 'برنده (موفق)' || newStatus === 'نیمه برنده') {
      if (!winningDate) setWinningDate(today);
      if (!closingDate) setClosingDate(today);
      if (!agreedDeliveryDate) setAgreedDeliveryDate(today);
    } else if (newStatus === 'باخته' || newStatus === 'لغو شده') {
      if (!closingDate) setClosingDate(today);
    }
  };

  // Open Add
  const handleOpenAdd = () => {
    setEditingProject(null);
    setName('');
    setCustomerId(customers[0]?.id || '');
    setExpectedCloseDate('');
    setStatus('جدید');
    setDescription('');
    setCustomValues({});
    setItemsNeeded([]);
    setLossReason('');

    // Reset new fields
    setSalesExpert('');
    setMarketingChannel('تماس مستقیم');
    setLeadQuality('متوسط');
    setReferrerName('');
    setFinancialContact('');
    setTechnicalContact('');
    setCommunicationMethod('تلفن');
    setOpportunityDate(getTodayShamsi());
    setCustomerInquiryNumber('');
    setWinningDate('');
    setAgreedDeliveryDate('');
    setEndUser('');
    setClosingDate('');

    setShowModal(true);
  };

  // Open Edit
  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setName(proj.name);
    setCustomerId(proj.customerId);
    setExpectedCloseDate(proj.expectedCloseDate || '');
    setStatus(proj.status);
    setDescription(proj.description);
    setCustomValues(proj.customValues || {});
    setItemsNeeded(proj.itemsNeeded || []);
    setLossReason(proj.lossReason || '');

    // Load new fields
    setSalesExpert(proj.salesExpert || '');
    setMarketingChannel(proj.marketingChannel || 'تماس مستقیم');
    setLeadQuality(proj.leadQuality || 'متوسط');
    setReferrerName(proj.referrerName || '');
    setFinancialContact(proj.financialContact || '');
    setTechnicalContact(proj.technicalContact || '');
    setCommunicationMethod(proj.communicationMethod || 'تلفن');
    setOpportunityDate(proj.opportunityDate || proj.creationDate || getTodayShamsi());
    setCustomerInquiryNumber(proj.customerInquiryNumber || '');
    setWinningDate(proj.winningDate || '');
    setAgreedDeliveryDate(proj.agreedDeliveryDate || '');
    setEndUser(proj.endUser || '');
    setClosingDate(proj.closingDate || '');

    setShowModal(true);
  };

  // Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    // Custom Fields Validation
    const moduleFields = (settings?.customFields || []).filter(f => f.module === 'projects');
    for (const field of moduleFields) {
      if (field.required) {
        const val = customValues[field.id];
        if (val === undefined || val === null || val === '') {
          alert(`لطفاً فیلد سفارشی اجباری "${field.name}" را تکمیل کنید.`);
          return;
        }
      }
    }

    const customerName = customers.find(c => c.id === customerId)?.companyName || 'مشتری نامشخص';
    const data = {
      name,
      customerId,
      customerName,
      expectedCloseDate: expectedCloseDate || undefined,
      status,
      description,
      customValues,
      itemsNeeded,
      lossReason: status === 'باخته' ? lossReason : undefined,
      
      // New Fields
      salesExpert,
      marketingChannel,
      leadQuality,
      referrerName,
      financialContact,
      technicalContact,
      communicationMethod,
      opportunityDate,
      customerInquiryNumber,
      winningDate,
      agreedDeliveryDate,
      endUser,
      closingDate
    };

    if (editingProject) {
      updateProject({
        ...editingProject,
        ...data
      });
    } else {
      addProject(data);
    }
    setShowModal(false);
  };

  // Filter
  const filteredProjects = projects.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    if (!(matchesSearch && matchesStatus)) return false;

    // Custom Fields Filters
    const matchesCustom = (Object.entries(customFieldFilters) as [string, string][]).every(([fieldId, filterValue]) => {
      if (!filterValue) return true;
      const recordValue = p.customValues?.[fieldId] as any;
      if (recordValue === undefined || recordValue === null || recordValue === '') return false;

      const field = settings?.customFields?.find(f => f.id === fieldId);
      if (!field) return true;

      if (field.type === 'boolean') {
        return String(recordValue) === filterValue;
      }
      if (field.type === 'select') {
        return String(recordValue) === filterValue;
      }
      if (field.type === 'file') {
        if (filterValue === 'has_file') {
          return !!(recordValue && recordValue.name);
        } else if (filterValue === 'no_file') {
          return !(recordValue && recordValue.name);
        }
        return true;
      }
      return String(recordValue).toLowerCase().includes(filterValue.toLowerCase());
    });

    if (!matchesCustom) return false;

    // Column-specific filters
    return Object.entries(colFilters).every(([colId, filterValue]) => {
      if (!filterValue) return true;
      const fVal = String(filterValue).toLowerCase();
      if (colId === 'code') {
        return p.code.toLowerCase().includes(fVal);
      }
      if (colId === 'name') {
        return p.name.toLowerCase().includes(fVal);
      }
      if (colId === 'customerName') {
        return p.customerName.toLowerCase().includes(fVal);
      }
      if (colId === 'estimatedValueRIYAL') {
        return String(getPipelineValue(p.id)).toLowerCase().includes(fVal);
      }
      if (colId === 'status') {
        return p.status.toLowerCase().includes(fVal);
      }
      if (colId === 'expectedCloseDate') {
        return (p.expectedCloseDate || '').toLowerCase().includes(fVal);
      }
      return true;
    });
  });

  const handleExportExcel = () => {
    const headers = [
      'کد پروژه',
      'نام پروژه',
      'کارشناس فروش',
      'مشتری پروژه',
      'مصرف‌کننده نهایی',
      'ارزش پایپ‌لاین (ریال)',
      'وضعیت',
      'علت باخت (در صورت باخت)',
      'کانال بازاریابی',
      'کیفیت لید',
      'نام معرف',
      'روش ارتباط',
      'فرد کلیدی مالی',
      'فرد کلیدی فنی',
      'شماره استعلام مشتری',
      'تاریخ ایجاد فرصت',
      'تاریخ برنده شدن',
      'تاریخ توافق‌شده تحویل',
      'تاریخ بسته شدن',
      'موعد مقرر تحویل عمومی',
      'اقلام درخواستی مشتری',
      'توضیحات'
    ];

    const rows = filteredProjects.map(p => [
      p.code,
      p.name,
      p.salesExpert || '',
      p.customerName,
      p.endUser || '',
      getPipelineValue(p.id),
      p.status,
      p.lossReason || '',
      p.marketingChannel || '',
      p.leadQuality || '',
      p.referrerName || '',
      p.communicationMethod || '',
      p.financialContact || '',
      p.technicalContact || '',
      p.customerInquiryNumber || '',
      p.opportunityDate || p.creationDate || '',
      p.winningDate || '',
      p.agreedDeliveryDate || '',
      p.closingDate || '',
      p.expectedCloseDate || '',
      p.itemsNeeded?.map(item => `${item.name} (${item.quantity} عدد)`).join(' - ') || '',
      p.description
    ]);

    exportToCSV('گزارش_پروژه‌ها', headers, rows);
  };

  const getStatusColor = (st: Project['status']) => {
    switch (st) {
      case 'جدید': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'در حال مذاکره': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ارائه پیش‌فاکتور': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'برنده (موفق)': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'باخته': return 'bg-red-50 text-red-700 border-red-200';
      case 'لغو شده': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'نیمه برنده': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">پروژه‌ها و مناقصات تجاری</h1>
          <p className="text-slate-500 text-sm mt-1">رهگیری مناقصات، خط لوله فرصت‌های فروش، برآورد ارزش مالی قراردادها و شانس موفقیت آنها</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-500/15 flex items-center gap-2"
          >
            <FileSpreadsheet size={16} />
            خروجی اکسل
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center gap-2"
          >
            <Plus size={16} />
            ثبت فرصت پروژه جدید
          </button>
        </div>
      </div>

      {/* Search filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="جستجو در نام پروژه، کد رهگیری، یا نام کارفرما..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
          />
        </div>

        <div className="relative w-full md:w-64 flex items-center gap-2">
          <Filter size={16} className="text-slate-400 flex-shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white"
          >
            <option value="all">همه مراحل خط فروش</option>
            {(settings.dropdownItems?.projectStatuses || ['جدید', 'در حال مذاکره', 'ارائه پیش‌فاکتور', 'برنده (موفق)', 'نیمه برنده', 'باخته', 'لغو شده']).map((st, idx) => (
              <option key={idx} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Fields Filter Panel */}
      {(() => {
        const projectCustomFields = (settings?.customFields || []).filter(f => f.module === 'projects');
        if (projectCustomFields.length === 0) return null;
        return (
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Filter size={14} className="text-indigo-500" />
              <span>فیلتر فیلدهای سفارشی پروژه:</span>
              {Object.values(customFieldFilters).some(Boolean) && (
                <button
                  onClick={() => setCustomFieldFilters({})}
                  className="mr-auto text-[10px] text-rose-600 hover:underline animate-fade-in"
                >
                  پاک کردن تمامی فیلترها
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {projectCustomFields.map(field => {
                const currentVal = customFieldFilters[field.id] || '';
                return (
                  <div key={field.id} className="space-y-1 text-right">
                    <label className="block text-[11px] font-bold text-slate-600">{field.name}:</label>
                    {field.type === 'select' ? (
                      <select
                        value={currentVal}
                        onChange={(e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">همه</option>
                        {(field.options || []).map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'boolean' ? (
                      <select
                        value={currentVal}
                        onChange={(e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">همه</option>
                        <option value="true">بله</option>
                        <option value="false">خیر</option>
                      </select>
                    ) : field.type === 'file' ? (
                      <select
                        value={currentVal}
                        onChange={(e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">همه</option>
                        <option value="has_file">دارای پیوست</option>
                        <option value="no_file">بدون پیوست</option>
                      </select>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={`فیلتر ${field.name}...`}
                        value={currentVal}
                        onChange={(e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Projects Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                <th className="p-3 w-28">کد پروژه</th>
                <th className="p-3">نام و مشخصات پروژه</th>
                <th className="p-3">کارفرما / مشتری</th>
                <th className="p-3">ارزش پایپ‌لاین (ریال)</th>
                <th className="p-3 w-64">تاریخ‌های کلیدی</th>
                <th className="p-3">وضعیت پروژه</th>
                <th className="p-3">فیلدهای سفارشی</th>
                <th className="p-3 text-center w-24">عملیات</th>
              </tr>
              {/* Column Filters Row */}
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر کد..."
                    value={colFilters.code || ''}
                    onChange={(e) => setColFilters({...colFilters, code: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono"
                  />
                </th>
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر نام..."
                    value={colFilters.name || ''}
                    onChange={(e) => setColFilters({...colFilters, name: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  />
                </th>
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر مشتری..."
                    value={colFilters.customerName || ''}
                    onChange={(e) => setColFilters({...colFilters, customerName: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  />
                </th>
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر پایپ‌لاین..."
                    value={colFilters.estimatedValueRIYAL || ''}
                    onChange={(e) => setColFilters({...colFilters, estimatedValueRIYAL: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-left font-mono"
                  />
                </th>
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر موعد..."
                    value={colFilters.expectedCloseDate || ''}
                    onChange={(e) => setColFilters({...colFilters, expectedCloseDate: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono text-center"
                  />
                </th>
                <th className="p-2">
                  <input
                    type="text"
                    placeholder="فیلتر وضعیت..."
                    value={colFilters.status || ''}
                    onChange={(e) => setColFilters({...colFilters, status: e.target.value})}
                    className="w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-center"
                  />
                </th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  {/* Code */}
                  <td className="p-3 font-mono font-bold text-slate-500">
                    {p.code}
                  </td>

                  {/* Name */}
                  <td className="p-3 text-slate-900">
                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                    
                    {/* General & Contacts Info */}
                    {(p.salesExpert || p.customerInquiryNumber) && (
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-500 border-t border-slate-100 pt-1">
                        {p.salesExpert && (
                          <span>
                            کارشناس: <strong className="text-slate-800">{p.salesExpert}</strong>
                          </span>
                        )}
                        {p.customerInquiryNumber && (
                          <span>
                            {p.salesExpert && ' | '}استعلام: <strong className="text-slate-800 font-mono">{p.customerInquiryNumber}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Marketing & Lead Tracking */}
                    {p.referrerName && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-[9px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                          معرف: {p.referrerName}
                        </span>
                      </div>
                    )}

                    {/* Items Needed */}
                    {p.itemsNeeded && p.itemsNeeded.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-extrabold text-slate-500">اقلام درخواستی:</span>
                        {p.itemsNeeded.map((item, i) => (
                          <span key={i} className="text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                            {item.name} ({item.quantity} عدد)
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="p-3 font-medium text-slate-700">
                    {p.customerName}
                  </td>

                  {/* Pipeline Value */}
                  <td className="p-3 font-mono font-bold text-slate-800 text-left">
                    {getPipelineValue(p.id).toLocaleString('fa-IR')}
                  </td>

                  {/* Expected Close Date & Key Dates */}
                  <td className="p-3 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between gap-2 border-b border-dashed border-slate-100 pb-0.5">
                      <span className="text-slate-400">ثبت فرصت:</span>
                      <span className="font-mono">{p.opportunityDate || p.creationDate}</span>
                    </div>
                    {getApprovedProformaDeliveryDate(p.id) ? (
                      <div className="flex justify-between gap-2 text-emerald-600 font-bold border-b border-dashed border-emerald-100 pb-0.5">
                        <span>موعد تحویل (تایید شده):</span>
                        <span className="font-mono">{getApprovedProformaDeliveryDate(p.id)}</span>
                      </div>
                    ) : (
                      p.expectedCloseDate && (
                        <div className="flex justify-between gap-2 border-b border-dashed border-slate-100 pb-0.5">
                          <span className="text-slate-400">موعد مقرر تحویل:</span>
                          <span className="font-mono text-slate-500">{p.expectedCloseDate}</span>
                        </div>
                      )
                    )}
                    {p.winningDate && (
                      <div className="flex justify-between gap-2 text-emerald-600 font-bold border-b border-dashed border-emerald-100 pb-0.5">
                        <span>تاریخ برد:</span>
                        <span className="font-mono">{p.winningDate}</span>
                      </div>
                    )}
                    {p.agreedDeliveryDate && (
                      <div className="flex justify-between gap-2 text-sky-600 font-bold border-b border-dashed border-sky-100 pb-0.5">
                        <span>توافق‌شده تحویل:</span>
                        <span className="font-mono">{p.agreedDeliveryDate}</span>
                      </div>
                    )}
                    {p.closingDate && (
                      <div className="flex justify-between gap-2 text-slate-500 font-bold">
                        <span>بسته شدن:</span>
                        <span className="font-mono">{p.closingDate}</span>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                    {p.status === 'باخته' && p.lossReason && (
                      <div className="text-[10px] text-rose-500 font-bold mt-1 max-w-[120px] mx-auto truncate" title={p.lossReason}>
                        علت: {p.lossReason}
                      </div>
                    )}
                  </td>

                  {/* Custom Fields */}
                  <td className="p-3">
                    <CustomFieldsDetailView
                      module="projects"
                      customFields={settings?.customFields || []}
                      customValues={p.customValues}
                    />
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedProjectForActivities(p)}
                        className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded transition flex items-center gap-1 text-[10px] font-bold border border-sky-100 shadow-sm"
                        title="ثبت فعالیت و ارجاع"
                      >
                        <Clock size={13} className="text-sky-500" />
                        <span>فعالیت‌ها</span>
                        {(projectCategoryGroups || []).filter(g => g.projectId === p.id && g.status === 'جاری').length > 0 && (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-sky-600 rounded transition"
                        title="ویرایش پروژه"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setProjectToDeleteId(p.id);
                          setProjectToDeleteName(p.name);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-1.5 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition"
                        title="حذف پروژه"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center bg-white p-12 border-t border-slate-100 w-full">
            <Briefcase className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-sm text-slate-500 font-medium">پروژه‌ای با این مشخصات یافت نشد.</p>
            {Object.values(colFilters).some(Boolean) && (
              <button
                onClick={() => setColFilters({})}
                className="mt-3 text-xs text-sky-600 hover:underline font-bold"
              >
                پاک کردن فیلترهای ستونی
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editingProject ? `ویرایش اطلاعات پروژه: ${editingProject.name}` : 'ثبت پروژه صنعتی / فرصت تجاری جدید'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-right">
              
              {/* Section 1: General Info */}
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-sky-500 pr-2">اطلاعات عمومی پروژه</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">عنوان کامل پروژه / نام پروژه *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: نوسازی تجهیزات کنترل نیروگاه ری"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                    />
                  </div>

                  {/* Customer select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">نام مشتری / کارفرما *</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
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
                          onClick={() => {
                            setQuickAddCustomerTarget('customerId');
                            setQuickAddType('customer');
                          }}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center"
                          title="تعریف سریع مشتری جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* End User */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">مصرف‌کننده نهایی</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={endUser}
                        onChange={(e) => setEndUser(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب مصرف‌کننده (مشتری) --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.companyName}</option>
                        ))}
                      </select>
                      {addCustomer && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddCustomerTarget('endUser');
                            setQuickAddType('customer');
                          }}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center"
                          title="تعریف سریع مشتری جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sales Expert */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">کارشناس فروش</label>
                    <select
                      value={salesExpert}
                      onChange={(e) => setSalesExpert(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      <option value="">-- انتخاب کارشناس فروش --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.fullName}>{u.fullName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Customer Inquiry Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">شماره استعلام مشتری</label>
                    <input
                      type="text"
                      value={customerInquiryNumber}
                      onChange={(e) => setCustomerInquiryNumber(e.target.value)}
                      placeholder="مثال: ۱۲۴-۹۹-الف"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-left font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Marketing & Lead Tracking */}
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-indigo-500 pr-2">کانال بازاریابی و کیفیت سرنخ (لید)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Marketing Channel */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">کانال بازاریابی</label>
                    <select
                      value={marketingChannel}
                      onChange={(e) => setMarketingChannel(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      {(settings.dropdownItems?.marketingChannels || ['تماس مستقیم', 'نمایشگاه تجاری', 'وب‌سایت / آنلاین', 'معرفی', 'مناقصه رسمی', 'سایر']).map((ch, idx) => (
                        <option key={idx} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>

                  {/* Lead Quality */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">کیفیت لید</label>
                    <select
                      value={leadQuality}
                      onChange={(e) => setLeadQuality(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      {(settings.dropdownItems?.leadQualities || ['عالی (گرم)', 'متوسط', 'ضعیف (سرد)']).map((q, idx) => (
                        <option key={idx} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  {/* Referrer Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">نام معرف (در صورت وجود)</label>
                    <input
                      type="text"
                      value={referrerName}
                      onChange={(e) => setReferrerName(e.target.value)}
                      placeholder="نام شخص یا سازمان معرفی‌کننده"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                    />
                  </div>

                  {/* Communication Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">روش ارتباط اصلی</label>
                    <select
                      value={communicationMethod}
                      onChange={(e) => setCommunicationMethod(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      {(settings.dropdownItems?.communicationMethods || ['تلفن', 'ایمیل', 'جلسه حضوری', 'مکاتبه رسمی', 'شبکه‌های اجتماعی']).map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Key Persons */}
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-amber-500 pr-2">افراد کلیدی مشتری</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Financial Key Person */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">فرد کلیدی مالی</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={financialContact}
                        onChange={(e) => setFinancialContact(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب فرد مالی (مشتری) --</option>
                        {(() => {
                          const selectedCustObj = customers.find(c => c.id === customerId);
                          const filtered = selectedCustObj && selectedCustObj.linkedCustomerIds && selectedCustObj.linkedCustomerIds.length > 0
                            ? customers.filter(c => selectedCustObj.linkedCustomerIds?.includes(c.id))
                            : customers;
                          return filtered.map(c => {
                            const name = c.customerType === 'حقوقی' ? c.companyName : `${c.firstName || ''} ${c.lastName || ''}`.trim();
                            return (
                              <option key={c.id} value={c.id}>{name}</option>
                            );
                          });
                        })()}
                      </select>
                      {addCustomer && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddCustomerTarget('financialContact');
                            setQuickAddType('customer');
                          }}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center"
                          title="تعریف سریع مشتری جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Technical Key Person */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">فرد کلیدی فنی</label>
                    <div className="flex gap-1.5 items-center">
                      <select
                        value={technicalContact}
                        onChange={(e) => setTechnicalContact(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب فرد فنی (مشتری) --</option>
                        {(() => {
                          const selectedCustObj = customers.find(c => c.id === customerId);
                          const filtered = selectedCustObj && selectedCustObj.linkedCustomerIds && selectedCustObj.linkedCustomerIds.length > 0
                            ? customers.filter(c => selectedCustObj.linkedCustomerIds?.includes(c.id))
                            : customers;
                          return filtered.map(c => {
                            const name = c.customerType === 'حقوقی' ? c.companyName : `${c.firstName || ''} ${c.lastName || ''}`.trim();
                            return (
                              <option key={c.id} value={c.id}>{name}</option>
                            );
                          });
                        })()}
                      </select>
                      {addCustomer && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddCustomerTarget('technicalContact');
                            setQuickAddType('customer');
                          }}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center"
                          title="تعریف سریع مشتری جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Project Dates & Timeline */}
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-teal-500 pr-2">زمان‌بندی عمومی پروژه</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opportunity Creation Date */}
                  <div className="space-y-1.5">
                    <ShamsiDatePicker
                      label="تاریخ ایجاد فرصت (ثبت در CRM) *"
                      required
                      value={opportunityDate}
                      onChange={(val) => setOpportunityDate(val)}
                    />
                  </div>

                  {/* Target Delivery date */}
                  <div className="space-y-1.5" id="project-expected-close-date-picker-wrapper">
                    <ShamsiDatePicker
                      label="موعد مقرر تحویل عمومی (تعهد تحویل کالا)"
                      value={expectedCloseDate}
                      onChange={(val) => setExpectedCloseDate(val)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Status & Outcomes */}
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-rose-500 pr-2">نتیجه پروژه و وضعیت ابلاغ قرارداد (خودکار / دستی)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status / Outcome */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">نتیجه پروژه (مرحله پیشرفت فرصت)</label>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      {(settings.dropdownItems?.projectStatuses || ['جدید', 'در حال مذاکره', 'ارائه پیش‌فاکتور', 'برنده (موفق)', 'نیمه برنده', 'باخته', 'لغو شده']).map((st, idx) => (
                        <option key={idx} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Loss Reason (Conditional) */}
                  {status === 'باخته' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-rose-500">دلیل باخت پروژه *</label>
                      <select
                        value={lossReason}
                        onChange={(e) => setLossReason(e.target.value)}
                        required
                        className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-right bg-white"
                      >
                        <option value="">-- انتخاب دلیل باخت --</option>
                        {settings.lossReasons?.map((reason, i) => (
                          <option key={i} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Win Date */}
                  {(status === 'برنده (موفق)' || status === 'نیمه برنده') && (
                    <div className="space-y-1.5">
                      <ShamsiDatePicker
                        label="تاریخ برنده شدن (ابلاغ قرارداد) *"
                        required
                        value={winningDate}
                        onChange={(val) => setWinningDate(val)}
                      />
                    </div>
                  )}

                  {/* Agreed Delivery Date */}
                  {(status === 'برنده (موفق)' || status === 'نیمه برنده') && (
                    <div className="space-y-1.5">
                      <ShamsiDatePicker
                        label="تاریخ توافق‌شده تحویل نهایی *"
                        required
                        value={agreedDeliveryDate}
                        onChange={(val) => setAgreedDeliveryDate(val)}
                      />
                    </div>
                  )}

                  {/* Close Date */}
                  {(status === 'برنده (موفق)' || status === 'نیمه برنده' || status === 'باخته' || status === 'لغو شده') && (
                    <div className="space-y-1.5">
                      <ShamsiDatePicker
                        label="تاریخ بسته شدن پرونده *"
                        required
                        value={closingDate}
                        onChange={(val) => setClosingDate(val)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Requested Products Multi-Row Block */}
                <div className="md:col-span-2 space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">محصولات یا اقلام درخواستی کارفرما / مشتری</label>
                    <button
                      type="button"
                      onClick={handleAddItemLine}
                      className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Plus size={12} />
                      افزودن ردیف محصول
                    </button>
                  </div>

                  {itemsNeeded.length > 0 ? (
                    <div className="space-y-2">
                      {itemsNeeded.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-150">
                          <div className="flex-1 flex gap-1.5 items-center">
                            <select
                              value={item.productId}
                              onChange={(e) => handleItemProductChange(index, e.target.value)}
                              className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs bg-white text-right min-w-0"
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.code} - {p.displayName}</option>
                              ))}
                            </select>
                            {addProduct && (
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickAddProductIndex(index);
                                  setQuickAddType('product');
                                }}
                                className="px-2 py-1 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center font-bold"
                                title="تعریف سریع کالای جدید"
                              >
                                <Plus size={12} />
                              </button>
                            )}
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => handleItemQuantityChange(index, Number(e.target.value))}
                              placeholder="تعداد"
                              className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemLine(index)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-[11px] text-center bg-slate-50 py-3 rounded-lg border border-dashed border-slate-200">
                      هیچ ردیف محصولی ثبت نشده است. برای ثبت نیازهای کالا، روی «افزودن ردیف محصول» کلیک کنید.
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">مشخصات مهندسی مورد نیاز، بازه دما و فشارهای کاربری یا شرح عمومی</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="شرح اهداف کارفرما، نوع متریال درخواستی..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                  />
                </div>

                {/* Dynamic Custom Fields Form Section */}
                <div className="col-span-1 md:col-span-2">
                  <CustomFieldsForm
                    module="projects"
                    customFields={settings?.customFields || []}
                    customValues={customValues}
                    onChange={setCustomValues}
                  />
                </div>

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
                  {editingProject ? 'ثبت تغییرات پروژه' : 'ایجاد پروژه'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Project Activities Drawer/Modal */}
      {selectedProjectForActivities && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-slate-50 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center text-right">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500 rounded-lg text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">پروژه: {selectedProjectForActivities.code}</div>
                  <h2 className="text-lg font-bold">{selectedProjectForActivities.name}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProjectForActivities(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-right">
              
              {/* Top Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs">
                <div>
                  <span className="text-slate-400 font-bold">کارفرما/مشتری: </span>
                  <strong className="text-slate-700">{selectedProjectForActivities.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">کارشناس فروش مسئول: </span>
                  <strong className="text-slate-700">{selectedProjectForActivities.salesExpert || 'مشخص نشده'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">وضعیت فرصت: </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusColor(selectedProjectForActivities.status)}`}>
                    {selectedProjectForActivities.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Right Side: Activate/Open Category Group form */}
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800">
                      <Sliders size={16} className="text-sky-500" />
                      <h3 className="font-bold text-xs">فعال‌سازی دسته‌بندی فعالیت جدید</h3>
                    </div>
                    
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      برای ثبت فعالیت، ابتدا باید یکی از دسته‌بندی‌های مشخص‌شده در تنظیمات را برای این پروژه فعال کنید. طبق تعهد، تکرار دسته‌بندی مجاز نیست.
                    </p>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-500 block">انتخاب دسته‌بندی فعالیت *</label>
                        <select
                          value={selectedCategoryToCreate}
                          onChange={(e) => setSelectedCategoryToCreate(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs outline-none bg-white focus:ring-2 focus:ring-sky-500/20 text-right"
                        >
                          <option value="">-- انتخاب دسته‌بندی --</option>
                          {(settings.activityCategories || []).map(cat => {
                            const alreadyExists = (projectCategoryGroups || []).some(
                              g => g.projectId === selectedProjectForActivities.id && g.categoryId === cat.id
                            );
                            return (
                              <option 
                                key={cat.id} 
                                value={cat.id}
                                disabled={alreadyExists}
                              >
                                {cat.name} {alreadyExists ? '(قبلاً ایجاد شده)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedCategoryToCreate) {
                            alert('لطفاً ابتدا یک دسته‌بندی انتخاب کنید.');
                            return;
                          }
                          const cat = (settings.activityCategories || []).find(c => c.id === selectedCategoryToCreate);
                          if (!cat) return;
                          
                          if (addProjectCategoryGroup) {
                            const res = addProjectCategoryGroup(selectedProjectForActivities.id, cat.id, cat.name);
                            if (!res.success) {
                              alert(res.error);
                            } else {
                              alert(`دسته‌بندی «${cat.name}» با موفقیت برای این پروژه فعال شد.`);
                              setSelectedCategoryToCreate('');
                            }
                          }
                        }}
                        className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10"
                      >
                        <Plus size={14} />
                        راه‌اندازی دسته‌بندی در پروژه
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Box */}
                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl text-[10px] text-sky-800 leading-relaxed space-y-1 text-right">
                    <div className="font-bold flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>قوانین ثبت فعالیت‌ها:</span>
                    </div>
                    <div>• ثبت فعالیت حتماً باید ذیل یک دسته‌بندی مشخص باشد.</div>
                    <div>• در صورت اتمام کار در یک دسته‌بندی، دکمه اتمام کار را بزنید.</div>
                    <div>• پس از بسته‌شدن دسته‌بندی، در صورت لزوم می‌توانید مجدداً آن را به جریان بیندازید.</div>
                    <div>• هر فعالیت می‌تواند به عنوان ارجاع کار برای یکی از همکاران صادر شود.</div>
                  </div>
                </div>

                {/* Left Side: Category Groups List & Inside Activities */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Filter and Category Groups Block */}
                  {(!projectCategoryGroups || projectCategoryGroups.filter(g => g.projectId === selectedProjectForActivities.id).length === 0) ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-slate-100 shadow-sm space-y-3">
                      <History className="mx-auto text-slate-300" size={36} />
                      <p className="text-slate-500 text-xs font-semibold">هیچ دسته‌بندی فعالیتی هنوز برای این پروژه راه‌اندازی نشده است.</p>
                      <p className="text-[10px] text-slate-400">لطفاً از پنل سمت راست، اولین دسته‌بندی فعالیت را فعال کنید.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Collapsible Utility Controls */}
                      <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                        <span className="text-[11px] font-bold text-slate-500">مدیریت نمایش دسته‌بندی‌ها:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const projectGroups = projectCategoryGroups.filter(g => g.projectId === selectedProjectForActivities.id);
                              const newExpanded: Record<string, boolean> = {};
                              projectGroups.forEach(g => {
                                newExpanded[g.id] = true;
                              });
                              setExpandedGroups(newExpanded);
                            }}
                            className="px-2.5 py-1 text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-sky-600 rounded font-bold transition shadow-sm"
                          >
                            باز کردن همه
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedGroups({})}
                            className="px-2.5 py-1 text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-bold transition shadow-sm"
                          >
                            جمع کردن همه
                          </button>
                        </div>
                      </div>

                      {(projectCategoryGroups || [])
                        .filter(g => g.projectId === selectedProjectForActivities.id)
                        .map((group) => {
                          const isGroupClosed = group.status === 'اتمام کار';
                          const isExpanded = !!expandedGroups[group.id];
                          const cat = settings.activityCategories?.find(c => c.id === group.categoryId);
                          const canManageCompletion = !cat?.responsibleUserId || cat.responsibleUserId === currentUser?.fullName || currentUser?.role === 'admin' || currentUser?.isSystemAdmin;
                          
                          return (
                            <div 
                              key={group.id} 
                              className={`bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${
                                isGroupClosed ? 'opacity-85 border-slate-200 bg-slate-50/20' : 'ring-2 ring-sky-500/10'
                              }`}
                            >
                              {/* Group Header */}
                              <div 
                                onClick={() => {
                                  setExpandedGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }));
                                }}
                                className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center gap-2 flex-wrap cursor-pointer hover:bg-slate-100/70 transition"
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronUp size={16} className="text-slate-500 transition-transform duration-200" />
                                  ) : (
                                    <ChevronDown size={16} className="text-slate-500 transition-transform duration-200" />
                                  )}
                                  <span className="bg-sky-100 text-sky-950 text-xs font-bold px-2.5 py-1 rounded-md border border-sky-200">
                                    {group.categoryName}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isGroupClosed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800 animate-pulse'
                                  }`}>
                                    {group.status}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    ({(group.activities || []).length} فعالیت)
                                  </span>
                                </div>

                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                  <div className="text-[9px] text-slate-400 font-mono flex flex-col text-left">
                                    <span>شروع: {group.startDate}</span>
                                    {group.endDate && <span className="text-rose-500 font-bold">پایان: {group.endDate}</span>}
                                  </div>
                                  
                                  {/* Toggle Button */}
                                  {canManageCompletion && (isGroupClosed ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (resumeProjectCategoryGroup) resumeProjectCategoryGroup(group.id, currentUser?.fullName || 'کاربر سیستم');
                                      }}
                                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[10px] font-bold transition border border-sky-150 flex items-center gap-1"
                                    >
                                      <History size={11} />
                                      به جریان انداختن مجدد
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (completeProjectCategoryGroup) completeProjectCategoryGroup(group.id, currentUser?.fullName || 'کاربر سیستم');
                                      }}
                                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition shadow-sm flex items-center gap-1"
                                    >
                                      <Check size={11} />
                                      اتمام کار این دسته
                                    </button>
                                  ))}
                                </div>
                              </div>

                            {/* Group Activities List & Form */}
                            {isExpanded && (
                              <div className="p-4 space-y-4 bg-white border-t border-slate-100 animate-fade-in">
                                <div className="space-y-3">
                                  {(!group.activities || group.activities.length === 0) ? (
                                    <p className="text-slate-400 text-[10px] text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-100">
                                      هنوز هیچ فعالیتی در این دسته ثبت نشده است.
                                    </p>
                                  ) : (
                                    (group.activities || []).map((act) => (
                                      <div key={act.id} className="bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 space-y-2.5 text-xs text-right">
                                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono">{act.createdAt}</span>
                                            {act.createdBy && (
                                              <span className="text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <User size={10} />
                                                {act.createdBy}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {act.attachment && (
                                              act.attachment.content ? (
                                                <a
                                                  href={act.attachment.content}
                                                  download={act.attachment.name}
                                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 border border-sky-200 text-sky-800 text-[9px] font-bold transition mr-1"
                                                  title="دانلود فایل پیوست"
                                                >
                                                  <Paperclip size={10} />
                                                  {act.attachment.name} ({act.attachment.size})
                                                </a>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[9px] font-bold mr-1">
                                                  <Paperclip size={10} />
                                                  {act.attachment.name} ({act.attachment.size})
                                                </span>
                                              )
                                            )}

                                            {/* Edit & Delete Action Buttons */}
                                            <div className="flex items-center gap-1 bg-slate-100/60 p-0.5 rounded border border-slate-200/40">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setEditingActivityId(act.id);
                                                  setEditingActivityText(act.text);
                                                }}
                                                className="text-slate-400 hover:text-sky-600 transition p-1 hover:bg-white rounded"
                                                title="ویرایش"
                                              >
                                                <Edit size={10} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActivityToDeleteGroupId(group.id);
                                                  setActivityToDeleteId(act.id);
                                                  setActivityDeleteConfirmOpen(true);
                                                }}
                                                className="text-slate-400 hover:text-rose-600 transition p-1 hover:bg-white rounded"
                                                title="حذف"
                                              >
                                                <Trash2 size={10} />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        {editingActivityId === act.id ? (
                                          <div className="space-y-2 mt-1">
                                            <textarea
                                              value={editingActivityText}
                                              onChange={(e) => setEditingActivityText(e.target.value)}
                                              className="w-full text-xs p-2 border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-semibold text-slate-800 text-right"
                                              rows={2}
                                              dir="rtl"
                                            />
                                            <div className="flex gap-2 justify-end">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (editingActivityText.trim() && selectedProjectForActivities) {
                                                    updateProjectActivity?.(selectedProjectForActivities.id, group.id, act.id, editingActivityText.trim());
                                                    setEditingActivityId(null);
                                                    setEditingActivityText('');
                                                  }
                                                }}
                                                className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-[10px] flex items-center gap-1 transition"
                                              >
                                                <Check size={10} />
                                                ذخیره
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setEditingActivityId(null);
                                                  setEditingActivityText('');
                                                }}
                                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[10px] flex items-center gap-1 transition"
                                              >
                                                <X size={10} />
                                                انصراف
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-slate-700 leading-relaxed font-semibold">{act.text}</p>
                                        )}
                                        
                                        {/* Referral details inside activity card */}
                                        {act.referral && (
                                          <div className="mt-2 bg-white rounded-lg p-3 border border-slate-150 space-y-2 text-right">
                                            <div className="flex justify-between items-center text-[9px] border-b border-slate-100 pb-1.5">
                                              <span className="text-sky-700 font-bold">ارجاع کار برای اقدام:</span>
                                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                                act.referral.status === 'در انتظار اقدام' ? 'bg-sky-50 text-sky-700 border border-sky-100 animate-pulse' : 'bg-emerald-50 text-emerald-800'
                                              }`}>
                                                {act.referral.status}
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                              ارجاع‌دهنده: <strong className="text-slate-700">{act.referral.assignedBy}</strong>
                                              {' '} | ارجاع‌شونده: <strong className="text-slate-700">{act.referral.assignedTo}</strong>
                                            </div>
                                            <div className="bg-sky-50/40 p-2.5 rounded text-[11px] text-slate-600 font-extrabold border-r-2 border-sky-500 leading-relaxed">
                                              {act.referral.actionRequired}
                                            </div>

                                            {/* Messages visually nested under referral */}
                                            {(act.referral.messages?.length ? act.referral.messages : (act.referral.response ? [act.referral.response] : [])).map((msg, msgIdx) => (
                                              <div key={msgIdx} className="mt-2 pt-2 border-t border-slate-100 bg-emerald-50/20 p-2 rounded-md border border-emerald-100 space-y-1 text-right">
                                                <div className="flex justify-between items-center text-[8px] text-emerald-800 font-bold">
                                                  <span>پاسخ اقدام:</span>
                                                  <span className="font-mono">{msg.createdAt}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-800 font-semibold leading-relaxed bg-white/70 p-2 rounded border border-emerald-100">
                                                  {msg.text}
                                                </p>

                                                {/* Response attachment if any */}
                                                {msg.attachment && (
                                                  <div className="pt-1">
                                                    {msg.attachment.content ? (
                                                      <a
                                                        href={msg.attachment.content}
                                                        download={msg.attachment.name}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-bold mt-1 transition"
                                                        title="دانلود فایل پیوست اقدام"
                                                      >
                                                        <Paperclip size={11} className="text-emerald-600" />
                                                        <span>فایل پیوست پاسخ: {msg.attachment.name}</span>
                                                        <span className="text-emerald-500">({msg.attachment.size})</span>
                                                      </a>
                                                    ) : (
                                                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold mt-1">
                                                        <Paperclip size={11} />
                                                        <span>فایل پیوست پاسخ: {msg.attachment.name}</span>
                                                        <span className="text-emerald-500">({msg.attachment.size})</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}

                                                <div className="text-[8px] text-slate-400">
                                                  ارسال‌کننده: {msg.responder}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Form to Add Activity to this group (only if group is Active) */}
                                {!isGroupClosed && (
                                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                    <span className="text-[11px] font-bold text-slate-600 block">ثبت فعالیت جدید در این دسته‌بندی:</span>
                                    
                                    <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                      <textarea
                                        rows={2}
                                        value={newActivityText[group.id] || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setNewActivityText(prev => ({ ...prev, [group.id]: val }));
                                        }}
                                        placeholder="شرح جزئیات فعالیت انجام شده، مکالمات فنی یا مذاکرات با مشتری..."
                                        className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-sky-500/20 outline-none text-right placeholder-slate-400 bg-white"
                                      />

                                      {/* Attachment simulator */}
                                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                          <label className="cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition font-bold text-slate-600 flex items-center gap-1">
                                            <Paperclip size={12} className="text-slate-400" />
                                            <span>پیوست فایل (تصویر یا سند)</span>
                                            <input
                                              type="file"
                                              className="hidden"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  if (file.size > 2 * 1024 * 1024 && !file.type.startsWith('image/')) {
                                                    alert('حداکثر حجم مجاز برای فایل‌های غیرتصویری ۲ مگابایت می‌باشد.');
                                                    return;
                                                  }
                                                  
                                                  compressImage(file, (dataUrl, sizeStr) => {
                                                    setNewActivityAttachment(prev => ({
                                                      ...prev,
                                                      [group.id]: {
                                                        name: file.name,
                                                        size: sizeStr,
                                                        content: dataUrl
                                                      }
                                                    }));
                                                  });
                                                }
                                              }}
                                            />
                                          </label>
                                          {newActivityAttachment[group.id] && (
                                            <span className="text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded flex items-center gap-1 border border-sky-100">
                                              {newActivityAttachment[group.id]?.name}
                                              <button 
                                                type="button" 
                                                onClick={() => setNewActivityAttachment(prev => ({ ...prev, [group.id]: null }))}
                                                className="text-rose-500 hover:text-rose-700 font-bold text-xs"
                                              >
                                                ×
                                              </button>
                                            </span>
                                          )}
                                        </div>

                                        {/* Referral toggle */}
                                        <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600">
                                          <input
                                            type="checkbox"
                                            checked={referralEnabled[group.id] || false}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              setReferralEnabled(prev => ({ ...prev, [group.id]: checked }));
                                            }}
                                            className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                          />
                                          <span>نیاز به اقدام و ارجاع به همکار؟</span>
                                        </label>
                                      </div>

                                      {/* Referral Sub-form */}
                                      {referralEnabled[group.id] && (
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3 text-xs animate-fade-in text-right">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 block">ارجاع به همکار *</label>
                                              <select
                                                value={referralAssignedTo[group.id] || ''}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  setReferralAssignedTo(prev => ({ ...prev, [group.id]: val }));
                                                }}
                                                className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-right"
                                              >
                                                <option value="">-- انتخاب همکار --</option>
                                                {(users || []).map((u) => (
                                                  <option key={u.id} value={u.fullName}>
                                                    {u.fullName}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>

                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 block">اقدام خواسته‌شده مشخص *</label>
                                            <textarea
                                              rows={2}
                                              value={referralAction[group.id] || ''}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setReferralAction(prev => ({ ...prev, [group.id]: val }));
                                              }}
                                              placeholder="مثلاً: بررسی کاتالوگ ابعادی رنج کالا و تایید نهایی به تدارکات"
                                              className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-right bg-white leading-relaxed"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* Submit Activity Button */}
                                      <div className="flex justify-end pt-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const text = newActivityText[group.id] || '';
                                            const attachmentData = newActivityAttachment[group.id] || null;

                                            if (!text.trim() && !attachmentData) {
                                              alert('لطفاً ابتدا شرح فعالیت یا پیوست را وارد کنید.');
                                              return;
                                            }

                                            let referralData = null;
                                            if (referralEnabled[group.id]) {
                                              const assignedTo = referralAssignedTo[group.id];
                                              const action = referralAction[group.id];
                                              if (!assignedTo) {
                                                alert('لطفاً همکار ارجاع‌شونده را انتخاب کنید.');
                                                return;
                                              }
                                              if (!action || !action.trim()) {
                                                alert('لطفاً شرح اقدام ارجاع را وارد کنید.');
                                                return;
                                              }
                                              referralData = {
                                                assignedTo,
                                                actionRequired: action.trim(),
                                                assignedBy: currentUser?.fullName || 'محمد توکل مقدم'
                                              };
                                            }

                                            if (addProjectActivity) {
                                              addProjectActivity(
                                                selectedProjectForActivities.id,
                                                group.id,
                                                text.trim(),
                                                attachmentData,
                                                referralData,
                                                currentUser?.fullName || 'کاربر سیستم'
                                              );
                                              
                                              // Reset forms
                                              setNewActivityText(prev => ({ ...prev, [group.id]: '' }));
                                              setNewActivityAttachment(prev => ({ ...prev, [group.id]: null }));
                                              setReferralEnabled(prev => ({ ...prev, [group.id]: false }));
                                              setReferralAssignedTo(prev => ({ ...prev, [group.id]: '' }));
                                              setReferralAction(prev => ({ ...prev, [group.id]: '' }));
                                              alert('فعالیت جدید با موفقیت ثبت گردید.');
                                            }
                                          }}
                                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/15"
                                        >
                                          <Send size={11} />
                                          ثبت این فعالیت
                                        </button>
                                      </div>

                                    </div>
                                  </div>
                                )}

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProjectForActivities(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
              >
                بستن پنجره تاریخچه
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProjectToDeleteId(null);
          setProjectToDeleteName('');
        }}
        onConfirm={() => {
          if (projectToDeleteId) {
            deleteProject(projectToDeleteId);
          }
        }}
        title="حذف پروژه"
        message={`آیا از حذف پروژه "${projectToDeleteName}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />

      {/* Confirm Delete Activity Modal */}
      <ConfirmModal
        isOpen={activityDeleteConfirmOpen}
        onClose={() => {
          setActivityDeleteConfirmOpen(false);
          setActivityToDeleteGroupId(null);
          setActivityToDeleteId(null);
        }}
        onConfirm={() => {
          if (selectedProjectForActivities && activityToDeleteGroupId && activityToDeleteId) {
            deleteProjectActivity?.(selectedProjectForActivities.id, activityToDeleteGroupId, activityToDeleteId);
          }
        }}
        title="حذف فعالیت پروژه"
        message="آیا از حذف این فعالیت اطمینان دارید؟ این عمل غیرقابل بازگشت است."
      />

      {/* Quick Customer Add Modal */}
      {quickAddType && (
        <QuickAddModal
          isOpen={!!quickAddType}
          onClose={() => {
            setQuickAddType(null);
            setQuickAddCustomerTarget(null);
            setQuickAddProductIndex(null);
          }}
          type={quickAddType}
          settings={settings}
          customers={customers}
          addCustomer={addCustomer}
          products={products}
          addProduct={addProduct}
          users={users}
          onSuccess={(newEntity) => {
            if (newEntity && newEntity.id) {
              if (quickAddType === 'customer') {
                if (quickAddCustomerTarget === 'customerId') {
                  setCustomerId(newEntity.id);
                } else if (quickAddCustomerTarget === 'endUser') {
                  setEndUser(newEntity.id);
                } else if (quickAddCustomerTarget === 'financialContact') {
                  setFinancialContact(newEntity.id);
                } else if (quickAddCustomerTarget === 'technicalContact') {
                  setTechnicalContact(newEntity.id);
                } else {
                  setCustomerId(newEntity.id);
                }
              } else if (quickAddType === 'product' && quickAddProductIndex !== null) {
                handleItemProductChange(quickAddProductIndex, newEntity.id);
              }
            }
            setQuickAddType(null);
            setQuickAddCustomerTarget(null);
            setQuickAddProductIndex(null);
          }}
        />
      )}

    </div>
  );
}
