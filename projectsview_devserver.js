import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=d7e0c7b3"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=d7e0c7b3"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"];
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  Edit,
  Trash2,
  XCircle,
  AlertCircle,
  TrendingUp,
  X,
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
  History,
  Check,
  Folder,
  FolderOpen,
  File,
  Download,
  Eye,
  Upload,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  Maximize2,
  Minimize2
} from "/node_modules/.vite/deps/lucide-react.js?v=d7e0c7b3";
import { getTodayShamsi, addDaysToShamsi, addWorkingDaysToShamsi } from "/src/dateUtils.ts";
import { getProformaOutcomeStatus } from "/src/useERPStore.ts";
import ShamsiDatePicker from "/src/components/ShamsiDatePicker.tsx";
import CustomFieldsForm from "/src/components/CustomFieldsForm.tsx";
import { uploadFile } from "/src/imageUtils.ts";
import CustomFieldsDetailView from "/src/components/CustomFieldsDetailView.tsx";
import { exportToCSV } from "/src/excelUtils.ts";
import ConfirmModal from "/src/components/ConfirmModal.tsx";
import QuickAddModal from "/src/components/QuickAddModal.tsx";
import { SearchableSelect } from "/src/components/SearchableSelect.tsx";
import { compressImage } from "/src/imageUtils.ts";
export default function ProjectsView({
  onOpenDocument,
  projects,
  customers,
  products,
  proformas,
  supplierInquiries = [],
  packagingDeliveries = [],
  transactions = [],
  purchaseOrders = [],
  afterSalesServices = [],
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
  deleteProjectCategoryGroup,
  updateProjectActivity,
  deleteProjectActivity,
  currentUser,
  users = [],
  initialSelectedProjectId,
  onClearInitialSelectedProject
}) {
  const [search, setSearch] = useState("");
  const [colFilters, setColFilters] = useState({});
  const [customFieldFilters, setCustomFieldFilters] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isProjectModalFullscreen, setIsProjectModalFullscreen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingActivityText, setEditingActivityText] = useState("");
  const [quickAddType, setQuickAddType] = useState(null);
  const [quickAddCustomerTarget, setQuickAddCustomerTarget] = useState(null);
  const [quickAddProductIndex, setQuickAddProductIndex] = useState(null);
  const [selectedProjectForActivities, setSelectedProjectForActivities] = useState(null);
  const [isActivitiesModalFullscreen, setIsActivitiesModalFullscreen] = useState(false);
  const [modalTab, setModalTab] = useState("activities");
  const [selectedFolderName, setSelectedFolderName] = useState(null);
  const [supplyFilter, setSupplyFilter] = useState("ALL");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  React.useEffect(() => {
    if (selectedProjectForActivities) {
      const updatedProject = projects.find((p) => p.id === selectedProjectForActivities.id);
      if (updatedProject && updatedProject !== selectedProjectForActivities) {
        setSelectedProjectForActivities(updatedProject);
      }
    }
  }, [projects, selectedProjectForActivities]);
  React.useEffect(() => {
    if (!selectedProjectForActivities) {
      setModalTab("activities");
      setSelectedFolderName(null);
      setActivePreviewDoc(null);
    }
  }, [selectedProjectForActivities]);
  React.useEffect(() => {
    if (initialSelectedProjectId) {
      const proj = projects.find((p) => p.id === initialSelectedProjectId);
      if (proj) {
        setSelectedProjectForActivities(proj);
      }
      if (onClearInitialSelectedProject) {
        onClearInitialSelectedProject();
      }
    }
  }, [initialSelectedProjectId, projects, onClearInitialSelectedProject]);
  const [newActivityText, setNewActivityText] = useState({});
  const [newActivityAttachment, setNewActivityAttachment] = useState({});
  const [referralEnabled, setReferralEnabled] = useState({});
  const [referralAssignedTo, setReferralAssignedTo] = useState({});
  const [referralAction, setReferralAction] = useState({});
  const [selectedCategoryToCreate, setSelectedCategoryToCreate] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [customValues, setCustomValues] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [projectToDeleteName, setProjectToDeleteName] = useState("");
  const [activityDeleteConfirmOpen, setActivityDeleteConfirmOpen] = useState(false);
  const [activityToDeleteGroupId, setActivityToDeleteGroupId] = useState(null);
  const [activityToDeleteId, setActivityToDeleteId] = useState(null);
  const [name, setName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("جدید");
  const [description, setDescription] = useState("");
  const [itemsNeeded, setItemsNeeded] = useState([]);
  const [lossReason, setLossReason] = useState("");
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [quickCustType, setQuickCustType] = useState("حقوقی");
  const [quickCustName, setQuickCustName] = useState("");
  const [quickCustFirstName, setQuickCustFirstName] = useState("");
  const [quickCustLastName, setQuickCustLastName] = useState("");
  const [quickCustPhone, setQuickCustPhone] = useState("");
  const [quickCustEmail, setQuickCustEmail] = useState("");
  const [quickCustIndustry, setQuickCustIndustry] = useState("نفت و گاز");
  const [quickCustKeyPerson, setQuickCustKeyPerson] = useState("");
  const [quickCustPosition, setQuickCustPosition] = useState("");
  const [salesExpert, setSalesExpert] = useState("");
  const [marketingChannel, setMarketingChannel] = useState("");
  const [leadQuality, setLeadQuality] = useState("متوسط");
  const [referrerName, setReferrerName] = useState("");
  const [financialContact, setFinancialContact] = useState("");
  const [technicalContact, setTechnicalContact] = useState("");
  const [communicationMethod, setCommunicationMethod] = useState("تلفن");
  const [opportunityDate, setOpportunityDate] = useState("");
  const [customerInquiryNumber, setCustomerInquiryNumber] = useState("");
  const [winningDate, setWinningDate] = useState("");
  const [agreedDeliveryDate, setAgreedDeliveryDate] = useState("");
  const [endUser, setEndUser] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const getLatestProformaOfProject = (projectId) => {
    const projectProformas = proformas.filter((pf) => pf.projectId === projectId);
    if (projectProformas.length === 0) return void 0;
    return [...projectProformas].sort((a, b) => {
      const dateCompare = b.issueDate.localeCompare(a.issueDate);
      if (dateCompare !== 0) return dateCompare;
      return b.id.localeCompare(a.id);
    })[0];
  };
  const getPipelineValue = (projectId) => {
    const latest = getLatestProformaOfProject(projectId);
    return latest ? latest.finalAmount : 0;
  };
  const getCustomerDisplayName = (idOrName) => {
    const cust = customers.find((c) => c.id === idOrName);
    if (!cust) return idOrName;
    return cust.customerType === "حقوقی" ? cust.companyName : `${cust.firstName || ""} ${cust.lastName || ""}`.trim();
  };
  const getProjectPrepaymentDate = (projectId) => {
    const projectTx = transactions.filter((tx) => tx.projectId === projectId && tx.type === "دریافت").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return projectTx.length > 0 ? projectTx[0].date : null;
  };
  const getActualDeliveryDate = (projectId) => {
    const delivery = packagingDeliveries.find((d) => d.projectId === projectId);
    return delivery?.actualDeliveryDate;
  };
  const getApprovedProformaDeliveryDate = (projectId) => {
    const approved = proformas.find((pf) => {
      if (pf.projectId !== projectId) return false;
      const outcome = getProformaOutcomeStatus(pf);
      return outcome === "تأیید شده (برنده)" || outcome === "نیمه برنده";
    });
    return approved?.deliveryDate;
  };
  const faToEnDigits = (str) => {
    const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const arDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    let result = str;
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(faDigits[i], "g"), i.toString());
      result = result.replace(new RegExp(arDigits[i], "g"), i.toString());
    }
    return result;
  };
  const parseItemDeliveryToDays = (range, unit) => {
    if (!range) return 0;
    const normalizedRange = faToEnDigits(range.trim());
    const matches = normalizedRange.match(/\d+/g);
    if (!matches || matches.length === 0) return 0;
    const lastNum = parseInt(matches[matches.length - 1], 10);
    if (unit === "هفته") return lastNum * 7;
    if (unit === "ماه") return lastNum * 30;
    return lastNum;
  };
  const getProjectDeliveryDetails = (projectId) => {
    const projectProformas = proformas.filter((pf) => pf.projectId === projectId);
    const wonProformas = projectProformas.filter((pf) => {
      const outcome = getProformaOutcomeStatus(pf);
      return outcome === "تأیید شده (برنده)" || outcome === "نیمه برنده";
    });
    const prepaymentDate = getProjectPrepaymentDate(projectId);
    const proj = projects.find((p) => p.id === projectId);
    const baseDate = prepaymentDate || proj?.winningDate || proj?.opportunityDate || proj?.creationDate || getTodayShamsi();
    const agreedItems = [];
    wonProformas.forEach((pf) => {
      let wonItems = [];
      const hasExplicitWon = pf.items?.some((item) => item.status === "برنده");
      if (hasExplicitWon) {
        wonItems = pf.items.filter((item) => item.status === "برنده");
      } else {
        wonItems = pf.items?.filter((item) => item.status !== "بازنده") || [];
      }
      wonItems.forEach((item) => {
        if (item.deliveryRange && item.deliveryUnit) {
          const range = item.deliveryRange;
          const unit = item.deliveryUnit;
          const type = item.deliveryType || "کاری";
          const postfix = item.deliveryPostfix || "";
          const offsetDays = parseItemDeliveryToDays(range, unit);
          const isWorkingDays = type === "کاری";
          const calculatedDate = isWorkingDays ? addWorkingDaysToShamsi(baseDate, offsetDays) : addDaysToShamsi(baseDate, offsetDays);
          agreedItems.push({
            id: item.id,
            productName: item.productName,
            deliveryText: `${range} ${unit} ${type}${postfix ? ` ${postfix}` : ""}`,
            calculatedDate
          });
        } else {
          const pfDeliveryDate = pf.deliveryDate || proj?.agreedDeliveryDate || "";
          agreedItems.push({
            id: item.id,
            productName: item.productName,
            deliveryText: pfDeliveryDate || "فوری",
            calculatedDate: proj?.agreedDeliveryDate || baseDate
          });
        }
      });
    });
    const projectDeliveries = packagingDeliveries.filter((d) => d.projectId === projectId);
    const actualItems = [];
    projectDeliveries.forEach((del) => {
      const mainActualDate = del.actualDeliveryDate || "";
      del.items.forEach((item) => {
        const itemActualDate = item.actualDeliveryDate || mainActualDate || "";
        if (itemActualDate) {
          actualItems.push({
            id: item.id,
            productName: item.itemOrDocName,
            actualDate: itemActualDate,
            boxNumber: item.boxNumber
          });
        }
      });
    });
    const uniqueAgreedDates = new Set(agreedItems.map((x) => x.calculatedDate).filter(Boolean));
    const uniqueActualDates = new Set(actualItems.map((x) => x.actualDate).filter(Boolean));
    const singleAgreedDate = uniqueAgreedDates.size === 1 ? Array.from(uniqueAgreedDates)[0] : "";
    const singleActualDate = uniqueActualDates.size === 1 ? Array.from(uniqueActualDates)[0] : "";
    return {
      agreedItems,
      actualItems,
      hasMultipleAgreed: uniqueAgreedDates.size > 1,
      hasMultipleActual: uniqueActualDates.size > 1,
      singleAgreedDate,
      singleActualDate
    };
  };
  const handleAddItemLine = () => {
    setItemsNeeded([
      ...itemsNeeded,
      {
        productId: "generic",
        name: "فلو - تجهیز درخواستی",
        quantity: 1,
        supplyMethod: "ORDER",
        category: "FLOW",
        equipmentType: "",
        size: ""
      }
    ]);
  };
  const handleRemoveItemLine = (index) => {
    setItemsNeeded(itemsNeeded.filter((_, i) => i !== index));
  };
  const handleItemProductChange = (index, prodId) => {
    if (prodId === "generic") {
      setItemsNeeded(
        itemsNeeded.map(
          (item, i) => i === index ? {
            ...item,
            productId: "generic",
            name: "فلو - تجهیز درخواستی",
            supplyMethod: "ORDER",
            category: "FLOW",
            equipmentType: "",
            size: ""
          } : item
        )
      );
      return;
    }
    const selectedProd = products.find((p) => p.id === prodId);
    if (!selectedProd) return;
    setItemsNeeded(
      itemsNeeded.map(
        (item, i) => i === index ? {
          ...item,
          productId: prodId,
          name: selectedProd.displayName,
          supplyMethod: selectedProd.supplyType === "ORDER" ? "ORDER" : "INVENTORY",
          category: void 0,
          equipmentType: void 0,
          size: void 0
        } : item
      )
    );
  };
  const handleItemCategoryChange = (index, cat) => {
    setItemsNeeded(
      itemsNeeded.map((item, i) => {
        if (i !== index) return item;
        const eqType = item.equipmentType || "";
        const sizeStr = item.size ? ` (سایز: ${item.size})` : "";
        const catLabel = cat === "FLOW" ? "فلو" : cat === "TEMPERATURE" ? "دما" : cat === "PRESSURE" ? "فشار" : "سطح";
        const updatedName = `${catLabel} - ${eqType || "تجهیز درخواستی"}${sizeStr}`;
        return {
          ...item,
          category: cat,
          name: updatedName
        };
      })
    );
  };
  const handleItemEquipmentTypeChange = (index, eqType) => {
    setItemsNeeded(
      itemsNeeded.map((item, i) => {
        if (i !== index) return item;
        const cat = item.category || "FLOW";
        const sizeStr = item.size ? ` (سایز: ${item.size})` : "";
        const catLabel = cat === "FLOW" ? "فلو" : cat === "TEMPERATURE" ? "دما" : cat === "PRESSURE" ? "فشار" : "سطح";
        const updatedName = `${catLabel} - ${eqType || "تجهیز درخواستی"}${sizeStr}`;
        return {
          ...item,
          equipmentType: eqType,
          name: updatedName
        };
      })
    );
  };
  const handleItemSizeChange = (index, sz) => {
    setItemsNeeded(
      itemsNeeded.map((item, i) => {
        if (i !== index) return item;
        const cat = item.category || "FLOW";
        const eqType = item.equipmentType || "";
        const sizeStr = sz ? ` (سایز: ${sz})` : "";
        const catLabel = cat === "FLOW" ? "فلو" : cat === "TEMPERATURE" ? "دما" : cat === "PRESSURE" ? "فشار" : "سطح";
        const updatedName = `${catLabel} - ${eqType || "تجهیز درخواستی"}${sizeStr}`;
        return {
          ...item,
          size: sz,
          name: updatedName
        };
      })
    );
  };
  const handleItemQuantityChange = (index, qty) => {
    setItemsNeeded(
      itemsNeeded.map(
        (item, i) => i === index ? { ...item, quantity: qty } : item
      )
    );
  };
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    const today = getTodayShamsi();
    if (newStatus === "برنده (موفق)" || newStatus === "نیمه برنده") {
      if (!winningDate) setWinningDate(today);
      if (!agreedDeliveryDate) setAgreedDeliveryDate(today);
    } else if (newStatus === "باخته" || newStatus === "لغو شده") {
    }
  };
  const handleOpenAdd = () => {
    setEditingProject(null);
    setName("");
    setCustomerId(customers[0]?.id || "");
    setStatus("جدید");
    setDescription("");
    setCustomValues({});
    setItemsNeeded([]);
    setLossReason("");
    setSalesExpert("");
    setMarketingChannel("تماس مستقیم");
    setLeadQuality("متوسط");
    setReferrerName("");
    setFinancialContact("");
    setTechnicalContact("");
    setCommunicationMethod("تلفن");
    setOpportunityDate(getTodayShamsi());
    setCustomerInquiryNumber("");
    setWinningDate("");
    setAgreedDeliveryDate("");
    setEndUser("");
    setAttachments([]);
    setShowModal(true);
  };
  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setCustomerId(proj.customerId);
    setStatus(proj.status);
    setDescription(proj.description);
    setCustomValues(proj.customValues || {});
    setItemsNeeded(proj.itemsNeeded || []);
    setLossReason(proj.lossReason || "");
    setSalesExpert(proj.salesExpert || "");
    setMarketingChannel(proj.marketingChannel || "تماس مستقیم");
    setLeadQuality(proj.leadQuality || "متوسط");
    setReferrerName(proj.referrerName || "");
    setFinancialContact(proj.financialContact || "");
    setTechnicalContact(proj.technicalContact || "");
    setCommunicationMethod(proj.communicationMethod || "تلفن");
    setOpportunityDate(proj.opportunityDate || proj.creationDate || getTodayShamsi());
    setCustomerInquiryNumber(proj.customerInquiryNumber || "");
    setWinningDate(proj.winningDate || "");
    setAgreedDeliveryDate(proj.agreedDeliveryDate || "");
    setEndUser(proj.endUser || "");
    setAttachments(proj.attachments || []);
    setShowModal(true);
  };
  const handleSave = (e) => {
    e.preventDefault();
    if (!customerId) return;
    const moduleFields = (settings?.customFields || []).filter((f) => f.module === "projects");
    for (const field of moduleFields) {
      if (field.required) {
        const val = customValues[field.id];
        if (val === void 0 || val === null || val === "") {
          alert(`لطفاً فیلد سفارشی اجباری "${field.name}" را تکمیل کنید.`);
          return;
        }
      }
    }
    const customerName = customers.find((c) => c.id === customerId)?.companyName || "مشتری نامشخص";
    const data = {
      name,
      customerId,
      customerName,
      status,
      description,
      customValues,
      itemsNeeded,
      lossReason: status === "باخته" ? lossReason : void 0,
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
      attachments
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
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    if (!(matchesSearch && matchesStatus)) return false;
    const matchesCustom = Object.entries(customFieldFilters).every(([fieldId, filterValue]) => {
      if (!filterValue) return true;
      const recordValue = p.customValues?.[fieldId];
      if (recordValue === void 0 || recordValue === null || recordValue === "") return false;
      const field = settings?.customFields?.find((f) => f.id === fieldId);
      if (!field) return true;
      if (field.type === "boolean") {
        return String(recordValue) === filterValue;
      }
      if (field.type === "select") {
        return String(recordValue) === filterValue;
      }
      if (field.type === "file") {
        if (filterValue === "has_file") {
          return !!(recordValue && recordValue.name);
        } else if (filterValue === "no_file") {
          return !(recordValue && recordValue.name);
        }
        return true;
      }
      return String(recordValue).toLowerCase().includes(filterValue.toLowerCase());
    });
    if (!matchesCustom) return false;
    return Object.entries(colFilters).every(([colId, filterValue]) => {
      if (!filterValue) return true;
      const fVal = String(filterValue).toLowerCase();
      if (colId === "code") {
        return p.code.toLowerCase().includes(fVal);
      }
      if (colId === "name") {
        return p.name.toLowerCase().includes(fVal);
      }
      if (colId === "customerName") {
        return p.customerName.toLowerCase().includes(fVal);
      }
      if (colId === "estimatedValueRIYAL") {
        return String(getPipelineValue(p.id)).toLowerCase().includes(fVal);
      }
      if (colId === "status") {
        return p.status.toLowerCase().includes(fVal);
      }
      if (colId === "expectedCloseDate") {
        return (p.expectedCloseDate || "").toLowerCase().includes(fVal);
      }
      return true;
    });
  });
  const handleExportExcel = () => {
    const headers = [
      "کد پروژه",
      "نام پروژه",
      "کارشناس فروش",
      "مشتری پروژه",
      "مصرف‌کننده نهایی",
      "ارزش پایپ‌لاین (ریال)",
      "وضعیت",
      "علت باخت (در صورت باخت)",
      "کانال بازاریابی",
      "کیفیت لید",
      "نام معرف",
      "روش ارتباط",
      "فرد کلیدی مالی",
      "فرد کلیدی فنی",
      "شماره استعلام مشتری",
      "تاریخ ایجاد فرصت",
      "تاریخ تایید",
      "تاریخ توافق‌شده تحویل",
      "تاریخ دریافت پیش پرداخت",
      "تاریخ تحویل قطعی",
      "اقلام درخواستی مشتری",
      "توضیحات"
    ];
    const rows = filteredProjects.map((p) => [
      p.code,
      p.name,
      p.salesExpert || "",
      p.customerName,
      p.endUser || "",
      getPipelineValue(p.id),
      p.status,
      p.lossReason || "",
      p.marketingChannel || "",
      p.leadQuality || "",
      p.referrerName || "",
      p.communicationMethod || "",
      p.financialContact || "",
      p.technicalContact || "",
      p.customerInquiryNumber || "",
      p.opportunityDate || p.creationDate || "",
      p.winningDate || "",
      p.agreedDeliveryDate || "",
      getProjectPrepaymentDate(p.id) || "",
      getActualDeliveryDate(p.id) || "",
      p.itemsNeeded?.map((item) => `${item.name} (${item.quantity} عدد - ${item.supplyMethod === "ORDER" ? "سفارش" : item.supplyMethod === "NONE" ? "بدون نیاز به تامین" : "انبار"})`).join(" - ") || "",
      p.description
    ]);
    exportToCSV("گزارش_پروژه‌ها", headers, rows);
  };
  const getProjectFoldersAndFiles = (p) => {
    const folders = [
      { id: "customer_inquiry", name: "درخواست مشتری و استعلام اولیه", desc: "اسناد درخواست اولیه، استعلام‌های فنی و مکاتبات مشتری", iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: Paperclip },
      { id: "sales_proforma", name: "پیش‌فاکتورها و مهندسی فروش", desc: "پیش‌فاکتورهای صادر شده فنی و مالی و پروپوزال‌ها", iconBg: "bg-sky-50 text-sky-600 border-sky-100", icon: FileSpreadsheet },
      { id: "supplier_po", name: "سفارشات خرید تامین‌کنندگان", desc: "سفارش‌های خرید ارسالی به سازندگان و تامین‌کنندگان کالا", iconBg: "bg-amber-50 text-amber-600 border-amber-100", icon: Briefcase },
      { id: "packaging_delivery", name: "بسته‌بندی و تحویل کالا", desc: "پکینگ لیست‌های صادر شده، عکس‌های بسته‌بندی و اسناد بارنامه", iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
      { id: "financial_transactions", name: "تراکنش‌های مالی و پرداخت‌ها", desc: "فیش‌های پیش‌پرداخت، فاکتورهای رسمی و اسناد مالی پروژه", iconBg: "bg-purple-50 text-purple-600 border-purple-100", icon: TrendingUp },
      { id: "after_sales", name: "خدمات پس از فروش", desc: "اسناد خدمات گارانتی، برگه ترخیص کالا برای تعمیر و گزارشات خرابی", iconBg: "bg-teal-50 text-teal-600 border-teal-100", icon: Sliders },
      { id: "manual_other", name: "سایر مدارک و فایل‌های دستی", desc: "مدارک متفرقه و فایل‌هایی که به طور مستقیم در بالا طبقه‌بندی نشده‌اند", iconBg: "bg-slate-50 text-slate-600 border-slate-150", icon: Folder },
      { id: "supplier_inquiry", name: "استعلام از تامین‌کنندگان", desc: "اسناد و فرم‌های استعلام از تامین‌کنندگان خارجی و داخلی", iconBg: "bg-orange-50 text-orange-600 border-orange-100", icon: Briefcase }
    ];
    const folderFiles = {};
    folders.forEach((f) => {
      folderFiles[f.name] = [];
    });
    if (p.attachments && p.attachments.length > 0) {
      p.attachments.forEach((att, idx) => {
        folderFiles["درخواست مشتری و استعلام اولیه"].push({
          id: `attachment-${idx}`,
          name: att.name || `فایل درخواست ${idx + 1}`,
          url: att.url,
          size: "پیوست پروژه",
          date: p.creationDate || "مشخص نشده",
          type: "attachment"
        });
      });
    }
    const projectProformas = proformas.filter((pf) => pf.projectId === p.id);
    projectProformas.forEach((pf) => {
      folderFiles["پیش‌فاکتورها و مهندسی فروش"].push({
        id: `proforma-${pf.id}`,
        name: `پیش‌فاکتور ${pf.proformaNumber} - مشتری: ${pf.customerName}.pdf`,
        url: "#",
        size: `${pf.items?.length || 0} ردیف کالا`,
        date: pf.issueDate,
        type: "system",
        originalEntity: pf
      });
    });
    const projectPOs = (purchaseOrders || []).filter((po) => po.projectId === p.id);
    projectPOs.forEach((po) => {
      folderFiles["سفارشات خرید تامین‌کنندگان"].push({
        id: `po-${po.id}`,
        name: `سفارش خرید ${po.poNumber} - تامین‌کننده: ${po.supplierName}.pdf`,
        url: "#",
        size: `${po.items?.length || 0} ردیف کالا`,
        date: po.orderDate,
        type: "system",
        originalEntity: po
      });
    });
    const projectInquiries = (supplierInquiries || []).filter((inq) => inq.projectId === p.id);
    projectInquiries.forEach((inq) => {
      if (inq.technicalProposalFile) {
        folderFiles["استعلام از تامین‌کنندگان"].push({
          id: `inquiry-tech-${inq.id}`,
          name: `پروپوزال فنی - ${inq.supplierName || "نامشخص"} - ${inq.technicalProposalFile}`,
          url: "#",
          size: inq.technicalProposalFileSize || "نامشخص",
          date: inq.inquiryDate || inq.createdAt || "نامشخص",
          type: "system",
          originalEntity: inq
        });
      }
      if (inq.financialProposalFile) {
        folderFiles["استعلام از تامین‌کنندگان"].push({
          id: `inquiry-fin-${inq.id}`,
          name: `آفر مالی - ${inq.supplierName || "نامشخص"} - ${inq.financialProposalFile}`,
          url: "#",
          size: inq.financialProposalFileSize || "نامشخص",
          date: inq.inquiryDate || inq.createdAt || "نامشخص",
          type: "system",
          originalEntity: inq
        });
      }
      if (inq.steps && inq.steps.length > 0) {
        inq.steps.forEach((step) => {
          if (step.technicalProposalFile) {
            folderFiles["استعلام از تامین‌کنندگان"].push({
              id: `inquiry-tech-${inq.id}-${step.id}`,
              name: `پاسخ فنی - ${inq.supplierName || "نامشخص"} - ${step.technicalProposalFile}`,
              url: "#",
              size: step.technicalProposalFileSize || "نامشخص",
              date: step.date || "نامشخص",
              type: "system",
              originalEntity: inq
            });
          }
          if (step.financialProposalFile) {
            folderFiles["استعلام از تامین‌کنندگان"].push({
              id: `inquiry-fin-${inq.id}-${step.id}`,
              name: `پاسخ مالی - ${inq.supplierName || "نامشخص"} - ${step.financialProposalFile}`,
              url: "#",
              size: step.financialProposalFileSize || "نامشخص",
              date: step.date || "نامشخص",
              type: "system",
              originalEntity: inq
            });
          }
        });
      }
    });
    const projectDeliveries = (packagingDeliveries || []).filter((del) => del.projectId === p.id);
    projectDeliveries.forEach((del) => {
      folderFiles["بسته‌بندی و تحویل کالا"].push({
        id: `delivery-pl-${del.id}`,
        name: `پکینگ لیست ${del.packingListNumber} - روش ارسال: ${del.shippingMethod}.pdf`,
        url: "#",
        size: `${del.items?.length || 0} ردیف کالا`,
        date: del.deliveryDate,
        type: "system",
        originalEntity: del
      });
      if (del.photos && del.photos.length > 0) {
        del.photos.forEach((photo, idx) => {
          folderFiles["بسته‌بندی و تحویل کالا"].push({
            id: `delivery-img-${del.id}-${idx}`,
            name: `عکس بسته‌بندی ${idx + 1} - پکینگ لیست ${del.packingListNumber}.png`,
            url: photo,
            size: "تصویر بسته‌بندی",
            date: del.deliveryDate,
            type: "system",
            originalEntity: del
          });
        });
      }
    });
    const projectTXs = (transactions || []).filter((tx) => tx.projectId === p.id);
    projectTXs.forEach((tx) => {
      folderFiles["تراکنش‌های مالی و پرداخت‌ها"].push({
        id: `tx-${tx.id}`,
        name: `رسید تراکنش مالی ${tx.documentNumber} (${tx.type}).pdf`,
        url: "#",
        size: `مبلغ: ${tx.amountRIYAL?.toLocaleString("fa-IR")} ریال`,
        date: tx.date,
        type: "system",
        originalEntity: tx
      });
    });
    const projectServices = (afterSalesServices || []).filter((as) => as.projectId === p.id);
    projectServices.forEach((as) => {
      folderFiles["خدمات پس از فروش"].push({
        id: `service-${as.id}`,
        name: `خدمات پس از فروش - تجهیز: ${as.itemName}.pdf`,
        url: "#",
        size: `وضعیت: ${as.status}`,
        date: as.startDate,
        type: "system",
        originalEntity: as
      });
    });
    if (p.manualDocuments && p.manualDocuments.length > 0) {
      p.manualDocuments.forEach((doc) => {
        const targetFolderName = folders.some((f) => f.name === doc.folderName) ? doc.folderName : "سایر مدارک و فایل‌های دستی";
        folderFiles[targetFolderName].push({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          size: doc.size || "بارگذاری دستی",
          date: doc.createdAt,
          type: "manual"
        });
      });
    }
    return { folders, folderFiles };
  };
  const handleFileUpload = async (e, folderName) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProjectForActivities) return;
    setIsUploadingDoc(true);
    try {
      const p = selectedProjectForActivities;
      const newDocs = [...p.manualDocuments || []];
      const newAttachments = [...p.attachments || []];
      let updated = false;
      let attachmentsUpdated = false;
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        newDocs.push({
          id: docId,
          folderName,
          name: file.name,
          url,
          createdAt: getTodayShamsi(),
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
        updated = true;
        if (folderName === "درخواست مشتری و استعلام اولیه") {
          newAttachments.push({
            name: file.name,
            url
          });
          attachmentsUpdated = true;
        }
      }
      if (updated) {
        const updatedProject = {
          ...p,
          manualDocuments: newDocs,
          attachments: attachmentsUpdated ? newAttachments : p.attachments
        };
        updateProject(updatedProject);
        setSelectedProjectForActivities(updatedProject);
        alert("فایل‌ها با موفقیت در پوشه مربوطه بارگذاری شدند.");
      }
    } catch (err) {
      alert(err.message || "خطا در بارگذاری فایل");
    } finally {
      if (e.target) e.target.value = "";
      setIsUploadingDoc(false);
    }
  };
  const handleFileDelete = (docId, docName, docType) => {
    if (!confirm(`آیا از حذف فایل "${docName}" اطمینان دارید؟`)) return;
    if (!selectedProjectForActivities) return;
    const p = selectedProjectForActivities;
    let updatedProject = { ...p };
    if (docType === "manual") {
      updatedProject.manualDocuments = (p.manualDocuments || []).filter((doc) => doc.id !== docId);
    } else if (docType === "attachment") {
      updatedProject.attachments = (p.attachments || []).filter((_, idx) => `attachment-${idx}` !== docId);
      updatedProject.manualDocuments = (p.manualDocuments || []).filter((doc) => doc.id !== docId);
    }
    updateProject(updatedProject);
    setSelectedProjectForActivities(updatedProject);
    alert("فایل با موفقیت حذف شد.");
  };
  const handlePreviewOrDownload = (doc) => {
    if (doc.type === "system") {
      if (doc.id?.startsWith("proforma-") && onOpenDocument) {
        onOpenDocument("proformas", doc.id.replace("proforma-", ""));
      } else if (doc.id?.startsWith("po-") && onOpenDocument) {
        onOpenDocument("purchaseOrders", doc.id.replace("po-", ""));
      } else if (doc.id?.startsWith("inquiry-") && onOpenDocument) {
        setActivePreviewDoc(doc);
      } else if (doc.id?.startsWith("delivery-") && onOpenDocument) {
        onOpenDocument("packagingDelivery", doc.id.replace("delivery-", ""));
      } else {
        setActivePreviewDoc(doc);
      }
      return;
    }
    if (doc.url !== "#" && !doc.url.startsWith("data:image/") && !doc.name.endsWith(".png") && !doc.name.endsWith(".jpg") && !doc.name.endsWith(".jpeg")) {
      window.open(doc.url, "_blank");
    } else {
      setActivePreviewDoc(doc);
    }
  };
  const renderProjectSupplyStatus = (project) => {
    const projectProformas = proformas.filter((pf) => pf.projectId === project.id);
    const wonProformas = projectProformas.filter((pf) => {
      const outcome = getProformaOutcomeStatus(pf);
      return outcome === "تأیید شده (برنده)" || outcome === "نیمه برنده";
    });
    const allWonItems = [];
    wonProformas.forEach((pf) => {
      let wonItems = [];
      const hasExplicitWon = pf.items?.some((item) => item.status === "برنده");
      if (hasExplicitWon) {
        wonItems = pf.items.filter((item) => item.status === "برنده");
      } else {
        wonItems = pf.items?.filter((item) => item.status !== "بازنده") || [];
      }
      wonItems.forEach((item) => {
        const matchedProd = products?.find((p) => p.id === item.productId || p.code === item.productCode);
        const projectItemNeeded = project.itemsNeeded?.find((i) => i.productId === item.productId);
        let resolvedSupplyMethod = "INVENTORY";
        if (item.supplyMethod && item.supplyMethod !== "INVENTORY") {
          resolvedSupplyMethod = item.supplyMethod;
        } else if (projectItemNeeded && projectItemNeeded.supplyMethod && projectItemNeeded.supplyMethod !== "INVENTORY") {
          resolvedSupplyMethod = projectItemNeeded.supplyMethod;
        } else if (matchedProd && matchedProd.supplyType === "ORDER") {
          resolvedSupplyMethod = "ORDER";
        } else if (item.supplyMethod) {
          resolvedSupplyMethod = item.supplyMethod;
        } else if (projectItemNeeded && projectItemNeeded.supplyMethod) {
          resolvedSupplyMethod = projectItemNeeded.supplyMethod;
        } else if (matchedProd && matchedProd.supplyType) {
          resolvedSupplyMethod = matchedProd.supplyType;
        }
        allWonItems.push({
          id: item.id,
          productName: item.productName,
          productCode: item.productCode,
          brand: item.brand,
          quantity: item.quantity,
          supplyMethod: resolvedSupplyMethod,
          proformaNumber: pf.proformaNumber,
          proformaId: pf.id,
          proformaStatus: getProformaOutcomeStatus(pf),
          originalProforma: pf
        });
      });
    });
    const totalCount = allWonItems.reduce((acc, item) => acc + item.quantity, 0);
    const inventoryCount = allWonItems.filter((item) => item.supplyMethod === "INVENTORY").reduce((acc, item) => acc + item.quantity, 0);
    const orderCount = allWonItems.filter((item) => item.supplyMethod === "ORDER").reduce((acc, item) => acc + item.quantity, 0);
    const noneCount = allWonItems.filter((item) => item.supplyMethod === "NONE").reduce((acc, item) => acc + item.quantity, 0);
    const filteredItems = allWonItems.filter((item) => {
      if (supplyFilter === "ALL") return true;
      return item.supplyMethod === supplyFilter;
    });
    return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-right", dir: "rtl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-800 text-xs flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 rounded-full bg-sky-500 animate-pulse" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1143,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: "گزارش هوشمند وضعیت تامین کالاهای تایید شده پروژه" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1144,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1142,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px] mt-1 leading-relaxed", children: "این گزارش تمامی اقلام تعهد شده در پیش‌فاکتورهای تایید شده (برنده یا نیمه‌برنده) مرتبط با این پروژه را تحلیل کرده و وضعیت تامین آن‌ها را (از موجودی انبار یا ثبت سفارش خارجی) نمایش می‌دهد." }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1146,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1141,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1152,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: [
            "پیش‌فاکتورهای برنده شده: ",
            wonProformas.length,
            " عدد"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1153,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1151,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1150,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1140,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 text-[10px] font-bold", children: "کل اقلام تعهد شده" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1163,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-bold font-mono text-slate-800", children: [
              totalCount.toLocaleString("fa-IR"),
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-sans font-medium text-slate-400", children: "عدد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1165,
                columnNumber: 54
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1164,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1162,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxDEV(Briefcase, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1169,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1168,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1161,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-600 text-[10px] font-bold", children: "تامین از انبار (موجودی)" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1176,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-bold font-mono text-emerald-600", children: [
              inventoryCount.toLocaleString("fa-IR"),
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-sans font-medium text-slate-400", children: [
                "عدد (",
                totalCount > 0 ? Math.round(inventoryCount / totalCount * 100) : 0,
                "٪)"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1179,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1177,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1175,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100", children: /* @__PURE__ */ jsxDEV(CheckCircle2, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1185,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1184,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1174,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-amber-600 text-[10px] font-bold", children: "سفارش خارجی (سفارشی)" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1192,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-bold font-mono text-amber-600", children: [
              orderCount.toLocaleString("fa-IR"),
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-sans font-medium text-slate-400", children: [
                "عدد (",
                totalCount > 0 ? Math.round(orderCount / totalCount * 100) : 0,
                "٪)"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1195,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1193,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1191,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100", children: /* @__PURE__ */ jsxDEV(TrendingUp, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1201,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1200,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1190,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 text-[10px] font-bold", children: "بدون نیاز به تامین" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1208,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-bold font-mono text-slate-500", children: [
              noneCount.toLocaleString("fa-IR"),
              " ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-sans font-medium text-slate-400", children: "عدد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1210,
                columnNumber: 53
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1209,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1207,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxDEV(XCircle, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1214,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1213,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1206,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1159,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 bg-slate-100/70 p-1 rounded-xl w-fit border border-slate-200", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setSupplyFilter("ALL"),
              className: `px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${supplyFilter === "ALL" ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`,
              children: [
                "همه اقلام (",
                allWonItems.length,
                ")"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1223,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setSupplyFilter("INVENTORY"),
              className: `px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${supplyFilter === "INVENTORY" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
              children: [
                "تامین از انبار (",
                allWonItems.filter((i) => i.supplyMethod === "INVENTORY").length,
                ")"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1232,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setSupplyFilter("ORDER"),
              className: `px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${supplyFilter === "ORDER" ? "bg-amber-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
              children: [
                "سفارش خارجی (",
                allWonItems.filter((i) => i.supplyMethod === "ORDER").length,
                ")"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1241,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setSupplyFilter("NONE"),
              className: `px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${supplyFilter === "NONE" ? "bg-slate-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`,
              children: [
                "بدون نیاز به تامین (",
                allWonItems.filter((i) => i.supplyMethod === "NONE").length,
                ")"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1250,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1222,
          columnNumber: 11
        }, this),
        filteredItems.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 rounded-full text-slate-400", children: /* @__PURE__ */ jsxDEV(Briefcase, { size: 32 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1265,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1264,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 text-xs font-bold", children: "هیچ کالایی با شرایط فیلتر یافت نشد" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1267,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 max-w-xs leading-relaxed", children: "در این پروژه اقلامی با این روش تامین هنوز مشخص یا تعهد نشده‌اند." }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1268,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1263,
          columnNumber: 13
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right text-xs", children: [
          /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-50 text-slate-500 font-bold border-b border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-12 text-center", children: "ردیف" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1278,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "نام کالا / پارت‌نامبر / برند" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1279,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-44", children: "پیش‌فاکتور مرجع" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1280,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-28 text-center", children: "تعداد جهت تامین" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1281,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-40", children: "روش تامین کالا" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1282,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1277,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1276,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100", children: filteredItems.map((item, idx) => {
            return /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/40 transition", children: [
              /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center text-slate-400 font-mono text-[10px]", children: idx + 1 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1289,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-800 text-xs", children: item.productName }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1292,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-medium block mt-1", children: [
                  "کد کالا: ",
                  /* @__PURE__ */ jsxDEV("strong", { className: "font-mono", children: item.productCode }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1294,
                    columnNumber: 42
                  }, this),
                  " - برند: ",
                  /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-500", children: item.brand }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1294,
                    columnNumber: 108
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1293,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1291,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1290,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActivePreviewDoc({
                      id: `proforma-${item.proformaId}`,
                      name: `پیش‌فاکتور ${item.proformaNumber}.pdf`,
                      url: "#",
                      size: "سند سیستم",
                      date: item.originalProforma.issueDate,
                      type: "system",
                      originalEntity: item.originalProforma
                    });
                  },
                  className: "text-sky-600 hover:text-sky-700 font-bold hover:underline flex items-center gap-1 w-fit",
                  title: "مشاهده پیش‌فاکتور رسمی مرجع",
                  children: [
                    /* @__PURE__ */ jsxDEV(File, { size: 13, className: "shrink-0" }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1315,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-[11px]", children: item.proformaNumber }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1316,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-normal px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 leading-none", children: item.proformaStatus }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1317,
                      columnNumber: 31
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1299,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1298,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center font-mono font-bold text-slate-700 text-xs", children: item.quantity.toLocaleString("fa-IR") }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1322,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: item.supplyMethod === "INVENTORY" ? /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1.5 w-fit", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1328,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "تامین از انبار (موجودی)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1329,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1327,
                columnNumber: 31
              }, this) : item.supplyMethod === "ORDER" ? /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1.5 w-fit", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1333,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "سفارش خارجی" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1334,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1332,
                columnNumber: 31
              }, this) : /* @__PURE__ */ jsxDEV("span", { className: "px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-slate-50 text-slate-500 border-slate-200 flex items-center gap-1.5 w-fit", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1338,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "بدون نیاز به تامین" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1339,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1337,
                columnNumber: 31
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1325,
                columnNumber: 27
              }, this)
            ] }, item.id || idx, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1288,
              columnNumber: 25
            }, this);
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1285,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1275,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1274,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1273,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1220,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 1138,
      columnNumber: 7
    }, this);
  };
  const renderProjectDocuments = (project) => {
    const { folders, folderFiles } = getProjectFoldersAndFiles(project);
    if (selectedFolderName === null) {
      return /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-150", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-800 text-xs", children: "پوشه‌بندی هوشمند مدارک و اسناد پروژه" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1364,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px] mt-0.5", children: "لیست زیر شامل پوشه‌های ثابت هماهنگ با ماژول‌های سیستم است. مستندات تولیدشده هر ماژول به صورت خودکار در پوشه خود بایگانی می‌شود." }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1365,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1363,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200", children: [
            "کل اسناد: ",
            Object.values(folderFiles).reduce((acc, f) => acc + f.length, 0),
            " فایل"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1367,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1362,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: folders.map((folder) => {
          const filesInFolder = folderFiles[folder.name] || [];
          const FolderIcon = folder.icon;
          return /* @__PURE__ */ jsxDEV(
            "div",
            {
              onClick: () => setSelectedFolderName(folder.name),
              className: "bg-white p-5 rounded-2xl border border-slate-100 hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/5 transition duration-200 cursor-pointer flex flex-col justify-between group",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: `p-2.5 rounded-xl border ${folder.iconBg} transition-colors group-hover:bg-sky-500 group-hover:text-white group-hover:border-transparent flex items-center justify-center`, children: /* @__PURE__ */ jsxDEV(FolderIcon, { size: 18 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1383,
                      columnNumber: 25
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1382,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors", children: [
                      filesInFolder.length,
                      " فایل"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1385,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1381,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-slate-800 text-xs group-hover:text-sky-600 transition-colors", children: folder.name }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1390,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px] mt-1 leading-relaxed line-clamp-2 h-7", children: folder.desc }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 1391,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1389,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1380,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-sky-600 transition-colors", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "ورود به پوشه" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1395,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 12, className: "transform group-hover:-translate-x-1 transition-transform" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1396,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1394,
                  columnNumber: 19
                }, this)
              ]
            },
            folder.id,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1375,
              columnNumber: 17
            },
            this
          );
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1370,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1361,
        columnNumber: 9
      }, this);
    }
    const currentFolderFiles = folderFiles[selectedFolderName] || [];
    const folderDesc = folders.find((f) => f.name === selectedFolderName)?.desc || "";
    return /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSelectedFolderName(null),
              className: "text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV(ChevronRight, { size: 13, className: "rtl:rotate-180" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1418,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "پوشه‌های پروژه" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1419,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1414,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "text-slate-300 text-xs", children: "/" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1421,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-800", children: selectedFolderName }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1422,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1413,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: /* @__PURE__ */ jsxDEV("div", { className: "relative overflow-hidden flex-1 sm:flex-initial", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "file",
              multiple: true,
              disabled: isUploadingDoc,
              onChange: (e) => handleFileUpload(e, selectedFolderName),
              className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1428,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: `w-full sm:w-auto px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10 ${isUploadingDoc ? "opacity-60 cursor-not-allowed" : ""}`,
              children: isUploadingDoc ? /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1 animate-pulse", children: [
                /* @__PURE__ */ jsxDEV(Loader2, { size: 14, className: "animate-spin" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1441,
                  columnNumber: 21
                }, this),
                "درحال بارگذاری..."
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1440,
                columnNumber: 19
              }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV(Upload, { size: 14 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1446,
                  columnNumber: 21
                }, this),
                "بارگذاری فایل جدید"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1445,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1435,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1427,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1425,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1412,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-[10px] px-1 font-medium", children: folderDesc }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1455,
        columnNumber: 9
      }, this),
      currentFolderFiles.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-sky-500 transition-colors relative flex flex-col items-center justify-center space-y-3", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "file",
            multiple: true,
            disabled: isUploadingDoc,
            onChange: (e) => handleFileUpload(e, selectedFolderName),
            className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1460,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-50 rounded-full text-slate-400", children: /* @__PURE__ */ jsxDEV(Folder, { size: 32 }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1468,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1467,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 text-xs font-bold", children: "این پوشه در حال حاضر خالی است" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1470,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 max-w-xs leading-relaxed", children: "فایل‌های خود را برای بارگذاری در این پوشه بکشید و رها کنید یا بر روی دکمه بارگذاری کلیک کنید." }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1471,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1459,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right text-xs", children: [
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-50 text-slate-500 font-bold border-b border-slate-100", children: [
          /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-12 text-center", children: "ردیف" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1479,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "نام مدرک / سند" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1480,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-32", children: "تاریخ ایجاد/ثبت" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1481,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-32", children: "اندازه / منبع" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1482,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-36", children: "نوع بایگانی" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1483,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-28 text-center", children: "عملیات" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1484,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1478,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1477,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-50", children: currentFolderFiles.map((doc, idx) => {
          const isSystem = doc.type === "system";
          return /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/50 transition", children: [
            /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center text-slate-400 font-mono text-[10px]", children: idx + 1 }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1492,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV("div", { className: `p-1.5 rounded-lg ${isSystem ? "bg-sky-50 text-sky-600" : "bg-indigo-50 text-indigo-600"} flex items-center justify-center`, children: doc.name.endsWith(".png") || doc.name.endsWith(".jpg") || doc.name.endsWith(".jpeg") ? /* @__PURE__ */ jsxDEV(ImageIcon, { size: 14 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1497,
                columnNumber: 33
              }, this) : /* @__PURE__ */ jsxDEV(File, { size: 14 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1499,
                columnNumber: 33
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1495,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-semibold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer text-xs", onClick: () => handlePreviewOrDownload(doc), children: doc.name }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1502,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1494,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1493,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-slate-500 font-mono text-[10px]", children: doc.date }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1507,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-slate-500 text-[10px]", children: doc.size }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1508,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV("span", { className: `px-2 py-0.5 rounded-full text-[9px] font-bold border ${isSystem ? "bg-sky-50 text-sky-700 border-sky-100" : doc.type === "attachment" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"}`, children: isSystem ? "سیستمی (خودکار)" : doc.type === "attachment" ? "پیوست درخواست" : "آپلود دستی" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1510,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1509,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 justify-center", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handlePreviewOrDownload(doc),
                  className: "p-1.5 hover:bg-sky-50 rounded text-sky-600 hover:text-sky-700 transition",
                  title: "پیش‌نمایش مدرک",
                  children: /* @__PURE__ */ jsxDEV(Eye, { size: 14 }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1521,
                    columnNumber: 31
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1516,
                  columnNumber: 29
                },
                this
              ),
              !isSystem && /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => handleFileDelete(doc.id || "", doc.name, doc.type),
                  className: "p-1.5 hover:bg-red-50 rounded text-red-600 hover:text-red-700 transition",
                  title: "حذف",
                  children: /* @__PURE__ */ jsxDEV(Trash2, { size: 14 }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1529,
                    columnNumber: 33
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1524,
                  columnNumber: 31
                },
                this
              ),
              doc.url !== "#" && /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: doc.url,
                  download: doc.name,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-800 transition flex items-center",
                  title: "دانلود مستقیم",
                  children: /* @__PURE__ */ jsxDEV(Download, { size: 14 }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 1541,
                    columnNumber: 33
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1533,
                  columnNumber: 31
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1515,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1514,
              columnNumber: 25
            }, this)
          ] }, doc.id || idx, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1491,
            columnNumber: 23
          }, this);
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1487,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1476,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1475,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1474,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 1410,
      columnNumber: 7
    }, this);
  };
  const renderDocumentPreviewModal = () => {
    if (!activePreviewDoc) return null;
    const doc = activePreviewDoc;
    const isImage = doc.url && doc.url.startsWith("data:image/");
    return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4", dir: "rtl", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white p-4 flex justify-between items-center text-right", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(File, { size: 18, className: "text-sky-400" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1570,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-sm", children: doc.name }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1571,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1569,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          doc.url !== "#" && /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: doc.url,
              download: doc.name,
              target: "_blank",
              rel: "noreferrer",
              className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxDEV(Download, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1582,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "دانلود فایل" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1583,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1575,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                const printContents = document.getElementById("printable-document-content")?.innerHTML;
                if (printContents) {
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(`
                        <html>
                          <head>
                            <title>${doc.name}</title>
                            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                            <style>
                              body { font-family: 'Tahoma', sans-serif; direction: rtl; text-align: right; }
                              @media print {
                                .no-print { display: none; }
                              }
                            </style>
                          </head>
                          <body class="p-8 bg-white text-slate-800">
                            ${printContents}
                            <script>
                              window.onload = function() {
                                window.print();
                                window.close();
                              }
                            <\/script>
                          </body>
                        </html>
                      `);
                    printWindow.document.close();
                  }
                }
              },
              className: "px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1",
              children: /* @__PURE__ */ jsxDEV("span", { children: "چاپ سند" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1622,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1586,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setActivePreviewDoc(null),
              className: "p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white",
              children: /* @__PURE__ */ jsxDEV(X, { size: 18 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1628,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1624,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1573,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1568,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-6 bg-slate-50 text-right", children: /* @__PURE__ */ jsxDEV("div", { id: "printable-document-content", className: "bg-white p-8 rounded-xl border border-slate-200 shadow-sm mx-auto max-w-3xl min-h-[500px] text-slate-800", children: isImage ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center space-y-4", children: [
        /* @__PURE__ */ jsxDEV("img", { src: doc.url, alt: doc.name, className: "max-w-full max-h-[60vh] rounded-lg border border-slate-200 shadow-sm object-contain", referrerPolicy: "no-referrer" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1638,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-mono", children: [
          "اندازه: ",
          doc.size,
          " - تاریخ ثبت: ",
          doc.date
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1639,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1637,
        columnNumber: 17
      }, this) : doc.id?.startsWith("proforma-") ? (
        // 1. Proforma Preview
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-4 border-b-2 border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-900", children: "پیش‌فاکتور رسمی فروش کالا" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1646,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px]", children: "شرکت ابزار تامین عرشیا (واحد مالی و مهندسی فروش)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1647,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1645,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] space-y-1 text-slate-500 font-mono text-left", dir: "ltr", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                "No: ",
                doc.originalEntity?.proformaNumber
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1650,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Date: ",
                doc.originalEntity?.issueDate
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1651,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Status: ",
                doc.originalEntity?.status
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1652,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1649,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1644,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "خریدار / کارفرما:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1658,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.customerName }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1659,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1657,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "کارشناس مسئول:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1662,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: selectedProjectForActivities?.salesExpert || "مشخص نشده" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1663,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1661,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1656,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right border-collapse border border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-100 border-b border-slate-200 font-bold text-slate-700", children: [
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center w-10", children: "ردیف" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1670,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200", children: "شرح کالا / خدمات" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1671,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center w-16", children: "تعداد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1672,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-left", children: "قیمت واحد (ریال)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1673,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-left", children: "قیمت کل (ریال)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1674,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1669,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1668,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { children: doc.originalEntity?.items?.map((item, idx) => /* @__PURE__ */ jsxDEV("tr", { className: "border-b border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: idx + 1 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1680,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-800", children: item.name }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1682,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 block", children: [
                  "برند: ",
                  item.brand || "متفرقه",
                  " - پارت‌نامبر: ",
                  item.partNumber || "-"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1683,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1681,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: item.quantity }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1685,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-left font-mono", children: item.unitPrice?.toLocaleString("fa-IR") }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1686,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-left font-mono", children: (item.unitPrice * item.quantity)?.toLocaleString("fa-IR") }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1687,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1679,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1677,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1667,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDEV("div", { className: "w-64 space-y-1.5 text-[11px]", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between border-b border-slate-100 pb-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "مجموع ناخالص:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1696,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: [
                doc.originalEntity?.totalAmount?.toLocaleString("fa-IR"),
                " ریال"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1697,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1695,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between border-b border-slate-100 pb-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "تخفیف:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1700,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-red-600", children: [
                (doc.originalEntity?.discountAmount || 0)?.toLocaleString("fa-IR"),
                " ریال"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1701,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1699,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between border-b border-slate-100 pb-1", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "مالیات بر ارزش افزوده (۱۰٪):" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1704,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: [
                (doc.originalEntity?.vatAmount || 0)?.toLocaleString("fa-IR"),
                " ریال"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1705,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1703,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between font-bold text-slate-900 border-b-2 border-slate-300 pb-1.5 text-xs", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "مبلغ قابل پرداخت:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1708,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: [
                doc.originalEntity?.finalAmount?.toLocaleString("fa-IR"),
                " ریال"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1709,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1707,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1694,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1693,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 pt-10 text-center text-[10px] text-slate-400", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "مهر و امضای بخش مالی شرکت" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1716,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-20 w-32 mx-auto border-2 border-dashed border-slate-200 rounded-lg mt-2 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] rotate-12", children: "امضا و مهر معتبر" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1718,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1717,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1715,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "مهر و تایید خریدار" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1722,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-20 w-32 mx-auto border-2 border-dashed border-slate-200 rounded-lg mt-2 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[8px]", children: "محل امضای خریدار" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1724,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1723,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1721,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1714,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1643,
          columnNumber: 17
        }, this)
      ) : doc.id?.startsWith("po-") ? (
        // 2. PO Preview
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-4 border-b-2 border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-900", children: "سفارش رسمی خرید کالا (PO)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1734,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px]", children: "واحد تامین و بازرگانی خارجی/داخلی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1735,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1733,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] space-y-1 text-slate-500 font-mono text-left", dir: "ltr", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                "PO No: ",
                doc.originalEntity?.poNumber
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1738,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Date: ",
                doc.originalEntity?.orderDate
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1739,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Status: ",
                doc.originalEntity?.status
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1740,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1737,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1732,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "تامین‌کننده / سازنده:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1746,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.supplierName }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1747,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1745,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "ارز مبادلاتی:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1750,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.currency }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1751,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1749,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1744,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right border-collapse border border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-100 border-b border-slate-200 font-bold text-slate-700", children: [
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center w-10", children: "ردیف" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1758,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200", children: "نام کالا / پارت‌نامبر" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1759,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center w-16", children: "تعداد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1760,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-left", children: "قیمت ارزی واحد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1761,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-left", children: "قیمت ارزی کل" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1762,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1757,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1756,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { children: doc.originalEntity?.items?.map((item, idx) => /* @__PURE__ */ jsxDEV("tr", { className: "border-b border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: idx + 1 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1768,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-800", children: item.name }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1770,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-500 block", children: [
                  "برند: ",
                  item.brand || "-",
                  " - پارت‌نامبر: ",
                  item.partNumber || "-"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1771,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1769,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: item.quantity }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1773,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-left font-mono", children: [
                item.foreignUnitPrice?.toLocaleString("fa-IR"),
                " ",
                doc.originalEntity?.currency
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1774,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-left font-mono", children: [
                (item.foreignUnitPrice * item.quantity)?.toLocaleString("fa-IR"),
                " ",
                doc.originalEntity?.currency
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1775,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1767,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1765,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1755,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-8 text-[10px] text-slate-500", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "شرایط پرداخت:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1783,
                  columnNumber: 26
                }, this),
                " ",
                doc.originalEntity?.paymentTerms || "طبق توافق"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1783,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { children: [
                /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: "مدت تحویل:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 1784,
                  columnNumber: 26
                }, this),
                " ",
                doc.originalEntity?.deliveryLeadTime || "مشخص نشده"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1784,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1782,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-center font-bold text-slate-700 w-48", children: [
              /* @__PURE__ */ jsxDEV("p", { children: "امضا کارشناس بازرگانی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1787,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1788,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1786,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1781,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1731,
          columnNumber: 17
        }, this)
      ) : doc.id?.startsWith("delivery-") ? (
        // 3. Packaging & Packing List Preview
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-4 border-b-2 border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-900", children: "سند رسمی پکینگ لیست (Packing List)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1797,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px]", children: "واحد انبار و لجستیک کالا" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1798,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1796,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] space-y-1 text-slate-500 font-mono text-left", dir: "ltr", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Packing No: ",
                doc.originalEntity?.packingListNumber
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1801,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Delivery Date: ",
                doc.originalEntity?.deliveryDate
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1802,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Shipping Method: ",
                doc.originalEntity?.shippingMethod
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1803,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1800,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1795,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "تعداد کل کارتن/بسته:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1809,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: [
                doc.originalEntity?.boxCount,
                " عدد"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1810,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1808,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "وزن ناخالص کل (کیلوگرم):" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1813,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: [
                doc.originalEntity?.grossWeightKg,
                " کیلوگرم"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1814,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1812,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "ابعاد حدودی بسته‌ها:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1817,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.dimensionsCm || "استاندارد" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1818,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1816,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1807,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right border-collapse border border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-100 border-b border-slate-200 font-bold text-slate-700", children: [
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center w-10", children: "ردیف" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1825,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200", children: "نام تجهیز / کالا" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1826,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center", children: "تعداد سفارش" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1827,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center", children: "تعداد آماده‌سازی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1828,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 border border-slate-200 text-center", children: "بسته‌بندی کامل؟" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1829,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1824,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1823,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { children: doc.originalEntity?.items?.map((item, idx) => /* @__PURE__ */ jsxDEV("tr", { className: "border-b border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: idx + 1 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1835,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 font-bold text-slate-800", children: item.name }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1836,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: item.orderedQty }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1837,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center font-mono", children: item.packedQty }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1838,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 border border-slate-200 text-center text-emerald-600 font-bold", children: item.isPacked ? "✓ بله" : "✗ خیر" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1839,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1834,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1832,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1822,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 pt-8 text-center text-[10px] text-slate-500", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "تاییدکننده صحت بسته‌بندی (مسئول انبار)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1847,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1848,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1846,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "گیرنده نهایی کالا / کارفرما" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1851,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1852,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1850,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1845,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1794,
          columnNumber: 17
        }, this)
      ) : doc.id?.startsWith("tx-") ? (
        // 4. Financial Transaction Receipt Preview
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-4 border-b-2 border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-900", children: doc.originalEntity?.type === "دریافت" ? "رسید دریافت وجه (سند بستانکار)" : "سند پرداخت وجه (سند بدهکار)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1861,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px]", children: "امور مالی و خزانه‌داری عرشیا" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1862,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1860,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] space-y-1 text-slate-500 font-mono text-left", dir: "ltr", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Voucher No: ",
                doc.originalEntity?.documentNumber
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1865,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Date: ",
                doc.originalEntity?.date
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1866,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Ref No: ",
                doc.originalEntity?.referenceNumber || "-"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1867,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1864,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1859,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-[11px]", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "مبلغ تراکنش:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1873,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-900 text-sm font-mono mr-1", children: [
                doc.originalEntity?.amountRIYAL?.toLocaleString("fa-IR"),
                " ریال"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1874,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1872,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "نوع پرداخت/دریافت:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1877,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.paymentType }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1878,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1876,
              columnNumber: 21
            }, this),
            doc.originalEntity?.bankName && /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "نام بانک مبدا/مقصد:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1882,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 mr-1", children: doc.originalEntity?.bankName }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1883,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1881,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "شرح تراکنش و بابت:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1887,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-800 mr-1 inline", children: doc.originalEntity?.notes || "بدون بابت" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1888,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1886,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1871,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "pt-12 text-center text-[10px] text-slate-400 flex justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "تحویل‌دهنده سند / پرداخت‌کننده" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1894,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1895,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1893,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "مدیر خزانه‌داری و امور مالی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1898,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1899,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1897,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1892,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1858,
          columnNumber: 17
        }, this)
      ) : doc.id?.startsWith("service-") ? (
        // 5. After-Sales Service Preview
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-4 border-b-2 border-slate-200", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-900", children: "برگه گزارش خدمات پس از فروش و گارانتی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1908,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px]", children: "دپارتمان مهندسی خدمات و پشتیبانی فنی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1909,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1907,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] space-y-1 text-slate-500 font-mono text-left", dir: "ltr", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Service ID: ",
                doc.originalEntity?.id
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1912,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Start Date: ",
                doc.originalEntity?.startDate
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1913,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                "Status: ",
                doc.originalEntity?.status
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1914,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1911,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1906,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "تجهیز ارجاعی:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1920,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.itemName }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1921,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1919,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "برند / مدل:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1924,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-800 font-bold mr-1", children: doc.originalEntity?.itemBrand || "مشخص نشده" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1925,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1923,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1918,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-3 rounded-lg border border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-800 block border-b border-slate-100 pb-1.5 mb-1.5", children: "شرح ایراد گزارش شده توسط کارفرما:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1931,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-600 leading-relaxed text-[11px]", children: doc.originalEntity?.issueDescription }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1932,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1930,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-3 rounded-lg border border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-emerald-800 block border-b border-slate-100 pb-1.5 mb-1.5", children: "اقدامات انجام‌شده توسط دپارتمان فنی:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1936,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-600 leading-relaxed text-[11px]", children: doc.originalEntity?.actionsTaken || "در حال عیب‌یابی کالا" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1937,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1935,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1929,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 pt-8 text-center text-[10px] text-slate-500", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "تاییدکننده فنی و کارشناس پشتیبانی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1943,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1944,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1942,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-slate-700", children: "امضای نماینده خریدار (تحویل‌گیرنده)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1947,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-14" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 1948,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 1946,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1941,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1905,
          columnNumber: 17
        }, this)
      ) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-10 space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-slate-100 rounded-full text-slate-400 w-16 h-16 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxDEV(File, { size: 32 }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1955,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1954,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-slate-800", children: doc.name }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1957,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-500", children: "این فایل با موفقیت به صورت دستی بارگذاری شده است." }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1958,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400 font-mono", children: [
          "اندازه: ",
          doc.size,
          " - تاریخ ثبت: ",
          doc.date
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1959,
          columnNumber: 19
        }, this),
        doc.url && doc.url !== "#" && /* @__PURE__ */ jsxDEV("div", { className: "pt-4", children: /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: doc.url,
            target: "_blank",
            rel: "noreferrer",
            className: "px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-sky-500/10",
            children: "دانلود و بازکردن مستقیم فایل"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 1962,
            columnNumber: 23
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1961,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1953,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1635,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1634,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 1566,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 1565,
      columnNumber: 7
    }, this);
  };
  const getStatusColor = (st) => {
    switch (st) {
      case "جدید":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "در حال مذاکره":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ارائه پیش‌فاکتور":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "برنده (موفق)":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "باخته":
        return "bg-red-50 text-red-700 border-red-200";
      case "لغو شده":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "نیمه برنده":
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold text-slate-900", children: "پروژه‌ها و مناقصات تجاری" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 1999,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-sm mt-1", children: "رهگیری مناقصات، خط لوله فرصت‌های فروش، برآورد ارزش مالی قراردادها و شانس موفقیت آنها" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2e3,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 1998,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleExportExcel,
            className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-500/15 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDEV(FileSpreadsheet, { size: 16 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2007,
                columnNumber: 13
              }, this),
              "خروجی اکسل"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2003,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleOpenAdd,
            className: "px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2014,
                columnNumber: 13
              }, this),
              "ثبت فرصت پروژه جدید"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2010,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2002,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 1997,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative w-full md:flex-1", children: [
        /* @__PURE__ */ jsxDEV(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400", size: 18 }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2023,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            placeholder: "جستجو در نام پروژه، کد رهگیری، یا نام کارفرما...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2024,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2022,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative w-full md:w-64 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Filter, { size: 16, className: "text-slate-400 flex-shrink-0" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2034,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            value: selectedStatus,
            onChange: (e) => setSelectedStatus(e.target.value),
            className: "w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white",
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "all", children: "همه مراحل خط فروش" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2040,
                columnNumber: 13
              }, this),
              (settings.dropdownItems?.projectStatuses || ["جدید", "در حال مذاکره", "ارائه پیش‌فاکتور", "برنده (موفق)", "نیمه برنده", "باخته", "لغو شده"]).map((st, idx) => /* @__PURE__ */ jsxDEV("option", { value: st, children: st }, idx, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2042,
                columnNumber: 15
              }, this))
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2035,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2033,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 2021,
      columnNumber: 7
    }, this),
    (() => {
      const projectCustomFields = (settings?.customFields || []).filter((f) => f.module === "projects");
      if (projectCustomFields.length === 0) return null;
      return /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-500", children: [
          /* @__PURE__ */ jsxDEV(Filter, { size: 14, className: "text-indigo-500" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2055,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { children: "فیلتر فیلدهای سفارشی پروژه:" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2056,
            columnNumber: 15
          }, this),
          Object.values(customFieldFilters).some(Boolean) && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setCustomFieldFilters({}),
              className: "mr-auto text-[10px] text-rose-600 hover:underline animate-fade-in",
              children: "پاک کردن تمامی فیلترها"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2058,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2054,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs", children: projectCustomFields.map((field) => {
          const currentVal = customFieldFilters[field.id] || "";
          return /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 text-right", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "block text-[11px] font-bold text-slate-600", children: [
              field.name,
              ":"
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2071,
              columnNumber: 21
            }, this),
            field.type === "select" ? /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: currentVal,
                onChange: (e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value }),
                className: "w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: "همه" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2078,
                    columnNumber: 25
                  }, this),
                  (field.options || []).map((opt, oIdx) => /* @__PURE__ */ jsxDEV("option", { value: opt, children: opt }, oIdx, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2080,
                    columnNumber: 27
                  }, this))
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2073,
                columnNumber: 23
              },
              this
            ) : field.type === "boolean" ? /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: currentVal,
                onChange: (e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value }),
                className: "w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: "همه" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2089,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "true", children: "بله" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2090,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "false", children: "خیر" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2091,
                    columnNumber: 25
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2084,
                columnNumber: 23
              },
              this
            ) : field.type === "file" ? /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: currentVal,
                onChange: (e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value }),
                className: "w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: "همه" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2099,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "has_file", children: "دارای پیوست" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2100,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "no_file", children: "بدون پیوست" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2101,
                    columnNumber: 25
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2094,
                columnNumber: 23
              },
              this
            ) : /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: field.type === "number" ? "number" : "text",
                placeholder: `فیلتر ${field.name}...`,
                value: currentVal,
                onChange: (e) => setCustomFieldFilters({ ...customFieldFilters, [field.id]: e.target.value }),
                className: "w-full border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2104,
                columnNumber: 23
              },
              this
            )
          ] }, field.id, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2070,
            columnNumber: 19
          }, this);
        }) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2066,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2053,
        columnNumber: 11
      }, this);
    })(),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-right border-collapse min-w-[1000px]", children: [
        /* @__PURE__ */ jsxDEV("thead", { children: [
          /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold", children: [
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-28", children: "کد پروژه" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2126,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "نام و مشخصات پروژه" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2127,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "کارفرما / مشتری" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2128,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "ارزش پایپ‌لاین (ریال)" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2129,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-64", children: "تاریخ‌های کلیدی" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2130,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "وضعیت پروژه" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2131,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "فیلدهای سفارشی" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2132,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-3 text-center w-24", children: "عملیات" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2133,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2125,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-50/50 border-b border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر کد...",
                value: colFilters.code || "",
                onChange: (e) => setColFilters({ ...colFilters, code: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2138,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2137,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر نام...",
                value: colFilters.name || "",
                onChange: (e) => setColFilters({ ...colFilters, name: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2147,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2146,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر مشتری...",
                value: colFilters.customerName || "",
                onChange: (e) => setColFilters({ ...colFilters, customerName: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2156,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2155,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر پایپ‌لاین...",
                value: colFilters.estimatedValueRIYAL || "",
                onChange: (e) => setColFilters({ ...colFilters, estimatedValueRIYAL: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-left font-mono"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2165,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2164,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر موعد...",
                value: colFilters.expectedCloseDate || "",
                onChange: (e) => setColFilters({ ...colFilters, expectedCloseDate: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono text-center"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2174,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2173,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "فیلتر وضعیت...",
                value: colFilters.status || "",
                onChange: (e) => setColFilters({ ...colFilters, status: e.target.value }),
                className: "w-full px-2 py-1 text-[11px] font-normal border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-center"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2183,
                columnNumber: 19
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2182,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2191,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("th", { className: "p-2" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2192,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2136,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2124,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100 text-slate-700 text-xs", children: filteredProjects.map((p) => /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/50 transition", children: [
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-mono font-bold text-slate-500", children: p.code }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2199,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-slate-900", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold text-sm text-slate-900", children: p.name }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2205,
              columnNumber: 21
            }, this),
            (p.salesExpert || p.customerInquiryNumber) && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-500 border-t border-slate-100 pt-1", children: [
              p.salesExpert && /* @__PURE__ */ jsxDEV("span", { children: [
                "کارشناس: ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800", children: p.salesExpert }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2212,
                  columnNumber: 38
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2211,
                columnNumber: 27
              }, this),
              p.customerInquiryNumber && /* @__PURE__ */ jsxDEV("span", { children: [
                p.salesExpert && " | ",
                "استعلام: ",
                /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-mono", children: p.customerInquiryNumber }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2217,
                  columnNumber: 62
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2216,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2209,
              columnNumber: 23
            }, this),
            p.referrerName && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 mt-1.5", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100", children: [
              "معرف: ",
              p.referrerName
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2226,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2225,
              columnNumber: 23
            }, this),
            p.itemsNeeded && p.itemsNeeded.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 mt-2 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold text-slate-500", children: "اقلام درخواستی:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2235,
                columnNumber: 25
              }, this),
              p.itemsNeeded.map((item, i) => /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100", children: [
                item.name,
                " (",
                item.quantity,
                " عدد - ",
                item.supplyMethod === "ORDER" ? "سفارشی" : item.supplyMethod === "NONE" ? "بدون نیاز به تامین" : "انباری",
                ")"
              ] }, i, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2237,
                columnNumber: 27
              }, this))
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2234,
              columnNumber: 23
            }, this),
            p.attachments && p.attachments.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 mt-1.5 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-extrabold text-slate-500 flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxDEV(Paperclip, { size: 10 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2246,
                  columnNumber: 110
                }, this),
                " پیوست‌ها:"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2246,
                columnNumber: 25
              }, this),
              p.attachments.map((att, i) => /* @__PURE__ */ jsxDEV("a", { href: att.url, target: "_blank", rel: "noreferrer", className: "text-[9px] font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200 transition", children: att.name }, i, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2248,
                columnNumber: 27
              }, this))
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2245,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2204,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-medium text-slate-700", children: p.customerName }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2257,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-mono font-bold text-slate-800 text-left", children: getPipelineValue(p.id).toLocaleString("fa-IR") }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2262,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-[11px] text-slate-600 space-y-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2 border-b border-dashed border-slate-100 pb-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "ثبت فرصت:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2269,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: p.opportunityDate || p.creationDate }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2270,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2268,
              columnNumber: 21
            }, this),
            p.winningDate && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2 text-emerald-600 font-bold border-b border-dashed border-emerald-100 pb-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "تاریخ تایید:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2274,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: p.winningDate }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2275,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2273,
              columnNumber: 23
            }, this),
            getProjectPrepaymentDate(p.id) && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2 text-indigo-600 font-bold border-b border-dashed border-indigo-100 pb-0.5", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "دریافت پیش‌پرداخت:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2280,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: getProjectPrepaymentDate(p.id) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2281,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2279,
              columnNumber: 23
            }, this),
            (() => {
              const details = getProjectDeliveryDetails(p.id);
              return /* @__PURE__ */ jsxDEV(Fragment, { children: [
                details.hasMultipleAgreed ? /* @__PURE__ */ jsxDEV("div", { className: "border-b border-dashed border-sky-100 pb-1 space-y-0.5 bg-sky-50/20 p-1.5 rounded", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "text-sky-600 font-bold text-[9px] mb-0.5", children: "زمان تحویل توافقی اقلام:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2291,
                    columnNumber: 31
                  }, this),
                  details.agreedItems.map((item, i) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-1 text-[9px] text-sky-700 bg-sky-50/50 px-1 py-0.5 rounded", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "truncate max-w-[100px] font-medium", title: item.productName, children: [
                      item.productName,
                      ":"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2294,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-mono font-semibold", children: item.calculatedDate }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2295,
                      columnNumber: 35
                    }, this)
                  ] }, i, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2293,
                    columnNumber: 33
                  }, this))
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2290,
                  columnNumber: 29
                }, this) : (details.singleAgreedDate || p.agreedDeliveryDate) && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2 text-sky-600 font-bold border-b border-dashed border-sky-100 pb-0.5", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "توافق‌شده تحویل:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2302,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: details.singleAgreedDate || p.agreedDeliveryDate }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2303,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2301,
                  columnNumber: 31
                }, this),
                details.hasMultipleActual ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-0.5 bg-amber-50/20 p-1.5 rounded mt-1", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "text-amber-600 font-bold text-[9px] mb-0.5", children: "تحویل قطعی اقلام:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2311,
                    columnNumber: 31
                  }, this),
                  details.actualItems.map((item, i) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-1 text-[9px] text-amber-700 bg-amber-50/50 px-1 py-0.5 rounded", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "truncate max-w-[100px] font-medium", title: item.productName, children: [
                      item.productName,
                      ":"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2314,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-mono font-semibold", children: item.actualDate }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2315,
                      columnNumber: 35
                    }, this)
                  ] }, i, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2313,
                    columnNumber: 33
                  }, this))
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2310,
                  columnNumber: 29
                }, this) : (details.singleActualDate || getActualDeliveryDate(p.id)) && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between gap-2 text-amber-600 font-bold", children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "تحویل قطعی:" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2322,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: details.singleActualDate || getActualDeliveryDate(p.id) }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2323,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2321,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2287,
                columnNumber: 25
              }, this);
            })()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2267,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center", children: [
            /* @__PURE__ */ jsxDEV("span", { className: `px-2.5 py-1 rounded-full font-bold text-[10px] border ${getStatusColor(p.status)}`, children: p.status }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2334,
              columnNumber: 21
            }, this),
            p.status === "باخته" && p.lossReason && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-rose-500 font-bold mt-1 max-w-[120px] mx-auto truncate", title: p.lossReason, children: [
              "علت: ",
              p.lossReason
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2338,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2333,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3", children: /* @__PURE__ */ jsxDEV(
            CustomFieldsDetailView,
            {
              module: "projects",
              customFields: settings?.customFields || [],
              customValues: p.customValues
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2346,
              columnNumber: 21
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2345,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setSelectedProjectForActivities(p),
                className: "p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded transition flex items-center gap-1 text-[10px] font-bold border border-sky-100 shadow-sm",
                title: "ثبت فعالیت و ارجاع",
                children: [
                  /* @__PURE__ */ jsxDEV(Clock, { size: 13, className: "text-sky-500" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2361,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "فعالیت‌ها" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2362,
                    columnNumber: 25
                  }, this),
                  (projectCategoryGroups || []).filter((g) => g.projectId === p.id && g.status === "جاری").length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2364,
                    columnNumber: 27
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2356,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleOpenEdit(p),
                className: "p-1.5 hover:bg-slate-100 text-slate-600 hover:text-sky-600 rounded transition",
                title: "ویرایش پروژه",
                children: /* @__PURE__ */ jsxDEV(Edit, { size: 14 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2372,
                  columnNumber: 25
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2367,
                columnNumber: 23
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setProjectToDeleteId(p.id);
                  setProjectToDeleteName(p.name);
                  setDeleteConfirmOpen(true);
                },
                className: "p-1.5 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition",
                title: "حذف پروژه",
                children: /* @__PURE__ */ jsxDEV(Trash2, { size: 14 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2383,
                  columnNumber: 25
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2374,
                columnNumber: 23
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2355,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2354,
            columnNumber: 19
          }, this)
        ] }, p.id, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2197,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2195,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2123,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2122,
        columnNumber: 9
      }, this),
      filteredProjects.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-center bg-white p-12 border-t border-slate-100 w-full", children: [
        /* @__PURE__ */ jsxDEV(Briefcase, { className: "mx-auto text-slate-300 mb-3", size: 48 }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2395,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-slate-500 font-medium", children: "پروژه‌ای با این مشخصات یافت نشد." }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2396,
          columnNumber: 13
        }, this),
        Object.values(colFilters).some(Boolean) && /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setColFilters({}),
            className: "mt-3 text-xs text-sky-600 hover:underline font-bold",
            children: "پاک کردن فیلترهای ستونی"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2398,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2394,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 2121,
      columnNumber: 7
    }, this),
    showModal && /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto ${isProjectModalFullscreen ? "p-0" : "p-4"}`, children: /* @__PURE__ */ jsxDEV("div", { className: `bg-white shadow-xl border border-slate-100 overflow-hidden animate-scale-in transition-all duration-300 flex flex-col ${isProjectModalFullscreen ? "w-screen h-screen rounded-none my-0 max-w-full" : "rounded-2xl w-full max-w-4xl my-8"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-800", children: editingProject ? `ویرایش اطلاعات پروژه: ${editingProject.name}` : "ثبت پروژه صنعتی / فرصت تجاری جدید" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2418,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setIsProjectModalFullscreen(!isProjectModalFullscreen),
              className: "p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition flex items-center justify-center",
              title: isProjectModalFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه",
              children: isProjectModalFullscreen ? /* @__PURE__ */ jsxDEV(Minimize2, { size: 18 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2428,
                columnNumber: 47
              }, this) : /* @__PURE__ */ jsxDEV(Maximize2, { size: 18 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2428,
                columnNumber: 73
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2422,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowModal(false);
                setEditingProject(null);
                setIsProjectModalFullscreen(false);
              },
              className: "p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition flex items-center justify-center",
              children: /* @__PURE__ */ jsxDEV(X, { size: 18 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2435,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2430,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2421,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2417,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSave, className: `p-6 space-y-6 overflow-y-auto text-right ${isProjectModalFullscreen ? "max-h-[calc(100vh-140px)] flex-1" : "max-h-[80vh]"}`, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-sky-500 pr-2", children: "اطلاعات عمومی پروژه" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2444,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 md:col-span-2", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "عنوان کامل پروژه / نام پروژه *" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2448,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  required: true,
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "مثال: نوسازی تجهیزات کنترل نیروگاه ری",
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2449,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2447,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "نام مشتری / کارفرما *" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2461,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxDEV(
                  SearchableSelect,
                  {
                    wrapperClassName: "flex-1 min-w-0",
                    value: customerId,
                    onChange: (val) => setCustomerId(val),
                    required: true,
                    options: [
                      { value: "", label: "-- انتخاب مشتری --" },
                      ...customers.map((c) => ({ value: c.id, label: c.companyName }))
                    ],
                    placeholder: "-- انتخاب مشتری --"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2463,
                    columnNumber: 21
                  },
                  this
                ),
                addCustomer && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setQuickAddCustomerTarget("customerId");
                      setQuickAddType("customer");
                    },
                    className: "px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center",
                    title: "تعریف سریع مشتری جدید",
                    children: /* @__PURE__ */ jsxDEV(Plus, { size: 18 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2483,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2474,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2462,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2460,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "مصرف‌کننده نهایی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2491,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxDEV(
                  SearchableSelect,
                  {
                    wrapperClassName: "flex-1 min-w-0",
                    value: endUser,
                    onChange: (val) => setEndUser(val),
                    options: [
                      { value: "", label: "-- انتخاب مصرف‌کننده (مشتری) --" },
                      ...customers.map((c) => ({ value: c.id, label: c.companyName }))
                    ],
                    placeholder: "-- انتخاب مصرف‌کننده (مشتری) --"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2493,
                    columnNumber: 21
                  },
                  this
                ),
                addCustomer && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setQuickAddCustomerTarget("endUser");
                      setQuickAddType("customer");
                    },
                    className: "px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center",
                    title: "تعریف سریع مشتری جدید",
                    children: /* @__PURE__ */ jsxDEV(Plus, { size: 18 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2512,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2503,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2492,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2490,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "کارشناس فروش" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2520,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: salesExpert,
                  onChange: (e) => setSalesExpert(e.target.value),
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب کارشناس فروش --" }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2526,
                      columnNumber: 23
                    }, this),
                    users.map((u) => /* @__PURE__ */ jsxDEV("option", { value: u.fullName, children: u.fullName }, u.id, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2528,
                      columnNumber: 25
                    }, this))
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2521,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2519,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "شماره استعلام مشتری" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2535,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: customerInquiryNumber,
                  onChange: (e) => setCustomerInquiryNumber(e.target.value),
                  placeholder: "مثال: ۱۲۴-۹۹-الف",
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-left font-mono"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2536,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2534,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2445,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2443,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-indigo-500 pr-2", children: "کانال بازاریابی و کیفیت سرنخ (لید)" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2549,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "کانال بازاریابی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2553,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: marketingChannel,
                  onChange: (e) => setMarketingChannel(e.target.value),
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                  children: (settings.dropdownItems?.marketingChannels || ["تماس مستقیم", "نمایشگاه تجاری", "وب‌سایت / آنلاین", "معرفی", "مناقصه رسمی", "سایر"]).map((ch, idx) => /* @__PURE__ */ jsxDEV("option", { value: ch, children: ch }, idx, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2560,
                    columnNumber: 25
                  }, this))
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2554,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2552,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "کیفیت لید" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2567,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: leadQuality,
                  onChange: (e) => setLeadQuality(e.target.value),
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                  children: (settings.dropdownItems?.leadQualities || ["عالی (گرم)", "متوسط", "ضعیف (سرد)"]).map((q, idx) => /* @__PURE__ */ jsxDEV("option", { value: q, children: q }, idx, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2574,
                    columnNumber: 25
                  }, this))
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2568,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2566,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "نام معرف (در صورت وجود)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2581,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: referrerName,
                  onChange: (e) => setReferrerName(e.target.value),
                  placeholder: "نام شخص یا سازمان معرفی‌کننده",
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2582,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2580,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "روش ارتباط اصلی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2593,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: communicationMethod,
                  onChange: (e) => setCommunicationMethod(e.target.value),
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                  children: (settings.dropdownItems?.communicationMethods || ["تلفن", "ایمیل", "جلسه حضوری", "مکاتبه رسمی", "شبکه‌های اجتماعی"]).map((m, idx) => /* @__PURE__ */ jsxDEV("option", { value: m, children: m }, idx, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2600,
                    columnNumber: 25
                  }, this))
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2594,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2592,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2550,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2548,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-amber-500 pr-2", children: "افراد کلیدی مشتری" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2609,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "فرد کلیدی مالی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2613,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: financialContact,
                    onChange: (e) => setFinancialContact(e.target.value),
                    className: "flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب فرد مالی (مشتری) --" }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2620,
                        columnNumber: 25
                      }, this),
                      (() => {
                        const selectedCustObj = customers.find((c) => c.id === customerId);
                        let filtered = customers.filter((c) => c.customerType === "حقیقی");
                        if (selectedCustObj) {
                          if (selectedCustObj.customerType === "حقوقی") {
                            filtered = filtered.filter((c) => selectedCustObj.linkedCustomerIds?.includes(c.id));
                          } else {
                            filtered = filtered.filter((c) => c.id === selectedCustObj.id || selectedCustObj.linkedCustomerIds?.includes(c.id));
                          }
                        }
                        return filtered.map((c) => {
                          const name2 = `${c.firstName || ""} ${c.lastName || ""}`.trim();
                          return /* @__PURE__ */ jsxDEV("option", { value: c.id, children: name2 }, c.id, false, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 2634,
                            columnNumber: 31
                          }, this);
                        });
                      })()
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2615,
                    columnNumber: 23
                  },
                  this
                ),
                addCustomer && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setQuickAddCustomerTarget("financialContact");
                      setQuickAddType("customer");
                    },
                    className: "px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center",
                    title: "تعریف سریع مشتری جدید",
                    children: /* @__PURE__ */ jsxDEV(Plus, { size: 18 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2649,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2640,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2614,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2612,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "فرد کلیدی فنی" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2657,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: technicalContact,
                    onChange: (e) => setTechnicalContact(e.target.value),
                    className: "flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب فرد فنی (مشتری) --" }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2664,
                        columnNumber: 25
                      }, this),
                      (() => {
                        const selectedCustObj = customers.find((c) => c.id === customerId);
                        let filtered = customers.filter((c) => c.customerType === "حقیقی");
                        if (selectedCustObj) {
                          if (selectedCustObj.customerType === "حقوقی") {
                            filtered = filtered.filter((c) => selectedCustObj.linkedCustomerIds?.includes(c.id));
                          } else {
                            filtered = filtered.filter((c) => c.id === selectedCustObj.id || selectedCustObj.linkedCustomerIds?.includes(c.id));
                          }
                        }
                        return filtered.map((c) => {
                          const name2 = `${c.firstName || ""} ${c.lastName || ""}`.trim();
                          return /* @__PURE__ */ jsxDEV("option", { value: c.id, children: name2 }, c.id, false, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 2678,
                            columnNumber: 31
                          }, this);
                        });
                      })()
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2659,
                    columnNumber: 23
                  },
                  this
                ),
                addCustomer && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setQuickAddCustomerTarget("technicalContact");
                      setQuickAddType("customer");
                    },
                    className: "px-2.5 py-2 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition shrink-0 flex items-center justify-center",
                    title: "تعریف سریع مشتری جدید",
                    children: /* @__PURE__ */ jsxDEV(Plus, { size: 18 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2693,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2684,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2658,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2656,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2610,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2608,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-teal-500 pr-2", children: "زمان‌بندی عمومی پروژه" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2703,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxDEV(
            ShamsiDatePicker,
            {
              label: "تاریخ ایجاد فرصت (ثبت در CRM) *",
              required: true,
              value: opportunityDate,
              onChange: (val) => setOpportunityDate(val)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2707,
              columnNumber: 21
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2706,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2704,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2702,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-700 mb-3 border-r-4 border-rose-500 pr-2", children: "نتیجه پروژه و وضعیت ابلاغ قرارداد (خودکار / دستی)" }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2722,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "نتیجه پروژه (مرحله پیشرفت فرصت)" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2726,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: status,
                  onChange: (e) => handleStatusChange(e.target.value),
                  className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white",
                  children: (settings.dropdownItems?.projectStatuses || ["جدید", "در حال مذاکره", "ارائه پیش‌فاکتور", "برنده (موفق)", "نیمه برنده", "باخته", "لغو شده"]).map((st, idx) => /* @__PURE__ */ jsxDEV("option", { value: st, children: st }, idx, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2733,
                    columnNumber: 25
                  }, this))
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2727,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2725,
              columnNumber: 19
            }, this),
            status === "باخته" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-rose-500", children: "دلیل باخت پروژه *" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2741,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: lossReason,
                  onChange: (e) => setLossReason(e.target.value),
                  required: true,
                  className: "w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-right bg-white",
                  children: [
                    /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب دلیل باخت --" }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2748,
                      columnNumber: 25
                    }, this),
                    settings.lossReasons?.map((reason, i) => /* @__PURE__ */ jsxDEV("option", { value: reason, children: reason }, i, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2750,
                      columnNumber: 27
                    }, this))
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2742,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2740,
              columnNumber: 21
            }, this),
            (status === "برنده (موفق)" || status === "نیمه برنده") && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxDEV(
              ShamsiDatePicker,
              {
                label: "تاریخ تایید (ابلاغ قرارداد) *",
                required: true,
                value: winningDate,
                onChange: (val) => setWinningDate(val)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2759,
                columnNumber: 23
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2758,
              columnNumber: 21
            }, this),
            (status === "برنده (موفق)" || status === "نیمه برنده") && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxDEV(
              ShamsiDatePicker,
              {
                label: "تاریخ توافق‌شده تحویل نهایی *",
                required: true,
                value: agreedDeliveryDate,
                onChange: (val) => setAgreedDeliveryDate(val)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2771,
                columnNumber: 23
              },
              this
            ) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2770,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2723,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2721,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "md:col-span-2 space-y-3 pt-3 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-slate-700", children: "محصولات یا اقلام درخواستی کارفرما / مشتری" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2788,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 items-center", children: [
                addProduct && /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setQuickAddProductIndex(null);
                      setQuickAddType("product");
                    },
                    className: "px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded text-xs font-bold flex items-center gap-1.5 transition",
                    children: [
                      /* @__PURE__ */ jsxDEV(Plus, { size: 12 }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2799,
                        columnNumber: 27
                      }, this),
                      "تعریف سریع کالا"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2791,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddItemLine,
                    className: "px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-xs font-bold flex items-center gap-1.5 transition",
                    children: [
                      /* @__PURE__ */ jsxDEV(Plus, { size: 12 }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2808,
                        columnNumber: 25
                      }, this),
                      "افزودن ردیف محصول"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2803,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2789,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2787,
              columnNumber: 19
            }, this),
            itemsNeeded.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: itemsNeeded.map((item, index) => {
              const isGeneric = item.productId === "generic";
              return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2.5 bg-slate-50/50 p-3 rounded-xl border border-slate-200/80 relative", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pb-2 border-b border-slate-200/50", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-extrabold text-slate-500", children: [
                    "ردیف ",
                    index + 1
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2822,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex bg-slate-150 p-0.5 rounded-lg border border-slate-200", children: [
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          handleItemProductChange(index, "generic");
                        },
                        className: `px-2 py-0.5 text-[10px] font-bold rounded-md transition ${isGeneric ? "bg-white text-sky-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
                        children: "مشخصات کلی (بدون مدل)"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2825,
                        columnNumber: 33
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const firstProd = products[0];
                          if (firstProd) {
                            handleItemProductChange(index, firstProd.id);
                          }
                        },
                        className: `px-2 py-0.5 text-[10px] font-bold rounded-md transition ${!isGeneric ? "bg-white text-sky-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
                        children: "کالای مشخص انبار"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2834,
                        columnNumber: 33
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2824,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2821,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-12 gap-2 items-end", children: [
                  isGeneric ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "col-span-3 space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "دسته کالا *" }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2855,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "select",
                        {
                          value: item.category || "FLOW",
                          onChange: (e) => handleItemCategoryChange(index, e.target.value),
                          className: "w-full border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white text-right outline-none focus:ring-1 focus:ring-sky-500 font-bold text-slate-700",
                          children: [
                            /* @__PURE__ */ jsxDEV("option", { value: "FLOW", children: "فلو (جریان)" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2861,
                              columnNumber: 39
                            }, this),
                            /* @__PURE__ */ jsxDEV("option", { value: "TEMPERATURE", children: "دما" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2862,
                              columnNumber: 39
                            }, this),
                            /* @__PURE__ */ jsxDEV("option", { value: "PRESSURE", children: "فشار" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2863,
                              columnNumber: 39
                            }, this),
                            /* @__PURE__ */ jsxDEV("option", { value: "LEVEL", children: "سطح (لول)" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2864,
                              columnNumber: 39
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 2856,
                          columnNumber: 37
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2854,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "col-span-5 space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "نوع تجهیز *" }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2870,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "select",
                        {
                          value: item.equipmentType || "",
                          onChange: (e) => handleItemEquipmentTypeChange(index, e.target.value),
                          className: "w-full border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white text-right outline-none focus:ring-1 focus:ring-sky-500 font-bold text-slate-700",
                          required: true,
                          children: [
                            /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب تجهیز --" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2877,
                              columnNumber: 39
                            }, this),
                            (settings?.dropdownItems?.equipmentTypes || [
                              "فلومتر کوریولیس",
                              "فلومتر التراسونیک",
                              "فلومتر الکترومغناطیسی",
                              "فلومتر توربینی",
                              "ترانسمیتر فشار",
                              "ترانسمیتر اختلاف فشار",
                              "ترانسمیتر دما",
                              "ترانسمیتر سطح (راداری)",
                              "ترانسمیتر سطح (التراسونیک)",
                              "سوئیچ سطح",
                              "گیج فشار",
                              "گیج دما",
                              "شیر کنترل (کنترل ولو)",
                              "شیر اطمینان (سیفتی ولو)"
                            ]).map((eq, eqIdx) => /* @__PURE__ */ jsxDEV("option", { value: eq, children: eq }, eqIdx, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 2894,
                              columnNumber: 41
                            }, this))
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 2871,
                          columnNumber: 37
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2869,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "col-span-2 space-y-1", children: [
                      /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "سایز (در صورت وجود)" }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2901,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "input",
                        {
                          type: "text",
                          value: item.size || "",
                          onChange: (e) => handleItemSizeChange(index, e.target.value),
                          placeholder: "مثال: 2 اینچ",
                          className: "w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-right outline-none focus:ring-1 focus:ring-sky-500 font-mono text-slate-700"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 2902,
                          columnNumber: 37
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2900,
                      columnNumber: 35
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2852,
                    columnNumber: 33
                  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "col-span-10 space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "انتخاب کالا از انبار *" }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2913,
                      columnNumber: 35
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      SearchableSelect,
                      {
                        wrapperClassName: "flex-1 min-w-0",
                        value: item.productId,
                        onChange: (val) => handleItemProductChange(index, val),
                        options: products.map((p) => {
                          const details = [p.size ? `سایز: ${p.size}` : null, p.measurementRange ? `رنج: ${p.measurementRange}` : null].filter(Boolean).join(", ");
                          const detailsText = details ? ` (${details})` : "";
                          const stockText = p.stockLevel !== void 0 && p.stockLevel > 0 ? ` [موجودی: ${p.stockLevel} ${p.unit || "عدد"}]` : "";
                          return {
                            value: p.id,
                            label: `${p.code} - ${p.displayName}${detailsText}${stockText}`
                          };
                        }),
                        placeholder: "-- انتخاب کالا --",
                        className: "text-xs"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2914,
                        columnNumber: 35
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2912,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "col-span-1 space-y-1", children: [
                    /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block text-center", children: "تعداد" }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2934,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        value: item.quantity,
                        onChange: (e) => handleItemQuantityChange(index, Number(e.target.value)),
                        placeholder: "تعداد",
                        className: "w-full border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center font-mono outline-none focus:ring-1 focus:ring-sky-500 text-slate-700"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2935,
                        columnNumber: 33
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2933,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "col-span-1 flex justify-end pb-0.5", children: /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRemoveItemLine(index),
                      className: "p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition",
                      title: "حذف ردیف",
                      children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 2953,
                        columnNumber: 35
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 2947,
                      columnNumber: 33
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 2946,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2850,
                  columnNumber: 29
                }, this)
              ] }, index, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2819,
                columnNumber: 27
              }, this);
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2815,
              columnNumber: 21
            }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[11px] text-center bg-slate-50 py-3 rounded-lg border border-dashed border-slate-200", children: "هیچ ردیف محصولی ثبت نشده است. برای ثبت نیازهای کالا، روی «افزودن ردیف محصول» کلیک کنید." }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2962,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2786,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 md:col-span-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "مشخصات مهندسی مورد نیاز، بازه دما و فشارهای کاربری یا شرح عمومی" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2970,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                rows: 3,
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "شرح اهداف کارفرما، نوع متریال درخواستی...",
                className: "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 2971,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2969,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 md:col-span-2 pt-3 border-t border-slate-100 mt-2", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-slate-500", children: "فایل‌های پیوست (نقشه‌ها، استعلام‌ها و ...)" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2983,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-4 transition text-center cursor-pointer bg-slate-50 relative", children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "file",
                  multiple: true,
                  onChange: async (e) => {
                    const files = e.target.files;
                    if (files) {
                      setIsUploading(true);
                      try {
                        for (const file of Array.from(files)) {
                          const url = await uploadFile(file);
                          setAttachments((prev) => [...prev, { name: file.name, url, size: file.size }]);
                        }
                      } catch (err) {
                        alert(err.message || "خطا در بارگذاری فایل");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  },
                  className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10",
                  disabled: isUploading
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 2985,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "text-slate-500 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-slate-700", children: isUploading ? "در حال بارگذاری..." : "انتخاب یا رها کردن فایل‌ها" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3008,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-400", children: "PDF, Excel, Word, Images - ذخیره‌سازی ابری" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3011,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3007,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 2984,
              columnNumber: 19
            }, this),
            attachments.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3", children: attachments.map((file, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col overflow-hidden max-w-[85%]", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "truncate font-semibold text-slate-700", title: file.name, children: file.name }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3020,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: [
                  (file.size / 1024).toFixed(1),
                  " KB"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3021,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3019,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV("a", { href: file.url, target: "_blank", rel: "noreferrer", className: "text-sky-600 hover:text-sky-800", title: "مشاهده", children: "مشاهده" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3024,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAttachments((prev) => prev.filter((_, i) => i !== idx)),
                    className: "text-red-500 hover:text-red-700 transition",
                    title: "حذف فایل",
                    children: /* @__PURE__ */ jsxDEV(X, { size: 14 }, void 0, false, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 3033,
                      columnNumber: 31
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3027,
                    columnNumber: 29
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3023,
                columnNumber: 27
              }, this)
            ] }, idx, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3018,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3016,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 2982,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "col-span-1 md:col-span-2", children: /* @__PURE__ */ jsxDEV(
            CustomFieldsForm,
            {
              module: "projects",
              customFields: settings?.customFields || [],
              customValues,
              onChange: setCustomValues
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3044,
              columnNumber: 19
            },
            this
          ) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3043,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 2784,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowModal(false);
                setIsProjectModalFullscreen(false);
              },
              className: "px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition",
              children: "انصراف"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3055,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "submit",
              className: "px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15",
              children: editingProject ? "ثبت تغییرات پروژه" : "ایجاد پروژه"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3062,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3054,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 2440,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 2412,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 2411,
      columnNumber: 9
    }, this),
    selectedProjectForActivities && /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto ${isActivitiesModalFullscreen ? "p-0" : "p-4"}`, dir: "rtl", children: /* @__PURE__ */ jsxDEV("div", { className: `bg-slate-50 w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${isActivitiesModalFullscreen ? "w-screen h-screen rounded-none my-0 max-w-full max-h-screen" : "rounded-2xl w-full max-w-5xl my-8 max-h-[90vh]"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 text-white p-6 flex justify-between items-center text-right", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-sky-500 rounded-lg text-white flex items-center justify-center shadow-lg shadow-sky-500/20", children: /* @__PURE__ */ jsxDEV(Briefcase, { size: 20 }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3088,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3087,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400 font-mono", children: [
              "پروژه: ",
              selectedProjectForActivities.code
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3091,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-bold", children: selectedProjectForActivities.name }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3092,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3090,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3086,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setIsActivitiesModalFullscreen(!isActivitiesModalFullscreen),
              className: "p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white flex items-center justify-center",
              title: isActivitiesModalFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه",
              children: isActivitiesModalFullscreen ? /* @__PURE__ */ jsxDEV(Minimize2, { size: 20 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3102,
                columnNumber: 50
              }, this) : /* @__PURE__ */ jsxDEV(Maximize2, { size: 20 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3102,
                columnNumber: 76
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3096,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => {
                setSelectedProjectForActivities(null);
                setIsActivitiesModalFullscreen(false);
              },
              className: "p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white flex items-center justify-center",
              children: /* @__PURE__ */ jsxDEV(X, { size: 20 }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3109,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3104,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3095,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3085,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-6 space-y-6 text-right", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "کارفرما/مشتری: " }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3120,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700", children: selectedProjectForActivities.customerName }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3121,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3119,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "کارشناس فروش مسئول: " }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3124,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700", children: selectedProjectForActivities.salesExpert || "مشخص نشده" }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3125,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3123,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400 font-bold", children: "وضعیت فرصت: " }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3128,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: `px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusColor(selectedProjectForActivities.status)}`, children: selectedProjectForActivities.status }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3129,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3127,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3118,
          columnNumber: 15
        }, this),
        (() => {
          const details = getProjectDeliveryDetails(selectedProjectForActivities.id);
          const hasAgreed = details.agreedItems.length > 0;
          const hasActual = details.actualItems.length > 0 || getActualDeliveryDate(selectedProjectForActivities.id);
          if (!hasAgreed && !hasActual) return null;
          return /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-sky-800 flex items-center gap-1.5 border-b border-sky-100 pb-1.5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3147,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "تعهدات زمان تحویل توافقی" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3148,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3146,
                columnNumber: 23
              }, this),
              details.agreedItems.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 max-h-[120px] overflow-y-auto pr-1", children: details.agreedItems.map((item, i) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center gap-2 bg-white p-1.5 rounded border border-slate-100 shadow-sm", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600 font-medium truncate max-w-[200px]", title: item.productName, children: item.productName }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3154,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 font-mono", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: [
                    "(",
                    item.deliveryText,
                    ")"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3156,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-sky-600 font-bold", children: item.calculatedDate }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3157,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3155,
                  columnNumber: 31
                }, this)
              ] }, i, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3153,
                columnNumber: 29
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3151,
                columnNumber: 25
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-slate-400 italic text-[10px] pr-2", children: "تاریخ توافق‌شده ثبت نشده است." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3163,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3145,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-amber-800 flex items-center gap-1.5 border-b border-amber-100 pb-1.5", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3170,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "تاریخ تحویل قطعی (لجستیک)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3171,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3169,
                columnNumber: 23
              }, this),
              details.actualItems.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 max-h-[120px] overflow-y-auto pr-1", children: details.actualItems.map((item, i) => /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center gap-2 bg-white p-1.5 rounded border border-slate-100 shadow-sm", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-slate-600 font-medium truncate max-w-[200px]", title: item.productName, children: item.productName }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3177,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 font-mono", children: [
                  item.boxNumber && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 bg-slate-100 px-1 rounded", children: item.boxNumber }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3179,
                    columnNumber: 52
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-amber-600 font-bold", children: item.actualDate }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3180,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3178,
                  columnNumber: 31
                }, this)
              ] }, i, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3176,
                columnNumber: 29
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3174,
                columnNumber: 25
              }, this) : getActualDeliveryDate(selectedProjectForActivities.id) ? /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm font-mono text-amber-600 font-bold", children: [
                /* @__PURE__ */ jsxDEV("span", { children: "تحویل کلی پروژه:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3187,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: getActualDeliveryDate(selectedProjectForActivities.id) }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3188,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3186,
                columnNumber: 25
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-slate-400 italic text-[10px] pr-2", children: "تحویل کالاها هنوز نهایی یا ثبت نشده است." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3191,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3168,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3143,
            columnNumber: 19
          }, this);
        })(),
        /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-slate-200", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setModalTab("activities"),
              className: `px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${modalTab === "activities" ? "border-sky-500 text-sky-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-800"}`,
              children: [
                /* @__PURE__ */ jsxDEV(History, { size: 15 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3209,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "فعالیت‌ها و شرح اقدامات" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3210,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3200,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setModalTab("documents"),
              className: `px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${modalTab === "documents" ? "border-sky-500 text-sky-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-800"}`,
              children: [
                /* @__PURE__ */ jsxDEV(FolderOpen, { size: 15 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3221,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "پوشه‌بندی و مدیریت مدارک" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3222,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3212,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setModalTab("supply"),
              className: `px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${modalTab === "supply" ? "border-sky-500 text-sky-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-800"}`,
              children: [
                /* @__PURE__ */ jsxDEV(Briefcase, { size: 15 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3233,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "وضعیت تامین کالاها (انبار / سفارش)" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3234,
                  columnNumber: 19
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3224,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3199,
          columnNumber: 15
        }, this),
        modalTab === "activities" ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800", children: [
                /* @__PURE__ */ jsxDEV(Sliders, { size: 16, className: "text-sky-500" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3245,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-xs", children: "فعال‌سازی دسته‌بندی فعالیت جدید" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3246,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3244,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px] leading-relaxed", children: "برای ثبت فعالیت، ابتدا باید یکی از دسته‌بندی‌های مشخص‌شده در تنظیمات را برای این پروژه فعال کنید. طبق تعهد، تکرار دسته‌بندی مجاز نیست." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3249,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[11px] font-semibold text-slate-500 block", children: "انتخاب دسته‌بندی فعالیت *" }, void 0, false, {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3255,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "select",
                    {
                      value: selectedCategoryToCreate,
                      onChange: (e) => setSelectedCategoryToCreate(e.target.value),
                      className: "w-full border border-slate-200 rounded-lg py-2 px-3 text-xs outline-none bg-white focus:ring-2 focus:ring-sky-500/20 text-right",
                      children: [
                        /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب دسته‌بندی --" }, void 0, false, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3261,
                          columnNumber: 27
                        }, this),
                        (settings.activityCategories || []).map((cat) => {
                          const alreadyExists = (projectCategoryGroups || []).some(
                            (g) => g.projectId === selectedProjectForActivities.id && g.categoryId === cat.id
                          );
                          return /* @__PURE__ */ jsxDEV(
                            "option",
                            {
                              value: cat.id,
                              disabled: alreadyExists,
                              children: [
                                cat.name,
                                " ",
                                alreadyExists ? "(قبلاً ایجاد شده)" : ""
                              ]
                            },
                            cat.id,
                            true,
                            {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3267,
                              columnNumber: 31
                            },
                            this
                          );
                        })
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 3256,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3254,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (!selectedCategoryToCreate) {
                        alert("لطفاً ابتدا یک دسته‌بندی انتخاب کنید.");
                        return;
                      }
                      const cat = (settings.activityCategories || []).find((c) => c.id === selectedCategoryToCreate);
                      if (!cat) return;
                      if (addProjectCategoryGroup) {
                        const res = addProjectCategoryGroup(selectedProjectForActivities.id, cat.id, cat.name);
                        if (!res.success) {
                          alert(res.error);
                        } else {
                          alert(`دسته‌بندی «${cat.name}» با موفقیت برای این پروژه فعال شد.`);
                          setSelectedCategoryToCreate("");
                        }
                      }
                    },
                    className: "w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10",
                    children: [
                      /* @__PURE__ */ jsxDEV(Plus, { size: 14 }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3301,
                        columnNumber: 25
                      }, this),
                      "راه‌اندازی دسته‌بندی در پروژه"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3279,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3253,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3243,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-sky-50 border border-sky-100 p-4 rounded-xl text-[10px] text-sky-800 leading-relaxed space-y-1 text-right", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "font-bold flex items-center gap-1", children: [
                /* @__PURE__ */ jsxDEV(AlertCircle, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3310,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "قوانین ثبت فعالیت‌ها:" }, void 0, false, {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3311,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3309,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: "• ثبت فعالیت حتماً باید ذیل یک دسته‌بندی مشخص باشد." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3313,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: "• در صورت اتمام کار در یک دسته‌بندی، دکمه اتمام کار را بزنید." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3314,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: "• پس از بسته‌شدن دسته‌بندی، در صورت لزوم می‌توانید مجدداً آن را به جریان بیندازید." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3315,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: "• هر فعالیت می‌تواند به عنوان ارجاع کار برای یکی از همکاران صادر شود." }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3316,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3308,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3242,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2 space-y-6", children: !projectCategoryGroups || projectCategoryGroups.filter((g) => g.projectId === selectedProjectForActivities.id).length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-12 text-center rounded-xl border border-slate-100 shadow-sm space-y-3", children: [
            /* @__PURE__ */ jsxDEV(History, { className: "mx-auto text-slate-300", size: 36 }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3326,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-xs font-semibold", children: "هیچ دسته‌بندی فعالیتی هنوز برای این پروژه راه‌اندازی نشده است." }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3327,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-slate-400", children: "لطفاً از پنل سمت راست، اولین دسته‌بندی فعالیت را فعال کنید." }, void 0, false, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3328,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3325,
            columnNumber: 21
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-150", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-bold text-slate-500", children: "مدیریت نمایش دسته‌بندی‌ها:" }, void 0, false, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3334,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const projectGroups = projectCategoryGroups.filter((g) => g.projectId === selectedProjectForActivities.id);
                      const newExpanded = {};
                      projectGroups.forEach((g) => {
                        newExpanded[g.id] = true;
                      });
                      setExpandedGroups(newExpanded);
                    },
                    className: "px-2.5 py-1 text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-sky-600 rounded font-bold transition shadow-sm",
                    children: "باز کردن همه"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3336,
                    columnNumber: 27
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => setExpandedGroups({}),
                    className: "px-2.5 py-1 text-[10px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-bold transition shadow-sm",
                    children: "جمع کردن همه"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                    lineNumber: 3350,
                    columnNumber: 27
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/ProjectsView.tsx",
                lineNumber: 3335,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/ProjectsView.tsx",
              lineNumber: 3333,
              columnNumber: 23
            }, this),
            (projectCategoryGroups || []).filter((g) => g.projectId === selectedProjectForActivities.id).map((group) => {
              const isGroupClosed = group.status === "اتمام کار";
              const isExpanded = !!expandedGroups[group.id];
              const cat = settings.activityCategories?.find((c) => c.id === group.categoryId);
              const canManageCompletion = !cat?.responsibleUserId || cat.responsibleUserId === currentUser?.fullName || currentUser?.role === "admin" || currentUser?.isSystemAdmin;
              return /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: `bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${isGroupClosed ? "opacity-85 border-slate-200 bg-slate-50/20" : "ring-2 ring-sky-500/10"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        onClick: () => {
                          setExpandedGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }));
                        },
                        className: "bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex justify-between items-center gap-2 flex-wrap cursor-pointer hover:bg-slate-100/70 transition",
                        children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                            isExpanded ? /* @__PURE__ */ jsxDEV(ChevronUp, { size: 16, className: "text-slate-500 transition-transform duration-200" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3384,
                              columnNumber: 37
                            }, this) : /* @__PURE__ */ jsxDEV(ChevronDown, { size: 16, className: "text-slate-500 transition-transform duration-200" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3386,
                              columnNumber: 37
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "bg-sky-100 text-sky-950 text-xs font-bold px-2.5 py-1 rounded-md border border-sky-200", children: group.categoryName }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3388,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-bold px-1.5 py-0.5 rounded ${isGroupClosed ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-800 animate-pulse"}`, children: group.status }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3391,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: [
                              "(",
                              (group.activities || []).length,
                              " فعالیت)"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3396,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3382,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", onClick: (e) => e.stopPropagation(), children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "text-[9px] text-slate-400 font-mono flex flex-col text-left", children: [
                              /* @__PURE__ */ jsxDEV("span", { children: [
                                "شروع: ",
                                group.startDate
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3403,
                                columnNumber: 37
                              }, this),
                              group.endDate && /* @__PURE__ */ jsxDEV("span", { className: "text-rose-500 font-bold", children: [
                                "پایان: ",
                                group.endDate
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3404,
                                columnNumber: 55
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3402,
                              columnNumber: 35
                            }, this),
                            !group.categoryId.startsWith("cat-fact-") && /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  setGroupToDelete(group.id);
                                },
                                className: "px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition border border-rose-100 flex items-center gap-1 shadow-sm ml-1",
                                title: "حذف دسته",
                                children: /* @__PURE__ */ jsxDEV(Trash2, { size: 11 }, void 0, false, {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3418,
                                  columnNumber: 39
                                }, this)
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3409,
                                columnNumber: 37
                              },
                              this
                            ),
                            canManageCompletion && (isGroupClosed ? /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  if (resumeProjectCategoryGroup) resumeProjectCategoryGroup(group.id, currentUser?.fullName || "کاربر سیستم");
                                },
                                className: "px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[10px] font-bold transition border border-sky-150 flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDEV(History, { size: 11 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3432,
                                    columnNumber: 39
                                  }, this),
                                  "به جریان انداختن مجدد"
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3424,
                                columnNumber: 37
                              },
                              this
                            ) : /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  if (completeProjectCategoryGroup) completeProjectCategoryGroup(group.id, currentUser?.fullName || "کاربر سیستم");
                                },
                                className: "px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition shadow-sm flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDEV(Check, { size: 11 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3444,
                                    columnNumber: 39
                                  }, this),
                                  "اتمام کار این دسته"
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3436,
                                columnNumber: 37
                              },
                              this
                            ))
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3401,
                            columnNumber: 33
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3376,
                        columnNumber: 31
                      },
                      this
                    ),
                    isExpanded && /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-4 bg-white border-t border-slate-100 animate-fade-in", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: !group.activities || group.activities.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-[10px] text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-100", children: "هنوز هیچ فعالیتی در این دسته ثبت نشده است." }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3456,
                        columnNumber: 37
                      }, this) : (group.activities || []).map((act) => /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 space-y-2.5 text-xs text-right", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-400", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: act.createdAt }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3464,
                              columnNumber: 45
                            }, this),
                            act.createdBy && /* @__PURE__ */ jsxDEV("span", { className: "text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1", children: [
                              /* @__PURE__ */ jsxDEV(User, { size: 10 }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3467,
                                columnNumber: 49
                              }, this),
                              act.createdBy
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3466,
                              columnNumber: 47
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3463,
                            columnNumber: 43
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                            act.attachment && (act.attachment.content ? /* @__PURE__ */ jsxDEV(
                              "a",
                              {
                                href: act.attachment.content,
                                download: act.attachment.name,
                                className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 border border-sky-200 text-sky-800 text-[9px] font-bold transition mr-1",
                                title: "دانلود فایل پیوست",
                                children: [
                                  /* @__PURE__ */ jsxDEV(Paperclip, { size: 10 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3481,
                                    columnNumber: 51
                                  }, this),
                                  act.attachment.name,
                                  " (",
                                  act.attachment.size,
                                  ")"
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3475,
                                columnNumber: 49
                              },
                              this
                            ) : /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[9px] font-bold mr-1", children: [
                              /* @__PURE__ */ jsxDEV(Paperclip, { size: 10 }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3486,
                                columnNumber: 51
                              }, this),
                              act.attachment.name,
                              " (",
                              act.attachment.size,
                              ")"
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3485,
                              columnNumber: 49
                            }, this)),
                            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 bg-slate-100/60 p-0.5 rounded border border-slate-200/40", children: [
                              /* @__PURE__ */ jsxDEV(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    setEditingActivityId(act.id);
                                    setEditingActivityText(act.text);
                                  },
                                  className: "text-slate-400 hover:text-sky-600 transition p-1 hover:bg-white rounded",
                                  title: "ویرایش",
                                  children: /* @__PURE__ */ jsxDEV(Edit, { size: 10 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3503,
                                    columnNumber: 49
                                  }, this)
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3494,
                                  columnNumber: 47
                                },
                                this
                              ),
                              /* @__PURE__ */ jsxDEV(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    setActivityToDeleteGroupId(group.id);
                                    setActivityToDeleteId(act.id);
                                    setActivityDeleteConfirmOpen(true);
                                  },
                                  className: "text-slate-400 hover:text-rose-600 transition p-1 hover:bg-white rounded",
                                  title: "حذف",
                                  children: /* @__PURE__ */ jsxDEV(Trash2, { size: 10 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3515,
                                    columnNumber: 49
                                  }, this)
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3505,
                                  columnNumber: 47
                                },
                                this
                              )
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3493,
                              columnNumber: 45
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3472,
                            columnNumber: 43
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3462,
                          columnNumber: 41
                        }, this),
                        editingActivityId === act.id ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 mt-1", children: [
                          /* @__PURE__ */ jsxDEV(
                            "textarea",
                            {
                              value: editingActivityText,
                              onChange: (e) => setEditingActivityText(e.target.value),
                              className: "w-full text-xs p-2 border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white font-semibold text-slate-800 text-right",
                              rows: 2,
                              dir: "rtl"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3522,
                              columnNumber: 45
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 justify-end", children: [
                            /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  if (editingActivityText.trim() && selectedProjectForActivities) {
                                    updateProjectActivity?.(selectedProjectForActivities.id, group.id, act.id, editingActivityText.trim());
                                    setEditingActivityId(null);
                                    setEditingActivityText("");
                                  }
                                },
                                className: "px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-[10px] flex items-center gap-1 transition",
                                children: [
                                  /* @__PURE__ */ jsxDEV(Check, { size: 10 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3541,
                                    columnNumber: 49
                                  }, this),
                                  "ذخیره"
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3530,
                                columnNumber: 47
                              },
                              this
                            ),
                            /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setEditingActivityId(null);
                                  setEditingActivityText("");
                                },
                                className: "px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[10px] flex items-center gap-1 transition",
                                children: [
                                  /* @__PURE__ */ jsxDEV(X, { size: 10 }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3552,
                                    columnNumber: 49
                                  }, this),
                                  "انصراف"
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3544,
                                columnNumber: 47
                              },
                              this
                            )
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3529,
                            columnNumber: 45
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3521,
                          columnNumber: 43
                        }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 leading-relaxed font-semibold", children: act.text }, void 0, false, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3558,
                          columnNumber: 43
                        }, this),
                        act.referral && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 bg-white rounded-lg p-3 border border-slate-150 space-y-2 text-right", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[9px] border-b border-slate-100 pb-1.5", children: [
                            /* @__PURE__ */ jsxDEV("span", { className: "text-sky-700 font-bold", children: "ارجاع کار برای اقدام:" }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3565,
                              columnNumber: 47
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: `px-1.5 py-0.5 rounded text-[8px] font-bold ${act.referral.status === "در انتظار اقدام" ? "bg-sky-50 text-sky-700 border border-sky-100 animate-pulse" : "bg-emerald-50 text-emerald-800"}`, children: act.referral.status }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3566,
                              columnNumber: 47
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3564,
                            columnNumber: 45
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-500", children: [
                            "ارجاع‌دهنده: ",
                            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700", children: act.referral.assignedBy }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3573,
                              columnNumber: 60
                            }, this),
                            " ",
                            " | ارجاع‌شونده: ",
                            /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-700", children: act.referral.assignedTo }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3574,
                              columnNumber: 68
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3572,
                            columnNumber: 45
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "bg-sky-50/40 p-2.5 rounded text-[11px] text-slate-600 font-extrabold border-r-2 border-sky-500 leading-relaxed", children: act.referral.actionRequired }, void 0, false, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3576,
                            columnNumber: 45
                          }, this),
                          (act.referral.messages?.length ? act.referral.messages : act.referral.response ? [act.referral.response] : []).map((msg, msgIdx) => /* @__PURE__ */ jsxDEV("div", { className: "mt-2 pt-2 border-t border-slate-100 bg-emerald-50/20 p-2 rounded-md border border-emerald-100 space-y-1 text-right", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[8px] text-emerald-800 font-bold", children: [
                              /* @__PURE__ */ jsxDEV("span", { children: "پاسخ اقدام:" }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3584,
                                columnNumber: 51
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: msg.createdAt }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3585,
                                columnNumber: 51
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3583,
                              columnNumber: 49
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] text-slate-800 font-semibold leading-relaxed bg-white/70 p-2 rounded border border-emerald-100", children: msg.text }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3587,
                              columnNumber: 49
                            }, this),
                            msg.attachment && /* @__PURE__ */ jsxDEV("div", { className: "pt-1", children: msg.attachment.content ? /* @__PURE__ */ jsxDEV(
                              "a",
                              {
                                href: msg.attachment.content,
                                download: msg.attachment.name,
                                className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-bold mt-1 transition",
                                title: "دانلود فایل پیوست اقدام",
                                children: [
                                  /* @__PURE__ */ jsxDEV(Paperclip, { size: 11, className: "text-emerald-600" }, void 0, false, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3601,
                                    columnNumber: 57
                                  }, this),
                                  /* @__PURE__ */ jsxDEV("span", { children: [
                                    "فایل پیوست پاسخ: ",
                                    msg.attachment.name
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3602,
                                    columnNumber: 57
                                  }, this),
                                  /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-500", children: [
                                    "(",
                                    msg.attachment.size,
                                    ")"
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3603,
                                    columnNumber: 57
                                  }, this)
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3595,
                                columnNumber: 55
                              },
                              this
                            ) : /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold mt-1", children: [
                              /* @__PURE__ */ jsxDEV(Paperclip, { size: 11 }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3607,
                                columnNumber: 57
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { children: [
                                "فایل پیوست پاسخ: ",
                                msg.attachment.name
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3608,
                                columnNumber: 57
                              }, this),
                              /* @__PURE__ */ jsxDEV("span", { className: "text-emerald-500", children: [
                                "(",
                                msg.attachment.size,
                                ")"
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3609,
                                columnNumber: 57
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3606,
                              columnNumber: 55
                            }, this) }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3593,
                              columnNumber: 51
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "text-[8px] text-slate-400", children: [
                              "ارسال‌کننده: ",
                              msg.responder
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3615,
                              columnNumber: 49
                            }, this)
                          ] }, msgIdx, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3582,
                            columnNumber: 47
                          }, this))
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3563,
                          columnNumber: 43
                        }, this)
                      ] }, act.id, true, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3461,
                        columnNumber: 39
                      }, this)) }, void 0, false, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3454,
                        columnNumber: 33
                      }, this),
                      !isGroupClosed && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-100 space-y-3", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] font-bold text-slate-600 block", children: "ثبت فعالیت جدید در این دسته‌بندی:" }, void 0, false, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3630,
                          columnNumber: 37
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100", children: [
                          /* @__PURE__ */ jsxDEV(
                            "textarea",
                            {
                              rows: 2,
                              value: newActivityText[group.id] || "",
                              onChange: (e) => {
                                const val = e.target.value;
                                setNewActivityText((prev) => ({ ...prev, [group.id]: val }));
                              },
                              placeholder: "شرح جزئیات فعالیت انجام شده، مکالمات فنی یا مذاکرات با مشتری...",
                              className: "w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-sky-500/20 outline-none text-right placeholder-slate-400 bg-white"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3633,
                              columnNumber: 39
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px]", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsxDEV("label", { className: "cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition font-bold text-slate-600 flex items-center gap-1", children: [
                                /* @__PURE__ */ jsxDEV(Paperclip, { size: 12, className: "text-slate-400" }, void 0, false, {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3648,
                                  columnNumber: 45
                                }, this),
                                /* @__PURE__ */ jsxDEV("span", { children: "پیوست فایل (تصویر یا سند)" }, void 0, false, {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3649,
                                  columnNumber: 45
                                }, this),
                                /* @__PURE__ */ jsxDEV(
                                  "input",
                                  {
                                    type: "file",
                                    className: "hidden",
                                    onChange: (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 2 * 1024 * 1024 && !file.type.startsWith("image/")) {
                                          alert("حداکثر حجم مجاز برای فایل‌های غیرتصویری ۲ مگابایت می‌باشد.");
                                          return;
                                        }
                                        compressImage(file, (dataUrl, sizeStr) => {
                                          setNewActivityAttachment((prev) => ({
                                            ...prev,
                                            [group.id]: {
                                              name: file.name,
                                              size: sizeStr,
                                              content: dataUrl
                                            }
                                          }));
                                        });
                                      }
                                    }
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3650,
                                    columnNumber: 45
                                  },
                                  this
                                )
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3647,
                                columnNumber: 43
                              }, this),
                              newActivityAttachment[group.id] && /* @__PURE__ */ jsxDEV("span", { className: "text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded flex items-center gap-1 border border-sky-100", children: [
                                newActivityAttachment[group.id]?.name,
                                /* @__PURE__ */ jsxDEV(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setNewActivityAttachment((prev) => ({ ...prev, [group.id]: null })),
                                    className: "text-rose-500 hover:text-rose-700 font-bold text-xs",
                                    children: "×"
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/ProjectsView.tsx",
                                    lineNumber: 3678,
                                    columnNumber: 47
                                  },
                                  this
                                )
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3676,
                                columnNumber: 45
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3646,
                              columnNumber: 41
                            }, this),
                            /* @__PURE__ */ jsxDEV("label", { className: "flex items-center gap-1.5 cursor-pointer font-bold text-slate-600", children: [
                              /* @__PURE__ */ jsxDEV(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: referralEnabled[group.id] || false,
                                  onChange: (e) => {
                                    const checked = e.target.checked;
                                    setReferralEnabled((prev) => ({ ...prev, [group.id]: checked }));
                                  },
                                  className: "rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3691,
                                  columnNumber: 43
                                },
                                this
                              ),
                              /* @__PURE__ */ jsxDEV("span", { children: "نیاز به اقدام و ارجاع به همکار؟" }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3700,
                                columnNumber: 43
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3690,
                              columnNumber: 41
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3645,
                            columnNumber: 39
                          }, this),
                          referralEnabled[group.id] && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-white rounded-lg border border-slate-200 space-y-3 text-xs animate-fade-in text-right", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "ارجاع به همکار *" }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3709,
                                columnNumber: 47
                              }, this),
                              /* @__PURE__ */ jsxDEV(
                                "select",
                                {
                                  value: referralAssignedTo[group.id] || "",
                                  onChange: (e) => {
                                    const val = e.target.value;
                                    setReferralAssignedTo((prev) => ({ ...prev, [group.id]: val }));
                                  },
                                  className: "w-full border border-slate-200 rounded p-1.5 text-xs bg-white text-right",
                                  children: [
                                    /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب همکار --" }, void 0, false, {
                                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                                      lineNumber: 3718,
                                      columnNumber: 49
                                    }, this),
                                    (users || []).map((u) => /* @__PURE__ */ jsxDEV("option", { value: u.fullName, children: u.fullName }, u.id, false, {
                                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                                      lineNumber: 3720,
                                      columnNumber: 51
                                    }, this))
                                  ]
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3710,
                                  columnNumber: 47
                                },
                                this
                              )
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3708,
                              columnNumber: 45
                            }, this) }, void 0, false, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3707,
                              columnNumber: 43
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "اقدام خواسته‌شده مشخص *" }, void 0, false, {
                                fileName: "/app/applet/src/components/ProjectsView.tsx",
                                lineNumber: 3729,
                                columnNumber: 45
                              }, this),
                              /* @__PURE__ */ jsxDEV(
                                "textarea",
                                {
                                  rows: 2,
                                  value: referralAction[group.id] || "",
                                  onChange: (e) => {
                                    const val = e.target.value;
                                    setReferralAction((prev) => ({ ...prev, [group.id]: val }));
                                  },
                                  placeholder: "مثلاً: بررسی کاتالوگ ابعادی رنج کالا و تایید نهایی به تدارکات",
                                  className: "w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-right bg-white leading-relaxed"
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3730,
                                  columnNumber: 45
                                },
                                this
                              )
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3728,
                              columnNumber: 43
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3706,
                            columnNumber: 41
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxDEV(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                const text = newActivityText[group.id] || "";
                                const attachmentData = newActivityAttachment[group.id] || null;
                                if (!text.trim() && !attachmentData) {
                                  alert("لطفاً ابتدا شرح فعالیت یا پیوست را وارد کنید.");
                                  return;
                                }
                                let referralData = null;
                                if (referralEnabled[group.id]) {
                                  const assignedTo = referralAssignedTo[group.id];
                                  const action = referralAction[group.id];
                                  if (!assignedTo) {
                                    alert("لطفاً همکار ارجاع‌شونده را انتخاب کنید.");
                                    return;
                                  }
                                  if (!action || !action.trim()) {
                                    alert("لطفاً شرح اقدام ارجاع را وارد کنید.");
                                    return;
                                  }
                                  referralData = {
                                    assignedTo,
                                    actionRequired: action.trim(),
                                    assignedBy: currentUser?.fullName || "محمد توکل مقدم"
                                  };
                                }
                                if (addProjectActivity) {
                                  addProjectActivity(
                                    selectedProjectForActivities.id,
                                    group.id,
                                    text.trim(),
                                    attachmentData,
                                    referralData,
                                    currentUser?.fullName || "کاربر سیستم"
                                  );
                                  setNewActivityText((prev) => ({ ...prev, [group.id]: "" }));
                                  setNewActivityAttachment((prev) => ({ ...prev, [group.id]: null }));
                                  setReferralEnabled((prev) => ({ ...prev, [group.id]: false }));
                                  setReferralAssignedTo((prev) => ({ ...prev, [group.id]: "" }));
                                  setReferralAction((prev) => ({ ...prev, [group.id]: "" }));
                                  alert("فعالیت جدید با موفقیت ثبت گردید.");
                                }
                              },
                              className: "px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/15",
                              children: [
                                /* @__PURE__ */ jsxDEV(Send, { size: 11 }, void 0, false, {
                                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                                  lineNumber: 3797,
                                  columnNumber: 43
                                }, this),
                                "ثبت این فعالیت"
                              ]
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/components/ProjectsView.tsx",
                              lineNumber: 3746,
                              columnNumber: 41
                            },
                            this
                          ) }, void 0, false, {
                            fileName: "/app/applet/src/components/ProjectsView.tsx",
                            lineNumber: 3745,
                            columnNumber: 39
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/ProjectsView.tsx",
                          lineNumber: 3632,
                          columnNumber: 37
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/ProjectsView.tsx",
                        lineNumber: 3629,
                        columnNumber: 35
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/ProjectsView.tsx",
                      lineNumber: 3453,
                      columnNumber: 31
                    }, this)
                  ]
                },
                group.id,
                true,
                {
                  fileName: "/app/applet/src/components/ProjectsView.tsx",
                  lineNumber: 3369,
                  columnNumber: 29
                },
                this
              );
            })
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3331,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3321,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3239,
          columnNumber: 17
        }, this) : modalTab === "documents" ? renderProjectDocuments(selectedProjectForActivities) : renderProjectSupplyStatus(selectedProjectForActivities),
        renderDocumentPreviewModal()
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3115,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-100 p-4 border-t border-slate-200 flex justify-end", children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setSelectedProjectForActivities(null),
          className: "px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition",
          children: "بستن پنجره تاریخچه"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3830,
          columnNumber: 15
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3829,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 3078,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 3077,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        isOpen: deleteConfirmOpen,
        onClose: () => {
          setDeleteConfirmOpen(false);
          setProjectToDeleteId(null);
          setProjectToDeleteName("");
        },
        onConfirm: () => {
          if (projectToDeleteId) {
            deleteProject(projectToDeleteId);
          }
        },
        title: "حذف پروژه",
        message: `آیا از حذف پروژه "${projectToDeleteName}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3844,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        isOpen: activityDeleteConfirmOpen,
        onClose: () => {
          setActivityDeleteConfirmOpen(false);
          setActivityToDeleteGroupId(null);
          setActivityToDeleteId(null);
        },
        onConfirm: () => {
          if (selectedProjectForActivities && activityToDeleteGroupId && activityToDeleteId) {
            deleteProjectActivity?.(selectedProjectForActivities.id, activityToDeleteGroupId, activityToDeleteId);
          }
        },
        title: "حذف فعالیت پروژه",
        message: "آیا از حذف این فعالیت اطمینان دارید؟ این عمل غیرقابل بازگشت است."
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3861,
        columnNumber: 7
      },
      this
    ),
    quickAddType && /* @__PURE__ */ jsxDEV(
      QuickAddModal,
      {
        isOpen: !!quickAddType,
        onClose: () => {
          setQuickAddType(null);
          setQuickAddCustomerTarget(null);
          setQuickAddProductIndex(null);
        },
        type: quickAddType,
        settings,
        customers,
        addCustomer,
        products,
        addProduct,
        users,
        initialCustType: quickAddCustomerTarget === "financialContact" || quickAddCustomerTarget === "technicalContact" ? "حقیقی" : void 0,
        initialLinkedCustomerIds: (quickAddCustomerTarget === "financialContact" || quickAddCustomerTarget === "technicalContact") && customerId ? [customerId] : void 0,
        onSuccess: (newEntity) => {
          if (newEntity && newEntity.id) {
            if (quickAddType === "customer") {
              if (quickAddCustomerTarget === "customerId") {
                setCustomerId(newEntity.id);
              } else if (quickAddCustomerTarget === "endUser") {
                setEndUser(newEntity.id);
              } else if (quickAddCustomerTarget === "financialContact") {
                setFinancialContact(newEntity.id);
              } else if (quickAddCustomerTarget === "technicalContact") {
                setTechnicalContact(newEntity.id);
              } else {
                setCustomerId(newEntity.id);
              }
            } else if (quickAddType === "product") {
              if (quickAddProductIndex !== null) {
                handleItemProductChange(quickAddProductIndex, newEntity.id);
              } else {
                setItemsNeeded([...itemsNeeded, { productId: newEntity.id, name: newEntity.displayName || newEntity.name, quantity: 1 }]);
              }
            }
          }
          setQuickAddType(null);
          setQuickAddCustomerTarget(null);
          setQuickAddProductIndex(null);
        }
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3879,
        columnNumber: 9
      },
      this
    ),
    groupToDelete && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm", dir: "rtl", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-scale-in", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-rose-600", children: [
        /* @__PURE__ */ jsxDEV(Trash2, { size: 20 }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3931,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold text-sm", children: "حذف دسته فعالیت" }, void 0, false, {
          fileName: "/app/applet/src/components/ProjectsView.tsx",
          lineNumber: 3932,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3930,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3929,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "p-6 space-y-4", children: /* @__PURE__ */ jsxDEV("p", { className: "text-slate-700 text-sm font-medium leading-relaxed", children: "آیا از حذف این دسته فعالیت و تمام سوابق آن اطمینان دارید؟ این عمل غیرقابل بازگشت است." }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3936,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3935,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setGroupToDelete(null),
            className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition",
            children: "انصراف"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3941,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => {
              if (deleteProjectCategoryGroup && groupToDelete) {
                deleteProjectCategoryGroup(groupToDelete);
              }
              setGroupToDelete(null);
            },
            className: "px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition",
            children: "بله، حذف شود"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ProjectsView.tsx",
            lineNumber: 3948,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/ProjectsView.tsx",
        lineNumber: 3940,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 3928,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/ProjectsView.tsx",
      lineNumber: 3927,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/ProjectsView.tsx",
    lineNumber: 1994,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RzVmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgXG4gIFBsdXMsIFxuICBTZWFyY2gsIFxuICBGaWx0ZXIsIFxuICBCcmllZmNhc2UsIFxuICBFZGl0LCBcbiAgVHJhc2gyLCBcbiAgQ2hlY2tDaXJjbGUsIFxuICBYQ2lyY2xlLCBcbiAgQWxlcnRDaXJjbGUsXG4gIFRyZW5kaW5nVXAsXG4gIFgsXG4gIFRhcmdldCxcbiAgRmlsZVNwcmVhZHNoZWV0LFxuICBDbG9jayxcbiAgU2xpZGVycyxcbiAgVXNlcixcbiAgUGFwZXJjbGlwLFxuICBDaGV2cm9uTGVmdCxcbiAgQ2hldnJvbkRvd24sXG4gIENoZXZyb25VcCxcbiAgU2VuZCxcbiAgQ2hlY2tDaXJjbGUyLFxuICBNZXNzYWdlU3F1YXJlLFxuICBDYWxlbmRhcixcbiAgSGlzdG9yeSxcbiAgQ2hlY2ssXG4gIEZvbGRlcixcbiAgRm9sZGVyT3BlbixcbiAgRmlsZSxcbiAgRG93bmxvYWQsXG4gIEV5ZSxcbiAgVXBsb2FkLFxuICBDaGV2cm9uUmlnaHQsXG4gIExvYWRlcjIsXG4gIEltYWdlIGFzIEltYWdlSWNvbixcbiAgTWF4aW1pemUyLFxuICBNaW5pbWl6ZTJcbn0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IFByb2plY3QsIEN1c3RvbWVyLCBFUlBTZXR0aW5ncywgUHJvZHVjdCwgUHJvZm9ybWEsIFByb2plY3RDYXRlZ29yeUdyb3VwLCBQcm9qZWN0QWN0aXZpdHksIFVzZXIgYXMgRVJQVXNlciwgUGFja2FnaW5nRGVsaXZlcnksIFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0VG9kYXlTaGFtc2ksIGFkZERheXNUb1NoYW1zaSwgYWRkV29ya2luZ0RheXNUb1NoYW1zaSB9IGZyb20gJy4uL2RhdGVVdGlscyc7XG5pbXBvcnQgeyBnZXRQcm9mb3JtYU91dGNvbWVTdGF0dXMgfSBmcm9tICcuLi91c2VFUlBTdG9yZSc7XG5pbXBvcnQgU2hhbXNpRGF0ZVBpY2tlciBmcm9tICcuL1NoYW1zaURhdGVQaWNrZXInO1xuaW1wb3J0IEN1c3RvbUZpZWxkc0Zvcm0gZnJvbSAnLi9DdXN0b21GaWVsZHNGb3JtJztcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tICcuLi9pbWFnZVV0aWxzJztcbmltcG9ydCBDdXN0b21GaWVsZHNEZXRhaWxWaWV3IGZyb20gJy4vQ3VzdG9tRmllbGRzRGV0YWlsVmlldyc7XG5pbXBvcnQgeyBleHBvcnRUb0NTViB9IGZyb20gJy4uL2V4Y2VsVXRpbHMnO1xuaW1wb3J0IENvbmZpcm1Nb2RhbCBmcm9tICcuL0NvbmZpcm1Nb2RhbCc7XG5pbXBvcnQgUXVpY2tBZGRNb2RhbCBmcm9tICcuL1F1aWNrQWRkTW9kYWwnO1xuaW1wb3J0IHsgU2VhcmNoYWJsZVNlbGVjdCB9IGZyb20gJy4vU2VhcmNoYWJsZVNlbGVjdCc7XG5pbXBvcnQgeyBjb21wcmVzc0ltYWdlIH0gZnJvbSAnLi4vaW1hZ2VVdGlscyc7XG5cbmludGVyZmFjZSBQcm9qZWN0c1ZpZXdQcm9wcyB7XG4gIG9uT3BlbkRvY3VtZW50PzogKG1vZHVsZTogc3RyaW5nLCBkb2NJZDogc3RyaW5nKSA9PiB2b2lkO1xuICBwcm9qZWN0czogUHJvamVjdFtdO1xuICBjdXN0b21lcnM6IEN1c3RvbWVyW107XG4gIHByb2R1Y3RzOiBQcm9kdWN0W107XG4gIHByb2Zvcm1hczogUHJvZm9ybWFbXTtcbiAgc3VwcGxpZXJJbnF1aXJpZXM/OiBhbnlbXTtcbiAgcGFja2FnaW5nRGVsaXZlcmllcz86IFBhY2thZ2luZ0RlbGl2ZXJ5W107XG4gIHRyYW5zYWN0aW9ucz86IFRyYW5zYWN0aW9uW107XG4gIHB1cmNoYXNlT3JkZXJzPzogYW55W107XG4gIGFmdGVyU2FsZXNTZXJ2aWNlcz86IGFueVtdO1xuICBhZGRQcm9qZWN0OiAocHJvamVjdDogT21pdDxQcm9qZWN0LCAnaWQnIHwgJ2NvZGUnIHwgJ2NyZWF0aW9uRGF0ZSc+ICYgeyBjdXN0b21WYWx1ZXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pID0+IHZvaWQ7XG4gIHVwZGF0ZVByb2plY3Q6IChwcm9qZWN0OiBQcm9qZWN0KSA9PiB2b2lkO1xuICBkZWxldGVQcm9qZWN0OiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgc2V0dGluZ3M6IEVSUFNldHRpbmdzO1xuICBhZGRDdXN0b21lcj86IChjdXN0b21lcjogT21pdDxDdXN0b21lciwgJ2lkJyB8ICdjcmVhdGVkQXQnPikgPT4gQ3VzdG9tZXI7XG4gIGFkZFByb2R1Y3Q/OiAocHJvZHVjdDogT21pdDxQcm9kdWN0LCAnaWQnIHwgJ3N0b2NrTGV2ZWwnPiAmIHsgc3RvY2tMZXZlbD86IG51bWJlciB9KSA9PiBQcm9kdWN0O1xuICBwcm9qZWN0Q2F0ZWdvcnlHcm91cHM/OiBQcm9qZWN0Q2F0ZWdvcnlHcm91cFtdO1xuICBhZGRQcm9qZWN0Q2F0ZWdvcnlHcm91cD86IChwcm9qZWN0SWQ6IHN0cmluZywgY2F0ZWdvcnlJZDogc3RyaW5nLCBjYXRlZ29yeU5hbWU6IHN0cmluZykgPT4geyBzdWNjZXNzOiBib29sZWFuOyBlcnJvcj86IHN0cmluZzsgZ3JvdXA/OiBQcm9qZWN0Q2F0ZWdvcnlHcm91cCB9O1xuICBhZGRQcm9qZWN0QWN0aXZpdHk/OiAoXG4gICAgcHJvamVjdElkOiBzdHJpbmcsXG4gICAgY2F0ZWdvcnlHcm91cElkOiBzdHJpbmcsXG4gICAgdGV4dDogc3RyaW5nLFxuICAgIGF0dGFjaG1lbnQ6IHsgbmFtZTogc3RyaW5nOyBzaXplOiBzdHJpbmc7IGNvbnRlbnQ/OiBzdHJpbmcgfSB8IG51bGwsXG4gICAgcmVmZXJyYWw6IHsgYXNzaWduZWRUbzogc3RyaW5nOyBhY3Rpb25SZXF1aXJlZDogc3RyaW5nOyBhc3NpZ25lZEJ5OiBzdHJpbmcgfSB8IG51bGwsXG4gICAgY3JlYXRlZEJ5Pzogc3RyaW5nXG4gICkgPT4gYW55O1xuICBjb21wbGV0ZVByb2plY3RDYXRlZ29yeUdyb3VwPzogKGNhdGVnb3J5R3JvdXBJZDogc3RyaW5nLCBjcmVhdGVkQnk/OiBzdHJpbmcpID0+IHZvaWQ7XG4gIHJlc3VtZVByb2plY3RDYXRlZ29yeUdyb3VwPzogKGNhdGVnb3J5R3JvdXBJZDogc3RyaW5nLCBjcmVhdGVkQnk/OiBzdHJpbmcpID0+IHZvaWQ7XG4gIGRlbGV0ZVByb2plY3RDYXRlZ29yeUdyb3VwPzogKGNhdGVnb3J5R3JvdXBJZDogc3RyaW5nKSA9PiB2b2lkO1xuICB1cGRhdGVQcm9qZWN0QWN0aXZpdHk/OiAocHJvamVjdElkOiBzdHJpbmcsIGNhdGVnb3J5R3JvdXBJZDogc3RyaW5nLCBhY3Rpdml0eUlkOiBzdHJpbmcsIG5ld1RleHQ6IHN0cmluZykgPT4gdm9pZDtcbiAgZGVsZXRlUHJvamVjdEFjdGl2aXR5PzogKHByb2plY3RJZDogc3RyaW5nLCBjYXRlZ29yeUdyb3VwSWQ6IHN0cmluZywgYWN0aXZpdHlJZDogc3RyaW5nKSA9PiB2b2lkO1xuICBjdXJyZW50VXNlcj86IEVSUFVzZXIgfCBudWxsO1xuICB1c2Vycz86IEVSUFVzZXJbXTtcbiAgaW5pdGlhbFNlbGVjdGVkUHJvamVjdElkPzogc3RyaW5nIHwgbnVsbDtcbiAgb25DbGVhckluaXRpYWxTZWxlY3RlZFByb2plY3Q/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0c1ZpZXcoe1xuICBvbk9wZW5Eb2N1bWVudCxcbiAgcHJvamVjdHMsXG4gIGN1c3RvbWVycyxcbiAgcHJvZHVjdHMsXG4gIHByb2Zvcm1hcyxcbiAgc3VwcGxpZXJJbnF1aXJpZXMgPSBbXSxcbiAgcGFja2FnaW5nRGVsaXZlcmllcyA9IFtdLFxuICB0cmFuc2FjdGlvbnMgPSBbXSxcbiAgcHVyY2hhc2VPcmRlcnMgPSBbXSxcbiAgYWZ0ZXJTYWxlc1NlcnZpY2VzID0gW10sXG4gIGFkZFByb2plY3QsXG4gIHVwZGF0ZVByb2plY3QsXG4gIGRlbGV0ZVByb2plY3QsXG4gIHNldHRpbmdzLFxuICBhZGRDdXN0b21lcixcbiAgYWRkUHJvZHVjdCxcbiAgcHJvamVjdENhdGVnb3J5R3JvdXBzID0gW10sXG4gIGFkZFByb2plY3RDYXRlZ29yeUdyb3VwLFxuICBhZGRQcm9qZWN0QWN0aXZpdHksXG4gIGNvbXBsZXRlUHJvamVjdENhdGVnb3J5R3JvdXAsXG4gIHJlc3VtZVByb2plY3RDYXRlZ29yeUdyb3VwLFxuICBkZWxldGVQcm9qZWN0Q2F0ZWdvcnlHcm91cCxcbiAgdXBkYXRlUHJvamVjdEFjdGl2aXR5LFxuICBkZWxldGVQcm9qZWN0QWN0aXZpdHksXG4gIGN1cnJlbnRVc2VyLFxuICB1c2VycyA9IFtdLFxuICBpbml0aWFsU2VsZWN0ZWRQcm9qZWN0SWQsXG4gIG9uQ2xlYXJJbml0aWFsU2VsZWN0ZWRQcm9qZWN0XG59OiBQcm9qZWN0c1ZpZXdQcm9wcykge1xuICBjb25zdCBbc2VhcmNoLCBzZXRTZWFyY2hdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbY29sRmlsdGVycywgc2V0Q29sRmlsdGVyc10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih7fSk7XG4gIGNvbnN0IFtjdXN0b21GaWVsZEZpbHRlcnMsIHNldEN1c3RvbUZpZWxkRmlsdGVyc10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih7fSk7XG4gIGNvbnN0IFtzZWxlY3RlZFN0YXR1cywgc2V0U2VsZWN0ZWRTdGF0dXNdID0gdXNlU3RhdGU8c3RyaW5nPignYWxsJyk7XG5cbiAgY29uc3QgW2dyb3VwVG9EZWxldGUsIHNldEdyb3VwVG9EZWxldGVdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtzaG93TW9kYWwsIHNldFNob3dNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1Byb2plY3RNb2RhbEZ1bGxzY3JlZW4sIHNldElzUHJvamVjdE1vZGFsRnVsbHNjcmVlbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtlZGl0aW5nUHJvamVjdCwgc2V0RWRpdGluZ1Byb2plY3RdID0gdXNlU3RhdGU8UHJvamVjdCB8IG51bGw+KG51bGwpO1xuXG4gIGNvbnN0IFtlZGl0aW5nQWN0aXZpdHlJZCwgc2V0RWRpdGluZ0FjdGl2aXR5SWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtlZGl0aW5nQWN0aXZpdHlUZXh0LCBzZXRFZGl0aW5nQWN0aXZpdHlUZXh0XSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG5cbiAgLy8gUXVpY2sgQWRkIFN0YXRlXG4gIGNvbnN0IFtxdWlja0FkZFR5cGUsIHNldFF1aWNrQWRkVHlwZV0gPSB1c2VTdGF0ZTwnY3VzdG9tZXInIHwgJ3Byb2plY3QnIHwgJ3N1cHBsaWVyJyB8ICdwcm9kdWN0JyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbcXVpY2tBZGRDdXN0b21lclRhcmdldCwgc2V0UXVpY2tBZGRDdXN0b21lclRhcmdldF0gPSB1c2VTdGF0ZTwnY3VzdG9tZXJJZCcgfCAnZW5kVXNlcicgfCAnZmluYW5jaWFsQ29udGFjdCcgfCAndGVjaG5pY2FsQ29udGFjdCcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3F1aWNrQWRkUHJvZHVjdEluZGV4LCBzZXRRdWlja0FkZFByb2R1Y3RJbmRleF0gPSB1c2VTdGF0ZTxudW1iZXIgfCBudWxsPihudWxsKTtcblxuICAvLyBBY3Rpdml0aWVzIHBhbmVsIHN0YXRlc1xuICBjb25zdCBbc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcywgc2V0U2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllc10gPSB1c2VTdGF0ZTxQcm9qZWN0IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc0FjdGl2aXRpZXNNb2RhbEZ1bGxzY3JlZW4sIHNldElzQWN0aXZpdGllc01vZGFsRnVsbHNjcmVlbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFttb2RhbFRhYiwgc2V0TW9kYWxUYWJdID0gdXNlU3RhdGU8J2FjdGl2aXRpZXMnIHwgJ2RvY3VtZW50cycgfCAnc3VwcGx5Jz4oJ2FjdGl2aXRpZXMnKTtcbiAgY29uc3QgW3NlbGVjdGVkRm9sZGVyTmFtZSwgc2V0U2VsZWN0ZWRGb2xkZXJOYW1lXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbc3VwcGx5RmlsdGVyLCBzZXRTdXBwbHlGaWx0ZXJdID0gdXNlU3RhdGU8J0FMTCcgfCAnSU5WRU5UT1JZJyB8ICdPUkRFUicgfCAnTk9ORSc+KCdBTEwnKTtcbiAgY29uc3QgW2lzVXBsb2FkaW5nRG9jLCBzZXRJc1VwbG9hZGluZ0RvY10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IFthY3RpdmVQcmV2aWV3RG9jLCBzZXRBY3RpdmVQcmV2aWV3RG9jXSA9IHVzZVN0YXRlPGFueSB8IG51bGw+KG51bGwpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRQcm9qZWN0ID0gcHJvamVjdHMuZmluZChwID0+IHAuaWQgPT09IHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMuaWQpO1xuICAgICAgaWYgKHVwZGF0ZWRQcm9qZWN0ICYmIHVwZGF0ZWRQcm9qZWN0ICE9PSBzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzKSB7XG4gICAgICAgIHNldFNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXModXBkYXRlZFByb2plY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW3Byb2plY3RzLCBzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzXSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMpIHtcbiAgICAgIHNldE1vZGFsVGFiKCdhY3Rpdml0aWVzJyk7XG4gICAgICBzZXRTZWxlY3RlZEZvbGRlck5hbWUobnVsbCk7XG4gICAgICBzZXRBY3RpdmVQcmV2aWV3RG9jKG51bGwpO1xuICAgIH1cbiAgfSwgW3NlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXNdKTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbml0aWFsU2VsZWN0ZWRQcm9qZWN0SWQpIHtcbiAgICAgIGNvbnN0IHByb2ogPSBwcm9qZWN0cy5maW5kKHAgPT4gcC5pZCA9PT0gaW5pdGlhbFNlbGVjdGVkUHJvamVjdElkKTtcbiAgICAgIGlmIChwcm9qKSB7XG4gICAgICAgIHNldFNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMocHJvaik7XG4gICAgICB9XG4gICAgICBpZiAob25DbGVhckluaXRpYWxTZWxlY3RlZFByb2plY3QpIHtcbiAgICAgICAgb25DbGVhckluaXRpYWxTZWxlY3RlZFByb2plY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtpbml0aWFsU2VsZWN0ZWRQcm9qZWN0SWQsIHByb2plY3RzLCBvbkNsZWFySW5pdGlhbFNlbGVjdGVkUHJvamVjdF0pO1xuICBjb25zdCBbbmV3QWN0aXZpdHlUZXh0LCBzZXROZXdBY3Rpdml0eVRleHRdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xuICBjb25zdCBbbmV3QWN0aXZpdHlBdHRhY2htZW50LCBzZXROZXdBY3Rpdml0eUF0dGFjaG1lbnRdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmc7IHNpemU6IHN0cmluZzsgY29udGVudD86IHN0cmluZyB9IHwgbnVsbD4+KHt9KTtcbiAgY29uc3QgW3JlZmVycmFsRW5hYmxlZCwgc2V0UmVmZXJyYWxFbmFibGVkXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+Pih7fSk7XG4gIGNvbnN0IFtyZWZlcnJhbEFzc2lnbmVkVG8sIHNldFJlZmVycmFsQXNzaWduZWRUb10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+Pih7fSk7XG4gIGNvbnN0IFtyZWZlcnJhbEFjdGlvbiwgc2V0UmVmZXJyYWxBY3Rpb25dID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xuICBjb25zdCBbc2VsZWN0ZWRDYXRlZ29yeVRvQ3JlYXRlLCBzZXRTZWxlY3RlZENhdGVnb3J5VG9DcmVhdGVdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IFtleHBhbmRlZEdyb3Vwcywgc2V0RXhwYW5kZWRHcm91cHNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYm9vbGVhbj4+KHt9KTtcblxuICAvLyBEeW5hbWljIEN1c3RvbSBGaWVsZHMgU3RhdGVcbiAgY29uc3QgW2N1c3RvbVZhbHVlcywgc2V0Q3VzdG9tVmFsdWVzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIGFueT4+KHt9KTtcblxuICAvLyBEZWxldGUgY29uZmlybSBzdGF0ZVxuICBjb25zdCBbZGVsZXRlQ29uZmlybU9wZW4sIHNldERlbGV0ZUNvbmZpcm1PcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Byb2plY3RUb0RlbGV0ZUlkLCBzZXRQcm9qZWN0VG9EZWxldGVJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3Byb2plY3RUb0RlbGV0ZU5hbWUsIHNldFByb2plY3RUb0RlbGV0ZU5hbWVdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgY29uc3QgW2FjdGl2aXR5RGVsZXRlQ29uZmlybU9wZW4sIHNldEFjdGl2aXR5RGVsZXRlQ29uZmlybU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYWN0aXZpdHlUb0RlbGV0ZUdyb3VwSWQsIHNldEFjdGl2aXR5VG9EZWxldGVHcm91cElkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbYWN0aXZpdHlUb0RlbGV0ZUlkLCBzZXRBY3Rpdml0eVRvRGVsZXRlSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgLy8gRm9ybSBzdGF0ZXNcbiAgY29uc3QgW25hbWUsIHNldE5hbWVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbY3VzdG9tZXJJZCwgc2V0Q3VzdG9tZXJJZF0gPSB1c2VTdGF0ZSgnJyk7XG4gIFxuICBjb25zdCBbc3RhdHVzLCBzZXRTdGF0dXNdID0gdXNlU3RhdGU8UHJvamVjdFsnc3RhdHVzJ10+KCfYrNiv24zYrycpO1xuICBjb25zdCBbZGVzY3JpcHRpb24sIHNldERlc2NyaXB0aW9uXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2l0ZW1zTmVlZGVkLCBzZXRJdGVtc05lZWRlZF0gPSB1c2VTdGF0ZTx7XG4gICAgcHJvZHVjdElkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHF1YW50aXR5OiBudW1iZXI7XG4gICAgc3VwcGx5TWV0aG9kPzogJ0lOVkVOVE9SWScgfCAnT1JERVInIHwgJ05PTkUnO1xuICAgIGNhdGVnb3J5PzogJ0ZMT1cnIHwgJ1RFTVBFUkFUVVJFJyB8ICdQUkVTU1VSRScgfCAnTEVWRUwnO1xuICAgIGVxdWlwbWVudFR5cGU/OiBzdHJpbmc7XG4gICAgc2l6ZT86IHN0cmluZztcbiAgfVtdPihbXSk7XG4gIGNvbnN0IFtsb3NzUmVhc29uLCBzZXRMb3NzUmVhc29uXSA9IHVzZVN0YXRlKCcnKTtcblxuICAvLyBRdWljayBDdXN0b21lciBDcmVhdGlvbiBTdGF0ZXNcbiAgY29uc3QgW3Nob3dRdWlja0N1c3RvbWVyTW9kYWwsIHNldFNob3dRdWlja0N1c3RvbWVyTW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbcXVpY2tDdXN0VHlwZSwgc2V0UXVpY2tDdXN0VHlwZV0gPSB1c2VTdGF0ZTwn2K3ZgtmI2YLbjCcgfCAn2K3ZgtuM2YLbjCc+KCfYrdmC2YjZgtuMJyk7XG4gIGNvbnN0IFtxdWlja0N1c3ROYW1lLCBzZXRRdWlja0N1c3ROYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3F1aWNrQ3VzdEZpcnN0TmFtZSwgc2V0UXVpY2tDdXN0Rmlyc3ROYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3F1aWNrQ3VzdExhc3ROYW1lLCBzZXRRdWlja0N1c3RMYXN0TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtxdWlja0N1c3RQaG9uZSwgc2V0UXVpY2tDdXN0UGhvbmVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbcXVpY2tDdXN0RW1haWwsIHNldFF1aWNrQ3VzdEVtYWlsXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3F1aWNrQ3VzdEluZHVzdHJ5LCBzZXRRdWlja0N1c3RJbmR1c3RyeV0gPSB1c2VTdGF0ZSgn2YbZgdiqINmIINqv2KfYsicpO1xuICBjb25zdCBbcXVpY2tDdXN0S2V5UGVyc29uLCBzZXRRdWlja0N1c3RLZXlQZXJzb25dID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbcXVpY2tDdXN0UG9zaXRpb24sIHNldFF1aWNrQ3VzdFBvc2l0aW9uXSA9IHVzZVN0YXRlKCcnKTtcblxuICAvLyBOZXcgUmVxdWVzdGVkIEZpZWxkcyBGb3JtIFN0YXRlXG4gIGNvbnN0IFtzYWxlc0V4cGVydCwgc2V0U2FsZXNFeHBlcnRdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbbWFya2V0aW5nQ2hhbm5lbCwgc2V0TWFya2V0aW5nQ2hhbm5lbF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtsZWFkUXVhbGl0eSwgc2V0TGVhZFF1YWxpdHldID0gdXNlU3RhdGUoJ9mF2KrZiNiz2LcnKTtcbiAgY29uc3QgW3JlZmVycmVyTmFtZSwgc2V0UmVmZXJyZXJOYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2ZpbmFuY2lhbENvbnRhY3QsIHNldEZpbmFuY2lhbENvbnRhY3RdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbdGVjaG5pY2FsQ29udGFjdCwgc2V0VGVjaG5pY2FsQ29udGFjdF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtjb21tdW5pY2F0aW9uTWV0aG9kLCBzZXRDb21tdW5pY2F0aW9uTWV0aG9kXSA9IHVzZVN0YXRlKCfYqtmE2YHZhicpO1xuICBjb25zdCBbb3Bwb3J0dW5pdHlEYXRlLCBzZXRPcHBvcnR1bml0eURhdGVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbY3VzdG9tZXJJbnF1aXJ5TnVtYmVyLCBzZXRDdXN0b21lcklucXVpcnlOdW1iZXJdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbd2lubmluZ0RhdGUsIHNldFdpbm5pbmdEYXRlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2FncmVlZERlbGl2ZXJ5RGF0ZSwgc2V0QWdyZWVkRGVsaXZlcnlEYXRlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2VuZFVzZXIsIHNldEVuZFVzZXJdID0gdXNlU3RhdGUoJycpO1xuICBcbiAgY29uc3QgW2F0dGFjaG1lbnRzLCBzZXRBdHRhY2htZW50c10gPSB1c2VTdGF0ZTx7IG5hbWU6IHN0cmluZzsgdXJsOiBzdHJpbmc7IHNpemU6IG51bWJlcjsgfVtdPihbXSk7XG4gIGNvbnN0IFtpc1VwbG9hZGluZywgc2V0SXNVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIEhlbHBlciB0byBnZXQgbGF0ZXN0IHByb2Zvcm1hIG9mIGEgcHJvamVjdFxuICBjb25zdCBnZXRMYXRlc3RQcm9mb3JtYU9mUHJvamVjdCA9IChwcm9qZWN0SWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHByb2plY3RQcm9mb3JtYXMgPSBwcm9mb3JtYXMuZmlsdGVyKHBmID0+IHBmLnByb2plY3RJZCA9PT0gcHJvamVjdElkKTtcbiAgICBpZiAocHJvamVjdFByb2Zvcm1hcy5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIFsuLi5wcm9qZWN0UHJvZm9ybWFzXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBkYXRlQ29tcGFyZSA9IGIuaXNzdWVEYXRlLmxvY2FsZUNvbXBhcmUoYS5pc3N1ZURhdGUpO1xuICAgICAgaWYgKGRhdGVDb21wYXJlICE9PSAwKSByZXR1cm4gZGF0ZUNvbXBhcmU7XG4gICAgICByZXR1cm4gYi5pZC5sb2NhbGVDb21wYXJlKGEuaWQpO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gIGNvbnN0IGdldFBpcGVsaW5lVmFsdWUgPSAocHJvamVjdElkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBsYXRlc3QgPSBnZXRMYXRlc3RQcm9mb3JtYU9mUHJvamVjdChwcm9qZWN0SWQpO1xuICAgIHJldHVybiBsYXRlc3QgPyBsYXRlc3QuZmluYWxBbW91bnQgOiAwO1xuICB9O1xuXG4gIGNvbnN0IGdldEN1c3RvbWVyRGlzcGxheU5hbWUgPSAoaWRPck5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGN1c3QgPSBjdXN0b21lcnMuZmluZChjID0+IGMuaWQgPT09IGlkT3JOYW1lKTtcbiAgICBpZiAoIWN1c3QpIHJldHVybiBpZE9yTmFtZTtcbiAgICByZXR1cm4gY3VzdC5jdXN0b21lclR5cGUgPT09ICfYrdmC2YjZgtuMJyA/IGN1c3QuY29tcGFueU5hbWUgOiBgJHtjdXN0LmZpcnN0TmFtZSB8fCAnJ30gJHtjdXN0Lmxhc3ROYW1lIHx8ICcnfWAudHJpbSgpO1xuICB9O1xuXG4gIGNvbnN0IGdldFByb2plY3RQcmVwYXltZW50RGF0ZSA9IChwcm9qZWN0SWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHByb2plY3RUeCA9IHRyYW5zYWN0aW9uc1xuICAgICAgLmZpbHRlcih0eCA9PiB0eC5wcm9qZWN0SWQgPT09IHByb2plY3RJZCAmJiB0eC50eXBlID09PSAn2K/YsduM2KfZgdiqJylcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLmRhdGUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGIuZGF0ZSkuZ2V0VGltZSgpKTtcbiAgICByZXR1cm4gcHJvamVjdFR4Lmxlbmd0aCA+IDAgPyBwcm9qZWN0VHhbMF0uZGF0ZSA6IG51bGw7XG4gIH07XG5cbiAgY29uc3QgZ2V0QWN0dWFsRGVsaXZlcnlEYXRlID0gKHByb2plY3RJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZGVsaXZlcnkgPSBwYWNrYWdpbmdEZWxpdmVyaWVzLmZpbmQoZCA9PiBkLnByb2plY3RJZCA9PT0gcHJvamVjdElkKTtcbiAgICByZXR1cm4gZGVsaXZlcnk/LmFjdHVhbERlbGl2ZXJ5RGF0ZTtcbiAgfTtcbiAgXG4gIGNvbnN0IGdldEFwcHJvdmVkUHJvZm9ybWFEZWxpdmVyeURhdGUgPSAocHJvamVjdElkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBhcHByb3ZlZCA9IHByb2Zvcm1hcy5maW5kKHBmID0+IHtcbiAgICAgIGlmIChwZi5wcm9qZWN0SWQgIT09IHByb2plY3RJZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3Qgb3V0Y29tZSA9IGdldFByb2Zvcm1hT3V0Y29tZVN0YXR1cyhwZik7XG4gICAgICByZXR1cm4gb3V0Y29tZSA9PT0gJ9iq2KPbjNuM2K8g2LTYr9mHICjYqNix2YbYr9mHKScgfHwgb3V0Y29tZSA9PT0gJ9mG24zZhdmHINio2LHZhtiv2YcnO1xuICAgIH0pO1xuICAgIHJldHVybiBhcHByb3ZlZD8uZGVsaXZlcnlEYXRlO1xuICB9O1xuXG4gIGNvbnN0IGZhVG9FbkRpZ2l0cyA9IChzdHI6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgZmFEaWdpdHMgPSBbJ9uwJywgJ9uxJywgJ9uyJywgJ9uzJywgJ9u0JywgJ9u1JywgJ9u2JywgJ9u3JywgJ9u4JywgJ9u5J107XG4gICAgY29uc3QgYXJEaWdpdHMgPSBbJ9mgJywgJ9mhJywgJ9miJywgJ9mjJywgJ9mkJywgJ9mlJywgJ9mmJywgJ9mnJywgJ9moJywgJ9mpJ107XG4gICAgbGV0IHJlc3VsdCA9IHN0cjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKG5ldyBSZWdFeHAoZmFEaWdpdHNbaV0sICdnJyksIGkudG9TdHJpbmcoKSk7XG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShuZXcgUmVnRXhwKGFyRGlnaXRzW2ldLCAnZycpLCBpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IHBhcnNlSXRlbURlbGl2ZXJ5VG9EYXlzID0gKHJhbmdlOiBzdHJpbmcsIHVuaXQ6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKCFyYW5nZSkgcmV0dXJuIDA7XG4gICAgY29uc3Qgbm9ybWFsaXplZFJhbmdlID0gZmFUb0VuRGlnaXRzKHJhbmdlLnRyaW0oKSk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG5vcm1hbGl6ZWRSYW5nZS5tYXRjaCgvXFxkKy9nKTtcbiAgICBpZiAoIW1hdGNoZXMgfHwgbWF0Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiAwO1xuICAgIC8vIFVzZSB0aGUgbWF4aW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2VcbiAgICBjb25zdCBsYXN0TnVtID0gcGFyc2VJbnQobWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdLCAxMCk7XG4gICAgXG4gICAgaWYgKHVuaXQgPT09ICfZh9mB2KrZhycpIHJldHVybiBsYXN0TnVtICogNztcbiAgICBpZiAodW5pdCA9PT0gJ9mF2KfZhycpIHJldHVybiBsYXN0TnVtICogMzA7XG4gICAgcmV0dXJuIGxhc3ROdW07IC8vIGRheXNcbiAgfTtcblxuICBjb25zdCBnZXRQcm9qZWN0RGVsaXZlcnlEZXRhaWxzID0gKHByb2plY3RJZDogc3RyaW5nKSA9PiB7XG4gICAgLy8gMS4gQWdyZWVkIERlbGl2ZXJ5IERhdGVzIHBlciBpdGVtIGZyb20gd29uIHByb2Zvcm1hc1xuICAgIGNvbnN0IHByb2plY3RQcm9mb3JtYXMgPSBwcm9mb3JtYXMuZmlsdGVyKHBmID0+IHBmLnByb2plY3RJZCA9PT0gcHJvamVjdElkKTtcbiAgICBjb25zdCB3b25Qcm9mb3JtYXMgPSBwcm9qZWN0UHJvZm9ybWFzLmZpbHRlcihwZiA9PiB7XG4gICAgICBjb25zdCBvdXRjb21lID0gZ2V0UHJvZm9ybWFPdXRjb21lU3RhdHVzKHBmKTtcbiAgICAgIHJldHVybiBvdXRjb21lID09PSAn2KrYo9uM24zYryDYtNiv2YcgKNio2LHZhtiv2YcpJyB8fCBvdXRjb21lID09PSAn2YbbjNmF2Ycg2KjYsdmG2K/Zhyc7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcmVwYXltZW50RGF0ZSA9IGdldFByb2plY3RQcmVwYXltZW50RGF0ZShwcm9qZWN0SWQpO1xuICAgIGNvbnN0IHByb2ogPSBwcm9qZWN0cy5maW5kKHAgPT4gcC5pZCA9PT0gcHJvamVjdElkKTtcbiAgICBjb25zdCBiYXNlRGF0ZSA9IHByZXBheW1lbnREYXRlIHx8IHByb2o/Lndpbm5pbmdEYXRlIHx8IHByb2o/Lm9wcG9ydHVuaXR5RGF0ZSB8fCBwcm9qPy5jcmVhdGlvbkRhdGUgfHwgZ2V0VG9kYXlTaGFtc2koKTtcblxuICAgIGNvbnN0IGFncmVlZEl0ZW1zOiB7IGlkOiBzdHJpbmc7IHByb2R1Y3ROYW1lOiBzdHJpbmc7IGRlbGl2ZXJ5VGV4dDogc3RyaW5nOyBjYWxjdWxhdGVkRGF0ZTogc3RyaW5nIH1bXSA9IFtdO1xuXG4gICAgd29uUHJvZm9ybWFzLmZvckVhY2gocGYgPT4ge1xuICAgICAgbGV0IHdvbkl0ZW1zID0gW107XG4gICAgICBjb25zdCBoYXNFeHBsaWNpdFdvbiA9IHBmLml0ZW1zPy5zb21lKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09ICfYqNix2YbYr9mHJyk7XG4gICAgICBpZiAoaGFzRXhwbGljaXRXb24pIHtcbiAgICAgICAgd29uSXRlbXMgPSBwZi5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gJ9io2LHZhtiv2YcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvbkl0ZW1zID0gcGYuaXRlbXM/LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzICE9PSAn2KjYp9iy2YbYr9mHJykgfHwgW107XG4gICAgICB9XG5cbiAgICAgIHdvbkl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBpdGVtIGhhcyBpbmRpdmlkdWFsIGRlbGl2ZXJ5IGRldGFpbHNcbiAgICAgICAgaWYgKGl0ZW0uZGVsaXZlcnlSYW5nZSAmJiBpdGVtLmRlbGl2ZXJ5VW5pdCkge1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gaXRlbS5kZWxpdmVyeVJhbmdlO1xuICAgICAgICAgIGNvbnN0IHVuaXQgPSBpdGVtLmRlbGl2ZXJ5VW5pdDtcbiAgICAgICAgICBjb25zdCB0eXBlID0gaXRlbS5kZWxpdmVyeVR5cGUgfHwgJ9qp2KfYsduMJztcbiAgICAgICAgICBjb25zdCBwb3N0Zml4ID0gaXRlbS5kZWxpdmVyeVBvc3RmaXggfHwgJyc7XG5cbiAgICAgICAgICAvLyBQYXJzZSB0byBkYXlzXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0RGF5cyA9IHBhcnNlSXRlbURlbGl2ZXJ5VG9EYXlzKHJhbmdlLCB1bml0KTtcbiAgICAgICAgICBjb25zdCBpc1dvcmtpbmdEYXlzID0gdHlwZSA9PT0gJ9qp2KfYsduMJztcbiAgICAgICAgICBjb25zdCBjYWxjdWxhdGVkRGF0ZSA9IGlzV29ya2luZ0RheXNcbiAgICAgICAgICAgID8gYWRkV29ya2luZ0RheXNUb1NoYW1zaShiYXNlRGF0ZSwgb2Zmc2V0RGF5cylcbiAgICAgICAgICAgIDogYWRkRGF5c1RvU2hhbXNpKGJhc2VEYXRlLCBvZmZzZXREYXlzKTtcblxuICAgICAgICAgIGFncmVlZEl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICBwcm9kdWN0TmFtZTogaXRlbS5wcm9kdWN0TmFtZSxcbiAgICAgICAgICAgIGRlbGl2ZXJ5VGV4dDogYCR7cmFuZ2V9ICR7dW5pdH0gJHt0eXBlfSR7cG9zdGZpeCA/IGAgJHtwb3N0Zml4fWAgOiAnJ31gLFxuICAgICAgICAgICAgY2FsY3VsYXRlZERhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBGYWxsYmFjayBpZiBubyBpdGVtIHNwZWNpZmljIGRlbGl2ZXJ5IGZpZWxkcywgYnV0IHdvblBmIGhhcyBvdmVyYWxsIGRlbGl2ZXJ5RGF0ZVxuICAgICAgICAgIGNvbnN0IHBmRGVsaXZlcnlEYXRlID0gcGYuZGVsaXZlcnlEYXRlIHx8IHByb2o/LmFncmVlZERlbGl2ZXJ5RGF0ZSB8fCAnJztcbiAgICAgICAgICBhZ3JlZWRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgcHJvZHVjdE5hbWU6IGl0ZW0ucHJvZHVjdE5hbWUsXG4gICAgICAgICAgICBkZWxpdmVyeVRleHQ6IHBmRGVsaXZlcnlEYXRlIHx8ICfZgdmI2LHbjCcsXG4gICAgICAgICAgICBjYWxjdWxhdGVkRGF0ZTogcHJvaj8uYWdyZWVkRGVsaXZlcnlEYXRlIHx8IGJhc2VEYXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gMi4gQWN0dWFsIERlbGl2ZXJ5IERhdGVzIHBlciBpdGVtIGZyb20gUGFja2FnaW5nIERlbGl2ZXJpZXNcbiAgICBjb25zdCBwcm9qZWN0RGVsaXZlcmllcyA9IHBhY2thZ2luZ0RlbGl2ZXJpZXMuZmlsdGVyKGQgPT4gZC5wcm9qZWN0SWQgPT09IHByb2plY3RJZCk7XG4gICAgY29uc3QgYWN0dWFsSXRlbXM6IHsgaWQ6IHN0cmluZzsgcHJvZHVjdE5hbWU6IHN0cmluZzsgYWN0dWFsRGF0ZTogc3RyaW5nOyBib3hOdW1iZXI/OiBzdHJpbmcgfVtdID0gW107XG5cbiAgICBwcm9qZWN0RGVsaXZlcmllcy5mb3JFYWNoKGRlbCA9PiB7XG4gICAgICBjb25zdCBtYWluQWN0dWFsRGF0ZSA9IGRlbC5hY3R1YWxEZWxpdmVyeURhdGUgfHwgJyc7XG4gICAgICBkZWwuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgaXRlbUFjdHVhbERhdGUgPSBpdGVtLmFjdHVhbERlbGl2ZXJ5RGF0ZSB8fCBtYWluQWN0dWFsRGF0ZSB8fCAnJztcbiAgICAgICAgaWYgKGl0ZW1BY3R1YWxEYXRlKSB7XG4gICAgICAgICAgYWN0dWFsSXRlbXMucHVzaCh7XG4gICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgIHByb2R1Y3ROYW1lOiBpdGVtLml0ZW1PckRvY05hbWUsXG4gICAgICAgICAgICBhY3R1YWxEYXRlOiBpdGVtQWN0dWFsRGF0ZSxcbiAgICAgICAgICAgIGJveE51bWJlcjogaXRlbS5ib3hOdW1iZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBpZiBhZ3JlZWQgZGVsaXZlcnkgZGF0ZXMgZGlmZmVyIGFtb25nIHRoZSBpdGVtc1xuICAgIGNvbnN0IHVuaXF1ZUFncmVlZERhdGVzID0gbmV3IFNldChhZ3JlZWRJdGVtcy5tYXAoeCA9PiB4LmNhbGN1bGF0ZWREYXRlKS5maWx0ZXIoQm9vbGVhbikpO1xuICAgIGNvbnN0IHVuaXF1ZUFjdHVhbERhdGVzID0gbmV3IFNldChhY3R1YWxJdGVtcy5tYXAoeCA9PiB4LmFjdHVhbERhdGUpLmZpbHRlcihCb29sZWFuKSk7XG4gICAgY29uc3Qgc2luZ2xlQWdyZWVkRGF0ZSA9IHVuaXF1ZUFncmVlZERhdGVzLnNpemUgPT09IDEgPyBBcnJheS5mcm9tKHVuaXF1ZUFncmVlZERhdGVzKVswXSA6ICcnO1xuICAgIGNvbnN0IHNpbmdsZUFjdHVhbERhdGUgPSB1bmlxdWVBY3R1YWxEYXRlcy5zaXplID09PSAxID8gQXJyYXkuZnJvbSh1bmlxdWVBY3R1YWxEYXRlcylbMF0gOiAnJztcblxuICAgIHJldHVybiB7XG4gICAgICBhZ3JlZWRJdGVtcyxcbiAgICAgIGFjdHVhbEl0ZW1zLFxuICAgICAgaGFzTXVsdGlwbGVBZ3JlZWQ6IHVuaXF1ZUFncmVlZERhdGVzLnNpemUgPiAxLFxuICAgICAgaGFzTXVsdGlwbGVBY3R1YWw6IHVuaXF1ZUFjdHVhbERhdGVzLnNpemUgPiAxLFxuICAgICAgc2luZ2xlQWdyZWVkRGF0ZSxcbiAgICAgIHNpbmdsZUFjdHVhbERhdGVcbiAgICB9O1xuICB9O1xuXG4gIC8vIEl0ZW1zIGxpbmVzIG1hbmFnZW1lbnQgaGVscGVyc1xuICBjb25zdCBoYW5kbGVBZGRJdGVtTGluZSA9ICgpID0+IHtcbiAgICAvLyBEZWZhdWx0IHRvIGEgZ2VuZXJpYyBzcGVjaWZpY2F0aW9uIGxpbmUsIGFzIHJlcXVlc3RlZCBieSB1c2VyIHRvIGVhc2lseSBoYW5kbGUgdW5rbm93biBzcGVjaWZpYyBpdGVtc1xuICAgIHNldEl0ZW1zTmVlZGVkKFtcbiAgICAgIC4uLml0ZW1zTmVlZGVkLFxuICAgICAge1xuICAgICAgICBwcm9kdWN0SWQ6ICdnZW5lcmljJyxcbiAgICAgICAgbmFtZTogJ9mB2YTZiCAtINiq2KzZh9uM2LIg2K/Ysdiu2YjYp9iz2KrbjCcsXG4gICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICBzdXBwbHlNZXRob2Q6ICdPUkRFUicsXG4gICAgICAgIGNhdGVnb3J5OiAnRkxPVycsXG4gICAgICAgIGVxdWlwbWVudFR5cGU6ICcnLFxuICAgICAgICBzaXplOiAnJ1xuICAgICAgfVxuICAgIF0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVJlbW92ZUl0ZW1MaW5lID0gKGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBzZXRJdGVtc05lZWRlZChpdGVtc05lZWRlZC5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSXRlbVByb2R1Y3RDaGFuZ2UgPSAoaW5kZXg6IG51bWJlciwgcHJvZElkOiBzdHJpbmcpID0+IHtcbiAgICBpZiAocHJvZElkID09PSAnZ2VuZXJpYycpIHtcbiAgICAgIHNldEl0ZW1zTmVlZGVkKFxuICAgICAgICBpdGVtc05lZWRlZC5tYXAoKGl0ZW0sIGkpID0+XG4gICAgICAgICAgaSA9PT0gaW5kZXhcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICAgICAgcHJvZHVjdElkOiAnZ2VuZXJpYycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ9mB2YTZiCAtINiq2KzZh9uM2LIg2K/Ysdiu2YjYp9iz2KrbjCcsXG4gICAgICAgICAgICAgICAgc3VwcGx5TWV0aG9kOiAnT1JERVInLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAnRkxPVycsXG4gICAgICAgICAgICAgICAgZXF1aXBtZW50VHlwZTogJycsXG4gICAgICAgICAgICAgICAgc2l6ZTogJydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBpdGVtXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdGVkUHJvZCA9IHByb2R1Y3RzLmZpbmQocCA9PiBwLmlkID09PSBwcm9kSWQpO1xuICAgIGlmICghc2VsZWN0ZWRQcm9kKSByZXR1cm47XG4gICAgc2V0SXRlbXNOZWVkZWQoXG4gICAgICBpdGVtc05lZWRlZC5tYXAoKGl0ZW0sIGkpID0+XG4gICAgICAgIGkgPT09IGluZGV4XG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogcHJvZElkLFxuICAgICAgICAgICAgICBuYW1lOiBzZWxlY3RlZFByb2QuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICAgIHN1cHBseU1ldGhvZDogc2VsZWN0ZWRQcm9kLnN1cHBseVR5cGUgPT09ICdPUkRFUicgPyAnT1JERVInIDogJ0lOVkVOVE9SWScsXG4gICAgICAgICAgICAgIGNhdGVnb3J5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGVxdWlwbWVudFR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgc2l6ZTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiBpdGVtXG4gICAgICApXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVJdGVtQ2F0ZWdvcnlDaGFuZ2UgPSAoaW5kZXg6IG51bWJlciwgY2F0OiAnRkxPVycgfCAnVEVNUEVSQVRVUkUnIHwgJ1BSRVNTVVJFJyB8ICdMRVZFTCcpID0+IHtcbiAgICBzZXRJdGVtc05lZWRlZChcbiAgICAgIGl0ZW1zTmVlZGVkLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICBpZiAoaSAhPT0gaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgICBjb25zdCBlcVR5cGUgPSBpdGVtLmVxdWlwbWVudFR5cGUgfHwgJyc7XG4gICAgICAgIGNvbnN0IHNpemVTdHIgPSBpdGVtLnNpemUgPyBgICjYs9in24zYsjogJHtpdGVtLnNpemV9KWAgOiAnJztcbiAgICAgICAgY29uc3QgY2F0TGFiZWwgPSBjYXQgPT09ICdGTE9XJyA/ICfZgdmE2YgnIDogY2F0ID09PSAnVEVNUEVSQVRVUkUnID8gJ9iv2YXYpycgOiBjYXQgPT09ICdQUkVTU1VSRScgPyAn2YHYtNin2LEnIDogJ9iz2LfYrSc7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWROYW1lID0gYCR7Y2F0TGFiZWx9IC0gJHtlcVR5cGUgfHwgJ9iq2KzZh9uM2LIg2K/Ysdiu2YjYp9iz2KrbjCd9JHtzaXplU3RyfWA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBjYXRlZ29yeTogY2F0LFxuICAgICAgICAgIG5hbWU6IHVwZGF0ZWROYW1lXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSXRlbUVxdWlwbWVudFR5cGVDaGFuZ2UgPSAoaW5kZXg6IG51bWJlciwgZXFUeXBlOiBzdHJpbmcpID0+IHtcbiAgICBzZXRJdGVtc05lZWRlZChcbiAgICAgIGl0ZW1zTmVlZGVkLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICBpZiAoaSAhPT0gaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgICBjb25zdCBjYXQgPSBpdGVtLmNhdGVnb3J5IHx8ICdGTE9XJztcbiAgICAgICAgY29uc3Qgc2l6ZVN0ciA9IGl0ZW0uc2l6ZSA/IGAgKNiz2KfbjNiyOiAke2l0ZW0uc2l6ZX0pYCA6ICcnO1xuICAgICAgICBjb25zdCBjYXRMYWJlbCA9IGNhdCA9PT0gJ0ZMT1cnID8gJ9mB2YTZiCcgOiBjYXQgPT09ICdURU1QRVJBVFVSRScgPyAn2K/ZhdinJyA6IGNhdCA9PT0gJ1BSRVNTVVJFJyA/ICfZgdi02KfYsScgOiAn2LPYt9itJztcbiAgICAgICAgY29uc3QgdXBkYXRlZE5hbWUgPSBgJHtjYXRMYWJlbH0gLSAke2VxVHlwZSB8fCAn2KrYrNmH24zYsiDYr9ix2K7ZiNin2LPYqtuMJ30ke3NpemVTdHJ9YDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGVxdWlwbWVudFR5cGU6IGVxVHlwZSxcbiAgICAgICAgICBuYW1lOiB1cGRhdGVkTmFtZVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUl0ZW1TaXplQ2hhbmdlID0gKGluZGV4OiBudW1iZXIsIHN6OiBzdHJpbmcpID0+IHtcbiAgICBzZXRJdGVtc05lZWRlZChcbiAgICAgIGl0ZW1zTmVlZGVkLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICBpZiAoaSAhPT0gaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgICBjb25zdCBjYXQgPSBpdGVtLmNhdGVnb3J5IHx8ICdGTE9XJztcbiAgICAgICAgY29uc3QgZXFUeXBlID0gaXRlbS5lcXVpcG1lbnRUeXBlIHx8ICcnO1xuICAgICAgICBjb25zdCBzaXplU3RyID0gc3ogPyBgICjYs9in24zYsjogJHtzen0pYCA6ICcnO1xuICAgICAgICBjb25zdCBjYXRMYWJlbCA9IGNhdCA9PT0gJ0ZMT1cnID8gJ9mB2YTZiCcgOiBjYXQgPT09ICdURU1QRVJBVFVSRScgPyAn2K/ZhdinJyA6IGNhdCA9PT0gJ1BSRVNTVVJFJyA/ICfZgdi02KfYsScgOiAn2LPYt9itJztcbiAgICAgICAgY29uc3QgdXBkYXRlZE5hbWUgPSBgJHtjYXRMYWJlbH0gLSAke2VxVHlwZSB8fCAn2KrYrNmH24zYsiDYr9ix2K7ZiNin2LPYqtuMJ30ke3NpemVTdHJ9YDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNpemU6IHN6LFxuICAgICAgICAgIG5hbWU6IHVwZGF0ZWROYW1lXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSXRlbVF1YW50aXR5Q2hhbmdlID0gKGluZGV4OiBudW1iZXIsIHF0eTogbnVtYmVyKSA9PiB7XG4gICAgc2V0SXRlbXNOZWVkZWQoXG4gICAgICBpdGVtc05lZWRlZC5tYXAoKGl0ZW0sIGkpID0+XG4gICAgICAgIGkgPT09IGluZGV4ID8geyAuLi5pdGVtLCBxdWFudGl0eTogcXR5IH0gOiBpdGVtXG4gICAgICApXG4gICAgKTtcbiAgfTtcblxuICAvLyBTdGF0dXMgQ2hhbmdlIGF1dG8gdXBkYXRlclxuICBjb25zdCBoYW5kbGVTdGF0dXNDaGFuZ2UgPSAobmV3U3RhdHVzOiBQcm9qZWN0WydzdGF0dXMnXSkgPT4ge1xuICAgIHNldFN0YXR1cyhuZXdTdGF0dXMpO1xuICAgIGNvbnN0IHRvZGF5ID0gZ2V0VG9kYXlTaGFtc2koKTtcbiAgICBpZiAobmV3U3RhdHVzID09PSAn2KjYsdmG2K/ZhyAo2YXZiNmB2YIpJyB8fCBuZXdTdGF0dXMgPT09ICfZhtuM2YXZhyDYqNix2YbYr9mHJykge1xuICAgICAgaWYgKCF3aW5uaW5nRGF0ZSkgc2V0V2lubmluZ0RhdGUodG9kYXkpO1xuICAgICAgLy8gIFxuICAgICAgaWYgKCFhZ3JlZWREZWxpdmVyeURhdGUpIHNldEFncmVlZERlbGl2ZXJ5RGF0ZSh0b2RheSk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0dXMgPT09ICfYqNin2K7YqtmHJyB8fCBuZXdTdGF0dXMgPT09ICfZhNi62Ygg2LTYr9mHJykge1xuICAgICAgXG4gICAgfVxuICB9O1xuXG4gIC8vIE9wZW4gQWRkXG4gIGNvbnN0IGhhbmRsZU9wZW5BZGQgPSAoKSA9PiB7XG4gICAgc2V0RWRpdGluZ1Byb2plY3QobnVsbCk7XG4gICAgc2V0TmFtZSgnJyk7XG4gICAgc2V0Q3VzdG9tZXJJZChjdXN0b21lcnNbMF0/LmlkIHx8ICcnKTtcbiAgICBcbiAgICBzZXRTdGF0dXMoJ9is2K/bjNivJyk7XG4gICAgc2V0RGVzY3JpcHRpb24oJycpO1xuICAgIHNldEN1c3RvbVZhbHVlcyh7fSk7XG4gICAgc2V0SXRlbXNOZWVkZWQoW10pO1xuICAgIHNldExvc3NSZWFzb24oJycpO1xuXG4gICAgLy8gUmVzZXQgbmV3IGZpZWxkc1xuICAgIHNldFNhbGVzRXhwZXJ0KCcnKTtcbiAgICBzZXRNYXJrZXRpbmdDaGFubmVsKCfYqtmF2KfYsyDZhdiz2KrZgtuM2YUnKTtcbiAgICBzZXRMZWFkUXVhbGl0eSgn2YXYqtmI2LPYtycpO1xuICAgIHNldFJlZmVycmVyTmFtZSgnJyk7XG4gICAgc2V0RmluYW5jaWFsQ29udGFjdCgnJyk7XG4gICAgc2V0VGVjaG5pY2FsQ29udGFjdCgnJyk7XG4gICAgc2V0Q29tbXVuaWNhdGlvbk1ldGhvZCgn2KrZhNmB2YYnKTtcbiAgICBzZXRPcHBvcnR1bml0eURhdGUoZ2V0VG9kYXlTaGFtc2koKSk7XG4gICAgc2V0Q3VzdG9tZXJJbnF1aXJ5TnVtYmVyKCcnKTtcbiAgICBzZXRXaW5uaW5nRGF0ZSgnJyk7XG4gICAgc2V0QWdyZWVkRGVsaXZlcnlEYXRlKCcnKTtcbiAgICBzZXRFbmRVc2VyKCcnKTtcbiAgICBcbiAgICBzZXRBdHRhY2htZW50cyhbXSk7XG5cbiAgICBzZXRTaG93TW9kYWwodHJ1ZSk7XG4gIH07XG5cbiAgLy8gT3BlbiBFZGl0XG4gIGNvbnN0IGhhbmRsZU9wZW5FZGl0ID0gKHByb2o6IFByb2plY3QpID0+IHtcbiAgICBzZXRFZGl0aW5nUHJvamVjdChwcm9qKTtcbiAgICBzZXROYW1lKHByb2oubmFtZSk7XG4gICAgc2V0Q3VzdG9tZXJJZChwcm9qLmN1c3RvbWVySWQpO1xuICAgIFxuICAgIHNldFN0YXR1cyhwcm9qLnN0YXR1cyk7XG4gICAgc2V0RGVzY3JpcHRpb24ocHJvai5kZXNjcmlwdGlvbik7XG4gICAgc2V0Q3VzdG9tVmFsdWVzKHByb2ouY3VzdG9tVmFsdWVzIHx8IHt9KTtcbiAgICBzZXRJdGVtc05lZWRlZChwcm9qLml0ZW1zTmVlZGVkIHx8IFtdKTtcbiAgICBzZXRMb3NzUmVhc29uKHByb2oubG9zc1JlYXNvbiB8fCAnJyk7XG5cbiAgICAvLyBMb2FkIG5ldyBmaWVsZHNcbiAgICBzZXRTYWxlc0V4cGVydChwcm9qLnNhbGVzRXhwZXJ0IHx8ICcnKTtcbiAgICBzZXRNYXJrZXRpbmdDaGFubmVsKHByb2oubWFya2V0aW5nQ2hhbm5lbCB8fCAn2KrZhdin2LMg2YXYs9iq2YLbjNmFJyk7XG4gICAgc2V0TGVhZFF1YWxpdHkocHJvai5sZWFkUXVhbGl0eSB8fCAn2YXYqtmI2LPYtycpO1xuICAgIHNldFJlZmVycmVyTmFtZShwcm9qLnJlZmVycmVyTmFtZSB8fCAnJyk7XG4gICAgc2V0RmluYW5jaWFsQ29udGFjdChwcm9qLmZpbmFuY2lhbENvbnRhY3QgfHwgJycpO1xuICAgIHNldFRlY2huaWNhbENvbnRhY3QocHJvai50ZWNobmljYWxDb250YWN0IHx8ICcnKTtcbiAgICBzZXRDb21tdW5pY2F0aW9uTWV0aG9kKHByb2ouY29tbXVuaWNhdGlvbk1ldGhvZCB8fCAn2KrZhNmB2YYnKTtcbiAgICBzZXRPcHBvcnR1bml0eURhdGUocHJvai5vcHBvcnR1bml0eURhdGUgfHwgcHJvai5jcmVhdGlvbkRhdGUgfHwgZ2V0VG9kYXlTaGFtc2koKSk7XG4gICAgc2V0Q3VzdG9tZXJJbnF1aXJ5TnVtYmVyKHByb2ouY3VzdG9tZXJJbnF1aXJ5TnVtYmVyIHx8ICcnKTtcbiAgICBzZXRXaW5uaW5nRGF0ZShwcm9qLndpbm5pbmdEYXRlIHx8ICcnKTtcbiAgICBzZXRBZ3JlZWREZWxpdmVyeURhdGUocHJvai5hZ3JlZWREZWxpdmVyeURhdGUgfHwgJycpO1xuICAgIHNldEVuZFVzZXIocHJvai5lbmRVc2VyIHx8ICcnKTtcbiAgICBcbiAgICBzZXRBdHRhY2htZW50cyhwcm9qLmF0dGFjaG1lbnRzIHx8IFtdKTtcblxuICAgIHNldFNob3dNb2RhbCh0cnVlKTtcbiAgfTtcblxuICAvLyBTYXZlXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoZTogUmVhY3QuRm9ybUV2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghY3VzdG9tZXJJZCkgcmV0dXJuO1xuXG4gICAgLy8gQ3VzdG9tIEZpZWxkcyBWYWxpZGF0aW9uXG4gICAgY29uc3QgbW9kdWxlRmllbGRzID0gKHNldHRpbmdzPy5jdXN0b21GaWVsZHMgfHwgW10pLmZpbHRlcihmID0+IGYubW9kdWxlID09PSAncHJvamVjdHMnKTtcbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIG1vZHVsZUZpZWxkcykge1xuICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGN1c3RvbVZhbHVlc1tmaWVsZC5pZF07XG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IG51bGwgfHwgdmFsID09PSAnJykge1xuICAgICAgICAgIGFsZXJ0KGDZhNi32YHYp9mLINmB24zZhNivINiz2YHYp9ix2LTbjCDYp9is2KjYp9ix24wgXCIke2ZpZWxkLm5hbWV9XCIg2LHYpyDYqtqp2YXbjNmEINqp2YbbjNivLmApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbWVyTmFtZSA9IGN1c3RvbWVycy5maW5kKGMgPT4gYy5pZCA9PT0gY3VzdG9tZXJJZCk/LmNvbXBhbnlOYW1lIHx8ICfZhdi02KrYsduMINmG2KfZhdi02K7YtSc7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIG5hbWUsXG4gICAgICBjdXN0b21lcklkLFxuICAgICAgY3VzdG9tZXJOYW1lLFxuICAgICAgXG4gICAgICBzdGF0dXMsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGN1c3RvbVZhbHVlcyxcbiAgICAgIGl0ZW1zTmVlZGVkLFxuICAgICAgbG9zc1JlYXNvbjogc3RhdHVzID09PSAn2KjYp9iu2KrZhycgPyBsb3NzUmVhc29uIDogdW5kZWZpbmVkLFxuICAgICAgXG4gICAgICAvLyBOZXcgRmllbGRzXG4gICAgICBzYWxlc0V4cGVydCxcbiAgICAgIG1hcmtldGluZ0NoYW5uZWwsXG4gICAgICBsZWFkUXVhbGl0eSxcbiAgICAgIHJlZmVycmVyTmFtZSxcbiAgICAgIGZpbmFuY2lhbENvbnRhY3QsXG4gICAgICB0ZWNobmljYWxDb250YWN0LFxuICAgICAgY29tbXVuaWNhdGlvbk1ldGhvZCxcbiAgICAgIG9wcG9ydHVuaXR5RGF0ZSxcbiAgICAgIGN1c3RvbWVySW5xdWlyeU51bWJlcixcbiAgICAgIHdpbm5pbmdEYXRlLFxuICAgICAgYWdyZWVkRGVsaXZlcnlEYXRlLFxuICAgICAgZW5kVXNlcixcbiAgICAgIGF0dGFjaG1lbnRzXG4gICAgfTtcblxuICAgIGlmIChlZGl0aW5nUHJvamVjdCkge1xuICAgICAgdXBkYXRlUHJvamVjdCh7XG4gICAgICAgIC4uLmVkaXRpbmdQcm9qZWN0LFxuICAgICAgICAuLi5kYXRhXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkUHJvamVjdChkYXRhKTtcbiAgICB9XG4gICAgc2V0U2hvd01vZGFsKGZhbHNlKTtcbiAgfTtcblxuICAvLyBGaWx0ZXJcbiAgY29uc3QgZmlsdGVyZWRQcm9qZWN0cyA9IHByb2plY3RzLmZpbHRlcihwID0+IHtcbiAgICBjb25zdCBtYXRjaGVzU2VhcmNoID0gIXNlYXJjaCB8fCBcbiAgICAgIHAubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgcC5jb2RlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICBwLmN1c3RvbWVyTmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaC50b0xvd2VyQ2FzZSgpKTtcbiAgICBcbiAgICBjb25zdCBtYXRjaGVzU3RhdHVzID0gc2VsZWN0ZWRTdGF0dXMgPT09ICdhbGwnIHx8IHAuc3RhdHVzID09PSBzZWxlY3RlZFN0YXR1cztcblxuICAgIGlmICghKG1hdGNoZXNTZWFyY2ggJiYgbWF0Y2hlc1N0YXR1cykpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIEN1c3RvbSBGaWVsZHMgRmlsdGVyc1xuICAgIGNvbnN0IG1hdGNoZXNDdXN0b20gPSAoT2JqZWN0LmVudHJpZXMoY3VzdG9tRmllbGRGaWx0ZXJzKSBhcyBbc3RyaW5nLCBzdHJpbmddW10pLmV2ZXJ5KChbZmllbGRJZCwgZmlsdGVyVmFsdWVdKSA9PiB7XG4gICAgICBpZiAoIWZpbHRlclZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlY29yZFZhbHVlID0gcC5jdXN0b21WYWx1ZXM/LltmaWVsZElkXSBhcyBhbnk7XG4gICAgICBpZiAocmVjb3JkVmFsdWUgPT09IHVuZGVmaW5lZCB8fCByZWNvcmRWYWx1ZSA9PT0gbnVsbCB8fCByZWNvcmRWYWx1ZSA9PT0gJycpIHJldHVybiBmYWxzZTtcblxuICAgICAgY29uc3QgZmllbGQgPSBzZXR0aW5ncz8uY3VzdG9tRmllbGRzPy5maW5kKGYgPT4gZi5pZCA9PT0gZmllbGRJZCk7XG4gICAgICBpZiAoIWZpZWxkKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKGZpZWxkLnR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHJlY29yZFZhbHVlKSA9PT0gZmlsdGVyVmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhyZWNvcmRWYWx1ZSkgPT09IGZpbHRlclZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLnR5cGUgPT09ICdmaWxlJykge1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgPT09ICdoYXNfZmlsZScpIHtcbiAgICAgICAgICByZXR1cm4gISEocmVjb3JkVmFsdWUgJiYgcmVjb3JkVmFsdWUubmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyVmFsdWUgPT09ICdub19maWxlJykge1xuICAgICAgICAgIHJldHVybiAhKHJlY29yZFZhbHVlICYmIHJlY29yZFZhbHVlLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFN0cmluZyhyZWNvcmRWYWx1ZSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9KTtcblxuICAgIGlmICghbWF0Y2hlc0N1c3RvbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gQ29sdW1uLXNwZWNpZmljIGZpbHRlcnNcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoY29sRmlsdGVycykuZXZlcnkoKFtjb2xJZCwgZmlsdGVyVmFsdWVdKSA9PiB7XG4gICAgICBpZiAoIWZpbHRlclZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGNvbnN0IGZWYWwgPSBTdHJpbmcoZmlsdGVyVmFsdWUpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoY29sSWQgPT09ICdjb2RlJykge1xuICAgICAgICByZXR1cm4gcC5jb2RlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZlZhbCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sSWQgPT09ICduYW1lJykge1xuICAgICAgICByZXR1cm4gcC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZlZhbCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sSWQgPT09ICdjdXN0b21lck5hbWUnKSB7XG4gICAgICAgIHJldHVybiBwLmN1c3RvbWVyTmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGZWYWwpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbElkID09PSAnZXN0aW1hdGVkVmFsdWVSSVlBTCcpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhnZXRQaXBlbGluZVZhbHVlKHAuaWQpKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGZWYWwpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbElkID09PSAnc3RhdHVzJykge1xuICAgICAgICByZXR1cm4gcC5zdGF0dXMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmVmFsKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2xJZCA9PT0gJ2V4cGVjdGVkQ2xvc2VEYXRlJykge1xuICAgICAgICByZXR1cm4gKHAuZXhwZWN0ZWRDbG9zZURhdGUgfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZlZhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgaGFuZGxlRXhwb3J0RXhjZWwgPSAoKSA9PiB7XG4gICAgY29uc3QgaGVhZGVycyA9IFtcbiAgICAgICfaqdivINm+2LHZiNqY2YcnLFxuICAgICAgJ9mG2KfZhSDZvtix2YjamNmHJyxcbiAgICAgICfaqdin2LHYtNmG2KfYsyDZgdix2YjYtCcsXG4gICAgICAn2YXYtNiq2LHbjCDZvtix2YjamNmHJyxcbiAgICAgICfZhdi12LHZgeKAjNqp2YbZhtiv2Ycg2YbZh9in24zbjCcsXG4gICAgICAn2KfYsdiy2LQg2b7Yp9uM2b7igIzZhNin24zZhiAo2LHbjNin2YQpJyxcbiAgICAgICfZiNi22LnbjNiqJyxcbiAgICAgICfYudmE2Kog2KjYp9iu2KogKNiv2LEg2LXZiNix2Kog2KjYp9iu2KopJyxcbiAgICAgICfaqdin2YbYp9mEINio2KfYstin2LHbjNin2KjbjCcsXG4gICAgICAn2qnbjNmB24zYqiDZhNuM2K8nLFxuICAgICAgJ9mG2KfZhSDZhdi52LHZgScsXG4gICAgICAn2LHZiNi0INin2LHYqtio2KfYtycsXG4gICAgICAn2YHYsdivINqp2YTbjNiv24wg2YXYp9mE24wnLFxuICAgICAgJ9mB2LHYryDaqdmE24zYr9uMINmB2YbbjCcsXG4gICAgICAn2LTZhdin2LHZhyDYp9iz2KrYudmE2KfZhSDZhdi02KrYsduMJyxcbiAgICAgICfYqtin2LHbjNiuINin24zYrNin2K8g2YHYsdi12KonLFxuICAgICAgJ9iq2KfYsduM2K4g2KrYp9uM24zYrycsXG4gICAgICAn2KrYp9ix24zYriDYqtmI2KfZgdmC4oCM2LTYr9mHINiq2K3ZiNuM2YQnLFxuICAgICAgJ9iq2KfYsduM2K4g2K/YsduM2KfZgdiqINm+24zYtCDZvtix2K/Yp9iu2KonLFxuICAgICAgJ9iq2KfYsduM2K4g2KrYrdmI24zZhCDZgti32LnbjCcsXG4gICAgICAn2KfZgtmE2KfZhSDYr9ix2K7ZiNin2LPYqtuMINmF2LTYqtix24wnLFxuICAgICAgJ9iq2YjYttuM2K3Yp9iqJ1xuICAgIF07XG5cbiAgICBjb25zdCByb3dzID0gZmlsdGVyZWRQcm9qZWN0cy5tYXAocCA9PiBbXG4gICAgICBwLmNvZGUsXG4gICAgICBwLm5hbWUsXG4gICAgICBwLnNhbGVzRXhwZXJ0IHx8ICcnLFxuICAgICAgcC5jdXN0b21lck5hbWUsXG4gICAgICBwLmVuZFVzZXIgfHwgJycsXG4gICAgICBnZXRQaXBlbGluZVZhbHVlKHAuaWQpLFxuICAgICAgcC5zdGF0dXMsXG4gICAgICBwLmxvc3NSZWFzb24gfHwgJycsXG4gICAgICBwLm1hcmtldGluZ0NoYW5uZWwgfHwgJycsXG4gICAgICBwLmxlYWRRdWFsaXR5IHx8ICcnLFxuICAgICAgcC5yZWZlcnJlck5hbWUgfHwgJycsXG4gICAgICBwLmNvbW11bmljYXRpb25NZXRob2QgfHwgJycsXG4gICAgICBwLmZpbmFuY2lhbENvbnRhY3QgfHwgJycsXG4gICAgICBwLnRlY2huaWNhbENvbnRhY3QgfHwgJycsXG4gICAgICBwLmN1c3RvbWVySW5xdWlyeU51bWJlciB8fCAnJyxcbiAgICAgIHAub3Bwb3J0dW5pdHlEYXRlIHx8IHAuY3JlYXRpb25EYXRlIHx8ICcnLFxuICAgICAgcC53aW5uaW5nRGF0ZSB8fCAnJyxcbiAgICAgIHAuYWdyZWVkRGVsaXZlcnlEYXRlIHx8ICcnLFxuICAgICAgZ2V0UHJvamVjdFByZXBheW1lbnREYXRlKHAuaWQpIHx8ICcnLFxuICAgICAgZ2V0QWN0dWFsRGVsaXZlcnlEYXRlKHAuaWQpIHx8ICcnLFxuICAgICAgcC5pdGVtc05lZWRlZD8ubWFwKGl0ZW0gPT4gYCR7aXRlbS5uYW1lfSAoJHtpdGVtLnF1YW50aXR5fSDYudiv2K8gLSAke2l0ZW0uc3VwcGx5TWV0aG9kID09PSAnT1JERVInID8gJ9iz2YHYp9ix2LQnIDogaXRlbS5zdXBwbHlNZXRob2QgPT09ICdOT05FJyA/ICfYqNiv2YjZhiDZhtuM2KfYsiDYqNmHINiq2KfZhduM2YYnIDogJ9in2YbYqNin2LEnfSlgKS5qb2luKCcgLSAnKSB8fCAnJyxcbiAgICAgIHAuZGVzY3JpcHRpb25cbiAgICBdKTtcblxuICAgIGV4cG9ydFRvQ1NWKCfar9iy2KfYsdi0X9m+2LHZiNqY2YfigIzZh9inJywgaGVhZGVycywgcm93cyk7XG4gIH07XG5cbiAgY29uc3QgZ2V0UHJvamVjdEZvbGRlcnNBbmRGaWxlcyA9IChwOiBQcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgZm9sZGVycyA9IFtcbiAgICAgIHsgaWQ6ICdjdXN0b21lcl9pbnF1aXJ5JywgbmFtZTogJ9iv2LHYrtmI2KfYs9iqINmF2LTYqtix24wg2Ygg2KfYs9iq2LnZhNin2YUg2KfZiNmE24zZhycsIGRlc2M6ICfYp9iz2YbYp9ivINiv2LHYrtmI2KfYs9iqINin2YjZhNuM2YfYjCDYp9iz2KrYudmE2KfZheKAjNmH2KfbjCDZgdmG24wg2Ygg2YXaqdin2KrYqNin2Kog2YXYtNiq2LHbjCcsIGljb25CZzogJ2JnLWluZGlnby01MCB0ZXh0LWluZGlnby02MDAgYm9yZGVyLWluZGlnby0xMDAnLCBpY29uOiBQYXBlcmNsaXAgfSxcbiAgICAgIHsgaWQ6ICdzYWxlc19wcm9mb3JtYScsIG5hbWU6ICfZvtuM2LTigIzZgdin2qnYqtmI2LHZh9inINmIINmF2YfZhtiv2LPbjCDZgdix2YjYtCcsIGRlc2M6ICfZvtuM2LTigIzZgdin2qnYqtmI2LHZh9in24wg2LXYp9iv2LEg2LTYr9mHINmB2YbbjCDZiCDZhdin2YTbjCDZiCDZvtix2YjZvtmI2LLYp9mE4oCM2YfYpycsIGljb25CZzogJ2JnLXNreS01MCB0ZXh0LXNreS02MDAgYm9yZGVyLXNreS0xMDAnLCBpY29uOiBGaWxlU3ByZWFkc2hlZXQgfSxcbiAgICAgIHsgaWQ6ICdzdXBwbGllcl9wbycsIG5hbWU6ICfYs9mB2KfYsdi02KfYqiDYrtix24zYryDYqtin2YXbjNmG4oCM2qnZhtmG2K/ar9in2YYnLCBkZXNjOiAn2LPZgdin2LHYtOKAjNmH2KfbjCDYrtix24zYryDYp9ix2LPYp9mE24wg2KjZhyDYs9in2LLZhtiv2q/Yp9mGINmIINiq2KfZhduM2YbigIzaqdmG2YbYr9qv2KfZhiDaqdin2YTYpycsIGljb25CZzogJ2JnLWFtYmVyLTUwIHRleHQtYW1iZXItNjAwIGJvcmRlci1hbWJlci0xMDAnLCBpY29uOiBCcmllZmNhc2UgfSxcbiAgICAgIHsgaWQ6ICdwYWNrYWdpbmdfZGVsaXZlcnknLCBuYW1lOiAn2KjYs9iq2YfigIzYqNmG2K/bjCDZiCDYqtit2YjbjNmEINqp2KfZhNinJywgZGVzYzogJ9m+2qnbjNmG2q8g2YTbjNiz2KrigIzZh9in24wg2LXYp9iv2LEg2LTYr9mH2Iwg2Lnaqdiz4oCM2YfYp9uMINio2LPYqtmH4oCM2KjZhtiv24wg2Ygg2KfYs9mG2KfYryDYqNin2LHZhtin2YXZhycsIGljb25CZzogJ2JnLWVtZXJhbGQtNTAgdGV4dC1lbWVyYWxkLTYwMCBib3JkZXItZW1lcmFsZC0xMDAnLCBpY29uOiBDaGVja0NpcmNsZTIgfSxcbiAgICAgIHsgaWQ6ICdmaW5hbmNpYWxfdHJhbnNhY3Rpb25zJywgbmFtZTogJ9iq2LHYp9qp2YbYtOKAjNmH2KfbjCDZhdin2YTbjCDZiCDZvtix2K/Yp9iu2KrigIzZh9inJywgZGVzYzogJ9mB24zYtOKAjNmH2KfbjCDZvtuM2LTigIzZvtix2K/Yp9iu2KrYjCDZgdin2qnYqtmI2LHZh9in24wg2LHYs9mF24wg2Ygg2KfYs9mG2KfYryDZhdin2YTbjCDZvtix2YjamNmHJywgaWNvbkJnOiAnYmctcHVycGxlLTUwIHRleHQtcHVycGxlLTYwMCBib3JkZXItcHVycGxlLTEwMCcsIGljb246IFRyZW5kaW5nVXAgfSxcbiAgICAgIHsgaWQ6ICdhZnRlcl9zYWxlcycsIG5hbWU6ICfYrtiv2YXYp9iqINm+2LMg2KfYsiDZgdix2YjYtCcsIGRlc2M6ICfYp9iz2YbYp9ivINiu2K/Zhdin2Kog2q/Yp9ix2KfZhtiq24zYjCDYqNix2q/ZhyDYqtix2K7bjNi1INqp2KfZhNinINio2LHYp9uMINiq2LnZhduM2LEg2Ygg2q/Ystin2LHYtNin2Kog2K7Ysdin2KjbjCcsIGljb25CZzogJ2JnLXRlYWwtNTAgdGV4dC10ZWFsLTYwMCBib3JkZXItdGVhbC0xMDAnLCBpY29uOiBTbGlkZXJzIH0sXG4gICAgICB7IGlkOiAnbWFudWFsX290aGVyJywgbmFtZTogJ9iz2KfbjNixINmF2K/Yp9ix2qkg2Ygg2YHYp9uM2YTigIzZh9in24wg2K/Ys9iq24wnLCBkZXNjOiAn2YXYr9in2LHaqSDZhdiq2YHYsdmC2Ycg2Ygg2YHYp9uM2YTigIzZh9in24zbjCDaqdmHINio2Ycg2LfZiNixINmF2LPYqtmC24zZhSDYr9ixINio2KfZhNinINi32KjZgtmH4oCM2KjZhtiv24wg2YbYtNiv2YfigIzYp9mG2K8nLCBpY29uQmc6ICdiZy1zbGF0ZS01MCB0ZXh0LXNsYXRlLTYwMCBib3JkZXItc2xhdGUtMTUwJywgaWNvbjogRm9sZGVyIH1cbiAgICAsXG4gICAgICB7IGlkOiAnc3VwcGxpZXJfaW5xdWlyeScsIG5hbWU6ICfYp9iz2KrYudmE2KfZhSDYp9iyINiq2KfZhduM2YbigIzaqdmG2YbYr9qv2KfZhicsIGRlc2M6ICfYp9iz2YbYp9ivINmIINmB2LHZheKAjNmH2KfbjCDYp9iz2KrYudmE2KfZhSDYp9iyINiq2KfZhduM2YbigIzaqdmG2YbYr9qv2KfZhiDYrtin2LHYrNuMINmIINiv2KfYrtmE24wnLCBpY29uQmc6ICdiZy1vcmFuZ2UtNTAgdGV4dC1vcmFuZ2UtNjAwIGJvcmRlci1vcmFuZ2UtMTAwJywgaWNvbjogQnJpZWZjYXNlIH1dO1xuXG4gICAgY29uc3QgZm9sZGVyRmlsZXM6IFJlY29yZDxzdHJpbmcsIHsgaWQ6IHN0cmluZzsgbmFtZTogc3RyaW5nOyB1cmw6IHN0cmluZzsgc2l6ZTogc3RyaW5nOyBkYXRlOiBzdHJpbmc7IHR5cGU6ICdzeXN0ZW0nIHwgJ21hbnVhbCcgfCAnYXR0YWNobWVudCc7IG9yaWdpbmFsRW50aXR5PzogYW55IH1bXT4gPSB7fTtcbiAgICBmb2xkZXJzLmZvckVhY2goZiA9PiB7XG4gICAgICBmb2xkZXJGaWxlc1tmLm5hbWVdID0gW107XG4gICAgfSk7XG5cbiAgICAvLyAxLiBDdXN0b21lciBJbnF1aXJ5ICYgUmVxdWVzdHMgKGF0dGFjaG1lbnRzKVxuICAgIGlmIChwLmF0dGFjaG1lbnRzICYmIHAuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgcC5hdHRhY2htZW50cy5mb3JFYWNoKChhdHQsIGlkeCkgPT4ge1xuICAgICAgICBmb2xkZXJGaWxlc1sn2K/Ysdiu2YjYp9iz2Kog2YXYtNiq2LHbjCDZiCDYp9iz2KrYudmE2KfZhSDYp9mI2YTbjNmHJ10ucHVzaCh7XG4gICAgICAgICAgaWQ6IGBhdHRhY2htZW50LSR7aWR4fWAsXG4gICAgICAgICAgbmFtZTogYXR0Lm5hbWUgfHwgYNmB2KfbjNmEINiv2LHYrtmI2KfYs9iqICR7aWR4ICsgMX1gLFxuICAgICAgICAgIHVybDogYXR0LnVybCxcbiAgICAgICAgICBzaXplOiAn2b7bjNmI2LPYqiDZvtix2YjamNmHJyxcbiAgICAgICAgICBkYXRlOiBwLmNyZWF0aW9uRGF0ZSB8fCAn2YXYtNiu2LUg2YbYtNiv2YcnLFxuICAgICAgICAgIHR5cGU6ICdhdHRhY2htZW50J1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDIuIFByb2Zvcm1hc1xuICAgIGNvbnN0IHByb2plY3RQcm9mb3JtYXMgPSBwcm9mb3JtYXMuZmlsdGVyKHBmID0+IHBmLnByb2plY3RJZCA9PT0gcC5pZCk7XG4gICAgcHJvamVjdFByb2Zvcm1hcy5mb3JFYWNoKHBmID0+IHtcbiAgICAgIGZvbGRlckZpbGVzWyfZvtuM2LTigIzZgdin2qnYqtmI2LHZh9inINmIINmF2YfZhtiv2LPbjCDZgdix2YjYtCddLnB1c2goe1xuICAgICAgICBpZDogYHByb2Zvcm1hLSR7cGYuaWR9YCxcbiAgICAgICAgbmFtZTogYNm+24zYtOKAjNmB2Kfaqdiq2YjYsSAke3BmLnByb2Zvcm1hTnVtYmVyfSAtINmF2LTYqtix24w6ICR7cGYuY3VzdG9tZXJOYW1lfS5wZGZgLFxuICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgc2l6ZTogYCR7cGYuaXRlbXM/Lmxlbmd0aCB8fCAwfSDYsdiv24zZgSDaqdin2YTYp2AsXG4gICAgICAgIGRhdGU6IHBmLmlzc3VlRGF0ZSxcbiAgICAgICAgdHlwZTogJ3N5c3RlbScsXG4gICAgICAgIG9yaWdpbmFsRW50aXR5OiBwZlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAzLiBQT3NcbiAgICBjb25zdCBwcm9qZWN0UE9zID0gKHB1cmNoYXNlT3JkZXJzIHx8IFtdKS5maWx0ZXIocG8gPT4gcG8ucHJvamVjdElkID09PSBwLmlkKTtcbiAgICBwcm9qZWN0UE9zLmZvckVhY2gocG8gPT4ge1xuICAgICAgZm9sZGVyRmlsZXNbJ9iz2YHYp9ix2LTYp9iqINiu2LHbjNivINiq2KfZhduM2YbigIzaqdmG2YbYr9qv2KfZhiddLnB1c2goe1xuICAgICAgICBpZDogYHBvLSR7cG8uaWR9YCxcbiAgICAgICAgbmFtZTogYNiz2YHYp9ix2LQg2K7YsduM2K8gJHtwby5wb051bWJlcn0gLSDYqtin2YXbjNmG4oCM2qnZhtmG2K/ZhzogJHtwby5zdXBwbGllck5hbWV9LnBkZmAsXG4gICAgICAgIHVybDogJyMnLFxuICAgICAgICBzaXplOiBgJHtwby5pdGVtcz8ubGVuZ3RoIHx8IDB9INix2K/bjNmBINqp2KfZhNinYCxcbiAgICAgICAgZGF0ZTogcG8ub3JkZXJEYXRlLFxuICAgICAgICB0eXBlOiAnc3lzdGVtJyxcbiAgICAgICAgb3JpZ2luYWxFbnRpdHk6IHBvXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIDMuNS4gU3VwcGxpZXIgSW5xdWlyaWVzXG4gICAgY29uc3QgcHJvamVjdElucXVpcmllcyA9IChzdXBwbGllcklucXVpcmllcyB8fCBbXSkuZmlsdGVyKGlucSA9PiBpbnEucHJvamVjdElkID09PSBwLmlkKTtcbiAgICBwcm9qZWN0SW5xdWlyaWVzLmZvckVhY2goaW5xID0+IHtcbiAgICAgIGlmIChpbnEudGVjaG5pY2FsUHJvcG9zYWxGaWxlKSB7XG4gICAgICAgIGZvbGRlckZpbGVzWyfYp9iz2KrYudmE2KfZhSDYp9iyINiq2KfZhduM2YbigIzaqdmG2YbYr9qv2KfZhiddLnB1c2goe1xuICAgICAgICAgIGlkOiBgaW5xdWlyeS10ZWNoLSR7aW5xLmlkfWAsXG4gICAgICAgICAgbmFtZTogYNm+2LHZiNm+2YjYstin2YQg2YHZhtuMIC0gJHtpbnEuc3VwcGxpZXJOYW1lIHx8ICfZhtin2YXYtNiu2LUnfSAtICR7aW5xLnRlY2huaWNhbFByb3Bvc2FsRmlsZX1gLFxuICAgICAgICAgIHVybDogJyMnLFxuICAgICAgICAgIHNpemU6IGlucS50ZWNobmljYWxQcm9wb3NhbEZpbGVTaXplIHx8ICfZhtin2YXYtNiu2LUnLFxuICAgICAgICAgIGRhdGU6IGlucS5pbnF1aXJ5RGF0ZSB8fCBpbnEuY3JlYXRlZEF0IHx8ICfZhtin2YXYtNiu2LUnLFxuICAgICAgICAgIHR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgIG9yaWdpbmFsRW50aXR5OiBpbnFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5xLmZpbmFuY2lhbFByb3Bvc2FsRmlsZSkge1xuICAgICAgICBmb2xkZXJGaWxlc1sn2KfYs9iq2LnZhNin2YUg2KfYsiDYqtin2YXbjNmG4oCM2qnZhtmG2K/ar9in2YYnXS5wdXNoKHtcbiAgICAgICAgICBpZDogYGlucXVpcnktZmluLSR7aW5xLmlkfWAsXG4gICAgICAgICAgbmFtZTogYNii2YHYsSDZhdin2YTbjCAtICR7aW5xLnN1cHBsaWVyTmFtZSB8fCAn2YbYp9mF2LTYrti1J30gLSAke2lucS5maW5hbmNpYWxQcm9wb3NhbEZpbGV9YCxcbiAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICBzaXplOiBpbnEuZmluYW5jaWFsUHJvcG9zYWxGaWxlU2l6ZSB8fCAn2YbYp9mF2LTYrti1JyxcbiAgICAgICAgICBkYXRlOiBpbnEuaW5xdWlyeURhdGUgfHwgaW5xLmNyZWF0ZWRBdCB8fCAn2YbYp9mF2LTYrti1JyxcbiAgICAgICAgICB0eXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICBvcmlnaW5hbEVudGl0eTogaW5xXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBBbHNvIGFkZCBmaWxlcyBmcm9tIHN0ZXBzXG4gICAgICBpZiAoaW5xLnN0ZXBzICYmIGlucS5zdGVwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlucS5zdGVwcy5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgICAgICAgICBpZiAoc3RlcC50ZWNobmljYWxQcm9wb3NhbEZpbGUpIHtcbiAgICAgICAgICAgICBmb2xkZXJGaWxlc1sn2KfYs9iq2LnZhNin2YUg2KfYsiDYqtin2YXbjNmG4oCM2qnZhtmG2K/ar9in2YYnXS5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogYGlucXVpcnktdGVjaC0ke2lucS5pZH0tJHtzdGVwLmlkfWAsXG4gICAgICAgICAgICAgICAgbmFtZTogYNm+2KfYs9iuINmB2YbbjCAtICR7aW5xLnN1cHBsaWVyTmFtZSB8fCAn2YbYp9mF2LTYrti1J30gLSAke3N0ZXAudGVjaG5pY2FsUHJvcG9zYWxGaWxlfWAsXG4gICAgICAgICAgICAgICAgdXJsOiAnIycsXG4gICAgICAgICAgICAgICAgc2l6ZTogc3RlcC50ZWNobmljYWxQcm9wb3NhbEZpbGVTaXplIHx8ICfZhtin2YXYtNiu2LUnLFxuICAgICAgICAgICAgICAgIGRhdGU6IHN0ZXAuZGF0ZSB8fCAn2YbYp9mF2LTYrti1JyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVudGl0eTogaW5xXG4gICAgICAgICAgICAgfSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKHN0ZXAuZmluYW5jaWFsUHJvcG9zYWxGaWxlKSB7XG4gICAgICAgICAgICAgZm9sZGVyRmlsZXNbJ9in2LPYqti52YTYp9mFINin2LIg2KrYp9mF24zZhuKAjNqp2YbZhtiv2q/Yp9mGJ10ucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IGBpbnF1aXJ5LWZpbi0ke2lucS5pZH0tJHtzdGVwLmlkfWAsXG4gICAgICAgICAgICAgICAgbmFtZTogYNm+2KfYs9iuINmF2KfZhNuMIC0gJHtpbnEuc3VwcGxpZXJOYW1lIHx8ICfZhtin2YXYtNiu2LUnfSAtICR7c3RlcC5maW5hbmNpYWxQcm9wb3NhbEZpbGV9YCxcbiAgICAgICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgICAgICBzaXplOiBzdGVwLmZpbmFuY2lhbFByb3Bvc2FsRmlsZVNpemUgfHwgJ9mG2KfZhdi02K7YtScsXG4gICAgICAgICAgICAgICAgZGF0ZTogc3RlcC5kYXRlIHx8ICfZhtin2YXYtNiu2LUnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRW50aXR5OiBpbnFcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIDQuIFBhY2thZ2luZyBEZWxpdmVyaWVzXG4gICAgY29uc3QgcHJvamVjdERlbGl2ZXJpZXMgPSAocGFja2FnaW5nRGVsaXZlcmllcyB8fCBbXSkuZmlsdGVyKGRlbCA9PiBkZWwucHJvamVjdElkID09PSBwLmlkKTtcbiAgICBwcm9qZWN0RGVsaXZlcmllcy5mb3JFYWNoKGRlbCA9PiB7XG4gICAgICBmb2xkZXJGaWxlc1sn2KjYs9iq2YfigIzYqNmG2K/bjCDZiCDYqtit2YjbjNmEINqp2KfZhNinJ10ucHVzaCh7XG4gICAgICAgIGlkOiBgZGVsaXZlcnktcGwtJHtkZWwuaWR9YCxcbiAgICAgICAgbmFtZTogYNm+2qnbjNmG2q8g2YTbjNiz2KogJHtkZWwucGFja2luZ0xpc3ROdW1iZXJ9IC0g2LHZiNi0INin2LHYs9in2YQ6ICR7ZGVsLnNoaXBwaW5nTWV0aG9kfS5wZGZgLFxuICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgc2l6ZTogYCR7ZGVsLml0ZW1zPy5sZW5ndGggfHwgMH0g2LHYr9uM2YEg2qnYp9mE2KdgLFxuICAgICAgICBkYXRlOiBkZWwuZGVsaXZlcnlEYXRlLFxuICAgICAgICB0eXBlOiAnc3lzdGVtJyxcbiAgICAgICAgb3JpZ2luYWxFbnRpdHk6IGRlbFxuICAgICAgfSk7XG4gICAgICBpZiAoZGVsLnBob3RvcyAmJiBkZWwucGhvdG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVsLnBob3Rvcy5mb3JFYWNoKChwaG90bywgaWR4KSA9PiB7XG4gICAgICAgICAgZm9sZGVyRmlsZXNbJ9io2LPYqtmH4oCM2KjZhtiv24wg2Ygg2KrYrdmI24zZhCDaqdin2YTYpyddLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGBkZWxpdmVyeS1pbWctJHtkZWwuaWR9LSR7aWR4fWAsXG4gICAgICAgICAgICBuYW1lOiBg2LnaqdizINio2LPYqtmH4oCM2KjZhtiv24wgJHtpZHggKyAxfSAtINm+2qnbjNmG2q8g2YTbjNiz2KogJHtkZWwucGFja2luZ0xpc3ROdW1iZXJ9LnBuZ2AsXG4gICAgICAgICAgICB1cmw6IHBob3RvLFxuICAgICAgICAgICAgc2l6ZTogJ9iq2LXZiNuM2LEg2KjYs9iq2YfigIzYqNmG2K/bjCcsXG4gICAgICAgICAgICBkYXRlOiBkZWwuZGVsaXZlcnlEYXRlLFxuICAgICAgICAgICAgdHlwZTogJ3N5c3RlbScsXG4gICAgICAgICAgICBvcmlnaW5hbEVudGl0eTogZGVsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gNS4gVHJhbnNhY3Rpb25zXG4gICAgY29uc3QgcHJvamVjdFRYcyA9ICh0cmFuc2FjdGlvbnMgfHwgW10pLmZpbHRlcih0eCA9PiB0eC5wcm9qZWN0SWQgPT09IHAuaWQpO1xuICAgIHByb2plY3RUWHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICBmb2xkZXJGaWxlc1sn2KrYsdin2qnZhti04oCM2YfYp9uMINmF2KfZhNuMINmIINm+2LHYr9in2K7YquKAjNmH2KcnXS5wdXNoKHtcbiAgICAgICAgaWQ6IGB0eC0ke3R4LmlkfWAsXG4gICAgICAgIG5hbWU6IGDYsdiz24zYryDYqtix2KfaqdmG2LQg2YXYp9mE24wgJHt0eC5kb2N1bWVudE51bWJlcn0gKCR7dHgudHlwZX0pLnBkZmAsXG4gICAgICAgIHVybDogJyMnLFxuICAgICAgICBzaXplOiBg2YXYqNmE2Lo6ICR7dHguYW1vdW50UklZQUw/LnRvTG9jYWxlU3RyaW5nKCdmYS1JUicpfSDYsduM2KfZhGAsXG4gICAgICAgIGRhdGU6IHR4LmRhdGUsXG4gICAgICAgIHR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICBvcmlnaW5hbEVudGl0eTogdHhcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gNi4gQWZ0ZXIgU2FsZXMgU2VydmljZXNcbiAgICBjb25zdCBwcm9qZWN0U2VydmljZXMgPSAoYWZ0ZXJTYWxlc1NlcnZpY2VzIHx8IFtdKS5maWx0ZXIoYXMgPT4gYXMucHJvamVjdElkID09PSBwLmlkKTtcbiAgICBwcm9qZWN0U2VydmljZXMuZm9yRWFjaChhcyA9PiB7XG4gICAgICBmb2xkZXJGaWxlc1sn2K7Yr9mF2KfYqiDZvtizINin2LIg2YHYsdmI2LQnXS5wdXNoKHtcbiAgICAgICAgaWQ6IGBzZXJ2aWNlLSR7YXMuaWR9YCxcbiAgICAgICAgbmFtZTogYNiu2K/Zhdin2Kog2b7YsyDYp9iyINmB2LHZiNi0IC0g2KrYrNmH24zYsjogJHthcy5pdGVtTmFtZX0ucGRmYCxcbiAgICAgICAgdXJsOiAnIycsXG4gICAgICAgIHNpemU6IGDZiNi22LnbjNiqOiAke2FzLnN0YXR1c31gLFxuICAgICAgICBkYXRlOiBhcy5zdGFydERhdGUsXG4gICAgICAgIHR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICBvcmlnaW5hbEVudGl0eTogYXNcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gNy4gTWFudWFsIERvY3VtZW50c1xuICAgIGlmIChwLm1hbnVhbERvY3VtZW50cyAmJiBwLm1hbnVhbERvY3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBwLm1hbnVhbERvY3VtZW50cy5mb3JFYWNoKGRvYyA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldEZvbGRlck5hbWUgPSBmb2xkZXJzLnNvbWUoZiA9PiBmLm5hbWUgPT09IGRvYy5mb2xkZXJOYW1lKSA/IGRvYy5mb2xkZXJOYW1lIDogJ9iz2KfbjNixINmF2K/Yp9ix2qkg2Ygg2YHYp9uM2YTigIzZh9in24wg2K/Ys9iq24wnO1xuICAgICAgICBmb2xkZXJGaWxlc1t0YXJnZXRGb2xkZXJOYW1lXS5wdXNoKHtcbiAgICAgICAgICBpZDogZG9jLmlkLFxuICAgICAgICAgIG5hbWU6IGRvYy5uYW1lLFxuICAgICAgICAgIHVybDogZG9jLnVybCxcbiAgICAgICAgICBzaXplOiBkb2Muc2l6ZSB8fCAn2KjYp9ix2q/YsNin2LHbjCDYr9iz2KrbjCcsXG4gICAgICAgICAgZGF0ZTogZG9jLmNyZWF0ZWRBdCxcbiAgICAgICAgICB0eXBlOiAnbWFudWFsJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7IGZvbGRlcnMsIGZvbGRlckZpbGVzIH07XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRmlsZVVwbG9hZCA9IGFzeW5jIChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PiwgZm9sZGVyTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcbiAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCB8fCAhc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcykgcmV0dXJuO1xuICAgIHNldElzVXBsb2FkaW5nRG9jKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwID0gc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcztcbiAgICAgIGNvbnN0IG5ld0RvY3MgPSBbLi4uKHAubWFudWFsRG9jdW1lbnRzIHx8IFtdKV07XG4gICAgICBjb25zdCBuZXdBdHRhY2htZW50cyA9IFsuLi4ocC5hdHRhY2htZW50cyB8fCBbXSldO1xuICAgICAgbGV0IHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCBhdHRhY2htZW50c1VwZGF0ZWQgPSBmYWxzZTtcblxuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIEFycmF5LmZyb20oZmlsZXMpIGFzIEZpbGVbXSkge1xuICAgICAgICBjb25zdCB1cmwgPSBhd2FpdCB1cGxvYWRGaWxlKGZpbGUpO1xuICAgICAgICBjb25zdCBkb2NJZCA9IGBkb2MtJHtEYXRlLm5vdygpfS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCA3KX1gO1xuICAgICAgICBcbiAgICAgICAgbmV3RG9jcy5wdXNoKHtcbiAgICAgICAgICBpZDogZG9jSWQsXG4gICAgICAgICAgZm9sZGVyTmFtZSxcbiAgICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgICAgdXJsLFxuICAgICAgICAgIGNyZWF0ZWRBdDogZ2V0VG9kYXlTaGFtc2koKSxcbiAgICAgICAgICBzaXplOiBgJHsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0JgXG4gICAgICAgIH0pO1xuICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoZm9sZGVyTmFtZSA9PT0gJ9iv2LHYrtmI2KfYs9iqINmF2LTYqtix24wg2Ygg2KfYs9iq2LnZhNin2YUg2KfZiNmE24zZhycpIHtcbiAgICAgICAgICBuZXdBdHRhY2htZW50cy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgICAgIHVybFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGF0dGFjaG1lbnRzVXBkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlZFByb2plY3QgPSB7XG4gICAgICAgICAgLi4ucCxcbiAgICAgICAgICBtYW51YWxEb2N1bWVudHM6IG5ld0RvY3MsXG4gICAgICAgICAgYXR0YWNobWVudHM6IGF0dGFjaG1lbnRzVXBkYXRlZCA/IG5ld0F0dGFjaG1lbnRzIDogcC5hdHRhY2htZW50c1xuICAgICAgICB9O1xuICAgICAgICB1cGRhdGVQcm9qZWN0KHVwZGF0ZWRQcm9qZWN0KTtcbiAgICAgICAgc2V0U2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcyh1cGRhdGVkUHJvamVjdCk7XG4gICAgICAgIGFsZXJ0KCfZgdin24zZhOKAjNmH2Kcg2KjYpyDZhdmI2YHZgtuM2Kog2K/YsSDZvtmI2LTZhyDZhdix2KjZiNi32Ycg2KjYp9ix2q/YsNin2LHbjCDYtNiv2YbYry4nKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgYWxlcnQoZXJyLm1lc3NhZ2UgfHwgJ9iu2LfYpyDYr9ixINio2KfYsdqv2LDYp9ix24wg2YHYp9uM2YQnKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGUudGFyZ2V0KSBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgc2V0SXNVcGxvYWRpbmdEb2MoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVGaWxlRGVsZXRlID0gKGRvY0lkOiBzdHJpbmcsIGRvY05hbWU6IHN0cmluZywgZG9jVHlwZTogJ21hbnVhbCcgfCAnYXR0YWNobWVudCcpID0+IHtcbiAgICBpZiAoIWNvbmZpcm0oYNii24zYpyDYp9iyINit2LDZgSDZgdin24zZhCBcIiR7ZG9jTmFtZX1cIiDYp9i32YXbjNmG2KfZhiDYr9in2LHbjNiv2J9gKSkgcmV0dXJuO1xuICAgIGlmICghc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcykgcmV0dXJuO1xuXG4gICAgY29uc3QgcCA9IHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXM7XG4gICAgbGV0IHVwZGF0ZWRQcm9qZWN0ID0geyAuLi5wIH07XG4gICAgaWYgKGRvY1R5cGUgPT09ICdtYW51YWwnKSB7XG4gICAgICB1cGRhdGVkUHJvamVjdC5tYW51YWxEb2N1bWVudHMgPSAocC5tYW51YWxEb2N1bWVudHMgfHwgW10pLmZpbHRlcihkb2MgPT4gZG9jLmlkICE9PSBkb2NJZCk7XG4gICAgfSBlbHNlIGlmIChkb2NUeXBlID09PSAnYXR0YWNobWVudCcpIHtcbiAgICAgIC8vIERlbGV0aW5nIGEgY3VzdG9tZXIgYXR0YWNobWVudCBhbHNvIGRlbGV0ZXMgaXQgZnJvbSBwcm9qZWN0LmF0dGFjaG1lbnRzXG4gICAgICB1cGRhdGVkUHJvamVjdC5hdHRhY2htZW50cyA9IChwLmF0dGFjaG1lbnRzIHx8IFtdKS5maWx0ZXIoKF8sIGlkeCkgPT4gYGF0dGFjaG1lbnQtJHtpZHh9YCAhPT0gZG9jSWQpO1xuICAgICAgLy8gYW5kIHJlbW92ZSBmcm9tIG1hbnVhbERvY3VtZW50cyBpZiBkdXBsaWNhdGVcbiAgICAgIHVwZGF0ZWRQcm9qZWN0Lm1hbnVhbERvY3VtZW50cyA9IChwLm1hbnVhbERvY3VtZW50cyB8fCBbXSkuZmlsdGVyKGRvYyA9PiBkb2MuaWQgIT09IGRvY0lkKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQcm9qZWN0KHVwZGF0ZWRQcm9qZWN0KTtcbiAgICBzZXRTZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzKHVwZGF0ZWRQcm9qZWN0KTtcbiAgICBhbGVydCgn2YHYp9uM2YQg2KjYpyDZhdmI2YHZgtuM2Kog2K3YsNmBINi02K8uJyk7XG4gIH07XG5cbiAgICBjb25zdCBoYW5kbGVQcmV2aWV3T3JEb3dubG9hZCA9IChkb2M6IGFueSkgPT4ge1xuICAgIGlmIChkb2MudHlwZSA9PT0gJ3N5c3RlbScpIHtcbiAgICAgIGlmIChkb2MuaWQ/LnN0YXJ0c1dpdGgoJ3Byb2Zvcm1hLScpICYmIG9uT3BlbkRvY3VtZW50KSB7XG4gICAgICAgIG9uT3BlbkRvY3VtZW50KCdwcm9mb3JtYXMnLCBkb2MuaWQucmVwbGFjZSgncHJvZm9ybWEtJywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9jLmlkPy5zdGFydHNXaXRoKCdwby0nKSAmJiBvbk9wZW5Eb2N1bWVudCkge1xuICAgICAgICBvbk9wZW5Eb2N1bWVudCgncHVyY2hhc2VPcmRlcnMnLCBkb2MuaWQucmVwbGFjZSgncG8tJywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9jLmlkPy5zdGFydHNXaXRoKCdpbnF1aXJ5LScpICYmIG9uT3BlbkRvY3VtZW50KSB7XG4gICAgICAgIC8vIEp1c3Qgc2hvdyBpdCBpbiB0aGUgZ2VuZXJpYyBwcmV2aWV3IG1vZGFsLCBub3QgdGhlIGZvcm1cbiAgICAgICAgc2V0QWN0aXZlUHJldmlld0RvYyhkb2MpO1xuICAgICAgfSBlbHNlIGlmIChkb2MuaWQ/LnN0YXJ0c1dpdGgoJ2RlbGl2ZXJ5LScpICYmIG9uT3BlbkRvY3VtZW50KSB7XG4gICAgICAgIG9uT3BlbkRvY3VtZW50KCdwYWNrYWdpbmdEZWxpdmVyeScsIGRvYy5pZC5yZXBsYWNlKCdkZWxpdmVyeS0nLCAnJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0QWN0aXZlUHJldmlld0RvYyhkb2MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkb2MudXJsICE9PSAnIycgJiYgIWRvYy51cmwuc3RhcnRzV2l0aCgnZGF0YTppbWFnZS8nKSAmJiAhZG9jLm5hbWUuZW5kc1dpdGgoJy5wbmcnKSAmJiAhZG9jLm5hbWUuZW5kc1dpdGgoJy5qcGcnKSAmJiAhZG9jLm5hbWUuZW5kc1dpdGgoJy5qcGVnJykpIHtcbiAgICAgIHdpbmRvdy5vcGVuKGRvYy51cmwsICdfYmxhbmsnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0QWN0aXZlUHJldmlld0RvYyhkb2MpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJQcm9qZWN0U3VwcGx5U3RhdHVzID0gKHByb2plY3Q6IFByb2plY3QpID0+IHtcbiAgICAvLyAxLiBHZXQgcHJvZm9ybWFzIG9mIHRoaXMgcHJvamVjdFxuICAgIGNvbnN0IHByb2plY3RQcm9mb3JtYXMgPSBwcm9mb3JtYXMuZmlsdGVyKHBmID0+IHBmLnByb2plY3RJZCA9PT0gcHJvamVjdC5pZCk7XG4gICAgXG4gICAgLy8gMi4gRmlsdGVyIHdvbiBvciBzZW1pLXdvbiBwcm9mb3JtYXNcbiAgICBjb25zdCB3b25Qcm9mb3JtYXMgPSBwcm9qZWN0UHJvZm9ybWFzLmZpbHRlcihwZiA9PiB7XG4gICAgICBjb25zdCBvdXRjb21lID0gZ2V0UHJvZm9ybWFPdXRjb21lU3RhdHVzKHBmKTtcbiAgICAgIHJldHVybiBvdXRjb21lID09PSAn2KrYo9uM24zYryDYtNiv2YcgKNio2LHZhtiv2YcpJyB8fCBvdXRjb21lID09PSAn2YbbjNmF2Ycg2KjYsdmG2K/Zhyc7XG4gICAgfSk7XG5cbiAgICAvLyAzLiBFeHRyYWN0IGl0ZW1zXG4gICAgY29uc3QgYWxsV29uSXRlbXM6IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICBwcm9kdWN0TmFtZTogc3RyaW5nO1xuICAgICAgcHJvZHVjdENvZGU6IHN0cmluZztcbiAgICAgIGJyYW5kOiBzdHJpbmc7XG4gICAgICBxdWFudGl0eTogbnVtYmVyO1xuICAgICAgc3VwcGx5TWV0aG9kOiAnSU5WRU5UT1JZJyB8ICdPUkRFUicgfCAnTk9ORSc7XG4gICAgICBwcm9mb3JtYU51bWJlcjogc3RyaW5nO1xuICAgICAgcHJvZm9ybWFJZDogc3RyaW5nO1xuICAgICAgcHJvZm9ybWFTdGF0dXM6IHN0cmluZztcbiAgICAgIG9yaWdpbmFsUHJvZm9ybWE6IFByb2Zvcm1hO1xuICAgIH1bXSA9IFtdO1xuXG4gICAgd29uUHJvZm9ybWFzLmZvckVhY2gocGYgPT4ge1xuICAgICAgbGV0IHdvbkl0ZW1zID0gW107XG4gICAgICBjb25zdCBoYXNFeHBsaWNpdFdvbiA9IHBmLml0ZW1zPy5zb21lKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09ICfYqNix2YbYr9mHJyk7XG4gICAgICBpZiAoaGFzRXhwbGljaXRXb24pIHtcbiAgICAgICAgd29uSXRlbXMgPSBwZi5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gJ9io2LHZhtiv2YcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvbkl0ZW1zID0gcGYuaXRlbXM/LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzICE9PSAn2KjYp9iy2YbYr9mHJykgfHwgW107XG4gICAgICB9XG5cbiAgICAgIHdvbkl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vIENvcnJlY3RseSByZXNvbHZlIHRoZSBzdXBwbHlNZXRob2Q6IENoZWNrIG1hdGNoaW5nIHByb2R1Y3QgZnJvbSBwcm9kdWN0cyBsaXN0XG4gICAgICAgIGNvbnN0IG1hdGNoZWRQcm9kID0gcHJvZHVjdHM/LmZpbmQocCA9PiBwLmlkID09PSBpdGVtLnByb2R1Y3RJZCB8fCBwLmNvZGUgPT09IGl0ZW0ucHJvZHVjdENvZGUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWxzbyBjaGVjayBpZiB0aGUgcHJvamVjdCBoYXMgc3BlY2lmaWVkIGEgc3VwcGx5IG1ldGhvZCBmb3IgdGhpcyBwcm9kdWN0XG4gICAgICAgIGNvbnN0IHByb2plY3RJdGVtTmVlZGVkID0gcHJvamVjdC5pdGVtc05lZWRlZD8uZmluZChpID0+IGkucHJvZHVjdElkID09PSBpdGVtLnByb2R1Y3RJZCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgcmVzb2x2ZWRTdXBwbHlNZXRob2Q6ICdJTlZFTlRPUlknIHwgJ09SREVSJyB8ICdOT05FJyA9ICdJTlZFTlRPUlknO1xuICAgICAgICBcbiAgICAgICAgaWYgKGl0ZW0uc3VwcGx5TWV0aG9kICYmIGl0ZW0uc3VwcGx5TWV0aG9kICE9PSAnSU5WRU5UT1JZJykge1xuICAgICAgICAgIHJlc29sdmVkU3VwcGx5TWV0aG9kID0gaXRlbS5zdXBwbHlNZXRob2Q7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvamVjdEl0ZW1OZWVkZWQgJiYgcHJvamVjdEl0ZW1OZWVkZWQuc3VwcGx5TWV0aG9kICYmIHByb2plY3RJdGVtTmVlZGVkLnN1cHBseU1ldGhvZCAhPT0gJ0lOVkVOVE9SWScpIHtcbiAgICAgICAgICByZXNvbHZlZFN1cHBseU1ldGhvZCA9IHByb2plY3RJdGVtTmVlZGVkLnN1cHBseU1ldGhvZDtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkUHJvZCAmJiBtYXRjaGVkUHJvZC5zdXBwbHlUeXBlID09PSAnT1JERVInKSB7XG4gICAgICAgICAgcmVzb2x2ZWRTdXBwbHlNZXRob2QgPSAnT1JERVInO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uc3VwcGx5TWV0aG9kKSB7XG4gICAgICAgICAgcmVzb2x2ZWRTdXBwbHlNZXRob2QgPSBpdGVtLnN1cHBseU1ldGhvZDtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9qZWN0SXRlbU5lZWRlZCAmJiBwcm9qZWN0SXRlbU5lZWRlZC5zdXBwbHlNZXRob2QpIHtcbiAgICAgICAgICByZXNvbHZlZFN1cHBseU1ldGhvZCA9IHByb2plY3RJdGVtTmVlZGVkLnN1cHBseU1ldGhvZDtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkUHJvZCAmJiBtYXRjaGVkUHJvZC5zdXBwbHlUeXBlKSB7XG4gICAgICAgICAgcmVzb2x2ZWRTdXBwbHlNZXRob2QgPSBtYXRjaGVkUHJvZC5zdXBwbHlUeXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWxsV29uSXRlbXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgcHJvZHVjdE5hbWU6IGl0ZW0ucHJvZHVjdE5hbWUsXG4gICAgICAgICAgcHJvZHVjdENvZGU6IGl0ZW0ucHJvZHVjdENvZGUsXG4gICAgICAgICAgYnJhbmQ6IGl0ZW0uYnJhbmQsXG4gICAgICAgICAgcXVhbnRpdHk6IGl0ZW0ucXVhbnRpdHksXG4gICAgICAgICAgc3VwcGx5TWV0aG9kOiByZXNvbHZlZFN1cHBseU1ldGhvZCxcbiAgICAgICAgICBwcm9mb3JtYU51bWJlcjogcGYucHJvZm9ybWFOdW1iZXIsXG4gICAgICAgICAgcHJvZm9ybWFJZDogcGYuaWQsXG4gICAgICAgICAgcHJvZm9ybWFTdGF0dXM6IGdldFByb2Zvcm1hT3V0Y29tZVN0YXR1cyhwZiksXG4gICAgICAgICAgb3JpZ2luYWxQcm9mb3JtYTogcGZcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIENhbGN1bGF0aW9ucyBmb3IgbWV0cmljc1xuICAgIGNvbnN0IHRvdGFsQ291bnQgPSBhbGxXb25JdGVtcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5xdWFudGl0eSwgMCk7XG4gICAgY29uc3QgaW52ZW50b3J5Q291bnQgPSBhbGxXb25JdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN1cHBseU1ldGhvZCA9PT0gJ0lOVkVOVE9SWScpLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiBhY2MgKyBpdGVtLnF1YW50aXR5LCAwKTtcbiAgICBjb25zdCBvcmRlckNvdW50ID0gYWxsV29uSXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdXBwbHlNZXRob2QgPT09ICdPUkRFUicpLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiBhY2MgKyBpdGVtLnF1YW50aXR5LCAwKTtcbiAgICBjb25zdCBub25lQ291bnQgPSBhbGxXb25JdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN1cHBseU1ldGhvZCA9PT0gJ05PTkUnKS5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5xdWFudGl0eSwgMCk7XG5cbiAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gYWxsV29uSXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgaWYgKHN1cHBseUZpbHRlciA9PT0gJ0FMTCcpIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIGl0ZW0uc3VwcGx5TWV0aG9kID09PSBzdXBwbHlGaWx0ZXI7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTYgdGV4dC1yaWdodFwiIGRpcj1cInJ0bFwiPlxuICAgICAgICB7LyogSGVscGVyIEJhbm5lciAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MCBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MCBmbGV4IGZsZXgtY29sIG1kOmZsZXgtcm93IG1kOml0ZW1zLWNlbnRlciBtZDpqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMCB0ZXh0LXhzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0yIGgtMiByb3VuZGVkLWZ1bGwgYmctc2t5LTUwMCBhbmltYXRlLXB1bHNlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Bhbj7ar9iy2KfYsdi0INmH2YjYtNmF2YbYryDZiNi22LnbjNiqINiq2KfZhduM2YYg2qnYp9mE2KfZh9in24wg2KrYp9uM24zYryDYtNiv2Ycg2b7YsdmI2pjZhzwvc3Bhbj5cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LVsxMHB4XSBtdC0xIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICDYp9uM2YYg2q/Ystin2LHYtCDYqtmF2KfZhduMINin2YLZhNin2YUg2KrYudmH2K8g2LTYr9mHINiv2LEg2b7bjNi04oCM2YHYp9qp2KrZiNix2YfYp9uMINiq2KfbjNuM2K8g2LTYr9mHICjYqNix2YbYr9mHINuM2Kcg2YbbjNmF2YfigIzYqNix2YbYr9mHKSDZhdix2KrYqNi3INio2Kcg2KfbjNmGINm+2LHZiNqY2Ycg2LHYpyDYqtit2YTbjNmEINqp2LHYr9mHINmIINmI2LbYuduM2Kog2KrYp9mF24zZhiDYotmG4oCM2YfYpyDYsdinICjYp9iyINmF2YjYrNmI2K/bjCDYp9mG2KjYp9ixINuM2Kcg2KvYqNiqINiz2YHYp9ix2LQg2K7Yp9ix2KzbjCkg2YbZhdin24zYtCDZhduM4oCM2K/Zh9ivLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNjAwIGJnLXdoaXRlIHB4LTIuNSBweS0xLjUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBzaGFkb3ctc21cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0xLjUgaC0xLjUgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Bhbj7ZvtuM2LTigIzZgdin2qnYqtmI2LHZh9in24wg2KjYsdmG2K/ZhyDYtNiv2Yc6IHt3b25Qcm9mb3JtYXMubGVuZ3RofSDYudiv2K88L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBNZXRyaWMgQ2FyZHMgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtNCBnYXAtNFwiPlxuICAgICAgICAgIHsvKiBUb3RhbCAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtNCByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBzaGFkb3ctc21cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtWzEwcHhdIGZvbnQtYm9sZFwiPtqp2YQg2KfZgtmE2KfZhSDYqti52YfYryDYtNiv2Yc8L3NwYW4+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGQgZm9udC1tb25vIHRleHQtc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAge3RvdGFsQ291bnQudG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtc2FucyBmb250LW1lZGl1bSB0ZXh0LXNsYXRlLTQwMFwiPti52K/Yrzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgYmctc2xhdGUtNTAgdGV4dC1zbGF0ZS02MDAgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICA8QnJpZWZjYXNlIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogSW52ZW50b3J5ICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTYwMCB0ZXh0LVsxMHB4XSBmb250LWJvbGRcIj7Yqtin2YXbjNmGINin2LIg2KfZhtio2KfYsSAo2YXZiNis2YjYr9uMKTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCBmb250LW1vbm8gdGV4dC1lbWVyYWxkLTYwMFwiPlxuICAgICAgICAgICAgICAgIHtpbnZlbnRvcnlDb3VudC50b0xvY2FsZVN0cmluZygnZmEtSVInKX17XCIgXCJ9XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gZm9udC1zYW5zIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICDYudiv2K8gKHt0b3RhbENvdW50ID4gMCA/IE1hdGgucm91bmQoKGludmVudG9yeUNvdW50IC8gdG90YWxDb3VudCkgKiAxMDApIDogMH3ZqilcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMi41IGJnLWVtZXJhbGQtNTAgdGV4dC1lbWVyYWxkLTYwMCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZW1lcmFsZC0xMDBcIj5cbiAgICAgICAgICAgICAgPENoZWNrQ2lyY2xlMiBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEZvcmVpZ24gT3JkZXIgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gc2hhZG93LXNtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMVwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTYwMCB0ZXh0LVsxMHB4XSBmb250LWJvbGRcIj7Ys9mB2KfYsdi0INiu2KfYsdis24wgKNiz2YHYp9ix2LTbjCk8L3NwYW4+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGQgZm9udC1tb25vIHRleHQtYW1iZXItNjAwXCI+XG4gICAgICAgICAgICAgICAge29yZGVyQ291bnQudG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9e1wiIFwifVxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtc2FucyBmb250LW1lZGl1bSB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAg2LnYr9ivICh7dG90YWxDb3VudCA+IDAgPyBNYXRoLnJvdW5kKChvcmRlckNvdW50IC8gdG90YWxDb3VudCkgKiAxMDApIDogMH3ZqilcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMi41IGJnLWFtYmVyLTUwIHRleHQtYW1iZXItNjAwIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1hbWJlci0xMDBcIj5cbiAgICAgICAgICAgICAgPFRyZW5kaW5nVXAgc2l6ZT17MTZ9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBObyBTdXBwbHkgTmVlZGVkICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1bMTBweF0gZm9udC1ib2xkXCI+2KjYr9mI2YYg2YbbjNin2LIg2KjZhyDYqtin2YXbjNmGPC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ib2xkIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIHtub25lQ291bnQudG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtc2FucyBmb250LW1lZGl1bSB0ZXh0LXNsYXRlLTQwMFwiPti52K/Yrzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgYmctc2xhdGUtNTAgdGV4dC1zbGF0ZS01MDAgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICA8WENpcmNsZSBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogRmlsdGVyIGFuZCBDb250ZW50IFRhYmxlICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICAgIHsvKiBGaWx0ZXJzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgZ2FwLTIgYmctc2xhdGUtMTAwLzcwIHAtMSByb3VuZGVkLXhsIHctZml0IGJvcmRlciBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTdXBwbHlGaWx0ZXIoJ0FMTCcpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEuNSByb3VuZGVkLWxnIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB0cmFuc2l0aW9uLWFsbCAke1xuICAgICAgICAgICAgICAgIHN1cHBseUZpbHRlciA9PT0gJ0FMTCcgPyAnYmctd2hpdGUgdGV4dC1zbGF0ZS04MDAgc2hhZG93LXNtIGJvcmRlciBib3JkZXItc2xhdGUtMjAwLzUwJyA6ICd0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTgwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgINmH2YXZhyDYp9mC2YTYp9mFICh7YWxsV29uSXRlbXMubGVuZ3RofSlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U3VwcGx5RmlsdGVyKCdJTlZFTlRPUlknKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LVsxMHB4XSBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgJHtcbiAgICAgICAgICAgICAgICBzdXBwbHlGaWx0ZXIgPT09ICdJTlZFTlRPUlknID8gJ2JnLWVtZXJhbGQtNjAwIHRleHQtd2hpdGUgc2hhZG93LXNtJyA6ICd0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTgwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgINiq2KfZhduM2YYg2KfYsiDYp9mG2KjYp9ixICh7YWxsV29uSXRlbXMuZmlsdGVyKGkgPT4gaS5zdXBwbHlNZXRob2QgPT09ICdJTlZFTlRPUlknKS5sZW5ndGh9KVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTdXBwbHlGaWx0ZXIoJ09SREVSJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC1bMTBweF0gZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsICR7XG4gICAgICAgICAgICAgICAgc3VwcGx5RmlsdGVyID09PSAnT1JERVInID8gJ2JnLWFtYmVyLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1zbScgOiAndGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS04MDAnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDYs9mB2KfYsdi0INiu2KfYsdis24wgKHthbGxXb25JdGVtcy5maWx0ZXIoaSA9PiBpLnN1cHBseU1ldGhvZCA9PT0gJ09SREVSJykubGVuZ3RofSlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U3VwcGx5RmlsdGVyKCdOT05FJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC1bMTBweF0gZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsICR7XG4gICAgICAgICAgICAgICAgc3VwcGx5RmlsdGVyID09PSAnTk9ORScgPyAnYmctc2xhdGUtNjAwIHRleHQtd2hpdGUgc2hhZG93LXNtJyA6ICd0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTgwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgINio2K/ZiNmGINmG24zYp9iyINio2Ycg2KrYp9mF24zZhiAoe2FsbFdvbkl0ZW1zLmZpbHRlcihpID0+IGkuc3VwcGx5TWV0aG9kID09PSAnTk9ORScpLmxlbmd0aH0pXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBUYWJsZSAqL31cbiAgICAgICAgICB7ZmlsdGVyZWRJdGVtcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtMTIgdGV4dC1jZW50ZXIgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBiZy1zbGF0ZS01MCByb3VuZGVkLWZ1bGwgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICA8QnJpZWZjYXNlIHNpemU9ezMyfSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS03MDAgdGV4dC14cyBmb250LWJvbGRcIj7Zh9uM2oYg2qnYp9mE2KfbjNuMINio2Kcg2LTYsdin24zYtyDZgduM2YTYqtixINuM2KfZgdiqINmG2LTYrzwvcD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS00MDAgbWF4LXcteHMgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAg2K/YsSDYp9uM2YYg2b7YsdmI2pjZhyDYp9mC2YTYp9mF24wg2KjYpyDYp9uM2YYg2LHZiNi0INiq2KfZhduM2YYg2YfZhtmI2LIg2YXYtNiu2LUg24zYpyDYqti52YfYryDZhti02K/Zh+KAjNin2YbYry5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93LXgtYXV0b1wiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MCB0ZXh0LXNsYXRlLTUwMCBmb250LWJvbGQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0xMiB0ZXh0LWNlbnRlclwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0zXCI+2YbYp9mFINqp2KfZhNinIC8g2b7Yp9ix2KrigIzZhtin2YXYqNixIC8g2KjYsdmG2K88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy00NFwiPtm+24zYtOKAjNmB2Kfaqdiq2YjYsSDZhdix2KzYuTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMyB3LTI4IHRleHQtY2VudGVyXCI+2KrYudiv2KfYryDYrNmH2Kog2KrYp9mF24zZhjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMyB3LTQwXCI+2LHZiNi0INiq2KfZhduM2YYg2qnYp9mE2Kc8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzc05hbWU9XCJkaXZpZGUteSBkaXZpZGUtc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHtmaWx0ZXJlZEl0ZW1zLm1hcCgoaXRlbSwgaWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWQgfHwgaWR4fSBjbGFzc05hbWU9XCJob3ZlcjpiZy1zbGF0ZS01MC80MCB0cmFuc2l0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXIgdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vIHRleHQtWzEwcHhdXCI+e2lkeCArIDF9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbGF0ZS04MDAgdGV4dC14c1wiPntpdGVtLnByb2R1Y3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwIGZvbnQtbWVkaXVtIGJsb2NrIG10LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2qnYryDaqdin2YTYpzogPHN0cm9uZyBjbGFzc05hbWU9XCJmb250LW1vbm9cIj57aXRlbS5wcm9kdWN0Q29kZX08L3N0cm9uZz4gLSDYqNix2YbYrzogPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMFwiPntpdGVtLmJyYW5kfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdGl2ZVByZXZpZXdEb2Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBgcHJvZm9ybWEtJHtpdGVtLnByb2Zvcm1hSWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBg2b7bjNi04oCM2YHYp9qp2KrZiNixICR7aXRlbS5wcm9mb3JtYU51bWJlcn0ucGRmYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAn2LPZhtivINiz24zYs9iq2YUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGl0ZW0ub3JpZ2luYWxQcm9mb3JtYS5pc3N1ZURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFbnRpdHk6IGl0ZW0ub3JpZ2luYWxQcm9mb3JtYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNreS02MDAgaG92ZXI6dGV4dC1za3ktNzAwIGZvbnQtYm9sZCBob3Zlcjp1bmRlcmxpbmUgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdy1maXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCLZhdi02KfZh9iv2Ycg2b7bjNi04oCM2YHYp9qp2KrZiNixINix2LPZhduMINmF2LHYrNi5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RmlsZSBzaXplPXsxM30gY2xhc3NOYW1lPVwic2hyaW5rLTBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtWzExcHhdXCI+e2l0ZW0ucHJvZm9ybWFOdW1iZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOXB4XSBmb250LW5vcm1hbCBweC0xLjUgcHktMC41IHJvdW5kZWQgYmctc2t5LTUwIHRleHQtc2t5LTcwMCBsZWFkaW5nLW5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0ucHJvZm9ybWFTdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXIgZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMCB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0ucXVhbnRpdHkudG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5zdXBwbHlNZXRob2QgPT09ICdJTlZFTlRPUlknID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHgtMi41IHB5LTEgcm91bmRlZC1mdWxsIHRleHQtWzEwcHhdIGZvbnQtZXh0cmFib2xkIGJvcmRlciBiZy1lbWVyYWxkLTUwIHRleHQtZW1lcmFsZC03MDAgYm9yZGVyLWVtZXJhbGQtMTAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdy1maXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0xLjUgaC0xLjUgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7Yqtin2YXbjNmGINin2LIg2KfZhtio2KfYsSAo2YXZiNis2YjYr9uMKTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogaXRlbS5zdXBwbHlNZXRob2QgPT09ICdPUkRFUicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0yLjUgcHktMSByb3VuZGVkLWZ1bGwgdGV4dC1bMTBweF0gZm9udC1leHRyYWJvbGQgYm9yZGVyIGJnLWFtYmVyLTUwIHRleHQtYW1iZXItNzAwIGJvcmRlci1hbWJlci0xMDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB3LWZpdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTEuNSBoLTEuNSByb3VuZGVkLWZ1bGwgYmctYW1iZXItNTAwIGFuaW1hdGUtcHVsc2VcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtiz2YHYp9ix2LQg2K7Yp9ix2KzbjDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHgtMi41IHB5LTEgcm91bmRlZC1mdWxsIHRleHQtWzEwcHhdIGZvbnQtZXh0cmFib2xkIGJvcmRlciBiZy1zbGF0ZS01MCB0ZXh0LXNsYXRlLTUwMCBib3JkZXItc2xhdGUtMjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdy1maXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0xLjUgaC0xLjUgcm91bmRlZC1mdWxsIGJnLXNsYXRlLTQwMFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2KjYr9mI2YYg2YbbjNin2LIg2KjZhyDYqtin2YXbjNmGPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQcm9qZWN0RG9jdW1lbnRzID0gKHByb2plY3Q6IFByb2plY3QpID0+IHtcbiAgICBjb25zdCB7IGZvbGRlcnMsIGZvbGRlckZpbGVzIH0gPSBnZXRQcm9qZWN0Rm9sZGVyc0FuZEZpbGVzKHByb2plY3QpO1xuXG4gICAgaWYgKHNlbGVjdGVkRm9sZGVyTmFtZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBiZy1zbGF0ZS01MCBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMCB0ZXh0LXhzXCI+2b7ZiNi02YfigIzYqNmG2K/bjCDZh9mI2LTZhdmG2K8g2YXYr9in2LHaqSDZiCDYp9iz2YbYp9ivINm+2LHZiNqY2Yc8L2gzPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LVsxMHB4XSBtdC0wLjVcIj7ZhNuM2LPYqiDYstuM2LEg2LTYp9mF2YQg2b7ZiNi02YfigIzZh9in24wg2KvYp9io2Kog2YfZhdin2YfZhtqvINio2Kcg2YXYp9qY2YjZhOKAjNmH2KfbjCDYs9uM2LPYqtmFINin2LPYqi4g2YXYs9iq2YbYr9in2Kog2KrZiNmE24zYr9i02K/ZhyDZh9ixINmF2KfamNmI2YQg2KjZhyDYtdmI2LHYqiDYrtmI2K/aqdin2LEg2K/YsSDZvtmI2LTZhyDYrtmI2K8g2KjYp9uM2q/Yp9mG24wg2YXbjOKAjNi02YjYry48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTYwMCBiZy13aGl0ZSBweC0yIHB5LTEgcm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMFwiPtqp2YQg2KfYs9mG2KfYrzoge09iamVjdC52YWx1ZXMoZm9sZGVyRmlsZXMpLnJlZHVjZSgoYWNjLCBmKSA9PiBhY2MgKyBmLmxlbmd0aCwgMCl9INmB2KfbjNmEPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGxnOmdyaWQtY29scy0zIGdhcC00XCI+XG4gICAgICAgICAgICB7Zm9sZGVycy5tYXAoKGZvbGRlcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlc0luRm9sZGVyID0gZm9sZGVyRmlsZXNbZm9sZGVyLm5hbWVdIHx8IFtdO1xuICAgICAgICAgICAgICBjb25zdCBGb2xkZXJJY29uID0gZm9sZGVyLmljb247XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAga2V5PXtmb2xkZXIuaWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZEZvbGRlck5hbWUoZm9sZGVyLm5hbWUpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctd2hpdGUgcC01IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIGhvdmVyOmJvcmRlci1za3ktNTAwIGhvdmVyOnNoYWRvdy1sZyBob3ZlcjpzaGFkb3ctc2t5LTUwMC81IHRyYW5zaXRpb24gZHVyYXRpb24tMjAwIGN1cnNvci1wb2ludGVyIGZsZXggZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIGdyb3VwXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLXN0YXJ0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BwLTIuNSByb3VuZGVkLXhsIGJvcmRlciAke2ZvbGRlci5pY29uQmd9IHRyYW5zaXRpb24tY29sb3JzIGdyb3VwLWhvdmVyOmJnLXNreS01MDAgZ3JvdXAtaG92ZXI6dGV4dC13aGl0ZSBncm91cC1ob3Zlcjpib3JkZXItdHJhbnNwYXJlbnQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJgfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb2xkZXJJY29uIHNpemU9ezE4fSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmctc2xhdGUtNTAgcHgtMiBweS0wLjUgcm91bmRlZC1tZCBncm91cC1ob3ZlcjpiZy1za3ktNTAgZ3JvdXAtaG92ZXI6dGV4dC1za3ktNjAwIHRyYW5zaXRpb24tY29sb3JzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZmlsZXNJbkZvbGRlci5sZW5ndGh9INmB2KfbjNmEXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtODAwIHRleHQteHMgZ3JvdXAtaG92ZXI6dGV4dC1za3ktNjAwIHRyYW5zaXRpb24tY29sb3JzXCI+e2ZvbGRlci5uYW1lfTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1bMTBweF0gbXQtMSBsZWFkaW5nLXJlbGF4ZWQgbGluZS1jbGFtcC0yIGgtN1wiPntmb2xkZXIuZGVzY308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTQwMCBncm91cC1ob3Zlcjp0ZXh0LXNreS02MDAgdHJhbnNpdGlvbi1jb2xvcnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+2YjYsdmI2K8g2KjZhyDZvtmI2LTZhzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0IHNpemU9ezEyfSBjbGFzc05hbWU9XCJ0cmFuc2Zvcm0gZ3JvdXAtaG92ZXI6LXRyYW5zbGF0ZS14LTEgdHJhbnNpdGlvbi10cmFuc2Zvcm1cIiAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRGb2xkZXJGaWxlcyA9IGZvbGRlckZpbGVzW3NlbGVjdGVkRm9sZGVyTmFtZV0gfHwgW107XG4gICAgY29uc3QgZm9sZGVyRGVzYyA9IGZvbGRlcnMuZmluZChmID0+IGYubmFtZSA9PT0gc2VsZWN0ZWRGb2xkZXJOYW1lKT8uZGVzYyB8fCAnJztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICB7LyogQnJlYWRjcnVtYnMgLyBCYWNrIGJ1dHRvbiAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1zdGFydCBzbTppdGVtcy1jZW50ZXIgZ2FwLTMgYmctd2hpdGUgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZEZvbGRlck5hbWUobnVsbCl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNreS02MDAgaG92ZXI6dGV4dC1za3ktNzAwIGJnLXNreS01MCBob3ZlcjpiZy1za3ktMTAwIHB4LTMgcHktMS41IHJvdW5kZWQtbGcgdHJhbnNpdGlvbiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxDaGV2cm9uUmlnaHQgc2l6ZT17MTN9IGNsYXNzTmFtZT1cInJ0bDpyb3RhdGUtMTgwXCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4+2b7ZiNi02YfigIzZh9in24wg2b7YsdmI2pjZhzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS0zMDAgdGV4dC14c1wiPi88L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMFwiPntzZWxlY3RlZEZvbGRlck5hbWV9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB3LWZ1bGwgc206dy1hdXRvXCI+XG4gICAgICAgICAgICB7LyogRmlsZSBVcGxvYWQgSW5wdXQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBmbGV4LTEgc206ZmxleC1pbml0aWFsXCI+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpc1VwbG9hZGluZ0RvY31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IGhhbmRsZUZpbGVVcGxvYWQoZSwgc2VsZWN0ZWRGb2xkZXJOYW1lKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIG9wYWNpdHktMCBjdXJzb3ItcG9pbnRlciB3LWZ1bGwgaC1mdWxsIHotMTBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHNtOnctYXV0byBweC00IHB5LTIgYmctc2t5LTUwMCBob3ZlcjpiZy1za3ktNjAwIHRleHQtd2hpdGUgcm91bmRlZC14bCB0ZXh0LXhzIGZvbnQtYm9sZCB0cmFuc2l0aW9uIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0xLjUgc2hhZG93LW1kIHNoYWRvdy1za3ktNTAwLzEwICR7aXNVcGxvYWRpbmdEb2MgPyAnb3BhY2l0eS02MCBjdXJzb3Itbm90LWFsbG93ZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpc1VwbG9hZGluZ0RvYyA/IChcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIGFuaW1hdGUtcHVsc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPExvYWRlcjIgc2l6ZT17MTR9IGNsYXNzTmFtZT1cImFuaW1hdGUtc3BpblwiIC8+XG4gICAgICAgICAgICAgICAgICAgINiv2LHYrdin2YQg2KjYp9ix2q/YsNin2LHbjC4uLlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICA8VXBsb2FkIHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgICAgICDYqNin2LHar9iw2KfYsduMINmB2KfbjNmEINis2K/bjNivXG4gICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XSBweC0xIGZvbnQtbWVkaXVtXCI+e2ZvbGRlckRlc2N9PC9wPlxuXG4gICAgICAgIHsvKiBEcmFnIGFuZCBEcm9wIFpvbmUgLyBFbXB0eSBTdGF0ZSAqL31cbiAgICAgICAge2N1cnJlbnRGb2xkZXJGaWxlcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTEyIHRleHQtY2VudGVyIHJvdW5kZWQtMnhsIGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTIwMCBob3Zlcjpib3JkZXItc2t5LTUwMCB0cmFuc2l0aW9uLWNvbG9ycyByZWxhdGl2ZSBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBzcGFjZS15LTNcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtpc1VwbG9hZGluZ0RvY31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVGaWxlVXBsb2FkKGUsIHNlbGVjdGVkRm9sZGVyTmFtZSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgb3BhY2l0eS0wIGN1cnNvci1wb2ludGVyIHctZnVsbCBoLWZ1bGwgei0xMFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgYmctc2xhdGUtNTAgcm91bmRlZC1mdWxsIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgIDxGb2xkZXIgc2l6ZT17MzJ9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNzAwIHRleHQteHMgZm9udC1ib2xkXCI+2KfbjNmGINm+2YjYtNmHINiv2LEg2K3Yp9mEINit2KfYttixINiu2KfZhNuMINin2LPYqjwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwIG1heC13LXhzIGxlYWRpbmctcmVsYXhlZFwiPtmB2KfbjNmE4oCM2YfYp9uMINiu2YjYryDYsdinINio2LHYp9uMINio2KfYsdqv2LDYp9ix24wg2K/YsSDYp9uM2YYg2b7ZiNi02Ycg2Kjaqdi024zYryDZiCDYsdmH2Kcg2qnZhtuM2K8g24zYpyDYqNixINix2YjbjCDYr9qp2YXZhyDYqNin2LHar9iw2KfYsduMINqp2YTbjNqpINqp2YbbjNivLjwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIG92ZXJmbG93LWhpZGRlbiBzaGFkb3ctc21cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3ZlcmZsb3cteC1hdXRvXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwIHRleHQtc2xhdGUtNTAwIGZvbnQtYm9sZCBib3JkZXItYiBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0xMiB0ZXh0LWNlbnRlclwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtM1wiPtmG2KfZhSDZhdiv2LHaqSAvINiz2YbYrzwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0zMlwiPtiq2KfYsduM2K4g2KfbjNis2KfYry/Yq9io2Ko8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0zIHctMzJcIj7Yp9mG2K/Yp9iy2YcgLyDZhdmG2KjYuTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0zNlwiPtmG2YjYuSDYqNin24zar9in2YbbjDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0yOCB0ZXh0LWNlbnRlclwiPti52YXZhNuM2KfYqjwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzTmFtZT1cImRpdmlkZS15IGRpdmlkZS1zbGF0ZS01MFwiPlxuICAgICAgICAgICAgICAgICAge2N1cnJlbnRGb2xkZXJGaWxlcy5tYXAoKGRvYywgaWR4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzU3lzdGVtID0gZG9jLnR5cGUgPT09ICdzeXN0ZW0nO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2RvYy5pZCB8fCBpZHh9IGNsYXNzTmFtZT1cImhvdmVyOmJnLXNsYXRlLTUwLzUwIHRyYW5zaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXIgdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vIHRleHQtWzEwcHhdXCI+e2lkeCArIDF9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgcC0xLjUgcm91bmRlZC1sZyAke2lzU3lzdGVtID8gJ2JnLXNreS01MCB0ZXh0LXNreS02MDAnIDogJ2JnLWluZGlnby01MCB0ZXh0LWluZGlnby02MDAnfSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlcmB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2RvYy5uYW1lLmVuZHNXaXRoKCcucG5nJykgfHwgZG9jLm5hbWUuZW5kc1dpdGgoJy5qcGcnKSB8fCBkb2MubmFtZS5lbmRzV2l0aCgnLmpwZWcnKSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEltYWdlSWNvbiBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGaWxlIHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNzAwIGhvdmVyOnRleHQtc2t5LTYwMCB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlciB0ZXh0LXhzXCIgb25DbGljaz17KCkgPT4gaGFuZGxlUHJldmlld09yRG93bmxvYWQoZG9jKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZG9jLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyB0ZXh0LVsxMHB4XVwiPntkb2MuZGF0ZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyB0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XVwiPntkb2Muc2l6ZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BweC0yIHB5LTAuNSByb3VuZGVkLWZ1bGwgdGV4dC1bOXB4XSBmb250LWJvbGQgYm9yZGVyICR7aXNTeXN0ZW0gPyAnYmctc2t5LTUwIHRleHQtc2t5LTcwMCBib3JkZXItc2t5LTEwMCcgOiBkb2MudHlwZSA9PT0gJ2F0dGFjaG1lbnQnID8gJ2JnLWFtYmVyLTUwIHRleHQtYW1iZXItNzAwIGJvcmRlci1hbWJlci0xMDAnIDogJ2JnLWluZGlnby01MCB0ZXh0LWluZGlnby03MDAgYm9yZGVyLWluZGlnby0xMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc1N5c3RlbSA/ICfYs9uM2LPYqtmF24wgKNiu2YjYr9qp2KfYsSknIDogZG9jLnR5cGUgPT09ICdhdHRhY2htZW50JyA/ICfZvtuM2YjYs9iqINiv2LHYrtmI2KfYs9iqJyA6ICfYotm+2YTZiNivINiv2LPYqtuMJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0xLjUganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVQcmV2aWV3T3JEb3dubG9hZChkb2MpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xLjUgaG92ZXI6Ymctc2t5LTUwIHJvdW5kZWQgdGV4dC1za3ktNjAwIGhvdmVyOnRleHQtc2t5LTcwMCB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2b7bjNi04oCM2YbZhdin24zYtCDZhdiv2LHaqVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEV5ZSBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzU3lzdGVtICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRmlsZURlbGV0ZShkb2MuaWQgfHwgJycsIGRvYy5uYW1lLCBkb2MudHlwZSBhcyBhbnkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBob3ZlcjpiZy1yZWQtNTAgcm91bmRlZCB0ZXh0LXJlZC02MDAgaG92ZXI6dGV4dC1yZWQtNzAwIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItit2LDZgVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaDIgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkb2MudXJsICE9PSAnIycgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17ZG9jLnVybH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG93bmxvYWQ9e2RvYy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xLjUgaG92ZXI6Ymctc2xhdGUtMTAwIHJvdW5kZWQgdGV4dC1zbGF0ZS02MDAgaG92ZXI6dGV4dC1zbGF0ZS04MDAgdHJhbnNpdGlvbiBmbGV4IGl0ZW1zLWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2K/Yp9mG2YTZiNivINmF2LPYqtmC24zZhVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEb3dubG9hZCBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRG9jdW1lbnRQcmV2aWV3TW9kYWwgPSAoKSA9PiB7XG4gICAgaWYgKCFhY3RpdmVQcmV2aWV3RG9jKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGRvYyA9IGFjdGl2ZVByZXZpZXdEb2M7XG4gICAgY29uc3QgaXNJbWFnZSA9IGRvYy51cmwgJiYgZG9jLnVybC5zdGFydHNXaXRoKCdkYXRhOmltYWdlLycpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCBiZy1zbGF0ZS05NTAvODAgYmFja2Ryb3AtYmx1ci1zbSB6LVsxMDBdIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtNFwiIGRpcj1cInJ0bFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHctZnVsbCBtYXgtdy00eGwgcm91bmRlZC0yeGwgc2hhZG93LTJ4bCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBvdmVyZmxvdy1oaWRkZW4gZmxleCBmbGV4LWNvbCBteS04IG1heC1oLVs5MHZoXVwiPlxuICAgICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAgdGV4dC13aGl0ZSBwLTQgZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPEZpbGUgc2l6ZT17MTh9IGNsYXNzTmFtZT1cInRleHQtc2t5LTQwMFwiIC8+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbVwiPntkb2MubmFtZX08L2gzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIHtkb2MudXJsICE9PSAnIycgJiYgKFxuICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICBocmVmPXtkb2MudXJsfVxuICAgICAgICAgICAgICAgICAgZG93bmxvYWQ9e2RvYy5uYW1lfVxuICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXdoaXRlIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPERvd25sb2FkIHNpemU9ezEzfSAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+2K/Yp9mG2YTZiNivINmB2KfbjNmEPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHByaW50Q29udGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpbnRhYmxlLWRvY3VtZW50LWNvbnRlbnQnKT8uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgaWYgKHByaW50Q29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJpbnRXaW5kb3cgPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJpbnRXaW5kb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICBwcmludFdpbmRvdy5kb2N1bWVudC53cml0ZShgXG4gICAgICAgICAgICAgICAgICAgICAgICA8aHRtbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRpdGxlPiR7ZG9jLm5hbWV9PC90aXRsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluayBocmVmPVwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS90YWlsd2luZGNzc0AyLjIuMTkvZGlzdC90YWlsd2luZC5taW4uY3NzXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgeyBmb250LWZhbWlseTogJ1RhaG9tYScsIHNhbnMtc2VyaWY7IGRpcmVjdGlvbjogcnRsOyB0ZXh0LWFsaWduOiByaWdodDsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1lZGlhIHByaW50IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5vLXByaW50IHsgZGlzcGxheTogbm9uZTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJvZHkgY2xhc3M9XCJwLTggYmctd2hpdGUgdGV4dC1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ByaW50Q29udGVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNjcmlwdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnByaW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2JvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2h0bWw+XG4gICAgICAgICAgICAgICAgICAgICAgYCk7XG4gICAgICAgICAgICAgICAgICAgICAgcHJpbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgYmctc2t5LTUwMCBob3ZlcjpiZy1za3ktNjAwIHRleHQtd2hpdGUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYm9sZCB0cmFuc2l0aW9uIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuPtqG2KfZviDYs9mG2K88L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlUHJldmlld0RvYyhudWxsKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBob3ZlcjpiZy1zbGF0ZS04MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uIHRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFggc2l6ZT17MTh9IC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogQ29udGVudCBTY3JvbGxhYmxlIGFyZWEgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIHAtNiBiZy1zbGF0ZS01MCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicHJpbnRhYmxlLWRvY3VtZW50LWNvbnRlbnRcIiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTggcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBzaGFkb3ctc20gbXgtYXV0byBtYXgtdy0zeGwgbWluLWgtWzUwMHB4XSB0ZXh0LXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICB7aXNJbWFnZSA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2RvYy51cmx9IGFsdD17ZG9jLm5hbWV9IGNsYXNzTmFtZT1cIm1heC13LWZ1bGwgbWF4LWgtWzYwdmhdIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgc2hhZG93LXNtIG9iamVjdC1jb250YWluXCIgcmVmZXJyZXJQb2xpY3k9XCJuby1yZWZlcnJlclwiIC8+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMCBmb250LW1vbm9cIj7Yp9mG2K/Yp9iy2Yc6IHtkb2Muc2l6ZX0gLSDYqtin2LHbjNiuINir2KjYqjoge2RvYy5kYXRlfTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IGRvYy5pZD8uc3RhcnRzV2l0aCgncHJvZm9ybWEtJykgPyAoXG4gICAgICAgICAgICAgICAgLy8gMS4gUHJvZm9ybWEgUHJldmlld1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHBiLTQgYm9yZGVyLWItMiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtYmFzZSBmb250LWJvbGQgdGV4dC1zbGF0ZS05MDBcIj7ZvtuM2LTigIzZgdin2qnYqtmI2LEg2LHYs9mF24wg2YHYsdmI2LQg2qnYp9mE2Kc8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtWzEwcHhdXCI+2LTYsdqp2Kog2KfYqNiy2KfYsSDYqtin2YXbjNmGINi52LHYtNuM2KcgKNmI2KfYrdivINmF2KfZhNuMINmIINmF2YfZhtiv2LPbjCDZgdix2YjYtCk8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHNwYWNlLXktMSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gdGV4dC1sZWZ0XCIgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5Obzoge2RvYy5vcmlnaW5hbEVudGl0eT8ucHJvZm9ybWFOdW1iZXJ9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5EYXRlOiB7ZG9jLm9yaWdpbmFsRW50aXR5Py5pc3N1ZURhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5TdGF0dXM6IHtkb2Mub3JpZ2luYWxFbnRpdHk/LnN0YXR1c308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00IGJnLXNsYXRlLTUwIHAtMyByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2K7YsduM2K/Yp9ixIC8g2qnYp9ix2YHYsdmF2Kc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtYm9sZCBtci0xXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8uY3VzdG9tZXJOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2qnYp9ix2LTZhtin2LMg2YXYs9im2YjZhDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1ib2xkIG1yLTFcIj57c2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcz8uc2FsZXNFeHBlcnQgfHwgJ9mF2LTYrti1INmG2LTYr9mHJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCBib3JkZXItY29sbGFwc2UgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJiZy1zbGF0ZS0xMDAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTIwMCBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgdy0xMFwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj7YtNix2K0g2qnYp9mE2KcgLyDYrtiv2YXYp9iqPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgdy0xNlwiPtiq2LnYr9in2K88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWxlZnRcIj7ZgtuM2YXYqiDZiNin2K3YryAo2LHbjNin2YQpPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1sZWZ0XCI+2YLbjNmF2Kog2qnZhCAo2LHbjNin2YQpPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAge2RvYy5vcmlnaW5hbEVudGl0eT8uaXRlbXM/Lm1hcCgoaXRlbTogYW55LCBpZHg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aWR4fSBjbGFzc05hbWU9XCJib3JkZXItYiBib3JkZXItc2xhdGUtMTUwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgZm9udC1tb25vXCI+e2lkeCArIDF9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMFwiPntpdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2KjYsdmG2K86IHtpdGVtLmJyYW5kIHx8ICfZhdiq2YHYsdmC2YcnfSAtINm+2KfYsdiq4oCM2YbYp9mF2KjYsToge2l0ZW0ucGFydE51bWJlciB8fCAnLSd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHRleHQtY2VudGVyIGZvbnQtbW9ub1wiPntpdGVtLnF1YW50aXR5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1sZWZ0IGZvbnQtbW9ub1wiPntpdGVtLnVuaXRQcmljZT8udG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWxlZnQgZm9udC1tb25vXCI+eyhpdGVtLnVuaXRQcmljZSAqIGl0ZW0ucXVhbnRpdHkpPy50b0xvY2FsZVN0cmluZygnZmEtSVInKX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWVuZFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctNjQgc3BhY2UteS0xLjUgdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgcGItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2YXYrNmF2YjYuSDZhtin2K7Yp9mE2LU6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8udG90YWxBbW91bnQ/LnRvTG9jYWxlU3RyaW5nKCdmYS1JUicpfSDYsduM2KfZhDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgcGItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2KrYrtmB24zZgTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1yZWQtNjAwXCI+eyhkb2Mub3JpZ2luYWxFbnRpdHk/LmRpc2NvdW50QW1vdW50IHx8IDApPy50b0xvY2FsZVN0cmluZygnZmEtSVInKX0g2LHbjNin2YQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBib3JkZXItYiBib3JkZXItc2xhdGUtMTAwIHBiLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGZvbnQtYm9sZFwiPtmF2KfZhNuM2KfYqiDYqNixINin2LHYsti0INin2YHYstmI2K/ZhyAo27HbsNmqKTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm9cIj57KGRvYy5vcmlnaW5hbEVudGl0eT8udmF0QW1vdW50IHx8IDApPy50b0xvY2FsZVN0cmluZygnZmEtSVInKX0g2LHbjNin2YQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBmb250LWJvbGQgdGV4dC1zbGF0ZS05MDAgYm9yZGVyLWItMiBib3JkZXItc2xhdGUtMzAwIHBiLTEuNSB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7Zhdio2YTYuiDZgtin2KjZhCDZvtix2K/Yp9iu2Ko6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8uZmluYWxBbW91bnQ/LnRvTG9jYWxlU3RyaW5nKCdmYS1JUicpfSDYsduM2KfZhDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00IHB0LTEwIHRleHQtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2YXZh9ixINmIINin2YXYttin24wg2KjYrti0INmF2KfZhNuMINi02LHaqdiqPC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yMCB3LTMyIG14LWF1dG8gYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgbXQtMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOHB4XSByb3RhdGUtMTJcIj7Yp9mF2LbYpyDZiCDZhdmH2LEg2YXYudiq2KjYsTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2YXZh9ixINmIINiq2KfbjNuM2K8g2K7YsduM2K/Yp9ixPC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yMCB3LTMyIG14LWF1dG8gYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgbXQtMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOHB4XVwiPtmF2K3ZhCDYp9mF2LbYp9uMINiu2LHbjNiv2KfYsTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IGRvYy5pZD8uc3RhcnRzV2l0aCgncG8tJykgPyAoXG4gICAgICAgICAgICAgICAgLy8gMi4gUE8gUHJldmlld1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHBiLTQgYm9yZGVyLWItMiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtYmFzZSBmb250LWJvbGQgdGV4dC1zbGF0ZS05MDBcIj7Ys9mB2KfYsdi0INix2LPZhduMINiu2LHbjNivINqp2KfZhNinIChQTyk8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtWzEwcHhdXCI+2YjYp9it2K8g2KrYp9mF24zZhiDZiCDYqNin2LLYsdqv2KfZhtuMINiu2KfYsdis24wv2K/Yp9iu2YTbjDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gc3BhY2UteS0xIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyB0ZXh0LWxlZnRcIiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlBPIE5vOiB7ZG9jLm9yaWdpbmFsRW50aXR5Py5wb051bWJlcn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRhdGU6IHtkb2Mub3JpZ2luYWxFbnRpdHk/Lm9yZGVyRGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlN0YXR1czoge2RvYy5vcmlnaW5hbEVudGl0eT8uc3RhdHVzfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTQgYmctc2xhdGUtNTAgcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Yqtin2YXbjNmG4oCM2qnZhtmG2K/ZhyAvINiz2KfYstmG2K/Zhzo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1ib2xkIG1yLTFcIj57ZG9jLm9yaWdpbmFsRW50aXR5Py5zdXBwbGllck5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Yp9ix2LIg2YXYqNin2K/ZhNin2KrbjDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1ib2xkIG1yLTFcIj57ZG9jLm9yaWdpbmFsRW50aXR5Py5jdXJyZW5jeX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCBib3JkZXItY29sbGFwc2UgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJiZy1zbGF0ZS0xMDAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTIwMCBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgdy0xMFwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj7Zhtin2YUg2qnYp9mE2KcgLyDZvtin2LHYquKAjNmG2KfZhdio2LE8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWNlbnRlciB3LTE2XCI+2KrYudiv2KfYrzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0yIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHRleHQtbGVmdFwiPtmC24zZhdiqINin2LHYstuMINmI2KfYrdivPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1sZWZ0XCI+2YLbjNmF2Kog2KfYsdiy24wg2qnZhDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgIHtkb2Mub3JpZ2luYWxFbnRpdHk/Lml0ZW1zPy5tYXAoKGl0ZW06IGFueSwgaWR4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2lkeH0gY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTE1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHRleHQtY2VudGVyIGZvbnQtbW9ub1wiPntpZHggKyAxfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbGF0ZS04MDBcIj57aXRlbS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBibG9ja1wiPtio2LHZhtivOiB7aXRlbS5icmFuZCB8fCAnLSd9IC0g2b7Yp9ix2KrigIzZhtin2YXYqNixOiB7aXRlbS5wYXJ0TnVtYmVyIHx8ICctJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgZm9udC1tb25vXCI+e2l0ZW0ucXVhbnRpdHl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWxlZnQgZm9udC1tb25vXCI+e2l0ZW0uZm9yZWlnblVuaXRQcmljZT8udG9Mb2NhbGVTdHJpbmcoJ2ZhLUlSJyl9IHtkb2Mub3JpZ2luYWxFbnRpdHk/LmN1cnJlbmN5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1sZWZ0IGZvbnQtbW9ub1wiPnsoaXRlbS5mb3JlaWduVW5pdFByaWNlICogaXRlbS5xdWFudGl0eSk/LnRvTG9jYWxlU3RyaW5nKCdmYS1JUicpfSB7ZG9jLm9yaWdpbmFsRW50aXR5Py5jdXJyZW5jeX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHB0LTggdGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGRcIj7YtNix2KfbjNi3INm+2LHYr9in2K7Yqjo8L3NwYW4+IHtkb2Mub3JpZ2luYWxFbnRpdHk/LnBheW1lbnRUZXJtcyB8fCAn2LfYqNmCINiq2YjYp9mB2YInfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGRcIj7Zhdiv2Kog2KrYrdmI24zZhDo8L3NwYW4+IHtkb2Mub3JpZ2luYWxFbnRpdHk/LmRlbGl2ZXJ5TGVhZFRpbWUgfHwgJ9mF2LTYrti1INmG2LTYr9mHJ308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMCB3LTQ4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHA+2KfZhdi22Kcg2qnYp9ix2LTZhtin2LMg2KjYp9iy2LHar9in2YbbjDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IGRvYy5pZD8uc3RhcnRzV2l0aCgnZGVsaXZlcnktJykgPyAoXG4gICAgICAgICAgICAgICAgLy8gMy4gUGFja2FnaW5nICYgUGFja2luZyBMaXN0IFByZXZpZXdcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNiB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBwYi00IGJvcmRlci1iLTIgYm9yZGVyLXNsYXRlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1ib2xkIHRleHQtc2xhdGUtOTAwXCI+2LPZhtivINix2LPZhduMINm+2qnbjNmG2q8g2YTbjNiz2KogKFBhY2tpbmcgTGlzdCk8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtWzEwcHhdXCI+2YjYp9it2K8g2KfZhtio2KfYsSDZiCDZhNis2LPYqtuM2qkg2qnYp9mE2Kc8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHNwYWNlLXktMSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gdGV4dC1sZWZ0XCIgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5QYWNraW5nIE5vOiB7ZG9jLm9yaWdpbmFsRW50aXR5Py5wYWNraW5nTGlzdE51bWJlcn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PkRlbGl2ZXJ5IERhdGU6IHtkb2Mub3JpZ2luYWxFbnRpdHk/LmRlbGl2ZXJ5RGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlNoaXBwaW5nIE1ldGhvZDoge2RvYy5vcmlnaW5hbEVudGl0eT8uc2hpcHBpbmdNZXRob2R9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMyBnYXAtNCBiZy1zbGF0ZS01MCBwLTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMCB0ZXh0LVsxMXB4XVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGZvbnQtYm9sZFwiPtiq2LnYr9in2K8g2qnZhCDaqdin2LHYqtmGL9io2LPYqtmHOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTgwMCBmb250LWJvbGQgbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/LmJveENvdW50fSDYudiv2K88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGZvbnQtYm9sZFwiPtmI2LLZhiDZhtin2K7Yp9mE2LUg2qnZhCAo2qnbjNmE2Yjar9ix2YUpOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTgwMCBmb250LWJvbGQgbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/Lmdyb3NzV2VpZ2h0S2d9INqp24zZhNmI2q/YsdmFPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Yp9io2LnYp9ivINit2K/ZiNiv24wg2KjYs9iq2YfigIzZh9inOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTgwMCBmb250LWJvbGQgbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/LmRpbWVuc2lvbnNDbSB8fCAn2KfYs9iq2KfZhtiv2KfYsdivJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCBib3JkZXItY29sbGFwc2UgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJiZy1zbGF0ZS0xMDAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTIwMCBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgdy0xMFwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDBcIj7Zhtin2YUg2KrYrNmH24zYsiAvINqp2KfZhNinPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXJcIj7Yqti52K/Yp9ivINiz2YHYp9ix2LQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWNlbnRlclwiPtiq2LnYr9in2K8g2KLZhdin2K/Zh+KAjNiz2KfYstuMPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXJcIj7YqNiz2KrZh+KAjNio2YbYr9uMINqp2KfZhdmE2J88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICB7ZG9jLm9yaWdpbmFsRW50aXR5Py5pdGVtcz8ubWFwKChpdGVtOiBhbnksIGlkeDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpZHh9IGNsYXNzTmFtZT1cImJvcmRlci1iIGJvcmRlci1zbGF0ZS0xNTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWNlbnRlciBmb250LW1vbm9cIj57aWR4ICsgMX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMFwiPntpdGVtLm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LWNlbnRlciBmb250LW1vbm9cIj57aXRlbS5vcmRlcmVkUXR5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgZm9udC1tb25vXCI+e2l0ZW0ucGFja2VkUXR5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgdGV4dC1jZW50ZXIgdGV4dC1lbWVyYWxkLTYwMCBmb250LWJvbGRcIj57aXRlbS5pc1BhY2tlZCA/ICfinJMg2KjZhNmHJyA6ICfinJcg2K7bjNixJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNCBwdC04IHRleHQtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2KrYp9uM24zYr9qp2YbZhtiv2Ycg2LXYrdiqINio2LPYqtmH4oCM2KjZhtiv24wgKNmF2LPYptmI2YQg2KfZhtio2KfYsSk8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTE0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtqv24zYsdmG2K/ZhyDZhtmH2KfbjNuMINqp2KfZhNinIC8g2qnYp9ix2YHYsdmF2Kc8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTE0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiBkb2MuaWQ/LnN0YXJ0c1dpdGgoJ3R4LScpID8gKFxuICAgICAgICAgICAgICAgIC8vIDQuIEZpbmFuY2lhbCBUcmFuc2FjdGlvbiBSZWNlaXB0IFByZXZpZXdcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNiB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBwYi00IGJvcmRlci1iLTIgYm9yZGVyLXNsYXRlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1ib2xkIHRleHQtc2xhdGUtOTAwXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8udHlwZSA9PT0gJ9iv2LHbjNin2YHYqicgPyAn2LHYs9uM2K8g2K/YsduM2KfZgdiqINmI2KzZhyAo2LPZhtivINio2LPYqtin2Ybaqdin2LEpJyA6ICfYs9mG2K8g2b7Ysdiv2KfYrtiqINmI2KzZhyAo2LPZhtivINio2K/Zh9qp2KfYsSknfTwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1bMTBweF1cIj7Yp9mF2YjYsSDZhdin2YTbjCDZiCDYrtiy2KfZhtmH4oCM2K/Yp9ix24wg2LnYsdi024zYpzwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gc3BhY2UteS0xIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyB0ZXh0LWxlZnRcIiBkaXI9XCJsdHJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlZvdWNoZXIgTm86IHtkb2Mub3JpZ2luYWxFbnRpdHk/LmRvY3VtZW50TnVtYmVyfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXY+RGF0ZToge2RvYy5vcmlnaW5hbEVudGl0eT8uZGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlJlZiBObzoge2RvYy5vcmlnaW5hbEVudGl0eT8ucmVmZXJlbmNlTnVtYmVyIHx8ICctJ308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgYmctc2xhdGUtNTAgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgdGV4dC1zbGF0ZS03MDAgdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Zhdio2YTYuiDYqtix2KfaqdmG2LQ6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS05MDAgdGV4dC1zbSBmb250LW1vbm8gbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/LmFtb3VudFJJWUFMPy50b0xvY2FsZVN0cmluZygnZmEtSVInKX0g2LHbjNin2YQ8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2YbZiNi5INm+2LHYr9in2K7Yqi/Yr9ix24zYp9mB2Ko6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtYm9sZCBtci0xXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8ucGF5bWVudFR5cGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge2RvYy5vcmlnaW5hbEVudGl0eT8uYmFua05hbWUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Zhtin2YUg2KjYp9mG2qkg2YXYqNiv2Kcv2YXZgti12K86PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/LmJhbmtOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7YtNix2K0g2KrYsdin2qnZhti0INmIINio2KfYqNiqOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTgwMCBtci0xIGlubGluZVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/Lm5vdGVzIHx8ICfYqNiv2YjZhiDYqNin2KjYqid9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB0LTEyIHRleHQtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwIGZsZXgganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2KrYrdmI24zZhOKAjNiv2YfZhtiv2Ycg2LPZhtivIC8g2b7Ysdiv2KfYrtiq4oCM2qnZhtmG2K/ZhzwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2YXYr9uM2LEg2K7Ystin2YbZh+KAjNiv2KfYsduMINmIINin2YXZiNixINmF2KfZhNuMPC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0xNFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogZG9jLmlkPy5zdGFydHNXaXRoKCdzZXJ2aWNlLScpID8gKFxuICAgICAgICAgICAgICAgIC8vIDUuIEFmdGVyLVNhbGVzIFNlcnZpY2UgUHJldmlld1xuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS02IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHBiLTQgYm9yZGVyLWItMiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtYmFzZSBmb250LWJvbGQgdGV4dC1zbGF0ZS05MDBcIj7YqNix2q/ZhyDar9iy2KfYsdi0INiu2K/Zhdin2Kog2b7YsyDYp9iyINmB2LHZiNi0INmIINqv2KfYsdin2YbYqtuMPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LVsxMHB4XVwiPtiv2b7Yp9ix2KrZhdin2YYg2YXZh9mG2K/Ys9uMINiu2K/Zhdin2Kog2Ygg2b7YtNiq24zYqNin2YbbjCDZgdmG24w8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHNwYWNlLXktMSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gdGV4dC1sZWZ0XCIgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5TZXJ2aWNlIElEOiB7ZG9jLm9yaWdpbmFsRW50aXR5Py5pZH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlN0YXJ0IERhdGU6IHtkb2Mub3JpZ2luYWxFbnRpdHk/LnN0YXJ0RGF0ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlN0YXR1czoge2RvYy5vcmlnaW5hbEVudGl0eT8uc3RhdHVzfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTQgYmctc2xhdGUtNTAgcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGRcIj7Yqtis2YfbjNiyINin2LHYrNin2LnbjDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1ib2xkIG1yLTFcIj57ZG9jLm9yaWdpbmFsRW50aXR5Py5pdGVtTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGZvbnQtYm9sZFwiPtio2LHZhtivIC8g2YXYr9mEOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTgwMCBmb250LWJvbGQgbXItMVwiPntkb2Mub3JpZ2luYWxFbnRpdHk/Lml0ZW1CcmFuZCB8fCAn2YXYtNiu2LUg2YbYtNiv2YcnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMCBibG9jayBib3JkZXItYiBib3JkZXItc2xhdGUtMTAwIHBiLTEuNSBtYi0xLjVcIj7YtNix2K0g2KfbjNix2KfYryDar9iy2KfYsdi0INi02K/ZhyDYqtmI2LPYtyDaqdin2LHZgdix2YXYpzo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS02MDAgbGVhZGluZy1yZWxheGVkIHRleHQtWzExcHhdXCI+e2RvYy5vcmlnaW5hbEVudGl0eT8uaXNzdWVEZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0xNTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1lbWVyYWxkLTgwMCBibG9jayBib3JkZXItYiBib3JkZXItc2xhdGUtMTAwIHBiLTEuNSBtYi0xLjVcIj7Yp9mC2K/Yp9mF2KfYqiDYp9mG2KzYp9mF4oCM2LTYr9mHINiq2YjYs9i3INiv2b7Yp9ix2KrZhdin2YYg2YHZhtuMOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTYwMCBsZWFkaW5nLXJlbGF4ZWQgdGV4dC1bMTFweF1cIj57ZG9jLm9yaWdpbmFsRW50aXR5Py5hY3Rpb25zVGFrZW4gfHwgJ9iv2LEg2K3Yp9mEINi524zYqOKAjNuM2KfYqNuMINqp2KfZhNinJ308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNCBwdC04IHRleHQtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2KrYp9uM24zYr9qp2YbZhtiv2Ycg2YHZhtuMINmIINqp2KfYsdi02YbYp9izINm+2LTYqtuM2KjYp9mG24w8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTE0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtin2YXYttin24wg2YbZhdin24zZhtiv2Ycg2K7YsduM2K/Yp9ixICjYqtit2YjbjNmE4oCM2q/bjNix2YbYr9mHKTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LTEwIHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgYmctc2xhdGUtMTAwIHJvdW5kZWQtZnVsbCB0ZXh0LXNsYXRlLTQwMCB3LTE2IGgtMTYgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbXgtYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICA8RmlsZSBzaXplPXszMn0gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTgwMFwiPntkb2MubmFtZX08L2g0PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMFwiPtin24zZhiDZgdin24zZhCDYqNinINmF2YjZgdmC24zYqiDYqNmHINi12YjYsdiqINiv2LPYqtuMINio2KfYsdqv2LDYp9ix24wg2LTYr9mHINin2LPYqi48L3A+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMCBmb250LW1vbm9cIj7Yp9mG2K/Yp9iy2Yc6IHtkb2Muc2l6ZX0gLSDYqtin2LHbjNiuINir2KjYqjoge2RvYy5kYXRlfTwvcD5cbiAgICAgICAgICAgICAgICAgIHtkb2MudXJsICYmIGRvYy51cmwgIT09ICcjJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtNFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXtkb2MudXJsfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNiBweS0yLjUgYmctc2t5LTUwMCBob3ZlcjpiZy1za3ktNjAwIHRleHQtd2hpdGUgcm91bmRlZC14bCB0ZXh0LXhzIGZvbnQtYm9sZCB0cmFuc2l0aW9uIHNoYWRvdy1tZCBzaGFkb3ctc2t5LTUwMC8xMFwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAg2K/Yp9mG2YTZiNivINmIINio2KfYstqp2LHYr9mGINmF2LPYqtmC24zZhSDZgdin24zZhFxuICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBnZXRTdGF0dXNDb2xvciA9IChzdDogUHJvamVjdFsnc3RhdHVzJ10pID0+IHtcbiAgICBzd2l0Y2ggKHN0KSB7XG4gICAgICBjYXNlICfYrNiv24zYryc6IHJldHVybiAnYmctc2xhdGUtMTAwIHRleHQtc2xhdGUtNzAwIGJvcmRlci1zbGF0ZS0yMDAnO1xuICAgICAgY2FzZSAn2K/YsSDYrdin2YQg2YXYsNin2qnYsdmHJzogcmV0dXJuICdiZy1ibHVlLTUwIHRleHQtYmx1ZS03MDAgYm9yZGVyLWJsdWUtMjAwJztcbiAgICAgIGNhc2UgJ9in2LHYp9im2Ycg2b7bjNi04oCM2YHYp9qp2KrZiNixJzogcmV0dXJuICdiZy1za3ktNTAgdGV4dC1za3ktNzAwIGJvcmRlci1za3ktMjAwJztcbiAgICAgIGNhc2UgJ9io2LHZhtiv2YcgKNmF2YjZgdmCKSc6IHJldHVybiAnYmctZW1lcmFsZC01MCB0ZXh0LWVtZXJhbGQtNzAwIGJvcmRlci1lbWVyYWxkLTIwMCc7XG4gICAgICBjYXNlICfYqNin2K7YqtmHJzogcmV0dXJuICdiZy1yZWQtNTAgdGV4dC1yZWQtNzAwIGJvcmRlci1yZWQtMjAwJztcbiAgICAgIGNhc2UgJ9mE2LrZiCDYtNiv2YcnOiByZXR1cm4gJ2JnLWFtYmVyLTUwIHRleHQtYW1iZXItNzAwIGJvcmRlci1hbWJlci0yMDAnO1xuICAgICAgY2FzZSAn2YbbjNmF2Ycg2KjYsdmG2K/Zhyc6IHJldHVybiAnYmctcHVycGxlLTUwIHRleHQtcHVycGxlLTcwMCBib3JkZXItcHVycGxlLTIwMCc7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTYgYW5pbWF0ZS1mYWRlLWluXCI+XG4gICAgICBcbiAgICAgIHsvKiBQYWdlIEhlYWRlciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtc3RhcnQgbWQ6aXRlbXMtY2VudGVyIGdhcC00IGJnLXdoaXRlIHAtNiByb3VuZGVkLTJ4bCBzaGFkb3ctc20gYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDBcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtc2xhdGUtOTAwXCI+2b7YsdmI2pjZh+KAjNmH2Kcg2Ygg2YXZhtin2YLYtdin2Kog2KrYrNin2LHbjDwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1zbSBtdC0xXCI+2LHZh9qv24zYsduMINmF2YbYp9mC2LXYp9iq2Iwg2K7YtyDZhNmI2YTZhyDZgdix2LXYquKAjNmH2KfbjCDZgdix2YjYtNiMINio2LHYotmI2LHYryDYp9ix2LLYtCDZhdin2YTbjCDZgtix2KfYsdiv2KfYr9mH2Kcg2Ygg2LTYp9mG2LMg2YXZiNmB2YLbjNiqINii2YbZh9inPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMiB3LWZ1bGwgbWQ6dy1hdXRvXCI+XG4gICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUV4cG9ydEV4Y2VsfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIGJnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNzAwIHRleHQtd2hpdGUgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24gc2hhZG93LWxnIHNoYWRvdy1lbWVyYWxkLTUwMC8xNSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZpbGVTcHJlYWRzaGVldCBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgINiu2LHZiNis24wg2Kfaqdiz2YRcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT3BlbkFkZH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiBiZy1za3ktNTAwIGhvdmVyOmJnLXNreS02MDAgdGV4dC13aGl0ZSByb3VuZGVkLXhsIHRleHQtc20gZm9udC1tZWRpdW0gdHJhbnNpdGlvbiBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTUgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxQbHVzIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAg2KvYqNiqINmB2LHYtdiqINm+2LHZiNqY2Ycg2KzYr9uM2K9cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFNlYXJjaCBmaWx0ZXJzICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTQgcm91bmRlZC14bCBzaGFkb3ctc20gYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBnYXAtNCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB3LWZ1bGwgbWQ6ZmxleC0xXCI+XG4gICAgICAgICAgPFNlYXJjaCBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LXNsYXRlLTQwMFwiIHNpemU9ezE4fSAvPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLYrNiz2KrYrNmIINiv2LEg2YbYp9mFINm+2LHZiNqY2YfYjCDaqdivINix2Yfar9uM2LHbjNiMINuM2Kcg2YbYp9mFINqp2KfYsdmB2LHZhdinLi4uXCJcbiAgICAgICAgICAgIHZhbHVlPXtzZWFyY2h9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHItMTAgcGwtNCBweS0yIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgdGV4dC1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCB0cmFuc2l0aW9uIHRleHQtcmlnaHRcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgdy1mdWxsIG1kOnctNjQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICA8RmlsdGVyIHNpemU9ezE2fSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBmbGV4LXNocmluay0wXCIgLz5cbiAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRTdGF0dXN9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlbGVjdGVkU3RhdHVzKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHRleHQtc20gcHktMiBweC0zIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1za3ktNTAwLzIwIGZvY3VzOmJvcmRlci1za3ktNTAwIHRyYW5zaXRpb24gYXBwZWFyYW5jZS1ub25lIHRleHQtcmlnaHQgYmctd2hpdGVcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJhbGxcIj7Zh9mF2Ycg2YXYsdin2K3ZhCDYrti3INmB2LHZiNi0PC9vcHRpb24+XG4gICAgICAgICAgICB7KHNldHRpbmdzLmRyb3Bkb3duSXRlbXM/LnByb2plY3RTdGF0dXNlcyB8fCBbJ9is2K/bjNivJywgJ9iv2LEg2K3Yp9mEINmF2LDYp9qp2LHZhycsICfYp9ix2KfYptmHINm+24zYtOKAjNmB2Kfaqdiq2YjYsScsICfYqNix2YbYr9mHICjZhdmI2YHZgiknLCAn2YbbjNmF2Ycg2KjYsdmG2K/ZhycsICfYqNin2K7YqtmHJywgJ9mE2LrZiCDYtNiv2YcnXSkubWFwKChzdCwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpZHh9IHZhbHVlPXtzdH0+e3N0fTwvb3B0aW9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBDdXN0b20gRmllbGRzIEZpbHRlciBQYW5lbCAqL31cbiAgICAgIHsoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9qZWN0Q3VzdG9tRmllbGRzID0gKHNldHRpbmdzPy5jdXN0b21GaWVsZHMgfHwgW10pLmZpbHRlcihmID0+IGYubW9kdWxlID09PSAncHJvamVjdHMnKTtcbiAgICAgICAgaWYgKHByb2plY3RDdXN0b21GaWVsZHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtMjAwLzgwIHJvdW5kZWQteGwgcC00IHNwYWNlLXktMyBhbmltYXRlLWZhZGUtaW5cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICA8RmlsdGVyIHNpemU9ezE0fSBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby01MDBcIiAvPlxuICAgICAgICAgICAgICA8c3Bhbj7ZgduM2YTYqtixINmB24zZhNiv2YfYp9uMINiz2YHYp9ix2LTbjCDZvtix2YjamNmHOjwvc3Bhbj5cbiAgICAgICAgICAgICAge09iamVjdC52YWx1ZXMoY3VzdG9tRmllbGRGaWx0ZXJzKS5zb21lKEJvb2xlYW4pICYmIChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDdXN0b21GaWVsZEZpbHRlcnMoe30pfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXItYXV0byB0ZXh0LVsxMHB4XSB0ZXh0LXJvc2UtNjAwIGhvdmVyOnVuZGVybGluZSBhbmltYXRlLWZhZGUtaW5cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgINm+2KfaqSDaqdix2K/ZhiDYqtmF2KfZhduMINmB24zZhNiq2LHZh9inXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtMiBtZDpncmlkLWNvbHMtNCBnYXAtMyB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgIHtwcm9qZWN0Q3VzdG9tRmllbGRzLm1hcChmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbCA9IGN1c3RvbUZpZWxkRmlsdGVyc1tmaWVsZC5pZF0gfHwgJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmaWVsZC5pZH0gY2xhc3NOYW1lPVwic3BhY2UteS0xIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTYwMFwiPntmaWVsZC5uYW1lfTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICB7ZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRWYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEN1c3RvbUZpZWxkRmlsdGVycyh7IC4uLmN1c3RvbUZpZWxkRmlsdGVycywgW2ZpZWxkLmlkXTogZS50YXJnZXQudmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweS0xLjUgcHgtMiBiZy13aGl0ZSB0ZXh0LXJpZ2h0IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1pbmRpZ28tNTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+2YfZhdmHPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICB7KGZpZWxkLm9wdGlvbnMgfHwgW10pLm1hcCgob3B0LCBvSWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtvSWR4fSB2YWx1ZT17b3B0fT57b3B0fTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICkgOiBmaWVsZC50eXBlID09PSAnYm9vbGVhbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRWYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEN1c3RvbUZpZWxkRmlsdGVycyh7IC4uLmN1c3RvbUZpZWxkRmlsdGVycywgW2ZpZWxkLmlkXTogZS50YXJnZXQudmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweS0xLjUgcHgtMiBiZy13aGl0ZSB0ZXh0LXJpZ2h0IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1pbmRpZ28tNTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+2YfZhdmHPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidHJ1ZVwiPtio2YTZhzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImZhbHNlXCI+2K7bjNixPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICkgOiBmaWVsZC50eXBlID09PSAnZmlsZScgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRWYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEN1c3RvbUZpZWxkRmlsdGVycyh7IC4uLmN1c3RvbUZpZWxkRmlsdGVycywgW2ZpZWxkLmlkXTogZS50YXJnZXQudmFsdWUgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweS0xLjUgcHgtMiBiZy13aGl0ZSB0ZXh0LXJpZ2h0IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1pbmRpZ28tNTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+2YfZhdmHPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiaGFzX2ZpbGVcIj7Yr9in2LHYp9uMINm+24zZiNiz2Ko8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJub19maWxlXCI+2KjYr9mI2YYg2b7bjNmI2LPYqjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT17ZmllbGQudHlwZSA9PT0gJ251bWJlcicgPyAnbnVtYmVyJyA6ICd0ZXh0J31cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtg2YHbjNmE2KrYsSAke2ZpZWxkLm5hbWV9Li4uYH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjdXJyZW50VmFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDdXN0b21GaWVsZEZpbHRlcnMoeyAuLi5jdXN0b21GaWVsZEZpbHRlcnMsIFtmaWVsZC5pZF06IGUudGFyZ2V0LnZhbHVlIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHktMS41IHB4LTIgYmctd2hpdGUgdGV4dC1yaWdodCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctaW5kaWdvLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KSgpfVxuXG4gICAgICB7LyogUHJvamVjdHMgVGFibGUgTGlzdCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC0yeGwgc2hhZG93LXNtIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93LXgtYXV0b1wiPlxuICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1yaWdodCBib3JkZXItY29sbGFwc2UgbWluLXctWzEwMDBweF1cIj5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgdGV4dC1zbGF0ZS01MDAgdGV4dC14cyBmb250LWJvbGRcIj5cbiAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0zIHctMjhcIj7aqdivINm+2LHZiNqY2Yc8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTNcIj7Zhtin2YUg2Ygg2YXYtNiu2LXYp9iqINm+2LHZiNqY2Yc8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTNcIj7aqdin2LHZgdix2YXYpyAvINmF2LTYqtix24w8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTNcIj7Yp9ix2LLYtCDZvtin24zZvuKAjNmE2KfbjNmGICjYsduM2KfZhCk8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy02NFwiPtiq2KfYsduM2K7igIzZh9in24wg2qnZhNuM2K/bjDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtM1wiPtmI2LbYuduM2Kog2b7YsdmI2pjZhzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtM1wiPtmB24zZhNiv2YfYp9uMINiz2YHYp9ix2LTbjDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMyB0ZXh0LWNlbnRlciB3LTI0XCI+2LnZhdmE24zYp9iqPC90aD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgey8qIENvbHVtbiBGaWx0ZXJzIFJvdyAqL31cbiAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwLzUwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItmB24zZhNiq2LEg2qnYry4uLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb2xGaWx0ZXJzLmNvZGUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q29sRmlsdGVycyh7Li4uY29sRmlsdGVycywgY29kZTogZS50YXJnZXQudmFsdWV9KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTIgcHktMSB0ZXh0LVsxMXB4XSBmb250LW5vcm1hbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1za3ktNTAwIGJnLXdoaXRlIGZvbnQtbW9ub1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZgduM2YTYqtixINmG2KfZhS4uLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb2xGaWx0ZXJzLm5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q29sRmlsdGVycyh7Li4uY29sRmlsdGVycywgbmFtZTogZS50YXJnZXQudmFsdWV9KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTIgcHktMSB0ZXh0LVsxMXB4XSBmb250LW5vcm1hbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1za3ktNTAwIGJnLXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItmB24zZhNiq2LEg2YXYtNiq2LHbjC4uLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb2xGaWx0ZXJzLmN1c3RvbWVyTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDb2xGaWx0ZXJzKHsuLi5jb2xGaWx0ZXJzLCBjdXN0b21lck5hbWU6IGUudGFyZ2V0LnZhbHVlfSl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC0yIHB5LTEgdGV4dC1bMTFweF0gZm9udC1ub3JtYWwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctc2t5LTUwMCBiZy13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZgduM2YTYqtixINm+2KfbjNm+4oCM2YTYp9uM2YYuLi5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y29sRmlsdGVycy5lc3RpbWF0ZWRWYWx1ZVJJWUFMIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENvbEZpbHRlcnMoey4uLmNvbEZpbHRlcnMsIGVzdGltYXRlZFZhbHVlUklZQUw6IGUudGFyZ2V0LnZhbHVlfSl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC0yIHB5LTEgdGV4dC1bMTFweF0gZm9udC1ub3JtYWwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctc2t5LTUwMCBiZy13aGl0ZSB0ZXh0LWxlZnQgZm9udC1tb25vXCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItmB24zZhNiq2LEg2YXZiNi52K8uLi5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y29sRmlsdGVycy5leHBlY3RlZENsb3NlRGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDb2xGaWx0ZXJzKHsuLi5jb2xGaWx0ZXJzLCBleHBlY3RlZENsb3NlRGF0ZTogZS50YXJnZXQudmFsdWV9KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTIgcHktMSB0ZXh0LVsxMXB4XSBmb250LW5vcm1hbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1za3ktNTAwIGJnLXdoaXRlIGZvbnQtbW9ubyB0ZXh0LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZgduM2YTYqtixINmI2LbYuduM2KouLi5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y29sRmlsdGVycy5zdGF0dXMgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q29sRmlsdGVycyh7Li4uY29sRmlsdGVycywgc3RhdHVzOiBlLnRhcmdldC52YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtMiBweS0xIHRleHQtWzExcHhdIGZvbnQtbm9ybWFsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLXNreS01MDAgYmctd2hpdGUgdGV4dC1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTJcIj48L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTJcIj48L3RoPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keSBjbGFzc05hbWU9XCJkaXZpZGUteSBkaXZpZGUtc2xhdGUtMTAwIHRleHQtc2xhdGUtNzAwIHRleHQteHNcIj5cbiAgICAgICAgICAgICAge2ZpbHRlcmVkUHJvamVjdHMubWFwKChwKSA9PiAoXG4gICAgICAgICAgICAgICAgPHRyIGtleT17cC5pZH0gY2xhc3NOYW1lPVwiaG92ZXI6Ymctc2xhdGUtNTAvNTAgdHJhbnNpdGlvblwiPlxuICAgICAgICAgICAgICAgICAgey8qIENvZGUgKi99XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIGZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAge3AuY29kZX1cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG5cbiAgICAgICAgICAgICAgICAgIHsvKiBOYW1lICovfVxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyB0ZXh0LXNsYXRlLTkwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNtIHRleHQtc2xhdGUtOTAwXCI+e3AubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHsvKiBHZW5lcmFsICYgQ29udGFjdHMgSW5mbyAqL31cbiAgICAgICAgICAgICAgICAgICAgeyhwLnNhbGVzRXhwZXJ0IHx8IHAuY3VzdG9tZXJJbnF1aXJ5TnVtYmVyKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAteC0yIGdhcC15LTEgbXQtMSB0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwIHB0LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwLnNhbGVzRXhwZXJ0ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAg2qnYp9ix2LTZhtin2LM6IDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDBcIj57cC5zYWxlc0V4cGVydH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwLmN1c3RvbWVySW5xdWlyeU51bWJlciAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLnNhbGVzRXhwZXJ0ICYmICcgfCAnfdin2LPYqti52YTYp9mFOiA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtbW9ub1wiPntwLmN1c3RvbWVySW5xdWlyeU51bWJlcn08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICB7LyogTWFya2V0aW5nICYgTGVhZCBUcmFja2luZyAqL31cbiAgICAgICAgICAgICAgICAgICAge3AucmVmZXJyZXJOYW1lICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0xIG10LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOXB4XSBmb250LW1lZGl1bSB0ZXh0LXRlYWwtNzAwIGJnLXRlYWwtNTAgcHgtMS41IHB5LTAuNSByb3VuZGVkIGJvcmRlciBib3JkZXItdGVhbC0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAg2YXYudix2YE6IHtwLnJlZmVycmVyTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICB7LyogSXRlbXMgTmVlZGVkICovfVxuICAgICAgICAgICAgICAgICAgICB7cC5pdGVtc05lZWRlZCAmJiBwLml0ZW1zTmVlZGVkLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgZ2FwLTEgbXQtMiBiZy1zbGF0ZS01MC81MCBwLTEuNSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVs5cHhdIGZvbnQtZXh0cmFib2xkIHRleHQtc2xhdGUtNTAwXCI+2KfZgtmE2KfZhSDYr9ix2K7ZiNin2LPYqtuMOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwLml0ZW1zTmVlZGVkLm1hcCgoaXRlbSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l9IGNsYXNzTmFtZT1cInRleHQtWzlweF0gZm9udC1zZW1pYm9sZCB0ZXh0LXNreS03MDAgYmctc2t5LTUwIHB4LTEuNSBweS0wLjUgcm91bmRlZCBib3JkZXIgYm9yZGVyLXNreS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5uYW1lfSAoe2l0ZW0ucXVhbnRpdHl9INi52K/YryAtIHtpdGVtLnN1cHBseU1ldGhvZCA9PT0gJ09SREVSJyA/ICfYs9mB2KfYsdi024wnIDogaXRlbS5zdXBwbHlNZXRob2QgPT09ICdOT05FJyA/ICfYqNiv2YjZhiDZhtuM2KfYsiDYqNmHINiq2KfZhduM2YYnIDogJ9in2YbYqNin2LHbjCd9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgey8qIEF0dGFjaG1lbnRzIERpc3BsYXkgKi99XG4gICAgICAgICAgICAgICAgICAgIHtwLmF0dGFjaG1lbnRzICYmIHAuYXR0YWNobWVudHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtMSBtdC0xLjUgYmctc2xhdGUtNTAvNTAgcC0xLjUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOXB4XSBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTUwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMC41XCI+PFBhcGVyY2xpcCBzaXplPXsxMH0gLz4g2b7bjNmI2LPYquKAjNmH2Kc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge3AuYXR0YWNobWVudHMubWFwKChhdHQsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEga2V5PXtpfSBocmVmPXthdHQudXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCIgY2xhc3NOYW1lPVwidGV4dC1bOXB4XSBmb250LXNlbWlib2xkIHRleHQtc2t5LTYwMCBiZy1za3ktNTAgaG92ZXI6Ymctc2t5LTEwMCBweC0xLjUgcHktMC41IHJvdW5kZWQgYm9yZGVyIGJvcmRlci1za3ktMjAwIHRyYW5zaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YXR0Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cblxuICAgICAgICAgICAgICAgICAgey8qIEN1c3RvbWVyICovfVxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyBmb250LW1lZGl1bSB0ZXh0LXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICB7cC5jdXN0b21lck5hbWV9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICB7LyogUGlwZWxpbmUgVmFsdWUgKi99XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIGZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1zbGF0ZS04MDAgdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICAgIHtnZXRQaXBlbGluZVZhbHVlKHAuaWQpLnRvTG9jYWxlU3RyaW5nKCdmYS1JUicpfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cblxuICAgICAgICAgICAgICAgICAgey8qIEtleSBEYXRlcyAqL31cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1bMTFweF0gdGV4dC1zbGF0ZS02MDAgc3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTIgYm9yZGVyLWIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtMTAwIHBiLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwXCI+2KvYqNiqINmB2LHYtdiqOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm9cIj57cC5vcHBvcnR1bml0eURhdGUgfHwgcC5jcmVhdGlvbkRhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3Aud2lubmluZ0RhdGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTIgdGV4dC1lbWVyYWxkLTYwMCBmb250LWJvbGQgYm9yZGVyLWIgYm9yZGVyLWRhc2hlZCBib3JkZXItZW1lcmFsZC0xMDAgcGItMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7Yqtin2LHbjNiuINiq2KfbjNuM2K86PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vXCI+e3Aud2lubmluZ0RhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICB7Z2V0UHJvamVjdFByZXBheW1lbnREYXRlKHAuaWQpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGdhcC0yIHRleHQtaW5kaWdvLTYwMCBmb250LWJvbGQgYm9yZGVyLWIgYm9yZGVyLWRhc2hlZCBib3JkZXItaW5kaWdvLTEwMCBwYi0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtiv2LHbjNin2YHYqiDZvtuM2LTigIzZvtix2K/Yp9iu2Ko6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vXCI+e2dldFByb2plY3RQcmVwYXltZW50RGF0ZShwLmlkKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbHMgPSBnZXRQcm9qZWN0RGVsaXZlcnlEZXRhaWxzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogQWdyZWVkIERlbGl2ZXJ5IERhdGUgZGlzcGxheSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2RldGFpbHMuaGFzTXVsdGlwbGVBZ3JlZWQgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItYiBib3JkZXItZGFzaGVkIGJvcmRlci1za3ktMTAwIHBiLTEgc3BhY2UteS0wLjUgYmctc2t5LTUwLzIwIHAtMS41IHJvdW5kZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1za3ktNjAwIGZvbnQtYm9sZCB0ZXh0LVs5cHhdIG1iLTAuNVwiPtiy2YXYp9mGINiq2K3ZiNuM2YQg2KrZiNin2YHZgtuMINin2YLZhNin2YU6PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGV0YWlscy5hZ3JlZWRJdGVtcy5tYXAoKGl0ZW0sIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGdhcC0xIHRleHQtWzlweF0gdGV4dC1za3ktNzAwIGJnLXNreS01MC81MCBweC0xIHB5LTAuNSByb3VuZGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidHJ1bmNhdGUgbWF4LXctWzEwMHB4XSBmb250LW1lZGl1bVwiIHRpdGxlPXtpdGVtLnByb2R1Y3ROYW1lfT57aXRlbS5wcm9kdWN0TmFtZX06PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyBmb250LXNlbWlib2xkXCI+e2l0ZW0uY2FsY3VsYXRlZERhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkZXRhaWxzLnNpbmdsZUFncmVlZERhdGUgfHwgcC5hZ3JlZWREZWxpdmVyeURhdGUpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTIgdGV4dC1za3ktNjAwIGZvbnQtYm9sZCBib3JkZXItYiBib3JkZXItZGFzaGVkIGJvcmRlci1za3ktMTAwIHBiLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7YqtmI2KfZgdmC4oCM2LTYr9mHINiq2K3ZiNuM2YQ6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm9cIj57ZGV0YWlscy5zaW5nbGVBZ3JlZWREYXRlIHx8IHAuYWdyZWVkRGVsaXZlcnlEYXRlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogQWN0dWFsIERlbGl2ZXJ5IERhdGUgZGlzcGxheSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2RldGFpbHMuaGFzTXVsdGlwbGVBY3R1YWwgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTAuNSBiZy1hbWJlci01MC8yMCBwLTEuNSByb3VuZGVkIG10LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1hbWJlci02MDAgZm9udC1ib2xkIHRleHQtWzlweF0gbWItMC41XCI+2KrYrdmI24zZhCDZgti32LnbjCDYp9mC2YTYp9mFOjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2RldGFpbHMuYWN0dWFsSXRlbXMubWFwKChpdGVtLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBnYXAtMSB0ZXh0LVs5cHhdIHRleHQtYW1iZXItNzAwIGJnLWFtYmVyLTUwLzUwIHB4LTEgcHktMC41IHJvdW5kZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0cnVuY2F0ZSBtYXgtdy1bMTAwcHhdIGZvbnQtbWVkaXVtXCIgdGl0bGU9e2l0ZW0ucHJvZHVjdE5hbWV9PntpdGVtLnByb2R1Y3ROYW1lfTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIGZvbnQtc2VtaWJvbGRcIj57aXRlbS5hY3R1YWxEYXRlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGV0YWlscy5zaW5nbGVBY3R1YWxEYXRlIHx8IGdldEFjdHVhbERlbGl2ZXJ5RGF0ZShwLmlkKSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBnYXAtMiB0ZXh0LWFtYmVyLTYwMCBmb250LWJvbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2KrYrdmI24zZhCDZgti32LnbjDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ub1wiPntkZXRhaWxzLnNpbmdsZUFjdHVhbERhdGUgfHwgZ2V0QWN0dWFsRGVsaXZlcnlEYXRlKHAuaWQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICB7LyogU3RhdHVzIEJhZGdlICovfVxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BweC0yLjUgcHktMSByb3VuZGVkLWZ1bGwgZm9udC1ib2xkIHRleHQtWzEwcHhdIGJvcmRlciAke2dldFN0YXR1c0NvbG9yKHAuc3RhdHVzKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgICB7cC5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge3Auc3RhdHVzID09PSAn2KjYp9iu2KrZhycgJiYgcC5sb3NzUmVhc29uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtcm9zZS01MDAgZm9udC1ib2xkIG10LTEgbWF4LXctWzEyMHB4XSBteC1hdXRvIHRydW5jYXRlXCIgdGl0bGU9e3AubG9zc1JlYXNvbn0+XG4gICAgICAgICAgICAgICAgICAgICAgICDYudmE2Ko6IHtwLmxvc3NSZWFzb259XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICB7LyogQ3VzdG9tIEZpZWxkcyAqL31cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPEN1c3RvbUZpZWxkc0RldGFpbFZpZXdcbiAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU9XCJwcm9qZWN0c1wiXG4gICAgICAgICAgICAgICAgICAgICAgY3VzdG9tRmllbGRzPXtzZXR0aW5ncz8uY3VzdG9tRmllbGRzIHx8IFtdfVxuICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVZhbHVlcz17cC5jdXN0b21WYWx1ZXN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICB7LyogQWN0aW9ucyAqL31cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMocCl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBiZy1za3ktNTAgdGV4dC1za3ktNzAwIGhvdmVyOmJnLXNreS0xMDAgcm91bmRlZCB0cmFuc2l0aW9uIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQtWzEwcHhdIGZvbnQtYm9sZCBib3JkZXIgYm9yZGVyLXNreS0xMDAgc2hhZG93LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2KvYqNiqINmB2LnYp9mE24zYqiDZiCDYp9ix2KzYp9i5XCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2xvY2sgc2l6ZT17MTN9IGNsYXNzTmFtZT1cInRleHQtc2t5LTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7Zgdi52KfZhNuM2KrigIzZh9inPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyhwcm9qZWN0Q2F0ZWdvcnlHcm91cHMgfHwgW10pLmZpbHRlcihnID0+IGcucHJvamVjdElkID09PSBwLmlkICYmIGcuc3RhdHVzID09PSAn2KzYp9ix24wnKS5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0xLjUgaC0xLjUgYmctZW1lcmFsZC01MDAgcm91bmRlZC1mdWxsIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVPcGVuRWRpdChwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGhvdmVyOmJnLXNsYXRlLTEwMCB0ZXh0LXNsYXRlLTYwMCBob3Zlcjp0ZXh0LXNreS02MDAgcm91bmRlZCB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2YjbjNix2KfbjNi0INm+2LHZiNqY2YdcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxFZGl0IHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UHJvamVjdFRvRGVsZXRlSWQocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldFByb2plY3RUb0RlbGV0ZU5hbWUocC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RGVsZXRlQ29uZmlybU9wZW4odHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xLjUgaG92ZXI6YmctcmVkLTUwIHRleHQtc2xhdGUtNjAwIGhvdmVyOnRleHQtcmVkLTYwMCByb3VuZGVkIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCLYrdiw2YEg2b7YsdmI2pjZh1wiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRyYXNoMiBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7ZmlsdGVyZWRQcm9qZWN0cy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgYmctd2hpdGUgcC0xMiBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwIHctZnVsbFwiPlxuICAgICAgICAgICAgPEJyaWVmY2FzZSBjbGFzc05hbWU9XCJteC1hdXRvIHRleHQtc2xhdGUtMzAwIG1iLTNcIiBzaXplPXs0OH0gLz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS01MDAgZm9udC1tZWRpdW1cIj7Zvtix2YjamNmH4oCM2KfbjCDYqNinINin24zZhiDZhdi02K7Ytdin2Kog24zYp9mB2Kog2YbYtNivLjwvcD5cbiAgICAgICAgICAgIHtPYmplY3QudmFsdWVzKGNvbEZpbHRlcnMpLnNvbWUoQm9vbGVhbikgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q29sRmlsdGVycyh7fSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtMyB0ZXh0LXhzIHRleHQtc2t5LTYwMCBob3Zlcjp1bmRlcmxpbmUgZm9udC1ib2xkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgINm+2KfaqSDaqdix2K/ZhiDZgduM2YTYqtix2YfYp9uMINiz2KrZiNmG24xcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBBZGQgLyBFZGl0IFByb2plY3QgTW9kYWwgKi99XG4gICAgICB7c2hvd01vZGFsICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BmaXhlZCBpbnNldC0wIGJnLXNsYXRlLTkwMC82MCBiYWNrZHJvcC1ibHVyLXhzIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHotNTAgb3ZlcmZsb3cteS1hdXRvICR7aXNQcm9qZWN0TW9kYWxGdWxsc2NyZWVuID8gJ3AtMCcgOiAncC00J31gfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXdoaXRlIHNoYWRvdy14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMCBvdmVyZmxvdy1oaWRkZW4gYW5pbWF0ZS1zY2FsZS1pbiB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgZmxleCBmbGV4LWNvbCAke1xuICAgICAgICAgICAgaXNQcm9qZWN0TW9kYWxGdWxsc2NyZWVuIFxuICAgICAgICAgICAgICA/ICd3LXNjcmVlbiBoLXNjcmVlbiByb3VuZGVkLW5vbmUgbXktMCBtYXgtdy1mdWxsJyBcbiAgICAgICAgICAgICAgOiAncm91bmRlZC0yeGwgdy1mdWxsIG1heC13LTR4bCBteS04J1xuICAgICAgICAgIH1gfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJnLXNsYXRlLTUwXCI+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICB7ZWRpdGluZ1Byb2plY3QgPyBg2YjbjNix2KfbjNi0INin2LfZhNin2LnYp9iqINm+2LHZiNqY2Yc6ICR7ZWRpdGluZ1Byb2plY3QubmFtZX1gIDogJ9ir2KjYqiDZvtix2YjamNmHINi12YbYudiq24wgLyDZgdix2LXYqiDYqtis2KfYsduMINis2K/bjNivJ31cbiAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNQcm9qZWN0TW9kYWxGdWxsc2NyZWVuKCFpc1Byb2plY3RNb2RhbEZ1bGxzY3JlZW4pfSBcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGhvdmVyOmJnLXNsYXRlLTIwMCB0ZXh0LXNsYXRlLTUwMCByb3VuZGVkLWxnIHRyYW5zaXRpb24gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2lzUHJvamVjdE1vZGFsRnVsbHNjcmVlbiA/IFwi2K7YsdmI2Kwg2KfYsiDYqtmF2KfZheKAjNi12YHYrdmHXCIgOiBcItiq2YXYp9mF4oCM2LXZgdit2YdcIn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7aXNQcm9qZWN0TW9kYWxGdWxsc2NyZWVuID8gPE1pbmltaXplMiBzaXplPXsxOH0gLz4gOiA8TWF4aW1pemUyIHNpemU9ezE4fSAvPn1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFNob3dNb2RhbChmYWxzZSk7IHNldEVkaXRpbmdQcm9qZWN0KG51bGwpOyBzZXRJc1Byb2plY3RNb2RhbEZ1bGxzY3JlZW4oZmFsc2UpOyB9fSBcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMSBob3ZlcjpiZy1zbGF0ZS0yMDAgdGV4dC1zbGF0ZS01MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8WCBzaXplPXsxOH0gLz5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVNhdmV9IGNsYXNzTmFtZT17YHAtNiBzcGFjZS15LTYgb3ZlcmZsb3cteS1hdXRvIHRleHQtcmlnaHQgJHtpc1Byb2plY3RNb2RhbEZ1bGxzY3JlZW4gPyAnbWF4LWgtW2NhbGMoMTAwdmgtMTQwcHgpXSBmbGV4LTEnIDogJ21heC1oLVs4MHZoXSd9YH0+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB7LyogU2VjdGlvbiAxOiBHZW5lcmFsIEluZm8gKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBwYi00XCI+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS03MDAgbWItMyBib3JkZXItci00IGJvcmRlci1za3ktNTAwIHByLTJcIj7Yp9i32YTYp9i52KfYqiDYudmF2YjZhduMINm+2LHZiNqY2Yc8L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgey8qIFByb2plY3QgTmFtZSAqL31cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjUgbWQ6Y29sLXNwYW4tMlwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2LnZhtmI2KfZhiDaqdin2YXZhCDZvtix2YjamNmHIC8g2YbYp9mFINm+2LHZiNqY2YcgKjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtuYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TmFtZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZhdir2KfZhDog2YbZiNiz2KfYstuMINiq2KzZh9uM2LLYp9iqINqp2YbYqtix2YQg2YbbjNix2Yjar9in2Ycg2LHbjFwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodFwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIEN1c3RvbWVyIHNlbGVjdCAqL31cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPtmG2KfZhSDZhdi02KrYsduMIC8g2qnYp9ix2YHYsdmF2KcgKjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMS41IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdCB3cmFwcGVyQ2xhc3NOYW1lPVwiZmxleC0xIG1pbi13LTBcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjdXN0b21lcklkfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PiBzZXRDdXN0b21lcklkKHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHZhbHVlOiAnJywgbGFiZWw6ICctLSDYp9mG2KrYrtin2Kgg2YXYtNiq2LHbjCAtLScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmN1c3RvbWVycy5tYXAoYyA9PiAoeyB2YWx1ZTogYy5pZCwgbGFiZWw6IGMuY29tcGFueU5hbWUgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIi0tINin2YbYqtiu2KfYqCDZhdi02KrYsduMIC0tXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICB7YWRkQ3VzdG9tZXIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFF1aWNrQWRkQ3VzdG9tZXJUYXJnZXQoJ2N1c3RvbWVySWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRRdWlja0FkZFR5cGUoJ2N1c3RvbWVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0yIHRleHQtc2t5LTYwMCBob3Zlcjp0ZXh0LXNreS03MDAgYmctc2t5LTUwIGhvdmVyOmJnLXNreS0xMDAgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNreS0yMDAgaG92ZXI6Ym9yZGVyLXNreS0zMDAgdHJhbnNpdGlvbiBzaHJpbmstMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2KrYudix24zZgSDYs9ix24zYuSDZhdi02KrYsduMINis2K/bjNivXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MTh9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICB7LyogRW5kIFVzZXIgKi99XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS01MDBcIj7Zhdi12LHZgeKAjNqp2YbZhtiv2Ycg2YbZh9in24zbjDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMS41IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdCB3cmFwcGVyQ2xhc3NOYW1lPVwiZmxleC0xIG1pbi13LTBcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtlbmRVc2VyfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PiBzZXRFbmRVc2VyKHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogJycsIGxhYmVsOiAnLS0g2KfZhtiq2K7Yp9ioINmF2LXYsdmB4oCM2qnZhtmG2K/ZhyAo2YXYtNiq2LHbjCkgLS0nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5jdXN0b21lcnMubWFwKGMgPT4gKHsgdmFsdWU6IGMuaWQsIGxhYmVsOiBjLmNvbXBhbnlOYW1lIH0pKVxuICAgICAgICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCItLSDYp9mG2KrYrtin2Kgg2YXYtdix2YHigIzaqdmG2YbYr9mHICjZhdi02KrYsduMKSAtLVwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAge2FkZEN1c3RvbWVyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRRdWlja0FkZEN1c3RvbWVyVGFyZ2V0KCdlbmRVc2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UXVpY2tBZGRUeXBlKCdjdXN0b21lcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yLjUgcHktMiB0ZXh0LXNreS02MDAgaG92ZXI6dGV4dC1za3ktNzAwIGJnLXNreS01MCBob3ZlcjpiZy1za3ktMTAwIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1za3ktMjAwIGhvdmVyOmJvcmRlci1za3ktMzAwIHRyYW5zaXRpb24gc2hyaW5rLTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItiq2LnYsduM2YEg2LPYsduM2Lkg2YXYtNiq2LHbjCDYrNiv24zYr1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxQbHVzIHNpemU9ezE4fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIFNhbGVzIEV4cGVydCAqL31cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPtqp2KfYsdi02YbYp9izINmB2LHZiNi0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzYWxlc0V4cGVydH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNhbGVzRXhwZXJ0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1za3ktNTAwLzIwIGZvY3VzOmJvcmRlci1za3ktNTAwIG91dGxpbmUtbm9uZSB0ZXh0LXJpZ2h0IGJnLXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj4tLSDYp9mG2KrYrtin2Kgg2qnYp9ix2LTZhtin2LMg2YHYsdmI2LQgLS08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICB7dXNlcnMubWFwKHUgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3UuaWR9IHZhbHVlPXt1LmZ1bGxOYW1lfT57dS5mdWxsTmFtZX08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIEN1c3RvbWVyIElucXVpcnkgTnVtYmVyICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2LTZhdin2LHZhyDYp9iz2KrYudmE2KfZhSDZhdi02KrYsduMPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjdXN0b21lcklucXVpcnlOdW1iZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDdXN0b21lcklucXVpcnlOdW1iZXIoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2YXYq9in2YQ6INux27LbtC3budu5Ldin2YTZgVwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1sZWZ0IGZvbnQtbW9ub1wiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFNlY3Rpb24gMjogTWFya2V0aW5nICYgTGVhZCBUcmFja2luZyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItYiBib3JkZXItc2xhdGUtMTAwIHBiLTRcIj5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTcwMCBtYi0zIGJvcmRlci1yLTQgYm9yZGVyLWluZGlnby01MDAgcHItMlwiPtqp2KfZhtin2YQg2KjYp9iy2KfYsduM2KfYqNuMINmIINqp24zZgduM2Kog2LPYsdmG2K4gKNmE24zYryk8L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgey8qIE1hcmtldGluZyBDaGFubmVsICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2qnYp9mG2KfZhCDYqNin2LLYp9ix24zYp9io24w8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e21hcmtldGluZ0NoYW5uZWx9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRNYXJrZXRpbmdDaGFubmVsKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1za3ktNTAwLzIwIGZvY3VzOmJvcmRlci1za3ktNTAwIG91dGxpbmUtbm9uZSB0ZXh0LXJpZ2h0IGJnLXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHsoc2V0dGluZ3MuZHJvcGRvd25JdGVtcz8ubWFya2V0aW5nQ2hhbm5lbHMgfHwgWyfYqtmF2KfYsyDZhdiz2KrZgtuM2YUnLCAn2YbZhdin24zYtNqv2KfZhyDYqtis2KfYsduMJywgJ9mI2KjigIzYs9in24zYqiAvINii2YbZhNin24zZhicsICfZhdi52LHZgduMJywgJ9mF2YbYp9mC2LXZhyDYsdiz2YXbjCcsICfYs9in24zYsSddKS5tYXAoKGNoLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpZHh9IHZhbHVlPXtjaH0+e2NofTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICB7LyogTGVhZCBRdWFsaXR5ICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2qnbjNmB24zYqiDZhNuM2K88L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xlYWRRdWFsaXR5fVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TGVhZFF1YWxpdHkoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB4LTMgcHktMiB0ZXh0LXNtIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLXNreS01MDAvMjAgZm9jdXM6Ym9yZGVyLXNreS01MDAgb3V0bGluZS1ub25lIHRleHQtcmlnaHQgYmctd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgeyhzZXR0aW5ncy5kcm9wZG93bkl0ZW1zPy5sZWFkUXVhbGl0aWVzIHx8IFsn2LnYp9mE24wgKNqv2LHZhSknLCAn2YXYqtmI2LPYtycsICfYtti524zZgSAo2LPYsdivKSddKS5tYXAoKHEsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2lkeH0gdmFsdWU9e3F9PntxfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICB7LyogUmVmZXJyZXIgTmFtZSAqL31cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPtmG2KfZhSDZhdi52LHZgSAo2K/YsSDYtdmI2LHYqiDZiNis2YjYryk8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlZmVycmVyTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFJlZmVycmVyTmFtZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZhtin2YUg2LTYrti1INuM2Kcg2LPYp9iy2YXYp9mGINmF2LnYsdmB24zigIzaqdmG2YbYr9mHXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1za3ktNTAwLzIwIGZvY3VzOmJvcmRlci1za3ktNTAwIG91dGxpbmUtbm9uZSB0ZXh0LXJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICB7LyogQ29tbXVuaWNhdGlvbiBNZXRob2QgKi99XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS01MDBcIj7YsdmI2LQg2KfYsdiq2KjYp9i3INin2LXZhNuMPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb21tdW5pY2F0aW9uTWV0aG9kfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q29tbXVuaWNhdGlvbk1ldGhvZChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodCBiZy13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7KHNldHRpbmdzLmRyb3Bkb3duSXRlbXM/LmNvbW11bmljYXRpb25NZXRob2RzIHx8IFsn2KrZhNmB2YYnLCAn2KfbjNmF24zZhCcsICfYrNmE2LPZhyDYrdi22YjYsduMJywgJ9mF2qnYp9iq2KjZhyDYsdiz2YXbjCcsICfYtNio2qnZh+KAjNmH2KfbjCDYp9is2KrZhdin2LnbjCddKS5tYXAoKG0sIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2lkeH0gdmFsdWU9e219PnttfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogU2VjdGlvbiAzOiBLZXkgUGVyc29ucyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItYiBib3JkZXItc2xhdGUtMTAwIHBiLTRcIj5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTcwMCBtYi0zIGJvcmRlci1yLTQgYm9yZGVyLWFtYmVyLTUwMCBwci0yXCI+2KfZgdix2KfYryDaqdmE24zYr9uMINmF2LTYqtix24w8L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgey8qIEZpbmFuY2lhbCBLZXkgUGVyc29uICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2YHYsdivINqp2YTbjNiv24wg2YXYp9mE24w8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTEuNSBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZmluYW5jaWFsQ29udGFjdH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0RmluYW5jaWFsQ29udGFjdChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1za3ktNTAwLzIwIGZvY3VzOmJvcmRlci1za3ktNTAwIG91dGxpbmUtbm9uZSB0ZXh0LXJpZ2h0IGJnLXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+LS0g2KfZhtiq2K7Yp9ioINmB2LHYryDZhdin2YTbjCAo2YXYtNiq2LHbjCkgLS08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEN1c3RPYmogPSBjdXN0b21lcnMuZmluZChjID0+IGMuaWQgPT09IGN1c3RvbWVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWQgPSBjdXN0b21lcnMuZmlsdGVyKGMgPT4gYy5jdXN0b21lclR5cGUgPT09ICfYrdmC24zZgtuMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEN1c3RPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRDdXN0T2JqLmN1c3RvbWVyVHlwZSA9PT0gJ9it2YLZiNmC24wnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcihjID0+IHNlbGVjdGVkQ3VzdE9iai5saW5rZWRDdXN0b21lcklkcz8uaW5jbHVkZXMoYy5pZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcihjID0+IGMuaWQgPT09IHNlbGVjdGVkQ3VzdE9iai5pZCB8fCBzZWxlY3RlZEN1c3RPYmoubGlua2VkQ3VzdG9tZXJJZHM/LmluY2x1ZGVzKGMuaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYCR7Yy5maXJzdE5hbWUgfHwgJyd9ICR7Yy5sYXN0TmFtZSB8fCAnJ31gLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2MuaWR9IHZhbHVlPXtjLmlkfT57bmFtZX08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAge2FkZEN1c3RvbWVyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRRdWlja0FkZEN1c3RvbWVyVGFyZ2V0KCdmaW5hbmNpYWxDb250YWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UXVpY2tBZGRUeXBlKCdjdXN0b21lcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yLjUgcHktMiB0ZXh0LXNreS02MDAgaG92ZXI6dGV4dC1za3ktNzAwIGJnLXNreS01MCBob3ZlcjpiZy1za3ktMTAwIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1za3ktMjAwIGhvdmVyOmJvcmRlci1za3ktMzAwIHRyYW5zaXRpb24gc2hyaW5rLTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItiq2LnYsduM2YEg2LPYsduM2Lkg2YXYtNiq2LHbjCDYrNiv24zYr1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxQbHVzIHNpemU9ezE4fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIFRlY2huaWNhbCBLZXkgUGVyc29uICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2YHYsdivINqp2YTbjNiv24wg2YHZhtuMPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0xLjUgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlY2huaWNhbENvbnRhY3R9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFRlY2huaWNhbENvbnRhY3QoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodCBiZy13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPi0tINin2YbYqtiu2KfYqCDZgdix2K8g2YHZhtuMICjZhdi02KrYsduMKSAtLTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkQ3VzdE9iaiA9IGN1c3RvbWVycy5maW5kKGMgPT4gYy5pZCA9PT0gY3VzdG9tZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZCA9IGN1c3RvbWVycy5maWx0ZXIoYyA9PiBjLmN1c3RvbWVyVHlwZSA9PT0gJ9it2YLbjNmC24wnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ3VzdE9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEN1c3RPYmouY3VzdG9tZXJUeXBlID09PSAn2K3ZgtmI2YLbjCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKGMgPT4gc2VsZWN0ZWRDdXN0T2JqLmxpbmtlZEN1c3RvbWVySWRzPy5pbmNsdWRlcyhjLmlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKGMgPT4gYy5pZCA9PT0gc2VsZWN0ZWRDdXN0T2JqLmlkIHx8IHNlbGVjdGVkQ3VzdE9iai5saW5rZWRDdXN0b21lcklkcz8uaW5jbHVkZXMoYy5pZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgJHtjLmZpcnN0TmFtZSB8fCAnJ30gJHtjLmxhc3ROYW1lIHx8ICcnfWAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17Yy5pZH0gdmFsdWU9e2MuaWR9PntuYW1lfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICB7YWRkQ3VzdG9tZXIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFF1aWNrQWRkQ3VzdG9tZXJUYXJnZXQoJ3RlY2huaWNhbENvbnRhY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRRdWlja0FkZFR5cGUoJ2N1c3RvbWVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0yIHRleHQtc2t5LTYwMCBob3Zlcjp0ZXh0LXNreS03MDAgYmctc2t5LTUwIGhvdmVyOmJnLXNreS0xMDAgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNreS0yMDAgaG92ZXI6Ym9yZGVyLXNreS0zMDAgdHJhbnNpdGlvbiBzaHJpbmstMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2KrYudix24zZgSDYs9ix24zYuSDZhdi02KrYsduMINis2K/bjNivXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MTh9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogU2VjdGlvbiA0OiBQcm9qZWN0IERhdGVzICYgVGltZWxpbmUgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBwYi00XCI+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS03MDAgbWItMyBib3JkZXItci00IGJvcmRlci10ZWFsLTUwMCBwci0yXCI+2LLZhdin2YbigIzYqNmG2K/bjCDYudmF2YjZhduMINm+2LHZiNqY2Yc8L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgey8qIE9wcG9ydHVuaXR5IENyZWF0aW9uIERhdGUgKi99XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICAgICAgICAgIDxTaGFtc2lEYXRlUGlja2VyXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw9XCLYqtin2LHbjNiuINin24zYrNin2K8g2YHYsdi12KogKNir2KjYqiDYr9ixIENSTSkgKlwiXG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17b3Bwb3J0dW5pdHlEYXRlfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PiBzZXRPcHBvcnR1bml0eURhdGUodmFsKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICB7LyogVGFyZ2V0IERlbGl2ZXJ5IGRhdGUgKi99XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFNlY3Rpb24gNTogU3RhdHVzICYgT3V0Y29tZXMgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBwYi00XCI+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS03MDAgbWItMyBib3JkZXItci00IGJvcmRlci1yb3NlLTUwMCBwci0yXCI+2YbYqtuM2KzZhyDZvtix2YjamNmHINmIINmI2LbYuduM2Kog2KfYqNmE2KfYuiDZgtix2KfYsdiv2KfYryAo2K7ZiNiv2qnYp9ixIC8g2K/Ys9iq24wpPC9oND5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgIHsvKiBTdGF0dXMgLyBPdXRjb21lICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2YbYqtuM2KzZhyDZvtix2YjamNmHICjZhdix2K3ZhNmHINm+24zYtNix2YHYqiDZgdix2LXYqik8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IGhhbmRsZVN0YXR1c0NoYW5nZShlLnRhcmdldC52YWx1ZSBhcyBQcm9qZWN0WydzdGF0dXMnXSl9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtc20gZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBmb2N1czpib3JkZXItc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodCBiZy13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7KHNldHRpbmdzLmRyb3Bkb3duSXRlbXM/LnByb2plY3RTdGF0dXNlcyB8fCBbJ9is2K/bjNivJywgJ9iv2LEg2K3Yp9mEINmF2LDYp9qp2LHZhycsICfYp9ix2KfYptmHINm+24zYtOKAjNmB2Kfaqdiq2YjYsScsICfYqNix2YbYr9mHICjZhdmI2YHZgiknLCAn2YbbjNmF2Ycg2KjYsdmG2K/ZhycsICfYqNin2K7YqtmHJywgJ9mE2LrZiCDYtNiv2YcnXSkubWFwKChzdCwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aWR4fSB2YWx1ZT17c3R9PntzdH08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIExvc3MgUmVhc29uIChDb25kaXRpb25hbCkgKi99XG4gICAgICAgICAgICAgICAgICB7c3RhdHVzID09PSAn2KjYp9iu2KrZhycgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXJvc2UtNTAwXCI+2K/ZhNuM2YQg2KjYp9iu2Kog2b7YsdmI2pjZhyAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bG9zc1JlYXNvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TG9zc1JlYXNvbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItcm9zZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1yb3NlLTUwMC8yMCBmb2N1czpib3JkZXItcm9zZS01MDAgb3V0bGluZS1ub25lIHRleHQtcmlnaHQgYmctd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj4tLSDYp9mG2KrYrtin2Kgg2K/ZhNuM2YQg2KjYp9iu2KogLS08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzZXR0aW5ncy5sb3NzUmVhc29ucz8ubWFwKChyZWFzb24sIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtyZWFzb259PntyZWFzb259PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICB7LyogV2luIERhdGUgKi99XG4gICAgICAgICAgICAgICAgICB7KHN0YXR1cyA9PT0gJ9io2LHZhtiv2YcgKNmF2YjZgdmCKScgfHwgc3RhdHVzID09PSAn2YbbjNmF2Ycg2KjYsdmG2K/ZhycpICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxTaGFtc2lEYXRlUGlja2VyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD1cItiq2KfYsduM2K4g2KrYp9uM24zYryAo2KfYqNmE2KfYuiDZgtix2KfYsdiv2KfYrykgKlwiXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3dpbm5pbmdEYXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWwpID0+IHNldFdpbm5pbmdEYXRlKHZhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICB7LyogQWdyZWVkIERlbGl2ZXJ5IERhdGUgKi99XG4gICAgICAgICAgICAgICAgICB7KHN0YXR1cyA9PT0gJ9io2LHZhtiv2YcgKNmF2YjZgdmCKScgfHwgc3RhdHVzID09PSAn2YbbjNmF2Ycg2KjYsdmG2K/ZhycpICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxTaGFtc2lEYXRlUGlja2VyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD1cItiq2KfYsduM2K4g2KrZiNin2YHZguKAjNi02K/ZhyDYqtit2YjbjNmEINmG2YfYp9uM24wgKlwiXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2FncmVlZERlbGl2ZXJ5RGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsKSA9PiBzZXRBZ3JlZWREZWxpdmVyeURhdGUodmFsKX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG5cblxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTQgcHQtNFwiPlxuICAgICAgICAgICAgICAgIHsvKiBSZXF1ZXN0ZWQgUHJvZHVjdHMgTXVsdGktUm93IEJsb2NrICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWQ6Y29sLXNwYW4tMiBzcGFjZS15LTMgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIj7Zhdit2LXZiNmE2KfYqiDbjNinINin2YLZhNin2YUg2K/Ysdiu2YjYp9iz2KrbjCDaqdin2LHZgdix2YXYpyAvINmF2LTYqtix24w8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTIgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2FkZFByb2R1Y3QgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFF1aWNrQWRkUHJvZHVjdEluZGV4KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFF1aWNrQWRkVHlwZSgncHJvZHVjdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yIHB5LTEgYmctZW1lcmFsZC01MCBob3ZlcjpiZy1lbWVyYWxkLTEwMCB0ZXh0LWVtZXJhbGQtNjAwIHJvdW5kZWQgdGV4dC14cyBmb250LWJvbGQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgINiq2LnYsduM2YEg2LPYsduM2Lkg2qnYp9mE2KdcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVBZGRJdGVtTGluZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIgcHktMSBiZy1za3ktNTAgaG92ZXI6Ymctc2t5LTEwMCB0ZXh0LXNreS02MDAgcm91bmRlZCB0ZXh0LXhzIGZvbnQtYm9sZCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxQbHVzIHNpemU9ezEyfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAg2KfZgdiy2YjYr9mGINix2K/bjNmBINmF2K3YtdmI2YRcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAge2l0ZW1zTmVlZGVkLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW1zTmVlZGVkLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzR2VuZXJpYyA9IGl0ZW0ucHJvZHVjdElkID09PSAnZ2VuZXJpYyc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTIuNSBiZy1zbGF0ZS01MC81MCBwLTMgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMC84MCByZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBIZWFkZXIgVG9nZ2xlIFJvdyAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBwYi0yIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0yMDAvNTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtZXh0cmFib2xkIHRleHQtc2xhdGUtNTAwXCI+2LHYr9uM2YEge2luZGV4ICsgMX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBiZy1zbGF0ZS0xNTAgcC0wLjUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlSXRlbVByb2R1Y3RDaGFuZ2UoaW5kZXgsICdnZW5lcmljJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yIHB5LTAuNSB0ZXh0LVsxMHB4XSBmb250LWJvbGQgcm91bmRlZC1tZCB0cmFuc2l0aW9uICR7aXNHZW5lcmljID8gJ2JnLXdoaXRlIHRleHQtc2t5LTcwMCBzaGFkb3cteHMnIDogJ3RleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtODAwJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2YXYtNiu2LXYp9iqINqp2YTbjCAo2KjYr9mI2YYg2YXYr9mEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0UHJvZCA9IHByb2R1Y3RzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0UHJvZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVJdGVtUHJvZHVjdENoYW5nZShpbmRleCwgZmlyc3RQcm9kLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTIgcHktMC41IHRleHQtWzEwcHhdIGZvbnQtYm9sZCByb3VuZGVkLW1kIHRyYW5zaXRpb24gJHshaXNHZW5lcmljID8gJ2JnLXdoaXRlIHRleHQtc2t5LTcwMCBzaGFkb3cteHMnIDogJ3RleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtODAwJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2qnYp9mE2KfbjCDZhdi02K7YtSDYp9mG2KjYp9ixXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUm93IGJvZHkgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xMiBnYXAtMiBpdGVtcy1lbmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0dlbmVyaWMgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIENhdGVnb3J5IHNlbGVjdGlvbiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zcGFuLTMgc3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2K/Ys9iq2Ycg2qnYp9mE2KcgKjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLmNhdGVnb3J5IHx8ICdGTE9XJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVJdGVtQ2F0ZWdvcnlDaGFuZ2UoaW5kZXgsIGUudGFyZ2V0LnZhbHVlIGFzIGFueSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB4LTIgcHktMSB0ZXh0LXhzIGJnLXdoaXRlIHRleHQtcmlnaHQgb3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLXNreS01MDAgZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkZMT1dcIj7ZgdmE2YggKNis2LHbjNin2YYpPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJURU1QRVJBVFVSRVwiPtiv2YXYpzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiUFJFU1NVUkVcIj7Zgdi02KfYsTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTEVWRUxcIj7Ys9i32K0gKNmE2YjZhCk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIEVxdWlwbWVudCBUeXBlIHNlbGVjdCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zcGFuLTUgc3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2YbZiNi5INiq2KzZh9uM2LIgKjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLmVxdWlwbWVudFR5cGUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlSXRlbUVxdWlwbWVudFR5cGVDaGFuZ2UoaW5kZXgsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMiBweS0xIHRleHQteHMgYmctd2hpdGUgdGV4dC1yaWdodCBvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctc2t5LTUwMCBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+LS0g2KfZhtiq2K7Yp9ioINiq2KzZh9uM2LIgLS08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyhzZXR0aW5ncz8uZHJvcGRvd25JdGVtcz8uZXF1aXBtZW50VHlwZXMgfHwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfZgdmE2YjZhdiq2LEg2qnZiNix24zZiNmE24zYsycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9mB2YTZiNmF2KrYsSDYp9mE2KrYsdin2LPZiNmG24zaqScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9mB2YTZiNmF2KrYsSDYp9mE2qnYqtix2YjZhdi62YbYp9i324zYs9uMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2YHZhNmI2YXYqtixINiq2YjYsdio24zZhtuMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2KrYsdin2YbYs9mF24zYqtixINmB2LTYp9ixJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2KrYsdin2YbYs9mF24zYqtixINin2K7YqtmE2KfZgSDZgdi02KfYsScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9iq2LHYp9mG2LPZhduM2KrYsSDYr9mF2KcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfYqtix2KfZhtiz2YXbjNiq2LEg2LPYt9itICjYsdin2K/Yp9ix24wpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2KrYsdin2YbYs9mF24zYqtixINiz2LfYrSAo2KfZhNiq2LHYp9iz2YjZhtuM2qkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2LPZiNim24zahiDYs9i32K0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfar9uM2Kwg2YHYtNin2LEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfar9uM2Kwg2K/ZhdinJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn2LTbjNixINqp2YbYqtix2YQgKNqp2YbYqtix2YQg2YjZhNmIKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9i024zYsSDYp9i32YXbjNmG2KfZhiAo2LPbjNmB2KrbjCDZiNmE2YgpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKS5tYXAoKGVxLCBlcUlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtlcUlkeH0gdmFsdWU9e2VxfT57ZXF9PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU2l6ZSBpbnB1dCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zcGFuLTIgc3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2LPYp9uM2LIgKNiv2LEg2LXZiNix2Kog2YjYrNmI2K8pPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnNpemUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlSXRlbVNpemVDaGFuZ2UoaW5kZXgsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLZhdir2KfZhDogMiDYp9uM2YbahlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB4LTIgcHktMSB0ZXh0LXhzIHRleHQtcmlnaHQgb3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLXNreS01MDAgZm9udC1tb25vIHRleHQtc2xhdGUtNzAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc3Bhbi0xMCBzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2KfZhtiq2K7Yp9ioINqp2KfZhNinINin2LIg2KfZhtio2KfYsSAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdCB3cmFwcGVyQ2xhc3NOYW1lPVwiZmxleC0xIG1pbi13LTBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucHJvZHVjdElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWwpID0+IGhhbmRsZUl0ZW1Qcm9kdWN0Q2hhbmdlKGluZGV4LCB2YWwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17cHJvZHVjdHMubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzID0gW3Auc2l6ZSA/IGDYs9in24zYsjogJHtwLnNpemV9YCA6IG51bGwsIHAubWVhc3VyZW1lbnRSYW5nZSA/IGDYsdmG2Kw6ICR7cC5tZWFzdXJlbWVudFJhbmdlfWAgOiBudWxsXS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsc1RleHQgPSBkZXRhaWxzID8gYCAoJHtkZXRhaWxzfSlgIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b2NrVGV4dCA9IHAuc3RvY2tMZXZlbCAhPT0gdW5kZWZpbmVkICYmIHAuc3RvY2tMZXZlbCA+IDAgPyBgIFvZhdmI2KzZiNiv24w6ICR7cC5zdG9ja0xldmVsfSAke3AudW5pdCB8fCAn2LnYr9ivJ31dYCA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBwLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBgJHtwLmNvZGV9IC0gJHtwLmRpc3BsYXlOYW1lfSR7ZGV0YWlsc1RleHR9JHtzdG9ja1RleHR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIi0tINin2YbYqtiu2KfYqCDaqdin2YTYpyAtLVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBRdWFudGl0eSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNwYW4tMSBzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayB0ZXh0LWNlbnRlclwiPtiq2LnYr9in2K88L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49ezF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVJdGVtUXVhbnRpdHlDaGFuZ2UoaW5kZXgsIE51bWJlcihlLnRhcmdldC52YWx1ZSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2KrYudiv2KfYr1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMS41IHB5LTEgdGV4dC14cyB0ZXh0LWNlbnRlciBmb250LW1vbm8gb3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLXNreS01MDAgdGV4dC1zbGF0ZS03MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBEZWxldGUgYnV0dG9uICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc3Bhbi0xIGZsZXgganVzdGlmeS1lbmQgcGItMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVSZW1vdmVJdGVtTGluZShpbmRleCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xIGhvdmVyOmJnLXJlZC01MCB0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXJlZC01MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItit2LDZgSDYsdiv24zZgVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJhc2gyIHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1bMTFweF0gdGV4dC1jZW50ZXIgYmctc2xhdGUtNTAgcHktMyByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICDZh9uM2oYg2LHYr9uM2YEg2YXYrdi12YjZhNuMINir2KjYqiDZhti02K/ZhyDYp9iz2KouINio2LHYp9uMINir2KjYqiDZhtuM2KfYstmH2KfbjCDaqdin2YTYp9iMINix2YjbjCDCq9in2YHYstmI2K/ZhiDYsdiv24zZgSDZhdit2LXZiNmEwrsg2qnZhNuM2qkg2qnZhtuM2K8uXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogRGVzY3JpcHRpb24gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEuNSBtZDpjb2wtc3Bhbi0yXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNTAwXCI+2YXYtNiu2LXYp9iqINmF2YfZhtiv2LPbjCDZhdmI2LHYryDZhtuM2KfYstiMINio2KfYstmHINiv2YXYpyDZiCDZgdi02KfYsdmH2KfbjCDaqdin2LHYqNix24wg24zYpyDYtNix2K0g2LnZhdmI2YXbjDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgICAgcm93cz17M31cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldERlc2NyaXB0aW9uKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLYtNix2K0g2KfZh9iv2KfZgSDaqdin2LHZgdix2YXYp9iMINmG2YjYuSDZhdiq2LHbjNin2YQg2K/Ysdiu2YjYp9iz2KrbjC4uLlwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB4LTMgcHktMiB0ZXh0LXNtIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLXNreS01MDAvMjAgZm9jdXM6Ym9yZGVyLXNreS01MDAgb3V0bGluZS1ub25lIHRleHQtcmlnaHRcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuXG4gICAgICAgICAgICAgICAgey8qIEF0dGFjaG1lbnRzICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjUgbWQ6Y29sLXNwYW4tMiBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDAgbXQtMlwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPtmB2KfbjNmE4oCM2YfYp9uMINm+24zZiNiz2KogKNmG2YLYtNmH4oCM2YfYp9iMINin2LPYqti52YTYp9mF4oCM2YfYpyDZiCAuLi4pPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtMjAwIGhvdmVyOmJvcmRlci1za3ktNTAwIHJvdW5kZWQteGwgcC00IHRyYW5zaXRpb24gdGV4dC1jZW50ZXIgY3Vyc29yLXBvaW50ZXIgYmctc2xhdGUtNTAgcmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2FzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzVXBsb2FkaW5nKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBBcnJheS5mcm9tKGZpbGVzKSBhcyBGaWxlW10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IHVwbG9hZEZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBdHRhY2htZW50cyhwcmV2ID0+IFsuLi5wcmV2LCB7IG5hbWU6IGZpbGUubmFtZSwgdXJsLCBzaXplOiBmaWxlLnNpemUgfV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIubWVzc2FnZSB8fCAn2K7Yt9inINiv2LEg2KjYp9ix2q/YsNin2LHbjCDZgdin24zZhCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzVXBsb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBvcGFjaXR5LTAgY3Vyc29yLXBvaW50ZXIgdy1mdWxsIGgtZnVsbCB6LTEwXCJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNVcGxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgc3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2lzVXBsb2FkaW5nID8gJ9iv2LEg2K3Yp9mEINio2KfYsdqv2LDYp9ix24wuLi4nIDogJ9in2YbYqtiu2KfYqCDbjNinINix2YfYpyDaqdix2K/ZhiDZgdin24zZhOKAjNmH2KcnfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS00MDBcIj5QREYsIEV4Y2VsLCBXb3JkLCBJbWFnZXMgLSDYsNiu24zYsdmH4oCM2LPYp9iy24wg2KfYqNix24w8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAge2F0dGFjaG1lbnRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTIgbXQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgIHthdHRhY2htZW50cy5tYXAoKGZpbGUsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2lkeH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtMiBiZy1zbGF0ZS01MCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIG92ZXJmbG93LWhpZGRlbiBtYXgtdy1bODUlXVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRydW5jYXRlIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS03MDBcIiB0aXRsZT17ZmlsZS5uYW1lfT57ZmlsZS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMFwiPnsoZmlsZS5zaXplIC8gMTAyNCkudG9GaXhlZCgxKX0gS0I8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtmaWxlLnVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiIGNsYXNzTmFtZT1cInRleHQtc2t5LTYwMCBob3Zlcjp0ZXh0LXNreS04MDBcIiB0aXRsZT1cItmF2LTYp9mH2K/Zh1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2YXYtNin2YfYr9mHXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QXR0YWNobWVudHMocHJldiA9PiBwcmV2LmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaWR4KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDAgaG92ZXI6dGV4dC1yZWQtNzAwIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCLYrdiw2YEg2YHYp9uM2YRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxYIHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogRHluYW1pYyBDdXN0b20gRmllbGRzIEZvcm0gU2VjdGlvbiAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zcGFuLTEgbWQ6Y29sLXNwYW4tMlwiPlxuICAgICAgICAgICAgICAgICAgPEN1c3RvbUZpZWxkc0Zvcm1cbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlPVwicHJvamVjdHNcIlxuICAgICAgICAgICAgICAgICAgICBjdXN0b21GaWVsZHM9e3NldHRpbmdzPy5jdXN0b21GaWVsZHMgfHwgW119XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbVZhbHVlcz17Y3VzdG9tVmFsdWVzfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0Q3VzdG9tVmFsdWVzfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1lbmQgZ2FwLTMgcHQtNCBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFNob3dNb2RhbChmYWxzZSk7IHNldElzUHJvamVjdE1vZGFsRnVsbHNjcmVlbihmYWxzZSk7IH19XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHB5LTIgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgaG92ZXI6Ymctc2xhdGUtNTAgdGV4dC1zbGF0ZS02MDAgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgINin2YbYtdix2KfZgVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIGJnLXNreS01MDAgaG92ZXI6Ymctc2t5LTYwMCB0ZXh0LXdoaXRlIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LW1lZGl1bSB0cmFuc2l0aW9uIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xNVwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2VkaXRpbmdQcm9qZWN0ID8gJ9ir2KjYqiDYqti624zbjNix2KfYqiDZvtix2YjamNmHJyA6ICfYp9uM2KzYp9ivINm+2LHZiNqY2YcnfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBQcm9qZWN0IEFjdGl2aXRpZXMgRHJhd2VyL01vZGFsICovfVxuICAgICAge3NlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGZpeGVkIGluc2V0LTAgYmctc2xhdGUtOTAwLzYwIGJhY2tkcm9wLWJsdXItc20gei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvdmVyZmxvdy15LWF1dG8gJHtpc0FjdGl2aXRpZXNNb2RhbEZ1bGxzY3JlZW4gPyAncC0wJyA6ICdwLTQnfWB9IGRpcj1cInJ0bFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmctc2xhdGUtNTAgdy1mdWxsIHNoYWRvdy0yeGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgb3ZlcmZsb3ctaGlkZGVuIGZsZXggZmxleC1jb2wgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwICR7XG4gICAgICAgICAgICBpc0FjdGl2aXRpZXNNb2RhbEZ1bGxzY3JlZW4gXG4gICAgICAgICAgICAgID8gJ3ctc2NyZWVuIGgtc2NyZWVuIHJvdW5kZWQtbm9uZSBteS0wIG1heC13LWZ1bGwgbWF4LWgtc2NyZWVuJyBcbiAgICAgICAgICAgICAgOiAncm91bmRlZC0yeGwgdy1mdWxsIG1heC13LTV4bCBteS04IG1heC1oLVs5MHZoXSdcbiAgICAgICAgICB9YH0+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHsvKiBNb2RhbCBIZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMCB0ZXh0LXdoaXRlIHAtNiBmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTIgYmctc2t5LTUwMCByb3VuZGVkLWxnIHRleHQtd2hpdGUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzIwXCI+XG4gICAgICAgICAgICAgICAgICA8QnJpZWZjYXNlIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vXCI+2b7YsdmI2pjZhzoge3NlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZFwiPntzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLm5hbWV9PC9oMj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzQWN0aXZpdGllc01vZGFsRnVsbHNjcmVlbighaXNBY3Rpdml0aWVzTW9kYWxGdWxsc2NyZWVuKX0gXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBob3ZlcjpiZy1zbGF0ZS04MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uIHRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2lzQWN0aXZpdGllc01vZGFsRnVsbHNjcmVlbiA/IFwi2K7YsdmI2Kwg2KfYsiDYqtmF2KfZheKAjNi12YHYrdmHXCIgOiBcItiq2YXYp9mF4oCM2LXZgdit2YdcIn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7aXNBY3Rpdml0aWVzTW9kYWxGdWxsc2NyZWVuID8gPE1pbmltaXplMiBzaXplPXsyMH0gLz4gOiA8TWF4aW1pemUyIHNpemU9ezIwfSAvPn1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMobnVsbCk7IHNldElzQWN0aXZpdGllc01vZGFsRnVsbHNjcmVlbihmYWxzZSk7IH19XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBob3ZlcjpiZy1zbGF0ZS04MDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uIHRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxYIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogTW9kYWwgQ29udGVudCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byBwLTYgc3BhY2UteS02IHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHsvKiBUb3AgRGV0YWlscyBHcmlkICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTQgYmctd2hpdGUgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2qnYp9ix2YHYsdmF2Kcv2YXYtNiq2LHbjDogPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTcwMFwiPntzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLmN1c3RvbWVyTmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgZm9udC1ib2xkXCI+2qnYp9ix2LTZhtin2LMg2YHYsdmI2LQg2YXYs9im2YjZhDogPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTcwMFwiPntzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLnNhbGVzRXhwZXJ0IHx8ICfZhdi02K7YtSDZhti02K/Zhyd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGZvbnQtYm9sZFwiPtmI2LbYuduM2Kog2YHYsdi12Ko6IDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHB4LTIgcHktMC41IHJvdW5kZWQtZnVsbCBmb250LWJvbGQgdGV4dC1bMTBweF0gYm9yZGVyICR7Z2V0U3RhdHVzQ29sb3Ioc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5zdGF0dXMpfWB9PlxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBEZWxpdmVyeSBEZXRhaWxzIEJsb2NrICovfVxuICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzID0gZ2V0UHJvamVjdERlbGl2ZXJ5RGV0YWlscyhzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLmlkKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNBZ3JlZWQgPSBkZXRhaWxzLmFncmVlZEl0ZW1zLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzQWN0dWFsID0gZGV0YWlscy5hY3R1YWxJdGVtcy5sZW5ndGggPiAwIHx8IGdldEFjdHVhbERlbGl2ZXJ5RGF0ZShzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLmlkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FncmVlZCAmJiAhaGFzQWN0dWFsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTQgYmctc2xhdGUtNTAgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAvNjAgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgICAgICB7LyogQWdyZWVkIERlbGl2ZXJ5IFNlY3Rpb24gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNreS04MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBib3JkZXItYiBib3JkZXItc2t5LTEwMCBwYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctMS41IGgtMS41IHJvdW5kZWQtZnVsbCBiZy1za3ktNTAwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2KrYudmH2K/Yp9iqINiy2YXYp9mGINiq2K3ZiNuM2YQg2KrZiNin2YHZgtuMPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAge2RldGFpbHMuYWdyZWVkSXRlbXMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjUgbWF4LWgtWzEyMHB4XSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGV0YWlscy5hZ3JlZWRJdGVtcy5tYXAoKGl0ZW0sIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGdhcC0yIGJnLXdoaXRlIHAtMS41IHJvdW5kZWQgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTYwMCBmb250LW1lZGl1bSB0cnVuY2F0ZSBtYXgtdy1bMjAwcHhdXCIgdGl0bGU9e2l0ZW0ucHJvZHVjdE5hbWV9PntpdGVtLnByb2R1Y3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwXCI+KHtpdGVtLmRlbGl2ZXJ5VGV4dH0pPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNreS02MDAgZm9udC1ib2xkXCI+e2l0ZW0uY2FsY3VsYXRlZERhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaXRhbGljIHRleHQtWzEwcHhdIHByLTJcIj7Yqtin2LHbjNiuINiq2YjYp9mB2YLigIzYtNiv2Ycg2KvYqNiqINmG2LTYr9mHINin2LPYqi48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICB7LyogQWN0dWFsIERlbGl2ZXJ5IFNlY3Rpb24gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LWFtYmVyLTgwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IGJvcmRlci1iIGJvcmRlci1hbWJlci0xMDAgcGItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTEuNSBoLTEuNSByb3VuZGVkLWZ1bGwgYmctYW1iZXItNTAwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2KrYp9ix24zYriDYqtit2YjbjNmEINmC2LfYuduMICjZhNis2LPYqtuM2qkpPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAge2RldGFpbHMuYWN0dWFsSXRlbXMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjUgbWF4LWgtWzEyMHB4XSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGV0YWlscy5hY3R1YWxJdGVtcy5tYXAoKGl0ZW0sIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGdhcC0yIGJnLXdoaXRlIHAtMS41IHJvdW5kZWQgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTYwMCBmb250LW1lZGl1bSB0cnVuY2F0ZSBtYXgtdy1bMjAwcHhdXCIgdGl0bGU9e2l0ZW0ucHJvZHVjdE5hbWV9PntpdGVtLnByb2R1Y3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmJveE51bWJlciAmJiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS0xMDAgcHgtMSByb3VuZGVkXCI+e2l0ZW0uYm94TnVtYmVyfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtYW1iZXItNjAwIGZvbnQtYm9sZFwiPntpdGVtLmFjdHVhbERhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IGdldEFjdHVhbERlbGl2ZXJ5RGF0ZShzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzLmlkKSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJnLXdoaXRlIHAtMiByb3VuZGVkIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIHNoYWRvdy1zbSBmb250LW1vbm8gdGV4dC1hbWJlci02MDAgZm9udC1ib2xkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtiq2K3ZiNuM2YQg2qnZhNuMINm+2LHZiNqY2Yc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Z2V0QWN0dWFsRGVsaXZlcnlEYXRlKHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMuaWQpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGl0YWxpYyB0ZXh0LVsxMHB4XSBwci0yXCI+2KrYrdmI24zZhCDaqdin2YTYp9mH2Kcg2YfZhtmI2LIg2YbZh9in24zbjCDbjNinINir2KjYqiDZhti02K/ZhyDYp9iz2KouPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KSgpfVxuXG4gICAgICAgICAgICAgIHsvKiBUYWIgU2VsZWN0b3IgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBib3JkZXItYiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2RhbFRhYignYWN0aXZpdGllcycpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNCBweS0yIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsIGJvcmRlci1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgJHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxUYWIgPT09ICdhY3Rpdml0aWVzJ1xuICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1za3ktNTAwIHRleHQtc2t5LTYwMCBmb250LWV4dHJhYm9sZCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS04MDAnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8SGlzdG9yeSBzaXplPXsxNX0gLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPtmB2LnYp9mE24zYquKAjNmH2Kcg2Ygg2LTYsditINin2YLYr9in2YXYp9iqPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9kYWxUYWIoJ2RvY3VtZW50cycpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNCBweS0yIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsIGJvcmRlci1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgJHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxUYWIgPT09ICdkb2N1bWVudHMnXG4gICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXNreS01MDAgdGV4dC1za3ktNjAwIGZvbnQtZXh0cmFib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTgwMCdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxGb2xkZXJPcGVuIHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+2b7ZiNi02YfigIzYqNmG2K/bjCDZiCDZhdiv24zYsduM2Kog2YXYr9in2LHaqTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE1vZGFsVGFiKCdzdXBwbHknKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMiB0ZXh0LXhzIGZvbnQtYm9sZCB0cmFuc2l0aW9uLWFsbCBib3JkZXItYi0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yICR7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsVGFiID09PSAnc3VwcGx5J1xuICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1za3ktNTAwIHRleHQtc2t5LTYwMCBmb250LWV4dHJhYm9sZCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS04MDAnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8QnJpZWZjYXNlIHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+2YjYtti524zYqiDYqtin2YXbjNmGINqp2KfZhNin2YfYpyAo2KfZhtio2KfYsSAvINiz2YHYp9ix2LQpPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7bW9kYWxUYWIgPT09ICdhY3Rpdml0aWVzJyA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLTMgZ2FwLTZcIj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB7LyogUmlnaHQgU2lkZTogQWN0aXZhdGUvT3BlbiBDYXRlZ29yeSBHcm91cCBmb3JtICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtNSByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIHNoYWRvdy1zbSBzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBwYi0zIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgdGV4dC1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8U2xpZGVycyBzaXplPXsxNn0gY2xhc3NOYW1lPVwidGV4dC1za3ktNTAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQteHNcIj7Zgdi52KfZhOKAjNiz2KfYstuMINiv2LPYqtmH4oCM2KjZhtiv24wg2YHYudin2YTbjNiqINis2K/bjNivPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LVsxMHB4XSBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICDYqNix2KfbjCDYq9io2Kog2YHYudin2YTbjNiq2Iwg2KfYqNiq2K/YpyDYqNin24zYryDbjNqp24wg2KfYsiDYr9iz2KrZh+KAjNio2YbYr9uM4oCM2YfYp9uMINmF2LTYrti14oCM2LTYr9mHINiv2LEg2KrZhti424zZhdin2Kog2LHYpyDYqNix2KfbjCDYp9uM2YYg2b7YsdmI2pjZhyDZgdi52KfZhCDaqdmG24zYry4g2LfYqNmCINiq2LnZh9iv2Iwg2Kraqdix2KfYsSDYr9iz2KrZh+KAjNio2YbYr9uMINmF2KzYp9iyINmG24zYs9iqLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9ja1wiPtin2YbYqtiu2KfYqCDYr9iz2KrZh+KAjNio2YbYr9uMINmB2LnYp9mE24zYqiAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkQ2F0ZWdvcnlUb0NyZWF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWxlY3RlZENhdGVnb3J5VG9DcmVhdGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweS0yIHB4LTMgdGV4dC14cyBvdXRsaW5lLW5vbmUgYmctd2hpdGUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCB0ZXh0LXJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPi0tINin2YbYqtiu2KfYqCDYr9iz2KrZh+KAjNio2YbYr9uMIC0tPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsoc2V0dGluZ3MuYWN0aXZpdHlDYXRlZ29yaWVzIHx8IFtdKS5tYXAoY2F0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHJlYWR5RXhpc3RzID0gKHByb2plY3RDYXRlZ29yeUdyb3VwcyB8fCBbXSkuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgPT4gZy5wcm9qZWN0SWQgPT09IHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMuaWQgJiYgZy5jYXRlZ29yeUlkID09PSBjYXQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2NhdC5pZH0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjYXQuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXthbHJlYWR5RXhpc3RzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2F0Lm5hbWV9IHthbHJlYWR5RXhpc3RzID8gJyjZgtio2YTYp9mLINin24zYrNin2K8g2LTYr9mHKScgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxlY3RlZENhdGVnb3J5VG9DcmVhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn2YTYt9mB2KfZiyDYp9io2KrYr9inINuM2qkg2K/Ys9iq2YfigIzYqNmG2K/bjCDYp9mG2KrYrtin2Kgg2qnZhtuM2K8uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhdCA9IChzZXR0aW5ncy5hY3Rpdml0eUNhdGVnb3JpZXMgfHwgW10pLmZpbmQoYyA9PiBjLmlkID09PSBzZWxlY3RlZENhdGVnb3J5VG9DcmVhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNhdCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkZFByb2plY3RDYXRlZ29yeUdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYWRkUHJvamVjdENhdGVnb3J5R3JvdXAoc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZCwgY2F0LmlkLCBjYXQubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoYNiv2LPYqtmH4oCM2KjZhtiv24wgwqske2NhdC5uYW1lfcK7INio2Kcg2YXZiNmB2YLbjNiqINio2LHYp9uMINin24zZhiDZvtix2YjamNmHINmB2LnYp9mEINi02K8uYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZENhdGVnb3J5VG9DcmVhdGUoJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS0yIGJnLXNreS01MDAgaG92ZXI6Ymctc2t5LTYwMCB0ZXh0LXdoaXRlIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMS41IHNoYWRvdy1tZCBzaGFkb3ctc2t5LTUwMC8xMFwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICDYsdin2YfigIzYp9mG2K/Yp9iy24wg2K/Ys9iq2YfigIzYqNmG2K/bjCDYr9ixINm+2LHZiNqY2YdcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgey8qIFF1aWNrIEluZm8gQm94ICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1za3ktNTAgYm9yZGVyIGJvcmRlci1za3ktMTAwIHAtNCByb3VuZGVkLXhsIHRleHQtWzEwcHhdIHRleHQtc2t5LTgwMCBsZWFkaW5nLXJlbGF4ZWQgc3BhY2UteS0xIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LWJvbGQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8QWxlcnRDaXJjbGUgc2l6ZT17MTN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2YLZiNin2YbbjNmGINir2KjYqiDZgdi52KfZhNuM2KrigIzZh9inOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+4oCiINir2KjYqiDZgdi52KfZhNuM2Kog2K3YqtmF2KfZiyDYqNin24zYryDYsNuM2YQg24zaqSDYr9iz2KrZh+KAjNio2YbYr9uMINmF2LTYrti1INio2KfYtNivLjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PuKAoiDYr9ixINi12YjYsdiqINin2KrZhdin2YUg2qnYp9ixINiv2LEg24zaqSDYr9iz2KrZh+KAjNio2YbYr9uM2Iwg2K/aqdmF2Ycg2KfYqtmF2KfZhSDaqdin2LEg2LHYpyDYqNiy2YbbjNivLjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PuKAoiDZvtizINin2LIg2KjYs9iq2YfigIzYtNiv2YYg2K/Ys9iq2YfigIzYqNmG2K/bjNiMINiv2LEg2LXZiNix2Kog2YTYstmI2YUg2YXbjOKAjNiq2YjYp9mG24zYryDZhdis2K/Yr9in2Ysg2KLZhiDYsdinINio2Ycg2KzYsduM2KfZhiDYqNuM2YbYr9in2LLbjNivLjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PuKAoiDZh9ixINmB2LnYp9mE24zYqiDZhduM4oCM2KrZiNin2YbYryDYqNmHINi52YbZiNin2YYg2KfYsdis2KfYuSDaqdin2LEg2KjYsdin24wg24zaqduMINin2LIg2YfZhdqp2KfYsdin2YYg2LXYp9iv2LEg2LTZiNivLjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogTGVmdCBTaWRlOiBDYXRlZ29yeSBHcm91cHMgTGlzdCAmIEluc2lkZSBBY3Rpdml0aWVzICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGc6Y29sLXNwYW4tMiBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgey8qIEZpbHRlciBhbmQgQ2F0ZWdvcnkgR3JvdXBzIEJsb2NrICovfVxuICAgICAgICAgICAgICAgICAgeyghcHJvamVjdENhdGVnb3J5R3JvdXBzIHx8IHByb2plY3RDYXRlZ29yeUdyb3Vwcy5maWx0ZXIoZyA9PiBnLnByb2plY3RJZCA9PT0gc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZCkubGVuZ3RoID09PSAwKSA/IChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTEyIHRleHQtY2VudGVyIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgc2hhZG93LXNtIHNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxIaXN0b3J5IGNsYXNzTmFtZT1cIm14LWF1dG8gdGV4dC1zbGF0ZS0zMDBcIiBzaXplPXszNn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtc2VtaWJvbGRcIj7Zh9uM2oYg2K/Ys9iq2YfigIzYqNmG2K/bjCDZgdi52KfZhNuM2KrbjCDZh9mG2YjYsiDYqNix2KfbjCDYp9uM2YYg2b7YsdmI2pjZhyDYsdin2YfigIzYp9mG2K/Yp9iy24wg2YbYtNiv2Ycg2KfYs9iqLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMFwiPtmE2LfZgdin2Ysg2KfYsiDZvtmG2YQg2LPZhdiqINix2KfYs9iq2Iwg2KfZiNmE24zZhiDYr9iz2KrZh+KAjNio2YbYr9uMINmB2LnYp9mE24zYqiDYsdinINmB2LnYp9mEINqp2YbbjNivLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHsvKiBDb2xsYXBzaWJsZSBVdGlsaXR5IENvbnRyb2xzICovfVxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJnLXNsYXRlLTUwLzUwIHAtMi41IHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0xNTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPtmF2K/bjNix24zYqiDZhtmF2KfbjNi0INiv2LPYqtmH4oCM2KjZhtiv24zigIzZh9inOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvamVjdEdyb3VwcyA9IHByb2plY3RDYXRlZ29yeUdyb3Vwcy5maWx0ZXIoZyA9PiBnLnByb2plY3RJZCA9PT0gc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdFeHBhbmRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RHcm91cHMuZm9yRWFjaChnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhwYW5kZWRbZy5pZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFeHBhbmRlZEdyb3VwcyhuZXdFeHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yLjUgcHktMSB0ZXh0LVsxMHB4XSBiZy13aGl0ZSBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBob3ZlcjpiZy1zbGF0ZS01MCB0ZXh0LXNreS02MDAgcm91bmRlZCBmb250LWJvbGQgdHJhbnNpdGlvbiBzaGFkb3ctc21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAg2KjYp9iyINqp2LHYr9mGINmH2YXZh1xuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkR3JvdXBzKHt9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yLjUgcHktMSB0ZXh0LVsxMHB4XSBiZy13aGl0ZSBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBob3ZlcjpiZy1zbGF0ZS01MCB0ZXh0LXNsYXRlLTYwMCByb3VuZGVkIGZvbnQtYm9sZCB0cmFuc2l0aW9uIHNoYWRvdy1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDYrNmF2Lkg2qnYsdiv2YYg2YfZhdmHXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICB7KHByb2plY3RDYXRlZ29yeUdyb3VwcyB8fCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZyA9PiBnLnByb2plY3RJZCA9PT0gc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGdyb3VwKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzR3JvdXBDbG9zZWQgPSBncm91cC5zdGF0dXMgPT09ICfYp9iq2YXYp9mFINqp2KfYsSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSAhIWV4cGFuZGVkR3JvdXBzW2dyb3VwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ID0gc2V0dGluZ3MuYWN0aXZpdHlDYXRlZ29yaWVzPy5maW5kKGMgPT4gYy5pZCA9PT0gZ3JvdXAuY2F0ZWdvcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbk1hbmFnZUNvbXBsZXRpb24gPSAhY2F0Py5yZXNwb25zaWJsZVVzZXJJZCB8fCBjYXQucmVzcG9uc2libGVVc2VySWQgPT09IGN1cnJlbnRVc2VyPy5mdWxsTmFtZSB8fCBjdXJyZW50VXNlcj8ucm9sZSA9PT0gJ2FkbWluJyB8fCBjdXJyZW50VXNlcj8uaXNTeXN0ZW1BZG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17Z3JvdXAuaWR9IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYmctd2hpdGUgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMCBzaGFkb3ctc20gb3ZlcmZsb3ctaGlkZGVuIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0dyb3VwQ2xvc2VkID8gJ29wYWNpdHktODUgYm9yZGVyLXNsYXRlLTIwMCBiZy1zbGF0ZS01MC8yMCcgOiAncmluZy0yIHJpbmctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBHcm91cCBIZWFkZXIgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXhwYW5kZWRHcm91cHMocHJldiA9PiAoeyAuLi5wcmV2LCBbZ3JvdXAuaWRdOiAhcHJldltncm91cC5pZF0gfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MC84MCBweC00IHB5LTMgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgZ2FwLTIgZmxleC13cmFwIGN1cnNvci1wb2ludGVyIGhvdmVyOmJnLXNsYXRlLTEwMC83MCB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0V4cGFuZGVkID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25VcCBzaXplPXsxNn0gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdHJhbnNpdGlvbi10cmFuc2Zvcm0gZHVyYXRpb24tMjAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25Eb3duIHNpemU9ezE2fSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0yMDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmctc2t5LTEwMCB0ZXh0LXNreS05NTAgdGV4dC14cyBmb250LWJvbGQgcHgtMi41IHB5LTEgcm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLXNreS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtncm91cC5jYXRlZ29yeU5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRleHQtWzlweF0gZm9udC1ib2xkIHB4LTEuNSBweS0wLjUgcm91bmRlZCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNHcm91cENsb3NlZCA/ICdiZy1zbGF0ZS0yMDAgdGV4dC1zbGF0ZS02MDAnIDogJ2JnLWVtZXJhbGQtMTAwIHRleHQtZW1lcmFsZC04MDAgYW5pbWF0ZS1wdWxzZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3JvdXAuc3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh7KGdyb3VwLmFjdGl2aXRpZXMgfHwgW10pLmxlbmd0aH0g2YHYudin2YTbjNiqKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzlweF0gdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vIGZsZXggZmxleC1jb2wgdGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7YtNix2YjYuToge2dyb3VwLnN0YXJ0RGF0ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z3JvdXAuZW5kRGF0ZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJvc2UtNTAwIGZvbnQtYm9sZFwiPtm+2KfbjNin2YY6IHtncm91cC5lbmREYXRlfTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIERlbGV0ZSBDYXRlZ29yeSBHcm91cCBCdXR0b24gKG9ubHkgZm9yIG5vbi1zeXN0ZW0pICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshZ3JvdXAuY2F0ZWdvcnlJZC5zdGFydHNXaXRoKCdjYXQtZmFjdC0nKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0R3JvdXBUb0RlbGV0ZShncm91cC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIgcHktMSBiZy1yb3NlLTUwIGhvdmVyOmJnLXJvc2UtMTAwIHRleHQtcm9zZS02MDAgcm91bmRlZCB0cmFuc2l0aW9uIGJvcmRlciBib3JkZXItcm9zZS0xMDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgc2hhZG93LXNtIG1sLTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItit2LDZgSDYr9iz2KrZh1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFzaDIgc2l6ZT17MTF9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBUb2dnbGUgQnV0dG9uICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjYW5NYW5hZ2VDb21wbGV0aW9uICYmIChpc0dyb3VwQ2xvc2VkID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bWVQcm9qZWN0Q2F0ZWdvcnlHcm91cCkgcmVzdW1lUHJvamVjdENhdGVnb3J5R3JvdXAoZ3JvdXAuaWQsIGN1cnJlbnRVc2VyPy5mdWxsTmFtZSB8fCAn2qnYp9ix2KjYsSDYs9uM2LPYqtmFJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xIGJnLXNreS01MCBob3ZlcjpiZy1za3ktMTAwIHRleHQtc2t5LTcwMCByb3VuZGVkIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB0cmFuc2l0aW9uIGJvcmRlciBib3JkZXItc2t5LTE1MCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIaXN0b3J5IHNpemU9ezExfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDYqNmHINis2LHbjNin2YYg2KfZhtiv2KfYrtiq2YYg2YXYrNiv2K9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlUHJvamVjdENhdGVnb3J5R3JvdXApIGNvbXBsZXRlUHJvamVjdENhdGVnb3J5R3JvdXAoZ3JvdXAuaWQsIGN1cnJlbnRVc2VyPy5mdWxsTmFtZSB8fCAn2qnYp9ix2KjYsSDYs9uM2LPYqtmFJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xIGJnLWFtYmVyLTUwMCBob3ZlcjpiZy1hbWJlci02MDAgdGV4dC13aGl0ZSByb3VuZGVkIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB0cmFuc2l0aW9uIHNoYWRvdy1zbSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDaGVjayBzaXplPXsxMX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2KfYqtmF2KfZhSDaqdin2LEg2KfbjNmGINiv2LPYqtmHXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBHcm91cCBBY3Rpdml0aWVzIExpc3QgJiBGb3JtICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHNwYWNlLXktNCBiZy13aGl0ZSBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwIGFuaW1hdGUtZmFkZS1pblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsoIWdyb3VwLmFjdGl2aXRpZXMgfHwgZ3JvdXAuYWN0aXZpdGllcy5sZW5ndGggPT09IDApID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1bMTBweF0gdGV4dC1jZW50ZXIgcHktNCBiZy1zbGF0ZS01MCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2YfZhtmI2LIg2YfbjNqGINmB2LnYp9mE24zYqtuMINiv2LEg2KfbjNmGINiv2LPYqtmHINir2KjYqiDZhti02K/ZhyDYp9iz2KouXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChncm91cC5hY3Rpdml0aWVzIHx8IFtdKS5tYXAoKGFjdCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YWN0LmlkfSBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MC81MCBwLTMuNSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIHNwYWNlLXktMi41IHRleHQteHMgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ub1wiPnthY3QuY3JlYXRlZEF0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2FjdC5jcmVhdGVkQnkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGZvbnQtYm9sZCBiZy1zbGF0ZS0xMDAgcHgtMS41IHB5LTAuNSByb3VuZGVkIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VXNlciBzaXplPXsxMH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHthY3QuY3JlYXRlZEJ5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0LmF0dGFjaG1lbnQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdC5hdHRhY2htZW50LmNvbnRlbnQgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmPXthY3QuYXR0YWNobWVudC5jb250ZW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3dubG9hZD17YWN0LmF0dGFjaG1lbnQubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHB4LTEuNSBweS0wLjUgcm91bmRlZCBiZy1za3ktMTAwIGhvdmVyOmJnLXNreS0yMDAgYm9yZGVyIGJvcmRlci1za3ktMjAwIHRleHQtc2t5LTgwMCB0ZXh0LVs5cHhdIGZvbnQtYm9sZCB0cmFuc2l0aW9uIG1yLTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItiv2KfZhtmE2YjYryDZgdin24zZhCDZvtuM2YjYs9iqXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFBhcGVyY2xpcCBzaXplPXsxMH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2FjdC5hdHRhY2htZW50Lm5hbWV9ICh7YWN0LmF0dGFjaG1lbnQuc2l6ZX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBweC0xLjUgcHktMC41IHJvdW5kZWQgYmctc2t5LTUwIGJvcmRlciBib3JkZXItc2t5LTEwMCB0ZXh0LXNreS03MDAgdGV4dC1bOXB4XSBmb250LWJvbGQgbXItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFwZXJjbGlwIHNpemU9ezEwfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0LmF0dGFjaG1lbnQubmFtZX0gKHthY3QuYXR0YWNobWVudC5zaXplfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIEVkaXQgJiBEZWxldGUgQWN0aW9uIEJ1dHRvbnMgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgYmctc2xhdGUtMTAwLzYwIHAtMC41IHJvdW5kZWQgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAvNDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RWRpdGluZ0FjdGl2aXR5SWQoYWN0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RWRpdGluZ0FjdGl2aXR5VGV4dChhY3QudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC1za3ktNjAwIHRyYW5zaXRpb24gcC0xIGhvdmVyOmJnLXdoaXRlIHJvdW5kZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCLZiNuM2LHYp9uM2LRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFZGl0IHNpemU9ezEwfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBY3Rpdml0eVRvRGVsZXRlR3JvdXBJZChncm91cC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEFjdGl2aXR5VG9EZWxldGVJZChhY3QuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBY3Rpdml0eURlbGV0ZUNvbmZpcm1PcGVuKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtcm9zZS02MDAgdHJhbnNpdGlvbiBwLTEgaG92ZXI6Ymctd2hpdGUgcm91bmRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItit2LDZgVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRyYXNoMiBzaXplPXsxMH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZWRpdGluZ0FjdGl2aXR5SWQgPT09IGFjdC5pZCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yIG10LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2VkaXRpbmdBY3Rpdml0eVRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRFZGl0aW5nQWN0aXZpdHlUZXh0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC14cyBwLTIgYm9yZGVyIGJvcmRlci1za3ktMzAwIHJvdW5kZWQgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctc2t5LTUwMCBmb2N1czpvdXRsaW5lLW5vbmUgYmctd2hpdGUgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTgwMCB0ZXh0LXJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzPXsyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcj1cInJ0bFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMiBqdXN0aWZ5LWVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGluZ0FjdGl2aXR5VGV4dC50cmltKCkgJiYgc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb2plY3RBY3Rpdml0eT8uKHNlbGVjdGVkUHJvamVjdEZvckFjdGl2aXRpZXMuaWQsIGdyb3VwLmlkLCBhY3QuaWQsIGVkaXRpbmdBY3Rpdml0eVRleHQudHJpbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFZGl0aW5nQWN0aXZpdHlJZChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFZGl0aW5nQWN0aXZpdHlUZXh0KCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIgcHktMSBiZy1za3ktNjAwIGhvdmVyOmJnLXNreS03MDAgdGV4dC13aGl0ZSByb3VuZGVkIGZvbnQtYm9sZCB0ZXh0LVsxMHB4XSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2hlY2sgc2l6ZT17MTB9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDYsNiu24zYsdmHXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEVkaXRpbmdBY3Rpdml0eUlkKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFZGl0aW5nQWN0aXZpdHlUZXh0KCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yIHB5LTEgYmctc2xhdGUtMTAwIGhvdmVyOmJnLXNsYXRlLTIwMCB0ZXh0LXNsYXRlLTcwMCByb3VuZGVkIGZvbnQtYm9sZCB0ZXh0LVsxMHB4XSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8WCBzaXplPXsxMH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgINin2YbYtdix2KfZgVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTcwMCBsZWFkaW5nLXJlbGF4ZWQgZm9udC1zZW1pYm9sZFwiPnthY3QudGV4dH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVmZXJyYWwgZGV0YWlscyBpbnNpZGUgYWN0aXZpdHkgY2FyZCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0LnJlZmVycmFsICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMiBiZy13aGl0ZSByb3VuZGVkLWxnIHAtMyBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MCBzcGFjZS15LTIgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciB0ZXh0LVs5cHhdIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xMDAgcGItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1za3ktNzAwIGZvbnQtYm9sZFwiPtin2LHYrNin2Lkg2qnYp9ixINio2LHYp9uMINin2YLYr9in2YU6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHB4LTEuNSBweS0wLjUgcm91bmRlZCB0ZXh0LVs4cHhdIGZvbnQtYm9sZCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0LnJlZmVycmFsLnN0YXR1cyA9PT0gJ9iv2LEg2KfZhtiq2LjYp9ixINin2YLYr9in2YUnID8gJ2JnLXNreS01MCB0ZXh0LXNreS03MDAgYm9yZGVyIGJvcmRlci1za3ktMTAwIGFuaW1hdGUtcHVsc2UnIDogJ2JnLWVtZXJhbGQtNTAgdGV4dC1lbWVyYWxkLTgwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0LnJlZmVycmFsLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg2KfYsdis2KfYueKAjNiv2YfZhtiv2Yc6IDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS03MDBcIj57YWN0LnJlZmVycmFsLmFzc2lnbmVkQnl9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ30gfCDYp9ix2KzYp9i54oCM2LTZiNmG2K/ZhzogPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTcwMFwiPnthY3QucmVmZXJyYWwuYXNzaWduZWRUb308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2t5LTUwLzQwIHAtMi41IHJvdW5kZWQgdGV4dC1bMTFweF0gdGV4dC1zbGF0ZS02MDAgZm9udC1leHRyYWJvbGQgYm9yZGVyLXItMiBib3JkZXItc2t5LTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YWN0LnJlZmVycmFsLmFjdGlvblJlcXVpcmVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTWVzc2FnZXMgdmlzdWFsbHkgbmVzdGVkIHVuZGVyIHJlZmVycmFsICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KGFjdC5yZWZlcnJhbC5tZXNzYWdlcz8ubGVuZ3RoID8gYWN0LnJlZmVycmFsLm1lc3NhZ2VzIDogKGFjdC5yZWZlcnJhbC5yZXNwb25zZSA/IFthY3QucmVmZXJyYWwucmVzcG9uc2VdIDogW10pKS5tYXAoKG1zZywgbXNnSWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e21zZ0lkeH0gY2xhc3NOYW1lPVwibXQtMiBwdC0yIGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDAgYmctZW1lcmFsZC01MC8yMCBwLTIgcm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtMTAwIHNwYWNlLXktMSB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciB0ZXh0LVs4cHhdIHRleHQtZW1lcmFsZC04MDAgZm9udC1ib2xkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtm+2KfYs9iuINin2YLYr9in2YU6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm9cIj57bXNnLmNyZWF0ZWRBdH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtODAwIGZvbnQtc2VtaWJvbGQgbGVhZGluZy1yZWxheGVkIGJnLXdoaXRlLzcwIHAtMiByb3VuZGVkIGJvcmRlciBib3JkZXItZW1lcmFsZC0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge21zZy50ZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVzcG9uc2UgYXR0YWNobWVudCBpZiBhbnkgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bXNnLmF0dGFjaG1lbnQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB0LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bXNnLmF0dGFjaG1lbnQuY29udGVudCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e21zZy5hdHRhY2htZW50LmNvbnRlbnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvd25sb2FkPXttc2cuYXR0YWNobWVudC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBweC0yLjUgcHktMSByb3VuZGVkIGJnLWVtZXJhbGQtMTAwLzYwIGhvdmVyOmJnLWVtZXJhbGQtMTAwIGJvcmRlciBib3JkZXItZW1lcmFsZC0yMDAgdGV4dC1lbWVyYWxkLTgwMCBob3Zlcjp0ZXh0LWVtZXJhbGQtOTAwIHRleHQtWzEwcHhdIGZvbnQtYm9sZCBtdC0xIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cItiv2KfZhtmE2YjYryDZgdin24zZhCDZvtuM2YjYs9iqINin2YLYr9in2YVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFwZXJjbGlwIHNpemU9ezExfSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNjAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2YHYp9uM2YQg2b7bjNmI2LPYqiDZvtin2LPYrjoge21zZy5hdHRhY2htZW50Lm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCI+KHttc2cuYXR0YWNobWVudC5zaXplfSk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtMi41IHB5LTEgcm91bmRlZCBiZy1lbWVyYWxkLTUwIGJvcmRlciBib3JkZXItZW1lcmFsZC0xMDAgdGV4dC1lbWVyYWxkLTcwMCB0ZXh0LVsxMHB4XSBmb250LWJvbGQgbXQtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFwZXJjbGlwIHNpemU9ezExfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7Zgdin24zZhCDZvtuM2YjYs9iqINm+2KfYs9iuOiB7bXNnLmF0dGFjaG1lbnQubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC01MDBcIj4oe21zZy5hdHRhY2htZW50LnNpemV9KTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVs4cHhdIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgINin2LHYs9in2YTigIzaqdmG2YbYr9mHOiB7bXNnLnJlc3BvbmRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogRm9ybSB0byBBZGQgQWN0aXZpdHkgdG8gdGhpcyBncm91cCAob25seSBpZiBncm91cCBpcyBBY3RpdmUpICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzR3JvdXBDbG9zZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBwdC00IGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDAgc3BhY2UteS0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS02MDAgYmxvY2tcIj7Yq9io2Kog2YHYudin2YTbjNiqINis2K/bjNivINiv2LEg2KfbjNmGINiv2LPYqtmH4oCM2KjZhtiv24w6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBiZy1zbGF0ZS01MCBwLTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzPXsyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtuZXdBY3Rpdml0eVRleHRbZ3JvdXAuaWRdIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXROZXdBY3Rpdml0eVRleHQocHJldiA9PiAoeyAuLi5wcmV2LCBbZ3JvdXAuaWRdOiB2YWwgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLYtNix2K0g2KzYstim24zYp9iqINmB2LnYp9mE24zYqiDYp9mG2KzYp9mFINi02K/Zh9iMINmF2qnYp9mE2YXYp9iqINmB2YbbjCDbjNinINmF2LDYp9qp2LHYp9iqINio2Kcg2YXYtNiq2LHbjC4uLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcC0yIHRleHQteHMgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctc2t5LTUwMC8yMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodCBwbGFjZWhvbGRlci1zbGF0ZS00MDAgYmctd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBBdHRhY2htZW50IHNpbXVsYXRvciAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IGdhcC0zIGl0ZW1zLXN0YXJ0IHNtOml0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY3Vyc29yLXBvaW50ZXIgYmctd2hpdGUgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcHgtMyBweS0xLjUgcm91bmRlZC1tZCBob3ZlcjpiZy1zbGF0ZS01MCB0cmFuc2l0aW9uIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTYwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFwZXJjbGlwIHNpemU9ezEyfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtm+24zZiNiz2Kog2YHYp9uM2YQgKNiq2LXZiNuM2LEg24zYpyDYs9mG2K8pPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlkZGVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlcz8uWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUuc2l6ZSA+IDIgKiAxMDI0ICogMTAyNCAmJiAhZmlsZS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ9it2K/Yp9qp2KvYsSDYrdis2YUg2YXYrNin2LIg2KjYsdin24wg2YHYp9uM2YTigIzZh9in24wg2LrbjNix2KrYtdmI24zYsduMINuyINmF2q/Yp9io2KfbjNiqINmF24zigIzYqNin2LTYry4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXByZXNzSW1hZ2UoZmlsZSwgKGRhdGFVcmwsIHNpemVTdHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXROZXdBY3Rpdml0eUF0dGFjaG1lbnQocHJldiA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtncm91cC5pZF06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBzaXplU3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBkYXRhVXJsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtuZXdBY3Rpdml0eUF0dGFjaG1lbnRbZ3JvdXAuaWRdICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1za3ktNzAwIGZvbnQtYm9sZCBiZy1za3ktNTAgcHgtMiBweS0xIHJvdW5kZWQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgYm9yZGVyIGJvcmRlci1za3ktMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge25ld0FjdGl2aXR5QXR0YWNobWVudFtncm91cC5pZF0/Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE5ld0FjdGl2aXR5QXR0YWNobWVudChwcmV2ID0+ICh7IC4uLnByZXYsIFtncm91cC5pZF06IG51bGwgfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTUwMCBob3Zlcjp0ZXh0LXJvc2UtNzAwIGZvbnQtYm9sZCB0ZXh0LXhzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDDl1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZmVycmFsIHRvZ2dsZSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBjdXJzb3ItcG9pbnRlciBmb250LWJvbGQgdGV4dC1zbGF0ZS02MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtyZWZlcnJhbEVuYWJsZWRbZ3JvdXAuaWRdIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRSZWZlcnJhbEVuYWJsZWQocHJldiA9PiAoeyAuLi5wcmV2LCBbZ3JvdXAuaWRdOiBjaGVja2VkIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZCBib3JkZXItc2xhdGUtMzAwIHRleHQtc2t5LTUwMCBmb2N1czpyaW5nLXNreS01MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtmG24zYp9iyINio2Ycg2KfZgtiv2KfZhSDZiCDYp9ix2KzYp9i5INio2Ycg2YfZhdqp2KfYsdifPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWZlcnJhbCBTdWItZm9ybSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlZmVycmFsRW5hYmxlZFtncm91cC5pZF0gJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIGJnLXdoaXRlIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgc3BhY2UteS0zIHRleHQteHMgYW5pbWF0ZS1mYWRlLWluIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2tcIj7Yp9ix2KzYp9i5INio2Ycg2YfZhdqp2KfYsSAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVmZXJyYWxBc3NpZ25lZFRvW2dyb3VwLmlkXSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmVmZXJyYWxBc3NpZ25lZFRvKHByZXYgPT4gKHsgLi4ucHJldiwgW2dyb3VwLmlkXTogdmFsIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZCBwLTEuNSB0ZXh0LXhzIGJnLXdoaXRlIHRleHQtcmlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj4tLSDYp9mG2KrYrtin2Kgg2YfZhdqp2KfYsSAtLTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyh1c2VycyB8fCBbXSkubWFwKCh1KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1LmlkfSB2YWx1ZT17dS5mdWxsTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3UuZnVsbE5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2tcIj7Yp9mC2K/Yp9mFINiu2YjYp9iz2KrZh+KAjNi02K/ZhyDZhdi02K7YtSAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cz17Mn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVmZXJyYWxBY3Rpb25bZ3JvdXAuaWRdIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRSZWZlcnJhbEFjdGlvbihwcmV2ID0+ICh7IC4uLnByZXYsIFtncm91cC5pZF06IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItmF2KvZhNin2Ys6INio2LHYsdiz24wg2qnYp9iq2KfZhNmI2q8g2KfYqNi52KfYr9uMINix2YbYrCDaqdin2YTYpyDZiCDYqtin24zbjNivINmG2YfYp9uM24wg2KjZhyDYqtiv2KfYsdqp2KfYqlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQgcC0yIHRleHQteHMgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctc2t5LTUwMCBvdXRsaW5lLW5vbmUgdGV4dC1yaWdodCBiZy13aGl0ZSBsZWFkaW5nLXJlbGF4ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN1Ym1pdCBBY3Rpdml0eSBCdXR0b24gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWVuZCBwdC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBuZXdBY3Rpdml0eVRleHRbZ3JvdXAuaWRdIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRhY2htZW50RGF0YSA9IG5ld0FjdGl2aXR5QXR0YWNobWVudFtncm91cC5pZF0gfHwgbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRleHQudHJpbSgpICYmICFhdHRhY2htZW50RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfZhNi32YHYp9mLINin2KjYqtiv2Kcg2LTYsditINmB2LnYp9mE24zYqiDbjNinINm+24zZiNiz2Kog2LHYpyDZiNin2LHYryDaqdmG24zYry4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVmZXJyYWxEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZmVycmFsRW5hYmxlZFtncm91cC5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3NpZ25lZFRvID0gcmVmZXJyYWxBc3NpZ25lZFRvW2dyb3VwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSByZWZlcnJhbEFjdGlvbltncm91cC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3NpZ25lZFRvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn2YTYt9mB2KfZiyDZh9mF2qnYp9ixINin2LHYrNin2LnigIzYtNmI2YbYr9mHINix2Kcg2KfZhtiq2K7Yp9ioINqp2YbbjNivLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFjdGlvbiB8fCAhYWN0aW9uLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ9mE2LfZgdin2Ysg2LTYsditINin2YLYr9in2YUg2KfYsdis2KfYuSDYsdinINmI2KfYsdivINqp2YbbjNivLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcnJhbERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25lZFRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUmVxdWlyZWQ6IGFjdGlvbi50cmltKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25lZEJ5OiBjdXJyZW50VXNlcj8uZnVsbE5hbWUgfHwgJ9mF2K3ZhdivINiq2YjaqdmEINmF2YLYr9mFJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRkUHJvamVjdEFjdGl2aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkUHJvamVjdEFjdGl2aXR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC50cmltKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVycmFsRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyPy5mdWxsTmFtZSB8fCAn2qnYp9ix2KjYsSDYs9uM2LPYqtmFJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgZm9ybXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXROZXdBY3Rpdml0eVRleHQocHJldiA9PiAoeyAuLi5wcmV2LCBbZ3JvdXAuaWRdOiAnJyB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0TmV3QWN0aXZpdHlBdHRhY2htZW50KHByZXYgPT4gKHsgLi4ucHJldiwgW2dyb3VwLmlkXTogbnVsbCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmVmZXJyYWxFbmFibGVkKHByZXYgPT4gKHsgLi4ucHJldiwgW2dyb3VwLmlkXTogZmFsc2UgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlZmVycmFsQXNzaWduZWRUbyhwcmV2ID0+ICh7IC4uLnByZXYsIFtncm91cC5pZF06ICcnIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRSZWZlcnJhbEFjdGlvbihwcmV2ID0+ICh7IC4uLnByZXYsIFtncm91cC5pZF06ICcnIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn2YHYudin2YTbjNiqINis2K/bjNivINio2Kcg2YXZiNmB2YLbjNiqINir2KjYqiDar9ix2K/bjNivLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0xLjUgYmctZW1lcmFsZC01MDAgaG92ZXI6YmctZW1lcmFsZC02MDAgdGV4dC13aGl0ZSByb3VuZGVkIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgc2hhZG93LW1kIHNoYWRvdy1lbWVyYWxkLTUwMC8xNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNlbmQgc2l6ZT17MTF9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDYq9io2Kog2KfbjNmGINmB2LnYp9mE24zYqlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiBtb2RhbFRhYiA9PT0gJ2RvY3VtZW50cycgPyAoXG4gICAgICAgICAgICAgICAgcmVuZGVyUHJvamVjdERvY3VtZW50cyhzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzKVxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIHJlbmRlclByb2plY3RTdXBwbHlTdGF0dXMoc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcylcbiAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICB7LyogUmVuZGVyIHRoZSBEb2N1bWVudCBQcmV2aWV3IE1vZGFsIHdoZW4gYWN0aXZlICovfVxuICAgICAgICAgICAgICB7cmVuZGVyRG9jdW1lbnRQcmV2aWV3TW9kYWwoKX1cblxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBNb2RhbCBGb290ZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTEwMCBwLTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTIwMCBmbGV4IGp1c3RpZnktZW5kXCI+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzKG51bGwpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiBiZy1zbGF0ZS04MDAgdGV4dC13aGl0ZSByb3VuZGVkLXhsIHRleHQteHMgZm9udC1ib2xkIGhvdmVyOmJnLXNsYXRlLTcwMCB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgINio2LPYqtmGINm+2YbYrNix2Ycg2KrYp9ix24zYrtqG2YdcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBDb25maXJtIERlbGV0ZSBNb2RhbCAqL31cbiAgICAgIDxDb25maXJtTW9kYWxcbiAgICAgICAgaXNPcGVuPXtkZWxldGVDb25maXJtT3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIHNldERlbGV0ZUNvbmZpcm1PcGVuKGZhbHNlKTtcbiAgICAgICAgICBzZXRQcm9qZWN0VG9EZWxldGVJZChudWxsKTtcbiAgICAgICAgICBzZXRQcm9qZWN0VG9EZWxldGVOYW1lKCcnKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25Db25maXJtPXsoKSA9PiB7XG4gICAgICAgICAgaWYgKHByb2plY3RUb0RlbGV0ZUlkKSB7XG4gICAgICAgICAgICBkZWxldGVQcm9qZWN0KHByb2plY3RUb0RlbGV0ZUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHRpdGxlPVwi2K3YsNmBINm+2LHZiNqY2YdcIlxuICAgICAgICBtZXNzYWdlPXtg2KLbjNinINin2LIg2K3YsNmBINm+2LHZiNqY2YcgXCIke3Byb2plY3RUb0RlbGV0ZU5hbWV9XCIg2KfYt9mF24zZhtin2YYg2K/Yp9ix24zYr9ifINin24zZhiDYudmF2YQg2LrbjNix2YLYp9io2YQg2KjYp9iy2q/YtNiqINin2LPYqi5gfVxuICAgICAgLz5cblxuICAgICAgey8qIENvbmZpcm0gRGVsZXRlIEFjdGl2aXR5IE1vZGFsICovfVxuICAgICAgPENvbmZpcm1Nb2RhbFxuICAgICAgICBpc09wZW49e2FjdGl2aXR5RGVsZXRlQ29uZmlybU9wZW59XG4gICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICBzZXRBY3Rpdml0eURlbGV0ZUNvbmZpcm1PcGVuKGZhbHNlKTtcbiAgICAgICAgICBzZXRBY3Rpdml0eVRvRGVsZXRlR3JvdXBJZChudWxsKTtcbiAgICAgICAgICBzZXRBY3Rpdml0eVRvRGVsZXRlSWQobnVsbCk7XG4gICAgICAgIH19XG4gICAgICAgIG9uQ29uZmlybT17KCkgPT4ge1xuICAgICAgICAgIGlmIChzZWxlY3RlZFByb2plY3RGb3JBY3Rpdml0aWVzICYmIGFjdGl2aXR5VG9EZWxldGVHcm91cElkICYmIGFjdGl2aXR5VG9EZWxldGVJZCkge1xuICAgICAgICAgICAgZGVsZXRlUHJvamVjdEFjdGl2aXR5Py4oc2VsZWN0ZWRQcm9qZWN0Rm9yQWN0aXZpdGllcy5pZCwgYWN0aXZpdHlUb0RlbGV0ZUdyb3VwSWQsIGFjdGl2aXR5VG9EZWxldGVJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICB0aXRsZT1cItit2LDZgSDZgdi52KfZhNuM2Kog2b7YsdmI2pjZh1wiXG4gICAgICAgIG1lc3NhZ2U9XCLYotuM2Kcg2KfYsiDYrdiw2YEg2KfbjNmGINmB2LnYp9mE24zYqiDYp9i32YXbjNmG2KfZhiDYr9in2LHbjNiv2J8g2KfbjNmGINi52YXZhCDYutuM2LHZgtin2KjZhCDYqNin2LLar9i02Kog2KfYs9iqLlwiXG4gICAgICAvPlxuXG4gICAgICB7LyogUXVpY2sgQ3VzdG9tZXIgQWRkIE1vZGFsICovfVxuICAgICAge3F1aWNrQWRkVHlwZSAmJiAoXG4gICAgICAgIDxRdWlja0FkZE1vZGFsXG4gICAgICAgICAgaXNPcGVuPXshIXF1aWNrQWRkVHlwZX1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRRdWlja0FkZFR5cGUobnVsbCk7XG4gICAgICAgICAgICBzZXRRdWlja0FkZEN1c3RvbWVyVGFyZ2V0KG51bGwpO1xuICAgICAgICAgICAgc2V0UXVpY2tBZGRQcm9kdWN0SW5kZXgobnVsbCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB0eXBlPXtxdWlja0FkZFR5cGV9XG4gICAgICAgICAgc2V0dGluZ3M9e3NldHRpbmdzfVxuICAgICAgICAgIGN1c3RvbWVycz17Y3VzdG9tZXJzfVxuICAgICAgICAgIGFkZEN1c3RvbWVyPXthZGRDdXN0b21lcn1cbiAgICAgICAgICBwcm9kdWN0cz17cHJvZHVjdHN9XG4gICAgICAgICAgYWRkUHJvZHVjdD17YWRkUHJvZHVjdH1cbiAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgaW5pdGlhbEN1c3RUeXBlPXsocXVpY2tBZGRDdXN0b21lclRhcmdldCA9PT0gJ2ZpbmFuY2lhbENvbnRhY3QnIHx8IHF1aWNrQWRkQ3VzdG9tZXJUYXJnZXQgPT09ICd0ZWNobmljYWxDb250YWN0JykgPyAn2K3ZgtuM2YLbjCcgOiB1bmRlZmluZWR9XG4gICAgICAgICAgaW5pdGlhbExpbmtlZEN1c3RvbWVySWRzPXsoKHF1aWNrQWRkQ3VzdG9tZXJUYXJnZXQgPT09ICdmaW5hbmNpYWxDb250YWN0JyB8fCBxdWlja0FkZEN1c3RvbWVyVGFyZ2V0ID09PSAndGVjaG5pY2FsQ29udGFjdCcpICYmIGN1c3RvbWVySWQpID8gW2N1c3RvbWVySWRdIDogdW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3VjY2Vzcz17KG5ld0VudGl0eSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5ld0VudGl0eSAmJiBuZXdFbnRpdHkuaWQpIHtcbiAgICAgICAgICAgICAgaWYgKHF1aWNrQWRkVHlwZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIGlmIChxdWlja0FkZEN1c3RvbWVyVGFyZ2V0ID09PSAnY3VzdG9tZXJJZCcpIHtcbiAgICAgICAgICAgICAgICAgIHNldEN1c3RvbWVySWQobmV3RW50aXR5LmlkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHF1aWNrQWRkQ3VzdG9tZXJUYXJnZXQgPT09ICdlbmRVc2VyJykge1xuICAgICAgICAgICAgICAgICAgc2V0RW5kVXNlcihuZXdFbnRpdHkuaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocXVpY2tBZGRDdXN0b21lclRhcmdldCA9PT0gJ2ZpbmFuY2lhbENvbnRhY3QnKSB7XG4gICAgICAgICAgICAgICAgICBzZXRGaW5hbmNpYWxDb250YWN0KG5ld0VudGl0eS5pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxdWlja0FkZEN1c3RvbWVyVGFyZ2V0ID09PSAndGVjaG5pY2FsQ29udGFjdCcpIHtcbiAgICAgICAgICAgICAgICAgIHNldFRlY2huaWNhbENvbnRhY3QobmV3RW50aXR5LmlkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2V0Q3VzdG9tZXJJZChuZXdFbnRpdHkuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChxdWlja0FkZFR5cGUgPT09ICdwcm9kdWN0Jykge1xuICAgICAgICAgICAgICAgIGlmIChxdWlja0FkZFByb2R1Y3RJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgaGFuZGxlSXRlbVByb2R1Y3RDaGFuZ2UocXVpY2tBZGRQcm9kdWN0SW5kZXgsIG5ld0VudGl0eS5pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNldEl0ZW1zTmVlZGVkKFsuLi5pdGVtc05lZWRlZCwgeyBwcm9kdWN0SWQ6IG5ld0VudGl0eS5pZCwgbmFtZTogbmV3RW50aXR5LmRpc3BsYXlOYW1lIHx8IG5ld0VudGl0eS5uYW1lLCBxdWFudGl0eTogMSB9XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRRdWlja0FkZFR5cGUobnVsbCk7XG4gICAgICAgICAgICBzZXRRdWlja0FkZEN1c3RvbWVyVGFyZ2V0KG51bGwpO1xuICAgICAgICAgICAgc2V0UXVpY2tBZGRQcm9kdWN0SW5kZXgobnVsbCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG5cbiAgICBcbiAgICAgIHsvKiBEZWxldGUgQ29uZmlybWF0aW9uIE1vZGFsICovfVxuICAgICAge2dyb3VwVG9EZWxldGUgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei1bMTAwXSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTQgYmctc2xhdGUtOTAwLzYwIGJhY2tkcm9wLWJsdXItc21cIiBkaXI9XCJydGxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHctZnVsbCBtYXgtdy1tZCByb3VuZGVkLTJ4bCBzaGFkb3cteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xMDAgb3ZlcmZsb3ctaGlkZGVuIGZsZXggZmxleC1jb2wgYW5pbWF0ZS1zY2FsZS1pblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYmctcm9zZS01MC81MFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtcm9zZS02MDBcIj5cbiAgICAgICAgICAgICAgICA8VHJhc2gyIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWV4dHJhYm9sZCB0ZXh0LXNtXCI+2K3YsNmBINiv2LPYqtmHINmB2LnYp9mE24zYqjwvaDM+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS03MDAgdGV4dC1zbSBmb250LW1lZGl1bSBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICDYotuM2Kcg2KfYsiDYrdiw2YEg2KfbjNmGINiv2LPYqtmHINmB2LnYp9mE24zYqiDZiCDYqtmF2KfZhSDYs9mI2KfYqNmCINii2YYg2KfYt9mF24zZhtin2YYg2K/Yp9ix24zYr9ifINin24zZhiDYudmF2YQg2LrbjNix2YLYp9io2YQg2KjYp9iy2q/YtNiqINin2LPYqi5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIHAtNCBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwIGJnLXNsYXRlLTUwXCI+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRHcm91cFRvRGVsZXRlKG51bGwpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTYwMCBob3Zlcjp0ZXh0LXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS0xMDAgcm91bmRlZC1sZyB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgINin2YbYtdix2KfZgVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChkZWxldGVQcm9qZWN0Q2F0ZWdvcnlHcm91cCAmJiBncm91cFRvRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVByb2plY3RDYXRlZ29yeUdyb3VwKGdyb3VwVG9EZWxldGUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgc2V0R3JvdXBUb0RlbGV0ZShudWxsKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIGJnLXJvc2UtNjAwIGhvdmVyOmJnLXJvc2UtNzAwIHJvdW5kZWQtbGcgc2hhZG93LXNtIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAg2KjZhNmH2Iwg2K3YsNmBINi02YjYr1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG48L2Rpdj5cbiAgKTtcbn1cbiJdLCJtYXBwaW5ncyI6IkFBc25DYyxTQThTSSxVQTlTSjtBQXRuQ2QsT0FBTyxTQUFTLGdCQUFnQjtBQUNoQztBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVB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