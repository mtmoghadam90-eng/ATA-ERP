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
  ModuleNotification,
  InventoryTransaction,
  ExchangeRate, 
  ERPSettings,
  ProjectCategoryGroup,
  ProjectActivity,
  ProjectReferral,
  ProjectReferralResponse,
  User,
  SupplierInquiry,
  InquiryStep,
  PackingItem,
  DeliveryChecklistItem,
  PackagingDelivery,
  AfterSalesService,
  AuditLog,
  WorkflowRule
} from './types';
import { compressLZW, decompressLZW } from './utils/compress';

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


export const getProformaOutcomeStatus = (pf: Proforma): 'پیش‌نویس' | 'ارسال شده' | 'تأیید شده (برنده)' | 'لغو شده' | 'باخته' | 'نیمه برنده' | 'جاری' => {
  if (pf.isCancelled || pf.status === 'لغو شده') return 'لغو شده';
  
  const items = pf.items || [];
  if (items.length === 0) {
    if (pf.status === 'تأیید شده (برنده)' || pf.status === 'باخته' || pf.status === 'نیمه برنده') {
      return pf.status;
    }
    return pf.status === 'پیش‌نویس' ? 'پیش‌نویس' : 'جاری';
  }

  const wonCount = items.filter(i => i.status === 'برنده').length;
  const lostCount = items.filter(i => i.status === 'بازنده').length;

  if (wonCount === items.length) return 'تأیید شده (برنده)';
  if (lostCount === items.length) return 'باخته';
  if (wonCount > 0) return 'نیمه برنده';
  
  if (pf.status === 'تأیید شده (برنده)' || pf.status === 'باخته' || pf.status === 'نیمه برنده') {
    return pf.status;
  }

  if (pf.status === 'پیش‌نویس') return 'پیش‌نویس';
  return 'جاری';
};

export const getWonItemsOfProforma = (pf: Proforma) => {
  const outcome = getProformaOutcomeStatus(pf);
  if (outcome !== 'تأیید شده (برنده)' && outcome !== 'نیمه برنده') return [];
  let wonItems = [];
  const hasExplicitWon = pf.items?.some(item => item.status === 'برنده');
  if (hasExplicitWon) {
    wonItems = pf.items.filter(item => item.status === 'برنده');
  } else {
    wonItems = pf.items?.filter(item => item.status !== 'بازنده') || [];
  }
  return wonItems.filter(item => item.supplyMethod !== 'ORDER');
};



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
      tasks: true,
      referrals: true,
      settings: true,
      users: true,
      supplierInquiries: true,
      packagingDelivery: true
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
      tasks: true,
      referrals: true,
      settings: false,
      users: false,
      supplierInquiries: true,
      packagingDelivery: true
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
      tasks: true,
      referrals: true,
      settings: false,
      users: false,
      supplierInquiries: true,
      packagingDelivery: true
    }
  }
];

export interface CompletionPrompt { projectId: string; categoryName: string; message: string; }


const saveToServer = (key: string, data: any) => {
  fetch(`/api/data/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(err => console.error(`Error saving to server for key: ${key}`, err));
};

export function useERPStore() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [supplierInquiries, setSupplierInquiries] = useState<SupplierInquiry[]>([]);
  const [packagingDeliveries, setPackagingDeliveries] = useState<PackagingDelivery[]>([]);
  const [afterSalesServices, setAfterSalesServices] = useState<AfterSalesService[]>([]);
  const [moduleNotifications, setModuleNotifications] = useState<ModuleNotification[]>([]);
  const [projectCategoryGroups, setProjectCategoryGroups] = useState<ProjectCategoryGroup[]>([]);
  const [readItems, setReadItems] = useState<string[]>([]);
  const [settings, setSettings] = useState<ERPSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Function to log actions with LZW compressed state changes
  const logAction = (
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
    module: string,
    entityId: string,
    description: string,
    before?: any,
    after?: any
  ) => {
    const nowJalali = getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const beforeState = before ? compressLZW(JSON.stringify(before)) : undefined;
    const afterState = after ? compressLZW(JSON.stringify(after)) : undefined;

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: nowJalali,
      userId: currentUser?.id || 'system',
      userFullName: currentUser?.fullName || 'کاربر سیستم',
      action,
      module,
      entityId,
      description,
      beforeState,
      afterState
    };

    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      const truncated = updated.slice(0, 1000);
      saveToServer('erp_audit_logs', truncated);
      return truncated;
    });
  };


  const [completionPrompt, setCompletionPrompt] = useState<{projectId: string, categoryName: string, message: string} | null>(null);

  const completeCategoryGroup = (projectId: string, categoryName: string) => {
    const normalize = (str: string) => str.replace(/[\s‌]/g, '').trim();
    setProjectCategoryGroups(prevGroups => {
      const updatedGroups = prevGroups.map(g => {
        if (g.projectId === projectId && normalize(g.categoryName) === normalize(categoryName)) {
          return {
            ...g,
            status: 'اتمام کار',
            endDate: getTodayShamsi()
          };
        }
        return g;
      });
      saveToServer('erp_project_category_groups', updatedGroups);
      return updatedGroups;
    });
  };


  useEffect(() => {
    if (currentUser) {
      try {
        const storedReadNotifs = localStorage.getItem(`read_notifications_${currentUser.id}`);
        if (storedReadNotifs) {
          setReadItems(JSON.parse(storedReadNotifs));
        } else {
          setReadItems([]);
        }
      } catch (e) {
        console.error("Failed to parse read notifications from localStorage", e);
        setReadItems([]);
      }
    } else {
      setReadItems([]);
    }
  }, [currentUser]);
  
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

    // Initialize store from server
  useEffect(() => {
    async function loadData() {
      try {
        const fetchKey = async (key: string, setter: Function, fallback: any) => {
          try {
            const res = await fetch(`/api/data/${key}`);
            if (res.ok) {
              const data = await res.json();
              if (data !== null) {
                setter(data);
              } else {
                setter(fallback);
              }
            } else {
              setter(fallback);
            }
          } catch (e) {
            console.error(`Failed to fetch ${key}:`, e);
            setter(fallback);
          }
        };

        await Promise.all([
          fetchKey('erp_customers', setCustomers, []),
          fetchKey('erp_products', setProducts, []),
          fetchKey('erp_suppliers', setSuppliers, []),
          fetchKey('erp_exchange_rates', setExchangeRates, []),
          fetchKey('erp_projects', setProjects, []),
          fetchKey('erp_proformas', setProformas, []),
          fetchKey('erp_purchase_orders', setPurchaseOrders, []),
          fetchKey('erp_transactions', setTransactions, []),
          fetchKey('erp_inventory_transactions', setInventoryTransactions, []),
          fetchKey('erp_tasks', setTasks, []),
          fetchKey('erp_settings', setSettings, DEFAULT_SETTINGS),
          fetchKey('erp_project_category_groups', setProjectCategoryGroups, []),
          fetchKey('erp_supplier_inquiries', setSupplierInquiries, []),
          fetchKey('erp_packaging_deliveries', setPackagingDeliveries, []),
          fetchKey('erp_after_sales_services', setAfterSalesServices, []),
          fetchKey('erp_users', setUsers, []),
          fetchKey('erp_audit_logs', setAuditLogs, []),
        ]);

        const storedCurrentUser = localStorage.getItem('erp_current_user');
        if (storedCurrentUser) {
          try {
            const u = JSON.parse(storedCurrentUser);
            setCurrentUser(u);
            if (u && u.role) {
              setUserRole(u.role);
            }
          } catch(e) {}
        }
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to load initial data", err);
        setIsInitialized(true);
      }
    }
    loadData();
  }, []);

  const fetchRatesFromAPI = async (silent = false) => {
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
          saveToServer('erp_exchange_rates', updated);
          return updated;
        });
        console.log('Exchange rates updated from tgju.com successfully!');
        
        if (data.hasErrors || (data.failedCurrencies && data.failedCurrencies.length > 0)) {
           if (silent && (currentUser?.role === 'admin' || currentUser?.isSystemAdmin)) {
             alert('در بروزرسانی خودکار نرخ برخی ارزها خطایی رخ داد. لطفا بررسی کنید یا مقادیر را دستی ثبت کنید.');
           }
           return false; // Return false if there were some errors so manual click shows failure alert
        }
        
        return true;
      }
    } catch (err) {
      console.warn('Failed to auto-fetch exchange rates from tgju:', err);
      if (silent && (currentUser?.role === 'admin' || currentUser?.isSystemAdmin)) {
          alert('خطا در ارتباط با سرور برای بروزرسانی نرخ ارز. لطفا قیمت را دستی ثبت کنید.');
      }
    }
    return false;
  };

  // Auto-fetch exchange rates on startup once initialized from tgju.com API, and daily at 14:00
  useEffect(() => {
    if (isInitialized) {
      fetchRatesFromAPI(true);
      
      const interval = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 14 && now.getMinutes() === 0) {
          fetchRatesFromAPI(true);
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  // Save changes helper
  const saveToStorage = (key: string, data: any, stateSetter: Function) => {
    try {
      stateSetter(data);
      if (key === 'erp_current_user') {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        saveToServer(key, data);
      }
    } catch (error) {
      console.error(`Error saving storage for key: ${key}`, error);
    }
  };

  // --- Customers CRUD ---
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newId = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newCustomer: Customer = {
      ...customer,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => {
      let updated = prev.map(c => {
        if (newCustomer.linkedCustomerIds?.includes(c.id)) {
          const currentLinks = c.linkedCustomerIds || [];
          if (!currentLinks.includes(newId)) {
            return {
              ...c,
              linkedCustomerIds: [...currentLinks, newId]
            };
          }
        }
        return c;
      });
      updated = [newCustomer, ...updated];
      saveToServer('erp_customers', updated);
      logAction('CREATE', 'مشتریان', newCustomer.id, `ایجاد مشتری جدید: ${newCustomer.companyName || `${newCustomer.firstName || ''} ${newCustomer.lastName || ''}`.trim()}`, undefined, newCustomer);
      return updated;
    });
    return newCustomer;
  };

  const updateCustomer = (updatedCust: Customer) => {
    setCustomers(prev => {
      const before = prev.find(c => c.id === updatedCust.id);
      const updated = prev.map(c => c.id === updatedCust.id ? updatedCust : c);
      saveToServer('erp_customers', updated);
      logAction('UPDATE', 'مشتریان', updatedCust.id, `ویرایش اطلاعات مشتری: ${updatedCust.companyName || `${updatedCust.firstName || ''} ${updatedCust.lastName || ''}`.trim()}`, before, updatedCust);
      return updated;
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => {
      const before = prev.find(c => c.id === id);
      const updated = prev.filter(c => c.id !== id);
      saveToServer('erp_customers', updated);
      if (before) {
        logAction('DELETE', 'مشتریان', id, `حذف مشتری: ${before.companyName || `${before.firstName || ''} ${before.lastName || ''}`.trim()}`, before, undefined);
      }
      return updated;
    });
  };


  const batchUpdateCustomers = (updatedList: Customer[]) => {
    saveToStorage('erp_customers', updatedList, setCustomers);
  };

  // --- Products & Stock CRUD ---
  const addProduct = (product: Omit<Product, 'id' | 'stockLevel'> & { stockLevel?: number, transactionDate?: string }) => {
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
    logAction('CREATE', 'کالاها', newProduct.id, `ایجاد کالای جدید: ${newProduct.name} (کد: ${newProduct.code})`, undefined, newProduct);
    return newProduct;
  };

  const updateProduct = (updatedProd: Product) => {
    const before = products.find(p => p.id === updatedProd.id);
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    saveToStorage('erp_products', updated, setProducts);
    logAction('UPDATE', 'کالاها', updatedProd.id, `ویرایش اطلاعات کالا: ${updatedProd.name} (کد: ${updatedProd.code})`, before, updatedProd);
  };

  const deleteProduct = (id: string) => {
    const before = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    saveToStorage('erp_products', updated, setProducts);
    if (before) {
      logAction('DELETE', 'کالاها', id, `حذف کالا: ${before.name} (کد: ${before.code})`, before, undefined);
    }
  };

  const batchImportProducts = (
    items: Array<{
      code?: string;
      name?: string;
      category?: string;
      supplyType?: 'INVENTORY' | 'ORDER';
      notes?: string;
      size?: string;
      measurementRange?: string;
      brand?: string;
      amt?: number;
      type?: string;
      dateVal?: string;
    }>
  ) => {
    let createCount = 0;
    let successCount = 0;
    const newTransactions: InventoryTransaction[] = [];
    const nowStr = new Date().toISOString();

    setProducts(prevProducts => {
      let currentProducts = [...prevProducts];

      items.forEach((item, index) => {
        const code = (item.code || "").trim();
        let amt = Number(item.amt);
        const type = item.type;
        const notes = item.notes || "ویرایش گروهی";
        const dateVal = item.dateVal;
        
        const name = item.name ? String(item.name).trim() : "";
        const category = item.category ? String(item.category).trim() : "";
        const supplyType = item.supplyType || 'INVENTORY';
        const size = item.size || "";
        const mRange = item.measurementRange || "";
        const brand = item.brand ? String(item.brand).trim() : "";

        // Case 1: Code is empty but name and category are provided -> Create new product
        if (!code && name && category) {
          const seqNum = currentProducts.length + 1;
          const finalCode = formatERPNumber(
            settings.documentFormats.productFormat || 'EQ-{RAND:5}',
            {
              seq: seqNum,
              category: category
            }
          );
          const initialStock = supplyType === 'INVENTORY' && !isNaN(amt) && amt > 0 ? amt : 0;
          const newProduct: Product = {
            id: `prod-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
            code: finalCode,
            name: name,
            displayName: name,
            category: category,
            supplyType: supplyType,
            description: notes,
            size: size,
            measurementRange: mRange,
            images: [],
            brand: brand,
            modelNumber: "N/A",
            unit: "عدد",
            basePriceRIYAL: 0,
            minStockLevel: 0,
            stockLevel: initialStock,
            customValues: {}
          };
          currentProducts = [newProduct, ...currentProducts];
          createCount++;

          if (initialStock > 0) {
            newTransactions.push({
              id: `inv-tr-${Date.now()}-${index}-init`,
              productId: newProduct.id,
              date: dateVal || nowStr,
              type: 'IN',
              quantity: initialStock,
              referenceType: 'MANUAL',
              notes: 'موجودی اولیه (واردات گروهی)'
            });
          }

          logAction('CREATE', 'کالاها', newProduct.id, `ایجاد کالای جدید (واردات گروهی): ${newProduct.name} (کد: ${newProduct.code})`, undefined, newProduct);
        } else if (code) {
          // Case 2: Code is provided
          const prodIndex = currentProducts.findIndex(p => p.code === code);
          if (prodIndex !== -1) {
            // Product exists -> Adjust stock
            const product = currentProducts[prodIndex];
            if (product.supplyType !== 'ORDER' && !isNaN(amt) && amt > 0) {
              let adjustedAmt = amt;
              if (type === 'OUT' || type === 'out') {
                if ((product.stockLevel || 0) < amt) {
                  return; // Skip if insufficient stock
                }
                adjustedAmt = -amt;
              }
              
              const beforeStock = product.stockLevel || 0;
              const afterStock = Math.max(0, beforeStock + adjustedAmt);
              
              currentProducts[prodIndex] = {
                ...product,
                stockLevel: afterStock
              };

              newTransactions.push({
                id: `inv-tr-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
                productId: product.id,
                date: dateVal || nowStr,
                type: adjustedAmt > 0 ? 'IN' : 'OUT',
                quantity: amt,
                referenceType: 'MANUAL',
                notes
              });

              successCount++;
              logAction('UPDATE', 'کالاها', product.id, `تعدیل موجودی کالا (واردات گروهی): ${product.name} (کد: ${product.code}) از ${beforeStock} به ${afterStock}`, product, currentProducts[prodIndex]);
            }
          } else if (name && category) {
            // Product does not exist -> Create new product with given code
            const initialStock = supplyType === 'INVENTORY' && !isNaN(amt) && amt > 0 ? amt : 0;
            const newProduct: Product = {
              id: `prod-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
              code: code,
              name: name,
              displayName: name,
              category: category,
              supplyType: supplyType,
              description: notes,
              size: size,
              measurementRange: mRange,
              images: [],
              brand: brand,
              modelNumber: "N/A",
              unit: "عدد",
              basePriceRIYAL: 0,
              minStockLevel: 0,
              stockLevel: initialStock,
              customValues: {}
            };
            currentProducts = [newProduct, ...currentProducts];
            createCount++;

            if (initialStock > 0) {
              newTransactions.push({
                id: `inv-tr-${Date.now()}-${index}-init`,
                productId: newProduct.id,
                date: dateVal || nowStr,
                type: 'IN',
                quantity: initialStock,
                referenceType: 'MANUAL',
                notes: 'موجودی اولیه (واردات گروهی)'
              });
            }

            logAction('CREATE', 'کالاها', newProduct.id, `ایجاد کالای جدید (واردات گروهی): ${newProduct.name} (کد: ${newProduct.code})`, undefined, newProduct);
          }
        }
      });

      saveToServer('erp_products', currentProducts);
      return currentProducts;
    });

    if (newTransactions.length > 0) {
      setInventoryTransactions(prev => {
        const updatedTr = [...newTransactions, ...prev];
        saveToServer('erp_inventory_transactions', updatedTr);
        return updatedTr;
      });
    }

    return { successCount, createCount };
  };

  const adjustProductStock = (id: string, amount: number, referenceId?: string, referenceType?: InventoryTransaction['referenceType'], notes?: string, transactionDate?: string) => {
    const before = products.find(p => p.id === id);
    if (!before) return;
    
    // Add transaction record
    if (amount !== 0) {
      const transaction: InventoryTransaction = {
        id: `inv-tr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: id,
        date: transactionDate || new Date().toISOString(),
        type: amount > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(amount),
        referenceId,
        referenceType,
        notes
      };
      setInventoryTransactions(prev => {
        const updatedTr = [transaction, ...prev];
        saveToServer('erp_inventory_transactions', updatedTr);
        return updatedTr;
      });
    }

    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, stockLevel: Math.max(0, (p.stockLevel || 0) + amount) };
      }
      return p;
    });
    const after = updated.find(p => p.id === id);
    saveToStorage('erp_products', updated, setProducts);
    if (before && after) {
      logAction('UPDATE', 'کالاها', id, `تعدیل موجودی کالا: ${before.name} (کد: ${before.code}) از ${before.stockLevel} به ${after.stockLevel} (${amount > 0 ? '+' : ''}${amount})`, before, after);
    }
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
    logAction('CREATE', 'تامین‌کنندگان', newSupplier.id, `ثبت تامین‌کننده جدید: ${newSupplier.name}`, undefined, newSupplier);
    return newSupplier;
  };

  const updateSupplier = (updatedSupp: Supplier) => {
    const before = suppliers.find(s => s.id === updatedSupp.id);
    const updated = suppliers.map(s => s.id === updatedSupp.id ? updatedSupp : s);
    saveToStorage('erp_suppliers', updated, setSuppliers);
    logAction('UPDATE', 'تامین‌کنندگان', updatedSupp.id, `ویرایش اطلاعات تامین‌کننده: ${updatedSupp.name}`, before, updatedSupp);
  };

  const deleteSupplier = (id: string) => {
    const before = suppliers.find(s => s.id === id);
    const updated = suppliers.filter(s => s.id !== id);
    saveToStorage('erp_suppliers', updated, setSuppliers);
    if (before) {
      logAction('DELETE', 'تامین‌کنندگان', id, `حذف تامین‌کننده: ${before.name}`, before, undefined);
    }
  };

  // --- Exchange Rates ---
  const updateExchangeRate = (id: string, newRate: number) => {
    const before = exchangeRates.find(r => r.id === id);
    const updated = exchangeRates.map(r => r.id === id ? { ...r, rateToRIYAL: newRate, lastUpdated: new Date().toISOString() } : r);
    const after = updated.find(r => r.id === id);
    saveToStorage('erp_exchange_rates', updated, setExchangeRates);
    if (before && after) {
      logAction('UPDATE', 'ارزها', id, `به‌روزرسانی نرخ برابری ارز ${before.currency} به ریال از ${before.rateToRIYAL} به ${newRate}`, before, after);
    }
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

    notifyModuleResponsible('projects', 'ثبت پروژه جدید', `پروژه جدید ${newProject.name} (${newProject.code}) توسط ${currentUser?.fullName || 'کاربر سیستم'} ایجاد شد.`, newProject.id);
    logAction('CREATE', 'پروژه‌ها', newProject.id, `ثبت پروژه جدید: ${newProject.name} (کد: ${newProject.code})`, undefined, newProject);

    return newProject;
  };

  const updateProject = (updatedProj: Project) => {
    const oldProj = projects.find(p => p.id === updatedProj.id);
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    saveToStorage('erp_projects', updated, setProjects);
    
    if (oldProj && oldProj.status !== updatedProj.status) {
      notifyModuleResponsible('projects', 'تغییر وضعیت پروژه', `پروژه ${updatedProj.name} به وضعیت «${updatedProj.status}» تغییر یافت.`, updatedProj.id);
      runWorkflows('project_status_change', {
        projectId: updatedProj.id,
        projectName: updatedProj.name,
        oldStatus: oldProj.status,
        newStatus: updatedProj.status,
        salesExpert: updatedProj.salesExpert
      });
    } else {
      notifyModuleResponsible('projects', 'ویرایش اطلاعات پروژه', `پروژه ${updatedProj.name} بروزرسانی شد.`, updatedProj.id);
    }
    logAction('UPDATE', 'پروژه‌ها', updatedProj.id, `ویرایش اطلاعات پروژه: ${updatedProj.name} (کد: ${updatedProj.code})`, oldProj, updatedProj);
  };

  const deleteProject = (id: string) => {
    const before = projects.find(p => p.id === id);
    const updated = projects.filter(p => p.id !== id);
    saveToStorage('erp_projects', updated, setProjects);
    if (before) {
      logAction('DELETE', 'پروژه‌ها', id, `حذف پروژه: ${before.name} (کد: ${before.code})`, before, undefined);
    }
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
  const getWonItemsOfProforma = (pf: Proforma) => {
    const outcome = getProformaOutcomeStatus(pf);
    if (outcome !== 'تأیید شده (برنده)' && outcome !== 'نیمه برنده') return [];
    let wonItems = [];
    const hasExplicitWon = pf.items?.some(item => item.status === 'برنده');
    if (hasExplicitWon) {
      wonItems = pf.items.filter(item => item.status === 'برنده');
    } else {
      wonItems = pf.items?.filter(item => item.status !== 'بازنده') || [];
    }
    return wonItems.filter(item => item.supplyMethod !== 'ORDER');
  };

  const syncProjectStatus = (projId: string, currentProformas: Proforma[], currentProjects: Project[]) => {
    if (!projId) return currentProjects;
    const projectProformas = currentProformas.filter(p => p.projectId === projId);
    if (projectProformas.length === 0) return currentProjects;

    // Find a won/approved/partially won proforma first
    let targetProforma = projectProformas.find(pf => {
      const outcome = getProformaOutcomeStatus(pf);
      return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده';
    });

    // If no won proforma, fall back to the latest proforma (sorted by timestamp in id, latest first)
    if (!targetProforma) {
      const sortedProformas = [...projectProformas].sort((a, b) => {
        const getTs = (id: string) => {
          const match = id.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getTs(b.id) - getTs(a.id);
      });
      targetProforma = sortedProformas[0];
    }

    let totalItems = 0;
    let wonItems = 0;
    let lostItems = 0;
    let pendingItems = 0;

    if (targetProforma && targetProforma.items) {
      targetProforma.items.forEach(item => {
        totalItems++;
        const itemStatus = item.status || 'جاری';
        if (itemStatus === 'برنده') {
          wonItems++;
        } else if (itemStatus === 'بازنده') {
          lostItems++;
        } else {
          pendingItems++;
        }
      });
    }

    // Determine project status
    const allCancelled = projectProformas.length > 0 && projectProformas.every(pf => getProformaOutcomeStatus(pf) === 'لغو شده');
    const allLost = projectProformas.length > 0 && projectProformas.every(pf => getProformaOutcomeStatus(pf) === 'باخته');

    let newStatus: Project['status'] = 'ارائه پیش‌فاکتور';
    if (allCancelled) {
      newStatus = 'لغو شده';
    } else if (allLost) {
      newStatus = 'باخته';
    } else if (totalItems > 0) {
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
          const wonPf = projectProformas.find(pf => {
            const outcome = getProformaOutcomeStatus(pf);
            return outcome === 'تأیید شده (برنده)' || outcome === 'نیمه برنده';
          });
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
        } else if (newStatus === 'باخته' || newStatus === 'لغو شده') {
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
    categoryName: 'پیش‌فاکتور' | 'سفارش خرید' | 'مالی' | 'استعلام قیمت از تامین کننده ها' | 'بسته‌بندی و تحویل کالا' | 'خدمات پس از فروش',
    text: string
  ) => {
    if (!projectId) return;

    setProjectCategoryGroups(prevGroups => {
      const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
      const existingGroup = prevGroups.find(g => 
        g.projectId === projectId && 
        normalize(g.categoryName) === normalize(categoryName)
      );

      const newActivity: ProjectActivity = {
        id: `act-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text,
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        createdBy: currentUser?.fullName || "کاربر سیستم",
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
        const catId = categoryName === 'پیش‌فاکتور' ? 'pf' : 
                      categoryName === 'سفارش خرید' ? 'po' : 
                      categoryName === 'مالی' ? 'fi' : 
                      categoryName === 'بسته‌بندی و تحویل کالا' ? 'pd' : 'inq';
        const newGroup: ProjectCategoryGroup = {
          id: `cg-fact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          projectId,
          categoryId: `cat-fact-${catId}`,
          categoryName,
          status: 'جاری',
          startDate: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          endDate: null,
          activities: [newActivity]
        };
        updatedGroups = [newGroup, ...prevGroups];
      }

      saveToServer('erp_project_category_groups', updatedGroups);
      return updatedGroups;
    });
  };

  const addProforma = (proforma: Omit<Proforma, 'id' | 'proformaNumber'>) => {
    const seqNum = proformas.length + 1;
    const projectCode = proforma.projectId 
      ? (projects.find(p => p.id === proforma.projectId)?.code || 'ATA')
      : 'ATA';
    
    let formatStr = settings.documentFormats.proformaFormat || 'QT-{PROJECT}-{SEQ:2}';
    if (proforma.proformaType === 'TECHNICAL') {
      formatStr = settings.documentFormats.proformaTechnicalFormat || 'QT-TECH-{PROJECT}-{SEQ:2}';
    } else if (proforma.proformaType === 'AFTER_SALES') {
      formatStr = settings.documentFormats.proformaAfterSalesFormat || 'QT-SERV-{PROJECT}-{SEQ:2}';
    }

    const computedNumber = formatERPNumber(
      formatStr,
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
        `پیش‌فاکتور شماره ${newProforma.proformaNumber} به مبلغ کل ${newProforma.totalAmount.toLocaleString('fa-IR')} ${newProforma.currency || 'ریال'} در وضعیت «${statusLabel}» توسط ${currentUser?.fullName || 'کاربر سیستم'} ایجاد شد.`
      );
    }

    // If instantly created as "won" or contains won items, reduce inventory stock
    const initialWonItems = getWonItemsOfProforma(newProforma);
    initialWonItems.forEach(item => {
      adjustProductStock(item.productId, -item.quantity, newProforma.id, 'PROFORMA', `خروج به دلیل پیش‌فاکتور ${newProforma.proformaNumber}`);
    });

    notifyModuleResponsible('proformas', 'ثبت پیش‌فاکتور جدید', `پیش‌فاکتور شماره ${newProforma.proformaNumber} صادر شد.`, newProforma.projectId);
    logAction('CREATE', 'پیش‌فاکتورها', newProforma.id, `ایجاد پیش‌فاکتور جدید شماره ${newProforma.proformaNumber} به مبلغ کل ${newProforma.totalAmount.toLocaleString('fa-IR')} ${newProforma.currency}`, undefined, newProforma);

    const newOutcome = getProformaOutcomeStatus(newProforma);
    const relatedProj = newProforma.projectId ? projects.find(p => p.id === newProforma.projectId) : undefined;
    runWorkflows('proforma_outcome_change', {
      projectId: newProforma.projectId,
      projectName: relatedProj?.name || newProforma.customerName,
      proformaNumber: newProforma.proformaNumber,
      oldOutcome: '',
      newOutcome,
      salesExpert: relatedProj?.salesExpert
    });

    return newProforma;
  };

  const updateProformaStatus = (id: string, newStatus: Proforma['status'], lossReason?: string) => {
    const oldProforma = proformas.find(p => p.id === id);
    if (!oldProforma) return;

    const updated = proformas.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          status: newStatus, 
          isCancelled: false,
          lossReason: newStatus === 'باخته' ? lossReason : p.lossReason 
        };
      }
      return p;
    });

    saveToStorage('erp_proformas', updated, setProformas);

    const newProformaObj = updated.find(p => p.id === id);
    logAction('UPDATE', 'پیش‌فاکتورها', id, `تغییر وضعیت ارسال پیش‌فاکتور شماره ${oldProforma.proformaNumber} به «${newStatus}»`, oldProforma, newProformaObj);

    if (oldProforma.projectId) {
      const syncedProjects = syncProjectStatus(oldProforma.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      autoLogFactActivity(
        oldProforma.projectId,
        'پیش‌فاکتور',
        `وضعیت ارسال پیش‌فاکتور شماره ${oldProforma.proformaNumber} به «${newStatus}» تغییر یافت.`
      );
    }

    // Dynamic self-healing inventory adjustment
    if (newProformaObj) {
      // 1. Revert old won items (add back)
      const oldWon = getWonItemsOfProforma(oldProforma);
      oldWon.forEach(item => {
        adjustProductStock(item.productId, item.quantity, oldProforma.id, 'PROFORMA', `بازگشت موجودی پیش‌فاکتور ${oldProforma.proformaNumber}`);
      });

      // 2. Deduct new won items (subtract)
      const newWon = getWonItemsOfProforma(newProformaObj);
      newWon.forEach(item => {
        adjustProductStock(item.productId, -item.quantity, newProformaObj.id, 'PROFORMA', `خروج به دلیل پیش‌فاکتور ${newProformaObj.proformaNumber}`);
      });

      // 3. Trigger workflows
      const oldOutcome = getProformaOutcomeStatus(oldProforma);
      const newOutcome = getProformaOutcomeStatus(newProformaObj);
      if (oldOutcome !== newOutcome) {
        const relatedProj = oldProforma.projectId ? projects.find(p => p.id === oldProforma.projectId) : undefined;
        runWorkflows('proforma_outcome_change', {
          projectId: oldProforma.projectId,
          projectName: relatedProj?.name || oldProforma.customerName,
          proformaNumber: oldProforma.proformaNumber,
          oldOutcome,
          newOutcome,
          salesExpert: relatedProj?.salesExpert
        });
      }
    }
  };

  const updateProforma = (updatedPf: Proforma) => {
    const oldPf = proformas.find(p => p.id === updatedPf.id);
    if (!oldPf) return;

    const finalUpdatedPf = { ...updatedPf };

    const updated = proformas.map(p => p.id === updatedPf.id ? finalUpdatedPf : p);
    saveToStorage('erp_proformas', updated, setProformas);
    
    const oldOutcome = getProformaOutcomeStatus(oldPf);
    const newOutcome = getProformaOutcomeStatus(finalUpdatedPf);
    const outcomeChanged = oldOutcome !== newOutcome;

    let logText = `پیش‌فاکتور شماره ${finalUpdatedPf.proformaNumber} ویرایش شد.`;
    if (outcomeChanged) {
      logText += ` وضعیت نهایی به «${newOutcome}» تغییر یافت.`;
    }

    logAction('UPDATE', 'پیش‌فاکتورها', updatedPf.id, logText, oldPf, finalUpdatedPf);

    if (finalUpdatedPf.projectId) {
      const syncedProjects = syncProjectStatus(finalUpdatedPf.projectId, updated, projects);
      saveToStorage('erp_projects', syncedProjects, setProjects);
      
      autoLogFactActivity(finalUpdatedPf.projectId, 'پیش‌فاکتور', logText);
      
      if (outcomeChanged && (newOutcome === 'تأیید شده (برنده)' || newOutcome === 'نیمه برنده')) {
        setCompletionPrompt({
          projectId: finalUpdatedPf.projectId,
          categoryName: 'پیش‌فاکتور',
          message: `پیش‌فاکتور ${finalUpdatedPf.proformaNumber} تایید شد (${newOutcome === 'تأیید شده (برنده)' ? 'برنده' : 'نیمه برنده'}). آیا می‌خواهید وضعیت فعالیت‌های پیش‌فاکتور این پروژه را به «اتمام کار» تغییر دهید؟`
        });
      }
    }

    if (outcomeChanged) {
      const relatedProj = finalUpdatedPf.projectId ? projects.find(p => p.id === finalUpdatedPf.projectId) : undefined;
      runWorkflows('proforma_outcome_change', {
        projectId: finalUpdatedPf.projectId,
        projectName: relatedProj?.name || finalUpdatedPf.customerName,
        proformaNumber: finalUpdatedPf.proformaNumber,
        oldOutcome,
        newOutcome,
        salesExpert: relatedProj?.salesExpert
      });
    }

    // Dynamic self-healing inventory adjustment
    // 1. Revert old won items
    const oldWon = getWonItemsOfProforma(oldPf);
    oldWon.forEach(item => {
      adjustProductStock(item.productId, item.quantity, oldPf.id, 'PROFORMA', `بازگشت موجودی پیش‌فاکتور ${oldPf.proformaNumber}`);
    });

    // 2. Deduct new won items
    const newWon = getWonItemsOfProforma(finalUpdatedPf);
    newWon.forEach(item => {
      adjustProductStock(item.productId, -item.quantity, finalUpdatedPf.id, 'PROFORMA', `خروج به دلیل پیش‌فاکتور ${finalUpdatedPf.proformaNumber}`);
    });

    notifyModuleResponsible('proformas', 'ویرایش پیش‌فاکتور', `پیش‌فاکتور شماره ${finalUpdatedPf.proformaNumber} ویرایش شد.`, finalUpdatedPf.projectId);
  };

  const deleteProforma = (id: string) => {
    const pf = proformas.find(p => p.id === id);
    if (pf) {
      // Revert inventory before deleting using getWonItemsOfProforma helper
      const oldWon = getWonItemsOfProforma(pf);
      oldWon.forEach(item => {
        adjustProductStock(item.productId, item.quantity, pf.id, 'PROFORMA', `بازگشت موجودی حذف پیش‌فاکتور ${pf.proformaNumber}`);
      });
    }
    const updated = proformas.filter(p => p.id !== id);
    saveToStorage('erp_proformas', updated, setProformas);

    if (pf) {
      logAction('DELETE', 'پیش‌فاکتورها', id, `حذف پیش‌فاکتور شماره ${pf.proformaNumber}`, pf, undefined);
    }

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
        if (newStatus === 'لغو شده') {
          return {
            ...p,
            isCancelled: true,
            lossReason: undefined
          };
        }
        if (newStatus === 'باخته') {
          const updatedItems = p.items.map(item => ({
            ...item,
            status: 'بازنده' as const,
            lossReason: batchLossReason || item.lossReason
          }));
          return {
            ...p,
            isCancelled: false,
            lossReason: batchLossReason,
            items: updatedItems
          };
        }
        
        // Fallback or explicit other statuses
        const updatedItems = p.items.map(item => ({
          ...item,
          status: newStatus === 'تأیید شده (برنده)' ? ('برنده' as const) : item.status
        }));
        return {
          ...p,
          isCancelled: false,
          items: updatedItems
        };
      }
      return p;
    });

    // Inventory Adjustment before saving state
    proformas.forEach(oldPf => {
      if (oldPf.projectId === projectId) {
        // Revert old won items
        const oldWon = getWonItemsOfProforma(oldPf);
        oldWon.forEach(item => adjustProductStock(item.productId, item.quantity, oldPf.id, 'PROFORMA', `بازگشت موجودی پیش‌فاکتور ${oldPf.proformaNumber}`));

        // Deduct new won items
        const updatedPfObj = updated.find(p => p.id === oldPf.id);
        if (updatedPfObj) {
          const newWon = getWonItemsOfProforma(updatedPfObj);
          newWon.forEach(item => adjustProductStock(item.productId, -item.quantity, updatedPfObj.id, 'PROFORMA', `خروج پیش‌فاکتور ${updatedPfObj.proformaNumber}`));
        }
      }
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
        `سفارش خرید شماره ${newPO.poNumber} با وضعیت «${newPO.status}» به تامین‌کننده توسط ${currentUser?.fullName || 'کاربر سیستم'} ثبت شد.`
      );
    }

    // If instantly created as "delivered", add to stock
    if (newPO.status === 'تحویل شده (رسید انبار)') {
      newPO.items.forEach(item => {
        adjustProductStock(item.productId, item.quantity, newPO.id, 'PURCHASE_ORDER', `رسید انبار سفارش ${newPO.poNumber}`);
      });
    }

    notifyModuleResponsible('purchaseOrders', 'ثبت سفارش خرید جدید', `سفارش خرید شماره ${newPO.poNumber} ثبت شد.`, newPO.projectId);

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
        adjustProductStock(item.productId, item.quantity, oldPO.id, 'PURCHASE_ORDER', `رسید انبار سفارش ${oldPO.poNumber}`);
      });
    } else if (wasDeliveredButReverted) {
      // Deduct items from stock (revert)
      oldPO.items.forEach(item => {
        adjustProductStock(item.productId, -item.quantity, oldPO.id, 'PURCHASE_ORDER', `لغو رسید انبار سفارش ${oldPO.poNumber}`);
      });
    }

    if (oldPO.status !== newStatus) {
      runWorkflows('purchase_order_status_change', {
        projectId: oldPO.projectId,
        projectName: oldPO.projectName,
        poNumber: oldPO.poNumber,
        oldStatus: oldPO.status,
        newStatus,
        salesExpert: oldPO.projectId ? (projects.find(p => p.id === oldPO.projectId)?.salesExpert) : undefined
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
      
      if (statusChanged && updatedPO.status === 'تحویل شده (رسید انبار)') {
        setCompletionPrompt({
          projectId: updatedPO.projectId,
          categoryName: 'سفارش خرید',
          message: `سفارش خرید ${updatedPO.poNumber} به انبار تحویل شد. آیا می‌خواهید وضعیت فعالیت‌های سفارش خرید این پروژه را به «اتمام کار» تغییر دهید؟`
        });
      }
    }

    if (oldPO.status !== updatedPO.status) {
      runWorkflows('purchase_order_status_change', {
        projectId: updatedPO.projectId,
        projectName: updatedPO.projectName,
        poNumber: updatedPO.poNumber,
        oldStatus: oldPO.status,
        newStatus: updatedPO.status,
        salesExpert: updatedPO.projectId ? (projects.find(p => p.id === updatedPO.projectId)?.salesExpert) : undefined
      });
    }

    // Handle delivered state stock updates
    const wasDelivered = oldPO.status === 'تحویل شده (رسید انبار)';
    const isDelivered = updatedPO.status === 'تحویل شده (رسید انبار)';

    if (!wasDelivered && isDelivered) {
      // Add new items
      updatedPO.items.forEach(item => adjustProductStock(item.productId, item.quantity, updatedPO.id, 'PURCHASE_ORDER', `رسید انبار سفارش ${updatedPO.poNumber}`));
    } else if (wasDelivered && !isDelivered) {
      // Deduct old items
      oldPO.items.forEach(item => adjustProductStock(item.productId, -item.quantity, oldPO.id, 'PURCHASE_ORDER', `لغو رسید انبار سفارش ${oldPO.poNumber}`));
    } else if (wasDelivered && isDelivered) {
      // Recalculate difference: subtract old first, then add new
      oldPO.items.forEach(item => adjustProductStock(item.productId, -item.quantity));
      updatedPO.items.forEach(item => adjustProductStock(item.productId, item.quantity));
    }

    notifyModuleResponsible('purchaseOrders', 'ویرایش سفارش خرید', `سفارش خرید شماره ${updatedPO.poNumber} ویرایش شد.`, updatedPO.projectId);
  };

  const deletePurchaseOrder = (id: string) => {
    const po = purchaseOrders.find(po => po.id === id);
    if (po && po.status === 'تحویل شده (رسید انبار)') {
      // Revert inventory addition
      po.items.forEach(item => adjustProductStock(item.productId, -item.quantity, po.id, 'PURCHASE_ORDER', `حذف رسید انبار سفارش ${po.poNumber}`));
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
    
    notifyModuleResponsible('transactions', 'ثبت تراکنش جدید', `یک تراکنش ${newTransaction.type === 'دریافت' ? 'دریافتی' : 'پرداختی'} به مبلغ ${newTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال ثبت شد.`, newTransaction.projectId);
    logAction('CREATE', 'دریافت و پرداخت', newTransaction.id, `ثبت تراکنش ${newTransaction.type === 'دریافت' ? 'دریافتی' : 'پرداختی'} جدید به شماره ${newTransaction.documentNumber} و مبلغ ${newTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال`, undefined, newTransaction);
    
    if (newTransaction.projectId) {
      const typeStr = newTransaction.type === 'دریافت' ? 'دریافت' : 'پرداخت';
      const paymentTypeStr = newTransaction.paymentType || '';
      const receiptTypeStr = newTransaction.receiptType ? ` بابت ${newTransaction.receiptType}` : '';
      const refStr = newTransaction.referenceNumber ? ` (شماره ارجاع/چک: ${newTransaction.referenceNumber})` : '';
      const logText = `ثبت تراکنش جدید ${typeStr}${receiptTypeStr} به شماره سند ${newTransaction.documentNumber || 'بدون شماره'} به مبلغ ${newTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال از طریق ${paymentTypeStr}${refStr}`;
      autoLogFactActivity(newTransaction.projectId, 'مالی', logText);
    }

    return newTransaction;
  };

  const deleteTransaction = (id: string) => {
    const tr = transactions.find(t => t.id === id);
    const updated = transactions.filter(t => t.id !== id);
    saveToStorage('erp_transactions', updated, setTransactions);

    if (tr && tr.projectId) {
      const typeStr = tr.type === 'دریافت' ? 'دریافت' : 'پرداخت';
      const receiptTypeStr = tr.receiptType ? ` بابت ${tr.receiptType}` : '';
      const logText = `حذف تراکنش ${typeStr}${receiptTypeStr} به شماره سند ${tr.documentNumber || 'بدون شماره'} به مبلغ ${tr.amountRIYAL.toLocaleString('fa-IR')} ریال`;
      autoLogFactActivity(tr.projectId, 'مالی', logText);
    }
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    const before = transactions.find(t => t.id === updatedTransaction.id);
    const updated = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
    saveToStorage('erp_transactions', updated, setTransactions);
    
    notifyModuleResponsible('transactions', 'ویرایش تراکنش', `تراکنش شماره ${updatedTransaction.documentNumber} ویرایش شد.`, updatedTransaction.projectId);
    if (before) {
      logAction('UPDATE', 'دریافت و پرداخت', updatedTransaction.id, `ویرایش تراکنش ${updatedTransaction.type} به شماره ${updatedTransaction.documentNumber}`, before, updatedTransaction);
    }

    if (updatedTransaction.projectId) {
      const typeStr = updatedTransaction.type === 'دریافت' ? 'دریافت' : 'پرداخت';
      const paymentTypeStr = updatedTransaction.paymentType || '';
      const receiptTypeStr = updatedTransaction.receiptType ? ` بابت ${updatedTransaction.receiptType}` : '';
      const refStr = updatedTransaction.referenceNumber ? ` (شماره ارجاع/چک: ${updatedTransaction.referenceNumber})` : '';
      const logText = `بروزرسانی تراکنش ${typeStr}${receiptTypeStr} به شماره سند ${updatedTransaction.documentNumber || 'بدون شماره'} به مبلغ ${updatedTransaction.amountRIYAL.toLocaleString('fa-IR')} ریال از طریق ${paymentTypeStr}${refStr}`;
      autoLogFactActivity(updatedTransaction.projectId, 'مالی', logText);
    }
  };

  // --- Supplier Inquiries CRUD ---
  const addSupplierInquiry = (inquiry: Omit<SupplierInquiry, 'id' | 'createdAt' | 'steps'> & { steps?: InquiryStep[] }) => {
    const today = getTodayShamsi();
    const creationTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const creationStep: InquiryStep = {
      id: `step-${Date.now()}-init`,
      date: today + ' ' + creationTime,
      title: 'ایجاد استعلام',
      description: `استعلام اولیه ایجاد شد. پروژه: ${inquiry.projectName}${inquiry.proformaNumber ? `، پیش‌فاکتور: ${inquiry.proformaNumber}` : ''}${inquiry.proformaItemName ? `، ردیف: ${inquiry.proformaItemName}` : ''}`,
      type: 'creation'
    };
    
    const newInquiry: SupplierInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: today + ' ' + creationTime,
      steps: inquiry.steps || [creationStep]
    };
    
    const updated = [newInquiry, ...supplierInquiries];
    saveToStorage('erp_supplier_inquiries', updated, setSupplierInquiries);
    
    const logText = `ثبت استعلام جدید از تامین‌کننده ${inquiry.supplierName} بابت پروژه ${inquiry.projectName}${inquiry.proformaNumber ? ` (پیش‌فاکتور ${inquiry.proformaNumber})` : ''}${inquiry.proformaItemName ? ` - ردیف: ${inquiry.proformaItemName}` : ''}`;
    autoLogFactActivity(inquiry.projectId, 'استعلام قیمت از تامین کننده ها', logText);
    
    return newInquiry;
  };

  const updateSupplierInquiry = (updatedInquiry: SupplierInquiry) => {
    const updated = supplierInquiries.map(inq => inq.id === updatedInquiry.id ? updatedInquiry : inq);
    saveToStorage('erp_supplier_inquiries', updated, setSupplierInquiries);
    
    const logText = `بروزرسانی استعلام تامین‌کننده ${updatedInquiry.supplierName} - وضعیت جدید: ${updatedInquiry.status}`;
    
    const oldInquiry = supplierInquiries.find(i => i.id === updatedInquiry.id);
    if (oldInquiry && oldInquiry.status !== updatedInquiry.status) {
       runWorkflows('supplier_inquiry_status_change', {
         projectId: updatedInquiry.projectId,
         newStatus: updatedInquiry.status,
         oldStatus: oldInquiry.status,
         inquiryId: updatedInquiry.id
       });
    }
    autoLogFactActivity(updatedInquiry.projectId, 'استعلام قیمت از تامین کننده ها', logText);
  };

  const deleteSupplierInquiry = (id: string, deleteLogs: boolean = false) => {
    const inq = supplierInquiries.find(i => i.id === id);
    const updated = supplierInquiries.filter(i => i.id !== id);
    saveToStorage('erp_supplier_inquiries', updated, setSupplierInquiries);
    
    if (inq) {
      if (deleteLogs) {
        const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
        const targetCategory = 'استعلام قیمت از تامین کننده ها';
        setProjectCategoryGroups(prevGroups => {
          const updatedGroups = prevGroups.filter(g => 
            !(g.projectId === inq.projectId && normalize(g.categoryName) === normalize(targetCategory))
          );
          saveToServer('erp_project_category_groups', updatedGroups);
          return updatedGroups;
        });
      } else {
        const logText = `حذف استعلام تامین‌کننده ${inq.supplierName} بابت پروژه ${inq.projectName}`;
        autoLogFactActivity(inq.projectId, 'استعلام قیمت از تامین کننده ها', logText);
      }
    }
  };

  const addSupplierInquiryStep = (inquiryId: string, step: Omit<InquiryStep, 'id'>) => {
    const newStep: InquiryStep = {
      ...step,
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
    };
    
    const inq = supplierInquiries.find(i => i.id === inquiryId);
    if (!inq) return;
    
    const updatedSteps = [...inq.steps, newStep];
    const updatedInquiry: SupplierInquiry = {
      ...inq,
      steps: updatedSteps,
      status: step.type === 'sent' ? 'ارسال شده' : (step.type === 'response' ? 'پاسخ داده شده' : (step.type === 'winner' ? 'برنده' : inq.status))
    };
    
    const updated = supplierInquiries.map(i => i.id === inquiryId ? updatedInquiry : i);
    saveToStorage('erp_supplier_inquiries', updated, setSupplierInquiries);
    
    const logText = `اقدام استعلام تامین‌کننده ${inq.supplierName}: ${step.title} - ${step.description}`;
    autoLogFactActivity(inq.projectId, 'استعلام قیمت از تامین کننده ها', logText);
  };

  const selectSupplierInquiryWinner = (inquiryId: string, isWinner: boolean) => {
    const inq = supplierInquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    const updated = supplierInquiries.map(i => {
      if (i.id === inquiryId) {
        const today = getTodayShamsi();
        const winnerStep: InquiryStep = {
          id: `step-${Date.now()}-winner`,
          date: today + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          title: isWinner ? 'انتخاب به عنوان برنده' : 'خروج از وضعیت برنده',
          description: isWinner ? 'این پیشنهاد به عنوان آفر برنده برای این کالا انتخاب شد.' : 'انتخاب برنده لغو شد.',
          type: 'winner'
        };
        return {
          ...i,
          isWinner,
          status: (isWinner ? 'برنده' : 'پاسخ داده شده') as any,
          winnerSelectedDate: isWinner ? today : undefined,
          steps: [...i.steps, winnerStep]
        };
      }
      if (isWinner && i.projectId === inq.projectId && i.proformaId === inq.proformaId && i.proformaItemId === inq.proformaItemId && i.id !== inquiryId) {
        return {
          ...i,
          isWinner: false,
          status: 'بازنده' as any
        };
      }
      return i;
    });

    saveToStorage('erp_supplier_inquiries', updated, setSupplierInquiries);


    const logText = isWinner 
      ? `انتخاب پیشنهاد تامین‌کننده ${inq.supplierName} به عنوان برنده بابت پروژه ${inq.projectName}` 
      : `لغو وضعیت برنده برای پیشنهاد تامین‌کننده ${inq.supplierName}`;
    autoLogFactActivity(inq.projectId, 'استعلام قیمت از تامین کننده ها', logText);
    
    if (isWinner) {
      setCompletionPrompt({
        projectId: inq.projectId,
        categoryName: 'استعلام قیمت از تامین کننده ها',
        message: `پیشنهاد تامین‌کننده ${inq.supplierName} به عنوان برنده انتخاب شد. آیا می‌خواهید وضعیت این دسته فعالیت را به «اتمام کار» تغییر دهید؟`
      });
    }

  };

  // --- Tasks CRUD ---
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    const updated = [newTask, ...tasks];
    saveToStorage('erp_tasks', updated, setTasks);
    logAction('CREATE', 'وظایف/پیگیری‌ها', newTask.id, `ثبت وظیفه جدید: "${newTask.title}" ارجاع به ${newTask.assignedTo}`, undefined, newTask);
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    const before = tasks.find(t => t.id === updatedTask.id);
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveToStorage('erp_tasks', updated, setTasks);
    logAction('UPDATE', 'وظایف/پیگیری‌ها', updatedTask.id, `ویرایش اطلاعات وظیفه: "${updatedTask.title}"`, before, updatedTask);
  };

  const deleteTask = (id: string) => {
    const before = tasks.find(t => t.id === id);
    const updated = tasks.filter(t => t.id !== id);
    saveToStorage('erp_tasks', updated, setTasks);
    if (before) {
      logAction('DELETE', 'وظایف/پیگیری‌ها', id, `حذف وظیفه: "${before.title}"`, before, undefined);
    }
  };

  const addPackagingDelivery = (delivery: Omit<PackagingDelivery, 'id' | 'createdAt' | 'packingListNumber'>) => {
    const seqNum = packagingDeliveries.length + 1;
    const proj = projects.find(p => p.id === delivery.projectId);
    const projectCode = proj ? proj.code : 'PRJ';
    const packingListNumber = `PK-${projectCode}-${String(seqNum).padStart(3, '0')}`;
    
    const newDelivery: PackagingDelivery = {
      ...delivery,
      id: `pack-${Date.now()}`,
      packingListNumber,
      createdAt: new Date().toISOString()
    };
    const updated = [newDelivery, ...packagingDeliveries];
    saveToStorage('erp_packaging_deliveries', updated, setPackagingDeliveries);
    
    const logText = `ثبت پکینگ لیست و تحویل کالا به شماره ${packingListNumber} با روش ارسال ${delivery.shippingMethod}`;
    autoLogFactActivity(delivery.projectId, 'بسته‌بندی و تحویل کالا', logText);
    logAction('CREATE', 'بسته‌بندی و ارسال', newDelivery.id, `ثبت پکینگ لیست و تحویل کالا به شماره ${packingListNumber}`, undefined, newDelivery);
    
    setCompletionPrompt({
      projectId: delivery.projectId,
      categoryName: 'بسته‌بندی و تحویل کالا',
      message: `پکینگ لیست ${packingListNumber} صادر شد. آیا می‌خواهید وضعیت دسته فعالیت بسته‌بندی را به «اتمام کار» تغییر دهید؟`
    });

    return newDelivery;
  };

  const updatePackagingDelivery = (updatedDelivery: PackagingDelivery) => {
    const before = packagingDeliveries.find(d => d.id === updatedDelivery.id);
    const updated = packagingDeliveries.map(d => d.id === updatedDelivery.id ? updatedDelivery : d);
    saveToStorage('erp_packaging_deliveries', updated, setPackagingDeliveries);
    
    const logText = `بروزرسانی پکینگ لیست و تحویل کالا به شماره ${updatedDelivery.packingListNumber}`;
    autoLogFactActivity(updatedDelivery.projectId, 'بسته‌بندی و تحویل کالا', logText);
    logAction('UPDATE', 'بسته‌بندی و ارسال', updatedDelivery.id, `بروزرسانی پکینگ لیست شماره ${updatedDelivery.packingListNumber}`, before, updatedDelivery);
  };

  const deletePackagingDelivery = (id: string, deleteLogs: boolean = false) => {
    const delivery = packagingDeliveries.find(d => d.id === id);
    const updated = packagingDeliveries.filter(d => d.id !== id);
    saveToStorage('erp_packaging_deliveries', updated, setPackagingDeliveries);
    
    if (delivery) {
      logAction('DELETE', 'بسته‌بندی و ارسال', id, `حذف پکینگ لیست شماره ${delivery.packingListNumber}`, delivery, undefined);

      if (deleteLogs) {
        // Delete activities related to this packing list
        setProjectCategoryGroups(prevGroups => {
          const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
          const targetCategory = 'بسته‌بندی و تحویل کالا';
          const updatedGroups = prevGroups.map(g => {
            if (g.projectId === delivery.projectId && normalize(g.categoryName) === normalize(targetCategory)) {
              return {
                ...g,
                activities: g.activities.filter(a => !a.text.includes(delivery.packingListNumber))
              };
            }
            return g;
          });
          saveToServer('erp_project_category_groups', updatedGroups);
          return updatedGroups;
        });
      } else {
        const logText = `حذف پکینگ لیست و تحویل کالا به شماره ${delivery.packingListNumber}`;
        autoLogFactActivity(delivery.projectId, 'بسته‌بندی و تحویل کالا', logText);
      }
    }
  };


  // --- After Sales Services CRUD ---
  const addAfterSalesService = (service: Omit<AfterSalesService, 'id' | 'createdAt'>) => {
    const newService: AfterSalesService = {
      ...service,
      id: `ass-${Date.now()}`,
      createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newService, ...afterSalesServices];
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    const logText = `ثبت خدمات پس از فروش جدید برای کالای ${service.itemName}`;
    
    runWorkflows('after_sales_service_status_change', {
       projectId: newService.projectId,
       newStatus: newService.status,
       oldStatus: '',
       serviceId: newService.id
    });
    autoLogFactActivity(service.projectId, 'خدمات پس از فروش', logText);
    logAction('CREATE', 'خدمات پس از فروش', newService.id, `ثبت خدمات پس از فروش جدید برای کالای ${service.itemName}`, undefined, newService);
    
    return newService;
  };



  const updateAfterSalesService = (updatedService: AfterSalesService) => {
    const oldService = afterSalesServices.find(s => s.id === updatedService.id);
    const updated = afterSalesServices.map(s => s.id === updatedService.id ? updatedService : s);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    const logText = `بروزرسانی خدمات پس از فروش کالای ${updatedService.itemName} - وضعیت: ${updatedService.status}`;
    autoLogFactActivity(updatedService.projectId, 'خدمات پس از فروش', logText);
    logAction('UPDATE', 'خدمات پس از فروش', updatedService.id, `بروزرسانی خدمات پس از فروش برای کالای ${updatedService.itemName}`, oldService, updatedService);
    
    if (oldService && oldService.status !== updatedService.status && updatedService.status === 'تحویل داده شده') {
      setCompletionPrompt({
        projectId: updatedService.projectId,
        categoryName: 'خدمات پس از فروش',
        message: `کالای ${updatedService.itemName} تحویل مشتری داده شد. آیا می‌خواهید وضعیت دسته فعالیت مربوط به خدمات پس از فروش را به «اتمام کار» تغییر دهید؟`
      });
    }
  };


  const deleteAfterSalesService = (id: string, deleteLogs: boolean = false) => {
    const service = afterSalesServices.find(s => s.id === id);
    const updated = afterSalesServices.filter(s => s.id !== id);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    if (service) {
      logAction('DELETE', 'خدمات پس از فروش', id, `حذف رکورد خدمات پس از فروش برای کالای ${service.itemName}`, service, undefined);

      if (deleteLogs) {
        setProjectCategoryGroups(prevGroups => {
          const normalize = (str: string) => str.replace(/[\s‌]/g, '').trim();
          const targetCategory = 'خدمات پس از فروش';
          const updatedGroups = prevGroups.map(g => {
            if (g.projectId === service.projectId && normalize(g.categoryName) === normalize(targetCategory)) {
              return {
                ...g,
                activities: g.activities.filter(a => !a.text.includes(service.itemName))
              };
            }
            return g;
          });
          saveToServer('erp_project_category_groups', updatedGroups);
          return updatedGroups;
        });
      } else {
        const logText = `حذف رکورد خدمات پس از فروش برای کالای ${service.itemName}`;
        autoLogFactActivity(service.projectId, 'خدمات پس از فروش', logText);
      }
    }
  };

  // --- Settings Customizer ---
  const updateSettings = (newSettings: ERPSettings) => {
    saveToStorage('erp_settings', newSettings, setSettings);
  };

  const runWorkflows = (
    triggerType: 'proforma_outcome_change' | 'project_status_change' | 'purchase_order_status_change' | 'packaging_delivery_created' | 'supplier_inquiry_status_change' | 'after_sales_service_status_change',
    context: {
      projectId?: string;
      projectName?: string;
      proformaNumber?: string;
      poNumber?: string;
      oldOutcome?: string;
      newOutcome?: string;
      oldStatus?: string;
      newStatus?: string;
      salesExpert?: string;
      proformaAmount?: number;
      inquiryId?: string;
      deliveryId?: string;
      serviceId?: string;
      action?: string;
    }
  ) => {
    const rules = settings.workflows || [];
    const activeRules = rules.filter(r => r.active && r.triggerType === triggerType);

    if (activeRules.length === 0) return;

    activeRules.forEach(rule => {
      let conditionsMet = true;
      for (const cond of rule.conditions) {
        let actualValue = '';
        if (cond.field === 'newOutcome') actualValue = context.newOutcome || '';
        else if (cond.field === 'oldOutcome') actualValue = context.oldOutcome || '';
        else if (cond.field === 'newStatus') actualValue = context.newStatus || '';
        else if (cond.field === 'oldStatus') actualValue = context.oldStatus || '';

        if (cond.operator === 'equals') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) !== Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (actualValue !== cond.value) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'not_equals') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) === Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (actualValue === cond.value) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'greater_than') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) <= Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (Number(actualValue) <= Number(cond.value)) { conditionsMet = false; break; }
          }
        } else if (cond.operator === 'less_than') {
          if (cond.field === 'proformaAmount') {
             if (Number(context.proformaAmount || 0) >= Number(cond.value)) { conditionsMet = false; break; }
          } else {
             if (Number(actualValue) >= Number(cond.value)) { conditionsMet = false; break; }
          }
        }
      }

      if (!conditionsMet) return;

      const replaceTokens = (tmpl: string) => {
        return tmpl
          .replace(/{projectName}/g, context.projectName || '')
          .replace(/{projectCode}/g, context.projectId ? (projects.find(p => p.id === context.projectId)?.code || '') : '')
          .replace(/{proformaNumber}/g, context.proformaNumber || '')
          .replace(/{poNumber}/g, context.poNumber || '')
          .replace(/{oldOutcome}/g, context.oldOutcome || '')
          .replace(/{newOutcome}/g, context.newOutcome || '')
          .replace(/{oldStatus}/g, context.oldStatus || '')
          .replace(/{newStatus}/g, context.newStatus || '');
      };

      rule.actions.forEach(action => {
        if (action.type === 'create_task' && action.taskConfig) {
          const config = action.taskConfig;
          const title = replaceTokens(config.titleTemplate);
          const description = replaceTokens(config.descTemplate);

          let assignedToName = config.assignedTo;
          if (assignedToName.startsWith('MODULE_RESPONSIBLE_')) {
            const moduleKey = assignedToName.replace('MODULE_RESPONSIBLE_', '');
            assignedToName = settings.moduleResponsibles?.[moduleKey] || '';
          } else if (assignedToName === 'SALES_EXPERT') {
            assignedToName = context.salesExpert || (context.projectId ? (projects.find(p => p.id === context.projectId)?.salesExpert || '') : '');
          }

          if (!assignedToName) {
            assignedToName = currentUser?.fullName || 'محمد توکل مقدم';
          }

          const dueDate = config.dueDaysOffset 
            ? addDaysToShamsi(getTodayShamsi(), config.dueDaysOffset) 
            : getTodayShamsi();

          const taskToCreate: Omit<Task, 'id'> = {
            title,
            description,
            relatedToType: triggerType === 'proforma_outcome_change' ? 'پیش‌فاکتور' : triggerType === 'project_status_change' ? 'پروژه' : triggerType === 'packaging_delivery_created' ? 'بسته‌بندی و تحویل' : triggerType === 'supplier_inquiry_status_change' ? 'استعلام تامین‌کننده' : triggerType === 'after_sales_service_status_change' ? 'خدمات پس از فروش' : 'سفارش خرید',
            relatedToId: context.projectId,
            relatedToName: context.projectName,
            priority: config.priority || 'متوسط',
            dueDate,
            assignedTo: assignedToName,
            status: 'در حال انجام'
          };

          addTask(taskToCreate);
        } else if (action.type === 'send_notification' && action.notificationConfig) {
          const config = action.notificationConfig;
          const title = replaceTokens(config.titleTemplate);
          const description = replaceTokens(config.descTemplate);
          notifyModuleResponsible(config.module, title, description, context.projectId);
        }
      });
    });
  };

  // --- Module Notifications ---
  const notifyModuleResponsible = (module: string, title: string, description: string, projectId?: string) => {
    const targets: string[] = [];
    
    // 1. The responsible user for the module
    const responsibleName = settings.moduleResponsibles?.[module];
    if (responsibleName && currentUser?.fullName !== responsibleName) {
      targets.push(responsibleName);
    }
    
    // 2. Admin users (System Admins)
    users.filter(u => u.role === 'admin' || u.isSystemAdmin).forEach(admin => {
      if (admin.fullName === currentUser?.fullName) return;
      
      const pref = settings.adminNotificationPreferences?.[admin.id];
      const receiveAll = pref ? pref.receiveAll : true;
      const importantProjects = pref ? pref.importantProjectIds : [];
      
      let shouldReceive = false;
      if (receiveAll) {
        shouldReceive = true;
      } else if (projectId && importantProjects.includes(projectId)) {
        shouldReceive = true;
      }
      
      if (shouldReceive && !targets.includes(admin.fullName)) {
        targets.push(admin.fullName);
      }
    });

    if (targets.length === 0) return;

    const newNotifs: ModuleNotification[] = targets.map(targetName => ({
      id: `mnotif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      module,
      title,
      description,
      timestamp: Date.now(),
      read: false,
      responsibleName: targetName
    }));
    
    // Use setState callback to avoid closure staleness on moduleNotifications
    setModuleNotifications(prev => {
      const updated = [...newNotifs, ...prev];
      saveToServer('erp_module_notifications', updated);
      return updated;
    });
  };

  const markModuleNotificationAsRead = (id: string) => {
    setModuleNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveToServer('erp_module_notifications', updated);
      return updated;
    });
  };

  const markAllModuleNotificationsAsRead = () => {
    if (!currentUser) return;
    setModuleNotifications(prev => {
      const updated = prev.map(n => n.responsibleName === currentUser.fullName ? { ...n, read: true } : n);
      saveToServer('erp_module_notifications', updated);
      return updated;
    });
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
    inventoryTransactions,
    tasks,
    supplierInquiries,
    packagingDeliveries,
    moduleNotifications,
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
    batchImportProducts,
    
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
    updateTransaction,
    deleteTransaction,
    
    addTask,
    updateTask,
    deleteTask,
    
    addSupplierInquiry,
    updateSupplierInquiry,
    deleteSupplierInquiry,
    addSupplierInquiryStep,
    selectSupplierInquiryWinner,


    afterSalesServices,
    addAfterSalesService,
    updateAfterSalesService,
    deleteAfterSalesService,

    addPackagingDelivery,
    updatePackagingDelivery,
    deletePackagingDelivery,
    
    markModuleNotificationAsRead,
    markAllModuleNotificationsAsRead,
    readItems,
    markItemsAsRead: (itemsToMark: string[]) => {
      setReadItems(prev => {
        const next = Array.from(new Set([...prev, ...itemsToMark]));
        if (currentUser) {
           localStorage.setItem(`read_notifications_${currentUser.id}`, JSON.stringify(next));
        }
        return next;
      });
    },
    
    // --- Project Activities (Category Groups) CRUD ---
    addProjectCategoryGroup: (projectId: string, categoryId: string, categoryName: string) => {
      const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
      const isDuplicate = projectCategoryGroups.some(g => 
        g.projectId === projectId && 
        (g.categoryId === categoryId || normalize(g.categoryName) === normalize(categoryName))
      );

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
        // Double check in updater just in case
        if (prev.some(g => g.projectId === projectId && (g.categoryId === categoryId || normalize(g.categoryName) === normalize(categoryName)))) {
          return prev;
        }
        const updated = [newGroup, ...prev];
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });

      return { success: true, group: newGroup };
    },

    addProjectActivity: (
      projectId: string,
      categoryGroupId: string,
      text: string,
      attachment: { name: string; size: string; content?: string } | null,
      referral: { assignedTo: string; actionRequired: string; assignedBy: string } | null,
      createdBy?: string
    ) => {
      const newReferral: ProjectReferral | null = referral ? {
        id: `ref-${Date.now()}`,
        assignedTo: referral.assignedTo,
        actionRequired: referral.actionRequired,
        assignedBy: referral.assignedBy || currentUser?.fullName || 'کاربر سیستم',
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        status: 'در انتظار اقدام',
        response: null
      } : null;

      const newActivity: ProjectActivity = {
        id: `act-item-${Date.now()}`,
        text,
        createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        createdBy: createdBy || 'کاربر سیستم',
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
        saveToServer('erp_project_category_groups', updated);
        logAction(
          'CREATE',
          'فعالیت‌های پروژه',
          newActivity.id,
          `ثبت فعالیت جدید در دسته‌بندی پروژه با شناسه ${categoryGroupId}: "${text}"`,
          undefined,
          newActivity
        );
        return updated;
      });

      return newActivity;
    },

    updateProjectActivity: (
      projectId: string,
      categoryGroupId: string,
      activityId: string,
      newText: string
    ) => {
      let beforeAct: any = null;
      let afterAct: any = null;
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            const updatedActivities = (g.activities || []).map(act => {
              if (act.id === activityId) {
                beforeAct = { ...act };
                const updatedAct = {
                  ...act,
                  text: newText
                };
                afterAct = updatedAct;
                return updatedAct;
              }
              return act;
            });
            return {
              ...g,
              activities: updatedActivities
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        
        if (beforeAct && afterAct) {
          logAction(
            'UPDATE',
            'فعالیت‌های پروژه',
            activityId,
            `ویرایش فعالیت در دسته‌بندی پروژه با شناسه ${categoryGroupId} از "${beforeAct.text}" به "${newText}"`,
            beforeAct,
            afterAct
          );
        }
        return updated;
      });
    },

    deleteProjectActivity: (
      projectId: string,
      categoryGroupId: string,
      activityId: string
    ) => {
      let deletedAct: any = null;
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            deletedAct = (g.activities || []).find(act => act.id === activityId) || null;
            const updatedActivities = (g.activities || []).filter(act => act.id !== activityId);
            return {
              ...g,
              activities: updatedActivities
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        
        if (deletedAct) {
          logAction(
            'DELETE',
            'فعالیت‌های پروژه',
            activityId,
            `حذف فعالیت از دسته‌بندی پروژه با شناسه ${categoryGroupId}: "${deletedAct.text}"`,
            deletedAct,
            undefined
          );
        }
        return updated;
      });
    },


    completeProjectCategoryGroup: (categoryGroupId: string, createdBy?: string) => {
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            const newActivity: ProjectActivity = {
              id: `act-item-${Date.now()}`,
              text: 'وضعیت دسته بندی به اتمام کار تغییر یافت.',
              createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              createdBy: createdBy || 'کاربر سیستم',
        attachment: null,
              referral: null
            };
            return {
              ...g,
              status: 'اتمام کار' as const,
              endDate: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              activities: [...(g.activities || []), newActivity]
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });
    },

    resumeProjectCategoryGroup: (categoryGroupId: string, createdBy?: string) => {
      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            const newActivity: ProjectActivity = {
              id: `act-item-${Date.now()}`,
              text: 'دسته بندی مجدداً به جریان انداخته شد.',
              createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              createdBy: createdBy || 'کاربر سیستم',
        attachment: null,
              referral: null
            };
            return {
              ...g,
              status: 'جاری' as const,
              endDate: null,
              activities: [...(g.activities || []), newActivity]
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });
    },

    respondToReferral: (categoryGroupId: string, activityId: string, responseText: string, responderName: string, attachment?: { name: string; size: string; content?: string } | null, markAsDone?: boolean, forwardTo?: string) => {
      let assignerName = '';
      let projectName = '';

      setProjectCategoryGroups(prev => {
        const updated = prev.map(g => {
          if (g.id === categoryGroupId) {
            projectName = g.categoryName || 'پروژه';
            return {
              ...g,
              activities: (g.activities || []).map(a => {
                if (a.id === activityId && a.referral) {
                  assignerName = a.referral.assignedBy;
                  
                  const newMessage = {
                    id: `msg-${Date.now()}`,
                    text: responseText,
                    responder: responderName,
                    createdAt: getTodayShamsi() + ' ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                    attachment: attachment || null
                  };
                  
                  const newMessages = [...(a.referral.messages || [])];
                  if (a.referral.response) {
                    // Migrate old response to messages if it's not there yet
                    if (newMessages.length === 0) {
                       newMessages.push(a.referral.response);
                    }
                  }
                  newMessages.push(newMessage);

                  return {
                    ...a,
                    referral: {
                       ...a.referral,
                       status: markAsDone ? 'انجام شده' as const : (forwardTo ? 'در انتظار اقدام' as const : a.referral.status),
                       assignedTo: forwardTo ? forwardTo : a.referral.assignedTo,
                       assignedBy: forwardTo ? responderName : a.referral.assignedBy,
                       response: markAsDone ? newMessage : a.referral.response, // keep response for backward compatibility
                       messages: newMessages
                    }
                  };
                }
                return a;
              })
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });


    },

    toggleReferralStatus: (categoryGroupId: string, activityId: string) => {
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
                       status: a.referral.status === 'در انتظار اقدام' ? 'انجام شده' as const : 'در انتظار اقدام' as const
                    }
                  };
                }
                return a;
              })
            };
          }
          return g;
        });
        saveToServer('erp_project_category_groups', updated);
        return updated;
      });
    },

    users,
    completionPrompt,
    setCompletionPrompt,
    completeCategoryGroup,
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
    login: async (username: string, password?: string): Promise<boolean> => {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            saveToStorage('erp_current_user', data.user, setCurrentUser);
            setUserRole(data.user.role);
            localStorage.setItem('erp_simulated_role', data.user.role);
            return true;
          }
        }
      } catch (err) {
         console.error('Login error', err);
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem('erp_current_user');
      setCurrentUser(null);
    },
    
    projectCategoryGroups,
    auditLogs,
    logAction,
    
    updateSettings,
    runWorkflows
  };
}
