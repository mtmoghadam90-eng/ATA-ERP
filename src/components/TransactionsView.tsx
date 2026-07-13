import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  Edit, 
  Trash2, 
  FileSpreadsheet, 
  X,
  CreditCard,
  Building,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { Transaction, Customer, Supplier, Project, ERPSettings, Proforma, ExchangeRate } from '../types';
import { getTodayShamsi } from '../dateUtils';
import { formatERPNumber } from '../numUtils';
import ShamsiDatePicker from './ShamsiDatePicker';
import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsDetailView from './CustomFieldsDetailView';
import ConfirmModal from './ConfirmModal';
import QuickAddModal from './QuickAddModal';
import { SearchableSelect } from './SearchableSelect';

interface TransactionsViewProps {
  transactions: Transaction[];
  customers: Customer[];
  suppliers: Supplier[];
  projects: Project[];
  proformas: Proforma[];
  exchangeRates: ExchangeRate[];
  addTransaction: (tr: Omit<Transaction, 'id'> & { customValues?: Record<string, any> }) => void;
  updateTransaction: (tr: Transaction) => void;
  deleteTransaction: (id: string) => void;
  settings: ERPSettings;
  addCustomer?: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addSupplier?: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  addProject?: (project: Omit<Project, 'id' | 'code' | 'creationDate'>) => Project;
}

export default function TransactionsView({
  transactions,
  customers,
  suppliers,
  projects,
  proformas,
  exchangeRates,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  settings,
  addCustomer,
  addSupplier,
  addProject
}: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [quickAddType, setQuickAddType] = useState<'customer' | 'project' | 'supplier' | 'product' | null>(null);

  // Dynamic Custom Fields State
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<string | null>(null);
  const [transactionToDeleteDoc, setTransactionToDeleteDoc] = useState<string>('');

  // Form states
  const [type, setType] = useState<Transaction['type']>('دریافت');
  const [documentNumber, setDocumentNumber] = useState('');
  const [partyType, setPartyType] = useState<'customer' | 'supplier' | 'other'>('customer');
  const [customerId, setCustomerId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [partyNameManual, setPartyNameManual] = useState('');
  const [projectId, setProjectId] = useState('');
  const [amountRIYAL, setAmountRIYAL] = useState<number>(0);
  const [receiptType, setReceiptType] = useState<string>('');

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

  // Quick Supplier Creation States
  const [showQuickSupplierModal, setShowQuickSupplierModal] = useState(false);
  const [quickSupName, setQuickSupName] = useState('');
  const [quickSupCountry, setQuickSupCountry] = useState('چین');
  const [quickSupContactPerson, setQuickSupContactPerson] = useState('');
  const [quickSupPhone, setQuickSupPhone] = useState('');
  const [quickSupEmail, setQuickSupEmail] = useState('');

  // Quick Project Creation States
  const [showQuickProjectModal, setShowQuickProjectModal] = useState(false);
  const [quickProjName, setQuickProjName] = useState('');
  const [quickProjCustomerId, setQuickProjCustomerId] = useState('');
  const [quickProjStage, setQuickProjStage] = useState('استعلام اولیه');
  const [quickProjSalesExpert, setQuickProjSalesExpert] = useState('');
  const [date, setDate] = useState(getTodayShamsi());
  const [paymentType, setPaymentType] = useState<Transaction['paymentType']>('حواله بانکی');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Calculations
  const totalReceived = transactions
    .filter(t => t.type === 'دریافت')
    .reduce((sum, t) => sum + t.amountRIYAL, 0);

  const totalPaid = transactions
    .filter(t => t.type === 'پرداخت')
    .reduce((sum, t) => sum + t.amountRIYAL, 0);

  const netBalance = totalReceived - totalPaid;

  const [activeViewTab, setActiveViewTab] = useState<'transactions' | 'projectsSummary'>('transactions');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');

  // Helper mapping and calculations for projects
  const mapPersianCurrencyToEnglishSummary = (cur: string): 'USD' | 'EUR' | 'AED' | 'CNY' | undefined => {
    if (cur === 'دلار') return 'USD';
    if (cur === 'یورو') return 'EUR';
    if (cur === 'درهم') return 'AED';
    if (cur === 'یوان') return 'CNY';
    return undefined;
  };

  const getProformaAmountInRial = (pf: Proforma) => {
    const cur = pf.currency || 'ریال';
    if (cur === 'ریال') {
      return pf.finalAmount || 0;
    }
    const engCurrency = mapPersianCurrencyToEnglishSummary(cur);
    const rateObj = engCurrency ? exchangeRates.find(r => r.currency === engCurrency) : undefined;
    const rate = rateObj ? rateObj.rateToRIYAL : 1;
    return (pf.finalAmount || 0) * rate;
  };

  const computedProjectSummaries = projects.map(proj => {
    // Find proformas for this project with status 'تأیید شده (برنده)' or 'نیمه برنده'
    const projProformas = proformas.filter(pf => 
      pf.projectId === proj.id && 
      (pf.status === 'تأیید شده (برنده)' || pf.status === 'نیمه برنده')
    );

    const salesAmount = projProformas.reduce((sum, pf) => sum + getProformaAmountInRial(pf), 0);

    // Find total receipts for this project
    const paidAmount = transactions
      .filter(t => t.projectId === proj.id && t.type === 'دریافت')
      .reduce((sum, t) => sum + (t.amountRIYAL || 0), 0);

    const remainingAmount = salesAmount - paidAmount;
    
    // Settlement percentage
    const settlementPercent = salesAmount > 0 ? Math.min(100, Math.round((paidAmount / salesAmount) * 100)) : 0;

    return {
      ...proj,
      salesAmount,
      paidAmount,
      remainingAmount,
      settlementPercent
    };
  });

  // Filter projects for the summary list
  const filteredProjectSummaries = computedProjectSummaries.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.customerName.toLowerCase().includes(projectSearch.toLowerCase());
      
    const matchesStatus = projectStatusFilter === 'all' || p.status === projectStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Total summary for all projects combined
  const totalProjSales = computedProjectSummaries.reduce((sum, p) => sum + p.salesAmount, 0);
  const totalProjReceived = computedProjectSummaries.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalProjRemaining = computedProjectSummaries.reduce((sum, p) => sum + p.remainingAmount, 0);

  const generateAutoDocNo = (
    currentType: Transaction['type'],
    currentPartyType: 'customer' | 'supplier' | 'other' = partyType,
    currCustomerId = customerId,
    currSupplierId = supplierId,
    currManualName = partyNameManual,
    currProjId = projectId
  ) => {
    const seqNum = transactions.length + 1;
    let name = '';
    if (currentPartyType === 'customer') {
      name = customers.find(c => c.id === currCustomerId)?.companyName || '';
    } else if (currentPartyType === 'supplier') {
      name = suppliers.find(s => s.id === currSupplierId)?.name || '';
    } else {
      name = currManualName;
    }
    const projCode = projects.find(p => p.id === currProjId)?.code || '';

    return formatERPNumber(
      settings?.documentFormats?.transactionFormat || 'TR-{TYPE}-{YYYY}{MM}-{SEQ:3}',
      {
        seq: seqNum,
        transactionType: currentType,
        customerName: currentPartyType === 'customer' ? name : undefined,
        supplierName: currentPartyType === 'supplier' ? name : undefined,
        projectCode: projCode
      }
    );
  };

  const handleOpenAdd = () => {
    const initialCustId = customers[0]?.id || '';
    const initialSuppId = suppliers[0]?.id || '';
    
    setEditingTransaction(null);
    setPartyType('customer');
    setCustomerId(initialCustId);
    setSupplierId(initialSuppId);
    setPartyNameManual('');
    setProjectId('');
    setAmountRIYAL(0);
    setDate(getTodayShamsi());
    setPaymentType('حواله بانکی');
    setReferenceNumber('');
    setNotes('');
    setCustomValues({});
    
    const initialReceiptTypes = settings?.dropdownItems?.receiptTypes || ['پیش پرداخت', 'میاندوره', 'تسویه'];
    setReceiptType(initialReceiptTypes[0] || '');
    
    const initialDocNo = generateAutoDocNo('دریافت', 'customer', initialCustId, initialSuppId, '', '');
    setDocumentNumber(initialDocNo);
    setShowModal(true);
  };

  const handleOpenEdit = (tr: Transaction) => {
    setEditingTransaction(tr);
    setType(tr.type);
    setReceiptType(tr.receiptType || '');
    setDocumentNumber(tr.documentNumber);
    
    if (tr.customerId) {
      setPartyType('customer');
      setCustomerId(tr.customerId);
    } else if (tr.supplierId) {
      setPartyType('supplier');
      setSupplierId(tr.supplierId);
    } else {
      setPartyType('other');
      setPartyNameManual(tr.customerName || tr.supplierName || '');
    }
    
    setProjectId(tr.projectId || '');
    setAmountRIYAL(tr.amountRIYAL);
    setDate(tr.date);
    setPaymentType(tr.paymentType);
    setReferenceNumber(tr.referenceNumber || '');
    setNotes(tr.notes || '');
    setCustomValues(tr.customValues || {});
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Fields Validation
    const moduleFields = (settings?.customFields || []).filter(f => f.module === 'transactions');
    for (const field of moduleFields) {
      if (field.required) {
        const val = customValues[field.id];
        if (val === undefined || val === null || val === '') {
          alert(`لطفاً فیلد سفارشی اجباری "${field.name}" را تکمیل کنید.`);
          return;
        }
      }
    }
    
    let resolvedPartyName = '';
    let resolvedCustomerId: string | undefined = undefined;
    let resolvedSupplierId: string | undefined = undefined;

    if (partyType === 'customer') {
      resolvedCustomerId = customerId;
      resolvedPartyName = customers.find(c => c.id === customerId)?.companyName || 'مشتری ناشناس';
    } else if (partyType === 'supplier') {
      resolvedSupplierId = supplierId;
      resolvedPartyName = suppliers.find(s => s.id === supplierId)?.name || 'تأمین‌کننده ناشناس';
    } else {
      resolvedPartyName = partyNameManual || 'متفرقه';
    }

    const linkedProjName = projects.find(p => p.id === projectId)?.name;

    const transactionPayload = {
      type,
      receiptType,
      documentNumber,
      customerId: resolvedCustomerId,
      customerName: resolvedCustomerId ? resolvedPartyName : (partyType === 'other' ? resolvedPartyName : undefined),
      supplierId: resolvedSupplierId,
      supplierName: resolvedSupplierId ? resolvedPartyName : undefined,
      projectId: projectId || undefined,
      projectName: projectId ? linkedProjName : undefined,
      amountRIYAL,
      date,
      paymentType,
      referenceNumber,
      notes,
      customValues
    };

    if (editingTransaction) {
      updateTransaction({
        id: editingTransaction.id,
        ...transactionPayload
      });
    } else {
      addTransaction(transactionPayload);
    }

    setShowModal(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const pName = t.customerName || t.supplierName || 'متفرقه';
    const matchesSearch = 
      t.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
      pName.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = selectedType === 'all' || t.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">دفتر صندوق و دریافتی/پرداختی</h1>
          <p className="text-slate-500 text-sm mt-1">رهگیری وجوه نقد ریالی دریافتی از مشتریان بابت پیش‌فاکتورها و حوالجات صادر شده به صرافی‌ها</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center gap-2"
        >
          <Plus size={16} />
          ثبت سند دریافت/پرداخت جدید
        </button>
      </div>

      {/* Financial Box Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">مجموع دریافتی‌های نقدی ریالی</p>
            <h4 className="text-lg font-extrabold text-emerald-600 font-mono">+{totalReceived.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span></h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <ArrowDownLeft size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">مجموع پرداخت‌های ریالی صندوق</p>
            <h4 className="text-lg font-extrabold text-red-600 font-mono">-{totalPaid.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span></h4>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">تراز خالص صندوق (گردش مالی)</p>
            <h4 className={`text-lg font-extrabold font-mono ${netBalance >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
              {netBalance.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span>
            </h4>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Coins size={24} />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-slate-100 bg-white p-1 rounded-xl shadow-sm gap-1 self-start">
        <button
          onClick={() => setActiveViewTab('transactions')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeViewTab === 'transactions'
              ? 'bg-sky-50 text-sky-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          دفتر ریز تراکنش‌های صندوق (دریافت/پرداخت)
        </button>
        <button
          onClick={() => setActiveViewTab('projectsSummary')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeViewTab === 'projectsSummary'
              ? 'bg-sky-50 text-sky-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          وضعیت تسویه مالی پروژه‌ها
        </button>
      </div>

      {activeViewTab === 'transactions' ? (
        <>
          {/* Filter Ledger */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="جستجو در شماره سند حسابداری، نام مخاطب یا شماره مرجع تراکنش..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
              />
            </div>

            <div className="relative w-full md:w-64 flex items-center gap-2">
              <Filter size={16} className="text-slate-400 flex-shrink-0" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white"
              >
                <option value="all">همه اسناد حسابداری</option>
                <option value="دریافت">دریافت‌ها (ورود وجه)</option>
                <option value="پرداخت">پرداخت‌ها (خروج وجه)</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                    <th className="p-4 w-12 text-center">نوع</th>
                    <th className="p-4">شماره سند</th>
                    <th className="p-4">نام طرف حساب</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4">شیوه پرداخت و کد مرجع</th>
                    <th className="p-4 text-left">مبلغ سند ریال</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {filteredTransactions.map((t) => {
                    const isReceipt = t.type === 'دریافت';
                    const partyName = t.customerName || t.supplierName || 'متفرقه';

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition">
                        
                        {/* Type icon */}
                        <td className="p-4 text-center">
                          <span className={`p-1.5 rounded-lg flex items-center justify-center w-8 h-8 ${
                            isReceipt ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {isReceipt ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </span>
                        </td>

                        {/* Doc No */}
                        <td className="p-4 font-mono font-bold text-slate-900">{t.documentNumber}</td>

                        {/* Party */}
                        <td className="p-4 font-semibold text-slate-800">
                          <div>{partyName}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {t.projectName && <span className="text-[10px] text-slate-400 font-normal">پروژه: {t.projectName}</span>}
                            {t.receiptType && (
                              <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 text-[10px] rounded font-bold border border-sky-100">
                                {t.receiptType}
                              </span>
                            )}
                          </div>
                          <div className="mt-1">
                            <CustomFieldsDetailView
                              module="transactions"
                              customFields={settings?.customFields || []}
                              customValues={t.customValues}
                            />
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-4 font-mono">{t.date}</td>

                        {/* Payment Specs */}
                        <td className="p-4">
                          <div className="font-semibold text-slate-700">{t.paymentType}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">کد رهگیری: {t.referenceNumber || 'ندارد'}</div>
                        </td>

                        {/* Amount */}
                        <td className="p-4 text-left font-mono font-bold text-sm">
                          <span className={isReceipt ? 'text-emerald-600' : 'text-red-600'}>
                            {isReceipt ? '+' : '-'}{t.amountRIYAL.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal mr-1">ریال</span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                              title="ویرایش سند"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                      setTransactionToDeleteId(t.id);
                                      setTransactionToDeleteDoc(t.documentNumber || '');
                                      setDeleteConfirmOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="حذف سند"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-12 text-slate-400 bg-white">
                        <FileSpreadsheet className="mx-auto text-slate-300 mb-3" size={40} />
                        هیچ تراکنشی یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Project Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-fade-in">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold">مجموع مبلغ فروش پروژه‌ها</p>
                <h4 className="text-lg font-extrabold text-slate-800 font-mono">
                  {totalProjSales.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">ریال</span>
                </h4>
                <p className="text-[10px] text-slate-400">بر اساس پیش‌فاکتورهای تایید شده</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                <FileSpreadsheet size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-fade-in">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold">مجموع مبالغ دریافتی از پروژه‌ها</p>
                <h4 className="text-lg font-extrabold text-emerald-600 font-mono">
                  +{totalProjReceived.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span>
                </h4>
                <p className="text-[10px] text-slate-400">کل وجوه دریافتی ثبت شده بابت پروژه‌ها</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                <ArrowDownLeft size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-fade-in">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold">مجموع مطالبات معوق (مانده طلب)</p>
                <h4 className="text-lg font-extrabold text-amber-600 font-mono">
                  {totalProjRemaining.toLocaleString('fa-IR')} <span className="text-xs font-normal">ریال</span>
                </h4>
                <p className="text-[10px] text-slate-400">مانده کل قابل وصول از پروژه‌ها</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                <Coins size={24} />
              </div>
            </div>
          </div>

          {/* Project Summary Controls */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="جستجو در کد پروژه، عنوان پروژه یا نام مشتری..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
              />
            </div>

            <div className="relative w-full md:w-64 flex items-center gap-2">
              <Filter size={16} className="text-slate-400 flex-shrink-0" />
              <select
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white"
              >
                <option value="all">همه وضعیت‌های پروژه‌ها</option>
                <option value="برنده (موفق)">برنده (موفق)</option>
                <option value="نیمه برنده">نیمه برنده</option>
                <option value="در حال مذاکره">در حال مذاکره</option>
                <option value="ارائه پیش‌فاکتور">ارائه پیش‌فاکتور</option>
                <option value="جدید">جدید</option>
              </select>
            </div>
          </div>

          {/* Project Summary Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                    <th className="p-4">کد و عنوان پروژه</th>
                    <th className="p-4">مشتری / کارفرما</th>
                    <th className="p-4 text-center">وضعیت پروژه</th>
                    <th className="p-4 text-left">مبلغ فروش (ریال)</th>
                    <th className="p-4 text-left">مبلغ دریافتی (ریال)</th>
                    <th className="p-4 text-left">مبلغ باقیمانده (ریال)</th>
                    <th className="p-4 text-center">درصد تسویه مالی</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {filteredProjectSummaries.map((p) => {
                    let statusColor = 'bg-slate-100 text-slate-600';
                    if (p.status === 'برنده (موفق)') statusColor = 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
                    else if (p.status === 'نیمه برنده') statusColor = 'bg-teal-50 text-teal-600 border border-teal-200/50';
                    else if (p.status === 'در حال مذاکره') statusColor = 'bg-amber-50 text-amber-600 border border-amber-200/50';
                    else if (p.status === 'ارائه پیش‌فاکتور') statusColor = 'bg-blue-50 text-blue-600 border border-blue-200/50';
                    else if (p.status === 'باخته') statusColor = 'bg-red-50 text-red-600 border border-red-200/50';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.code}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-700">{p.customerName}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-left font-mono font-semibold text-slate-800">
                          {p.salesAmount.toLocaleString('fa-IR')}
                        </td>
                        <td className="p-4 text-left font-mono font-semibold text-emerald-600">
                          {p.paidAmount > 0 ? `+${p.paidAmount.toLocaleString('fa-IR')}` : '۰'}
                        </td>
                        <td className="p-4 text-left font-mono font-bold text-amber-600">
                          {p.remainingAmount.toLocaleString('fa-IR')}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col items-center gap-1 min-w-[100px]">
                            <span className="font-mono font-bold text-slate-600">{p.settlementPercent}%</span>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  p.settlementPercent === 100 
                                    ? 'bg-emerald-500' 
                                    : p.settlementPercent > 50 
                                    ? 'bg-sky-500' 
                                    : p.settlementPercent > 0 
                                    ? 'bg-amber-500' 
                                    : 'bg-slate-200'
                                }`}
                                style={{ width: `${p.settlementPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSearch(p.name);
                              setSelectedType('all');
                              setActiveViewTab('transactions');
                            }}
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg text-[10px] font-bold transition flex items-center gap-1 mx-auto"
                            title="مشاهده تمام تراکنش‌های ثبت شده برای این پروژه"
                          >
                            <RefreshCw size={12} />
                            مشاهده تراکنش‌ها
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProjectSummaries.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center p-12 text-slate-400 bg-white">
                        <FileSpreadsheet className="mx-auto text-slate-300 mb-3" size={40} />
                        هیچ پروژه‌ای یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-in flex flex-col my-4 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {editingTransaction ? 'ویرایش سند دریافت / پرداخت صندوق' : 'ثبت سند دریافت / پرداخت صندوق'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition" title="بستن فرم">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-right overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">نوع تراکنش مالی</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { 
                        setType('دریافت'); 
                        setPartyType('customer'); 
                        const code = generateAutoDocNo('دریافت', 'customer');
                        setDocumentNumber(code);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                        type === 'دریافت' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <ArrowDownLeft size={16} />
                      <span>دریافت وجه (ورود نقدینگی)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { 
                        setType('پرداخت'); 
                        setPartyType('supplier'); 
                        const code = generateAutoDocNo('پرداخت', 'supplier');
                        setDocumentNumber(code);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                        type === 'پرداخت' 
                          ? 'border-red-500 bg-red-50 text-red-800' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <ArrowUpRight size={16} />
                      <span>پرداخت وجه (خروج نقدینگی)</span>
                    </button>
                  </div>
                </div>

                {/* Doc No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 flex justify-between items-center">
                    <span>شماره سند مالی *</span>
                    <button
                      type="button"
                      onClick={() => setDocumentNumber(generateAutoDocNo(type))}
                      className="text-[10px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-0.5 transition"
                    >
                      <RefreshCw size={10} />
                      فرموله ساز
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5" id="transaction-date-picker-wrapper">
                  <ShamsiDatePicker
                    label="تاریخ تراکنش"
                    required
                    value={date}
                    onChange={(val) => setDate(val)}
                  />
                </div>

                {/* Party selection type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">ماهیت طرف حساب</label>
                  <div className="flex gap-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="partyType"
                        checked={partyType === 'customer'}
                        onChange={() => setPartyType('customer')}
                        className="text-sky-500 focus:ring-sky-500"
                      />
                      <span>مشتریان داخلی</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="partyType"
                        checked={partyType === 'supplier'}
                        onChange={() => setPartyType('supplier')}
                        className="text-sky-500 focus:ring-sky-500"
                      />
                      <span>تأمین‌کنندگان خارجی / داخلی</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="partyType"
                        checked={partyType === 'other'}
                        onChange={() => setPartyType('other')}
                        className="text-sky-500 focus:ring-sky-500"
                      />
                      <span>متفرقه (گمرک، گمرکچی، غیره)</span>
                    </label>
                  </div>
                </div>

                {/* Target customer select */}
                {partyType === 'customer' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">انتخاب مشتری *</label>
                    <div className="flex gap-1.5 items-center">
                    <SearchableSelect
                      value={customerId}
                      onChange={(val) => setCustomerId(val)}
                      required
                      options={[
                        { value: '', label: '-- انتخاب مشتری --' },
                        ...customers.map(c => ({ value: c.id, label: c.companyName }))
                      ]}
                      placeholder="-- انتخاب مشتری --"
                    />
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

                {/* Target supplier select */}
                {partyType === 'supplier' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">انتخاب تأمین‌کننده *</label>
                    <div className="flex gap-1.5 items-center">
                      <SearchableSelect
                        value={supplierId}
                        onChange={(val) => setSupplierId(val)}
                        required
                        options={[
                          { value: '', label: '-- انتخاب تأمین‌کننده --' },
                          ...suppliers.map(s => ({ value: s.id, label: `${s.name} (${s.country})` }))
                        ]}
                        placeholder="-- انتخاب تأمین‌کننده --"
                      />
                      {addSupplier && (
                        <button
                          type="button"
                          onClick={() => setQuickAddType('supplier')}
                          className="px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center font-bold"
                          title="تعریف سریع تأمین‌کننده جدید"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Party name manually */}
                {partyType === 'other' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">نام طرف حساب متفرقه *</label>
                    <input
                      type="text"
                      required
                      value={partyNameManual}
                      onChange={(e) => setPartyNameManual(e.target.value)}
                      placeholder="مثال: ترخیص کار بندرعباس - محسنی"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right"
                    />
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">مبلغ نقد ریالی *</label>
                  <input
                    type="number"
                    required
                    value={amountRIYAL}
                    onChange={(e) => setAmountRIYAL(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                  />
                </div>

                {/* Receipt Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">بابت / نوع دریافت و پرداخت *</label>
                  <select
                    value={receiptType}
                    onChange={(e) => setReceiptType(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right bg-white"
                  >
                    <option value="">-- انتخاب بابت تراکنش --</option>
                    {(settings?.dropdownItems?.receiptTypes || ['پیش پرداخت', 'میاندوره', 'تسویه']).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Linked Project */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">مرتبط با پروژه (اختیاری)</label>
                  <div className="flex gap-1.5 items-center">
                    <SearchableSelect
                      value={projectId}
                      onChange={(val) => {
                        const projId = val;
                        setProjectId(projId);
                        if (projId) {
                          const proj = projects.find(p => p.id === projId);
                          if (proj && proj.customerId) {
                            setPartyType('customer');
                            setCustomerId(proj.customerId);
                          }
                        }
                      }}
                      options={[
                        { value: '', label: '-- فاقد پروژه (صندوق عمومی) --' },
                        ...projects.map(p => ({ value: p.id, label: `${p.name} (${p.code})` }))
                      ]}
                      placeholder="-- فاقد پروژه (صندوق عمومی) --"
                    />
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

                {/* Payment Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">شیوه پرداخت</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as Transaction['paymentType'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right bg-white"
                  >
                    <option value="حواله بانکی">حواله بانکی (پایا/ساتنا)</option>
                    <option value="چک">چک صیادی رسمی</option>
                    <option value="کارت به کارت">کارت به کارت شتابی</option>
                    <option value="نقدی">نقدی صندوق</option>
                  </select>
                </div>

                {/* Reference Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">کد پیگیری مرجع / فیش بانکی</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="مثال: 876125419"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-left"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">توضیحات تکمیلی سند</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="بابت قسط اول پیش‌پرداخت، علی‌الحساب گمرک..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right"
                  />
                </div>

                {/* Dynamic Custom Fields Form Section */}
                <div className="sm:col-span-2">
                  <CustomFieldsForm
                    module="transactions"
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
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition"
                >
                  {editingTransaction ? 'ثبت تغییرات سند' : 'ثبت قطعی در دفاتر حسابداری'}
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
          setTransactionToDeleteId(null);
          setTransactionToDeleteDoc('');
        }}
        onConfirm={() => {
          if (transactionToDeleteId) {
            deleteTransaction(transactionToDeleteId);
          }
        }}
        title="حذف سند مالی"
        message={`آیا از حذف سند حسابداری "${transactionToDeleteDoc}" اطمینان دارید؟ این عمل قابل بازیابی نیست.`}
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
                    notes: 'تعریف شده به صورت سریع از بخش تراکنش‌ها',
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

      {/* Quick Supplier Add Modal */}
      {showQuickSupplierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-150">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Plus size={18} className="text-sky-500" />
                تعریف سریع تأمین‌کننده جدید
              </h3>
              <button 
                type="button" 
                onClick={() => setShowQuickSupplierModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">نام شرکت / برند تامین‌کننده *</label>
                <input
                  type="text"
                  value={quickSupName}
                  onChange={(e) => setQuickSupName(e.target.value)}
                  placeholder="مثال: Siemens AG"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">کشور مبدا *</label>
                  <input
                    type="text"
                    value={quickSupCountry}
                    onChange={(e) => setQuickSupCountry(e.target.value)}
                    placeholder="مثال: آلمان"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">شخص رابط / تماس</label>
                  <input
                    type="text"
                    value={quickSupContactPerson}
                    onChange={(e) => setQuickSupContactPerson(e.target.value)}
                    placeholder="مثال: Mr. Mueller"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">شماره تلفن</label>
                  <input
                    type="text"
                    value={quickSupPhone}
                    onChange={(e) => setQuickSupPhone(e.target.value)}
                    placeholder="+49-89-XXXX"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-left font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">آدرس ایمیل</label>
                  <input
                    type="text"
                    value={quickSupEmail}
                    onChange={(e) => setQuickSupEmail(e.target.value)}
                    placeholder="mueller@siemens.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-left font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickSupplierModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-100 transition font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!quickSupName.trim()) {
                    alert('لطفاً نام تامین‌کننده را وارد کنید.');
                    return;
                  }
                  if (!quickSupCountry.trim()) {
                    alert('لطفاً کشور را وارد کنید.');
                    return;
                  }

                  const supData: any = {
                    name: quickSupName,
                    country: quickSupCountry,
                    category: 'تجهیزات ابزار دقیق',
                    contactPerson: quickSupContactPerson,
                    phone: quickSupPhone,
                    email: quickSupEmail,
                    website: '',
                    status: 'فعال',
                    score: 100,
                    notes: 'ثبت سریع از بخش تراکنش‌ها'
                  };

                  if (addSupplier) {
                    const created = addSupplier(supData);
                    if (created && created.id) {
                      setSupplierId(created.id);
                      setShowQuickSupplierModal(false);
                    }
                  }
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition"
              >
                ثبت و انتخاب سازنده
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
                    notes: 'تعریف سریع از تراکنش',
                    expectedCloseDate: '',
                    itemsNeeded: [],
                    customValues: {}
                  };

                  if (addProject) {
                    const created = addProject(projData);
                    if (created && created.id) {
                      setProjectId(created.id);
                      setPartyType('customer');
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

      {quickAddType && (
        <QuickAddModal
          isOpen={!!quickAddType}
          onClose={() => setQuickAddType(null)}
          type={quickAddType}
          settings={settings}
          customers={customers}
          addCustomer={addCustomer}
          addSupplier={addSupplier}
          addProject={addProject}
          onSuccess={(newEntity) => {
            if (newEntity && newEntity.id) {
              if (quickAddType === 'customer') {
                setCustomerId(newEntity.id);
              } else if (quickAddType === 'supplier') {
                setSupplierId(newEntity.id);
              } else if (quickAddType === 'project') {
                setProjectId(newEntity.id);
              }
            }
          }}
        />
      )}

    </div>
  );
}
