import { useState, useEffect } from 'react';
import { 
  Customer, 
  Product, 
  Supplier, 
  Proforma, 
  PurchaseOrder, 
  Project, 
  Transaction, 
  Task, 
  ExchangeRate, 
  ERPSettings,
  ProjectCategoryGroup,
  ProjectActivity,
  ProjectReferral,
  ProjectReferralResponse,
  User
} from './types';
import { 
  SEED_PRODUCTS, 
  SEED_CUSTOMERS, 
  SEED_SUPPLIERS, 
  SEED_EXCHANGE_RATES, 
  SEED_PROJECTS, 
  SEED_PROFORMAS, 
  SEED_PURCHASE_ORDERS, 
  SEED_TRANSACTIONS, 
  SEED_TASKS, 
  DEFAULT_SETTINGS 
} from './seedData';
import { toShamsiStr, getTodayShamsi, gregorianToJalali, addDaysToShamsi, addWorkingDaysToShamsi } from './dateUtils';
import { formatERPNumber } from './numUtils';

export const SEED_PROJECT_CATEGORY_GROUPS: ProjectCategoryGroup[] = [];

export const SEED_USERS: User[] = [
  {
    id: 'user-1',
    username: 'mohammad',
    password: '123',
    fullName: 'محمد توکل مقدم',
    role: 'admin',
    isSystemAdmin: true,
    permissions: {
      dashboard: true,
      customers: true,
      projects: true,
      proformas: true,
      products: true,
      suppliers: true,
      purchaseOrders: true,
      transactions: true,
      rates: true,
      tasks: true,
      referrals: true,
      reports: true,
      settings: true,
      users: true
    }
  },
  {
    id: 'user-2',
    username: 'antony',
    password: '123',
    fullName: 'آنتونی فیرو',
    role: 'user',
    isSystemAdmin: false,
    permissions: {
      dashboard: true,
      customers: true,
      projects: true,
      proformas: true,
      products: true,
      suppliers: true,
      purchaseOrders: true,
      transactions: true,
      rates: true,
      tasks: true,
      referrals: true,
      reports: true,
      settings: false,
      users: false
    }
  },
  {
    id: 'user-3',
    username: 'hosseini',
    password: '123',
    fullName: 'مهندس حسینی',
    role: 'user',
    isSystemAdmin: false,
    permissions: {
      dashboard: true,
      customers: true,
      projects: true,
      proformas: true,
      products: true,
      suppliers: true,
      purchaseOrders: true,
      transactions: true,
      rates: true,
      tasks: true,
      referrals: true,
      reports: true,
      settings: false,
      users: false
    }
  }
];

export function useERPStore() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectCategoryGroups, setProjectCategoryGroups] = useState<ProjectCategoryGroup[]>([]);
  const [settings, setSettings] = useState<ERPSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Simulated User Role state ('admin' = Manager/Administrator, 'user' = Standard Employee/Expert)
  const [userRole, setUserRole] = useState<'admin' | 'user'>(() => {
    try {
      const saved = localStorage.getItem('erp_simulated_role');
      return (saved === 'user' ? 'user' : 'admin');
    } catch (e) {
      return 'admin';
    }
  });

  const changeRole = (role: 'admin' | 'user') => {
    setUserRole(role);
    try {
      localStorage.setItem('erp_simulated_role', role);
    } catch (e) {}
  };

  // Initialize store from localStorage
  useEffect(() => {
    try {
      // Force clear for first-time deploy of blank state to ensure existing users see empty data
      const hasForcedClear = localStorage.getItem('erp_force_clear_data_v5');
      if (!hasForcedClear) {
        localStorage.setItem('erp_customers', JSON.stringify([]));
        localStorage.setItem('erp_products', JSON.stringify([]));
        localStorage.setItem('erp_suppliers', JSON.stringify([]));
        localStorage.setItem('erp_projects', JSON.stringify([]));
        localStorage.setItem('erp_proformas', JSON.stringify([]));
        localStorage.setItem('erp_purchase_orders', JSON.stringify([]));
        localStorage.setItem('erp_transactions', JSON.stringify([]));
        localStorage.setItem('erp_tasks', JSON.stringify([]));
        localStorage.setItem('erp_project_category_groups', JSON.stringify([]));
        localStorage.setItem('erp_users', JSON.stringify(SEED_USERS));
        localStorage.setItem('erp_current_user', JSON.stringify(SEED_USERS[0]));
        localStorage.setItem('erp_simulated_role', 'admin');
        localStorage.setItem('erp_force_clear_data_v5', 'true');
      }

      const storedCustomers = localStorage.getItem('erp_customers');
      const storedProducts = localStorage.getItem('erp_products');
      const storedSuppliers = localStorage.getItem('erp_suppliers');
      const storedRates = localStorage.getItem('erp_exchange_rates');
      const storedProjects = localStorage.getItem('erp_projects');
      const storedProformas = localStorage.getItem('erp_proformas');
      const storedPOs = localStorage.getItem('erp_purchase_orders');
      const storedTransactions = localStorage.getItem('erp_transactions');
      const storedTasks = localStorage.getItem('erp_tasks');
      const storedSettings = localStorage.getItem('erp_settings');

      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      else {
        setCustomers([]);
        localStorage.setItem('erp_customers', JSON.stringify([]));
      }

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      else {
        setProducts([]);
        localStorage.setItem('erp_products', JSON.stringify([]));
      }

      if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers));
      else {
        setSuppliers([]);
        localStorage.setItem('erp_suppliers', JSON.stringify([]));
      }

      if (storedRates) setExchangeRates(JSON.parse(storedRates));
      else {
        setExchangeRates(SEED_EXCHANGE_RATES);
        localStorage.setItem('erp_exchange_rates', JSON.stringify(SEED_EXCHANGE_RATES));
      }

      // Convert loaded or seeded project dates
      const rawProjects = storedProjects ? JSON.parse(storedProjects) : [];
      const mappedProjects = rawProjects.map((p: Project) => ({
        ...p,
        creationDate: toShamsiStr(p.creationDate),
        expectedCloseDate: toShamsiStr(p.expectedCloseDate)
      }));
      setProjects(mappedProjects);
      localStorage.setItem('erp_projects', JSON.stringify(mappedProjects));

      // Convert loaded or seeded proforma dates
      const rawProformas = storedProformas ? JSON.parse(storedProformas) : [];
      const mappedProformas = rawProformas.map((pf: Proforma) => ({
        ...pf,
        issueDate: toShamsiStr(pf.issueDate),
        expiryDate: toShamsiStr(pf.expiryDate)
      }));
      setProformas(mappedProformas);
      localStorage.setItem('erp_proformas', JSON.stringify(mappedProformas));

      // Convert loaded or seeded purchase order dates
      const rawPOs = storedPOs ? JSON.parse(storedPOs) : [];
      const mappedPOs = rawPOs.map((po: PurchaseOrder) => ({
        ...po,
        orderDate: toShamsiStr(po.orderDate),
        expectedDeliveryDate: toShamsiStr(po.expectedDeliveryDate),
        createdAt: toShamsiStr(po.createdAt)
      }));
      setPurchaseOrders(mappedPOs);
      localStorage.setItem('erp_purchase_orders', JSON.stringify(mappedPOs));

      // Convert loaded or seeded transaction dates
      const rawTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      const mappedTransactions = rawTransactions.map((t: Transaction) => ({
        ...t,
        date: toShamsiStr(t.date)
      }));
      setTransactions(mappedTransactions);
      localStorage.setItem('erp_transactions', JSON.stringify(mappedTransactions));

      // Convert loaded or seeded task dates
      const rawTasks = storedTasks ? JSON.parse(storedTasks) : [];
      const mappedTasks = rawTasks.map((tk: Task) => ({
        ...tk,
        dueDate: toShamsiStr(tk.dueDate)
      }));
      setTasks(mappedTasks);
      localStorage.setItem('erp_tasks', JSON.stringify(mappedTasks));

      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        const mergedDropdownItems = {
          ...DEFAULT_SETTINGS.dropdownItems,
          ...(parsed.dropdownItems || {})
        };
        const merged = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          dropdownItems: mergedDropdownItems
        };
        setSettings(merged);
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem('erp_settings', JSON.stringify(DEFAULT_SETTINGS));
      }

      const storedCategoryGroups = localStorage.getItem('erp_project_category_groups');
      if (storedCategoryGroups) {
        setProjectCategoryGroups(JSON.parse(storedCategoryGroups));
      } else {
        setProjectCategoryGroups([]);
        localStorage.setItem('erp_project_category_groups', JSON.stringify([]));
      }

      const storedUsers = localStorage.getItem('erp_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(SEED_USERS);
        localStorage.setItem('erp_users', JSON.stringify(SEED_USERS));
      }

      const storedCurrentUser = localStorage.getItem('erp_current_user');
      if (storedCurrentUser) {
        const u = JSON.parse(storedCurrentUser);
        setCurrentUser(u);
        setUserRole(u.role);
      } else {
        setCurrentUser(null);
      }

      setIsInitialized(true);
    } catch (e) {
      console.error("Error loading localStorage data in ERP store", e);
      // Fallback with empty states
      setCustomers([]);
      setProducts([]);
      setSuppliers([]);
      setExchangeRates(SEED_EXCHANGE_RATES);
      setUsers(SEED_USERS);
      setCurrentUser(null);
      
      setProjects([]);
      setProformas([]);
      setPurchaseOrders([]);
      setTransactions([]);
      setTasks([]);

      setSettings(DEFAULT_SETTINGS);
      setProjectCategoryGroups(SEED_PROJECT_CATEGORY_GROUPS);
      setIsInitialized(true);
    }
  }, []);

  const fetchRatesFromAPI = async () => {
    try {
      const response = await fetch('/api/rates');
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      if (data && data.success && data.rates) {
        setExchangeRates(currentRates => {
          const updated = currentRates.map(r => {
            const val = data.rates[r.currency];
            if (val) {
              return {
                ...r,
                rateToRIYAL: val,
                lastUpdated: new Date().toISOString()
              };
            }
            return r;
          });
          localStorage.setItem('erp_exchange_rates', JSON.stringify(updated));
          return updated;
        });
        console.log('Exchange rates updated from tgju.com successfully!');
        return true;
      }
    } catch (err) {
      console.warn('Failed to auto-fetch exchange rates from tgju:', err);
    }
    return false;
  };

  // Auto-fetch exchange rates on startup once initialized from tgju.com API
  useEffect(() => {
    if (isInitialized) {
      fetchRatesFromAPI();
    }
  }, [isInitialized]);

  // Save changes helper
  const saveToStorage = (key: string, data: any, stateSetter: Function) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      stateSetter(data);
    } catch (error) {
      console.error(`Error saving to localStorage for key: ${key}`, error);
      alert(
        'خطا در ذخیره‌سازی محلی داده‌ها!\n\n' +
        'احتمالاً حجم داده‌ها (مانند فایل‌های تصویر بارگذاری شده برای لوگو، مهر یا امضا) بیش از حد مجاز است.\n' +
        'لطفاً از فایل‌های تصویری با حجم کمتر استفاده نمایید یا حجم تصاویر جاری را کاهش دهید.'
      );
    }
  };

  // --- Customers CRUD ---
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => {
      const updated = [newCustomer, ...prev];
      localStorage.setItem('erp_customers', JSON.stringify(updated));
      return updated;
    });
    return newCustomer;
  };

  const updateCustomer = (updatedCust: Customer) => {
    setCustomers(prev => {
      const updated = prev.map(c => c.id === updatedCust.id ? updatedCust : c);
      localStorage.setItem('erp_customers', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('erp_customers', JSON.stringify(updated));
      return updated;
    });
  };

  const batchUpdateCustomers = (updatedList: Customer[]) => {
    saveToStorage('erp_customers', updatedList, setCustomers);
  };

  // --- Products & Stock CRUD ---
  const addProduct = (product: Omit<Product, 'id' | 'stockLevel'> & { stockLevel?: number }) => {
    let finalCode = product.code;
    const isAutoGenerated = !finalCode || finalCode.startsWith('EQ-');
    if (isAutoGenerated) {
      const seqNum = products.length + 1;
      finalCode = formatERPNumber(
        settings.documentFormats.productFormat || 'EQ-{RAND:5}',
        {
          seq: seqNum,
          category: product.category
        }
      );
    }
    const newProduct: Product = {
      ...product,
      code: finalCode,
      id: `prod-${Date.now()}`,
      stockLevel: product.stockLevel || 0
    };
    const updated = [newProduct, ...products];
    saveToStorage('erp_products', updated, setProducts);
    return newProduct;
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    saveToStorage('erp_products', updated, setProducts);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveToStorage('erp_products', updated, setProducts);
  };

  const adjustProductStock = (id: string, amount: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, stockLevel: Math.max(0, p.stockLevel + amount) };
      }
      return p;
    });
    saveToStorage('erp_products', updated, setProducts);
  };

  // --- Suppliers CRUD ---
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `supp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newSupplier, ...suppliers];
    saveToStorage('erp_suppliers', updated, setSuppliers);
    return newSupplier;
  };

  const updateSupplier = (updatedSupp: Supplier) => {
    const updated = suppliers.map(s => s.id === updatedSupp.id ? updatedSupp : s);
    saveToStorage('erp_suppliers', updated, setSuppliers);
  };

  const deleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    saveToStorage('erp_suppliers', updated, setSuppliers);
  };

  // --- Exchange Rates ---
  const updateExchangeRate = (id: string, newRate: number) => {
    const updated = exchangeRates.map(r => r.id === id ? { ...r, rateToRIYAL: newRate, lastUpdated: new Date().toISOString() } : r);
    saveToStorage('erp_exchange_rates', updated, setExchangeRates);
  };

  // --- Projects CRUD ---
  const addProject = (project: Omit<Project, 'id' | 'code' | 'creationDate'>) => {
    const seqNum = projects.length + 1;
    const computedCode = formatERPNumber(
      settings.documentFormats.projectFormat || 'ATA-{YYYY}-{SEQ:3}',
      {
        seq: seqNum,
        customerName: project.customerName
      }
    );
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      code: computedCode,
      creationDate: getTodayShamsi()
    };
    const updated = [newProject, ...projects];
    saveToStorage('erp_projects', updated, setProjects);
    return newProject;
  };

  const updateProject = (updatedProj: Project) => {
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    saveToStorage('erp_projects', updated, setProjects);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveToStorage('erp_projects', updated, setProjects);
  };

  // Helper to convert Persian digits to English
  const faToEnDigits = (str: string): string => {
    const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let result = str;
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(faDigits[i], 'g'), i.toString());
      result = result.replace(new RegExp(arDigits[i], 'g'), i.toString());
    }
    return result;
  };

  // Helper to parse delivery terms into days offset
  const parseDeliveryPeriodToDays = (deliveryText: string): number => {
    if (!deliveryText) return 30; // default 30 days
    
    const text = deliveryText.trim().toLowerCase();
    
    // immediate (فوری)
    if (text.includes('فوری') || text.includes('fouri') || text.includes('فور')) {
      return 0;
    }

    const normalizedText = faToEnDigits(text);
    const match = normalizedText.match(/\d+/);
    
    if (!match) {
      if (normalizedText.includes('هفته')) return 7;
      if (normalizedText.includes('ماه')) return 30;
      if (normalizedText.includes('روز')) return 1;
      return 30; // default
    }

    const numberVal = parseInt(match[0], 10);
    
    if (normalizedText.includes('هفته')) {
      return numberVal * 7;
    }
    if (normalizedText.includes('ماه')) {
      return numberVal * 30;
    }
    if (normalizedText.includes('روز')) {
      return numberVal;
    }
    
    return numberVal; // If just a number
  };

  // --- Proformas CRUD & Stock Integration ---
  const syncProjectStatus = (projId: string, currentProformas: Proforma[], currentProjects: Project[]) => {
    if (!projId) return currentProjects;
    const projectProformas = currentProformas.filter(p => p.projectId === projId);
    if (projectProformas.length === 0) return currentProjects;

    // Find the latest proforma for this project (sorted by timestamp in id, latest first)
    const sortedProformas = [...projectProformas].sort((a, b) => {
      const getTs = (id: string) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getTs(b.id) - getTs(a.id);
    });

    const latestProforma = sortedProformas[0];

    let totalItems = 0;
    let wonItems = 0;
    let lostItems = 0;
    let pendingItems = 0;

    if (latestProforma && latestProforma.items) {
      latestProforma.items.forEach(item => {
        totalItems++;
        // If the item status is explicitly set, use it. Otherwise, infer from the latest proforma's overall status.
        const itemStatus = item.status || (latestProforma.status === 'تأیید شده (برنده)' ? 'برنده' : latestProforma.status === 'باخته' ? 'بازنده' : 'جاری');
        if (itemStatus === 'برنده') {
          wonItems++;
        } else if (itemStatus === 'بازنده') {
          lostItems++;
        } else {
          pendingItems++;
        }
      });
    }

    let newStatus: Project['status'] = 'ارائه پیش‌فاکتور';
    if (totalItems > 0) {
      if (wonItems === totalItems) {
        newStatus = 'برنده (موفق)';
      } else if (lostItems === totalItems) {
        newStatus = 'باخته';
      } else if (wonItems > 0) {
        newStatus = 'نیمه برنده';
      } else {
        newStatus = 'ارائه پیش‌فاکتور';
      }
    }

    return currentProjects.map(p => {
      if (p.id === projId) {
        const today = getTodayShamsi();
        const updatedProject = { ...p, status: newStatus };

        if (newStatus === 'برنده (موفق)' || newStatus === 'نیمه برنده') {
          const wasWonBefore = p.status === 'برنده (موفق)' || p.status === 'نیمه برنده';
          
          if (!updatedProject.winningDate) {
            updatedProject.winningDate = today;
          }
          if (!updatedProject.closingDate) {
            updatedProject.closingDate = today;
          }
          
          // Try to find a won proforma for this project to calculate expected delivery date
          const wonPf = projectProformas.find(pf => pf.status === 'تأیید شده (برنده)');
          if (wonPf && wonPf.deliveryDate) {
            // Only set/overwrite if not set before, or if it was empty, or if we are newly transitioning to won
            if (!updatedProject.agreedDeliveryDate || !wasWonBefore) {
              const offsetDays = parseDeliveryPeriodToDays(wonPf.deliveryDate);
              const isWorkingDays = wonPf.deliveryDate.includes('کاری') || wonPf.deliveryDate.includes('کار') || wonPf.deliveryDate.toLowerCase().includes('work');
              const targetDate = isWorkingDays
                ? addWorkingDaysToShamsi(updatedProject.winningDate || today, offsetDays)
                : addDaysToShamsi(updatedProject.winningDate || today, offsetDays);
              updatedProject.agreedDeliveryDate = targetDate;
            }
          } else {
            // Default fallback if no won proforma with deliveryDate
            if (!updatedProject.agreedDeliveryDate) {
              updatedProject.agreedDeliveryDate = today;
            }
          }
        } else if (newStatus === 'باخته') {
          if (!updatedProject.closingDate) {
            updatedProject.closingDate = today;
          }
        }
        return updatedProject;
      }
      return p;
    });
  };

  const autoLogFactActivity = (
    projectId: string | undefined,
    categoryName: 'پیش‌فاکتور' | 'سفارش خرید',
    text: string
  ) => {
    if (!projectId) return;

    setProjectCategoryGroups(prevGroups => {
      const existingGroup = prevGroups.find(g => g.projectId === projectId && g.categoryName === categoryName);

      const newActivity: ProjectActivity = {
        id: `act-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text,
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        attachment: null,
        referral: null
      };

      let updatedGroups;
      if (existingGroup) {
        updatedGroups = prevGroups.map(g => {
          if (g.id === existingGroup.id) {
            return {
              ...g,
              activities: [...(g.activities || []), newActivity]
            };
          }
          return g;
        });
      } else {
        const newGroup: ProjectCategoryGroup = {
          id: `cg-fact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          projectId,
          categoryId: `cat-fact-${categoryName === 'پیش‌فاکتور' ? 'pf' : 'po'}`,
          categoryName,
          status: 'جاری',
          startDate: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          endDate: null,
          activities: [newActivity]
        };
        updatedGroups = [newGroup, ...prevGroups];
      }

      try {
        localStorage.setItem('erp_project_category_groups', JSON.stringify(updatedGroups));
      } catch (e) {
        console.error("Error saving updated category groups", e);
      }
      return updatedGroups;
    });
  };

  const addProforma = (proforma: Omit<Proforma, 'id' | 'proformaNumber'>) => {
    const seqNum = proformas.length + 1;
    const projectCode = proforma.projectId 
      ? (projects.find(p => p.id === proforma.projectId)?.code || 'ATA')
      : 'ATA';
    
    const computedNumber = formatERPNumber(
      settings.documentFormats.proformaFormat || 'QT-{PROJECT}-{SEQ:2}',
      {
        seq: seqNum,
        projectCode,
        customerName: proforma.customerName
      }
    );
    
    const newProforma: Proforma = {
      ...proforma,
      id: `pf-${Date.now()}`,
      proformaNumber: computedNumber,
      creatorId: currentUser?.id
    };

    const updated = [newProforma, ...proformas];
    saveToStorage('erp_proformas', updated, setProformas);

    if (newProforma.projectId) {
      const syncedProjects = syncProjectStatus(newProforma.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      const statusLabel = newProforma.status;
      autoLogFactActivity(
        newProforma.projectId,
        'پیش‌فاکتور',
        `پیش‌فاکتور شماره ${newProforma.proformaNumber} به مبلغ کل ${newProforma.totalAmount.toLocaleString('fa-IR')} ریال در وضعیت «${statusLabel}» توسط محمد توکل مقدم ایجاد شد.`
      );
    }

    // If instantly created as "won", reduce inventory stock
    if (newProforma.status === 'تأیید شده (برنده)') {
      newProforma.items.forEach(item => {
        adjustProductStock(item.productId, -item.quantity);
      });
    }

    return newProforma;
  };

  const updateProformaStatus = (id: string, newStatus: Proforma['status'], lossReason?: string) => {
    const oldProforma = proformas.find(p => p.id === id);
    if (!oldProforma) return;

    const isNowWon = newStatus === 'تأیید شده (برنده)' && oldProforma.status !== 'تأیید شده (برنده)';
    const wasWonButNowCancelled = oldProforma.status === 'تأیید شده (برنده)' && newStatus !== 'تأیید شده (برنده)';

    const updated = proformas.map(p => {
      if (p.id === id) {
        // Also if we mark the entire proforma as won, let's mark all its items as 'برنده'.
        // If we mark the entire proforma as lost, let's mark all its items as 'بازنده'.
        const updatedItems = p.items.map(item => ({
          ...item,
          status: newStatus === 'تأیید شده (برنده)' ? ('برنده' as const) : newStatus === 'باخته' ? ('بازنده' as const) : item.status,
          lossReason: newStatus === 'باخته' ? (lossReason || item.lossReason) : item.lossReason
        }));
        return { ...p, status: newStatus, lossReason, items: updatedItems };
      }
      return p;
    });

    saveToStorage('erp_proformas', updated, setProformas);

    if (oldProforma.projectId) {
      const syncedProjects = syncProjectStatus(oldProforma.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      autoLogFactActivity(
        oldProforma.projectId,
        'پیش‌فاکتور',
        `وضعیت پیش‌فاکتور شماره ${oldProforma.proformaNumber} به «${newStatus}» تغییر یافت.`
      );
    }

    // Inventory Adjustment Trigger
    if (isNowWon) {
      // Subtract from inventory
      oldProforma.items.forEach(item => {
        adjustProductStock(item.productId, -item.quantity);
      });
    } else if (wasWonButNowCancelled) {
      // Revert stock (add back)
      oldProforma.items.forEach(item => {
        adjustProductStock(item.productId, item.quantity);
      });
    }
  };

  const updateProforma = (updatedPf: Proforma) => {
    const oldPf = proformas.find(p => p.id === updatedPf.id);
    if (!oldPf) return;

    const updated = proformas.map(p => p.id === updatedPf.id ? updatedPf : p);
    saveToStorage('erp_proformas', updated, setProformas);

    if (updatedPf.projectId) {
      const syncedProjects = syncProjectStatus(updatedPf.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      const statusChanged = oldPf.status !== updatedPf.status;
      const logText = statusChanged
        ? `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش شد و وضعیت آن به «${updatedPf.status}» تغییر یافت.`
        : `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      
      autoLogFactActivity(updatedPf.projectId, 'پیش‌فاکتور', logText);
    }

    // If won state changed
    const wasWon = oldPf.status === 'تأیید شده (برنده)';
    const isWon = updatedPf.status === 'تأیید شده (برنده)';

    if (!wasWon && isWon) {
      // Deduct new items
      updatedPf.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
    } else if (wasWon && !isWon) {
      // Revert old items
      oldPf.items.forEach(item => adjustProductStock(item.productId, item.quantity));
    } else if (wasWon && isWon) {
      // Recalculate difference
      // Return old items first
      oldPf.items.forEach(item => adjustProductStock(item.productId, item.quantity));
      // Deduct new items
      updatedPf.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
    }
  };

  const deleteProforma = (id: string) => {
    const pf = proformas.find(p => p.id === id);
    if (pf && pf.status === 'تأیید شده (برنده)') {
      // Revert inventory before deleting
      pf.items.forEach(item => adjustProductStock(item.productId, item.quantity));
    }
    const updated = proformas.filter(p => p.id !== id);
    saveToStorage('erp_proformas', updated, setProformas);

    if (pf && pf.projectId) {
      const syncedProjects = syncProjectStatus(pf.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      autoLogFactActivity(
        pf.projectId,
        'پیش‌فاکتور',
        `پیش‌فاکتور شماره ${pf.proformaNumber} از سیستم حذف شد.`
      );
    }
  };

  const batchUpdateProjectProformasStatus = (projectId: string, newStatus: Proforma['status'], batchLossReason?: string) => {
    // Find all proformas of this project
    const updated = proformas.map(p => {
      if (p.projectId === projectId) {
        const updatedItems = p.items.map(item => ({
          ...item,
          status: newStatus === 'تأیید شده (برنده)' ? ('برنده' as const) : newStatus === 'باخته' ? ('بازنده' as const) : item.status,
          lossReason: newStatus === 'باخته' ? (batchLossReason || item.lossReason) : undefined
        }));
        return {
          ...p,
          status: newStatus,
          lossReason: newStatus === 'باخته' ? batchLossReason : undefined,
          items: updatedItems
        };
      }
      return p;
    });

    saveToStorage('erp_proformas', updated, setProformas);

    // Sync project status
    const syncedProjects = syncProjectStatus(projectId, updated, projects);
    saveToStorage('erp_projects', syncedProjects, setProjects);

    autoLogFactActivity(
      projectId,
      'پیش‌فاکتور',
      `تغییر وضعیت گروهی تمام پیش‌فاکتورهای پروژه به «${newStatus}» انجام شد.`
    );

    // Adjust stock
    proformas.forEach(oldPf => {
      if (oldPf.projectId === projectId) {
        const wasWon = oldPf.status === 'تأیید شده (برنده)';
        const isWon = newStatus === 'تأیید شده (برنده)';
        if (!wasWon && isWon) {
          oldPf.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
        } else if (wasWon && !isWon) {
          oldPf.items.forEach(item => adjustProductStock(item.productId, item.quantity));
        }
      }
    });
  };

  // --- Purchase Orders CRUD & Stock Integration ---
  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) => {
    const projectCode = po.projectId 
      ? (projects.find(p => p.id === po.projectId)?.code || 'ATA')
      : 'GEN';
    const seqNum = purchaseOrders.length + 1;
    const computedNumber = formatERPNumber(
      settings.documentFormats.poFormat || 'PO-{PROJECT}-{SEQ:3}',
      {
        seq: seqNum,
        projectCode,
        supplierName: po.supplierName
      }
    );
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber: computedNumber,
      createdAt: getTodayShamsi()
    };

    const updated = [newPO, ...purchaseOrders];
    saveToStorage('erp_purchase_orders', updated, setPurchaseOrders);

    if (newPO.projectId) {
      autoLogFactActivity(
        newPO.projectId,
        'سفارش خرید',
        `سفارش خرید شماره ${newPO.poNumber} با وضعیت «${newPO.status}» به تامین‌کننده توسط محمد توکل مقدم ثبت شد.`
      );
    }

    // If instantly created as "delivered", add to stock
    if (newPO.status === 'تحویل شده (رسید انبار)') {
      newPO.items.forEach(item => {
        adjustProductStock(item.productId, item.quantity);
      });
    }

    return newPO;
  };

  const updatePurchaseOrderStatus = (id: string, newStatus: PurchaseOrder['status']) => {
    const oldPO = purchaseOrders.find(po => po.id === id);
    if (!oldPO) return;

    const isNowDelivered = newStatus === 'تحویل شده (رسید انبار)' && oldPO.status !== 'تحویل شده (رسید انبار)';
    const wasDeliveredButReverted = oldPO.status === 'تحویل شده (رسید انبار)' && newStatus !== 'تحویل شده (رسید انبار)';

    const updated = purchaseOrders.map(po => {
      if (po.id === id) {
        return { ...po, status: newStatus };
      }
      return po;
    });

    saveToStorage('erp_purchase_orders', updated, setPurchaseOrders);

    if (oldPO.projectId) {
      autoLogFactActivity(
        oldPO.projectId,
        'سفارش خرید',
        `سفارش خرید شماره ${oldPO.poNumber} به وضعیت «${newStatus}» تغییر داده شد.`
      );
    }

    // Inventory Adjustment Trigger
    if (isNowDelivered) {
      // Add items to stock
      oldPO.items.forEach(item => {
        adjustProductStock(item.productId, item.quantity);
      });
    } else if (wasDeliveredButReverted) {
      // Deduct items from stock (revert)
      oldPO.items.forEach(item => {
        adjustProductStock(item.productId, -item.quantity);
      });
    }
  };

  const updatePurchaseOrder = (updatedPO: PurchaseOrder) => {
    const oldPO = purchaseOrders.find(po => po.id === updatedPO.id);
    if (!oldPO) return;

    const updated = purchaseOrders.map(po => po.id === updatedPO.id ? updatedPO : po);
    saveToStorage('erp_purchase_orders', updated, setPurchaseOrders);

    if (updatedPO.projectId) {
      const statusChanged = oldPO.status !== updatedPO.status;
      const logText = statusChanged
        ? `سفارش خرید شماره ${updatedPO.poNumber} ویرایش شد و وضعیت آن به «${updatedPO.status}» تغییر داده شد.`
        : `سفارش خرید شماره ${updatedPO.poNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      autoLogFactActivity(updatedPO.projectId, 'سفارش خرید', logText);
    }

    // Handle delivered state stock updates
    const wasDelivered = oldPO.status === 'تحویل شده (رسید انبار)';
    const isDelivered = updatedPO.status === 'تحویل شده (رسید انبار)';

    if (!wasDelivered && isDelivered) {
      // Add new items
      updatedPO.items.forEach(item => adjustProductStock(item.productId, item.quantity));
    } else if (wasDelivered && !isDelivered) {
      // Deduct old items
      oldPO.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
    } else if (wasDelivered && isDelivered) {
      // Recalculate difference: subtract old first, then add new
      oldPO.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
      updatedPO.items.forEach(item => adjustProductStock(item.productId, item.quantity));
    }
  };

  const deletePurchaseOrder = (id: string) => {
    const po = purchaseOrders.find(po => po.id === id);
    if (po && po.status === 'تحویل شده (رسید انبار)') {
      // Revert inventory addition
      po.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
    }
    const updated = purchaseOrders.filter(po => po.id !== id);
    saveToStorage('erp_purchase_orders', updated, setPurchaseOrders);

    if (po && po.projectId) {
      autoLogFactActivity(
        po.projectId,
        'سفارش خرید',
        `سفارش خرید شماره ${po.poNumber} از سیستم حذف شد.`
      );
    }
  };

  // --- Transactions CRUD (Finances) ---
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tr-${Date.now()}`
    };
    const updated = [newTransaction, ...transactions];
    saveToStorage('erp_transactions', updated, setTransactions);
    return newTransaction;
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    saveToStorage('erp_transactions', updated, setTransactions);
  };

  // --- Tasks CRUD ---
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    const updated = [newTask, ...tasks];
    saveToStorage('erp_tasks', updated, setTasks);
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveToStorage('erp_tasks', updated, setTasks);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveToStorage('erp_tasks', updated, setTasks);
  };

  // --- Settings Customizer ---
  const updateSettings = (newSettings: ERPSettings) => {
    saveToStorage('erp_settings', newSettings, setSettings);
  };

  return {
    isInitialized,
    customers,
    products,
    suppliers,
    exchangeRates,
    projects,
    proformas,
    purchaseOrders,
    transactions,
    tasks,
    settings,
    userRole,
    changeRole,
    
    // Actions
    addCustomer,
    updateCustomer,
    deleteCustomer,
    batchUpdateCustomers,
    
    addProduct,
    updateProduct,
    deleteProduct,
    adjustProductStock,
    
    addSupplier,
    updateSupplier,
    deleteSupplier,
    
    updateExchangeRate,
    fetchRatesFromAPI,
    
    addProject,
    updateProject,
    deleteProject,
    
    addProforma,
    updateProforma,
    updateProformaStatus,
    deleteProforma,
    batchUpdateProjectProformasStatus,
    
    addPurchaseOrder,
    updatePurchaseOrder,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
    
    addTransaction,
    deleteTransaction,
    
    addTask,
    updateTask,
    deleteTask,
    
    // --- Project Activities (Category Groups) CRUD ---
    addProjectCategoryGroup: (projectId: string, categoryId: string, categoryName: string) => {
      let isDuplicate = false;
      setProjectCategoryGroups(prev => {
        isDuplicate = prev.some(g => g.projectId === projectId && g.categoryId === categoryId);
        return prev;
      });

      if (isDuplicate) {
        return { success: false, error: 'این دسته‌بندی قبلاً در این پروژه فعال شده است.' };
      }

      const newGroup: ProjectCategoryGroup = {
        id: `cg-${Date.now()}`,
        projectId,
        categoryId,
        categoryName,
        status: 'جاری',
        startDate: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        endDate: null,
        activities: []
      };

      setProjectCategoryGroups(prev => {
        const updated = [newGroup, ...prev];
        try {
          localStorage.setItem('erp_project_category_groups', JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save erp_project_category_groups to localStorage:", error);
        }
        return updated;
      });

      return { success: true, group: newGroup };
    },

    addProjectActivity: (
      projectId: string,
      categoryGroupId: string,
      text: string,
      attachment: { name: string; size: string; content?: string } | null,
      referral: { assignedTo: string; actionRequired: string; assignedBy: string } | null
    ) => {
      const newReferral: ProjectReferral | null = referral ? {
        id: `ref-${Date.now()}`,
        assignedTo: referral.assignedTo,
        actionRequired: referral.actionRequired,
        assignedBy: referral.assignedBy || 'محمد توکل مقدم',
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        status: 'در انتظار اقدام',
        response: null
      } : null;

      const newActivity: ProjectActivity = {
        id: `act-item-${Date.now()}`,
        text,
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        attachment,
        referral: newReferral
      };

      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            return {
              ...g,
              activities: [...(g.activities || []), newActivity]
            };
          }
          return g;
        });
        try {
          localStorage.setItem('erp_project_category_groups', JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save erp_project_category_groups to localStorage:", error);
          alert(
            'خطا در ذخیره‌سازی محلی فعالیت!\n\n' +
            'احتمالاً حجم فایل پیوست بیش از ظرفیت مرورگر است.\n' +
            'لطفاً از فایل کوچک‌تری استفاده کنید.'
          );
        }
        return updated;
      });

      return newActivity;
    },

    completeProjectCategoryGroup: (categoryGroupId: string) => {
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            return {
              ...g,
              status: 'اتمام کار' as const,
              endDate: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
            };
          }
          return g;
        });
        try {
          localStorage.setItem('erp_project_category_groups', JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save erp_project_category_groups to localStorage:", error);
        }
        return updated;
      });
    },

    resumeProjectCategoryGroup: (categoryGroupId: string) => {
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            return {
              ...g,
              status: 'جاری' as const,
              endDate: null
            };
          }
          return g;
        });
        try {
          localStorage.setItem('erp_project_category_groups', JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save erp_project_category_groups to localStorage:", error);
        }
        return updated;
      });
    },

    respondToReferral: (categoryGroupId: string, activityId: string, responseText: string, responderName: string, attachment?: { name: string; size: string; content?: string } | null) => {
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            return {
              ...g,
              activities: (g.activities || []).map(a => {
                if (a.id === activityId && a.referral) {
                  return {
                    ...a,
                    referral: {
                       ...a.referral,
                       status: 'انجام شده' as const,
                       response: {
                         text: responseText,
                         responder: responderName,
                         createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                         attachment: attachment || null
                       }
                    }
                  };
                }
                return a;
              })
            };
          }
          return g;
        });
        try {
          localStorage.setItem('erp_project_category_groups', JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save erp_project_category_groups to localStorage:", error);
          alert(
            'خطا در ذخیره‌سازی محلی اقدام!\n\n' +
            'احتمالاً حجم فایل پیوست بیش از ظرفیت مرورگر است.\n' +
            'لطفاً از فایل کوچک‌تری استفاده کنید.'
          );
        }
        return updated;
      });
    },

    users,
    currentUser,
    addUser: (user: Omit<User, 'id'>) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`
      };
      const updated = [...users, newUser];
      saveToStorage('erp_users', updated, setUsers);
      return newUser;
    },
    updateUser: (updatedUser: User) => {
      const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      saveToStorage('erp_users', updated, setUsers);
      if (currentUser && currentUser.id === updatedUser.id) {
        saveToStorage('erp_current_user', updatedUser, setCurrentUser);
        setUserRole(updatedUser.role);
        localStorage.setItem('erp_simulated_role', updatedUser.role);
      }
    },
    deleteUser: (id: string) => {
      const updated = users.filter(u => u.id !== id);
      saveToStorage('erp_users', updated, setUsers);
    },
    login: (username: string, password?: string): boolean => {
      const lowerUsername = username.toLowerCase();
      const foundUser = users.find(u => u.username.toLowerCase() === lowerUsername);
      if (foundUser) {
        if (foundUser.password === password) {
          saveToStorage('erp_current_user', foundUser, setCurrentUser);
          setUserRole(foundUser.role);
          localStorage.setItem('erp_simulated_role', foundUser.role);
          return true;
        }
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem('erp_current_user');
      setCurrentUser(null);
    },
    
    projectCategoryGroups,
    
    updateSettings
  };
}
