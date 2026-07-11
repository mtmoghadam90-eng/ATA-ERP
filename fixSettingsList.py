with open("src/components/SettingsView.tsx", "r") as f:
    content = f.read()

# 1. Fix modulesList
target_modulesList = """  const modulesList = [
    { id: 'customers', name: 'مشتریان' },
    { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)' },
    { id: 'products', name: 'کالاها و تجهیزات' },
    { id: 'proformas', name: 'پیش‌فاکتورها' },
    { id: 'suppliers', name: 'تأمین‌کنندگان' },
    { id: 'purchaseOrders', name: 'سفارشات خرید خارجی' },
    { id: 'transactions', name: 'دریافت و پرداخت ریالی' },
    { id: 'tasks', name: 'وظایف و پیگیری' },
  ] as const;"""

replacement_modulesList = """  const modulesList = [
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
  ] as const;"""

content = content.replace(target_modulesList, replacement_modulesList)

# 2. Fix moduleResponsibles
target_moduleResponsibles = """              {[
                { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)' },
                { id: 'proformas', name: 'پیش‌فاکتورها' },
                { id: 'purchaseOrders', name: 'سفارشات خرید خارجی' },
                { id: 'transactions', name: 'تراکنش‌های مالی' }
              ].map(mod => ("""

replacement_moduleResponsibles = """              {[
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
              ].map(mod => ("""

content = content.replace(target_moduleResponsibles, replacement_moduleResponsibles)

# 3. Fix ALL_MODULES missing items and sidebarModuleOrder default array
target_sidebarOrder = """                      sidebarModuleOrder: [
                        'dashboard',
                        'customers',
                        'projects',
                        'proformas',
                        'products',
                        'suppliers',
                        'purchaseOrders',
                        'transactions',
                        'rates',
                        'tasks',
                        'referrals',
                        'users',
                        'settings'
                      ]"""

replacement_sidebarOrder = """                      sidebarModuleOrder: [
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
                      ]"""

content = content.replace(target_sidebarOrder, replacement_sidebarOrder)

with open("src/components/SettingsView.tsx", "w") as f:
    f.write(content)

