with open('src/useERPStore.ts', 'r') as f:
    content = f.read()

funcs = """
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
    autoLogFactActivity(service.projectId, 'خدمات پس از فروش', logText);
    
    return newService;
  };

  const updateAfterSalesService = (updatedService: AfterSalesService) => {
    const updated = afterSalesServices.map(s => s.id === updatedService.id ? updatedService : s);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    const logText = `بروزرسانی خدمات پس از فروش کالای ${updatedService.itemName} - وضعیت: ${updatedService.status}`;
    autoLogFactActivity(updatedService.projectId, 'خدمات پس از فروش', logText);
  };

  const deleteAfterSalesService = (id: string, deleteLogs: boolean = false) => {
    const service = afterSalesServices.find(s => s.id === id);
    const updated = afterSalesServices.filter(s => s.id !== id);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    if (service) {
      if (deleteLogs) {
        setProjectCategoryGroups(prevGroups => {
          const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
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
          import('./idb-keyval').then(idb => {
             idb.set('erp_project_category_groups', updatedGroups).catch(err => console.error('Failed to save to idb:', err));
          });
          return updatedGroups;
        });
      } else {
        const logText = `حذف رکورد خدمات پس از فروش برای کالای ${service.itemName}`;
        autoLogFactActivity(service.projectId, 'خدمات پس از فروش', logText);
      }
    }
  };
"""

content = content.replace('  // --- Settings Customizer ---', funcs + '\n  // --- Settings Customizer ---')

exports = """
    afterSalesServices,
    addAfterSalesService,
    updateAfterSalesService,
    deleteAfterSalesService,
"""
content = content.replace('    addPackagingDelivery,', exports + '\n    addPackagingDelivery,')

with open('src/useERPStore.ts', 'w') as f:
    f.write(content)
