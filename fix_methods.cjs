const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const missingFunctions = `
  const changeRole = (role: "admin" | "user") => {
    setUserRole(role);
    localStorage.setItem("erp_simulated_role", role);
  };

  const fetchRatesFromAPI = async (silent = false) => {
    // Mock for exchange rates
  };

  const addProject = (project: any) => {
    const newProject = { ...project, id: \`proj-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...projects, newProject];
    saveToStorage("erp_projects", updated, setProjects);
    logAction("CREATE", "پروژه", newProject.id, \`ایجاد پروژه: \${project.title}\`);
  };
  const updateProject = (updatedProject: any) => {
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("UPDATE", "پروژه", updatedProject.id, \`بروزرسانی پروژه: \${updatedProject.title}\`);
  };
  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("DELETE", "پروژه", id, \`حذف پروژه\`);
  };

  const addProforma = (proforma: any) => {
    const newProforma = { ...proforma, id: \`pf-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...proformas, newProforma];
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("CREATE", "پیش‌فاکتور", newProforma.id, \`ایجاد پیش‌فاکتور: \${proforma.number}\`);
  };
  const updateProforma = (updatedProforma: any) => {
    const updated = proformas.map(p => p.id === updatedProforma.id ? updatedProforma : p);
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("UPDATE", "پیش‌فاکتور", updatedProforma.id, \`بروزرسانی پیش‌فاکتور\`);
  };
  const deleteProforma = (id: string) => {
    const updated = proformas.filter(p => p.id !== id);
    saveToStorage("erp_proformas", updated, setProformas);
    logAction("DELETE", "پیش‌فاکتور", id, \`حذف پیش‌فاکتور\`);
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
    const newTask = { ...task, id: \`task-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("CREATE", "وظیفه", newTask.id, \`ایجاد وظیفه: \${task.title}\`);
  };
  const updateTask = (updatedTask: any) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("UPDATE", "وظیفه", updatedTask.id, \`بروزرسانی وظیفه: \${updatedTask.title}\`);
  };
  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("DELETE", "وظیفه", id, \`حذف وظیفه\`);
  };

  const addPackagingDelivery = (pd: any) => {
    const newPd = { ...pd, id: \`pd-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...packagingDeliveries, newPd];
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
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
    const newAss = { ...ass, id: \`ass-\${Date.now()}\`, createdAt: new Date().toISOString() };
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

  const addSupplierInquiry = (si: any) => {
    const newSi = { ...si, id: \`si-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...supplierInquiries, newSi];
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
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

  const addProjectActivity = (projectId: string, activity: any) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const newActivity = { ...activity, id: \`act-\${Date.now()}\`, timestamp: new Date().toISOString() };
    const updatedProj = { ...proj, activities: [...(proj.activities || []), newActivity] };
    updateProject(updatedProj);
  };
  const updateProjectActivity = (projectId: string, updatedActivity: any) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const updatedProj = { ...proj, activities: (proj.activities || []).map(a => a.id === updatedActivity.id ? updatedActivity : a) };
    updateProject(updatedProj);
  };
  const deleteProjectActivity = (projectId: string, activityId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const updatedProj = { ...proj, activities: (proj.activities || []).filter(a => a.id !== activityId) };
    updateProject(updatedProj);
  };

  const addProjectCategoryGroup = (group: any) => {
    const newGroup = { ...group, id: \`catgrp-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...projectCategoryGroups, newGroup];
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };
  const deleteProjectCategoryGroup = (id: string) => {
    const updated = projectCategoryGroups.filter(g => g.id !== id);
    saveToStorage("erp_project_category_groups", updated, setProjectCategoryGroups);
  };
  const completeProjectCategoryGroup = (projectId: string, category: string) => {
    completeCategoryGroup(projectId, category);
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

  const toggleReferralStatus = (projectId: string, referralId: string, status: any) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const updatedProj = { ...proj, referrals: (proj.referrals || []).map(r => r.id === referralId ? { ...r, status } : r) };
    updateProject(updatedProj);
  };
  const respondToReferral = (projectId: string, referralId: string, response: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const updatedProj = { ...proj, referrals: (proj.referrals || []).map(r => r.id === referralId ? { ...r, response, status: 'completed' } : r) };
    updateProject(updatedProj);
  };

`;

const returnStatement = `  return {
    customers,`;

if (content.includes(returnStatement)) {
  content = content.replace(returnStatement, missingFunctions + returnStatement);
  fs.writeFileSync('src/useERPStore.ts', content);
  console.log("Injected missing functions.");
} else {
  console.log("Could not find returnStatement");
}
