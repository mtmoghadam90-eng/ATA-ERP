const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const addTaskMatch = `  const addTask = (task: any) => {
    const newTask = { ...task, id: \`task-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("CREATE", "وظیفه", newTask.id, \`ایجاد وظیفه: \${task.title}\`);
  };`;

const newCode = `  const addTask = (task: any) => {
    const newTask = { ...task, id: \`task-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    saveToStorage("erp_tasks", updated, setTasks);
    logAction("CREATE", "وظیفه", newTask.id, \`ایجاد وظیفه: \${task.title}\`);
  };

  const addModuleNotification = (notif: Omit<ModuleNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: ModuleNotification = {
      ...notif,
      id: \`notif-\${Date.now()}-\${Math.random().toString(36).substr(2, 5)}\`,
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
              title: \`وظیفه خودکار: \${rule.name}\`,
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
`;

content = content.replace(addTaskMatch, newCode);

content = content.replace(
  `  const updateProject = (updatedProject: any) => {
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("UPDATE", "پروژه", updatedProject.id, \`بروزرسانی پروژه: \${updatedProject.title}\`);
  };`,
  `  const updateProject = (updatedProject: any) => {
    const oldProject = projects.find(p => p.id === updatedProject.id);
    if (oldProject && oldProject.status !== updatedProject.status) {
      processWorkflowRules('project_status_change', { newStatus: updatedProject.status, ...updatedProject });
    }
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    saveToStorage("erp_projects", updated, setProjects);
    logAction("UPDATE", "پروژه", updatedProject.id, \`بروزرسانی پروژه: \${updatedProject.title}\`);
  };`
);

content = content.replace(
  `  const updateProforma = (updatedProforma: any) => {
    const updated = proformas.map(p => p.id === updatedProforma.id ? updatedProforma : p);
    saveToStorage("erp_proformas", updated, setProformas);
  };`,
  `  const updateProforma = (updatedProforma: any) => {
    const oldProforma = proformas.find(p => p.id === updatedProforma.id);
    const updated = proformas.map(p => p.id === updatedProforma.id ? updatedProforma : p);
    saveToStorage("erp_proformas", updated, setProformas);
    
    // Evaluate Proforma Outcome
    const oldOutcome = oldProforma ? getProformaOutcomeStatus(oldProforma, projects, transactions) : null;
    const newOutcome = getProformaOutcomeStatus(updatedProforma, projects, transactions);
    if (oldOutcome !== newOutcome) {
      processWorkflowRules('proforma_outcome_change', { newOutcome, ...updatedProforma });
    }
  };`
);

content = content.replace(
  `  const updatePurchaseOrderStatus = (id: string, status: string) => {
    const updated = purchaseOrders.map(po => po.id === id ? { ...po, status } : po);
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
  };`,
  `  const updatePurchaseOrderStatus = (id: string, status: string) => {
    const oldPo = purchaseOrders.find(po => po.id === id);
    if (oldPo && oldPo.status !== status) {
       processWorkflowRules('purchase_order_status_change', { newStatus: status, ...oldPo });
    }
    const updated = purchaseOrders.map(po => po.id === id ? { ...po, status } : po);
    saveToStorage("erp_purchase_orders", updated, setPurchaseOrders);
  };`
);

content = content.replace(
  `  const addPackagingDelivery = (pd: any) => {
    const newPd = { ...pd, id: \`pd-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...packagingDeliveries, newPd];
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
  };`,
  `  const addPackagingDelivery = (pd: any) => {
    const newPd = { ...pd, id: \`pd-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...packagingDeliveries, newPd];
    saveToStorage("erp_packaging_deliveries", updated, setPackagingDeliveries);
    processWorkflowRules('packaging_delivery_created', newPd);
  };`
);

content = content.replace(
  `  const updateAfterSalesService = (updatedAss: any) => {
    const updated = afterSalesServices.map(a => a.id === updatedAss.id ? updatedAss : a);
    saveToStorage("erp_after_sales", updated, setAfterSalesServices);
  };`,
  `  const updateAfterSalesService = (updatedAss: any) => {
    const oldAss = afterSalesServices.find(a => a.id === updatedAss.id);
    if (oldAss && oldAss.status !== updatedAss.status) {
       processWorkflowRules('after_sales_service_status_change', { newStatus: updatedAss.status, ...updatedAss });
    }
    const updated = afterSalesServices.map(a => a.id === updatedAss.id ? updatedAss : a);
    saveToStorage("erp_after_sales", updated, setAfterSalesServices);
  };`
);

fs.writeFileSync('src/useERPStore.ts', content);
