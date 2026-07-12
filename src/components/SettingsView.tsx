import React, { useState } from 'react';

import { 
  Settings, 
  Building, 
  FileText, 
  Percent, 
  Save, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  HelpCircle,
  AlertCircle,
  Calendar,
  Paperclip,
  Check,
  ToggleLeft,
  XCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Truck,
  ShoppingCart,
  ArrowDownLeft,
  TrendingUp,
  CheckSquare,
  Inbox,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Menu,
  UserCog,
  Bell,
  Boxes,
  Wrench,
  History
} from 'lucide-react';
import { ERPSettings, CustomField, ProjectCategoryGroup, User, Project, AuditLog, WorkflowRule } from '../types';
import { decompressLZW } from '../utils/compress';
import ConfirmModal from './ConfirmModal';
import { compressAndResizeImage, uploadFile } from '../imageUtils';

interface SettingsViewProps {
  settings: ERPSettings;
  updateSettings: (newSettings: ERPSettings) => void;
  userRole?: 'admin' | 'user';
  changeRole?: (role: 'admin' | 'user') => void;
  projectCategoryGroups?: ProjectCategoryGroup[];
  users?: User[];
  currentUser?: User | null;
  projects?: Project[];
  auditLogs?: AuditLog[];
}

export default function SettingsView({
  settings,
  updateSettings,
  userRole = 'admin',
  changeRole,
  projectCategoryGroups = [],
  users = [],
  currentUser = null,
  projects = [],
  auditLogs = [],
}: SettingsViewProps) {
  const template = settings?.proformaTemplates?.[0] || {
    name: 'قالب پیش‌فرض رسمی',
    companyName: 'ابزار تامین ارشیا (سهامی خاص)',
    registrationNumber: '۱۰۴۸۲۷',
    nationalCode: '۱۰۲۶۰۴۸۲۷۳۱',
    economicCode: '۴۱۱۴۸۳۹۲۷۴۸۲',
    phone: '02188899000',
    email: 'sales@abzartamin.com',
    website: 'www.abzartamin.com',
    address: 'تهران، خیابان ولیعصر، برج سپهر، طبقه ۸، واحد ۸۰۴',
    titleColor: '#0ea5e9',
    documentTitle: 'پیش‌فاکتور رسمی',
    headerText: 'مفتخریم پیشنهاد قیمت تجهیزات ابزار دقیق مورد نیاز آن مجموعه محترم را به شرح زیر تقدیم داریم.',
    termsAndConditions: '۱. مدت اعتبار این پیشنهاد ۱۰ روز کاری از تاریخ صدور می‌باشد.\n۲. زمان تحویل کالاهای موجود در انبار، ۲ روز کاری و کالاهای سفارشی ۶ هفته پس از دریافت پیش‌پرداخت می‌باشد.\n۳. گارانتی کلیه تجهیزات به مدت ۱۲ ماه شمسی و خدمات پس از فروش به مدت ۵ سال ارائه می‌گردد.',
    footerText: 'از حسن توجه و اعتماد شما به شرکت ابزار تامین ارشیا صمیمانه سپاسگزاریم.',
    signatureLabel1: 'کارشناس فروش - محمد توکل مقدم',
    signatureLabel2: 'مدیرعامل - علیرضا ارشیا',
    showLogo: true,
    showTerms: true,
    showSignatures: true,
    showTotals: true
  };
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'general' | 'customFields' | 'activityCategories' | 'dropdowns' | 'sidebarOrder' | 'moduleResponsibles' | 'adminNotifications' | 'deliveryChecklist' | 'auditLog' | 'workflows'>('general');

  // Workflow builder states
  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);

  // Audit log filters
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState('all');
  const [logActionFilter, setLogActionFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Loss reasons state
  const [newLossReason, setNewLossReason] = useState('');
  
  // Activity categories state
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dropdown items state
  const [selectedDropdownKey, setSelectedDropdownKey] = useState<keyof ERPSettings['dropdownItems'] | 'lossReasons'>('industries');
  const [newDropdownItem, setNewDropdownItem] = useState('');

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'dropdownItem' | 'activityCategory' | 'lossReason' | 'customField' | 'clearData' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string>('');
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [deleteTargetExtra, setDeleteTargetExtra] = useState<any>(null);

  const allowedDropdownKeys: (keyof ERPSettings['dropdownItems'] | 'lossReasons')[] = [
    'industries',
    'categories',
    'units',
    'paymentTerms',
    'salesExperts',
    'marketingChannels',
    'leadQualities',
    'communicationMethods',
    'taskPriorities',
    'positions',
    'receiptTypes',
    'supplierInquiryActionTypes',
    'shippingMethods',
    'packageTypes',
    'returnReasons',
    'lossReasons'
  ];

  const dropdownLabels: Partial<Record<keyof ERPSettings['dropdownItems'] | 'lossReasons', string>> = {
    industries: 'صنایع فعالیت مشتریان (مشتریان)',
    categories: 'دسته‌بندی‌های کالا و ابزار دقیق (کالا)',
    units: 'واحدهای سنجش و شمارش کالا (کالا)',
    paymentTerms: 'شرایط پرداخت و تسویه ارزی (پیش‌فاکتور/خرید)',
    salesExperts: 'کارشناسان فروش مسئول (مشتریان/پروژه‌ها)',
    marketingChannels: 'کانال‌های بازاریابی و جذب لید (مشتریان)',
    leadQualities: 'سطوح کیفیت سرنخ‌ها (مشتریان/پروژه‌ها)',
    communicationMethods: 'روش‌های اصلی ارتباط با مشتری (وظایف)',
    taskPriorities: 'اولویت‌های وظایف و پیگیری‌ها (وظایف)',
    positions: 'سمت‌های افراد حقیقی (کاربران)',
    receiptTypes: 'انواع دریافت و پرداخت (تراکنش‌ها)',
    supplierInquiryActionTypes: 'انواع اقدام ثبت شده (استعلام‌ها)',
    shippingMethods: 'نحوه ارسال کالا (پکینگ لیست/خرید)',
    packageTypes: 'نوع بسته‌بندی (پکینگ لیست)',
    returnReasons: 'دلایل برگشت کالا (خدمات پس از فروش)',
    lossReasons: 'دلایل باخت پروژه/اقلام (پروژه‌ها/پیش‌فاکتور)'
  };

  const dropdownDescriptions: Partial<Record<keyof ERPSettings['dropdownItems'] | 'lossReasons', string>> = {
    industries: 'لیست صنایع اصلی که مشتریان شما در آن‌ها فعالیت می‌کنند (مثال: نفت و گاز، پتروشیمی، نیروگاهی).',
    categories: 'گروه‌های کالایی و ابزار دقیق برای دسته‌بندی کالاها و پیش‌فاکتورها.',
    units: 'واحدهای شمارش فیزیکی اقلام و تجهیزات.',
    paymentTerms: 'شرایط پیش‌فرض برای تسویه حساب با تأمین‌کنندگان خارجی.',
    salesExperts: 'لیست اسامی کارشناسان فروش شرکت جهت انتساب به پروژه‌ها.',
    marketingChannels: 'راه‌های مختلف ورود سرنخ و فرصت‌های فروش به سیستم برای تحلیل بازاریابی.',
    leadQualities: 'درجه‌بندی اهمیت و گرمای سرنخ‌های ورودی.',
    communicationMethods: 'روش‌های اصلی تعامل و ارتباط با کارفرما.',
    taskPriorities: 'درجات اهمیت پیگیری‌ها و اقدامات همکاران.',
    positions: 'لیست سمت‌های پیش‌فرض و انتخابی برای مخاطبین و افراد حقیقی در بخش مشتریان.',
    receiptTypes: 'دسته‌بندی‌ها و بابت‌های دریافت و پرداخت در دفتر صندوق.',
    supplierInquiryActionTypes: 'لیست انواع اقدام قابل انتخاب هنگام ثبت اقدامات جدید برای استعلام‌های قیمت از تامین‌کنندگان.',
    shippingMethods: 'لیست روش‌ها و شرکت‌های حمل و نقل جهت انتخاب در زمان صدور پکینگ لیست و تحویل کالا.',
    packageTypes: 'لیست انواع پیش‌فرض بسته‌بندی کالاها در پکینگ لیست.',
    returnReasons: 'لیست دلایل و مشکلات خرابی یا برگشت کالا در بخش خدمات پس از فروش.',
    lossReasons: 'دلایل باخت تعریف شده که کاربر می‌تواند هنگام مشخص کردن وضعیت بازنده یا لغو پروژه/پیش‌فاکتور انتخاب کند.'
  };

  const handleAddDropdownItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDropdownItem.trim()) return;
    
    if (selectedDropdownKey === 'lossReasons') {
      const currentList = settings.lossReasons || [];
      if (currentList.map(item => item.toLowerCase()).includes(newDropdownItem.trim().toLowerCase())) {
        alert('این آیتم قبلاً در لیست وجود دارد.');
        return;
      }
      const updatedList = [...currentList, newDropdownItem.trim()];
      updateSettings({
        ...settings,
        lossReasons: updatedList
      });
      setNewDropdownItem('');
      return;
    }

    const currentList = settings.dropdownItems[selectedDropdownKey] || [];
    if (currentList.map(item => item.toLowerCase()).includes(newDropdownItem.trim().toLowerCase())) {
      alert('این آیتم قبلاً در لیست وجود دارد.');
      return;
    }
    
    const updatedList = [...currentList, newDropdownItem.trim()];
    
    updateSettings({
      ...settings,
      dropdownItems: {
        ...settings.dropdownItems,
        [selectedDropdownKey]: updatedList
      }
    });
    setNewDropdownItem('');
  };

  const handleDeleteDropdownItem = (itemToDelete: string) => {
    if (selectedDropdownKey === 'lossReasons') {
      setDeleteType('lossReason');
      setDeleteTargetId(itemToDelete);
      setDeleteTargetName(itemToDelete);
      setDeleteConfirmOpen(true);
      return;
    }

    const currentList = settings.dropdownItems[selectedDropdownKey] || [];
    if (currentList.length <= 1) {
      alert('لیست بازشو نمی‌تواند کاملاً خالی باشد. حداقل یک آیتم باید باقی بماند.');
      return;
    }
    setDeleteType('dropdownItem');
    setDeleteTargetId(itemToDelete);
    setDeleteTargetName(itemToDelete);
    setDeleteConfirmOpen(true);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const exists = (settings.activityCategories || []).some(
      (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (exists) {
      alert('این دسته‌بندی فعالیتی قبلاً تعریف شده است.');
      return;
    }
    const newCat = {
      id: `act-${Date.now()}`,
      name: newCategoryName.trim(),
      module: 'projects'
    };
    updateSettings({
      ...settings,
      activityCategories: [...(settings.activityCategories || []), newCat]
    });
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (projectCategoryGroups.some((g) => g.categoryId === catId)) {
      alert(`دسته‌بندی "${catName}" در پروژه‌ها فعال بوده و قابل حذف نیست.`);
      return;
    }
    setDeleteType('activityCategory');
    setDeleteTargetId(catId);
    setDeleteTargetName(catName);
    setDeleteConfirmOpen(true);
  };

  const handleAddLossReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLossReason.trim()) return;
    if (settings.lossReasons?.includes(newLossReason.trim())) {
      alert('این علت باخت قبلاً تعریف شده است.');
      return;
    }
    const updatedReasons = [...(settings.lossReasons || []), newLossReason.trim()];
    updateSettings({
      ...settings,
      lossReasons: updatedReasons
    });
    setNewLossReason('');
  };

  const handleDeleteLossReason = (reasonToDelete: string) => {
    setDeleteType('lossReason');
    setDeleteTargetId(reasonToDelete);
    setDeleteTargetName(reasonToDelete);
    setDeleteConfirmOpen(true);
  };

  const handleToggleWorkflowActive = (ruleId: string) => {
    const rules = settings.workflows || [];
    const updated = rules.map(r => r.id === ruleId ? { ...r, active: !r.active } : r);
    updateSettings({
      ...settings,
      workflows: updated
    });
  };

  const handleDeleteWorkflowRule = (ruleId: string) => {
    const rules = settings.workflows || [];
    const updated = rules.filter(r => r.id !== ruleId);
    updateSettings({
      ...settings,
      workflows: updated
    });
  };

  const handleSaveWorkflowRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    if (!editingRule.name.trim()) {
      alert('لطفاً نام قانون را وارد کنید.');
      return;
    }
    
    const rules = settings.workflows || [];
    let updatedRules: WorkflowRule[];
    
    if (editingRule.id.startsWith('new-')) {
      const newRule: WorkflowRule = {
        ...editingRule,
        id: `wf-${Date.now()}`
      };
      updatedRules = [...rules, newRule];
    } else {
      updatedRules = rules.map(r => r.id === editingRule.id ? editingRule : r);
    }
    
    updateSettings({
      ...settings,
      workflows: updatedRules
    });
    
    setEditingRule(null);
    setIsRuleFormOpen(false);
  };

  // General settings states
  const [companyName, setCompanyName] = useState(template?.companyName || 'ابزار تامین ارشیا');
  const [address, setAddress] = useState(template?.address || '');
  const [phone, setPhone] = useState(template?.phone || '');
  const [email, setEmail] = useState(template?.email || '');
  const [registrationNumber, setRegistrationNumber] = useState(template?.registrationNumber || '');
  const [nationalId, setNationalId] = useState(template?.nationalCode || '');
  const [logoUrl, setLogoUrl] = useState(template?.logoUrl || '');
  const [companySealUrl, setCompanySealUrl] = useState(template?.companySealUrl || '');
  const [proformaPrefix, setProformaPrefix] = useState(settings.documentFormats.proformaPrefix);
  const [purchaseOrderPrefix, setPurchaseOrderPrefix] = useState(settings.documentFormats.poPrefix);
  const [projectFormat, setProjectFormat] = useState(settings.documentFormats.projectFormat || 'ATA-{YYYY}-{SEQ:3}');
  const [proformaFormat, setProformaFormat] = useState(settings.documentFormats.proformaFormat || 'QT-{PROJECT}-{SEQ:2}');
  const [poFormat, setPoFormat] = useState(settings.documentFormats.poFormat || 'PO-{PROJECT}-{SEQ:3}');
  const [transactionFormat, setTransactionFormat] = useState(settings.documentFormats.transactionFormat || 'TR-{TYPE}-{YYYY}{MM}-{SEQ:3}');
  const [productFormat, setProductFormat] = useState(settings.documentFormats.productFormat || 'EQ-{RAND:5}');
  const [vatPercent, setVatPercent] = useState(10);

  const [isSaved, setIsSaved] = useState(false);

  // Custom Fields manager states
  const [selectedModule, setSelectedModule] = useState<'customers' | 'projects' | 'products' | 'proformas' | 'suppliers' | 'purchaseOrders' | 'transactions' | 'tasks'>('customers');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldUseSeparator, setNewFieldUseSeparator] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const modulesList = [
    { id: 'customers', name: 'مشتریان' },
    { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)' },
    { id: 'products', name: 'کالاها و تجهیزات' },
    { id: 'proformas', name: 'پیش‌فاکتورها' },
    { id: 'suppliers', name: 'تأمین‌کنندگان' },
    { id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان' },
    { id: 'purchaseOrders', name: 'سفارشات خرید خارجی' },
    { id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا' },
    { id: 'afterSalesServices', name: 'خدمات پس از فروش' },
    { id: 'transactions', name: 'دریافت و پرداخت ریالی' },
    { id: 'tasks', name: 'وظایف و پیگیری' },
  ] as const;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentTemplates = settings?.proformaTemplates || [];
    const updatedTemplates = (currentTemplates.length > 0 ? currentTemplates : [template]).map((t, idx) => {
      if (idx === 0) {
        return {
          ...t,
          companyName,
          address,
          phone,
          email,
          registrationNumber,
          nationalCode: nationalId,
          logoUrl,
          companySealUrl
        };
      }
      return t;
    });

    updateSettings({
      ...settings,
      proformaTemplates: updatedTemplates,
      documentFormats: {
        ...settings.documentFormats,
        proformaPrefix,
        poPrefix: purchaseOrderPrefix,
        projectFormat,
        proformaFormat,
        poFormat,
        transactionFormat,
        productFormat
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) {
      alert('لطفاً نام فیلد سفارشی را وارد کنید.');
      return;
    }

    let optionsArray: string[] | undefined = undefined;
    if (newFieldType === 'select') {
      const opts = newFieldOptions.split('\n').map(o => o.trim()).filter(o => o.length > 0);
      if (opts.length === 0) {
        alert('لطفاً حداقل یک گزینه برای لیست بازشو تعریف کنید (هر گزینه در یک خط).');
        return;
      }
      optionsArray = opts;
    }

    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      module: selectedModule,
      name: newFieldName.trim(),
      type: newFieldType,
      required: newFieldRequired,
      useSeparator: newFieldType === 'number' ? newFieldUseSeparator : undefined,
      options: optionsArray
    };

    const currentFields = settings.customFields || [];
    updateSettings({
      ...settings,
      customFields: [...currentFields, newField]
    });

    // Reset Form
    setNewFieldName('');
    setNewFieldRequired(false);
    setNewFieldUseSeparator(false);
    setNewFieldOptions('');
    alert(`فیلد سفارشی "${newField.name}" با موفقیت ایجاد شد.`);
  };

  const handleDeleteCustomField = (fieldId: string) => {
    const field = (settings.customFields || []).find(f => f.id === fieldId);
    const fieldName = field ? field.name : '';
    setDeleteType('customField');
    setDeleteTargetId(fieldId);
    setDeleteTargetName(fieldName);
    setDeleteConfirmOpen(true);
  };

  const currentFields = settings.customFields || [];
  const filteredFields = currentFields.filter(f => f.module === selectedModule);

  const handleConfirmDelete = () => {
    if (deleteType === 'dropdownItem') {
      const currentList = settings.dropdownItems[selectedDropdownKey] || [];
      const updatedList = currentList.filter(item => item !== deleteTargetId);
      updateSettings({
        ...settings,
        dropdownItems: {
          ...settings.dropdownItems,
          [selectedDropdownKey]: updatedList
        }
      });
    } else if (deleteType === 'activityCategory') {
      const updated = (settings.activityCategories || []).filter((cat) => cat.id !== deleteTargetId);
      updateSettings({
        ...settings,
        activityCategories: updated
      });
    } else if (deleteType === 'lossReason') {
      const updatedReasons = (settings.lossReasons || []).filter(r => r !== deleteTargetId);
      updateSettings({
        ...settings,
        lossReasons: updatedReasons
      });
    } else if (deleteType === 'customField') {
      const currentFields = settings.customFields || [];
      updateSettings({
        ...settings,
        customFields: currentFields.filter(f => f.id !== deleteTargetId)
      });
    } else if (deleteType === "clearData") {
      const keysToClear = [
        "erp_customers", "erp_products", "erp_suppliers", "erp_projects", 
        "erp_proformas", "erp_purchase_orders", "erp_transactions", "erp_tasks", 
        "erp_project_category_groups", "erp_supplier_inquiries", "erp_packaging_deliveries",
        "erp_after_sales_services", "erp_module_notifications"
      ];
      
      Promise.all(keysToClear.map(key => 
        fetch(`/api/data/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        })
      )).then(() => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('read_notifications_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        alert("تمامی داده‌ها با موفقیت پاک شدند. لطفاً صفحه را بارگذاری مجدد (Refresh) کنید.");
        window.location.reload();
      }).catch(err => {
        console.error("Failed to clear data on server:", err);
        alert("خطا در پاک کردن داده‌ها!");
      });
    }
    setDeleteConfirmOpen(false);
    setDeleteType(null);
    setDeleteTargetId('');
    setDeleteTargetName('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تنظیمات سیستم و شخصی‌سازی</h1>
          <p className="text-slate-500 text-sm mt-1">مدیریت هویت حقوقی شرکت و تعریف فیلدهای پویا سفارشی برای ماژول‌های مختلف ERP</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'general'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Building size={16} />
          تنظیمات عمومی شرکت
        </button>
        <button
          onClick={() => setActiveTab('customFields')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'customFields'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Sliders size={16} />
          فیلدهای سفارشی
          <span className="bg-sky-100 text-sky-700 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-bold">مدیر</span>
        </button>
        <button
          onClick={() => setActiveTab('activityCategories')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'activityCategories'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Sliders size={16} className="text-sky-500" />
          دسته‌بندی فعالیت‌ها
        </button>
        <button
          onClick={() => setActiveTab('dropdowns')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'dropdowns'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Settings size={16} className="text-amber-500" />
          لیست‌های بازشو
        </button>
        <button
          onClick={() => setActiveTab('sidebarOrder')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'sidebarOrder'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Menu size={16} className="text-teal-500" />
          ترتیب منوی سایدبار
        </button>
        <button
          onClick={() => setActiveTab('moduleResponsibles')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'moduleResponsibles'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <UserCog size={16} className="text-indigo-500" />
          مسئولین ماژول‌ها
        </button>
        {userRole === 'admin' && (
          <button
            onClick={() => setActiveTab('adminNotifications')}
            className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
              activeTab === 'adminNotifications'
                ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Bell size={16} className="text-rose-500" />
            تنظیمات اعلان‌های مدیر
          </button>
        )}
        <button
          onClick={() => setActiveTab('deliveryChecklist')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'deliveryChecklist'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <FileCheck size={16} className="text-emerald-500" />
          چک‌لیست تحویل کالا
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'workflows'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <RefreshCw size={16} className="text-emerald-600" />
          اتوماسیون و ورک‌فلوها
          <span className="bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-bold">جدید</span>
        </button>
        <button
          onClick={() => setActiveTab('auditLog')}
          className={`py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border flex-shrink-0 ${
            activeTab === 'auditLog'
              ? 'bg-sky-50 text-sky-600 border-sky-300 shadow-sm shadow-sky-100'
              : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <History size={16} className="text-violet-500" />
          سابقه اقدامات (Audit Log)
        </button>
      </div>

      {activeTab === 'general' ? (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Col 1: Company Profile settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-150 text-slate-800">
                <Building size={18} className="text-sky-500" />
                <h3 className="font-bold text-sm">مشخصات هویتی و ثبتی شرکت</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Logo Upload & Preview */}
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <label className="text-xs font-bold text-slate-700 block">تصویر لوگو جهت نمایش در سربرگ پیش‌فاکتورها</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    {logoUrl ? (
                      <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center p-1">
                        <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          title="حذف لوگو"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0 text-[10px] font-bold">
                        بدون لوگو
                      </div>
                    )}
                    
                    <div className="flex-1 w-full space-y-2">
                      <div className="relative border border-dashed border-slate-350 hover:border-sky-500 rounded-lg py-2 px-3 text-center cursor-pointer bg-white transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadFile(file);
                                setLogoUrl(url);
                              } catch (err: any) {
                                console.error(err);
                                alert(err.message || 'خطا در بارگذاری تصویر لوگو');
                              }
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <span className="text-xs text-sky-600 font-semibold">بارگذاری فایل لوگو</span>
                      </div>
                      <input
                        type="text"
                        placeholder="یا آدرس اینترنتی (URL) لوگو را وارد کنید..."
                        value={logoUrl.startsWith('data:') ? '' : logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Seal Upload & Preview */}
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <label className="text-xs font-bold text-slate-700 block">تصویر مهر شرکت جهت مهر زدن زیر امضاها</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    {companySealUrl ? (
                      <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center p-1">
                        <img src={companySealUrl} alt="Company Seal" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setCompanySealUrl('')}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          title="حذف مهر شرکت"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0 text-[10px] font-bold">
                        بدون مهر
                      </div>
                    )}
                    
                    <div className="flex-1 w-full space-y-2">
                      <div className="relative border border-dashed border-slate-350 hover:border-sky-500 rounded-lg py-2 px-3 text-center cursor-pointer bg-white transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadFile(file);
                                setCompanySealUrl(url);
                              } catch (err: any) {
                                console.error(err);
                                alert(err.message || 'خطا در بارگذاری تصویر مهر');
                              }
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <span className="text-xs text-sky-600 font-semibold">بارگذاری فایل مهر شرکت</span>
                      </div>
                      <input
                        type="text"
                        placeholder="یا آدرس اینترنتی (URL) مهر را وارد کنید..."
                        value={companySealUrl.startsWith('data:') ? '' : companySealUrl}
                        onChange={(e) => setCompanySealUrl(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">نام رسمی شخصیت حقوقی *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>

                {/* Registration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">شماره ثبت شرکت</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono text-left"
                  />
                </div>

                {/* National ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">شناسه ملی حقوقی</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono text-left"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">شماره تلفن دفتر مرکزی *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono text-left"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">پست الکترونیکی عمومی *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none font-mono text-left"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">آدرس دقیق پستی دفتر مرکزی *</label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>

              </div>
            </div>

            {/* Col 2: Variables and advanced document numbering formats settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-150 text-slate-800">
                <Sliders size={18} className="text-sky-500" />
                <h3 className="font-bold text-sm">متغیرها و فرمت‌های شماره‌گذاری</h3>
              </div>

              <div className="space-y-4">

                {/* Advanced Numbering Formats Header */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">فرمت پیشرفته شماره‌گذاری خودکار اسناد (ERP Standard)</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-4 text-justify">
                    با ترکیب متغیرها و کلمات ثابت، سیستم کدگذاری منحصربه‌فرد خود را بسازید. متغیرهای مجاز:
                    <br />
                    <span className="font-mono text-sky-600 bg-sky-50 px-1 py-0.5 rounded inline-block text-left my-1" style={{ direction: 'ltr' }}>
                      {"{YYYY}"} (سال شمسی)، {"{YY}"} (سال دورقمی)، {"{MM}"} (ماه)، {"{DD}"} (روز)، {"{SEQ:3}"} (سریال ۳ رقمی)، {"{PROJECT}"} (پروژه)، {"{TYPE}"} (نوع دریافت/پرداخت)، {"{RAND:5}"} (تصادفی)
                    </span>
                  </p>
                </div>

                {/* Project Number Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">ساختار کدگذاری پروژه‌ها</label>
                  <input
                    type="text"
                    required
                    value={projectFormat}
                    onChange={(e) => setProjectFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left bg-slate-50 focus:bg-white transition"
                    placeholder="ATA-{YYYY}-{SEQ:3}"
                  />
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>پیش‌فرض: <code className="font-mono">ATA-{"{YYYY}"}-{"{SEQ:3}"}</code></span>
                    <span>مثال: <code className="font-mono text-emerald-600">ATA-1405-001</code></span>
                  </div>
                </div>

                {/* Proforma Number Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">ساختار کدگذاری پیش‌فاکتورها</label>
                  <input
                    type="text"
                    required
                    value={proformaFormat}
                    onChange={(e) => setProformaFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left bg-slate-50 focus:bg-white transition"
                    placeholder="QT-{PROJECT}-{SEQ:2}"
                  />
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>پیش‌فرض: <code className="font-mono">QT-{"{PROJECT}"}-{"{SEQ:2}"}</code></span>
                    <span>مثال: <code className="font-mono text-emerald-600">QT-ATA-1405-001-01</code></span>
                  </div>
                </div>

                {/* PO Number Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">ساختار کدگذاری سفارشات خرید ارزی</label>
                  <input
                    type="text"
                    required
                    value={poFormat}
                    onChange={(e) => setPoFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left bg-slate-50 focus:bg-white transition"
                    placeholder="PO-{PROJECT}-{SEQ:3}"
                  />
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>پیش‌فرض: <code className="font-mono">PO-{"{PROJECT}"}-{"{SEQ:3}"}</code></span>
                    <span>مثال: <code className="font-mono text-emerald-600">PO-ATA-1405-001-001</code></span>
                  </div>
                </div>

                {/* Transaction Number Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">ساختار شماره اسناد دریافت/پرداخت صندوق</label>
                  <input
                    type="text"
                    required
                    value={transactionFormat}
                    onChange={(e) => setTransactionFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left bg-slate-50 focus:bg-white transition"
                    placeholder="TR-{TYPE}-{YYYY}{MM}-{SEQ:3}"
                  />
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>پیش‌فرض: <code className="font-mono">TR-{"{TYPE}"}-{"{YYYY}"}{"{MM}"}-{"{SEQ:3}"}</code></span>
                    <span>مثال: <code className="font-mono text-emerald-600">TR-RC-140504-001</code></span>
                  </div>
                </div>

                {/* Product Code Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 block">ساختار پیش‌فرض کدهای کالا و تجهیزات</label>
                  <input
                    type="text"
                    required
                    value={productFormat}
                    onChange={(e) => setProductFormat(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left bg-slate-50 focus:bg-white transition"
                    placeholder="EQ-{RAND:5}"
                  />
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>پیش‌فرض: <code className="font-mono">EQ-{"{RAND:5}"}</code></span>
                    <span>مثال: <code className="font-mono text-emerald-600">EQ-48912</code></span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Form save footer */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteType('clearData');
                  setDeleteConfirmOpen(true);
                }}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition flex items-center gap-2 border border-red-200"
              >
                <Trash2 size={16} />
                پاکسازی کامل داده‌ها
              </button>
              {isSaved && (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-bounce-short">
                  <CheckCircle2 size={16} />
                  تنظیمات با موفقیت در فضای ابری محلی (LocalStorage) ذخیره شد.
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-sky-500/15 flex items-center gap-2"
            >
              <Save size={16} />
              ذخیره کل پیکربندی
            </button>
          </div>
        </form>
      ) : (
        /* Dynamic Custom Fields Tab contents */
        userRole !== 'admin' ? (
          /* Locked State for non-admin */
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <Lock size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">عدم دسترسی به تنظیمات فیلدهای سفارشی</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                تعریف، تغییر یا حذف ساختار فیلدهای سفارشی ماژول‌ها فقط برای کاربران با نقش <span className="font-bold text-slate-800">مدیر سیستم</span> مجاز است. شما با نقش کاربر عادی وارد شده‌اید.
              </p>
            </div>
            {changeRole && (
              <button
                type="button"
                onClick={() => changeRole('admin')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition shadow-md shadow-amber-500/10"
              >
                شبیه‌سازی و ورود با نقش مدیر سیستم
              </button>
            )}
          </div>
        ) : activeTab === 'customFields' ? (
          /* Authorized Custom Fields Designer */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Sidebar module selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">انتخاب ماژول هدف</h3>
              <p className="text-slate-400 text-[11px]">ماژولی که مایل به مدیریت فیلدهای سفارشی آن هستید را انتخاب کنید:</p>
              
              <div className="space-y-1 pt-1">
                {modulesList.map((m) => {
                  const count = currentFields.filter(f => f.module === m.id).length;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModule(m.id)}
                      className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                        selectedModule === m.id
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{m.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedModule === m.id ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {count} فیلد
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Field designer workspace */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Add Custom Field Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 mb-4 text-slate-800">
                  <Plus size={18} className="text-emerald-500" />
                  <h3 className="font-bold text-sm">
                    تعریف فیلد جدید برای ماژول «{modulesList.find(m => m.id === selectedModule)?.name}»
                  </h3>
                </div>

                <form onSubmit={handleAddCustomField} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Field Label / Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">عنوان فیلد (نام نمایشی) *</label>
                      <input
                        type="text"
                        required
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="مثال: برند موتور، تاریخ ترخیص، کد فنی قطعه"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                      />
                    </div>

                    {/* Field Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">نوع فیلد ورودی *</label>
                      <select
                        value={newFieldType}
                        onChange={(e) => {
                          setNewFieldType(e.target.value as any);
                          setNewFieldUseSeparator(false);
                          setNewFieldOptions('');
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                      >
                        <option value="text">متن کوتاه (یک خطی)</option>
                        <option value="textarea">متن بلند (چند خطی)</option>
                        <option value="number">عددی (با قابلیت فیلترینگ)</option>
                        <option value="select">لیست بازشو (گزینه‌ای)</option>
                        <option value="date">تاریخ شمسی (Shamsi Calendar)</option>
                        <option value="file">پیوست فایل (تصویر یا سند فنی)</option>
                        <option value="boolean">بله / خیر (چک‌باکس)</option>
                      </select>
                    </div>

                    {/* Conditional Select options config */}
                    {newFieldType === 'select' && (
                      <div className="space-y-1.5 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-150">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          تعریف آیتم‌های لیست بازشو *
                        </label>
                        <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                          آیتم‌هایی که کاربر نهایی در فرم قادر به انتخاب آنهاست را تعریف کنید. <strong>هر گزینه را در یک خط جداگانه بنویسید.</strong>
                        </p>
                        <textarea
                          rows={4}
                          required
                          value={newFieldOptions}
                          onChange={(e) => setNewFieldOptions(e.target.value)}
                          placeholder="مثال:&#10;آلمان&#10;ژاپن&#10;ایتالیا&#10;سوئیس"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-mono"
                        />
                      </div>
                    )}

                    {/* Numeric special options */}
                    {newFieldType === 'number' && (
                      <div className="space-y-1.5 md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-center gap-2">
                        <input
                          id="newFieldUseSeparator"
                          type="checkbox"
                          checked={newFieldUseSeparator}
                          onChange={(e) => setNewFieldUseSeparator(e.target.checked)}
                          className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                        />
                        <label htmlFor="newFieldUseSeparator" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                          فعال‌سازی جداکننده سه رقمی برای مبالغ و مقادیر عددی
                        </label>
                      </div>
                    )}

                    {/* Field Required */}
                    <div className="space-y-1.5 md:col-span-2 flex items-center gap-2 pt-2">
                      <input
                        id="newFieldRequired"
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                      />
                      <label htmlFor="newFieldRequired" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        این فیلد اجباری است و تکمیل آن برای ثبت الزامی است (*)
                      </label>
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Plus size={14} />
                      ثبت و اضافه کردن فیلد سفارشی
                    </button>
                  </div>
                </form>
              </div>

              {/* Fields List Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">فیلدهای تعریف شده فعلی ({filteredFields.length} فیلد)</h4>
                
                {filteredFields.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    هیچ فیلد سفارشی برای این ماژول تعریف نشده است.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs divide-y divide-slate-150">
                      <thead>
                        <tr className="text-slate-400 font-semibold bg-slate-50">
                          <th className="py-2.5 px-3">نام فیلد (برچسب)</th>
                          <th className="py-2.5 px-3">نوع فیلد</th>
                          <th className="py-2.5 px-3">وضعیت اعتبار سنجی</th>
                          <th className="py-2.5 px-3 text-left">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFields.map((field) => (
                          <tr key={field.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-bold text-slate-800">{field.name}</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-semibold">
                                {field.type === 'text' && 'متن کوتاه'}
                                {field.type === 'textarea' && 'متن بلند'}
                                {field.type === 'number' && `عددی ${field.useSeparator ? '(با جداکننده هزارگان)' : ''}`}
                                {field.type === 'select' && `لیست بازشو (${field.options?.length || 0} گزینه)`}
                                {field.type === 'date' && 'تاریخ شمسی'}
                                {field.type === 'file' && 'پیوست فایل'}
                                {field.type === 'boolean' && 'بله/خیر (چک‌باکس)'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {field.required ? (
                                <span className="inline-flex px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">
                                  اجباری (*)
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                                  اختیاری
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-left">
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomField(field.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                                title="حذف فیلد سفارشی"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : activeTab === 'dropdowns' ? (
          /* Dropdowns Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-right" dir="rtl">
            
            {/* Sidebar dropdown selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">انتخاب لیست بازشو</h3>
              <p className="text-slate-400 text-[11px]">لیستی که مایل به مدیریت آیتم‌های آن هستید را انتخاب کنید:</p>
              
              <div className="space-y-1 pt-1 max-h-[60vh] overflow-y-auto">
                {allowedDropdownKeys.map((key) => {
                  const count = key === 'lossReasons' 
                    ? (settings.lossReasons || []).length 
                    : (settings.dropdownItems[key as keyof ERPSettings['dropdownItems']] || []).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDropdownKey(key)}
                      className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                        selectedDropdownKey === key
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{dropdownLabels[key]}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedDropdownKey === key ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {count} مورد
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List manager workspace */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Add Dropdown Item Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 mb-4 text-slate-800">
                  <Plus size={18} className="text-amber-500" />
                  <h3 className="font-bold text-sm">
                    مدیریت «{dropdownLabels[selectedDropdownKey]}»
                  </h3>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {dropdownDescriptions[selectedDropdownKey]}
                </p>

                <form onSubmit={handleAddDropdownItem} className="flex gap-3 max-w-lg">
                  <input
                    type="text"
                    required
                    placeholder="عنوان آیتم جدید را وارد کنید..."
                    value={newDropdownItem}
                    onChange={(e) => setNewDropdownItem(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-right"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Plus size={14} />
                    افزودن به لیست
                  </button>
                </form>
              </div>

              {/* Items List Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">
                  آیتم‌های تعریف شده فعلی ({selectedDropdownKey === 'lossReasons' ? (settings.lossReasons || []).length : (settings.dropdownItems[selectedDropdownKey as keyof ERPSettings['dropdownItems']] || []).length} مورد)
                </h4>
                
                <div className="border border-slate-150 rounded-xl overflow-hidden max-w-2xl bg-slate-50/50">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
                        <th className="py-3 px-4 w-16">ردیف</th>
                        <th className="py-3 px-4">عنوان آیتم</th>
                        <th className="py-3 px-4 text-left w-20">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(selectedDropdownKey === 'lossReasons' ? (settings.lossReasons || []) : (settings.dropdownItems[selectedDropdownKey as keyof ERPSettings['dropdownItems']] || [])).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{item}</td>
                          <td className="py-3 px-4 text-left">
                            <button
                              type="button"
                              onClick={() => handleDeleteDropdownItem(item)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                              title="حذف این آیتم"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(selectedDropdownKey === 'lossReasons' ? (settings.lossReasons || []) : (settings.dropdownItems[selectedDropdownKey as keyof ERPSettings['dropdownItems']] || [])).length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-slate-400 bg-white">
                            هیچ آیتمی در این لیست تعریف نشده است.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        ) : activeTab === 'activityCategories' ? (
          /* Activity Categories Tab */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-150 text-slate-800">
              <Sliders size={18} className="text-sky-500" />
              <h3 className="font-bold text-sm">مدیریت دسته‌بندی‌های فعالیت پروژه‌ها (فرصت‌ها)</h3>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              دسته‌بندی‌های مشخص‌شده در این بخش، ساختار ثبت فعالیت‌های روزانه، گزارش کار، تماس‌ها و ارجاعات همکاران در هر پروژه را تشکیل می‌دهند. کاربران برای هر پروژه فقط قادر به ثبت فعالیت در این دسته‌های مشخص خواهند بود و از ایجاد دسته‌بندی تکراری و متفرقه ممانعت به عمل می‌آید.
            </p>

            <form onSubmit={handleAddCategory} className="flex gap-3 max-w-lg">
              <input
                type="text"
                placeholder="مثال: پیگیری استعلام قیمت، تست فنی کارگاهی، ارسال مدارک نهایی"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-right"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus size={14} />
                افزودن دسته‌بندی جدید
              </button>
            </form>

            <div className="hidden md:block border border-slate-150 rounded-xl overflow-hidden max-w-2xl bg-slate-50/50">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
                    <th className="py-3 px-4">ردیف</th>
                    <th className="py-3 px-4">نام دسته‌بندی فعالیت</th>
                    <th className="py-3 px-4">مسئول (تایید کننده اقدامات)</th>
                    <th className="py-3 px-4">وضعیت استفاده در پروژه‌ها</th>
                    <th className="py-3 px-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(settings.activityCategories || []).map((cat, idx) => {
                    const isUsed = (projectCategoryGroups || []).some(g => g.categoryId === cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-white transition bg-white/40">
                        <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{cat.name}</td>
                        <td className="py-3 px-4">
                          <select
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none focus:border-sky-500"
                            value={cat.responsibleUserId || ''}
                            onChange={(e) => {
                              const updatedCats = (settings.activityCategories || []).map(c => 
                                c.id === cat.id ? { ...c, responsibleUserId: e.target.value } : c
                              );
                              updateSettings({ ...settings, activityCategories: updatedCats });
                            }}
                          >
                            <option value="">بدون مسئول خاص</option>
                            {users?.map(u => (
                              <option key={u.id} value={u.fullName}>{u.fullName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {isUsed ? (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              استفاده شده (غیرقابل حذف)
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">بدون استفاده</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-left">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            disabled={isUsed}
                            className={`p-1 rounded transition ${
                              isUsed 
                                ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                                : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title={isUsed ? 'این دسته‌بندی در پروژه‌ها استفاده شده و قابل حذف نیست.' : 'حذف دسته‌بندی'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(settings.activityCategories || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 bg-white">
                        هیچ دسته‌بندی فعالیتی تعریف نشده است. لطفاً حداقل یک مورد را بیفزایید.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {(settings.activityCategories || []).map((cat, idx) => {
                const isUsed = (projectCategoryGroups || []).some(g => g.categoryId === cat.id);
                return (
                  <div key={`mob-${cat.id}`} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-sm relative">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-slate-400 font-mono text-[10px]">ردیف {idx + 1}</span>
                        <h4 className="font-bold text-slate-800 text-sm">{cat.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        disabled={isUsed}
                        className={`p-1.5 rounded-lg transition ${
                          isUsed 
                            ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                            : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                        }`}
                        title={isUsed ? 'این دسته‌بندی در پروژه‌ها استفاده شده و قابل حذف نیست.' : 'حذف دسته‌بندی'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1 font-semibold">مسئول (تایید کننده اقدامات)</span>
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                          value={cat.responsibleUserId || ''}
                          onChange={(e) => {
                            const updatedCats = (settings.activityCategories || []).map(c => 
                              c.id === cat.id ? { ...c, responsibleUserId: e.target.value } : c
                            );
                            updateSettings({ ...settings, activityCategories: updatedCats });
                          }}
                        >
                          <option value="">بدون مسئول خاص</option>
                          {users?.map(u => (
                            <option key={u.id} value={u.fullName}>{u.fullName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-500 font-semibold">وضعیت</span>
                        {isUsed ? (
                          <span className="text-amber-600 bg-amber-100 px-2.5 py-1 rounded-md font-bold text-[10px]">
                            استفاده شده
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[10px]">بدون استفاده</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(settings.activityCategories || []).length === 0 && (
                <div className="text-center py-6 text-slate-400 bg-white border border-slate-200 rounded-xl text-xs font-medium">
                  هیچ دسته‌بندی فعالیتی تعریف نشده است. لطفاً حداقل یک مورد را بیفزایید.
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'sidebarOrder' ? (
          /* Sidebar Module Order Tab */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Menu size={18} className="text-sky-500" />
                <div>
                  <h3 className="font-bold text-sm">ترتیب چیدمان منوی سایدبار</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">ترتیب نمایش ماژول‌ها در سایدبار سمت راست را به سلیقه خود تنظیم کنید.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('آیا مایلید ترتیب منو به حالت پیش‌فرض سیستم بازگردد؟')) {
                    updateSettings({
                      ...settings,
                      sidebarModuleOrder: [
                        'dashboard',
                        'customers',
                        'projects',
                        'proformas',
                        'products',
                        'suppliers',
                        'supplierInquiries',
                        'purchaseOrders',
                        'packagingDelivery',
                        'afterSalesServices',
                        'transactions',
                        'rates',
                        'tasks',
                        'referrals',
                        'users',
                        'settings'
                      ]
                    });
                  }
                }}
                className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-lg transition font-semibold"
              >
                بازنشانی به چیدمان پیش‌فرض
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(() => {
                const ALL_MODULES = [
                  { id: 'dashboard', name: 'داشبورد', desc: 'خلاصه وضعیت، آمارهای کلیدی و نمودارهای سریع سیستم', icon: LayoutDashboard },
                  { id: 'customers', name: 'مشتریان', desc: 'مدیریت پرونده‌های خریداران حقیقی و حقوقی و ارتباطات آن‌ها', icon: Users },
                  { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)', desc: 'کنترل فازها، فعالیت‌ها و ارجاعات مربوط به هر فرصت تجاری', icon: Briefcase },
                  { id: 'proformas', name: 'پیش‌فاکتورها', desc: 'صدور و پیگیری پیشنهادهای مالی فنی برای مشتریان', icon: FileText },
                  { id: 'products', name: 'کالاها و تجهیزات', desc: 'انبارداری، موجودی کالاها و ابزار دقیق شرکت', icon: Package },
                  { id: 'suppliers', name: 'تأمین‌کنندگان', desc: 'مدیریت وندورها و سازندگان داخلی و خارجی کالا', icon: Truck },
                  { id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', desc: 'مدیریت استعلام‌های قیمتی تامین‌کنندگان کالا، مقایسه پیشنهادات و آفرها', icon: HelpCircle },
                  { id: 'purchaseOrders', name: 'سفارشات خرید خارجی', desc: 'پیگیری مراحل پروفرمای خرید، حمل و ترخیص گمرکی', icon: ShoppingCart },
                  { id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', desc: 'مدیریت پکینگ‌لیست‌ها و تحویل محموله‌ها به مشتری', icon: Boxes },
                  { id: 'afterSalesServices', name: 'خدمات پس از فروش', desc: 'رسیدگی به درخواست‌ها و پشتیبانی پس از فروش و گارانتی', icon: Wrench },
                  { id: 'transactions', name: 'دریافت و پرداخت ریالی', desc: 'ثبت و کنترل تراکنش‌های مالی ریالی و صندوق شرکت', icon: ArrowDownLeft },
                  { id: 'rates', name: 'نرخ ارز روزانه', desc: 'ثبت نرخ‌های روزانه ارزهای دلار، یورو و درهم', icon: TrendingUp },
                  { id: 'tasks', name: 'وظایف و پیگیری', desc: 'مدیریت کارها، ددلاین‌ها و پیگیری‌های پرسنل فروش و فنی', icon: CheckSquare },
                  { id: 'referrals', name: 'کارتابل ارجاعات کار', desc: 'صندوق ورودی ارجاع امور فنی و بازرگانی پروژه‌ها بین همکاران', icon: Inbox },
                  { id: 'users', name: 'مدیریت کاربران', desc: 'تعریف پرسنل، نقش‌ها و تنظیمات دسترسی به هر ماژول', icon: ShieldCheck },
                  { id: 'settings', name: 'تنظیمات سیستم', desc: 'شخصی‌سازی فیلدها، دسته‌بندی‌ها و قالب‌های اسناد رسمی', icon: Settings },
                ];

                const currentOrder = [...(settings.sidebarModuleOrder || [])];
                ALL_MODULES.forEach(m => {
                  if (!currentOrder.includes(m.id)) {
                    currentOrder.push(m.id);
                  }
                });

                return currentOrder.map((id, index) => {
                  const mod = ALL_MODULES.find(m => m.id === id);
                  if (!mod) return null;
                  const IconComponent = mod.icon;
                  const isFirst = index === 0;
                  const isLast = index === currentOrder.length - 1;

                  const handleMoveModule = (direction: 'up' | 'down') => {
                    const newOrder = [...currentOrder];
                    const targetIndex = direction === 'up' ? index - 1 : index + 1;
                    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
                    
                    // Swap elements
                    const temp = newOrder[index];
                    newOrder[index] = newOrder[targetIndex];
                    newOrder[targetIndex] = temp;

                    updateSettings({
                      ...settings,
                      sidebarModuleOrder: newOrder
                    });
                  };

                  return (
                    <div 
                      key={id} 
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 hover:border-sky-200 rounded-xl hover:bg-sky-50/10 transition duration-150 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Order Badge */}
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-200/60 group-hover:bg-sky-100 text-[11px] font-extrabold text-slate-500 group-hover:text-sky-700 transition">
                          {index + 1}
                        </div>

                        {/* Module Icon & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600">
                              <IconComponent size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-800">{mod.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed truncate" title={mod.desc}>
                            {mod.desc}
                          </p>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex flex-col gap-1 shrink-0 ml-1">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveModule('up')}
                          className={`p-1 rounded-md border transition ${
                            isFirst 
                              ? 'text-slate-300 border-slate-100 bg-slate-50/50 cursor-not-allowed' 
                              : 'text-slate-600 border-slate-200 bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                          }`}
                          title="انتقال به بالا"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveModule('down')}
                          className={`p-1 rounded-md border transition ${
                            isLast 
                              ? 'text-slate-300 border-slate-100 bg-slate-50/50 cursor-not-allowed' 
                              : 'text-slate-600 border-slate-200 bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                          }`}
                          title="انتقال به پایین"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ) : activeTab === 'moduleResponsibles' ? (
          /* Module Responsibles Tab */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-150 text-slate-800">
              <UserCog size={18} className="text-sky-500" />
              <h3 className="font-bold text-sm">تعیین مسئولین ماژول‌ها</h3>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              با تعیین مسئول برای هر ماژول، تمامی تغییرات و ثبت‌های جدید در آن ماژول مستقیماً به عنوان یک اعلان در تب "اعلان‌های ماژول‌ها" در کارتابل ارجاعات مسئول مربوطه نمایش داده خواهد شد.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'customers', name: 'مشتریان' },
                { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)' },
                { id: 'products', name: 'کالاها و تجهیزات' },
                { id: 'proformas', name: 'پیش‌فاکتورها' },
                { id: 'suppliers', name: 'تأمین‌کنندگان' },
                { id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان' },
                { id: 'purchaseOrders', name: 'سفارشات خرید خارجی' },
                { id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا' },
                { id: 'afterSalesServices', name: 'خدمات پس از فروش' },
                { id: 'transactions', name: 'تراکنش‌های مالی' },
                { id: 'tasks', name: 'وظایف و پیگیری' }
              ].map(mod => (
                <div key={mod.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="font-bold text-sm text-slate-800">{mod.name}</div>
                  <select
                    value={settings.moduleResponsibles?.[mod.id] || ''}
                    onChange={(e) => {
                      updateSettings({
                        ...settings,
                        moduleResponsibles: {
                          ...(settings.moduleResponsibles || {}),
                          [mod.id]: e.target.value
                        }
                      });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                  >
                    <option value="">بدون مسئول مشخص</option>
                    {users.map(u => (
                      <option key={u.id} value={u.fullName}>
                        {u.fullName} ({u.role === 'admin' ? 'مدیر' : 'کاربر'})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'adminNotifications' && userRole === 'admin' && currentUser ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Bell size={18} className="text-rose-500" />
                <div>
                  <h3 className="font-bold text-sm">تنظیمات اعلان‌های سیستم (مخصوص مدیر)</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">مدیریت دریافت اعلان‌های تمام ماژول‌ها و پروژه‌ها</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-700 block">دریافت همه اعلان‌ها</span>
                  <span className="text-xs text-slate-500 block">آیا می‌خواهید اعلان تمامی بخش‌ها و پروژه‌ها را دریافت کنید؟</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentPrefs = settings.adminNotificationPreferences || {};
                    const userPrefs = currentPrefs[currentUser.id] || { receiveAll: true, importantProjectIds: [] };
                    
                    updateSettings({
                      ...settings,
                      adminNotificationPreferences: {
                        ...currentPrefs,
                        [currentUser.id]: {
                          ...userPrefs,
                          receiveAll: !userPrefs.receiveAll
                        }
                      }
                    });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    (settings.adminNotificationPreferences?.[currentUser.id]?.receiveAll ?? true) 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    (settings.adminNotificationPreferences?.[currentUser.id]?.receiveAll ?? true) 
                      ? 'left-1' 
                      : 'left-7'
                  }`} />
                </button>
              </div>

              {!(settings.adminNotificationPreferences?.[currentUser.id]?.receiveAll ?? true) && (
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-700 block">پروژه‌های مهم</span>
                    <span className="text-xs text-slate-500 block">در صورتی که دریافت همه اعلان‌ها غیرفعال باشد، فقط اعلان‌های مربوط به پروژه‌های انتخاب شده زیر را دریافت خواهید کرد.</span>
                  </div>
                  
                  <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {projects.map(proj => {
                      const userPrefs = settings.adminNotificationPreferences?.[currentUser.id] || { receiveAll: false, importantProjectIds: [] };
                      const isSelected = userPrefs.importantProjectIds.includes(proj.id);
                      
                      return (
                        <label key={proj.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newImportant = e.target.checked
                                ? [...userPrefs.importantProjectIds, proj.id]
                                : userPrefs.importantProjectIds.filter(id => id !== proj.id);
                                
                              updateSettings({
                                ...settings,
                                adminNotificationPreferences: {
                                  ...(settings.adminNotificationPreferences || {}),
                                  [currentUser.id]: {
                                    ...userPrefs,
                                    importantProjectIds: newImportant
                                  }
                                }
                              });
                            }}
                            className="rounded text-sky-500 focus:ring-sky-500 w-4 h-4"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-bold text-slate-700 block">{proj.name}</span>
                            <span className="text-[10px] text-slate-500">{proj.code} - {proj.customerName}</span>
                          </div>
                        </label>
                      );
                    })}
                    {projects.length === 0 && (
                      <div className="text-center p-4 text-xs text-slate-500 bg-slate-50 rounded-lg">
                        هیچ پروژه‌ای در سیستم ثبت نشده است.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'deliveryChecklist' ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-150 text-slate-800">
              <FileCheck size={18} className="text-emerald-500" />
              <h3 className="font-bold text-sm">چک‌لیست تحویل کالا (الگو)</h3>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              در این بخش می‌توانید آیتم‌های پیش‌فرضی که همکاران باید هنگام بسته‌بندی و تحویل کالا بررسی و تیک بزنند را تعریف کنید.
            </p>
            
            <div className="space-y-4 max-w-xl">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const text = formData.get('itemText') as string;
                  if (!text.trim()) return;
                  
                  const currentTemplate = settings.deliveryChecklistTemplate || [];
                  const newItem = text.trim();
                  
                  updateSettings({
                    ...settings,
                    deliveryChecklistTemplate: [...currentTemplate, newItem]
                  });
                  form.reset();
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  name="itemText"
                  required
                  placeholder="آیتم جدید چک‌لیست (مثال: بررسی صحت پلاک مشخصات کالا)"
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <button 
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  افزودن به الگو
                </button>
              </form>

              <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/30">
                {settings.deliveryChecklistTemplate && settings.deliveryChecklistTemplate.length > 0 ? (
                  <div className="divide-y divide-slate-150">
                    {settings.deliveryChecklistTemplate.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white text-slate-700 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">{index + 1}.</span>
                          <span className="text-xs font-medium text-slate-700">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = settings.deliveryChecklistTemplate.filter((_, idx) => idx !== index);
                            updateSettings({
                              ...settings,
                              deliveryChecklistTemplate: updated
                            });
                          }}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                          title="حذف آیتم"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    آیتمی در چک‌لیست تعریف نشده است. لطفاً آیتم‌های مورد نیاز خود را به الگو اضافه کنید.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'auditLog' ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150">
              <div className="flex items-center gap-2 text-slate-800">
                <History size={18} className="text-violet-500" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">دفتر ثبت سوابق و لاگ تغییرات سیستم (System Audit Log)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">ثبت و بایگانی تمام اقدامات کاربران به همراه تغییرات فیلدها با فشرده‌سازی فشرده LZW</p>
                </div>
              </div>
              <div className="text-[10px] bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded font-bold text-slate-600">
                مجموع لاگ‌های ثبت شده: {auditLogs.length.toLocaleString('fa-IR')} مورد
              </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">جستجو در توضیحات</label>
                <input
                  type="text"
                  placeholder="جستجوی کلمه کلیدی..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">فیلتر بخش/ماژول</label>
                <select
                  value={logModuleFilter}
                  onChange={(e) => setLogModuleFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none bg-white font-medium"
                >
                  <option value="all">همه بخش‌ها</option>
                  <option value="مشتریان">مشتریان</option>
                  <option value="پروژه‌ها">پروژه‌ها</option>
                  <option value="کالاها و تجهیزات">کالاها و تجهیزات</option>
                  <option value="تأمین‌کنندگان">تأمین‌کنندگان</option>
                  <option value="پیش‌فاکتورها">پیش‌فاکتورها</option>
                  <option value="فعالیت پروژه‌ها">فعالیت پروژه‌ها</option>
                  <option value="وظایف/پیگیری‌ها">وظایف/پیگیری‌ها</option>
                  <option value="بسته‌بندی و ارسال">بسته‌بندی و ارسال</option>
                  <option value="خدمات پس از فروش">خدمات پس از فروش</option>
                  <option value="ارز و نرخ برابری">ارز و نرخ برابری</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">فیلتر نوع تغییر</label>
                <select
                  value={logActionFilter}
                  onChange={(e) => setLogActionFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none bg-white font-medium"
                >
                  <option value="all">همه تغییرات</option>
                  <option value="CREATE">ایجاد جدید (CREATE)</option>
                  <option value="UPDATE">ویرایش و تغییرات (UPDATE)</option>
                  <option value="DELETE">حذف اطلاعات (DELETE)</option>
                </select>
              </div>
            </div>

            {/* List of Logs */}
            <div className="space-y-3">
              {(() => {
                const filtered = auditLogs.filter(log => {
                  const matchSearch = !logSearch || 
                    (log.description || '').toLowerCase().includes(logSearch.toLowerCase()) || 
                    (log.userFullName || '').toLowerCase().includes(logSearch.toLowerCase()) || 
                    (log.entityId || '').toLowerCase().includes(logSearch.toLowerCase());
                  const matchModule = logModuleFilter === 'all' || log.module === logModuleFilter;
                  const matchAction = logActionFilter === 'all' || log.action === logActionFilter;
                  return matchSearch && matchModule && matchAction;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      هیچ لاگ یا سابقه‌ای یافت نشد.
                    </div>
                  );
                }

                // Internal human-readable field comparison helper
                const renderObjectDiff = (compressedBefore?: string, compressedAfter?: string, action?: string) => {
                  let beforeObj: any = null;
                  let afterObj: any = null;

                  if (compressedBefore) {
                    try {
                      const raw = decompressLZW(compressedBefore);
                      beforeObj = raw ? JSON.parse(raw) : null;
                    } catch (e) {
                      console.error("Failed to parse decompressed beforeState:", e);
                    }
                  }

                  if (compressedAfter) {
                    try {
                      const raw = decompressLZW(compressedAfter);
                      afterObj = raw ? JSON.parse(raw) : null;
                    } catch (e) {
                      console.error("Failed to parse decompressed afterState:", e);
                    }
                  }

                  if (!beforeObj && !afterObj) {
                    return (
                      <span className="text-slate-400 text-[10px]">اطلاعات جزئی بیشتری برای این عملیات موجود نیست.</span>
                    );
                  }

                  if (action === 'DELETE' && beforeObj) {
                    return (
                      <div className="bg-rose-50/40 border border-rose-100 rounded-lg p-3 text-xs space-y-2 text-right">
                        <span className="font-bold text-rose-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                          مشخصات رکورد حذف شده:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded border border-rose-100/50 text-slate-600 font-medium leading-relaxed max-h-48 overflow-y-auto">
                          {Object.entries(beforeObj)
                            .filter(([_, v]) => v !== null && v !== undefined && typeof v !== 'object')
                            .map(([k, v]) => {
                              const labelMap: Record<string, string> = {
                                name: 'نام', title: 'عنوان', code: 'کد سند', description: 'توضیحات',
                                customerName: 'مشتری', totalAmount: 'مبلغ کل', phone: 'تلفن'
                              };
                              return (
                                <div key={k} className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-slate-400">{labelMap[k] || k}:</span>
                                  <span className="text-slate-700 font-mono" style={{ unicodeBidi: 'plaintext' }}>{String(v)}</span>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    );
                  }

                  if (action === 'CREATE' && afterObj) {
                    return (
                      <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3 text-xs space-y-2 text-right">
                        <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          مشخصات رکورد ثبت شده:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded border border-emerald-100/50 text-slate-600 font-medium leading-relaxed max-h-48 overflow-y-auto">
                          {Object.entries(afterObj)
                            .filter(([_, v]) => v !== null && v !== undefined && typeof v !== 'object')
                            .map(([k, v]) => {
                              const labelMap: Record<string, string> = {
                                name: 'نام', title: 'عنوان', code: 'کد سند', description: 'توضیحات',
                                customerName: 'مشتری', totalAmount: 'مبلغ کل', phone: 'تلفن'
                              };
                              return (
                                <div key={k} className="flex justify-between border-b border-slate-100 pb-1">
                                  <span className="text-slate-400">{labelMap[k] || k}:</span>
                                  <span className="text-slate-700 font-mono" style={{ unicodeBidi: 'plaintext' }}>{String(v)}</span>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    );
                  }

                  if (action === 'UPDATE' && (beforeObj || afterObj)) {
                    const diffs: { field: string; from: string; to: string }[] = [];
                    const fieldMap: Record<string, string> = {
                      name: 'نام',
                      title: 'عنوان',
                      text: 'متن',
                      status: 'وضعیت',
                      description: 'توضیحات',
                      phone: 'تلفن',
                      email: 'ایمیل',
                      address: 'آدرس',
                      industry: 'صنعت',
                      financialContact: 'رابط مالی',
                      technicalContact: 'رابط فنی',
                      salesExpert: 'کارشناس فروش',
                      price: 'قیمت',
                      quantity: 'تعداد',
                      stockLevel: 'موجودی انبار',
                      buyingPrice: 'قیمت خرید',
                      sellingPrice: 'قیمت فروش',
                      currency: 'واحد پولی',
                      totalAmount: 'مبلغ کل',
                      assignedTo: 'ارجاع به / کارشناس مسئول',
                      actionRequired: 'اقدام مورد نیاز',
                      assignedBy: 'ارجاع‌دهنده',
                      companyName: 'نام شرکت',
                      economicCode: 'کد اقتصادی',
                      nationalCode: 'شناسه ملی',
                      registrationNumber: 'شماره ثبت'
                    };

                    const bKeys = beforeObj ? Object.keys(beforeObj) : [];
                    const aKeys = afterObj ? Object.keys(afterObj) : [];
                    const allKeys = Array.from(new Set([...bKeys, ...aKeys]));

                    for (const key of allKeys) {
                      if (['id', 'createdAt', 'updatedAt', 'creationDate', 'lastActive', 'password'].includes(key)) continue;
                      const valBefore = beforeObj?.[key];
                      const valAfter = afterObj?.[key];
                      
                      if (typeof valBefore === 'object' || typeof valAfter === 'object') continue;

                      if (valBefore !== valAfter) {
                        diffs.push({
                          field: fieldMap[key] || key,
                          from: valBefore !== undefined && valBefore !== null && valBefore !== '' ? String(valBefore) : '—',
                          to: valAfter !== undefined && valAfter !== null && valAfter !== '' ? String(valAfter) : '—'
                        });
                      }
                    }

                    if (diffs.length === 0) {
                      return (
                        <span className="text-slate-400 text-[10px]">تغییراتی در فیلدهای اصلی شناسایی نشد یا تغییرات مربوط به جداول فرعی است.</span>
                      );
                    }

                    return (
                      <div className="bg-amber-50/30 border border-amber-100 rounded-lg p-3 text-xs space-y-2 text-right">
                        <span className="font-bold text-amber-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                          فیلدهای تغییر یافته:
                        </span>
                        <div className="space-y-2">
                          {diffs.map((d, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100 font-medium">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{d.field}</span>
                              <span className="text-slate-400">از</span>
                              <span className="text-rose-600 line-through bg-rose-50/50 px-1 rounded font-mono">{d.from}</span>
                              <span className="text-slate-400">← به</span>
                              <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-bold font-mono">{d.to}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                };

                return (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150">
                    {filtered.map((log) => {
                      const isExpanded = expandedLogId === log.id;
                      return (
                        <div key={log.id} className="bg-white hover:bg-slate-50/50 transition duration-150">
                          {/* Log Main Bar */}
                          <div
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-3">
                              {/* Action Badge */}
                              <span className={`px-2 py-1 rounded text-[9px] font-bold tracking-wider font-mono shrink-0 ${
                                log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}>
                                {log.action}
                              </span>

                              {/* Module Badge */}
                              <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                                {log.module}
                              </span>

                              {/* Action Description */}
                              <span className="text-slate-700 font-semibold text-xs leading-relaxed">
                                {log.description}
                              </span>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 mr-auto shrink-0 font-medium">
                              {/* User Info */}
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                                <UserCog size={10} className="text-slate-500" />
                                {log.userFullName}
                              </span>

                              {/* Date Time */}
                              <span className="font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                                {log.timestamp}
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details Diff */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 bg-slate-50/30 border-t border-slate-150 animate-fade-in space-y-3">
                              {renderObjectDiff(log.beforeState, log.afterState, log.action)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : activeTab === 'workflows' ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-800">قوانین گردش‌کار هوشمند (ورک‌فلو)</h3>
                <p className="text-slate-500 text-xs mt-1">
                  اتوماسیون اقدامات سیستمی مانند ایجاد وظایف یا ارسال اعلان‌های خودکار بر اساس رویدادهای سیستم
                </p>
              </div>
              {!isRuleFormOpen && (
                <button
                  onClick={() => {
                    setEditingRule({
                      id: `new-${Date.now()}`,
                      name: '',
                      active: true,
                      triggerType: 'proforma_outcome_change',
                      conditions: [
                        { field: 'newOutcome', operator: 'equals', value: 'تأیید شده (برنده)' }
                      ],
                      actions: [
                        {
                          type: 'create_task',
                          taskConfig: {
                            titleTemplate: 'پیگیری سفارش خرید پروژه {projectName}',
                            descTemplate: 'پیش‌فاکتور شماره {proformaNumber} برنده شده است. لطفا هماهنگی‌های لازم جهت ثبت سفارش خرید خارجی را انجام دهید.',
                            assignedTo: 'MODULE_RESPONSIBLE_purchaseOrders',
                            priority: 'بالا',
                            dueDaysOffset: 3
                          }
                        }
                      ]
                    });
                    setIsRuleFormOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  ایجاد قانون جدید
                </button>
              )}
            </div>

            {isRuleFormOpen && editingRule ? (
              <form onSubmit={handleSaveWorkflowRule} className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-bold mb-2">نام قانون ورک‌فلو <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                      placeholder="مثال: ایجاد خودکار تسک سفارش خرید پس از برنده شدن پیش‌فاکتور"
                      className="w-full text-xs md:text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-sky-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold mb-2">نوع رویداد تحریک‌کننده (Trigger)</label>
                    <select
                      value={editingRule.triggerType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        let defaultField = 'newOutcome';
                        let defaultValue = 'تأیید شده (برنده)';
                        if (val === 'project_status_change') {
                          defaultField = 'newStatus';
                          defaultValue = 'برنده شده';
                        } else if (val === 'purchase_order_status_change') {
                          defaultField = 'newStatus';
                          defaultValue = 'تحویل شده (رسید انبار)';
                        }
                        setEditingRule({
                          ...editingRule,
                          triggerType: val,
                          conditions: [
                            { field: defaultField, operator: 'equals', value: defaultValue }
                          ]
                        });
                      }}
                      className="w-full text-xs md:text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-sky-500 bg-white"
                    >
                      <option value="proforma_outcome_change">تغییر وضعیت نهایی پیش‌فاکتور</option>
                      <option value="project_status_change">تغییر وضعیت پروژه</option>
                      <option value="purchase_order_status_change">تغییر وضعیت سفارش خرید</option>
                    </select>
                  </div>
                </div>

                {/* Status Switch */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="workflow_active_checkbox"
                    checked={editingRule.active}
                    onChange={(e) => setEditingRule({ ...editingRule, active: e.target.checked })}
                    className="rounded text-sky-500 focus:ring-sky-500 h-4 w-4"
                  />
                  <label htmlFor="workflow_active_checkbox" className="text-slate-700 text-xs font-bold cursor-pointer select-none">
                    این قانون فعال باشد
                  </label>
                </div>

                {/* Conditions Block */}
                <div className="border border-slate-200 rounded-2xl bg-white p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <Sliders size={14} className="text-sky-500" />
                      شرط‌های اجرا (Conditions) - اجرای قانون در صورت برقراری همه شرایط
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const fieldMap: Record<string, string> = {
                          proforma_outcome_change: 'newOutcome',
                          project_status_change: 'newStatus',
                          purchase_order_status_change: 'newStatus'
                        };
                        const conds = editingRule.conditions || [];
                        setEditingRule({
                          ...editingRule,
                          conditions: [
                            ...conds,
                            { field: fieldMap[editingRule.triggerType] || 'newOutcome', operator: 'equals', value: '' }
                          ]
                        });
                      }}
                      className="text-sky-600 hover:text-sky-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={14} />
                      افزودن شرط جدید
                    </button>
                  </div>

                  {editingRule.conditions.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs">
                      هیچ شرطی تعریف نشده است. این قانون در صورت وقوع رویداد همواره اجرا خواهد شد.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingRule.conditions.map((cond, condIdx) => {
                        // Options for select
                        let fieldOptions: { value: string; label: string }[] = [];
                        let valueOptions: string[] = [];

                        if (editingRule.triggerType === 'proforma_outcome_change') {
                          fieldOptions = [
                            { value: 'newOutcome', label: 'وضعیت نهایی جدید پیش‌فاکتور' },
                            { value: 'oldOutcome', label: 'وضعیت نهایی قبلی پیش‌فاکتور' }
                          ];
                          valueOptions = ['تأیید شده (برنده)', 'نیمه برنده', 'باخته', 'لغو شده', 'در حال بررسی', 'پیش‌نویس'];
                        } else if (editingRule.triggerType === 'project_status_change') {
                          fieldOptions = [
                            { value: 'newStatus', label: 'وضعیت جدید پروژه' },
                            { value: 'oldStatus', label: 'وضعیت قبلی پروژه' }
                          ];
                          valueOptions = ['پیشنهاد فنی مالی', 'در دست بررسی', 'برنده شده', 'باخته شده'];
                        } else if (editingRule.triggerType === 'purchase_order_status_change') {
                          fieldOptions = [
                            { value: 'newStatus', label: 'وضعیت جدید سفارش خرید' },
                            { value: 'oldStatus', label: 'وضعیت قبلی سفارش خرید' }
                          ];
                          valueOptions = ['پیش‌نویس', 'در انتظار تأیید', 'تأیید شده', 'ارسال شده', 'تحویل شده (رسید انبار)', 'لغو شده'];
                        }

                        return (
                          <div key={condIdx} className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150 animate-fade-in text-xs">
                            <span className="text-slate-500 font-medium">اگر</span>
                            <select
                              value={cond.field}
                              onChange={(e) => {
                                const updatedConds = [...editingRule.conditions];
                                updatedConds[condIdx].field = e.target.value;
                                setEditingRule({ ...editingRule, conditions: updatedConds });
                              }}
                              className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500"
                            >
                              {fieldOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>

                            <select
                              value={cond.operator}
                              onChange={(e) => {
                                const updatedConds = [...editingRule.conditions];
                                updatedConds[condIdx].operator = e.target.value as any;
                                setEditingRule({ ...editingRule, conditions: updatedConds });
                              }}
                              className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500"
                            >
                              <option value="equals">برابر باشد با</option>
                              <option value="not_equals">مخالف باشد با</option>
                            </select>

                            <select
                              value={cond.value}
                              onChange={(e) => {
                                const updatedConds = [...editingRule.conditions];
                                updatedConds[condIdx].value = e.target.value;
                                setEditingRule({ ...editingRule, conditions: updatedConds });
                              }}
                              className="border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-sky-500"
                            >
                              <option value="">-- انتخاب مقدار --</option>
                              {valueOptions.map(val => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                const updatedConds = editingRule.conditions.filter((_, idx) => idx !== condIdx);
                                setEditingRule({ ...editingRule, conditions: updatedConds });
                              }}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 mr-auto flex items-center justify-center"
                              title="حذف شرط"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Actions Block */}
                <div className="border border-slate-200 rounded-2xl bg-white p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <RefreshCw size={14} className="text-emerald-500" />
                      اقدامات خودکار (Actions)
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const acts = editingRule.actions || [];
                        setEditingRule({
                          ...editingRule,
                          actions: [
                            ...acts,
                            {
                              type: 'create_task',
                              taskConfig: {
                                titleTemplate: 'وظیفه جدید پروژه {projectName}',
                                descTemplate: 'توضیحات وظیفه مربوط به پروژه {projectName}',
                                assignedTo: 'MODULE_RESPONSIBLE_purchaseOrders',
                                priority: 'متوسط',
                                dueDaysOffset: 3
                              }
                            }
                          ]
                        });
                      }}
                      className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={14} />
                      افزودن اقدام جدید
                    </button>
                  </div>

                  {editingRule.actions.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                      حداقل یک اقدام برای این ورک‌فلو باید تعریف کنید.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingRule.actions.map((act, actIdx) => {
                        return (
                          <div key={actIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in space-y-3 relative text-xs">
                            <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                              <div className="flex items-center gap-2 font-bold text-slate-700">
                                <span>اقدام #{actIdx + 1}:</span>
                                <select
                                  value={act.type}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    const updatedActs = [...editingRule.actions];
                                    if (val === 'create_task') {
                                      updatedActs[actIdx] = {
                                        type: 'create_task',
                                        taskConfig: {
                                          titleTemplate: 'پیگیری برای پروژه {projectName}',
                                          descTemplate: 'توضیحات برای پروژه {projectName}',
                                          assignedTo: 'MODULE_RESPONSIBLE_purchaseOrders',
                                          priority: 'متوسط',
                                          dueDaysOffset: 3
                                        }
                                      };
                                    } else {
                                      updatedActs[actIdx] = {
                                        type: 'send_notification',
                                        notificationConfig: {
                                          module: 'purchaseOrders',
                                          titleTemplate: 'اطلاع‌رسانی پروژه {projectName}',
                                          descTemplate: 'وضعیت جدید پروژه {projectName} به {newStatus} تغییر یافت.'
                                        }
                                      };
                                    }
                                    setEditingRule({ ...editingRule, actions: updatedActs });
                                  }}
                                  className="border border-slate-200 rounded-lg p-1.5 bg-white text-xs"
                                >
                                  <option value="create_task">ایجاد وظیفه جدید (تسک)</option>
                                  <option value="send_notification">ارسال اعلان درون‌برنامه‌ای</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const updatedActs = editingRule.actions.filter((_, idx) => idx !== actIdx);
                                  setEditingRule({ ...editingRule, actions: updatedActs });
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50"
                                title="حذف اقدام"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Show Token Helpers */}
                            <div className="bg-sky-50 text-sky-800 p-2.5 rounded-lg border border-sky-100 flex flex-wrap items-center gap-2 text-[10px]">
                              <span className="font-bold">متغیرهای پویا قابل استفاده در قالب‌ها:</span>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{projectName}'}</code>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{projectCode}'}</code>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{proformaNumber}'}</code>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{poNumber}'}</code>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{newStatus}'}</code>
                              <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 cursor-pointer">{'{newOutcome}'}</code>
                            </div>

                            {act.type === 'create_task' && act.taskConfig && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">قالب عنوان وظیفه <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    value={act.taskConfig.titleTemplate}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].taskConfig!.titleTemplate = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">مسئول انجام وظیفه</label>
                                  <select
                                    value={act.taskConfig.assignedTo}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].taskConfig!.assignedTo = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                  >
                                    <optgroup label="سمت‌های پویا">
                                      <option value="SALES_EXPERT">کارشناس فروش پروژه</option>
                                      <option value="MODULE_RESPONSIBLE_purchaseOrders">مسئول ماژول سفارش خرید</option>
                                      <option value="MODULE_RESPONSIBLE_proformas">مسئول ماژول پیش‌فاکتورها</option>
                                      <option value="MODULE_RESPONSIBLE_projects">مسئول ماژول پروژه‌ها</option>
                                      <option value="MODULE_RESPONSIBLE_afterSales">مسئول خدمات پس از فروش</option>
                                    </optgroup>
                                    <optgroup label="کاربران سیستم">
                                      {users.map(u => (
                                        <option key={u.id} value={u.fullName}>{u.fullName}</option>
                                      ))}
                                    </optgroup>
                                  </select>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">قالب توضیحات وظیفه</label>
                                  <textarea
                                    value={act.taskConfig.descTemplate}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].taskConfig!.descTemplate = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    rows={2}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">اولویت وظیفه</label>
                                  <select
                                    value={act.taskConfig.priority}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].taskConfig!.priority = e.target.value as any;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                  >
                                    <option value="پایین">پایین</option>
                                    <option value="متوسط">متوسط</option>
                                    <option value="بالا">بالا</option>
                                    <option value="فوری">فوری</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">مهلت انجام (تعداد روز بعد از رویداد)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    value={act.taskConfig.dueDaysOffset || 0}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].taskConfig!.dueDaysOffset = parseInt(e.target.value) || 0;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-left font-mono"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            )}

                            {act.type === 'send_notification' && act.notificationConfig && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">قالب عنوان اعلان <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    value={act.notificationConfig.titleTemplate}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].notificationConfig!.titleTemplate = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">ارسال به مسئول ماژول</label>
                                  <select
                                    value={act.notificationConfig.module}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].notificationConfig!.module = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-mono"
                                  >
                                    <option value="proformas">پیش‌فاکتورها (Proformas)</option>
                                    <option value="projects">پروژه‌ها (Projects)</option>
                                    <option value="purchaseOrders">سفارشات خرید (Purchase Orders)</option>
                                    <option value="inventory">انبار و کالا (Inventory)</option>
                                    <option value="customers">مشتریان (Customers)</option>
                                    <option value="suppliers">تأمین‌کنندگان (Suppliers)</option>
                                    <option value="afterSales">خدمات پس از فروش (After Sales)</option>
                                  </select>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-slate-600 text-[11px] font-bold mb-1">قالب متن پیام اعلان</label>
                                  <textarea
                                    value={act.notificationConfig.descTemplate}
                                    onChange={(e) => {
                                      const updatedActs = [...editingRule.actions];
                                      updatedActs[actIdx].notificationConfig!.descTemplate = e.target.value;
                                      setEditingRule({ ...editingRule, actions: updatedActs });
                                    }}
                                    rows={2}
                                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRule(null);
                      setIsRuleFormOpen(false);
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-5 rounded-xl text-xs md:text-sm border border-slate-200 transition-all"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-xl text-xs md:text-sm transition-all shadow-sm"
                  >
                    ذخیره قانون ورک‌فلو
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {(settings.workflows || []).length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                    <RefreshCw size={40} className="text-slate-300 mx-auto animate-spin-slow mb-3" />
                    <p className="text-slate-600 font-bold text-sm">هیچ قانون ورک‌فلویی تعریف نشده است</p>
                    <p className="text-slate-400 text-xs mt-1">با ایجاد قوانین داینامیک، فرآیندهای کاری سازمان خود را خودکار کنید.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {(settings.workflows || []).map((rule) => {
                      const triggerLabelMap: Record<string, string> = {
                        proforma_outcome_change: 'تغییر وضعیت نهایی پیش‌فاکتور',
                        project_status_change: 'تغییر وضعیت پروژه',
                        purchase_order_status_change: 'تغییر وضعیت سفارش خرید'
                      };

                      return (
                        <div key={rule.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2 text-right">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${rule.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                              <h4 className="font-bold text-slate-800 text-sm md:text-base">{rule.name}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                rule.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {rule.active ? 'فعال' : 'غیرفعال'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-slate-600">
                              <div>
                                <span className="font-bold text-slate-500">رویداد:</span> {triggerLabelMap[rule.triggerType] || rule.triggerType}
                              </div>
                              <div>
                                <span className="font-bold text-slate-500">تعداد شرط‌ها:</span> {rule.conditions?.length || 0} مورد
                              </div>
                              <div>
                                <span className="font-bold text-slate-500">تعداد اقدامات:</span> {rule.actions?.length || 0} اقدام
                              </div>
                            </div>

                            {/* Brief execution description */}
                            <div className="bg-slate-50 p-2.5 rounded-lg text-slate-500 text-[11px] border border-slate-100 max-w-2xl leading-relaxed">
                              <span className="font-bold text-sky-600">فرآیند: </span>
                              در زمان وقوع <span className="text-slate-800 font-bold">{triggerLabelMap[rule.triggerType] || rule.triggerType}</span>،
                              {rule.conditions && rule.conditions.length > 0 ? (
                                <>
                                  {' '}اگر{' '}
                                  {rule.conditions.map((c, i) => (
                                    <span key={i} className="text-slate-800 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 mx-0.5 font-mono">
                                      {c.field === 'newOutcome' ? 'وضعیت جدید' : c.field === 'newStatus' ? 'وضعیت جدید' : c.field} {c.operator === 'equals' ? 'برابر باشد با' : 'مخالف باشد با'} «{c.value}»
                                    </span>
                                  ))}
                                  {' '}باشد، آنگاه:{' '}
                                </>
                              ) : (
                                ' بدون هیچ شرطی، آنگاه '
                              )}
                              {rule.actions.map((act, i) => (
                                <span key={i} className="text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 mx-0.5">
                                  {act.type === 'create_task' ? `ایجاد تسک «${act.taskConfig?.titleTemplate}»` : `ارسال اعلان به مسئول ماژول`}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center mr-auto">
                            <button
                              type="button"
                              onClick={() => handleToggleWorkflowActive(rule.id)}
                              className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                                rule.active 
                                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={rule.active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                            >
                              {rule.active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRule({ ...rule });
                                setIsRuleFormOpen(true);
                              }}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                              title="ویرایش"
                            >
                              <Sliders size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('آیا از حذف این قانون مطمئن هستید؟')) {
                                  handleDeleteWorkflowRule(rule.id);
                                }
                              }}
                              className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                              title="حذف"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null)}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteType(null);
          setDeleteTargetId('');
          setDeleteTargetName('');
        }}
        onConfirm={handleConfirmDelete}
        title={
          deleteType === 'dropdownItem' ? 'حذف گزینه لیست بازشو' :
          deleteType === 'activityCategory' ? 'حذف دسته‌بندی فعالیت' :
          deleteType === 'lossReason' ? 'حذف علت باخت' :
          deleteType === 'customField' ? 'حذف فیلد سفارشی' : 
          deleteType === 'clearData' ? 'هشدار: پاکسازی کامل داده‌ها' : 'تایید حذف'
        }
        message={
          deleteType === 'dropdownItem' ? `آیا از حذف گزینه "${deleteTargetName}" از لیست کشویی "${dropdownLabels[selectedDropdownKey] || ''}" اطمینان دارید؟` :
          deleteType === 'activityCategory' ? `آیا از حذف دسته‌بندی فعالیت "${deleteTargetName}" اطمینان دارید؟` :
          deleteType === 'lossReason' ? `آیا از حذف علت باخت "${deleteTargetName}" اطمینان دارید؟` :
          deleteType === 'customField' ? `آیا از حذف فیلد سفارشی "${deleteTargetName}" اطمینان دارید؟ تمامی مقادیر ذخیره شده برای این فیلد در رکوردهای موجود حذف خواهند شد.` : 
          deleteType === 'clearData' ? 'آیا مطمئن هستید که می‌خواهید تمامی داده‌های نرم‌افزار (شامل مشتریان، کالاها، پروژه‌ها و ...) را به طور کامل پاک کنید؟ این عملیات غیرقابل بازگشت است.' : ''
        }
      />

    </div>
  );
}
