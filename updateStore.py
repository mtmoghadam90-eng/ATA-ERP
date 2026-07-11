import re

with open('src/useERPStore.ts', 'r') as f:
    content = f.read()

# 1. Replace import of idb-keyval
content = content.replace("import { get as idbGet, set as idbSet } from 'idb-keyval';", "")

# 2. Add saveToServer helper
helper = """
const saveToServer = (key: string, data: any) => {
  fetch(`/api/data/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(err => console.error(`Error saving to server for key: ${key}`, err));
};
"""
# Insert before export function useERPStore
content = content.replace("export function useERPStore() {", helper + "\nexport function useERPStore() {")

# 3. Replace saveToStorage
old_save_to_storage = """  const saveToStorage = (key: string, data: any, stateSetter: Function) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      stateSetter(data);
    } catch (error) {
      console.error(`Error saving to localStorage for key: ${key}`, error);
      alert(
        'خطا در ذخیره‌سازی محلی داده‌ها!\\n\\n' +
        'احتمالاً حجم داده‌ها (مانند فایل‌های تصویر بارگذاری شده برای لوگو، مهر یا امضا) بیش از حد مجاز است.\\n' +
        'لطفاً از فایل‌های تصویری با حجم کمتر استفاده نمایید یا حجم تصاویر جاری را کاهش دهید.'
      );
    }
  };"""

new_save_to_storage = """  const saveToStorage = (key: string, data: any, stateSetter: Function) => {
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
  };"""

content = content.replace(old_save_to_storage, new_save_to_storage)

# 4. Replace idbSet calls with saveToServer
content = re.sub(r"idbSet\('([^']+)', ([^)]+)\)\.catch\([^)]+\)", r"saveToServer('\1', \2)", content)
content = re.sub(r"idbSet\('([^']+)', ([^)]+)\)", r"saveToServer('\1', \2)", content)
content = content.replace("import('idb-keyval').then(idb => idb.set('erp_project_category_groups', updatedGroups).catch(err => console.error('Failed to save to idb:', err)));", "saveToServer('erp_project_category_groups', updatedGroups);")

# 5. Modify the initialization useEffect to fetch from server
# Let's find the useEffect block
old_init_regex = r"\/\/ Initialize store from localStorage\n\s*useEffect\(\(\) => \{[\s\S]*?idbGet\('erp_project_category_groups'\)[\s\S]*?\}\, \[\]\)\;"

new_init = """  // Initialize store from server
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
          fetchKey('erp_tasks', setTasks, []),
          fetchKey('erp_settings', setSettings, null),
          fetchKey('erp_project_category_groups', setProjectCategoryGroups, []),
          fetchKey('erp_supplier_inquiries', setSupplierInquiries, []),
          fetchKey('erp_packaging_deliveries', setPackagingDeliveries, []),
          fetchKey('erp_after_sales_services', setAfterSalesServices, []),
          fetchKey('erp_users', setUsers, []),
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
  }, []);"""

content = re.sub(old_init_regex, new_init, content)

# 6. Change login function
old_login = """    login: (username: string, password?: string): boolean => {
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
    },"""

new_login = """    login: async (username: string, password?: string): Promise<boolean> => {
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
    },"""

content = content.replace(old_login, new_login)

with open('src/useERPStore.ts', 'w') as f:
    f.write(content)
