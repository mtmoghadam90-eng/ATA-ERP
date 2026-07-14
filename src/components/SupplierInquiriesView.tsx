import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  FileText, 
  TrendingUp, 
  Truck, 
  Briefcase, 
  Calendar, 
  Paperclip, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Award, 
  ShoppingCart,
  DollarSign,
  FileSpreadsheet,
  AlertCircle,
  Upload
} from 'lucide-react';
import { 
  Project, 
  Proforma, 
  ProformaItem, 
  Supplier, 
  SupplierInquiry, 
  InquiryStep,
  PurchaseOrder,
  PurchaseOrderItem,
  ERPSettings,
  ExchangeRate
} from '../types';
import { getTodayShamsi } from '../dateUtils';

interface SupplierInquiriesViewProps {
  projects: Project[];
  proformas: Proforma[];
  suppliers: Supplier[];
  supplierInquiries: SupplierInquiry[];
  addSupplierInquiry: (inquiry: Omit<SupplierInquiry, 'id' | 'createdAt' | 'steps'>) => any;
  updateSupplierInquiry: (inquiry: SupplierInquiry) => void;
  deleteSupplierInquiry: (id: string, deleteLogs?: boolean) => void;
  addSupplierInquiryStep: (inquiryId: string, step: Omit<InquiryStep, 'id'>) => void;
  selectSupplierInquiryWinner: (inquiryId: string, isWinner: boolean) => void;
  settings: ERPSettings;
  currentUser: any;
  exchangeRates: ExchangeRate[];
  addPurchaseOrder?: (po: any) => any; // optional if not supplied or can mock-run
}

export default function SupplierInquiriesView({
  projects,
  proformas,
  suppliers,
  supplierInquiries,
  addSupplierInquiry,
  updateSupplierInquiry,
  deleteSupplierInquiry,
  addSupplierInquiryStep,
  selectSupplierInquiryWinner,
  settings,
  currentUser,
  exchangeRates,
  addPurchaseOrder
}: SupplierInquiriesViewProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'compare' | 'new'>('list');

  // Filter States
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterSupplier, setFilterSupplier] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form States (New Inquiry)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [inquiryItems, setInquiryItems] = useState<any[]>([]);
  const [inquiryDate, setInquiryDate] = useState<string>(getTodayShamsi());
  React.useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find(p => p.id === selectedProjectId);
      if (proj && proj.itemsNeeded) {
        setInquiryItems(proj.itemsNeeded.map(item => ({
          id: `${Date.now()}-${Math.random()}`,
          requestItemId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          priceForeign: 0,
          priceRIYAL: 0,
          currency: 'یورو',
          deliveryTime: '',
          notes: ''
        })));
      } else {
        setInquiryItems([]);
      }
    } else {
      setInquiryItems([]);
    }
  }, [selectedProjectId, projects]);

  const [initialNotes, setInitialNotes] = useState<string>('');
  const [priceRIYAL, setPriceRIYAL] = useState<number>(0);
  const [priceForeign, setPriceForeign] = useState<number>(0);
  const [currency, setCurrency] = useState<'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان'>('یورو');
  
  // Auto-calculate Rial price
  React.useEffect(() => {
    if (currency === 'ریال') {
        setPriceRIYAL(priceForeign);
    } else {
        const mapping: Record<string, 'USD' | 'EUR' | 'AED' | 'CNY'> = {
            'دلار': 'USD',
            'یورو': 'EUR',
            'درهم': 'AED',
            'یوان': 'CNY'
        };
        const rateObj = exchangeRates.find(r => r.currency === mapping[currency]);
        if (rateObj) {
            setPriceRIYAL(Math.round(priceForeign * rateObj.rateToRIYAL));
        }
    }
  }, [currency, priceForeign, exchangeRates]);

  const [deliveryTime, setDeliveryTime] = useState<string>('');
  
  // Simulated File Uploads
  const [techFileName, setTechFileName] = useState<string>('');
  const [finFileName, setFinFileName] = useState<string>('');
  const [techFileSize, setTechFileSize] = useState<string>('');
  const [finFileSize, setFinFileSize] = useState<string>('');
  const [isUploadingTech, setIsUploadingTech] = useState<boolean>(false);
  const [uploadProgressTech, setUploadProgressTech] = useState<number>(0);
  const [isUploadingFin, setIsUploadingFin] = useState<boolean>(false);
  const [uploadProgressFin, setUploadProgressFin] = useState<number>(0);

  const handleFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setTechFileName(file.name);
      setTechFileSize(sizeInMB);
      setIsUploadingTech(true);
      setUploadProgressTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setFinFileName(file.name);
      setFinFileSize(sizeInMB);
      setIsUploadingFin(true);
      setUploadProgressFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingFin(false);
          }, 300);
        }
      }, 100);
    }
  };

  // Expandable Inquiries
  const [expandedInquiries, setExpandedInquiries] = useState<Record<string, boolean>>({});

  // Action Log Modal States
  const [activeInquiryForStep, setActiveInquiryForStep] = useState<SupplierInquiry | null>(null);
  const [stepActionType, setStepActionType] = useState<string>('');
  const [stepDesc, setStepDesc] = useState<string>('');

  // Sent Status Modal States
  const [activeInquiryForSent, setActiveInquiryForSent] = useState<SupplierInquiry | null>(null);
  const [sentMethod, setSentMethod] = useState<string>('ایمیل');
  const [sentTo, setSentTo] = useState<string>('');

  // Delete Confirmation Modal States
  const [deleteInquiryId, setDeleteInquiryId] = useState<string | null>(null);
  const [deleteActivitiesWithInquiry, setDeleteActivitiesWithInquiry] = useState<boolean>(true);

  // Answer Log Modal States
  const [activeInquiryForAnswer, setActiveInquiryForAnswer] = useState<SupplierInquiry | null>(null);
  const [answerPriceRIYAL, setAnswerPriceRIYAL] = useState<number>(0);
  const [answerPriceForeign, setAnswerPriceForeign] = useState<number>(0);
  const [answerCurrency, setAnswerCurrency] = useState<'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان'>('یورو');
  
  // Auto-calculate Rial price for answer
  React.useEffect(() => {
    if (answerCurrency === 'ریال') {
        setAnswerPriceRIYAL(answerPriceForeign);
    } else {
        const mapping: Record<string, 'USD' | 'EUR' | 'AED' | 'CNY'> = {
            'دلار': 'USD',
            'یورو': 'EUR',
            'درهم': 'AED',
            'یوان': 'CNY'
        };
        const rateObj = exchangeRates.find(r => r.currency === mapping[answerCurrency]);
        if (rateObj) {
            setAnswerPriceRIYAL(Math.round(answerPriceForeign * rateObj.rateToRIYAL));
        }
    }
  }, [answerCurrency, answerPriceForeign, exchangeRates]);

  const [answerDeliveryTime, setAnswerDeliveryTime] = useState<string>('');
  const [answerTechFile, setAnswerTechFile] = useState<string>('');
  const [answerFinFile, setAnswerFinFile] = useState<string>('');
  const [answerTechFileSize, setAnswerTechFileSize] = useState<string>('');
  const [answerFinFileSize, setAnswerFinFileSize] = useState<string>('');
  const [isUploadingAnswerTech, setIsUploadingAnswerTech] = useState<boolean>(false);
  const [uploadProgressAnswerTech, setUploadProgressAnswerTech] = useState<number>(0);
  const [isUploadingAnswerFin, setIsUploadingAnswerFin] = useState<boolean>(false);
  const [uploadProgressAnswerFin, setUploadProgressAnswerFin] = useState<number>(0);

  const handleAnswerFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setAnswerTechFile(file.name);
      setAnswerTechFileSize(sizeInMB);
      setIsUploadingAnswerTech(true);
      setUploadProgressAnswerTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressAnswerTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingAnswerTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setAnswerFinFile(file.name);
      setAnswerFinFileSize(sizeInMB);
      setIsUploadingAnswerFin(true);
      setUploadProgressAnswerFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressAnswerFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingAnswerFin(false);
          }, 300);
        }
      }, 100);
    }
  };

  // PO Creation Modal States
  const [activeInquiryForPO, setActiveInquiryForPO] = useState<SupplierInquiry | null>(null);
  const [poOrderDate, setPoOrderDate] = useState<string>(getTodayShamsi());
  const [poDeliveryDate, setPoDeliveryDate] = useState<string>('');
  const [poExchangeRate, setPoExchangeRate] = useState<number>(650000); // sample exchange rate
  const [poShippingCost, setPoShippingCost] = useState<number>(150000000);
  const [poCustomsDuty, setPoCustomsDuty] = useState<number>(100000000);
  const [poRemittanceFee, setPoRemittanceFee] = useState<number>(20000000);
  const [poNotes, setPoNotes] = useState<string>('');
  const [poCreatedSuccess, setPoCreatedSuccess] = useState<boolean>(false);

  // Comparison Selectors
  const [compareProjectId, setCompareProjectId] = useState<string>('');
  const [compareProformaId, setCompareProformaId] = useState<string>('');
  const [compareItemId, setCompareItemId] = useState<string>('');

  // Edit Inquiry Modal States
  const [editingInquiry, setEditingInquiry] = useState<SupplierInquiry | null>(null);
  const [editProjectId, setEditProjectId] = useState<string>('');
  const [editProformaId, setEditProformaId] = useState<string>('');
  const [editProformaItemId, setEditProformaItemId] = useState<string>('');
  const [editSupplierId, setEditSupplierId] = useState<string>('');
  const [editInquiryDate, setEditInquiryDate] = useState<string>('');
  const [editPriceRIYAL, setEditPriceRIYAL] = useState<number>(0);
  const [editPriceForeign, setEditPriceForeign] = useState<number>(0);
  const [editCurrency, setEditCurrency] = useState<'دلار' | 'یورو' | 'درهم' | 'ریال'>('یورو');
  const [editDeliveryTime, setEditDeliveryTime] = useState<string>('');
  const [editTechFileName, setEditTechFileName] = useState<string>('');
  const [editFinFileName, setEditFinFileName] = useState<string>('');
  const [editTechFileSize, setEditTechFileSize] = useState<string>('');
  const [editFinFileSize, setEditFinFileSize] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('پیش‌نویس');
  const [editItems, setEditItems] = useState<any[]>([]);

  const [isUploadingEditTech, setIsUploadingEditTech] = useState<boolean>(false);
  const [uploadProgressEditTech, setUploadProgressEditTech] = useState<number>(0);
  const [isUploadingEditFin, setIsUploadingEditFin] = useState<boolean>(false);
  const [uploadProgressEditFin, setUploadProgressEditFin] = useState<number>(0);

  const handleEditFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setEditTechFileName(file.name);
      setEditTechFileSize(sizeInMB);
      setIsUploadingEditTech(true);
      setUploadProgressEditTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressEditTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingEditTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setEditFinFileName(file.name);
      setEditFinFileSize(sizeInMB);
      setIsUploadingEditFin(true);
      setUploadProgressEditFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressEditFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingEditFin(false);
          }, 300);
        }
      }, 100);
    }
  };

  // Toggle Card Expansion
  const toggleExpand = (id: string) => {
    setExpandedInquiries(prev => ({ ...prev, [id]: !prev[id] }));
  };


  // Filter proformas based on selected project in edit form
  const editAvailableProformas = proformas.filter(p => p.projectId === editProjectId);
  // Filter items based on selected proforma in edit form
  const editSelectedProforma = proformas.find(p => p.id === editProformaId);
  const editAvailableItems = editSelectedProforma ? editSelectedProforma.items : [];

  // Reset form helper
  const resetForm = () => {
    setSelectedProjectId('');
    setSelectedSupplierId('');
    setInquiryDate(getTodayShamsi());
    setInitialNotes('');
    setPriceRIYAL(0);
    setPriceForeign(0);
    setCurrency('یورو');
    setDeliveryTime('');
    setTechFileName('');
    setFinFileName('');
    setTechFileSize('');
    setFinFileSize('');
    setUploadProgressTech(0);
    setUploadProgressFin(0);
    setIsUploadingTech(false);
    setIsUploadingFin(false);
  };

  // Submit New Inquiry
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('لطفاً تامین‌کننده را حتماً مشخص کنید.');
      return;
    }

    const proj = projects.find(p => p.id === selectedProjectId);
    const supp = suppliers.find(s => s.id === selectedSupplierId);

    addSupplierInquiry({
      projectId: selectedProjectId,
      projectName: proj?.name || '',
      items: inquiryItems.map((item, idx) => ({
        id: `inqitem-${Date.now()}-${idx}`,
        requestItemId: item.requestItemId || '',
        productName: item.productName,
        quantity: item.quantity,
        priceForeign: item.priceForeign || undefined,
        priceRIYAL: item.priceRIYAL || undefined,
        currency: item.currency || undefined,
        deliveryTime: item.deliveryTime || undefined,
        notes: item.notes || undefined
      })),
      supplierId: selectedSupplierId,
      supplierName: supp?.name || '',
      inquiryDate: inquiryDate,
      status: 'پیش‌نویس',
      priceRIYAL: priceRIYAL || undefined,
      priceForeign: priceForeign || undefined,
      currency: currency,
      deliveryTime: deliveryTime || undefined,
      technicalProposalFile: techFileName || undefined,
      financialProposalFile: finFileName || undefined,
      technicalProposalFileSize: techFileSize || (techFileName ? '1.4 MB' : undefined),
      financialProposalFileSize: finFileSize || (finFileName ? '980 KB' : undefined),
      notes: initialNotes || undefined
    });

    resetForm();
    setActiveTab('list');
  };

  // Submit Edit Inquiry
  const handleEditInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry || !editProjectId || !editSupplierId) {
      alert('لطفاً پروژه و تامین‌کننده را حتماً مشخص کنید.');
      return;
    }

    const proj = projects.find(p => p.id === editProjectId);
    const supp = suppliers.find(s => s.id === editSupplierId);

    const updated: SupplierInquiry = {
      ...editingInquiry,
      projectId: editProjectId || undefined,
      projectName: proj?.name || undefined,
      supplierId: editSupplierId,
      supplierName: supp?.name || '',
      inquiryDate: editInquiryDate,
      priceRIYAL: editPriceRIYAL || undefined,
      priceForeign: editPriceForeign || undefined,
      currency: editCurrency,
      deliveryTime: editDeliveryTime || undefined,
      technicalProposalFile: editTechFileName || undefined,
      financialProposalFile: editFinFileName || undefined,
      technicalProposalFileSize: editTechFileSize || undefined,
      financialProposalFileSize: editFinFileSize || undefined,
      notes: editNotes || undefined,
      status: editStatus as any,
      items: editItems
    };

    updateSupplierInquiry(updated);

    setStepActionType('');
    setStepDesc('');
    setActiveInquiryForStep(null);
  };

  // Submit Confirm Sent Log & status update
  const handleConfirmSent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForSent) return;

    addSupplierInquiryStep(activeInquiryForSent.id, {
      date: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      title: 'ارسال درخواست قیمت به تامین‌کننده',
      description: `درخواست قیمت از طریق ${sentMethod} برای ${sentTo} ارسال گردید.`,
      type: 'sent',
      sentMethod,
      sentTo
    });

    setActiveInquiryForSent(null);
    setSentMethod('ایمیل');
    setSentTo('');
  };

  // Submit Answer Log
  
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForStep) return;

    addSupplierInquiryStep(activeInquiryForStep.id, {
      date: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      title: stepActionType || 'ثبت اقدام',
      description: stepDesc,
      type: 'sent'
    });

    setActiveInquiryForStep(null);
    setStepActionType('');
    setStepDesc('');
  };

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForAnswer) return;

    const today = getTodayShamsi();
    const updatedInquiry: SupplierInquiry = {
      ...activeInquiryForAnswer,
      priceRIYAL: answerPriceRIYAL || undefined,
      priceForeign: answerPriceForeign || undefined,
      currency: answerCurrency,
      deliveryTime: answerDeliveryTime || undefined,
      technicalProposalFile: answerTechFile || undefined,
      financialProposalFile: answerFinFile || undefined,
      technicalProposalFileSize: answerTechFileSize || (answerTechFile ? '2.1 MB' : undefined),
      financialProposalFileSize: answerFinFileSize || (answerFinFile ? '1.1 MB' : undefined),
      status: 'پاسخ داده شده'
    };

    const answerStep: InquiryStep = {
      id: `step-${Date.now()}-answer`,
      date: today + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      title: 'ثبت پاسخ تامین‌کننده',
      description: `پیشنهاد قیمت ثبت شد: ${answerPriceForeign ? `${answerPriceForeign.toLocaleString()} ${answerCurrency}` : ''} ${answerPriceRIYAL ? `/ ${answerPriceRIYAL.toLocaleString()} ریال` : ''} - زمان تحویل: ${answerDeliveryTime || 'نامشخص'}`,
      type: 'response'
    };

    updatedInquiry.steps = [...updatedInquiry.steps, answerStep];
    updateSupplierInquiry(updatedInquiry);

    setActiveInquiryForAnswer(null);
    setAnswerPriceRIYAL(0);
    setAnswerPriceForeign(0);
    setAnswerDeliveryTime('');
    setAnswerTechFile('');
    setAnswerFinFile('');
    setAnswerTechFileSize('');
    setAnswerFinFileSize('');
    setUploadProgressAnswerTech(0);
    setUploadProgressAnswerFin(0);
    setIsUploadingAnswerTech(false);
    setIsUploadingAnswerFin(false);
  };

  // Submit PO Creation
  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForPO) return;

    // Check if store has addPurchaseOrder function exposed
    const erpAddPO = addPurchaseOrder || (window as any).__erpStore_addPurchaseOrder;

    if (!erpAddPO) {
      alert('خطا: تابع ثبت سفارش خرید پیدا نشد.');
      return;
    }

    const inq = activeInquiryForPO;
    
    // Build items list
    const poItems: any[] = [
      {
        id: `poi-${Date.now()}`,
        productId: inq.proformaItemId || `prod-inq-${Date.now()}`,
        productName: inq.proformaItemName || 'کالای استعلام شده',
        productCode: 'GEN',
        brand: 'مختلف',
        quantity: 1,
        unitPriceForeignCurrency: inq.priceForeign || 0,
        totalPriceForeignCurrency: inq.priceForeign || 0,
        proformaItemId: inq.proformaItemId,
        proformaItemName: inq.proformaItemName
      }
    ];

    const foreignTotal = inq.priceForeign || 0;
    const landedCost = (foreignTotal * poExchangeRate) + poShippingCost + poCustomsDuty + poRemittanceFee;

    const newPO = {
      supplierId: inq.supplierId,
      supplierName: inq.supplierName,
      projectId: inq.projectId,
      projectName: inq.projectName,
      proformaId: inq.proformaId,
      proformaNumber: inq.proformaNumber,
      orderDate: poOrderDate,
      expectedDeliveryDate: poDeliveryDate || getTodayShamsi(),
      currency: inq.currency || 'یورو',
      exchangeRate: poExchangeRate,
      items: poItems,
      totalForeignAmount: foreignTotal,
      shippingCostRIYAL: poShippingCost,
      customsDutyRIYAL: poCustomsDuty,
      remittanceFeeRIYAL: poRemittanceFee,
      calculatedLandedCostRIYAL: landedCost,
      status: 'پیش‌نویس' as const,
      notes: poNotes || `سفارش خرید صادر شده از روی آفر برنده تامین‌کننده ${inq.supplierName} بابت استعلام شماره ${inq.id}`
    };

    erpAddPO(newPO);
    setPoCreatedSuccess(true);
    setTimeout(() => {
      setPoCreatedSuccess(false);
      setActiveInquiryForPO(null);
    }, 2000);
  };

  // Filters
  const filteredInquiries = supplierInquiries.filter(inq => {
    const matchesProject = !filterProject || inq.projectId === filterProject;
    const matchesSupplier = !filterSupplier || inq.supplierId === filterSupplier;
    const matchesStatus = !filterStatus || inq.status === filterStatus;
    
    const matchesSearch = !searchTerm || 
      inq.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.proformaItemName && inq.proformaItemName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesProject && matchesSupplier && matchesStatus && matchesSearch;
  });

  // Comparisons Grouping & Filter
  const compareProformas = proformas.filter(p => p.projectId === compareProjectId);
  const compareProforma = proformas.find(p => p.id === compareProformaId);
  const compareItems = compareProforma ? compareProforma.items : [];

  const comparisonOffers = supplierInquiries.filter(inq => {
    return inq.projectId === compareProjectId &&
           (!compareProformaId || inq.proformaId === compareProformaId) &&
           (!compareItemId || inq.proformaItemId === compareItemId);
  });

  // Stats Counters
  const totalCount = supplierInquiries.length;
  const pendingCount = supplierInquiries.filter(i => i.status === 'پیش‌نویس' || i.status === 'ارسال شده' || i.status === 'در انتظار پاسخ').length;
  const winnerCount = supplierInquiries.filter(i => i.isWinner).length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="text-sky-500" size={28} />
            استعلام از تأمین‌کنندگان
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            ثبت، پیگیری مرحله به مرحله و مقایسه فنی و مالی پیشنهادهای قیمتی سازندگان و تامین‌کنندگان
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-sky-50 px-4 py-2.5 rounded-xl border border-sky-100 flex items-center gap-3">
            <div className="text-sky-600 font-bold text-2xl">{totalCount}</div>
            <div className="text-xs text-sky-700">کل استعلام‌ها</div>
          </div>
          <div className="bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100 flex items-center gap-3">
            <div className="text-amber-600 font-bold text-2xl">{pendingCount}</div>
            <div className="text-xs text-amber-700">در انتظار آفر</div>
          </div>
          <div className="bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
            <div className="text-emerald-600 font-bold text-2xl">{winnerCount}</div>
            <div className="text-xs text-emerald-700">آفرهای برنده شده</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'list' 
              ? 'border-sky-500 text-sky-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Truck size={18} />
          لیست استعلام‌ها و پیگیری‌ها
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'compare' 
              ? 'border-sky-500 text-sky-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <TrendingUp size={18} />
          مقایسه هوشمند آفرها و انتخاب برنده
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveTab('new');
          }}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'new' 
              ? 'border-sky-500 text-sky-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Plus size={18} />
          ثبت استعلام جدید
        </button>
      </div>

      {/* TAB 1: LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">فیلتر پروژه</label>
              <select
                value={filterProject}
                onChange={e => setFilterProject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">همه پروژه‌ها</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">فیلتر تامین‌کننده</label>
              <select
                value={filterSupplier}
                onChange={e => setFilterSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">همه تامین‌کنندگان</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">وضعیت استعلام</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="پیش‌نویس">پیش‌نویس</option>
                <option value="ارسال شده">ارسال شده (درخواست قیمت)</option>
                <option value="در انتظار پاسخ">در انتظار پاسخ</option>
                <option value="پاسخ داده شده">پاسخ داده شده</option>
                <option value="برنده">برنده (آفر منتخب)</option>
                <option value="بازنده">بازنده</option>
                <option value="لغو شده">لغو شده</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">جستجو متنی</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو تامین‌کننده، پروژه..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
                />
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Cards List */}
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle size={32} />
              </div>
              <h3 className="font-bold text-slate-700">هیچ استعلامی یافت نشد</h3>
              <p className="text-xs text-slate-400">اطلاعاتی متناسب با فیلترهای انتخابی شما در سیستم وجود ندارد.</p>
              <button 
                onClick={() => setActiveTab('new')} 
                className="mt-2 bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition"
              >
                ثبت اولین استعلام از تامین‌کننده
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map(inq => {
                const isExpanded = !!expandedInquiries[inq.id];
                const lastStep = inq.steps[inq.steps.length - 1];
                
                return (
                  <div 
                    key={inq.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
                      inq.isWinner 
                        ? 'border-emerald-200 bg-emerald-50/10' 
                        : isExpanded ? 'border-sky-200 ring-1 ring-sky-100' : 'border-slate-100'
                    }`}
                  >
                    {/* Header Summary */}
                    <div className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      {/* Left: Supplier & Project info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-base">{inq.supplierName}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Briefcase size={14} />
                            {inq.projectName}
                          </span>
                          
                          {/* Winner Stamp */}
                          {inq.isWinner && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <Award size={12} />
                              آفر برنده (منتخب)
                            </span>
                          )}
                        </div>

                        {/* Proforma details */}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {inq.proformaNumber && (
                            <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                              پیش‌فاکتور {inq.proformaNumber}
                            </span>
                          )}
                          {inq.proformaItemName && (
                            <span className="text-slate-400">
                              ردیف: <strong className="text-slate-600 font-semibold">{inq.proformaItemName}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Price / Status / Expand control */}
                      <div className="flex items-center gap-4 self-stretch lg:self-auto justify-between lg:justify-end border-t border-slate-50 lg:border-t-0 pt-3 lg:pt-0">
                        {/* Price & Delivery */}
                        <div className="text-left font-mono">
                          {inq.priceForeign ? (
                            <div className="text-sm font-bold text-slate-700">
                              {inq.priceForeign.toLocaleString('fa-IR')} {inq.currency}
                            </div>
                          ) : inq.priceRIYAL ? (
                            <div className="text-sm font-bold text-slate-700">
                              {inq.priceRIYAL.toLocaleString('fa-IR')} ریال
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400">بدون آفر قیمت</div>
                          )}
                          
                          {inq.deliveryTime && (
                            <div className="text-[10px] text-slate-400">
                              تحویل: {inq.deliveryTime}
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          inq.status === 'برنده' || inq.isWinner ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          inq.status === 'بازنده' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          inq.status === 'پاسخ داده شده' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                          inq.status === 'ارسال شده' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                          {inq.status}
                        </span>

                        {/* Toggle button */}
                        <button 
                          onClick={() => toggleExpand(inq.id)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Action logs & steps */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-5 bg-slate-50/50 rounded-b-2xl space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                                                    {/* Items Table Full Width */}
                          {inq.items && inq.items.length > 0 && (
                            <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded-xl border border-slate-100">
                              <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 mb-3">اقلام استعلام و پیشنهاد سازنده</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-right">
                                  <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                      <th className="p-2 font-semibold">شرح کالا</th>
                                      <th className="p-2 font-semibold text-center w-16">تعداد</th>
                                      <th className="p-2 font-semibold w-24">قیمت ارزی</th>
                                      <th className="p-2 font-semibold w-32">قیمت ریالی</th>
                                      <th className="p-2 font-semibold w-24">زمان تحویل</th>
                                      <th className="p-2 font-semibold">ملاحظات</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {inq.items.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="p-2 font-medium text-slate-700">{item.productName}</td>
                                        <td className="p-2 text-center text-slate-600 font-mono">{item.quantity}</td>
                                        <td className="p-2 font-mono text-slate-600">{item.priceForeign ? `${item.priceForeign.toLocaleString('fa-IR')} ${item.currency}` : '-'}</td>
                                        <td className="p-2 font-mono text-slate-600">{item.priceRIYAL ? `${item.priceRIYAL.toLocaleString('fa-IR')} ریال` : '-'}</td>
                                        <td className="p-2 text-slate-600">{item.deliveryTime || '-'}</td>
                                        <td className="p-2 text-slate-500">{item.notes || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          {/* Column 1: Details & Files */}
                          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">مشخصات و مستندات آفر</h4>
                            
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400">تاریخ استعلام:</span>
                                <span className="font-semibold text-slate-600">{inq.inquiryDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">قیمت ریالی:</span>
                                <span className="font-semibold text-slate-600 font-mono">
                                  {inq.priceRIYAL ? `${inq.priceRIYAL.toLocaleString('fa-IR')} ریال` : 'ثبت نشده'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">قیمت ارزی:</span>
                                <span className="font-semibold text-slate-600 font-mono">
                                  {inq.priceForeign ? `${inq.priceForeign.toLocaleString('fa-IR')} ${inq.currency}` : 'ثبت نشده'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">زمان تحویل:</span>
                                <span className="font-semibold text-slate-600">{inq.deliveryTime || 'ثبت نشده'}</span>
                              </div>
                            </div>

                            {/* Files Section */}
                            <div className="space-y-2 pt-2 border-t border-slate-50">
                              <div className="text-slate-400 text-[11px] mb-1">فایل‌های پیوست پیشنهاد:</div>
                              
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Paperclip size={14} className="text-slate-400" />
                                    <span>{inq.technicalProposalFile || 'پیشنهاد فنی.pdf (فرضی)'}</span>
                                  </div>
                                  <span className="text-slate-400 font-mono text-[10px]">{inq.technicalProposalFileSize || '1.2 MB'}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Paperclip size={14} className="text-slate-400" />
                                    <span>{inq.financialProposalFile || 'پیشنهاد مالی.pdf (فرضی)'}</span>
                                  </div>
                                  <span className="text-slate-400 font-mono text-[10px]">{inq.financialProposalFileSize || '820 KB'}</span>
                                </div>
                              </div>
                            </div>

                            {inq.notes && (
                              <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50 text-[11px] text-amber-800 leading-relaxed">
                                <strong>توضیحات:</strong> {inq.notes}
                              </div>
                            )}
                          </div>

                          {/* Column 2: Step-by-step Actions Timeline */}
                          <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-100">
                              <h4 className="text-xs font-bold text-slate-700">تاریخچه اقدامات و فرآیند استعلام</h4>
                              <button
                                onClick={() => {
                                  setActiveInquiryForStep(inq);
                                  const list = settings?.dropdownItems?.supplierInquiryActionTypes || [
                                    'تماس تلفنی پیگیری قیمت', 
                                    'مکاتبه از طریق ایمیل', 
                                    'ارسال مجدد مشخصات فنی', 
                                    'مذاکره حضوری / آنلاین', 
                                    'دریافت پروپوزال فنی/مالی', 
                                    'سایر'
                                  ];
                                  setStepActionType(list[0] || '');
                                }}
                                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                              >
                                <Plus size={14} />
                                ثبت اقدام جدید
                              </button>
                            </div>

                            {/* Timeline steps */}
                            <div className="relative border-r-2 border-slate-200 pr-5 mr-3 space-y-4">
                              {inq.steps.map((st, idx) => {
                                return (
                                  <div key={st.id || idx} className="relative">
                                    {/* Timeline dot */}
                                    <div className={`absolute -right-[27px] top-1 w-3 h-3 rounded-full border-2 bg-white ${
                                      st.type === 'creation' ? 'border-slate-400' :
                                      st.type === 'sent' ? 'border-amber-400' :
                                      st.type === 'response' ? 'border-sky-400' :
                                      st.type === 'winner' ? 'border-emerald-500 bg-emerald-50' :
                                      'border-slate-300'
                                    }`} />
                                    
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs space-y-1">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-700">{st.title}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{st.date}</span>
                                      </div>
                                      <p className="text-slate-500 text-xs leading-relaxed">{st.description}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Quick Update Buttons */}
                            <div className="flex gap-2 flex-wrap pt-2">
                              {inq.status === 'پیش‌نویس' && (
                                <button
                                  onClick={() => {
                                    setActiveInquiryForSent(inq);
                                    const supp = suppliers.find(s => s.id === inq.supplierId);
                                    setSentTo(supp?.contactName || '');
                                    setSentMethod('ایمیل');
                                  }}
                                  className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition flex items-center gap-1"
                                >
                                  <Truck size={14} />
                                  تغییر وضعیت به «ارسال شده»
                                </button>
                              )}

                              {inq.status !== 'پاسخ داده شده' && inq.status !== 'برنده' && (
                                <button
                                  onClick={() => {
                                    setActiveInquiryForAnswer(inq);
                                    setAnswerPriceRIYAL(inq.priceRIYAL || 0);
                                    setAnswerPriceForeign(inq.priceForeign || 0);
                                    setAnswerCurrency(inq.currency || 'یورو');
                                    setAnswerDeliveryTime(inq.deliveryTime || '');
                                  }}
                                  className="bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-sky-600 transition flex items-center gap-1"
                                >
                                  <FileSpreadsheet size={14} />
                                  ثبت پاسخ و آفر تامین‌کننده
                                </button>
                              )}

                              {!inq.isWinner && inq.status === 'پاسخ داده شده' && (
                                <button
                                  onClick={() => selectSupplierInquiryWinner(inq.id, true)}
                                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"
                                >
                                  <Check size={14} />
                                  انتخاب به عنوان پیشنهاد برنده
                                </button>
                              )}

                              {inq.isWinner && (
                                <>
                                  <button
                                    onClick={() => selectSupplierInquiryWinner(inq.id, false)}
                                    className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition flex items-center gap-1"
                                  >
                                    <X size={14} />
                                    لغو وضعیت برنده آفر
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveInquiryForPO(inq);
                                      setPoDeliveryDate(inq.deliveryTime || '');
                                    }}
                                    className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm animate-pulse"
                                  >
                                    <ShoppingCart size={14} />
                                    صدور سفارش خرید خارجی (PO)
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingInquiry(inq);
                                  setEditProjectId(inq.projectId);
                                  setEditProformaId(inq.proformaId || '');
                                  setEditProformaItemId(inq.proformaItemId || '');
                                  setEditSupplierId(inq.supplierId);
                                  setEditInquiryDate(inq.inquiryDate);
                                  setEditPriceRIYAL(inq.priceRIYAL || 0);
                                  setEditPriceForeign(inq.priceForeign || 0);
                                  setEditCurrency(inq.currency || 'یورو');
                                  setEditDeliveryTime(inq.deliveryTime || '');
                                  setEditTechFileName(inq.technicalProposalFile || '');
                                  setEditFinFileName(inq.financialProposalFile || '');
                                  setEditTechFileSize(inq.technicalProposalFileSize || '');
                                  setEditFinFileSize(inq.financialProposalFileSize || '');
                                  setEditNotes(inq.notes || '');
                                  setEditStatus(inq.status);
                                }}
                                className="bg-sky-50 text-sky-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-sky-100 transition flex items-center gap-1"
                              >
                                <Edit size={14} />
                                ویرایش استعلام
                              </button>

                              <button
                                onClick={() => {
                                  setDeleteInquiryId(inq.id);
                                  setDeleteActivitiesWithInquiry(true);
                                }}
                                className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-rose-100 transition mr-auto flex items-center gap-1"
                              >
                                <Trash2 size={14} />
                                حذف پرونده استعلام
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OFFERS COMPARISON (BENTO GRID) */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {/* Compare Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">انتخاب پروژه</label>
              <select
                value={compareProjectId}
                onChange={e => {
                  setCompareProjectId(e.target.value);
                  setCompareProformaId('');
                  setCompareItemId('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">-- انتخاب پروژه جهت مقایسه --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">پیش‌فاکتور کارفرما</label>
              <select
                value={compareProformaId}
                disabled={!compareProjectId}
                onChange={e => {
                  setCompareProformaId(e.target.value);
                  setCompareItemId('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none disabled:opacity-50"
              >
                <option value="">همه پیش‌فاکتورها</option>
                {compareProformas.map(p => (
                  <option key={p.id} value={p.id}>پیش‌فاکتور {p.proformaNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">ردیف کالا (تجهیز)</label>
              <select
                value={compareItemId}
                disabled={!compareProformaId}
                onChange={e => setCompareItemId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none disabled:opacity-50"
              >
                <option value="">همه کالاها</option>
                {compareItems.map(it => (
                  <option key={it.id} value={it.id}>{it.productName}{it.brand ? ` (${it.brand})` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side Bento Comparison */}
          {!compareProjectId ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 text-xs">
              <TrendingUp className="mx-auto mb-3 text-slate-300" size={36} />
              لطفاً برای مقایسه هوشمند، ابتدا پروژه مورد نظر را در کادر بالا انتخاب کنید.
            </div>
          ) : comparisonOffers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 text-xs">
              <AlertCircle className="mx-auto mb-3 text-amber-400 animate-bounce" size={32} />
              هیچ پیشنهادی بابت کالاها/پیش‌فاکتورهای پروژه انتخاب شده در سیستم ثبت نشده است.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-sky-50/75 p-3 rounded-xl border border-sky-100 text-sky-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-sky-500" />
                در جدول زیر لیست کل پیشنهادات قیمتی تامین‌کنندگان بابت اقلام پروژه را مشاهده می‌کنید. می‌توانید با بررسی قیمت، زمان تحویل و سوابق، آفر برنده را مشخص کنید.
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                      <th className="p-4">تامین‌کننده</th>
                      <th className="p-4">تجهیز/ردیف کالا</th>
                      <th className="p-4">قیمت ارزی</th>
                      <th className="p-4">قیمت ریالی</th>
                      <th className="p-4">زمان تحویل</th>
                      <th className="p-4">وضعیت پیشنهاد</th>
                      <th className="p-4 text-center">عملیات انتخاب برنده</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonOffers.map(offer => (
                      <tr 
                        key={offer.id} 
                        className={`border-b last:border-0 border-slate-100 transition hover:bg-slate-50/70 ${
                          offer.isWinner ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-bold text-slate-700">{offer.supplierName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">شناسه: {offer.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-600">{offer.proformaItemName || 'کل پروژه / عمومی'}</div>
                          {offer.proformaNumber && (
                            <div className="text-[10px] text-slate-400">پیش‌فاکتور {offer.proformaNumber}</div>
                          )}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-700 text-sm">
                          {offer.priceForeign ? `${offer.priceForeign.toLocaleString()} ${offer.currency}` : '---'}
                        </td>
                        <td className="p-4 font-mono text-slate-600">
                          {offer.priceRIYAL ? `${offer.priceRIYAL.toLocaleString()} ریال` : '---'}
                        </td>
                        <td className="p-4 font-medium text-slate-700">
                          {offer.deliveryTime || 'نامشخص'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            offer.isWinner ? 'bg-emerald-100 text-emerald-800' :
                            offer.status === 'پاسخ داده شده' ? 'bg-sky-100 text-sky-800' :
                            offer.status === 'بازنده' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {offer.isWinner ? 'برنده (منتخب)' : offer.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {offer.isWinner ? (
                            <div className="flex justify-center items-center gap-2">
                              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                                <Award size={14} /> برنده شد
                              </span>
                              <button
                                onClick={() => selectSupplierInquiryWinner(offer.id, false)}
                                className="text-rose-500 hover:text-rose-600 text-[10px] font-bold underline"
                              >
                                لغو
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => selectSupplierInquiryWinner(offer.id, true)}
                              disabled={offer.status === 'پیش‌نویس' || offer.status === 'ارسال شده'}
                              className="bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              انتخاب به عنوان برنده
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGISTER NEW INQUIRY */}
      {activeTab === 'new' && (
        <form onSubmit={handleSubmitInquiry} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus size={20} className="text-sky-500" />
            ثبت اطلاعات پرونده استعلام جدید
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">انتخاب پروژه (کارفرما) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">-- انتخاب پروژه --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>



            {/* Supplier Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">تامین‌کننده / سازنده کالا <span className="text-rose-500">*</span></label>
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="">-- انتخاب تامین‌کننده --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.country || 'داخلی'})</option>
                ))}
              </select>
            </div>

            {/* Inquiry Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">تاریخ استعلام اولیه</label>
              <input
                type="text"
                placeholder="مثال: ۱۴۰۵/۰۴/۱۸"
                value={inquiryDate}
                onChange={e => setInquiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none text-left"
                dir="ltr"
              />
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">وضعیت آغازین پرونده</label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-bold">
                پیش‌نویس (به همراه ثبت ردیف اقدام)
              </div>
            </div>
          </div>

          
          {/* Items Table */}
          <div className="mt-8">
             <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-slate-700">اقلام استعلام و پیشنهاد سازنده</label>
                <button
                   type="button"
                   onClick={() => {
                     setInquiryItems([...inquiryItems, {
                       id: `new-${Date.now()}`,
                       requestItemId: '',
                       productName: '',
                       quantity: 1,
                       priceForeign: 0,
                       priceRIYAL: 0,
                       currency: 'یورو',
                       deliveryTime: '',
                       notes: ''
                     }]);
                   }}
                   className="text-xs flex items-center gap-1 text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                   <Plus size={14} />
                   افزودن ردیف دستی
                </button>
             </div>
             
             <div className="overflow-x-auto border border-slate-200 rounded-xl">
               <table className="w-full text-xs text-right">
                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                   <tr>
                     <th className="p-3 font-semibold">شرح کالا</th>
                     <th className="p-3 font-semibold w-24">تعداد</th>
                     <th className="p-3 font-semibold w-32">قیمت ارزی</th>
                     <th className="p-3 font-semibold w-24">ارز</th>
                     <th className="p-3 font-semibold w-36">قیمت ریالی</th>
                     <th className="p-3 font-semibold w-32">زمان تحویل</th>
                     <th className="p-3 font-semibold">ملاحظات</th>
                     <th className="p-3 font-semibold w-12 text-center">حذف</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {inquiryItems.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/50">
                       <td className="p-2">
                         <input type="text" value={item.productName} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].productName = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="شرح کالا..." />
                       </td>
                       <td className="p-2">
                         <input type="number" min="1" value={item.quantity} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].quantity = Number(e.target.value);
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" />
                       </td>
                       <td className="p-2">
                         <input type="number" value={item.priceForeign || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           const pf = Number(e.target.value);
                           newItems[idx].priceForeign = pf;
                           // Auto calc rial
                           if (newItems[idx].currency === 'ریال') {
                              newItems[idx].priceRIYAL = pf;
                           } else {
                              const mapping: any = { 'دلار': 'USD', 'یورو': 'EUR', 'درهم': 'AED', 'یوان': 'CNY' };
                              const rateObj = exchangeRates.find(r => r.currency === mapping[newItems[idx].currency]);
                              if (rateObj) newItems[idx].priceRIYAL = Math.round(pf * rateObj.rateToRIYAL);
                           }
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                       </td>
                       <td className="p-2">
                         <select value={item.currency || 'یورو'} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           const curr = e.target.value as any;
                           newItems[idx].currency = curr;
                           // Re-calc
                           if (curr === 'ریال') {
                              newItems[idx].priceRIYAL = newItems[idx].priceForeign;
                           } else {
                              const mapping: any = { 'دلار': 'USD', 'یورو': 'EUR', 'درهم': 'AED', 'یوان': 'CNY' };
                              const rateObj = exchangeRates.find(r => r.currency === mapping[curr]);
                              if (rateObj) newItems[idx].priceRIYAL = Math.round((newItems[idx].priceForeign || 0) * rateObj.rateToRIYAL);
                           }
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400">
                           <option value="یورو">یورو</option>
                           <option value="دلار">دلار</option>
                           <option value="درهم">درهم</option>
                           <option value="یوان">یوان</option>
                           <option value="ریال">ریال</option>
                         </select>
                       </td>
                       <td className="p-2">
                         <input type="number" value={item.priceRIYAL || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].priceRIYAL = Number(e.target.value);
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400 font-mono text-left" placeholder="0" />
                       </td>
                       <td className="p-2">
                         <input type="text" value={item.deliveryTime || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].deliveryTime = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="مثال: ۴ هفته" />
                       </td>
                       <td className="p-2">
                         <input type="text" value={item.notes || ''} onChange={(e) => {
                           const newItems = [...inquiryItems];
                           newItems[idx].notes = e.target.value;
                           setInquiryItems(newItems);
                         }} className="w-full border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-sky-400" placeholder="..." />
                       </td>
                       <td className="p-2 text-center">
                         <button type="button" onClick={() => {
                           const newItems = [...inquiryItems];
                           newItems.splice(idx, 1);
                           setInquiryItems(newItems);
                         }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors">
                           <Trash2 size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {inquiryItems.length === 0 && (
                     <tr>
                       <td colSpan={8} className="p-6 text-center text-slate-400">ردیفی اضافه نشده است.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
          
          {/* Notes */}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">توضیحات و یادداشت‌ها</label>
            <textarea
              rows={3}
              placeholder="یادداشت‌های اضافی مرتبط با استعلام..."
              value={initialNotes}
              onChange={e => setInitialNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-sky-600 transition"
            >
              ثبت نهایی و ایجاد پرونده استعلام
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="bg-slate-100 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-200 transition"
            >
              انصراف و بازگشت
            </button>
          </div>
        </form>
      )}

      {/* MODAL 1: ADD ACTION STEP LOG */}
      {activeInquiryForStep && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form 
            onSubmit={handleAddStep}
            className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-md shadow-xl text-right space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">ثبت اقدام جدید در پیگیری استعلام</h3>
              <button 
                type="button"
                onClick={() => setActiveInquiryForStep(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400">تامین‌کننده:</div>
              <div className="text-xs font-bold text-slate-700">{activeInquiryForStep.supplierName}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع اقدام <span className="text-rose-500">*</span></label>
                <select
                  value={stepActionType}
                  onChange={e => setStepActionType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                  required
                >
                  {(settings?.dropdownItems?.supplierInquiryActionTypes || [
                    'تماس تلفنی پیگیری قیمت', 
                    'مکاتبه از طریق ایمیل', 
                    'ارسال مجدد مشخصات فنی', 
                    'مذاکره حضوری / آنلاین', 
                    'دریافت پروپوزال فنی/مالی', 
                    'سایر'
                  ]).map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">شرح اقدام و جزییات</label>
                <textarea
                  rows={3}
                  placeholder="جزییات، صحبت‌های رد و بدل شده یا یادداشت این پیگیری..."
                  value={stepDesc}
                  onChange={e => setStepDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-sky-600 transition"
              >
                ثبت اقدام و درج در کارتابل پروژه
              </button>
              <button
                type="button"
                onClick={() => setActiveInquiryForStep(null)}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition"
              >
                بستن
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: LOG SUPPLIER OFFER RESPONSE */}
      {activeInquiryForAnswer && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form 
            onSubmit={handleAddAnswer}
            className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-lg shadow-xl text-right space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">ثبت پاسخ و مدارک پیشنهادی تامین‌کننده</h3>
              <button 
                type="button"
                onClick={() => setActiveInquiryForAnswer(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <div><strong>تامین‌کننده:</strong> {activeInquiryForAnswer.supplierName}</div>
              <div><strong>پروژه:</strong> {activeInquiryForAnswer.projectName}</div>
              {activeInquiryForAnswer.proformaItemName && (
                <div><strong>کالا/ردیف:</strong> {activeInquiryForAnswer.proformaItemName}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ارز آفر</label>
                <select
                  value={answerCurrency}
                  onChange={e => setAnswerCurrency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
                >
                  <option value="یورو">یورو</option>
                  <option value="دلار">دلار</option>
                  <option value="درهم">درهم</option>
                  <option value="ریال">ریال</option>
                  <option value="یوان">یوان</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">قیمت ارزی</label>
                <input
                  type="number"
                  placeholder="قیمت"
                  required
                  value={answerPriceForeign || ''}
                  onChange={e => setAnswerPriceForeign(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">قیمت ریالی (معادل ریالی)</label>
                <input
                  type="number"
                  placeholder="مبلغ به ریال"
                  value={answerPriceRIYAL || ''}
                  onChange={e => setAnswerPriceRIYAL(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">زمان تحویل (Delivery Time)</label>
                <input
                  type="text"
                  placeholder="مثال: ۴ هفته پس از سفارش"
                  value={answerDeliveryTime}
                  onChange={e => setAnswerDeliveryTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* Technical File Dropzone for Answer */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">بارگذاری پروپوزال فنی (آفر فنی)</label>
                
                {!answerTechFile ? (
                  <div 
                    className="border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-slate-50 hover:bg-emerald-50/10 group relative"
                    onClick={() => document.getElementById('answer-tech-file-input')?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-emerald-500', 'bg-emerald-50/20');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50/20');
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleAnswerFileUpload(e.dataTransfer.files[0], 'tech');
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      id="answer-tech-file-input" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAnswerFileUpload(e.target.files[0], 'tech');
                        }
                        if (e.target) e.target.value = '';
                      }}
                    />
                    <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={20} />
                    <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب پیشنهاد فنی</span>
                    <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                  </div>
                ) : isUploadingAnswerTech ? (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="font-medium animate-pulse">در حال آپلود پیشنهاد فنی...</span>
                      <span className="font-mono font-bold text-emerald-600">{uploadProgressAnswerTech}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-100"
                        style={{ width: `${uploadProgressAnswerTech}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-700 truncate" title={answerTechFile}>{answerTechFile}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{answerTechFileSize || '2.1 MB'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnswerTechFile('');
                        setAnswerTechFileSize('');
                      }}
                      className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                      title="حذف فایل"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Financial File Dropzone for Answer */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">بارگذاری پیشنهاد مالی (آفر مالی)</label>
                
                {!answerFinFile ? (
                  <div 
                    className="border border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-slate-50 hover:bg-emerald-50/10 group relative"
                    onClick={() => document.getElementById('answer-fin-file-input')?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-emerald-400', 'bg-emerald-50/20');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-emerald-400', 'bg-emerald-50/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-emerald-400', 'bg-emerald-50/20');
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleAnswerFileUpload(e.dataTransfer.files[0], 'fin');
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      id="answer-fin-file-input" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAnswerFileUpload(e.target.files[0], 'fin');
                        }
                        if (e.target) e.target.value = '';
                      }}
                    />
                    <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={20} />
                    <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب آفر مالی</span>
                    <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                  </div>
                ) : isUploadingAnswerFin ? (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="font-medium animate-pulse">در حال آپلود پیشنهاد مالی...</span>
                      <span className="font-mono font-bold text-emerald-600">{uploadProgressAnswerFin}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-100"
                        style={{ width: `${uploadProgressAnswerFin}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-700 truncate" title={answerFinFile}>{answerFinFile}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{answerFinFileSize || '1.1 MB'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnswerFinFile('');
                        setAnswerFinFileSize('');
                      }}
                      className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                      title="حذف فایل"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                ثبت آفر و بروزرسانی استعلام به «پاسخ داده شده»
              </button>
              <button
                type="button"
                onClick={() => setActiveInquiryForAnswer(null)}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition"
              >
                بستن
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CONFIRM & CREATE PURCHASE ORDER (PO) */}
      {activeInquiryForPO && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form 
            onSubmit={handleCreatePO}
            className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-lg shadow-xl text-right space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <ShoppingCart className="text-purple-600" size={20} />
                صدور و صدور سفارش خرید خارجی (Purchase Order)
              </h3>
              <button 
                type="button"
                onClick={() => setActiveInquiryForPO(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {poCreatedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <h4 className="font-bold text-slate-700">سفارش خرید با موفقیت ایجاد شد!</h4>
                <p className="text-xs text-slate-400">سند سفارش به ماژول «سفارشات خرید خارجی» ارسال شد.</p>
              </div>
            ) : (
              <>
                <div className="text-xs text-purple-800 bg-purple-50 p-3.5 rounded-lg border border-purple-100 space-y-1">
                  <div>این فرم پیش‌نویس سفارش خرید خارجی (PO) را بر اساس آفر منتخب و برنده این تامین‌کننده صادر می‌کند.</div>
                  <div className="font-bold mt-1.5">مبلغ کل فاکتور ارزی: {activeInquiryForPO.priceForeign?.toLocaleString()} {activeInquiryForPO.currency}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">تامین‌کننده:</span>
                    <div className="font-bold text-slate-700 mt-0.5">{activeInquiryForPO.supplierName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">پروژه مرتبط:</span>
                    <div className="font-bold text-slate-700 mt-0.5">{activeInquiryForPO.projectName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">تاریخ سفارش (Order Date)</label>
                    <input
                      type="text"
                      placeholder="۱۴۰۵/۰۴/۱۸"
                      required
                      value={poOrderDate}
                      onChange={e => setPoOrderDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">تاریخ تحویل مورد انتظار</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۴۰۵/۰۶/۱۵"
                      required
                      value={poDeliveryDate}
                      onChange={e => setPoDeliveryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">نرخ ارز تسویه (ریال به ارز)</label>
                    <input
                      type="number"
                      placeholder="مثال: 650000"
                      required
                      value={poExchangeRate}
                      onChange={e => setPoExchangeRate(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">برآورد هزینه حمل (ریال)</label>
                    <input
                      type="number"
                      value={poShippingCost}
                      onChange={e => setPoShippingCost(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">برآورد هزینه گمرک و ترخیص (ریال)</label>
                    <input
                      type="number"
                      value={poCustomsDuty}
                      onChange={e => setPoCustomsDuty(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">کارمزد حواله صرافی (ریال)</label>
                    <input
                      type="number"
                      value={poRemittanceFee}
                      onChange={e => setPoRemittanceFee(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">یادداشت‌های سفارش خرید</label>
                  <textarea
                    rows={2}
                    value={poNotes}
                    onChange={e => setPoNotes(e.target.value)}
                    placeholder="توضیحات اختیاری سفارش خرید..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    تایید و ایجاد سفارش خرید خارجی
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInquiryForPO(null)}
                    className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition"
                  >
                    انصراف
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}

      {/* MODAL 4: CONFIRM STATUS CHANGE TO SENT */}
      {activeInquiryForSent && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form 
            onSubmit={handleConfirmSent}
            className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-md shadow-xl text-right space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">تغییر وضعیت استعلام به «ارسال شده»</h3>
              <button 
                type="button"
                onClick={() => setActiveInquiryForSent(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-amber-800 bg-amber-50 p-3.5 rounded-lg border border-amber-100 space-y-1">
              <div>در حال تغییر وضعیت استعلام برای تامین‌کننده <strong>{activeInquiryForSent.supplierName}</strong> به ارسال شده هستید.</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">درخواست از چه طریقی ارسال شده است؟ <span className="text-rose-500">*</span></label>
                <select
                  value={sentMethod}
                  onChange={e => setSentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="ایمیل">ایمیل (Email)</option>
                  <option value="فکس">فکس (Fax)</option>
                  <option value="واتس‌اپ / تلگرام">واتس‌اپ / تلگرام (WhatsApp/Telegram)</option>
                  <option value="پورتال تامین‌کننده">پورتال تامین‌کننده (Supplier Portal)</option>
                  <option value="مکاتبه رسمی / فیزیکی">مکاتبه رسمی / فیزیکی</option>
                  <option value="تلفنی / شفاهی">تلفنی / شفاهی</option>
                  <option value="سایر">سایر موارد</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">برای چه کسی در شرکت تامین‌کننده ارسال شده؟ <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="نام شخص مخاطب در شرکت تامین‌کننده"
                  required
                  value={sentTo}
                  onChange={e => setSentTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                تایید و تغییر وضعیت
              </button>
              <button
                type="button"
                onClick={() => setActiveInquiryForSent(null)}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: EDIT SUPPLIER INQUIRY */}
      {editingInquiry && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-4xl shadow-2xl text-right flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
            <form 
              onSubmit={handleEditInquirySubmit}
              className="flex flex-col max-h-[90vh] overflow-hidden"
            >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 px-5 py-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Edit size={18} className="text-sky-500" />
                ویرایش پرونده استعلام از تامین‌کننده
              </h3>
              <button 
                type="button"
                onClick={() => setEditingInquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Project Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">انتخاب پروژه (کارفرما) <span className="text-slate-400 font-normal">(اختیاری)</span></label>
                  <select
                    value={editProjectId}
                    onChange={e => setEditProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="">-- انتخاب پروژه --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Supplier Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">تامین‌کننده / سازنده کالا <span className="text-rose-500">*</span></label>
                  <select
                    value={editSupplierId}
                    onChange={e => setEditSupplierId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="">-- انتخاب تامین‌کننده --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.country || 'داخلی'})</option>
                    ))}
                  </select>
                </div>

                {/* Inquiry Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">تاریخ استعلام اولیه</label>
                  <input
                    type="text"
                    placeholder="مثال: ۱۴۰۵/۰۴/۱۸"
                    value={editInquiryDate}
                    onChange={e => setEditInquiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none text-left"
                    dir="ltr"
                  />
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">وضعیت پرونده</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="پیش‌نویس">پیش‌نویس</option>
                    <option value="ارسال شده">ارسال شده</option>
                    <option value="در انتظار پاسخ">در انتظار پاسخ</option>
                    <option value="پاسخ داده شده">پاسخ داده شده</option>
                    <option value="برنده">برنده (آفر منتخب)</option>
                    <option value="بازنده">بازنده</option>
                    <option value="لغو شده">لغو شده</option>
                  </select>
                </div>
              </div>

              {/* Price & Delivery */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-700">اطلاعات مالی و آفر قیمت</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">ارز آفر</label>
                    <select
                      value={editCurrency}
                      onChange={e => setEditCurrency(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="یورو">یورو</option>
                      <option value="دلار">دلار</option>
                      <option value="درهم">درهم</option>
                      <option value="ریال">ریال</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">قیمت ارزی</label>
                    <input
                      type="number"
                      placeholder="مثال: 4500"
                      value={editPriceForeign || ''}
                      onChange={e => setEditPriceForeign(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left focus:ring-1 focus:ring-sky-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">قیمت ریالی (معادل ریالی)</label>
                    <input
                      type="number"
                      placeholder="مبلغ به ریال"
                      value={editPriceRIYAL || ''}
                      onChange={e => setEditPriceRIYAL(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-left focus:ring-1 focus:ring-sky-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">زمان تحویل (Delivery Time)</label>
                    <input
                      type="text"
                      placeholder="مثال: ۶ الی ۸ هفته"
                      value={editDeliveryTime}
                      onChange={e => setEditDeliveryTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Edit files with custom inputs & drag and drop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Tech file edit dropzone */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">بارگذاری پروپوزال فنی</label>
                    
                    {!editTechFileName ? (
                      <div 
                        className="border border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-white hover:bg-sky-50/20 group relative"
                        onClick={() => document.getElementById('edit-tech-file-input')?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-sky-400', 'bg-sky-50/40');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleEditFileUpload(e.dataTransfer.files[0], 'tech');
                          }
                        }}
                      >
                        <input 
                          type="file" 
                          id="edit-tech-file-input" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleEditFileUpload(e.target.files[0], 'tech');
                            }
                            if (e.target) e.target.value = '';
                          }}
                        />
                        <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-sky-500 transition-colors" size={20} />
                        <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب پروپوزال فنی</span>
                        <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                      </div>
                    ) : isUploadingEditTech ? (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-600">
                          <span className="font-medium animate-pulse">در حال آپلود پروپوزال فنی...</span>
                          <span className="font-mono font-bold text-sky-600">{uploadProgressEditTech}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-sky-500 h-1.5 rounded-full transition-all duration-100"
                            style={{ width: `${uploadProgressEditTech}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                            <FileText size={16} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-700 truncate" title={editTechFileName}>{editTechFileName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{editTechFileSize || '1.4 MB'}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditTechFileName('');
                            setEditTechFileSize('');
                          }}
                          className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                          title="حذف فایل"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fin file edit dropzone */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">بارگذاری آفر مالی</label>
                    
                    {!editFinFileName ? (
                      <div 
                        className="border border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 transition-all duration-200 cursor-pointer text-center bg-white hover:bg-sky-50/20 group relative"
                        onClick={() => document.getElementById('edit-fin-file-input')?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-sky-400', 'bg-sky-50/40');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50/40');
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleEditFileUpload(e.dataTransfer.files[0], 'fin');
                          }
                        }}
                      >
                        <input 
                          type="file" 
                          id="edit-fin-file-input" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleEditFileUpload(e.target.files[0], 'fin');
                            }
                            if (e.target) e.target.value = '';
                          }}
                        />
                        <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-sky-500 transition-colors" size={20} />
                        <span className="block text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">انتخاب آفر مالی</span>
                        <span className="block text-[10px] text-slate-400 mt-1">یا فایل را به اینجا بکشید</span>
                      </div>
                    ) : isUploadingEditFin ? (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-600">
                          <span className="font-medium animate-pulse">در حال آپلود آفر مالی...</span>
                          <span className="font-mono font-bold text-sky-600">{uploadProgressEditFin}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-sky-500 h-1.5 rounded-full transition-all duration-100"
                            style={{ width: `${uploadProgressEditFin}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                            <FileText size={16} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-700 truncate" title={editFinFileName}>{editFinFileName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{editFinFileSize || '980 KB'}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditFinFileName('');
                            setEditFinFileSize('');
                          }}
                          className="text-rose-500 hover:text-rose-600 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                          title="حذف فایل"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">توضیحات و یادداشت‌ها</label>
                <textarea
                  rows={3}
                  placeholder="توضیحات مرتبط با استعلام..."
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="submit"
                className="bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-sky-600 transition"
              >
                ذخیره تغییرات
              </button>
              <button
                type="button"
                onClick={() => setEditingInquiry(null)}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-200 transition"
              >
                انصراف
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE SUPPLIER INQUIRY WITH LOGS option */}
      {deleteInquiryId && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-md shadow-xl text-right space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">حذف پرونده استعلام قیمت</h3>
                <p className="text-[10px] text-slate-400">این عمل غیر قابل بازگشت است.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>آیا از حذف این پرونده استعلام تامین‌کننده اطمینان دارید؟</p>
              
              {/* Option to delete automatic logs of this module */}
              <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100/40 space-y-3 mt-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deleteActivitiesWithInquiry}
                    onChange={(e) => setDeleteActivitiesWithInquiry(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 block">حذف لاگ‌های فعالیت پروژه؟</span>
                    <span className="text-[10px] text-slate-500 leading-relaxed block">
                      با انتخاب این گزینه، تمام لاگ‌های فعالیت ثبت شده خودکار این استعلام به همراه دسته‌بندی آن در لیست فعالیت‌های این پروژه حذف خواهند شد.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  deleteSupplierInquiry(deleteInquiryId, deleteActivitiesWithInquiry);
                  setDeleteInquiryId(null);
                }}
                className="bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-rose-700 transition"
              >
                تایید و حذف نهایی
              </button>
              <button
                type="button"
                onClick={() => setDeleteInquiryId(null)}
                className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-200 transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
