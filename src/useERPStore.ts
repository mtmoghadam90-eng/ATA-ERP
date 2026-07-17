import { useState, useEffect } from "react";
import {
  Customer,
  Product,
  ProductFeature,
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
  PackingItem,
  DeliveryChecklistItem,
  PackagingDelivery,
  AfterSalesService,
  AuditLog,
  WorkflowRule,
  SupplierInquiry,
  SupplierInquiryItem,
  InquiryStep,
} from "./types";
import { compressLZW, decompressLZW } from "./utils/compress";

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
  DEFAULT_SETTINGS,
} from "./seedData";
import {
  toShamsiStr,
  getTodayShamsi,
  gregorianToJalali,
  addDaysToShamsi,
  addWorkingDaysToShamsi,
} from "./dateUtils";
import { formatERPNumber } from "./numUtils";

export const getProformaOutcomeStatus = (
  pf: Proforma,
):
  | "پیش‌نویس"
  | "ارسال شده"
  | "تأیید شده (برنده)"
  | "لغو شده"
  | "باخته"
  | "نیمه برنده"
  | "جاری" => {
  if (pf.isCancelled || pf.status === "لغو شده") return "لغو شده";

  const items = pf.items || [];
  if (items.length === 0) {
    if (
      pf.status === "تأیید شده (برنده)" ||
      pf.status === "باخته" ||
      pf.status === "نیمه برنده"
    ) {
      return pf.status;
    }
    return pf.status === "پیش‌نویس" ? "پیش‌نویس" : "جاری";
  }

  const wonCount = items.filter((i) => i.status === "برنده").length;
  const lostCount = items.filter((i) => i.status === "بازنده").length;

  if (wonCount === items.length) return "تأیید شده (برنده)";
  if (lostCount === items.length) return "باخته";
  if (wonCount > 0) return "نیمه برنده";

  if (
    pf.status === "تأیید شده (برنده)" ||
    pf.status === "باخته" ||
    pf.status === "نیمه برنده"
  ) {
    return pf.status;
  }

  if (pf.status === "پیش‌نویس") return "پیش‌نویس";
  return "جاری";
};

export const getWonItemsOfProforma = (pf: Proforma, includeOrder = false) => {
  const outcome = getProformaOutcomeStatus(pf);
  if (outcome !== "تأیید شده (برنده)" && outcome !== "نیمه برنده") return [];
  let wonItems = [];
  const hasExplicitWon = pf.items?.some((item) => item.status === "برنده");
  if (hasExplicitWon) {
    wonItems = pf.items.filter((item) => item.status === "برنده");
  } else {
    wonItems = pf.items?.filter((item) => item.status !== "بازنده") || [];
  }
  if (includeOrder) {
    return wonItems;
  }
  return wonItems.filter((item) => item.supplyMethod !== "ORDER");
};

export const SEED_PROJECT_CATEGORY_GROUPS: ProjectCategoryGroup[] = [];

export const SEED_USERS: User[] = [
  {
    id: "user-1",
    username: "mohammad",
    password: "123",
    fullName: "محمد توکل مقدم",
    role: "admin",
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
      packagingDelivery: true,
    },
  },
  {
    id: "user-2",
    username: "antony",
    password: "123",
    fullName: "آنتونی فیرو",
    role: "user",
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
      packagingDelivery: true,
    },
  },
  {
    id: "user-3",
    username: "hosseini",
    password: "123",
    fullName: "مهندس حسینی",
    role: "user",
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
      packagingDelivery: true,
    },
  },
];

export interface CompletionPrompt {
  projectId: string;
  categoryName: string;
  message: string;
}

const saveToServer = (key: string, data: any) => {
  fetch(`/api/data/${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) =>
    console.error(`Error saving to server for key: ${key}`, err),
  );
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
  const [inventoryTransactions, setInventoryTransactions] = useState<
    InventoryTransaction[]
  >([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [packagingDeliveries, setPackagingDeliveries] = useState<
    PackagingDelivery[]
  >([]);
  const [afterSalesServices, setAfterSalesServices] = useState<
    AfterSalesService[]
  >([]);
  const [supplierInquiries, setSupplierInquiries] = useState<SupplierInquiry[]>(
    [],
  );
  const [moduleNotifications, setModuleNotifications] = useState<
    ModuleNotification[]
  >([]);
  const [projectCategoryGroups, setProjectCategoryGroups] = useState<
    ProjectCategoryGroup[]
  >([]);
  const [readItems, setReadItems] = useState<string[]>([]);
  const [settings, setSettings] = useState<ERPSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Function to log actions with LZW compressed state changes
  const logAction = (
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT",
    module: string,
    entityId: string,
    description: string,
    before?: any,
    after?: any,
  ) => {
    const nowJalali =
      getTodayShamsi() +
      " " +
      new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    const beforeState = before
      ? compressLZW(JSON.stringify(before))
      : undefined;
    const afterState = after ? compressLZW(JSON.stringify(after)) : undefined;

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: nowJalali,
      userId: currentUser?.id || "system",
      userFullName: currentUser?.fullName || "کاربر سیستم",
      action,
      module,
      entityId,
      description,
      beforeState,
      afterState,
    };

    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      const truncated = updated.slice(0, 1000);
      saveToServer("erp_audit_logs", truncated);
      return truncated;
    });
  };

  const [completionPrompt, setCompletionPrompt] = useState<{
    projectId: string;
    categoryName: string;
    message: string;
  } | null>(null);

  // completeCategoryGroup is defined below to prevent TDZ with updateProject


  useEffect(() => {
    if (currentUser) {
      try {
        const storedReadNotifs = localStorage.getItem(
          `read_notifications_${currentUser.id}`,
        );
        if (storedReadNotifs) {
          setReadItems(JSON.parse(storedReadNotifs));
        } else {
          setReadItems([]);
        }
      } catch (e) {
        console.error(
          "Failed to parse read notifications from localStorage",
          e,
        );
        setReadItems([]);
      }
    } else {
      setReadItems([]);
    }
  }, [currentUser]);

  // Simulated User Role state ('admin' = Manager/Administrator, 'user' = Standard Employee/Expert)
  const [userRole, setUserRole] = useState<"admin" | "user">(() => {
    try {
      const saved = localStorage.getItem("erp_simulated_role");
      return saved === "user" ? "user" : "admin";
    } catch (e) {
      return "admin";
    }
  });

  const changeRole = (role: "admin" | "user") => {
    setUserRole(role);
    try {
      localStorage.setItem("erp_simulated_role", role);
    } catch (e) {}
  };

  // Initialize store from server
  useEffect(() => {
    async function loadData() {
      try {
        let batchLoaded = false;
        try {
          const res = await fetch("/api/init-data");
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === "object") {
              if (data.erp_customers !== null)
                setCustomers(data.erp_customers || []);
              if (data.erp_products !== null)
                setProducts(data.erp_products || []);
              if (data.erp_suppliers !== null)
                setSuppliers(data.erp_suppliers || []);
              if (data.erp_exchange_rates !== null)
                setExchangeRates(data.erp_exchange_rates || []);
              if (data.erp_projects !== null)
                setProjects(data.erp_projects || []);
              if (data.erp_proformas !== null)
                setProformas(data.erp_proformas || []);
              if (data.erp_purchase_orders !== null)
                setPurchaseOrders(data.erp_purchase_orders || []);
              if (data.erp_transactions !== null)
                setTransactions(data.erp_transactions || []);
              if (data.erp_inventory_transactions !== null)
                setInventoryTransactions(data.erp_inventory_transactions || []);
              if (data.erp_tasks !== null) setTasks(data.erp_tasks || []);
              if (data.erp_settings !== null)
                setSettings(data.erp_settings || DEFAULT_SETTINGS);
              if (data.erp_project_category_groups !== null)
                setProjectCategoryGroups(
                  data.erp_project_category_groups || [],
                );
              if (data.erp_packaging_deliveries !== null)
                setPackagingDeliveries(data.erp_packaging_deliveries || []);
              if (data.erp_after_sales_services !== null)
                setAfterSalesServices(data.erp_after_sales_services || []);
              if (data.erp_supplier_inquiries !== null)
                setSupplierInquiries(data.erp_supplier_inquiries || []);
              if (data.erp_users !== null) setUsers(data.erp_users || []);
              if (data.erp_audit_logs !== null)
                setAuditLogs(data.erp_audit_logs || []);
              batchLoaded = true;
            }
          }
        } catch (batchErr) {
          console.warn(
            "Failed to batch fetch initial data, falling back to sequential/individual requests...",
            batchErr,
          );
        }

        if (!batchLoaded) {
          const fetchKey = async (
            key: string,
            setter: Function,
            fallback: any,
          ) => {
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
            fetchKey("erp_customers", setCustomers, []),
            fetchKey("erp_products", setProducts, []),
            fetchKey("erp_suppliers", setSuppliers, []),
            fetchKey("erp_exchange_rates", setExchangeRates, []),
            fetchKey("erp_projects", setProjects, []),
            fetchKey("erp_proformas", setProformas, []),
            fetchKey("erp_purchase_orders", setPurchaseOrders, []),
            fetchKey("erp_transactions", setTransactions, []),
            fetchKey(
              "erp_inventory_transactions",
              setInventoryTransactions,
              [],
            ),
            fetchKey("erp_tasks", setTasks, []),
            fetchKey("erp_settings", setSettings, DEFAULT_SETTINGS),
            fetchKey(
              "erp_project_category_groups",
              setProjectCategoryGroups,
              [],
            ),
            fetchKey("erp_packaging_deliveries", setPackagingDeliveries, []),
            fetchKey("erp_after_sales_services", setAfterSalesServices, []),
            fetchKey("erp_supplier_inquiries", setSupplierInquiries, []),
            fetchKey("erp_users", setUsers, []),
            fetchKey("erp_audit_logs", setAuditLogs, []),
          ]);
        }

        const storedCurrentUser = localStorage.getItem("erp_current_user");
        if (storedCurrentUser) {
          try {
            const u = JSON.parse(storedCurrentUser);
            setCurrentUser(u);
            if (u && u.role) {
              setUserRole(u.role);
            }
          } catch (e) {}
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
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error("API response not ok");
      const data = await response.json();
      if (data && data.success && data.rates) {
        setExchangeRates((currentRates) => {
          const updated = currentRates.map((r) => {
            const val = data.rates[r.currency];
            if (val) {
              return {
                ...r,
                rateToRIYAL: val,
                lastUpdated: new Date().toISOString(),
              };
            }
            return r;
          });
          saveToServer("erp_exchange_rates", updated);
          return updated;
        });
        console.log("Exchange rates updated from tgju.com successfully!");

        if (
          data.hasErrors ||
          (data.failedCurrencies && data.failedCurrencies.length > 0)
        ) {
          if (
            silent &&
            (currentUser?.role === "admin" || currentUser?.isSystemAdmin)
          ) {
            alert(
              "در بروزرسانی خودکار نرخ برخی ارزها خطایی رخ داد. لطفا بررسی کنید یا مقادیر را دستی ثبت کنید.",
            );
          }
          return false; // Return false if there were some errors so manual click shows failure alert
        }

        return true;
      }
    } catch (err) {
      console.warn("Failed to auto-fetch exchange rates from tgju:", err);
      if (
        silent &&
        (currentUser?.role === "admin" || currentUser?.isSystemAdmin)
      ) {
        alert(
          "خطا در ارتباط با سرور برای بروزرسانی نرخ ارز. لطفا قیمت را دستی ثبت کنید.",
        );
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
      if (key === "erp_current_user") {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        saveToServer(key, data);
      }
    } catch (error) {
      console.error(`Error saving storage for key: ${key}`, error);
    }
  };

  // --- Customers CRUD ---
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newId = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newCustomer: Customer = { createdAt: new Date().toISOString(),
      ...customer,
      id: newId,
      
    };
    setCustomers((prev) => {
      let updated = prev.map((c) => {
        if (newCustomer.linkedCustomerIds?.includes(c.id)) {
          const currentLinks = c.linkedCustomerIds || [];
          if (!currentLinks.includes(newId)) {
            return {
              ...c,
              linkedCustomerIds: [...currentLinks, newId],
            };
          }
        }
        return c;
      });
      updated = [newCustomer, ...updated];
      saveToServer("erp_customers", updated);
      logAction(
        "CREATE",
        "مشتریان",
        newCustomer.id,
        `ایجاد مشتری جدید: ${newCustomer.companyName || `${newCustomer.firstName || ""} ${newCustomer.lastName || ""}`.trim()}`,
        undefined,
        newCustomer,
      );
      return updated;
    });
    return newCustomer;
  };

  const updateCustomer = (updatedCust: Customer) => {
    setCustomers((prev) => {
      const before = prev.find((c) => c.id === updatedCust.id);
      const updated = prev.map((c) =>
        c.id === updatedCust.id ? updatedCust : c,
      );
      saveToServer("erp_customers", updated);
      logAction(
        "UPDATE",
        "مشتریان",
        updatedCust.id,
        `ویرایش اطلاعات مشتری: ${updatedCust.companyName || `${updatedCust.firstName || ""} ${updatedCust.lastName || ""}`.trim()}`,
        before,
        updatedCust,
      );
      return updated;
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => {
      const before = prev.find((c) => c.id === id);
      const updated = prev.filter((c) => c.id !== id);
      saveToServer("erp_customers", updated);
      if (before) {
        logAction(
          "DELETE",
          "مشتریان",
          id,
          `حذف مشتری: ${before.companyName || `${before.firstName || ""} ${before.lastName || ""}`.trim()}`,
          before,
          undefined,
        );
      }
      return updated;
    });
  };

  const batchUpdateCustomers = (updatedList: Customer[]) => {
    saveToStorage("erp_customers", updatedList, setCustomers);
  };

  // --- Products & Stock CRUD ---
  const addProduct = (
    product: Omit<Product, "id" | "stockLevel"> & {
      stockLevel?: number;
      transactionDate?: string;
    },
  ) => {
    let finalCode = product.code;
    const isAutoGenerated = !finalCode || finalCode.startsWith("EQ-");
    if (isAutoGenerated) {
      const seqNum = products.length + 1;
      finalCode = formatERPNumber(
        settings.documentFormats.productFormat || "EQ-{RAND:5}",
        {
          seq: seqNum,
          category: product.category,
        },
      );
    }
    const newProduct: Product = {
      ...product,
      code: finalCode,
      id: `prod-${Date.now()}`,
      stockLevel: product.stockLevel || 0,
    };

    // Auto-generate SKUs for variants if missing
    if (newProduct.hasVariants && newProduct.variants) {
      newProduct.variants = newProduct.variants.map((v, i) => ({
        ...v,
        sku: v.sku || `${finalCode}-${i + 1}`,
        id: v.id || `var-${Date.now()}-${i}`,
      }));
    }

    const updated = [newProduct, ...products];
    saveToStorage("erp_products", updated, setProducts);

    // Add initial stock transactions if any
    if (!newProduct.hasVariants && newProduct.stockLevel > 0) {
      const initTx: InventoryTransaction = {
        id: `inv-tr-${Date.now()}`,
        productId: newProduct.id,
        date: product.transactionDate || new Date().toISOString(),
        type: "IN",
        quantity: newProduct.stockLevel,
        referenceType: "MANUAL",
        notes: "موجودی اولیه",
      };
      saveToStorage(
        "erp_inventory_transactions",
        [initTx, ...inventoryTransactions],
        setInventoryTransactions,
      );
    } else if (newProduct.hasVariants && newProduct.variants) {
      const initTxs: InventoryTransaction[] = [];
      newProduct.variants.forEach((v, i) => {
        if (v.stockLevel > 0) {
          initTxs.push({
            id: `inv-tr-${Date.now()}-${i}`,
            productId: newProduct.id,
            variantId: v.id,
            date: product.transactionDate || new Date().toISOString(),
            type: "IN",
            quantity: v.stockLevel,
            referenceType: "MANUAL",
            notes: "موجودی اولیه SKU",
          });
        }
      });
      if (initTxs.length > 0) {
        saveToStorage(
          "erp_inventory_transactions",
          [...initTxs, ...inventoryTransactions],
          setInventoryTransactions,
        );
      }
    }

    logAction(
      "CREATE",
      "کالاها",
      newProduct.id,
      `ایجاد کالای جدید: ${newProduct.name} (کد: ${newProduct.code})`,
      undefined,
      newProduct,
    );
    return newProduct;
  };

  const updateProduct = (updatedProd: Product) => {
    const before = products.find((p) => p.id === updatedProd.id);

    // Auto-generate SKUs for variants if missing
    if (updatedProd.hasVariants && updatedProd.variants) {
      updatedProd.variants = updatedProd.variants.map((v, i) => ({
        ...v,
        sku: v.sku || `${updatedProd.code}-${i + 1}`,
        id: v.id || `var-${Date.now()}-${i}`,
      }));
    }

    const updated = products.map((p) =>
      p.id === updatedProd.id ? updatedProd : p,
    );
    saveToStorage("erp_products", updated, setProducts);
    logAction(
      "UPDATE",
      "کالاها",
      updatedProd.id,
      `ویرایش اطلاعات کالا: ${updatedProd.name} (کد: ${updatedProd.code})`,
      before,
      updatedProd,
    );
  };

  const deleteProduct = (id: string) => {
    const before = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveToStorage("erp_products", updated, setProducts);
    if (before) {
      logAction(
        "DELETE",
        "کالاها",
        id,
        `حذف کالا: ${before.name} (کد: ${before.code})`,
        before,
        undefined,
      );
    }
  };

  const batchImportProducts = (items: any[]) => {
    let successCount = 0;
    let createCount = 0;
    const newTransactions: InventoryTransaction[] = [];
    const nowStr = new Date().toISOString();

    setProducts((prev) => {
      let currentProducts = [...prev];

      items.forEach((item, index) => {
        const code = item.code;
        const name = item.name;
        const displayName = item.displayName || item.name;
        const category = item.category || "بدون دسته‌بندی";
        const brand = item.brand || "";
        const supplyType =
          item.supplyType === "INVENTORY" ? "INVENTORY" : "ORDER";
        const amt = Number(item.amount) || Number(item.amt) || 0;
        const type = item.type;
        const dateVal = item.date || item.dateVal;
        const notes = item.notes || "";
        const priceForeign = item.priceForeign;
        const currencyForeign = item.currencyForeign;
        const priceRIYAL = item.priceRIYAL;

        const parseFeatures = (raw?: string) => {
          if (!raw || typeof raw !== "string") return [];
          const parsedFeatures: ProductFeature[] = [];
          const parts = raw.split("|");
          parts.forEach((part, fIdx) => {
            const [fName, fOptsRaw] = part.split(":");
            if (fName && fOptsRaw) {
              const options = fOptsRaw
                .split(/[,،]/)
                .map((o) => o.trim())
                .filter(Boolean);
              if (options.length > 0) {
                parsedFeatures.push({
                  id: `feat-${Date.now()}-${fIdx}-${Math.random().toString(36).substr(2, 5)}`,
                  name: fName.trim(),
                  options: options.map((o, oIdx) => ({
                    id: `opt-${Date.now()}-${oIdx}-${Math.random().toString(36).substr(2, 5)}`,
                    value: o,
                  })),
                });
              }
            }
          });
          return parsedFeatures;
        };
        const features = parseFeatures(item.featuresRaw);

        if (!code && name && category) {
          const seqNum = currentProducts.length + 1;
          const finalCode = formatERPNumber(
            settings.documentFormats.productFormat || "EQ-{RAND:5}",
            {
              seq: seqNum,
              category: category,
            },
          );
          const initialStock =
            supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
            
          let hasVariants = features.length > 0;
          let variants = [];
          if (hasVariants) {
            const getCombinations = (featuresArr) => {
              if (featuresArr.length === 0) return [{}];
              const current = featuresArr[0];
              const rest = getCombinations(featuresArr.slice(1));
              const combos = [];
              if (current.options.length === 0) return rest;
              for (const opt of current.options) {
                for (const r of rest) {
                  combos.push({ ...r, [current.name]: opt.value });
                }
              }
              return combos;
            };
            const combinations = getCombinations(features);
            const pCode = finalCode;
            variants = combinations.map((combo, i) => {
              const skuParts = [pCode];
              Object.entries(combo).forEach(([fName, fVal]) => {
                const feat = features.find(f => f.name === fName);
                if (feat) {
                  const optIndex = feat.options.findIndex(o => o.value === fVal);
                  if (optIndex !== -1) {
                    const prefix = feat.code ? feat.code : '';
                    skuParts.push(`${prefix}${optIndex + 1}`);
                  }
                }
              });
              return {
                id: `var-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                sku: skuParts.join('-'),
                attributes: combo,
                stockLevel: 0,
                minStockLevel: 0,
                priceForeign: priceForeign !== undefined ? Number(priceForeign) : undefined,
                currencyForeign: currencyForeign || undefined,
                priceRIYAL: priceRIYAL !== undefined ? Number(priceRIYAL) : undefined
              };
            });
          }
          
          const newProduct = {
            id: `prod-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
            code: finalCode,
            name: name,
            displayName: name,
            category: category,
            supplyType: supplyType,
            description: notes,
            images: [],
            brand: brand,
            modelNumber: "N/A",
            unit: "عدد",
            basePriceRIYAL: priceRIYAL !== undefined ? Number(priceRIYAL) : 0,
            minStockLevel: 0,
            stockLevel: hasVariants ? 0 : initialStock,
            customValues: {},
            features: features,
            hasVariants: hasVariants,
            variants: variants
          };
          currentProducts = [newProduct, ...currentProducts];
          createCount++;

          if (initialStock > 0) {
            newTransactions.push({
              id: `inv-tr-${Date.now()}-${index}-init`,
              productId: newProduct.id,
              date: dateVal || nowStr,
              type: "IN",
              quantity: initialStock,
              referenceType: "MANUAL",
              notes: "موجودی اولیه (واردات گروهی)",
            });
          }

          logAction(
            "CREATE",
            "کالاها",
            newProduct.id,
            `ایجاد کالای جدید (واردات گروهی): ${newProduct.name} (کد: ${newProduct.code})`,
            undefined,
            newProduct,
          );
        } else if (code) {
          let prodIndex = currentProducts.findIndex((p) => p.code === code);
          let variantId;
          
          if (prodIndex === -1) {
            // Check if code matches a variant SKU
            prodIndex = currentProducts.findIndex(p => p.hasVariants && p.variants && p.variants.some(v => v.sku === code));
            if (prodIndex >= 0) {
              const v = currentProducts[prodIndex].variants.find(v => v.sku === code);
              if (v) variantId = v.id;
            }
          }

          if (prodIndex >= 0) {
            const product = currentProducts[prodIndex];
            let isUpdated = false;
            let beforeStock = product.stockLevel || 0;
            let afterStock = product.stockLevel || 0;
            let updatedVariants = product.variants ? [...product.variants] : [];
            let updatedProduct = { ...product };

            // 1. Update general fields on product if present in row
            if (name && name !== product.name) {
              updatedProduct.name = name;
              updatedProduct.displayName = name;
              isUpdated = true;
            }
            if (category && category !== product.category) {
              updatedProduct.category = category;
              isUpdated = true;
            }
            if (brand && brand !== product.brand) {
              updatedProduct.brand = brand;
              isUpdated = true;
            }
            if (supplyType && supplyType !== product.supplyType) {
              updatedProduct.supplyType = supplyType;
              isUpdated = true;
            }

            // 2. Update Pricing Fields
            if (variantId && product.hasVariants && updatedVariants.length > 0) {
              const vIdx = updatedVariants.findIndex(v => v.id === variantId);
              if (vIdx !== -1) {
                const origV = updatedVariants[vIdx];
                const newPriceForeign = priceForeign !== undefined ? Number(priceForeign) : origV.priceForeign;
                const newCurrencyForeign = currencyForeign !== undefined ? String(currencyForeign) : origV.currencyForeign;
                const newPriceRIYAL = priceRIYAL !== undefined ? Number(priceRIYAL) : origV.priceRIYAL;

                if (
                  newPriceForeign !== origV.priceForeign ||
                  newCurrencyForeign !== origV.currencyForeign ||
                  newPriceRIYAL !== origV.priceRIYAL
                ) {
                  updatedVariants[vIdx] = {
                    ...origV,
                    priceForeign: newPriceForeign,
                    currencyForeign: newCurrencyForeign,
                    priceRIYAL: newPriceRIYAL
                  };
                  isUpdated = true;
                }
              }
            } else {
              // Non-variant or updating main product pricing
              if (priceRIYAL !== undefined && Number(priceRIYAL) !== product.basePriceRIYAL) {
                updatedProduct.basePriceRIYAL = Number(priceRIYAL);
                isUpdated = true;
              }
            }

            // 3. Handle stock adjustments
            const hasStockChange =
              supplyType === "INVENTORY" &&
              !isNaN(amt) &&
              amt > 0 &&
              (type === "IN" || type === "OUT");

            if (hasStockChange) {
              if (product.hasVariants && !variantId) {
                // skip stock update for parent product
              } else {
                const adjustedAmt = type === "IN" ? amt : -amt;
                if (variantId && product.hasVariants && updatedVariants.length > 0) {
                  const vIdx = updatedVariants.findIndex(v => v.id === variantId);
                  if (vIdx !== -1) {
                    const beforeVStock = updatedVariants[vIdx].stockLevel || 0;
                    const afterVStock = Math.max(0, beforeVStock + adjustedAmt);
                    updatedVariants[vIdx] = { ...updatedVariants[vIdx], stockLevel: afterVStock };
                    const newTotalStock = updatedVariants.reduce((sum, v) => sum + (v.stockLevel || 0), 0);
                    updatedProduct.variants = updatedVariants;
                    updatedProduct.stockLevel = newTotalStock;
                    isUpdated = true;
                  }
                } else {
                  beforeStock = product.stockLevel || 0;
                  afterStock = Math.max(0, beforeStock + adjustedAmt);
                  updatedProduct.stockLevel = afterStock;
                  isUpdated = true;
                }

                newTransactions.push({
                  id: `inv-tr-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
                  productId: product.id,
                  variantId: variantId,
                  date: dateVal || nowStr,
                  type: adjustedAmt > 0 ? "IN" : "OUT",
                  quantity: amt,
                  referenceType: "MANUAL",
                  notes,
                });
              }
            }

            if (isUpdated || hasStockChange) {
              if (updatedVariants.length > 0) {
                updatedProduct.variants = updatedVariants;
              }
              currentProducts[prodIndex] = updatedProduct;
              successCount++;

              logAction(
                "UPDATE",
                "کالاها",
                product.id,
                `بروزرسانی کالا (واردات گروهی): ${product.name} (کد: ${variantId ? code : product.code})`,
                product,
                updatedProduct,
              );
            }
          }
        } else if (name && category) {
          const initialStock =
            supplyType === "INVENTORY" && !isNaN(amt) && amt > 0 ? amt : 0;
          const newProduct: Product = {
            id: `prod-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
            code: code,
            name: name,
            displayName: name,
            category: category,
            supplyType: supplyType,
            description: notes,
                                      images: [],
            brand: brand,
            modelNumber: "N/A",
            unit: "عدد",
            basePriceRIYAL: priceRIYAL !== undefined ? Number(priceRIYAL) : 0,
            minStockLevel: 0,
            stockLevel: initialStock,
            customValues: {},
            features: features,
          };
          currentProducts = [newProduct, ...currentProducts];
          createCount++;

          if (initialStock > 0) {
            newTransactions.push({
              id: `inv-tr-${Date.now()}-${index}-init`,
              productId: newProduct.id,
              date: dateVal || nowStr,
              type: "IN",
              quantity: initialStock,
              referenceType: "MANUAL",
              notes: "موجودی اولیه (واردات گروهی)",
            });
          }

          logAction(
            "CREATE",
            "کالاها",
            newProduct.id,
            `ایجاد کالای جدید (واردات گروهی): ${newProduct.name} (کد: ${newProduct.code})`,
            undefined,
            newProduct,
          );
        }
      });

      saveToServer("erp_products", currentProducts);
      return currentProducts;
    });

    if (newTransactions.length > 0) {
      setInventoryTransactions((prev) => {
        const updatedTr = [...newTransactions, ...prev];
        saveToServer("erp_inventory_transactions", updatedTr);
        return updatedTr;
      });
    }

    return { successCount, createCount };
  };

  const adjustProductStock = (
    id: string,
    amount: number,
    variantId?: string,
    referenceId?: string,
    referenceType?: InventoryTransaction["referenceType"],
    notes?: string,
    transactionDate?: string,
  ) => {
    const before = products.find((p) => p.id === id);
    if (!before) return;

    // Add transaction record
    if (amount !== 0) {
      const transaction: InventoryTransaction = {
        id: `inv-tr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: id,
        variantId,
        date: transactionDate || new Date().toISOString(),
        type: amount > 0 ? "IN" : "OUT",
        quantity: Math.abs(amount),
        referenceId,
        referenceType,
        notes,
      };
      setInventoryTransactions((prev) => {
        const updatedTr = [transaction, ...prev];
        saveToServer("erp_inventory_transactions", updatedTr);
        return updatedTr;
      });
    }

    const updated = products.map((p) => {
      if (p.id === id) {
        if (variantId && p.hasVariants && p.variants) {
          const vIdx = p.variants.findIndex((v) => v.id === variantId);
          if (vIdx !== -1) {
            const newVariants = [...p.variants];
            newVariants[vIdx] = {
              ...newVariants[vIdx],
              stockLevel: (newVariants[vIdx].stockLevel || 0) + amount,
            };
            
            // Also update total stockLevel
            const newTotalStock = newVariants.reduce((sum, v) => sum + (v.stockLevel || 0), 0);
            
            return { ...p, variants: newVariants, stockLevel: newTotalStock };
          }
        }
        return { ...p, stockLevel: (p.stockLevel || 0) + amount };
      }
      return p;
    });

    const after = updated.find((p) => p.id === id);
    saveToStorage("erp_products", updated, setProducts);
    if (before && after) {
      logAction(
        "UPDATE",
        "کالاها",
        id,
        `تعدیل موجودی کالا: ${before.name} (کد: ${before.code})`,
        before,
        after,
      );
    }
  };

  // --- Suppliers CRUD ---
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier: Supplier = { createdAt: new Date().toISOString(),
      ...supplier,
      id: `supp-${Date.now()}`,
      
    };
    const updated = [newSupplier, ...suppliers];
    saveToStorage("erp_suppliers", updated, setSuppliers);
    logAction(
      "CREATE",
      "تامین‌کنندگان",
      newSupplier.id,
      `ثبت تامین‌کننده جدید: ${newSupplier.name}`,
      undefined,
      newSupplier,
    );
    return newSupplier;
  };

  const updateSupplier = (updatedSupp: Supplier) => {
    const before = suppliers.find((s) => s.id === updatedSupp.id);
    const updated = suppliers.map((s) =>
      s.id === updatedSupp.id ? updatedSupp : s,
    );
    saveToStorage("erp_suppliers", updated, setSuppliers);
    logAction(
      "UPDATE",
      "تامین‌کنندگان",
      updatedSupp.id,
      `ویرایش اطلاعات تامین‌کننده: ${updatedSupp.name}`,
      before,
      updatedSupp,
    );
  };

  const deleteSupplier = (id: string) => {
    const before = suppliers.find((s) => s.id === id);
    const updated = suppliers.filter((s) => s.id !== id);
    saveToStorage("erp_suppliers", updated, setSuppliers);
    logAction(
      "DELETE",
      "تامین‌کنندگان",
      id,
      `حذف تامین‌کننده: ${before?.name}`,
      before,
      undefined,
    );
  };

  const batchImportSuppliers = (items: any[]) => {
    let successCount = 0;
    setSuppliers((prev) => {
      let currentSuppliers = [...prev];
      items.forEach((item) => {
        if (item.name) {
          const newSupp: Supplier = {
            id: `supp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            createdAt: new Date().toISOString(),
            name: item.name,
            country: item.country || "",
            contactName: item.contactName || "",
            phone: item.phone,
            email: item.email,
            website: item.website,
            paymentTerms: item.paymentTerms,
            status: item.status === "غیرفعال" ? "غیرفعال" : "فعال",
            
            description: item.description,
          };
          currentSuppliers = [newSupp, ...currentSuppliers];
          successCount++;
        }
      });
      saveToStorage("erp_suppliers", currentSuppliers, setSuppliers);
      return currentSuppliers;
    });
    return { successCount, createCount: successCount };
  };

  // --- Transactions ---
  const addTransaction = (t: Omit<Transaction, "id">) => {
    const newTr: Transaction = {
      ...t,
      id: `tr-${Date.now()}`,
      
    };
    const updated = [newTr, ...transactions];
    saveToStorage("erp_transactions", updated, setTransactions);
    return newTr;
  };

  const updateTransaction = (t: Transaction) => {
    const updated = transactions.map((tr) => (tr.id === t.id ? t : tr));
    saveToStorage("erp_transactions", updated, setTransactions);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((tr) => tr.id !== id);
    saveToStorage("erp_transactions", updated, setTransactions);
  };

  // --- Purchase Orders ---
  const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">) => {
    let finalCode = po.poNumber;
    const isAutoGenerated = !finalCode || finalCode.startsWith("PO-");
    if (isAutoGenerated) {
      finalCode = formatERPNumber(
        settings.documentFormats.purchaseOrderFormat || "PO-{YYYY}-{SEQ:4}",
        { seq: purchaseOrders.length + 1 },
      );
    }
    const newPO: PurchaseOrder = {
      ...po,
      poNumber: finalCode,
      id: `po-${Date.now()}`,
      
    };
    const updated = [newPO, ...purchaseOrders];
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
    logAction(
      "CREATE",
      "سفارش خرید",
      newPO.id,
      `ایجاد سفارش خرید جدید: ${newPO.poNumber}`,
      undefined,
      newPO,
    );
    return newPO;
  };

  const updatePurchaseOrder = (updatedPO: PurchaseOrder) => {
    const before = purchaseOrders.find((p) => p.id === updatedPO.id);
    const updated = purchaseOrders.map((p) =>
      p.id === updatedPO.id ? updatedPO : p,
    );
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
    logAction(
      "UPDATE",
      "سفارش خرید",
      updatedPO.id,
      `ویرایش سفارش خرید: ${updatedPO.poNumber}`,
      before,
      updatedPO,
    );
  };

  const deletePurchaseOrder = (id: string) => {
    const before = purchaseOrders.find((p) => p.id === id);
    const updated = purchaseOrders.filter((p) => p.id !== id);
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
    logAction(
      "DELETE",
      "سفارش خرید",
      id,
      `حذف سفارش خرید: ${before?.poNumber}`,
      before,
      undefined,
    );
  };




  const addProject = (project: any): any => {
    let finalCode = project.code;
    const isAutoGenerated = !finalCode || finalCode.startsWith("ATA-");
    if (isAutoGenerated) {
      finalCode = formatERPNumber(
        settings.documentFormats.projectFormat || "ATA-{YYYY}-{SEQ:3}",
        { seq: projects.length + 1 }
      );
    }
    const newProject = { ...project, id: `proj-${Date.now()}`, code: finalCode, createdAt: new Date().toISOString() };
    const updated = [newProject, ...projects];
    saveToStorage("erp_projects", updated, setProjects);
    logAction("CREATE", "پروژه", newProject.id, `ایجاد پروژه: ${project.title}`);
    return newProject;
  };
  const updateProject = (updatedProject: any) => {
    const oldProject = projects.find(p => p.id === updatedProject.id);
    if (oldProject && oldProject.status !== updatedProject.status) {
      processWorkflowRules('project_status_change', { newStatus: updatedProject.status, ...updatedProject });
    }
    
    // Check for newly completed project milestones and run automated milestone rules
    if (oldProject && updatedProject.milestones) {
      const oldCompletedIds = new Set(
        (oldProject.milestones || [])
          .filter((m: any) => m.isCompleted)
          .map((m: any) => m.id)
      );
      
      updatedProject.milestones.forEach((m: any) => {
        if (m.isCompleted && !oldCompletedIds.has(m.id)) {
          // This milestone was just completed! Run the associated milestone rules
          const rules = updatedProject.milestoneRules?.filter((r: any) => r.triggerMilestoneId === m.id) || [];
          rules.forEach((rule: any) => {
            if (rule.actionType === 'create_task') {
              addTask({
                title: rule.taskTitle || `پیگیری نقطه حیاتی: ${m.name}`,
                description: rule.taskDesc || `این کار به صورت خودکار با اتمام نقطه حیاتی "${m.name}" ایجاد شد.`,
                relatedToType: 'پروژه',
                relatedToId: updatedProject.id,
                relatedToName: updatedProject.name,
                priority: rule.priority || 'متوسط',
                dueDate: addDaysToShamsi(getTodayShamsi(), rule.dueDaysOffset || 0),
                assignedTo: rule.assignedTo || 'admin',
                status: 'در حال انجام',
              });
            } else if (rule.actionType === 'send_notification') {
              addModuleNotification({
                module: 'projects',
                title: rule.taskTitle || `رویداد پروژه: اتمام ${m.name}`,
                description: rule.taskDesc || `نقطه حیاتی "${m.name}" در پروژه "${updatedProject.name}" انجام شد.`,
                responsibleName: rule.assignedTo || 'admin',
              });
            }
          });
        }
      });
    }

    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("UPDATE", "پروژه", updatedProject.id, `بروزرسانی پروژه: ${updatedProject.title}`);
  };
  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("DELETE", "پروژه", id, `حذف پروژه`);
  };

  const addProforma = (proforma: any) => {
    const newProforma = { ...proforma, id: `pf-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...proformas, newProforma];
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("CREATE", "پیش‌فاکتور", newProforma.id, `ایجاد پیش‌فاکتور: ${proforma.number}`);
  };
  const updateProforma = (updatedProforma: any) => {
    const updated = proformas.map(p => p.id === updatedProforma.id ? updatedProforma : p);
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("UPDATE", "پیش‌فاکتور", updatedProforma.id, `بروزرسانی پیش‌فاکتور`);
  };
  const deleteProforma = (id: string) => {
    const updated = proformas.filter(p => p.id !== id);
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("DELETE", "پیش‌فاکتور", id, `حذف پیش‌فاکتور`);
  };
  const updateProformaStatus = (id: string, status: any) => {
    const updated = proformas.map(p => p.id === id ? { ...p, status } : p);
    saveToStorage("erp_proformas", updated, setProformas);
  };
  const batchUpdateProjectProformasStatus = (projectId: string, status: any) => {
    const updated = proformas.map(p => p.projectId === projectId ? { ...p, status } : p);
    saveToStorage("erp_proformas", updated, setProformas);
  };

  const addTask = (task: any) => {
    const newTask = { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("CREATE", "وظیفه", newTask.id, `ایجاد وظیفه: ${task.title}`);
  };

  const addModuleNotification = (notif: Omit<ModuleNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: ModuleNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      read: false
    };
    const updated = [newNotif, ...moduleNotifications];
    saveToStorage("erp_module_notifications", updated, setModuleNotifications);
  };

  const processWorkflowRules = (triggerType: string, payload: any) => {
    const activeRules = settings.workflows?.filter(r => r.active && r.triggerType === triggerType) || [];
    for (const rule of activeRules) {
      let match = true;
      for (const cond of rule.conditions) {
        const actualValue = payload[cond.field];
        if (cond.operator === 'equals' && String(actualValue) !== String(cond.value)) match = false;
        if (cond.operator === 'not_equals' && String(actualValue) === String(cond.value)) match = false;
        if (cond.operator === 'greater_than' && Number(actualValue) <= Number(cond.value)) match = false;
        if (cond.operator === 'less_than' && Number(actualValue) >= Number(cond.value)) match = false;
      }
      if (match) {
        for (const action of rule.actions) {
          if (action.actionType === 'create_task') {
            addTask({
              title: `وظیفه خودکار: ${rule.name}`,
              description: action.taskDescription || '',
              dueDate: new Date().toISOString(),
              priority: 'بالا',
              status: 'در انتظار',
              assignedTo: action.taskAssigneeRole || 'admin'
            });
          } else if (action.actionType === 'send_notification') {
            addModuleNotification({
              module: 'سیستم',
              title: rule.name,
              description: action.notificationMessage || '',
              responsibleName: 'سیستم'
            });
          }
        }
      }
    }
  };

  const updateTask = (updatedTask: any) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("UPDATE", "وظیفه", updatedTask.id, `بروزرسانی وظیفه: ${updatedTask.title}`);
  };
  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("DELETE", "وظیفه", id, `حذف وظیفه`);
  };

  const addPackagingDelivery = (pd: any) => {
    const newPd = { ...pd, id: `pd-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...packagingDeliveries, newPd];
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
    processWorkflowRules('packaging_delivery_created', newPd);
  };
  const updatePackagingDelivery = (updatedPd: any) => {
    const updated = packagingDeliveries.map(p => p.id === updatedPd.id ? updatedPd : p);
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
  };
  const deletePackagingDelivery = (id: string) => {
    const updated = packagingDeliveries.filter(p => p.id !== id);
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
  };

  const addAfterSalesService = (ass: any) => {
    const newAss = { ...ass, id: `ass-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...afterSalesServices, newAss];
    saveToStorage("erp_after_sales_services", updated, setAfterSalesServices);
  };
  const updateAfterSalesService = (updatedAss: any) => {
    const updated = afterSalesServices.map(a => a.id === updatedAss.id ? updatedAss : a);
    saveToStorage("erp_after_sales_services", updated, setAfterSalesServices);
  };
  const deleteAfterSalesService = (id: string) => {
    const updated = afterSalesServices.filter(a => a.id !== id);
    saveToStorage("erp_after_sales_services", updated, setAfterSalesServices);
  };

  const addSupplierInquiry = (si: any): any => {
    const newSi = { ...si, id: `si-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...supplierInquiries, newSi];
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
    return newSi;
  };
  const updateSupplierInquiry = (updatedSi: any) => {
    const updated = supplierInquiries.map(s => s.id === updatedSi.id ? updatedSi : s);
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
  };
  const deleteSupplierInquiry = (id: string) => {
    const updated = supplierInquiries.filter(s => s.id !== id);
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
  };

  const updatePurchaseOrderStatus = (id: string, status: any) => {
    const updated = purchaseOrders.map(p => p.id === id ? { ...p, status } : p);
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
  };

  const updateExchangeRate = (rate: any) => {
    const updated = exchangeRates.map(r => r.currency === rate.currency ? rate : r);
    if (!updated.some(r => r.currency === rate.currency)) {
      updated.push(rate);
    }
    saveToStorage("erp_exchange_rates", updated, setExchangeRates);
  };

  const markModuleNotificationAsRead = (id: string) => {
    const updated = moduleNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveToStorage("erp_module_notifications", updated, setModuleNotifications);
  };
  const markAllModuleNotificationsAsRead = () => {
    const updated = moduleNotifications.map(n => ({ ...n, isRead: true }));
    saveToStorage("erp_module_notifications", updated, setModuleNotifications);
  };

  const markItemsAsRead = (ids: string[]) => {
    const newItems = Array.from(new Set([...readItems, ...ids]));
    saveToStorage("erp_read_items", newItems, setReadItems);
  };

  
  
  

  const triggerMilestonesForEvent = (projectId: string, eventType: 'category_start' | 'category_complete', categoryName: string) => {
    const normalize = (str: string) => str ? str.replace(/[\s‌]/g, "").trim() : "";
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMilestones = (project.milestones || []).map(m => {
      const isMatch = m.triggerType === eventType && m.triggerCategoryName && normalize(m.triggerCategoryName) === normalize(categoryName);
      if (isMatch && !m.isCompleted) {
        return {
          ...m,
          isCompleted: true,
          completedAt: getTodayShamsi()
        };
      }
      return m;
    });

    const milestoneChanged = JSON.stringify(project.milestones) !== JSON.stringify(updatedMilestones);
    if (milestoneChanged) {
      updateProject({
        ...project,
        milestones: updatedMilestones
      });
    }
  };

  const completeCategoryGroup = (projectId: string, categoryName: string) => {
    const normalize = (str: string) => str.replace(/[\s‌]/g, "").trim();
    setProjectCategoryGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((g) => {
        if (
          g.projectId === projectId &&
          normalize(g.categoryName) === normalize(categoryName)
        ) {
          return {
            ...g,
            status: "اتمام کار",
            endDate: getTodayShamsi(),
          };
        }
        return g;
      });
      saveToServer("erp_project_category_groups", updatedGroups);
      return updatedGroups;
    });

    // Auto trigger completion milestones
    triggerMilestonesForEvent(projectId, 'category_complete', categoryName);
  };

  const addProjectCategoryGroup = (projectIdOrGroup: any, categoryId?: string, categoryName?: string) => {
    let newGroup: any;
    let pId = "";
    let catName = "";

    if (typeof projectIdOrGroup === 'object' && projectIdOrGroup !== null) {
      newGroup = { ...projectIdOrGroup, id: `catgrp-${Date.now()}`, createdAt: new Date().toISOString() };
      pId = projectIdOrGroup.projectId;
      catName = projectIdOrGroup.categoryName;
    } else {
      newGroup = {
        projectId: projectIdOrGroup,
        categoryId: categoryId,
        categoryName: categoryName,
        status: 'جاری',
        activities: [],
        id: `catgrp-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      pId = projectIdOrGroup;
      catName = categoryName || "";
    }

    const updated = [...projectCategoryGroups, newGroup];
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);

    // Auto trigger start milestones
    if (pId && catName) {
      triggerMilestonesForEvent(pId, 'category_start', catName);
    }

    return { success: true };
  };
  const deleteProjectCategoryGroup = (id: string) => {
    const updated = projectCategoryGroups.filter(g => g.id !== id);
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };
  const completeProjectCategoryGroup = (categoryGroupId: string, createdBy?: string) => {
    let pId = "";
    let catName = "";

    setProjectCategoryGroups(prevGroups => {
      const updatedGroups = prevGroups.map(g => {
        if (g.id === categoryGroupId) {
          pId = g.projectId;
          catName = g.categoryName;
          const newActivity = {
            id: 'act-' + Date.now(),
            createdAt: new Date().toISOString(),
            date: getTodayShamsi(),
            description: 'اتمام کار',
            createdBy: createdBy || 'سیستم',
            type: 'اتمام کار'
          };
          return {
            ...g,
            status: "اتمام کار",
            endDate: getTodayShamsi(),
            activities: [...(g.activities || []), newActivity]
          };
        }
        return g;
      });
      saveToServer("erp_project_category_groups", updatedGroups);
      return updatedGroups;
    });

    if (pId && catName) {
      triggerMilestonesForEvent(pId, 'category_complete', catName);
    }
  };
  const resumeProjectCategoryGroup = (projectId: string, category: string) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.projectId === projectId && g.categoryName === category) {
        return { ...g, status: "pending", completedAt: undefined };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };

  
  


  const addProjectActivity = (categoryGroupId: string, activity: any) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return { ...g, activities: [...g.activities, { ...activity, id: 'act-' + Date.now(), createdAt: new Date().toISOString() }] };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };

  const updateProjectActivity = (categoryGroupId: string, activity: any) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return { ...g, activities: g.activities.map(a => a.id === activity.id ? activity : a) };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };

  const deleteProjectActivity = (categoryGroupId: string, activityId: string) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return { ...g, activities: g.activities.filter(a => a.id !== activityId) };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };

  const toggleReferralStatus = (categoryGroupId: string, activityId: string) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return {
          ...g,
          activities: g.activities.map(a => {
            if (a.id === activityId && a.referral) {
              return {
                ...a,
                referral: {
                  ...a.referral,
                  status: a.referral.status === "انجام شده" ? "در انتظار اقدام" : "انجام شده"
                }
              };
            }
            return a;
          })
        };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };

  const respondToReferral = (
    categoryGroupId: string,
    activityId: string,
    responseText: string,
    responderName: string,
    attachment?: any,
    markAsDone?: boolean,
    forwardTo?: string
  ) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return {
          ...g,
          activities: g.activities.map(a => {
            if (a.id === activityId && a.referral) {
              let updatedReferral = { ...a.referral };
              if (responseText || attachment) {
                const newMessage = {
                  id: 'msg-' + Date.now(),
                  text: responseText,
                  responder: responderName,
                  
                  attachment: attachment || null
                };
                updatedReferral.messages = [...(updatedReferral.messages || []), newMessage];
                updatedReferral.response = newMessage;
              }
              if (markAsDone) {
                updatedReferral.status = "انجام شده";
              }
              if (forwardTo) {
                updatedReferral.assignedTo = forwardTo;
                updatedReferral.status = "در انتظار اقدام";
              }
              return { ...a, referral: updatedReferral };
            }
            return a;
          })
        };
      }
      return g;
    });
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };
  return {
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
    packagingDeliveries,
    afterSalesServices,
    supplierInquiries,
    moduleNotifications,
    projectCategoryGroups,
    readItems,
    settings,
    users,
    currentUser,
    auditLogs,
    isInitialized,
    userRole,
    completionPrompt,
    setCompletionPrompt,
    completeCategoryGroup,
    addCustomer, updateCustomer, deleteCustomer, batchUpdateCustomers,
    addProduct, updateProduct, deleteProduct, batchImportProducts, adjustProductStock,
    addSupplier, updateSupplier, deleteSupplier, batchImportSuppliers,
    addTransaction, updateTransaction, deleteTransaction,
    addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, updatePurchaseOrderStatus,
    addProject, updateProject, deleteProject,
    addProforma, updateProforma, deleteProforma, updateProformaStatus, batchUpdateProjectProformasStatus,
    addProjectActivity, updateProjectActivity, deleteProjectActivity,
    addProjectCategoryGroup, deleteProjectCategoryGroup, completeProjectCategoryGroup, resumeProjectCategoryGroup,
    addTask, updateTask, deleteTask,
    addPackagingDelivery, updatePackagingDelivery, deletePackagingDelivery,
    addAfterSalesService, updateAfterSalesService, deleteAfterSalesService,
    addSupplierInquiry, updateSupplierInquiry, deleteSupplierInquiry,
    markModuleNotificationAsRead, markAllModuleNotificationsAsRead, markItemsAsRead,
    toggleReferralStatus, respondToReferral,
    updateExchangeRate, fetchRatesFromAPI,
    changeRole,


    addUser: (user: Omit<User, "id">) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
      };
      const updated = [...users, newUser];
      saveToStorage("erp_users", updated, setUsers);
      return newUser;
    },
    updateUser: (updatedUser: User) => {
      const updated = users.map((u) =>
        u.id === updatedUser.id ? updatedUser : u,
      );
      saveToStorage("erp_users", updated, setUsers);
      if (currentUser && currentUser.id === updatedUser.id) {
        saveToStorage("erp_current_user", updatedUser, setCurrentUser);
        setUserRole(updatedUser.role);
        localStorage.setItem("erp_simulated_role", updatedUser.role);
      }
    },
    deleteUser: (id: string) => {
      const updated = users.filter((u) => u.id !== id);
      saveToStorage("erp_users", updated, setUsers);
    },
    login: async (
      username: string,
      password?: string,
    ): Promise<{
      success: boolean;
      mustChangePassword?: boolean;
      message?: string;
    }> => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          if (data.mustChangePassword) {
            return { success: true, mustChangePassword: true };
          }
          saveToStorage("erp_current_user", data.user, setCurrentUser);
          setUserRole(data.user.role);
          localStorage.setItem("erp_simulated_role", data.user.role);
          return { success: true, mustChangePassword: false };
        } else {
          return {
            success: false,
            message: data.message || "نام کاربری یا رمز ورود اشتباه است.",
          };
        }
      } catch (err) {
        console.error("Login error", err);
      

  
  
  
    return { success: false, message: "خطا در برقراری ارتباط با سرور." };
      }
    },
    loginWithUser: (user: any) => {
      saveToStorage("erp_current_user", user, setCurrentUser);
      setUserRole(user.role);
      localStorage.setItem("erp_simulated_role", user.role);
    },
    logout: () => {
      localStorage.removeItem("erp_current_user");
      setCurrentUser(null);
    },

    updateSettings: (newSettings: ERPSettings) => {
      saveToStorage("erp_settings", newSettings, setSettings);
      logAction("UPDATE", "سیستم", "تنظیمات نرم‌افزار", "تنظیمات نرم‌افزار بروزرسانی شد.");
    },
  };
}
