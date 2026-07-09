import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Printer, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Eye,
  PlusCircle,
  MinusCircle,
  X,
  FileSpreadsheet,
  Settings,
  Building,
  DollarSign,
  Copy,
  Package,
  ChevronDown
} from 'lucide-react';
import { Proforma, Customer, Project, Product, ProformaItem, ERPSettings, ExchangeRate, User } from '../types';
import { getTodayShamsi, addDaysToShamsi } from '../dateUtils';
import ShamsiDatePicker from './ShamsiDatePicker';
import ConfirmModal from './ConfirmModal';
import QuickAddModal from './QuickAddModal';

interface ProformasViewProps {
  proformas: Proforma[];
  customers: Customer[];
  projects: Project[];
  products: Product[];
  settings: ERPSettings;
  exchangeRates: ExchangeRate[];
  addProforma: (proforma: Omit<Proforma, 'id' | 'proformaNumber'>) => void;
  updateProforma: (proforma: Proforma) => void;
  updateProformaStatus: (id: string, status: Proforma['status'], lossReason?: string) => void;
  batchUpdateProjectProformasStatus: (projectId: string, status: Proforma['status'], lossReason?: string) => void;
  deleteProforma: (id: string) => void;
  addCustomer?: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer | any;
  addProject?: (project: Omit<Project, 'id' | 'code' | 'creationDate'> & { customValues?: Record<string, any> }) => Project | any;
  addProduct?: (product: Omit<Product, 'id' | 'stockLevel'> & { stockLevel?: number }) => Product;
  users?: User[];
  currentUser?: User | null;
}

export default function ProformasView({
  proformas,
  customers,
  projects,
  products,
  settings,
  exchangeRates,
  addProforma,
  updateProforma,
  updateProformaStatus,
  batchUpdateProjectProformasStatus,
  deleteProforma,
  addCustomer,
  addProject,
  addProduct,
  users = [],
  currentUser = null
}: ProformasViewProps) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [quickAddType, setQuickAddType] = useState<'customer' | 'project' | 'supplier' | 'product' | null>(null);
  const [quickAddProductIndex, setQuickAddProductIndex] = useState<number | null>(null);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProforma, setEditingProforma] = useState<Proforma | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);
  const [selectedProforma, setSelectedProforma] = useState<Proforma | null>(null);
  
  // Status change helper state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState<string>('');
  const [newStatusSelected, setNewStatusSelected] = useState<Proforma['status']>('پیش‌نویس');
  const [lossReason, setLossReason] = useState('');

  // Individual items status states
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedProformaForItems, setSelectedProformaForItems] = useState<Proforma | null>(null);
  const [editingItemsList, setEditingItemsList] = useState<ProformaItem[]>([]);

  // Bulk project proformas status change state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProjectId, setBulkProjectId] = useState('');
  const [bulkProjectName, setBulkProjectName] = useState('');
  const [bulkStatusSelected, setBulkStatusSelected] = useState<Proforma['status']>('پیش‌نویس');
  const [bulkLossReason, setBulkLossReason] = useState('');

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [proformaToDeleteId, setProformaToDeleteId] = useState<string | null>(null);
  const [proformaToDeleteNumber, setProformaToDeleteNumber] = useState<string>('');

  // Expanded project sections state
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProjectExpand = (projId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projId]: prev[projId] === false ? true : false
    }));
  };

  // Item status modal helpers
  const handleOpenItemsModal = (pf: Proforma) => {
    setSelectedProformaForItems(pf);
    setEditingItemsList((pf.items || []).map(item => ({
      ...item,
      status: item.status || 'جاری',
      lossReason: item.lossReason || ''
    })));
    setShowItemsModal(true);
  };

  const handleSaveItemsStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProformaForItems) return;
    updateProforma({
      ...selectedProformaForItems,
      items: editingItemsList
    });
    setShowItemsModal(false);
  };

  const handleItemStatusChangeInList = (index: number, st: ProformaItem['status']) => {
    setEditingItemsList(
      editingItemsList.map((item, idx) =>
        idx === index ? { ...item, status: st, lossReason: st === 'بازنده' ? item.lossReason : undefined } : item
      )
    );
  };

  const handleItemLossReasonChangeInList = (index: number, reason: string) => {
    setEditingItemsList(
      editingItemsList.map((item, idx) =>
        idx === index ? { ...item, lossReason: reason } : item
      )
    );
  };

  // Bulk project update modal helpers
  const handleOpenBulkModal = (projId: string, projName: string) => {
    setBulkProjectId(projId);
    setBulkProjectName(projName);
    setBulkStatusSelected('باخته');
    setBulkLossReason('');
    setShowBulkModal(true);
  };

  const handleSaveBulkStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkProjectId) return;
    batchUpdateProjectProformasStatus(bulkProjectId, bulkStatusSelected, bulkStatusSelected === 'باخته' ? bulkLossReason : undefined);
    setShowBulkModal(false);
  };

  // Form states for creating/editing proforma
  const [customerId, setCustomerId] = useState('');
  const [contactCustomerId, setContactCustomerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [issueDate, setIssueDate] = useState(getTodayShamsi());
  const [expiryDate, setExpiryDate] = useState(() => addDaysToShamsi(getTodayShamsi(), 30));
  const [deliveryDate, setDeliveryDate] = useState('۳ هفته کاری پس از پیش پرداخت');
  const [status, setStatus] = useState<Proforma['status']>('پیش‌نویس');
  const [currency, setCurrency] = useState<Proforma['currency']>('ریال');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(10); // Standard Iranian VAT is 10% since 1403
  const [notes, setNotes] = useState(settings?.proformaTemplates?.[0]?.termsAndConditions || '');
  const [items, setItems] = useState<Omit<ProformaItem, 'id' | 'totalPriceRIYAL'>[]>([]);

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

  // Quick Project Creation States
  const [showQuickProjectModal, setShowQuickProjectModal] = useState(false);
  const [quickProjName, setQuickProjName] = useState('');
  const [quickProjCustomerId, setQuickProjCustomerId] = useState('');
  const [quickProjStage, setQuickProjStage] = useState('استعلام اولیه');
  const [quickProjSalesExpert, setQuickProjSalesExpert] = useState('');

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProforma(null);
    setCustomerId(customers[0]?.id || '');
    setContactCustomerId('');
    setProjectId('');
    setIssueDate(getTodayShamsi());
    setExpiryDate(addDaysToShamsi(getTodayShamsi(), 30));
    setDeliveryDate('۳ هفته کاری پس از پیش پرداخت');
    setStatus('پیش‌نویس');
    setCurrency('ریال');
    setDiscountPercent(0);
    setTaxPercent(10);
    setNotes(settings?.proformaTemplates?.[0]?.termsAndConditions || '');
    setItems([{ 
      productId: products[0]?.id || '', 
      productName: products[0]?.displayName || '', 
      productCode: products[0]?.code || '', 
      brand: products[0]?.brand || '', 
      quantity: 1, 
      unitPriceRIYAL: products[0]?.basePriceRIYAL || 0, 
      techSpecs: '',
      selectedImage: products[0]?.images && products[0]?.images.length > 0 ? products[0]?.images[0] : undefined
    }]);
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pf: Proforma) => {
    setEditingProforma(pf);
    setCustomerId(pf.customerId);
    setContactCustomerId(pf.contactCustomerId || '');
    setProjectId(pf.projectId || '');
    setIssueDate(pf.issueDate);
    setExpiryDate(pf.expiryDate);
    setDeliveryDate(pf.deliveryDate || '');
    setStatus(pf.status);
    setCurrency(pf.currency || 'ریال');
    setDiscountPercent(pf.discountPercent);
    setTaxPercent(pf.taxPercent);
    setNotes(pf.notes);
    setItems(pf.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productCode: item.productCode,
      brand: item.brand,
      quantity: item.quantity,
      unitPriceRIYAL: item.unitPriceRIYAL,
      techSpecs: item.techSpecs || '',
      selectedImage: item.selectedImage
    })));
    setShowCreateModal(true);
  };

  // Handle Currency selection conversion
  const handleCurrencyChange = (newCurrency: Proforma['currency']) => {
    const prevCurrency = currency;
    setCurrency(newCurrency);

    // Convert existing items' prices from prevCurrency to newCurrency
    const prevEng = mapPersianCurrencyToEnglish(prevCurrency || 'ریال');
    const prevRateObj = prevEng ? exchangeRates.find(r => r.currency === prevEng) : undefined;
    const prevRate = prevRateObj ? prevRateObj.rateToRIYAL : 1;

    const newEng = mapPersianCurrencyToEnglish(newCurrency || 'ریال');
    const newRateObj = newEng ? exchangeRates.find(r => r.currency === newEng) : undefined;
    const newRate = newRateObj ? newRateObj.rateToRIYAL : 1;

    const updatedItems = items.map(item => {
      // First, convert unit price from prevCurrency back to IRR
      const priceInRial = item.unitPriceRIYAL * (prevCurrency === 'ریال' ? 1 : prevRate);
      // Then, convert from IRR to the newCurrency
      const priceInNewCurrency = newCurrency === 'ریال' ? priceInRial : (priceInRial / newRate);
      return {
        ...item,
        unitPriceRIYAL: Math.round(priceInNewCurrency * 100) / 100
      };
    });
    setItems(updatedItems);
  };

  // Add Item line
  const handleAddItemLine = () => {
    const firstProd = products[0];
    if (!firstProd) return;

    // Convert first product's IRR basePrice to the selected currency
    const engCurrency = mapPersianCurrencyToEnglish(currency || 'ریال');
    const rateObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
    const rate = rateObj ? rateObj.rateToRIYAL : 1;
    const basePriceInSelectedCurrency = currency === 'ریال' ? firstProd.basePriceRIYAL : (firstProd.basePriceRIYAL / rate);

    setItems([...items, {
      productId: firstProd.id,
      productName: firstProd.displayName,
      productCode: firstProd.code,
      brand: firstProd.brand,
      quantity: 1,
      unitPriceRIYAL: Math.round(basePriceInSelectedCurrency * 100) / 100,
      techSpecs: '',
      selectedImage: firstProd.images && firstProd.images.length > 0 ? firstProd.images[0] : undefined
    }]);
  };

  // Remove Item line
  const handleRemoveItemLine = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle Item Select product
  const handleItemProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    // Convert product's basePriceRIYAL to current currency
    const engCurrency = mapPersianCurrencyToEnglish(currency || 'ریال');
    const rateObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
    const rate = rateObj ? rateObj.rateToRIYAL : 1;
    const basePriceInSelectedCurrency = currency === 'ریال' ? prod.basePriceRIYAL : (prod.basePriceRIYAL / rate);

    const newItems = [...items];
    newItems[index] = {
      productId: prodId,
      productName: prod.displayName,
      productCode: prod.code,
      brand: prod.brand,
      quantity: newItems[index].quantity,
      unitPriceRIYAL: Math.round(basePriceInSelectedCurrency * 100) / 100,
      techSpecs: newItems[index].techSpecs || '',
      selectedImage: prod.images && prod.images.length > 0 ? prod.images[0] : undefined
    };
    setItems(newItems);
  };

  // Handle Item fields modifications (generic to support strings or numbers)
  const handleItemFieldChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    let sanitizedVal = value;
    if (field === 'quantity' || field === 'unitPriceRIYAL') {
      sanitizedVal = Math.max(0, Number(value));
    }
    newItems[index] = {
      ...newItems[index],
      [field]: sanitizedVal
    };
    setItems(newItems);
  };

  // Calculate totals for Form (now calculated entirely in selected currency!)
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPriceRIYAL), 0);
  const discountAmount = Math.round(subTotal * (discountPercent / 100));
  const afterDiscount = subTotal - discountAmount;
  const taxAmount = Math.round(afterDiscount * (taxPercent / 100));
  const finalAmount = afterDiscount + taxAmount;

  // Handle Save (Add / Update)
  const handleSaveProforma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    
    const selectedCustObj = customers.find(c => c.id === customerId);
    const isLegal = selectedCustObj?.customerType === 'حقوقی';
    const contactObj = isLegal ? customers.find(c => c.id === contactCustomerId) : null;
    const finalContactName = contactObj 
      ? `${contactObj.firstName || ''} ${contactObj.lastName || ''}`.trim() 
      : undefined;

    const customerName = selectedCustObj?.companyName || 'مشتری نامشخص';
    const projName = projects.find(p => p.id === projectId)?.name || '';

    // Reconstruct items with subtotal price and correct item ID structure
    const formattedItems: ProformaItem[] = items.map((item, i) => ({
      id: `pfi-${Date.now()}-${i}`,
      ...item,
      totalPriceRIYAL: item.quantity * item.unitPriceRIYAL
    }));

    if (editingProforma) {
      updateProforma({
        ...editingProforma,
        customerId,
        customerName,
        contactCustomerId: isLegal ? contactCustomerId : undefined,
        contactName: isLegal ? finalContactName : undefined,
        projectId: projectId || undefined,
        projectName: projectId ? projName : undefined,
        issueDate,
        expiryDate,
        deliveryDate,
        status,
        currency,
        items: formattedItems,
        totalAmount: subTotal,
        discountPercent,
        discountAmount,
        taxPercent,
        taxAmount,
        finalAmount,
        notes
      });
      setEditingProforma(null);
    } else {
      addProforma({
        customerId,
        customerName,
        contactCustomerId: isLegal ? contactCustomerId : undefined,
        contactName: isLegal ? finalContactName : undefined,
        projectId: projectId || undefined,
        projectName: projectId ? projName : undefined,
        issueDate,
        expiryDate,
        deliveryDate,
        status,
        currency,
        items: formattedItems,
        totalAmount: subTotal,
        discountPercent,
        discountAmount,
        taxPercent,
        taxAmount,
        finalAmount,
        notes
      });
    }

    setShowCreateModal(false);
  };

  // Trigger Status adjustment modal
  const handleOpenStatusChange = (pfId: string, currentStatus: Proforma['status']) => {
    setStatusTargetId(pfId);
    setNewStatusSelected(currentStatus);
    setLossReason('');
    setShowStatusModal(true);
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    updateProformaStatus(statusTargetId, newStatusSelected, newStatusSelected === 'باخته' ? lossReason : undefined);
    setShowStatusModal(false);
  };

  // Open Preview layout
  const handleOpenPrint = (pf: Proforma) => {
    setSelectedProforma(pf);
    setShowPrintView(true);
  };

  const handleCopyProforma = (pf: Proforma) => {
    const copiedItems: ProformaItem[] = pf.items.map((item, i) => ({
      ...item,
      id: `pfi-${Date.now()}-${i}`,
      status: 'جاری',
      lossReason: undefined
    }));

    addProforma({
      customerId: pf.customerId,
      customerName: pf.customerName,
      contactCustomerId: pf.contactCustomerId,
      contactName: pf.contactName,
      projectId: pf.projectId,
      projectName: pf.projectName,
      issueDate: pf.issueDate,
      expiryDate: pf.expiryDate,
      deliveryDate: pf.deliveryDate,
      status: 'پیش‌نویس',
      currency: pf.currency || 'ریال',
      items: copiedItems,
      totalAmount: pf.totalAmount,
      discountPercent: pf.discountPercent,
      discountAmount: pf.discountAmount,
      taxPercent: pf.taxPercent,
      taxAmount: pf.taxAmount,
      finalAmount: pf.finalAmount,
      notes: pf.notes,
      customValues: pf.customValues ? { ...pf.customValues } : undefined
    });
  };

  // Filter proformas
  const filteredProformas = proformas.filter(p => {
    const matchesSearch = 
      p.proformaNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (p.projectName && p.projectName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (st: Proforma['status']) => {
    switch (st) {
      case 'پیش‌نویس': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'ارسال شده': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'تأیید شده (برنده)': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'لغو شده': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'باخته': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getProjectDetails = (projId: string) => {
    return projects.find(p => p.id === projId);
  };

  const getProjectStatusColor = (st: Project['status']) => {
    switch (st) {
      case 'جدید': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'در حال مذاکره': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ارائه پیش‌فاکتور': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'برنده (موفق)': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'باخته': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'لغو شده': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'نیمه برنده': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Format Persian currency
  const formatToman = (num: number) => {
    return (num / 10).toLocaleString('fa-IR') + ' تومان';
  };

  const formatRawRIYAL = (num: number) => {
    return num.toLocaleString('fa-IR') + ' ریال';
  };

  const mapPersianCurrencyToEnglish = (cur: string): 'USD' | 'EUR' | 'AED' | undefined => {
    if (cur === 'دلار') return 'USD';
    if (cur === 'یورو') return 'EUR';
    if (cur === 'درهم') return 'AED';
    return undefined;
  };

  const formatCurrency = (num: number, cur?: Proforma['currency']) => {
    const unit = cur || 'ریال';
    return num.toLocaleString('fa-IR') + ' ' + unit;
  };

  const activeTemplate = settings?.proformaTemplates?.[0] || {
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

  const downloadProformaHTML = (pf: Proforma) => {
    const template = activeTemplate;
    if (!template) return;
    const customerObj = customers.find(c => c.id === pf.customerId);
    const creatorUser = pf.creatorId ? users.find(u => u.id === pf.creatorId) : currentUser;
    
    const targetCurrency = pf.currency || 'ریال';
    const engCurrency = mapPersianCurrencyToEnglish(targetCurrency);
    const currencyObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
    const currentRate = currencyObj ? currencyObj.rateToRIYAL : 1;
    const equivalentRiyal = pf.finalAmount * (targetCurrency === 'ریال' ? 1 : currentRate);
    const equivalentToman = Math.round(equivalentRiyal / 10);
    
    const itemsRows = pf.items.map((item, index) => {
      const prod = products.find(p => p.id === item.productId);
      const imgToRender = item.selectedImage && item.selectedImage !== 'none'
        ? item.selectedImage
        : (item.selectedImage !== 'none' && prod?.images && prod.images.length > 0 ? prod.images[0] : undefined);
      return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: center; font-family: monospace;">${index + 1}</td>
        <td style="padding: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; text-align: right;">
            ${imgToRender ? `
              <img src="${imgToRender}" alt="${item.productName}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; flex-shrink: 0;" referrerPolicy="no-referrer" />
            ` : ''}
            <div style="font-weight: bold; color: #1e293b;">${item.productName}</div>
          </div>
        </td>
        <td style="padding: 12px; font-size: 11px; color: #475569; white-space: pre-line; line-height: 1.4; text-align: right;">
          ${item.techSpecs || '-'}
        </td>
        <td style="padding: 12px; text-align: center; font-family: monospace;">${item.quantity}</td>
        <td style="padding: 12px; text-align: center;">${prod?.unit || 'عدد'}</td>
        <td style="padding: 12px; text-align: left; font-family: monospace;">${item.unitPriceRIYAL.toLocaleString('fa-IR')}</td>
        <td style="padding: 12px; text-align: left; font-family: monospace;">${item.totalPriceRIYAL.toLocaleString('fa-IR')}</td>
      </tr>
      `;
    }).join('');

    const formattedToman = formatToman(pf.finalAmount);

    const htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پیش‌فاکتور ${pf.proformaNumber}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
        body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            direction: rtl;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid ${template.titleColor};
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .logo-box {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo {
            width: 48px;
            height: 48px;
            background-color: #0ea5e9;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
            border-radius: 8px;
        }
        .company-name {
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
            margin: 0;
        }
        .subtitle {
            font-size: 11px;
            color: #94a3b8;
            margin: 0;
        }
        .title-box {
            text-align: center;
        }
        .title {
            font-size: 22px;
            font-weight: 800;
            color: ${template.titleColor};
            margin: 0;
        }
        .doc-specs {
            font-size: 13px;
            color: #475569;
            text-align: left;
        }
        .specs-item {
            margin-bottom: 4px;
        }
        .specs-label {
            font-weight: bold;
            color: #0f172a;
        }
        .section-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 14px;
            background-color: #f8fafc;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            color: #334155;
            padding-bottom: 6px;
            border-bottom: 1px dashed #cbd5e1;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 14px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .grid-compact {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px 10px;
            font-size: 11px;
            line-height: 1.5;
        }
        .full-width {
            grid-column: span 2;
        }
        .table-container {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 14px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: right;
            font-size: 12px;
            page-break-inside: auto;
        }
        thead {
            display: table-header-group;
        }
        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .financial-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 14px;
            margin-bottom: 20px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .notes-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            background-color: #f8fafc;
            font-size: 12px;
            color: #475569;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .totals-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            background-color: #f8fafc;
            font-size: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .totals-row:last-child {
            border-bottom: none;
        }
        .final-amount {
            font-weight: bold;
            font-size: 14px;
            color: ${template.titleColor};
            border-top: 2px solid #e2e8f0;
            padding-top: 8px;
            margin-top: 4px;
        }
        .signatures {
            display: flex;
            justify-content: flex-end;
            margin-top: 25px;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .signature-box {
            padding-top: 20px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .signature-title {
            font-size: 11px;
            color: #64748b;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .signature-name {
            font-weight: bold;
            font-size: 12px;
            color: #334155;
        }
        .buyer-horizontal-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 10px 15px;
            font-size: 11px;
            line-height: 1.5;
        }
        .buyer-horizontal-row > div {
            flex: 1;
            min-width: 140px;
        }
        .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #ffffff;
            border-top: 1px solid #cbd5e1;
            padding: 10px 40px;
            font-size: 10px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
        }
        .print-footer-info {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        .page-number:after {
            content: "صفحه " counter(page);
        }
        @page {
            counter-reset: page 1;
        }
        @media print {
            body {
                counter-reset: page 1;
                background-color: #ffffff;
                padding: 0;
                padding-bottom: 60px;
            }
            .container {
                box-shadow: none;
                padding: 0;
            }
            .print-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 1px solid #94a3b8;
                padding: 10px 0;
                display: flex !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-box">
                ${template.showLogo ? `
                ${template.logoUrl ? `
                    <img src="${template.logoUrl}" alt="${template.companyName}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; background-color: #ffffff;" referrerPolicy="no-referrer" />
                ` : `
                    <div class="logo">ATA</div>
                `}
                <div>
                    <h4 class="company-name">${template.companyName}</h4>
                    <p class="subtitle">تامین تجهیزات اتوماسیون و ابزاردقیق</p>
                </div>
                ` : ''}
            </div>
            
            <div class="title-box">
                <h1 class="title">${(template.documentTitle || '').replace('رسمی', '').trim()}</h1>
            </div>
            
            <div class="doc-specs">
                <div class="specs-item"><span class="specs-label">شماره پیش‌فاکتور:</span> ${pf.proformaNumber}</div>
                <div class="specs-item"><span class="specs-label">تاریخ صدور:</span> ${pf.issueDate}</div>
                <div class="specs-item"><span class="specs-label">تاریخ اعتبار:</span> ${pf.expiryDate}</div>
            </div>
        </div>

        <!-- Buyer details horizontally in a single row -->
        <div class="section-card" style="margin-bottom: 14px;">
            <h4 class="section-title">مشخصات خریدار</h4>
            <div class="buyer-horizontal-row">
                <div><span style="color: #64748b;">نام خریدار / شرکت:</span> <strong>${pf.customerName}</strong></div>
                <div><span style="color: #64748b;">مخاطب:</span> ${pf.contactName || (customerObj ? `${customerObj.contactName || ''} ${customerObj.contactLastName || ''}`.trim() : '') || 'نماینده خریدار'}</div>
                <div><span style="color: #64748b;">تلفن تماس:</span> ${customerObj ? (customerObj.phone || customerObj.mobile || '-') : '-'}</div>
                <div><span style="color: #64748b;">پست الکترونیکی:</span> ${customerObj ? (customerObj.email || '-') : '-'}</div>
            </div>
        </div>

        <!-- Items Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px; text-align: center;">ردیف</th>
                        <th>نوع کالا</th>
                        <th>توضیحات فنی</th>
                        <th style="text-align: center; width: 70px;">تعداد</th>
                        <th style="text-align: center; width: 70px;">واحد</th>
                        <th style="text-align: left;">بهای واحد (${targetCurrency})</th>
                        <th style="text-align: left;">بهای کل (${targetCurrency})</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
        </div>

        <!-- Financial Calculations -->
        <div class="financial-grid">
            <div class="notes-card">
                <div style="font-weight: bold; color: #334155; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">توضیحات و شرایط فروش</div>
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 11px; color: #0284c7;">📅 زمان تحویل: ${pf.deliveryDate || 'فوری'}</div>
                <div style="white-space: pre-line; line-height: 1.6; font-size: 12px;">${pf.notes}</div>
            </div>
            
            <div class="totals-card">
                <div class="totals-row">
                    <span style="color: #64748b;">جمع ناخالص ردیف‌ها:</span>
                    <strong style="font-family: monospace;">${pf.totalAmount.toLocaleString('fa-IR')} ${targetCurrency}</strong>
                </div>
                <div class="totals-row">
                    <span style="color: #64748b;">تخفیف کلی (${pf.discountPercent}%):</span>
                    <strong style="font-family: monospace; color: #dc2626;">-${pf.discountAmount.toLocaleString('fa-IR')} ${targetCurrency}</strong>
                </div>
                <div class="totals-row">
                    <span style="color: #64748b;">مالیات بر ارزش افزوده (${pf.taxPercent}%):</span>
                    <strong style="font-family: monospace;">+${pf.taxAmount.toLocaleString('fa-IR')} ${targetCurrency}</strong>
                </div>
                <div class="totals-row final-amount">
                    <span>مبلغ قابل پرداخت نهایی:</span>
                    <span style="font-family: monospace;">${pf.finalAmount.toLocaleString('fa-IR')} ${targetCurrency}</span>
                </div>
                <div style="text-align: left; font-size: 11px; color: #64748b; font-weight: bold; margin-top: 8px; line-height: 1.5;">
                    ${targetCurrency !== 'ریال' ? `
                      نرخ تسعیر روز ${targetCurrency}: ${currentRate.toLocaleString('fa-IR')} ریال <br/>
                      معادل ریالی نهایی: ${equivalentRiyal.toLocaleString('fa-IR')} ریال (${equivalentToman.toLocaleString('fa-IR')} تومان)
                    ` : `
                      معادل ریالی نهایی: ${formattedToman}
                    `}
                </div>
            </div>
        </div>

        <!-- Signatures -->
        ${template.showSignatures ? `
        <div class="signatures">
            <div class="signature-box" style="width: 320px; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px; background-color: #fafafa;">
                <div class="signature-title" style="margin-bottom: 8px;">مهر و امضای صادرکننده پیش‌فاکتور</div>
                <div class="signature-name" style="margin-bottom: 12px;">${creatorUser ? creatorUser.fullName : template.signatureLabel1}</div>
                <div style="margin-top: 10px;">
                    ${template.companySealUrl ? `
                        <div style="display: flex; justify-content: space-evenly; align-items: center; gap: 10px; height: 100px; background-color: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 4px;">
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
                                <span style="font-size: 8px; color: #94a3b8; font-weight: bold; margin-bottom: 4px;">امضای صادرکننده</span>
                                ${creatorUser && creatorUser.signatureImage ? `
                                    <img src="${creatorUser.signatureImage}" alt="Signature" style="max-height: 70px; max-width: 120px; object-fit: contain;" referrerPolicy="no-referrer" />
                                ` : `
                                    <span style="font-size: 10px; color: #cbd5e1; font-weight: bold;">فاقد امضا</span>
                                `}
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; border-right: 1px solid #f1f5f9; padding-right: 8px;">
                                <span style="font-size: 8px; color: #94a3b8; font-weight: bold; margin-bottom: 4px;">مهر شرکت</span>
                                <img src="${template.companySealUrl}" alt="Company Seal" style="max-height: 70px; max-width: 110px; object-fit: contain; transform: rotate(-3deg);" referrerPolicy="no-referrer" />
                            </div>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px; background-color: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 4px;">
                            <span style="font-size: 8px; color: #94a3b8; font-weight: bold; margin-bottom: 4px;">امضای صادرکننده</span>
                            ${creatorUser && creatorUser.signatureImage ? `
                                <img src="${creatorUser.signatureImage}" alt="Signature" style="max-height: 75px; max-width: 180px; object-fit: contain;" referrerPolicy="no-referrer" />
                            ` : `
                                <span style="font-size: 10px; color: #cbd5e1; font-weight: bold;">فاقد امضا</span>
                            `}
                        </div>
                    `}
                </div>
            </div>
        </div>
        ` : ''}
    </div>

    <!-- Running print footer repeating on all pages when printing -->
    <div class="print-footer">
        <div class="print-footer-info">
            <div><strong>آدرس شرکت:</strong> ${template.address || '-'}</div>
            <div><strong>تلفن تماس:</strong> ${template.phone || '-'}</div>
            <div><strong>پست الکترونیکی:</strong> ${template.email || '-'}</div>
        </div>
        <div class="page-number"></div>
    </div>

    <!-- Auto Print Script -->
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 300);
        };
    </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `پیش_فاکتور_${pf.proformaNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Grouping proformas by project
  const proformasByProject = filteredProformas.reduce((acc, pf) => {
    const pId = pf.projectId || 'no-project';
    if (!acc[pId]) {
      acc[pId] = [];
    }
    acc[pId].push(pf);
    return acc;
  }, {} as Record<string, Proforma[]>);

  // Sorting within each project group: latest version of proforma on top
  Object.keys(proformasByProject).forEach(pId => {
    proformasByProject[pId].sort((a, b) => {
      const dateCompare = b.issueDate.localeCompare(a.issueDate);
      if (dateCompare !== 0) return dateCompare;
      return b.proformaNumber.localeCompare(a.proformaNumber);
    });
  });

  // Project IDs ordered: real projects first (by code/name), then 'no-project'
  const projectIdsOrdered = Object.keys(proformasByProject).sort((a, b) => {
    if (a === 'no-project') return 1;
    if (b === 'no-project') return -1;
    
    // Sort real projects based on code descending or name
    const projA = projects.find(p => p.id === a);
    const projB = projects.find(p => p.id === b);
    if (!projA) return 1;
    if (!projB) return -1;
    return projB.code.localeCompare(projA.code);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Print View Overlay */}
      {showPrintView && selectedProforma && activeTemplate && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs overflow-y-auto p-4 md:p-8 z-50 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col justify-between h-fit min-h-screen text-right animate-scale-in">
            {/* Action Bar (Print / Close) */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-6 mb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => downloadProformaHTML(selectedProforma)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/10"
                  title="دانلود فایل بهینه برای چاپ و خروجی تمیز بدون محدودیت مرورگر"
                >
                  <FileSpreadsheet size={16} />
                  خروجی فایل چاپی مستقل (دانلود HTML)
                </button>
              </div>
              <button 
                onClick={() => setShowPrintView(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 transition"
              >
                بستن پیش‌نمایش
              </button>
            </div>

            {/* Printable Document Sheet */}
            <div className="print-sheet space-y-6">
              
              {/* Document Header */}
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-right gap-4 border-b-2 pb-4" style={{ borderColor: activeTemplate.titleColor }}>
                {/* Logo Placeholder */}
                {activeTemplate.showLogo && (
                  <div className="flex items-center gap-3">
                    {activeTemplate.logoUrl ? (
                      <img
                        src={activeTemplate.logoUrl}
                        alt={activeTemplate.companyName}
                        className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-sky-500 text-white flex items-center justify-center font-bold text-xl rounded-lg">
                        ATA
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{activeTemplate.companyName}</h4>
                      <p className="text-[9px] text-slate-400">تامین تجهیزات اتوماسیون و ابزاردقیق</p>
                    </div>
                  </div>
                )}
                
                {/* Title */}
                <div className="text-center">
                  <h1 className="text-xl font-extrabold" style={{ color: activeTemplate.titleColor }}>
                    {(activeTemplate.documentTitle || '').replace('رسمی', '').trim()}
                  </h1>
                  <p className="text-[10px] text-slate-400 mt-1">سامانه صدور خودکار Arshia ERP</p>
                </div>

                {/* Doc Specs */}
                <div className="text-xs space-y-1 text-slate-600 font-mono">
                  <div>شماره پیش‌فاکتور: <span className="font-bold text-slate-900">{selectedProforma.proformaNumber}</span></div>
                  <div>تاریخ صدور: <span>{selectedProforma.issueDate}</span></div>
                  <div>تاریخ اعتبار: <span>{selectedProforma.expiryDate}</span></div>
                </div>
              </div>

              {/* Buyer details - designed horizontally in a single row */}
              {(() => {
                const customerObj = customers.find(c => c.id === selectedProforma.customerId);
                return (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/20">
                    <h4 className="font-bold text-xs text-slate-700 pb-1.5 border-b border-dashed border-slate-200 mb-3">مشخصات خریدار</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block mb-1">نام خریدار / شرکت:</span>
                        <span className="font-bold text-slate-800">{selectedProforma.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block mb-1">مخاطب:</span>
                        <span className="font-medium text-slate-800">
                          {selectedProforma.contactName || (customerObj ? `${customerObj.contactName || ''} ${customerObj.contactLastName || ''}`.trim() : '') || 'نماینده خریدار'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block mb-1">تلفن تماس:</span>
                        <span className="font-mono text-slate-800">
                          {customerObj ? (customerObj.phone || customerObj.mobile || '-') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block mb-1">پست الکترونیکی:</span>
                        <span className="font-mono text-slate-800 truncate block" title={customerObj?.email}>
                          {customerObj ? (customerObj.email || '-') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-right text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3 text-center w-12">ردیف</th>
                      <th className="p-3">نوع کالا</th>
                      <th className="p-3">توضیحات فنی</th>
                      <th className="p-3 text-center">تعداد</th>
                      <th className="p-3 text-center">واحد</th>
                      <th className="p-3 text-left">بهای واحد ({selectedProforma.currency || 'ریال'})</th>
                      <th className="p-3 text-left">بهای کل ({selectedProforma.currency || 'ریال'})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProforma.items.map((item, index) => {
                      const prod = products.find(p => p.id === item.productId);
                      const imgToRender = item.selectedImage && item.selectedImage !== 'none'
                        ? item.selectedImage
                        : (item.selectedImage !== 'none' && prod?.images && prod.images.length > 0 ? prod.images[0] : undefined);
                      return (
                        <tr key={index} className="hover:bg-slate-50/30">
                          <td className="p-3 text-center font-mono">{index + 1}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {imgToRender && (
                                <img
                                  src={imgToRender}
                                  alt={item.productName}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div className="font-bold text-slate-800">{item.productName}</div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 whitespace-pre-line leading-relaxed text-right text-[11px]">
                            {item.techSpecs || '-'}
                          </td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-center">{prod?.unit || 'عدد'}</td>
                          <td className="p-3 text-left font-mono">{item.unitPriceRIYAL.toLocaleString()}</td>
                          <td className="p-3 text-left font-mono">{item.totalPriceRIYAL.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-xs p-4 bg-slate-50 rounded-xl border border-slate-150 text-slate-600 space-y-2">
                  <p className="font-bold text-slate-700 border-b border-slate-200 pb-1.5">توضیحات و شرایط فروش</p>
                  <p className="font-bold text-sky-600">📅 زمان تحویل: {selectedProforma.deliveryDate || 'فوری'}</p>
                  <p className="whitespace-pre-line leading-relaxed text-[11px]">{selectedProforma.notes}</p>
                </div>

                <div className="text-xs p-4 bg-slate-50 rounded-xl border border-slate-150 divide-y divide-slate-200 space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">جمع ناخالص ردیف‌ها:</span>
                    <span className="font-mono font-bold">{formatCurrency(selectedProforma.totalAmount, selectedProforma.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">تخفیف کلی ({selectedProforma.discountPercent}%):</span>
                    <span className="font-mono text-red-600 font-semibold">-{formatCurrency(selectedProforma.discountAmount, selectedProforma.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">مالیات بر ارزش افزوده ({selectedProforma.taxPercent}%):</span>
                    <span className="font-mono text-slate-700">+{formatCurrency(selectedProforma.taxAmount, selectedProforma.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-sm font-bold border-t-2" style={{ color: activeTemplate.titleColor }}>
                    <span>مبلغ قابل پرداخت نهایی:</span>
                    <span className="font-mono">{formatCurrency(selectedProforma.finalAmount, selectedProforma.currency)}</span>
                  </div>
                  <div className="text-left pt-2 font-semibold text-slate-500 text-[10px]">
                    {(() => {
                      const cur = selectedProforma.currency || 'ریال';
                      if (cur !== 'ریال') {
                        const engCurrency = mapPersianCurrencyToEnglish(cur);
                        const rateObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
                        const rate = rateObj ? rateObj.rateToRIYAL : 1;
                        const riyalVal = selectedProforma.finalAmount * rate;
                        const tomanVal = Math.round(riyalVal / 10);
                        return `نرخ تسعیر روز ${cur}: ${rate.toLocaleString('fa-IR')} ریال | معادل: ${riyalVal.toLocaleString('fa-IR')} ریال (${tomanVal.toLocaleString('fa-IR')} تومان)`;
                      } else {
                        return `معادل ریالی نهایی: ${formatToman(selectedProforma.finalAmount)}`;
                      }
                    })()}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              {activeTemplate.showSignatures && (() => {
                const previewCreatorUser = selectedProforma.creatorId ? users.find(u => u.id === selectedProforma.creatorId) : currentUser;
                return (
                  <div className="flex justify-end pt-12">
                    <div className="text-center w-80 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                      <p className="text-xs text-slate-400 font-bold mb-1">مهر و امضای صادرکننده پیش‌فاکتور</p>
                      <p className="text-xs font-bold text-slate-700 mb-3">{previewCreatorUser ? previewCreatorUser.fullName : activeTemplate.signatureLabel1}</p>
                      
                      {activeTemplate.companySealUrl ? (
                        <div className="grid grid-cols-2 gap-2 h-24 bg-white/50 rounded-xl border border-slate-100 p-2">
                          <div className="flex flex-col items-center justify-center border-l border-slate-100">
                            <span className="text-[9px] text-slate-400 font-bold mb-1">امضای صادرکننده</span>
                            {previewCreatorUser && previewCreatorUser.signatureImage ? (
                              <img 
                                src={previewCreatorUser.signatureImage} 
                                alt="Signature" 
                                className="max-h-14 max-w-full object-contain" 
                                referrerPolicy="no-referrer" 
                              />
                            ) : (
                              <span className="text-[10px] text-slate-300 font-bold">فاقد امضا</span>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-[9px] text-slate-400 font-bold mb-1">مهر شرکت</span>
                            <img 
                              src={activeTemplate.companySealUrl} 
                              alt="Company Seal" 
                              className="max-h-14 max-w-full object-contain -rotate-3" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 bg-white/50 rounded-xl border border-slate-100 p-2">
                          <span className="text-[9px] text-slate-400 font-bold mb-1">امضای صادرکننده</span>
                          {previewCreatorUser && previewCreatorUser.signatureImage ? (
                            <img 
                              src={previewCreatorUser.signatureImage} 
                              alt="Signature" 
                              className="max-h-16 max-w-full object-contain" 
                              referrerPolicy="no-referrer" 
                            />
                          ) : (
                            <span className="text-[10px] text-slate-300 font-bold">فاقد امضا</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Beautiful Footer displaying email, phone number, and address of the company, and page number */}
              <div className="border-t border-slate-200 pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
                <div className="flex flex-wrap justify-center sm:justify-start gap-y-2 gap-x-6">
                  <div><strong>آدرس شرکت:</strong> {activeTemplate.address || 'تهران، شرکت ابزار کنترل عرشیا'}</div>
                  <div><strong>تلفن تماس:</strong> <span className="font-mono">{activeTemplate.phone}</span></div>
                  <div><strong>پست الکترونیکی:</strong> <span className="font-mono">{activeTemplate.email}</span></div>
                </div>
                <div className="font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                  صفحه ۱ از ۱
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Main View Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">پیش‌فاکتورها و مدارک تجاری</h1>
          <p className="text-slate-500 text-sm mt-1">صدور و مدیریت اسناد پیشنهاد قیمت، تعیین درصد تخفیف، احتساب مالیات ارزش افزوده و رهگیری بازرگانی</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center gap-2"
        >
          <Plus size={16} />
          صدور پیش‌فاکتور جدید
        </button>
      </div>

      {/* Search and Filters row */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="جستجو در شماره پیش‌فاکتور، نام کارفرما یا پروژه..."
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
            <option value="all">همه وضعیت‌ها</option>
            <option value="پیش‌نویس">پیش‌نویس</option>
            <option value="ارسال شده">ارسال شده (مذاکره)</option>
            <option value="تأیید شده (برنده)">تأیید شده (برنده نهایی)</option>
            <option value="لغو شده">لغو شده</option>
            <option value="باخته">باخته (عدم موافقت)</option>
          </select>
        </div>
      </div>

      {/* Grouped by Project Accordions */}
      <div className="space-y-4">
        {projectIdsOrdered.map((pId) => {
          const pfs = proformasByProject[pId];
          if (!pfs || pfs.length === 0) return null;

          const isNoProject = pId === 'no-project';
          const project = isNoProject ? null : getProjectDetails(pId);
          const isExpanded = expandedProjects[pId] !== false; // default to true

          return (
            <div 
              key={pId} 
              className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Accordion Header */}
              <div 
                onClick={() => toggleProjectExpand(pId)}
                className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none transition ${
                  isExpanded ? 'bg-sky-50/40 border-b border-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-right">
                  <div className={`p-2 rounded-xl ${isNoProject ? 'bg-slate-100 text-slate-600' : 'bg-sky-100 text-sky-600'}`}>
                    {isNoProject ? <Package size={18} /> : <Building size={18} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {isNoProject ? 'پیش‌فاکتورهای عمومی و خرید مستقیم (بدون پروژه مادری)' : `پروژه: ${project?.name || 'نامشخص'} (${project?.code || ''})`}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isNoProject ? 'اقلام تامین مستقیم یا مصارف عمومی انبار' : `کارفرما: ${project?.customerName || 'نامشخص'}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mr-auto sm:mr-0">
                  <span className="text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full font-bold">
                    {pfs.length} نسخه پیش‌فاکتور
                  </span>
                  {!isNoProject && project && (
                    <>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getProjectStatusColor(project.status)}`}>
                        وضعیت پروژه: {project.status}
                      </span>
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
                      </button>
                    </>
                  )}
                  {/* Chevron Icon */}
                  <span className="text-slate-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-bold">
                        <th className="p-4 w-32">شماره نسخه/سند</th>
                        <th className="p-4 w-48">تاریخ صدور / انقضا</th>
                        <th className="p-4">اقلام و شرح فنی پیشنهاد قیمت</th>
                        <th className="p-4 text-left w-52">مبلغ کل نهایی</th>
                        <th className="p-4 text-center w-36">وضعیت مدرک</th>
                        <th className="p-4 text-center w-60">عملیات مدیریت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                      {pfs.map((pf) => (
                        <tr key={pf.id} className="hover:bg-slate-50/50 transition">
                          {/* Number */}
                          <td className="p-4">
                            <span className="font-mono font-extrabold text-slate-900 text-sm block">
                              {pf.proformaNumber}
                            </span>
                          </td>
                          
                          {/* Dates */}
                          <td className="p-4 font-mono text-[11px] text-slate-600 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px]">صدور:</span>
                              <span className="font-bold">{pf.issueDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-rose-600">
                              <span className="text-rose-400 text-[10px]">اعتبار:</span>
                              <span className="font-extrabold">{pf.expiryDate}</span>
                            </div>
                          </td>

                          {/* Items description column */}
                          <td className="p-4">
                            <div className="max-w-md space-y-1">
                              <div className="font-semibold text-slate-800 line-clamp-1">
                                {pf.customerName}
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                {pf.items && pf.items.length > 0 
                                  ? pf.items.map(item => `${item.productName} (${item.quantity} ${item.status === 'برنده' ? '✅' : item.status === 'بازنده' ? '❌' : ''})`).join('، ') 
                                  : 'فاقد کالا'}
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-4 text-left font-mono font-bold text-slate-950 text-sm">
                            <div>{formatCurrency(pf.finalAmount, pf.currency)}</div>
                            {(!pf.currency || pf.currency === 'ریال') ? (
                              <span className="text-[9px] text-slate-400 font-normal block mt-0.5">{formatToman(pf.finalAmount)}</span>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-normal block mt-0.5">
                                {(() => {
                                  const engCurrency = mapPersianCurrencyToEnglish(pf.currency || 'ریال');
                                  const rateObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
                                  const rate = rateObj ? rateObj.rateToRIYAL : 1;
                                  return `تسعیر: ${(pf.finalAmount * rate).toLocaleString('fa-IR')} ریال`;
                                })()}
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
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

                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {/* Print View Trigger */}
                              <button
                                onClick={() => handleOpenPrint(pf)}
                                className="p-1.5 bg-slate-50 hover:bg-sky-50 text-sky-600 rounded-lg border border-slate-200 hover:border-sky-200 transition"
                                title="مشاهده پیش‌فاکتور رسمی و چاپ"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Edit Proforma */}
                              <button
                                onClick={() => handleOpenEdit(pf)}
                                className="p-1.5 bg-slate-50 hover:bg-amber-50 text-amber-600 rounded-lg border border-slate-200 hover:border-amber-200 transition"
                                title="ویرایش پیش‌فاکتور"
                              >
                                <Edit size={14} />
                              </button>

                              {/* Copy Proforma */}
                              <button
                                onClick={() => handleCopyProforma(pf)}
                                className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-emerald-600 rounded-lg border border-slate-200 hover:border-emerald-200 transition"
                                title="کپی پیش‌فاکتور"
                              >
                                <Copy size={14} />
                              </button>

                              {/* Prominent status update button - Exactly fixing user complaint */}
                              <button
                                onClick={() => handleOpenStatusChange(pf.id, pf.status)}
                                className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-extrabold transition shadow-xs flex items-center gap-1"
                                title="تغییر وضعیت کلی پیش‌فاکتور و علت باخت"
                              >
                                <Settings size={10} />
                                تغییر وضعیت
                              </button>

                              {/* Manage Items Status */}
                              <button
                                onClick={() => handleOpenItemsModal(pf)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold transition"
                                title="تغییر وضعیت تک‌تک ردیف‌های پیش‌فاکتور"
                              >
                                ردیف‌ها
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  setProformaToDeleteId(pf.id);
                                  setProformaToDeleteNumber(pf.proformaNumber || '');
                                  setDeleteConfirmOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-150 hover:border-red-150 transition"
                                title="حذف پیش‌فاکتور"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {filteredProformas.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
            <FileText className="mx-auto text-slate-300 mb-3" size={40} />
            هیچ فاکتور یا پیش‌فاککوری با معیارهای مدنظر شما یافت نشد.
          </div>
        )}
      </div>

      {/* Status Adjustment Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">تغییر وضعیت پیش‌فاکتور</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatusChange} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">وضعیت جدید را انتخاب کنید</label>
                <select
                  value={newStatusSelected}
                  onChange={(e) => setNewStatusSelected(e.target.value as Proforma['status'])}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                >
                  <option value="پیش‌نویس">پیش‌نویس (Draft)</option>
                  <option value="ارسال شده">ارسال شده به کارفرما (Sent)</option>
                  <option value="تأیید شده (برنده)">تأیید شده (برنده نهایی) ★</option>
                  <option value="لغو شده">لغو شده (Cancelled)</option>
                  <option value="باخته">باخته (عدم تایید فنی یا مالی)</option>
                </select>
              </div>



              {newStatusSelected === 'باخته' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">دلیل عدم موافقت و باخت پیشنهاد</label>
                  <select
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    <option value="">-- انتخاب علت --</option>
                    {settings.lossReasons.map((reason, i) => (
                      <option key={i} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition"
                >
                  ثبت وضعیت سند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Individual Items Status Modal */}
      {showItemsModal && selectedProformaForItems && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl overflow-hidden animate-scale-in my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800">مدیریت و ثبت علت باخت ردیف‌های پیش‌فاکتور</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">شماره سند: {selectedProformaForItems.proformaNumber} | مشتری: {selectedProformaForItems.customerName}</p>
              </div>
              <button onClick={() => setShowItemsModal(false)} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItemsStatus} className="p-6 space-y-4">
              <p className="text-slate-500 text-xs">
                چنانچه بعضی از ردیف‌های پیش‌فاکتور برنده و بعضی دیگر بازنده شده‌اند، وضعیت هر ردیف را به صورت مستقل به همراه علت باخت ثبت کنید. این کار به صورت اتوماتیک وضعیت کل پروژه مادری را نیز همگام‌سازی خواهد کرد.
              </p>

              <div className="border border-slate-150 rounded-xl overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
                      <th className="py-3 px-4">عنوان محصول</th>
                      <th className="py-3 px-4 text-center">تعداد</th>
                      <th className="py-3 px-4 text-left">مبلغ کل ({selectedProformaForItems.currency || 'ریال'})</th>
                      <th className="py-3 px-4 text-center w-48">وضعیت ردیف کالا</th>
                      <th className="py-3 px-4 text-center w-56">علت باخت (در صورت باخت)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editingItemsList.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/40">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <div>{item.productName}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="py-3 px-4 text-left font-mono text-slate-600">{(item.quantity * item.unitPriceRIYAL).toLocaleString('fa-IR')}</td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.status || 'جاری'}
                            onChange={(e) => handleItemStatusChangeInList(idx, e.target.value as ProformaItem['status'])}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white text-right font-medium"
                          >
                            <option value="جاری">جاری / در حال مذاکره</option>
                            <option value="برنده">برنده شده (Won) ★</option>
                            <option value="بازنده">بازنده شده (Lost)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.status === 'بازنده' ? (
                            <select
                              value={item.lossReason || ''}
                              onChange={(e) => handleItemLossReasonChangeInList(idx, e.target.value)}
                              required
                              className="w-full border border-rose-200 focus:border-rose-400 rounded px-2 py-1 text-xs bg-white text-right font-medium text-rose-700"
                            >
                              <option value="">-- انتخاب علت باخت --</option>
                              {settings.lossReasons?.map((reason, i) => (
                                <option key={i} value={reason}>{reason}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-400 text-[10px]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowItemsModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-500/15"
                >
                  بروزرسانی وضعیت اقلام پیش‌فاکتور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Create / Edit Proforma Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl overflow-hidden animate-scale-in my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editingProforma ? `ویرایش پیش‌فاکتور ${editingProforma.proformaNumber}` : 'صدور پیش‌فاکتور اتوماتیک جدید'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingProforma(null); }} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProforma} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Project Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">مرتبط با پروژه مادری (کد پروژه) *</label>
                  <div className="flex gap-1.5 items-center">
                    <select
                      value={projectId}
                      onChange={(e) => {
                        const projId = e.target.value;
                        setProjectId(projId);
                        if (projId) {
                          const proj = projects.find(p => p.id === projId);
                          if (proj) {
                            if (proj.customerId) {
                              setCustomerId(proj.customerId);
                            }
                            if (proj.itemsNeeded && proj.itemsNeeded.length > 0) {
                              const newItems = proj.itemsNeeded.map(item => {
                                const prod = products.find(p => p.id === item.productId);
                                return {
                                  productId: item.productId,
                                  productName: prod?.displayName || item.name,
                                  productCode: prod?.code || '',
                                  brand: prod?.brand || '',
                                  quantity: item.quantity,
                                  unitPriceRIYAL: prod?.basePriceRIYAL || 0
                                };
                              });
                              setItems(newItems);
                            }
                          }
                        }
                      }}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white font-bold text-sky-700 border-sky-300"
                    >
                      <option value="">بدون پروژه (خرید مستقیم)</option>
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

                {/* Customer Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">انتخاب خریدار / کارفرما *</label>
                  <div className="flex gap-1.5 items-center">
                    <select
                      value={customerId}
                      onChange={(e) => {
                        const newCustId = e.target.value;
                        setCustomerId(newCustId);
                        // Reset contact choice on customer change
                        setContactCustomerId('');
                      }}
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

                {/* Contact Select (مخاطب) when Customer is Legal (حقوقی) */}
                {(() => {
                  const selectedCustObj = customers.find(c => c.id === customerId);
                  const isLegalCustomer = selectedCustObj?.customerType === 'حقوقی';
                  const filteredContacts = isLegalCustomer
                    ? customers.filter(c => 
                        c.customerType === 'حقیقی' && 
                        (selectedCustObj.linkedCustomerIds?.includes(c.id) || 
                         c.companyName === selectedCustObj.companyName)
                      )
                    : [];
                  
                  if (!isLegalCustomer) return null;

                  return (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-xs font-semibold text-slate-500">مخاطب *</label>
                      <div className="flex gap-1.5 items-center">
                        <select
                          value={contactCustomerId}
                          onChange={(e) => setContactCustomerId(e.target.value)}
                          required
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                        >
                          <option value="">-- انتخاب مخاطب --</option>
                          {filteredContacts.map(c => (
                            <option key={c.id} value={c.id}>
                              {`${c.firstName || ''} ${c.lastName || ''}`.trim() || c.companyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })()}

                {/* Dates */}
                <div className="space-y-1.5" id="proforma-issue-date-picker-wrapper">
                  <ShamsiDatePicker
                    label="تاریخ صدور پیشنهاد"
                    required
                    value={issueDate}
                    onChange={(val) => setIssueDate(val)}
                  />
                </div>

                <div className="space-y-1.5" id="proforma-expiry-date-picker-wrapper">
                  <ShamsiDatePicker
                    label="تاریخ انقضای اعتبار پیشنهاد"
                    required
                    value={expiryDate}
                    onChange={(val) => setExpiryDate(val)}
                  />
                </div>

                <div className="space-y-1.5" id="proforma-delivery-date-picker-wrapper">
                  <label className="text-xs font-semibold text-slate-500">مدت و زمان تحویل کالا (تعهد تحویل) *</label>
                  <input
                    type="text"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    placeholder="مثال: ۳ هفته کاری پس از پیش پرداخت"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">مدت تحویل به صورت متنی (مثال: ۳ هفته کاری، ۱۰ روز تقویمی، فوری)</span>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">وضعیت سند</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Proforma['status'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    <option value="پیش‌نویس">پیش‌نویس</option>
                    <option value="ارسال شده">ارسال شده به کارفرما</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">نوع ارز پیش‌فاکتور *</label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as Proforma['currency'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white font-bold text-emerald-700 border-emerald-300"
                    required
                  >
                    <option value="ریال">ریال (IRR)</option>
                    <option value="دلار">دلار آمریکا (USD)</option>
                    <option value="یورو">یورو (EUR)</option>
                    <option value="درهم">درهم امارات (AED)</option>
                  </select>
                </div>
              </div>

              {/* Items multi-row block */}
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-slate-700">اقلام پیشنهاد تجهیزات ابزاردقیق</h4>
                  <button
                    type="button"
                    onClick={handleAddItemLine}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <PlusCircle size={14} />
                    افزودن ردیف کالا
                  </button>
                </div>

                {/* Grid headers */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-1 text-slate-400 font-bold text-[10px]">
                  <div className="col-span-5">انتخاب کالا</div>
                  <div className="col-span-2 text-center">تعداد</div>
                  <div className="col-span-2 text-left">بهای واحد ({currency})</div>
                  <div className="col-span-2 text-left">بهای کل ردیف ({currency})</div>
                  <div className="col-span-1 text-center">حذف</div>
                </div>

                {/* Items rows */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pl-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        
                        {/* Product Selector */}
                        <div className="col-span-5">
                          <div className="flex gap-1 items-center">
                            <select
                              value={item.productId}
                              onChange={(e) => handleItemProductChange(idx, e.target.value)}
                              className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white text-right min-w-0"
                            >
                              <option value="">-- انتخاب کالا --</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.displayName}</option>
                              ))}
                            </select>
                            {addProduct && (
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickAddProductIndex(idx);
                                  setQuickAddType('product');
                                }}
                                className="px-2 py-1.5 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center font-bold"
                                title="تعریف سریع کالای جدید"
                              >
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={1}
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemFieldChange(idx, 'quantity', Number(e.target.value))}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono text-center bg-white"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            required
                            value={item.unitPriceRIYAL}
                            onChange={(e) => handleItemFieldChange(idx, 'unitPriceRIYAL', Number(e.target.value))}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono text-left bg-white"
                          />
                        </div>

                        {/* Total price for line */}
                        <div className="col-span-2 text-left font-mono font-bold text-xs text-slate-700 px-2">
                          {(item.quantity * item.unitPriceRIYAL).toLocaleString()} {currency}
                        </div>

                        {/* Remove item line button */}
                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItemLine(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded transition"
                            disabled={items.length === 1}
                          >
                            <MinusCircle size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Technical specifications manual input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block">مشخصات فنی و توضیحات اختصاصی ردیف (مثال: سایز، متریال، سیگنال خروجی و ...)</label>
                        <textarea
                          rows={2}
                          value={item.techSpecs || ''}
                          onChange={(e) => handleItemFieldChange(idx, 'techSpecs', e.target.value)}
                          placeholder="مثال: سایز: ۲ اینچ، کلاس فشاری: PN16، متریال بدنه: WCB، خروجی: 4-20mA..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-right bg-white leading-relaxed"
                        />
                      </div>

                      {/* Product Image Selection */}
                      {(() => {
                        const prod = products.find(p => p.id === item.productId);
                        if (prod && prod.images && prod.images.length > 0) {
                          return (
                            <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                              <label className="text-[10px] font-bold text-slate-500 block">تصویر انتخابی برای این ردیف در پیش‌فاکتور:</label>
                              <div className="flex flex-wrap gap-2 items-center mt-1">
                                {prod.images.map((img, imgIdx) => {
                                  const isSelected = item.selectedImage === img || (!item.selectedImage && imgIdx === 0);
                                  return (
                                    <button
                                      type="button"
                                      key={imgIdx}
                                      onClick={() => handleItemFieldChange(idx, 'selectedImage', img)}
                                      className={`relative w-10 h-10 rounded-md border-2 overflow-hidden bg-slate-50 transition-all shrink-0 ${
                                        isSelected ? 'border-sky-500 ring-2 ring-sky-500/20 scale-105 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                                      }`}
                                    >
                                      <img
                                        src={img}
                                        alt={`Product image ${imgIdx + 1}`}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    </button>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() => handleItemFieldChange(idx, 'selectedImage', 'none')}
                                  className={`px-2 py-1 text-[9px] rounded border font-medium transition shrink-0 ${
                                    item.selectedImage === 'none'
                                      ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                  }`}
                                >
                                  عدم نمایش تصویر
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Bottom Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
                
                {/* Notes and custom variables */}
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">شرایط و مفاد عمومی پیشنهاد قیمت</label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="اعتبار پیشنهاد، شرایط تحویل، گارانتی قطعات..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                    />
                  </div>
                </div>

                {/* Numerical Totals Panel */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">جمع ناخالص اقلام:</span>
                    <span className="font-mono text-slate-700">{subTotal.toLocaleString()} {currency}</span>
                  </div>

                  {/* Discount percentage input */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">اعمال درصد تخفیف کلی:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-14 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center font-mono"
                      />
                      <span className="text-slate-400">%</span>
                      <span className="font-mono text-red-600 font-semibold">({discountAmount.toLocaleString()} {currency})</span>
                    </div>
                  </div>

                  {/* Tax percentage input */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">مالیات بر ارزش افزوده (VAT):</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-14 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center font-mono"
                      />
                      <span className="text-slate-400">%</span>
                      <span className="font-mono text-slate-600 font-semibold">({taxAmount.toLocaleString()} {currency})</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-sky-700">
                    <span>مبلغ کل خالص فاکتور:</span>
                    <span className="font-mono text-base">{finalAmount.toLocaleString()} {currency}</span>
                  </div>
                  {currency === 'ریال' ? (
                    <div className="text-left font-semibold text-slate-500 text-[10px]">
                      معادل تومان: {formatToman(finalAmount)}
                    </div>
                  ) : (
                    <div className="text-left font-semibold text-slate-500 text-[10px]">
                      {(() => {
                        const eng = mapPersianCurrencyToEnglish(currency);
                        const rateObj = eng ? exchangeRates.find(r => r.currency === eng) : undefined;
                        const rate = rateObj ? rateObj.rateToRIYAL : 1;
                        const riyalAmount = finalAmount * rate;
                        return `تسعیر همزمان: ${Math.round(riyalAmount).toLocaleString()} ریال (${Math.round(riyalAmount / 10).toLocaleString()} تومان)`;
                      })()}
                    </div>
                  )}
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingProforma(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15"
                >
                  {editingProforma ? 'اعمال تغییرات پیش‌فاکتور' : 'ذخیره و ثبت پیش‌فاکتور خودکار'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
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

      {/* Quick Customer Add Modal */}
      {showQuickCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-150">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Plus size={18} className="text-sky-500" />
                تعریف سریع مشتری جدید
              </h3>
              <button 
                type="button" 
                onClick={() => setShowQuickCustomerModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-right">
              {/* Customer Type Choice */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuickCustType('حقوقی')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    quickCustType === 'حقوقی'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  حقوقی (شرکت/سازمان)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCustType('حقیقی')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    quickCustType === 'حقیقی'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  حقیقی (شخصی)
                </button>
              </div>

              {quickCustType === 'حقوقی' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">نام شرکت / سازمان *</label>
                    <input
                      type="text"
                      value={quickCustName}
                      onChange={(e) => setQuickCustName(e.target.value)}
                      placeholder="مثال: فولاد خوزستان"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">رابط / شخص کلیدی</label>
                    <input
                      type="text"
                      value={quickCustKeyPerson}
                      onChange={(e) => setQuickCustKeyPerson(e.target.value)}
                      placeholder="مثال: مهندس احمدی"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">صنعت</label>
                    <select
                      value={quickCustIndustry}
                      onChange={(e) => setQuickCustIndustry(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {(settings.dropdownItems?.industries || ['نفت و گاز', 'فولاد و معادن', 'پتروشیمی', 'نیروگاهی', 'سیمان', 'آب و فاضلاب', 'غذایی و دارویی', 'سایر']).map((ind, idx) => (
                        <option key={idx} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">نام *</label>
                      <input
                        type="text"
                        value={quickCustFirstName}
                        onChange={(e) => setQuickCustFirstName(e.target.value)}
                        placeholder="مثال: محمد"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">نام خانوادگی *</label>
                      <input
                        type="text"
                        value={quickCustLastName}
                        onChange={(e) => setQuickCustLastName(e.target.value)}
                        placeholder="مثال: اکبری"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">سمت</label>
                    <select
                      value={quickCustPosition}
                      onChange={(e) => setQuickCustPosition(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">انتخاب کنید...</option>
                      {(settings.dropdownItems?.positions || ['مدیرعامل', 'مدیر بازرگانی', 'کارشناس خرید', 'مدیر فنی', 'کارشناس ابزار دقیق', 'سایر']).map((pos, idx) => (
                        <option key={idx} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">شماره تلفن</label>
                  <input
                    type="text"
                    value={quickCustPhone}
                    onChange={(e) => setQuickCustPhone(e.target.value)}
                    placeholder="۰۲۱-۸۸XXXXXX"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-left font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">پست الکترونیک</label>
                  <input
                    type="text"
                    value={quickCustEmail}
                    onChange={(e) => setQuickCustEmail(e.target.value)}
                    placeholder="info@company.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-left font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickCustomerModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-100 transition font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  if (quickCustType === 'حقوقی' && !quickCustName.trim()) {
                    alert('لطفاً نام شرکت را وارد کنید.');
                    return;
                  }
                  if (quickCustType === 'حقیقی' && (!quickCustFirstName.trim() || !quickCustLastName.trim())) {
                    alert('لطفاً نام و نام خانوادگی را وارد کنید.');
                    return;
                  }

                  const custData: any = {
                    type: quickCustType,
                    status: 'فعال',
                    phone: quickCustPhone,
                    mobile: '',
                    email: quickCustEmail,
                    province: '',
                    address: '',
                    notes: 'تعریف شده به صورت سریع از پیش‌فاکتور',
                    tags: '',
                    linkedCustomerIds: []
                  };

                  if (quickCustType === 'حقوقی') {
                    custData.companyName = quickCustName;
                    custData.industry = quickCustIndustry;
                    custData.keyPerson = quickCustKeyPerson;
                    custData.contactName = quickCustKeyPerson;
                    custData.contactLastName = '';
                  } else {
                    custData.firstName = quickCustFirstName;
                    custData.lastName = quickCustLastName;
                    custData.gender = 'نامشخص';
                    custData.position = quickCustPosition;
                    custData.companyName = `${quickCustFirstName} ${quickCustLastName}`.trim();
                    custData.contactName = quickCustFirstName;
                    custData.contactLastName = quickCustLastName;
                  }

                  if (addCustomer) {
                    const created = addCustomer(custData);
                    if (created && created.id) {
                      setCustomerId(created.id);
                      setShowQuickCustomerModal(false);
                    }
                  }
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition"
              >
                ثبت و انتخاب مشتری
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Project Add Modal */}
      {showQuickProjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-150">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Plus size={18} className="text-sky-500" />
                تعریف سریع پروژه جدید
              </h3>
              <button 
                type="button" 
                onClick={() => setShowQuickProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">نام پروژه *</label>
                <input
                  type="text"
                  value={quickProjName}
                  onChange={(e) => setQuickProjName(e.target.value)}
                  placeholder="مثال: اتوماسیون پست برق پتروشیمی لورم"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">نام مشتری / کارفرما *</label>
                <select
                  value={quickProjCustomerId}
                  onChange={(e) => setQuickProjCustomerId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">-- انتخاب مشتری --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">مرحله فرصت</label>
                  <select
                    value={quickProjStage}
                    onChange={(e) => setQuickProjStage(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {(settings.dropdownItems?.projectStatuses || ['جدید', 'در حال مذاکره', 'ارائه پیش‌فاکتور', 'برنده (موفق)', 'نیمه برنده', 'باخته', 'لغو شده']).map((stg, idx) => (
                      <option key={idx} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">مسئول فروش</label>
                  <select
                    value={quickProjSalesExpert}
                    onChange={(e) => setQuickProjSalesExpert(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {(settings.dropdownItems?.salesExperts || ['محمد توکل مقدم', 'آنتونی فیرو', 'مهندس حسینی']).map((exp, idx) => (
                      <option key={idx} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickProjectModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-100 transition font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!quickProjName.trim()) {
                    alert('لطفاً نام پروژه را وارد کنید.');
                    return;
                  }
                  if (!quickProjCustomerId) {
                    alert('لطفاً مشتری را انتخاب کنید.');
                    return;
                  }

                  const selectedCust = customers.find(c => c.id === quickProjCustomerId);
                  const customerName = selectedCust ? selectedCust.companyName : 'مشتری نامشخص';

                  const projData: any = {
                    name: quickProjName,
                    customerId: quickProjCustomerId,
                    customerName,
                    status: 'جدید',
                    stage: quickProjStage,
                    projectManager: quickProjSalesExpert,
                    endUser: '',
                    salesExpert: quickProjSalesExpert,
                    marketingChannel: '',
                    totalValue: 0,
                    lossReason: '',
                    notes: 'تعریف سریع از پیش‌فاکتور',
                    expectedCloseDate: '',
                    itemsNeeded: [],
                    customValues: {}
                  };

                  if (addProject) {
                    const created = addProject(projData);
                    if (created && created.id) {
                      setProjectId(created.id);
                      setCustomerId(quickProjCustomerId);
                      setShowQuickProjectModal(false);
                    }
                  }
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition"
              >
                ثبت و انتخاب پروژه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Status Update (Change all to Lost) Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-150">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <XCircle size={18} className="text-red-500" />
                ثبت باخت گروهی تمام نسخه‌های پیش‌فاکتور
              </h3>
              <button 
                type="button" 
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBulkStatus} className="p-5 space-y-4 text-right">
              <p className="text-xs text-slate-600 leading-relaxed">
                شما در حال تغییر وضعیت تمام پیش‌فاکتورهای پروژه <span className="font-extrabold text-slate-900">«{bulkProjectName}»</span> به وضعیت <span className="font-extrabold text-red-600">«باخته»</span> هستید. لطفاً علت باخت را جهت تحلیل‌های مدیریتی مشخص نمایید:
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">علت باخت پیش‌فاکتورها *</label>
                <select
                  value={bulkLossReason}
                  onChange={(e) => setBulkLossReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                  required
                >
                  <option value="">-- انتخاب علت باخت --</option>
                  {(settings.lossReasons || [
                    'قیمت بالا نسبت به رقبا',
                    'عدم تایید فنی برند/کالا از سوی کارفرما',
                    'زمان تحویل طولانی کالا',
                    'شرایط پرداخت نامناسب و سخت‌گیرانه',
                    'عدم پیگیری یا لغو کلی پروژه توسط کارفرما',
                    'تغییر مشخصات درخواستی و عدم پوشش ما',
                    'سایر موارد'
                  ]).map((reason, idx) => (
                    <option key={idx} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-4 -mx-5 -mb-5 border-t border-slate-150 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-100 transition font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-500/15"
                >
                  <XCircle size={14} />
                  ثبت قطعی باخت تمام نسخه‌ها
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
          addProduct={addProduct}
          products={products}
          onSuccess={(newEntity) => {
            if (newEntity && newEntity.id) {
              if (quickAddType === 'customer') {
                setCustomerId(newEntity.id);
              } else if (quickAddType === 'project') {
                setProjectId(newEntity.id);
                if (newEntity.customerId) {
                  setCustomerId(newEntity.customerId);
                }
              } else if (quickAddType === 'product' && quickAddProductIndex !== null) {
                handleItemProductChange(quickAddProductIndex, newEntity.id);
                setQuickAddProductIndex(null);
              }
            }
          }}
        />
      )}

    </div>
  );
}
