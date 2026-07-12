/**
 * Types & Interfaces for Abzar Tamin Arshia ERP
 */

export interface InventoryTransaction {
  id: string;
  productId: string;
  date: string;
  type: 'IN' | 'OUT';
  quantity: number;
  referenceId?: string; // proformaId, etc.
  referenceType?: 'PROFORMA' | 'MANUAL' | 'PURCHASE_ORDER' | 'PROJECT';
  notes?: string;
}

export interface Customer {
  id: string;
  customerType: 'حقیقی' | 'حقوقی';
  status: 'فعال' | 'غیرفعال';
  createdAt: string;
  phone: string;
  mobile: string;
  email: string;
  province: string;
  city?: string; // Optional for backward compatibility
  address: string;
  notes?: string;
  tags?: string;

  // Legal customer fields (مشتری حقوقی)
  companyName: string; // Used for legal company name or computed individual full name for backward compatibility
  economicCode?: string;
  industry?: string;
  keyPerson?: string;

  // Individual customer fields (مشتری حقیقی)
  firstName?: string;
  lastName?: string;
  gender?: 'مرد' | 'زن' | '';
  position?: string;

  // Relationships (اتصال حقیقی و حقوقی)
  linkedCustomerIds?: string[];

  // Custom Field values
  customValues?: Record<string, any>;

  // Backward compatibility fields
  contactName?: string;
  contactLastName?: string;
}

export interface Product {
  id: string;
  name: string;
  displayName: string;
  code: string;
  category: string;
  brand: string;
  modelNumber: string;
  unit: string;
  basePriceRIYAL: number;
  description: string;
  stockLevel: number; // Current inventory
  minStockLevel: number; // Threshold for reordering
  supplyType?: 'INVENTORY' | 'ORDER';
  size?: string; // سایز
  measurementRange?: string; // رنج اندازه گیری
  images?: string[]; // فایل های تصویر
  customValues?: Record<string, any>;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contactName: string;
  phone?: string;
  email?: string;
  website?: string;
  paymentTerms?: string;
  status: 'فعال' | 'غیرفعال';
  createdAt: string;
  customValues?: Record<string, any>;
  providedCategories?: string[];
  description?: string;
}

export interface ProformaItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  brand: string;
  quantity: number;
  unitPriceRIYAL: number;
  totalPriceRIYAL: number;
  supplyMethod?: 'INVENTORY' | 'ORDER';
  status?: 'جاری' | 'برنده' | 'بازنده';
  lossReason?: string;
  techSpecs?: string;
  selectedImage?: string;
}

export interface Proforma {
  id: string;
  proformaNumber: string; // Auto-generated based on template
  customerId: string;
  customerName: string;
  contactCustomerId?: string; // مخاطب انتخاب شده (مشتری حقیقی مرتبط)
  contactName?: string; // نام مخاطب جهت ثبت نهایی
  contactPrefix?: string; // پیشوند مخاطب یا مشتری حقیقی
  projectId?: string;
  projectName?: string;
  issueDate: string;
  expiryDate: string;
  deliveryDate?: string; // تاریخ تحویل پیش‌فاکتور تایید شده
  status: 'پیش‌نویس' | 'ارسال شده' | 'تأیید شده (برنده)' | 'لغو شده' | 'باخته' | 'نیمه برنده';
  isCancelled?: boolean;
  lossReason?: string; // e.g. "قیمت بالا", "زمان تحویل طولانی"
  currency?: 'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان';
  items: ProformaItem[];
  totalAmount: number; // Sum of items
  discountPercent: number;
  discountAmount: number;
  taxPercent: number; // e.g., 10% VAT
  taxAmount: number;
  finalAmount: number; // (Total - Discount) + Tax
  notes: string;
  creatorId?: string;
  customValues?: Record<string, any>;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  brand: string;
  quantity: number;
  unitPriceForeignCurrency: number;
  totalPriceForeignCurrency: number;
  proformaItemId?: string; // شناسه ردیف پیش‌فاکتور مرتبط
  proformaItemName?: string; // نام/عنوان ردیف پیش‌فاکتور مرتبط
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-{PROJECT}-{SEQ:3}
  supplierId: string;
  supplierName: string;
  projectId?: string;
  projectName?: string;
  proformaId?: string; // پیش‌فاکتور مرتبط
  proformaNumber?: string; // شماره پیش‌فاکتور مرتبط
  orderDate: string;
  expectedDeliveryDate: string;
  currency: 'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان';
  exchangeRate: number; // Rate to IRR at order time
  items: PurchaseOrderItem[];
  totalForeignAmount: number; // Sum of foreign currency items
  shippingCostRIYAL: number; // Cost of freight (هزینه حمل)
  customsDutyRIYAL: number; // Cost of customs clearances (هزینه ترخیص)
  remittanceFeeRIYAL: number; // Cost of money transfer/remittance (هزینه حواله پول)
  shippingCostForeign?: number; // هزینه حمل به ارز
  remittanceFeeForeign?: number; // هزینه حواله صرافی به ارز
  calculatedLandedCostRIYAL: number; // (TotalForeign * ExchangeRate) + remittance + shipping + customs
  calculatedLandedCostForeign?: number; // بهای تمام شده به ارز فاکتور
  paymentDate?: string; // تاریخ پرداخت به تامین‌کننده و جاری شدن سفارش
  goodsReadyDate?: string; // تاریخ آماده شدن کالا
  shipmentDate?: string; // تاریخ حمل کالا
  clearanceDate?: string; // تاریخ ترخیص کالا
  receivedDate?: string; // تاریخ دریافت کالا در انبار
  status: 'پیش‌نویس' | 'پرداخت و سفارش به سازنده' | 'در حال آماده‌سازی سازنده' | 'حمل و ترانزیت' | 'ترخیص گمرک' | 'در حال حمل به انبار' | 'تحویل شده (رسید انبار)';
  createdAt: string;
  notes?: string;
  customValues?: Record<string, any>;
}

export interface Project {
  id: string;
  code: string; // ATA-YYYY-SEQ
  name: string;
  customerId: string;
  customerName: string;
  campaignId?: string;
  campaignName?: string;
  creationDate: string; // This is used as opportunityDate/creationDate (تاریخ ایجاد فرصت)
  expectedCloseDate?: string; // Expected closing date (optional)
  estimatedValueRIYAL?: number; // Optional/legacy
  probabilityPercent?: number; // Optional/legacy
  status: 'جدید' | 'در حال مذاکره' | 'ارائه پیش‌فاکتور' | 'برنده (موفق)' | 'باخته' | 'لغو شده' | 'نیمه برنده';
  itemsNeeded?: { productId: string; name: string; quantity: number, supplyMethod?: 'INVENTORY' | 'ORDER' }[];
  description: string;
  customValues?: Record<string, any>;
  lossReason?: string;

  // New Requested Fields:
  salesExpert?: string;            // کارشناس فروش
  marketingChannel?: string;        // کانال بازاریابی
  leadQuality?: string;             // کیفیت لید
  referrerName?: string;            // نام معرف
  financialContact?: string;        // فرد کلیدی مالی
  technicalContact?: string;        // فرد کلیدی فنی
  communicationMethod?: string;     // روش ارتباط
  opportunityDate?: string;         // تاریخ ایجاد فرصت (same as creationDate or distinct)
  customerInquiryNumber?: string;   // شماره استعلام مشتری
  winningDate?: string;             // تاریخ برنده شدن
  agreedDeliveryDate?: string;      // تاریخ توافق‌شده تحویل
  endUser?: string;                 // مصرف‌کننده نهایی
  closingDate?: string;             // تاریخ بسته شدن
  attachments?: { name: string; url: string; }[]; // فایل‌های درخواست
}

export interface Transaction {
  id: string;
  type: 'دریافت' | 'پرداخت';
  receiptType?: string; // بابت پیش‌پرداخت، میاندوره، تسویه و غیره
  documentNumber: string; // receipt or payment voucher ID
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  projectId?: string;
  projectName?: string;
  purchaseOrderId?: string;
  amountRIYAL: number;
  date: string;
  paymentType: 'حواله بانکی' | 'چک' | 'نقدی' | 'کارت به کارت';
  referenceNumber: string; // reference/check number
  notes: string;
  customValues?: Record<string, any>;
}

export interface ModuleNotification {
  id: string;
  module: string;
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  responsibleName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedToType: 'مشتری' | 'پروژه' | 'پیش‌فاکتور' | 'سفارش خرید' | 'عمومی';
  relatedToId?: string;
  relatedToName?: string;
  priority: 'پایین' | 'متوسط' | 'بالا' | 'فوری';
  dueDate: string;
  assignedTo: string;
  status: 'در حال انجام' | 'انجام شده' | 'کنسل شده';
  customValues?: Record<string, any>;
  reminderEnabled?: boolean;
  reminderDate?: string;
  reminderTime?: string;
}

export interface ExchangeRate {
  id: string;
  currency: 'USD' | 'EUR' | 'AED' | 'CNY';
  name: string;
  rateToRIYAL: number;
  lastUpdated: string;
}

export interface CustomField {
  id: string;
  module: 'customers' | 'projects' | 'products' | 'proformas' | 'suppliers' | 'purchaseOrders' | 'transactions' | 'tasks' | 'supplierInquiries' | 'packagingDelivery' | 'afterSalesServices';
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'file' | 'boolean';
  options?: string[];
  required?: boolean;
  useSeparator?: boolean;
}

export interface DocumentFormat {
  projectPrefix: string;
  projectFormat: string; // ATA-{YYYY}-{SEQ:3}
  proformaPrefix: string;
  proformaFormat: string; // QT-{PROJECT}-{SEQ:2}
  poPrefix: string;
  poFormat: string; // PO-{PROJECT}-{SEQ:3}
  transactionFormat?: string; // TR-{TYPE}-{YYYY}{MM}-{SEQ:3}
  productFormat?: string; // EQ-{RAND:5}
}

export interface ProformaTemplate {
  name: string;
  companyName: string;
  registrationNumber: string;
  nationalCode: string;
  economicCode: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoUrl?: string;
  companySealUrl?: string;
  titleColor: string;
  documentTitle: string;
  headerText: string;
  termsAndConditions: string;
  footerText: string;
  signatureLabel1: string;
  signatureLabel2: string;
  showLogo: boolean;
  showTerms: boolean;
  showSignatures: boolean;
  showTotals: boolean;
}

export interface ERPSettings {
  customFields: CustomField[];
  proformaTemplates: ProformaTemplate[];
  activeTemplateId: string;
  documentFormats: DocumentFormat;
  dropdownItems: {
    industries: string[];
    customerTypes: string[];
    customerStatuses: string[];
    categories: string[];
    units: string[];
    currencies: string[];
    paymentTerms: string[];
    paymentTypes: string[];
    projectStatuses: string[];
    salesExperts: string[];
    marketingChannels: string[];
    leadQualities: string[];
    communicationMethods: string[];
    taskPriorities: string[];
    taskStatuses: string[];
    proformaStatuses: string[];
    purchaseOrderStatuses: string[];
    positions?: string[];
    receiptTypes?: string[];
    supplierInquiryActionTypes?: string[];
    shippingMethods?: string[];
    packageTypes?: string[];
    returnReasons?: string[];
  };
  lossReasons: string[];
  activityCategories: { id: string; name: string; module: string; responsibleUserId?: string }[];
  sidebarModuleOrder?: string[];
  moduleResponsibles?: Record<string, string>;
  adminNotificationPreferences?: Record<string, {
    receiveAll: boolean;
    importantProjectIds: string[];
  }>;
  deliveryChecklistTemplate?: string[];
  workflows?: WorkflowRule[];
}

export interface ProjectReferralResponse {
  id?: string;
  text: string;
  responder: string;
  createdAt: string;
  attachment?: { name: string; size: string; content?: string } | null;
}

export interface ProjectReferral {
  id: string;
  assignedTo: string;
  actionRequired: string;
  assignedBy: string;
  createdAt: string;
  status: 'در انتظار اقدام' | 'انجام شده';
  response: ProjectReferralResponse | null;
  messages?: ProjectReferralResponse[];
}

export interface ProjectActivity {
  id: string;
  text: string;
  createdAt: string;
  createdBy?: string;
  attachment: { name: string; size: string; content?: string } | null;
  referral: ProjectReferral | null;
}

export interface ProjectCategoryGroup {
  id: string;
  projectId: string;
  categoryId: string;
  categoryName: string;
  status: 'جاری' | 'اتمام کار';
  startDate: string;
  endDate: string | null;
  activities: ProjectActivity[];
}

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: 'admin' | 'user';
  isSystemAdmin?: boolean;
  position?: string;
  signatureImage?: string;
  permissions: {
    dashboard: boolean;
    customers: boolean;
    projects: boolean;
    proformas: boolean;
    products: boolean;
    suppliers: boolean;
    purchaseOrders: boolean;
    transactions: boolean;
    tasks: boolean;
    referrals: boolean;
    settings: boolean;
    users: boolean;
    supplierInquiries?: boolean;
    packagingDelivery?: boolean;
  };
}

export interface InquiryStep {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'creation' | 'sent' | 'response' | 'winner' | 'update' | 'other';
  sentMethod?: string;
  sentTo?: string;
}

export interface SupplierInquiryItem {
  id: string;
  requestItemId: string; // The ID of the item needed from the project
  productName: string;
  quantity: number;
}

export interface SupplierInquiry {
  id: string;
  projectId: string;
  projectName: string;
  items?: SupplierInquiryItem[]; // New field for multiple items
  proformaId?: string;
  proformaNumber?: string;
  proformaItemId?: string; // ID of the ProformaItem
  proformaItemName?: string; // name of the proforma item (product name or combined specs)
  supplierId: string;
  supplierName: string;
  inquiryDate: string;
  status: 'پیش‌نویس' | 'ارسال شده' | 'در انتظار پاسخ' | 'پاسخ داده شده' | 'لغو شده' | 'برنده' | 'بازنده';
  priceRIYAL?: number;
  priceForeign?: number;
  currency?: 'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان';
  deliveryTime?: string;
  technicalProposalFile?: string;
  financialProposalFile?: string;
  technicalProposalFileSize?: string;
  financialProposalFileSize?: string;
  notes?: string;
  steps: InquiryStep[];
  createdAt: string;
  winnerSelectedDate?: string;
  isWinner?: boolean;
}

export interface PackingItem {
  id: string;
  itemOrDocName: string;
  productId?: string;
  quantity: number;
  packageType: string; // e.g. کارتن، جعبه چوبی، پالت، کیسه
  dimensions: string; // e.g. 50x40x30 سانتی‌متر
  weight: number; // وزن به کیلوگرم
  boxNumber?: string;
}

export interface DeliveryChecklistItem {
  name: string;
  completed: boolean;
  completedAt?: string;
}

export interface PackagingDelivery {
  id: string;
  projectId: string;
  projectName: string;
  proformaId?: string; // پیش‌فاکتور تایید شده مرتبط
  proformaNumber?: string;
  packingListNumber: string; // شماره پکینگ لیست
  deliveryDate: string; // تاریخ تحویل
  shippingMethod: string; // نحوه ارسال کالا
  preDeliveryTestNotes: string; // گزارش تست قبل از تحویل تجهیز
  checklist: DeliveryChecklistItem[]; // چک‌لیست تحویل تیک‌خورده
  items: PackingItem[]; // اقلام پکینگ لیست
  photos: string[]; // تصاویر آپلود شده بسته‌بندی و ارسال (base64)
  createdAt: string;
}



export interface AfterSalesServiceItem {
  id: string;
  productId?: string;
  productName: string;
  issueDescription: string;
  actionsTaken?: string;
  startDate: string;
  endDate?: string;
  returnDate?: string;
  status: 'در حال بررسی' | 'در حال تعمیر/خدمات' | 'تکمیل شده' | 'تحویل داده شده';
}

export interface AfterSalesService {
  id: string;
  projectId: string;
  projectName: string;
  proformaNumber?: string;
  proformaItemName?: string;
  itemName: string;
  issueDescription: string;
  actionsTaken: string;
  startDate: string;
  endDate?: string;
  returnDate?: string;
  status: 'در حال بررسی' | 'در حال تعمیر/خدمات' | 'تکمیل شده' | 'تحویل داده شده';
  createdAt: string;
  createdBy: string;
  items?: AfterSalesServiceItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userFullName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  module: string;
  entityId: string;
  description: string;
  beforeState?: string; // LZW compressed
  afterState?: string;  // LZW compressed
}

export interface WorkflowRule {
  id: string;
  name: string;
  active: boolean;
  triggerType: 'proforma_outcome_change' | 'project_status_change' | 'purchase_order_status_change';
  conditions: {
    field: string; // e.g. 'newOutcome', 'newStatus'
    operator: 'equals' | 'not_equals';
    value: string;
  }[];
  actions: {
    id: string;
    type: 'create_task' | 'send_notification';
    taskConfig?: {
      titleTemplate: string;
      descTemplate: string;
      assignedTo: string; // "MODULE_RESPONSIBLE_<moduleName>", "SALES_EXPERT", or a specific user full name
      priority: 'پایین' | 'متوسط' | 'بالا' | 'فوری';
      dueDaysOffset: number;
    };
    notificationConfig?: {
      titleTemplate: string;
      descTemplate: string;
      module: string;
    };
  }[];
}

