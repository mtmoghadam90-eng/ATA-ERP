const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// 1. Remove duplicate changeRole and fetchRatesFromAPI from my injection
const injectionTarget = `  const changeRole = (role: "admin" | "user") => {
    setUserRole(role);
    localStorage.setItem("erp_simulated_role", role);
  };

  const fetchRatesFromAPI = async (silent = false) => {
    // Mock for exchange rates
  };`;
content = content.replace(injectionTarget, '');

// 2. Fix the typing and return for addProject, addSupplierInquiry, toggleReferralStatus
content = content.replace(`  const addProject = (project: any) => {
    const newProject = { ...project, id: \`proj-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...projects, newProject];
    saveToStorage("erp_projects", updated, setProjects);
    logAction("CREATE", "پروژه", newProject.id, \`ایجاد پروژه: \${project.title}\`);
  };`, `  const addProject = (project: any): any => {
    const newProject = { ...project, id: \`proj-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...projects, newProject];
    saveToStorage("erp_projects", updated, setProjects);
    logAction("CREATE", "پروژه", newProject.id, \`ایجاد پروژه: \${project.title}\`);
    return newProject;
  };`);

content = content.replace(`  const addSupplierInquiry = (si: any) => {
    const newSi = { ...si, id: \`si-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...supplierInquiries, newSi];
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
  };`, `  const addSupplierInquiry = (si: any): any => {
    const newSi = { ...si, id: \`si-\${Date.now()}\`, createdAt: new Date().toISOString() };
    const updated = [...supplierInquiries, newSi];
    saveToStorage("erp_supplier_inquiries", updated, setSupplierInquiries);
    return newSi;
  };`);

// 3. Remove updateSettings, runWorkflows from the bottom of return { ... }
// Wait, the duplicate keys are: changeRole, fetchRatesFromAPI, updateSettings, runWorkflows.
// So let's just do a regex to remove trailing properties before the final }
content = content.replace(/    projectCategoryGroups,\n    auditLogs,\n    logAction,\n    updateSettings,\n    runWorkflows,\n  };\n}/, `    projectCategoryGroups,\n    auditLogs,\n    logAction,\n  };\n}`);

content = content.replace(/    updateSettings,\n    runWorkflows,\n  };\n}/, `  };\n}`);

// 4. Fix TS2554, TS2353, TS2339 on lines around 1119-1186
// 1119: saveToStorage("erp_suppliers", currentSuppliers); -> saveToStorage("erp_suppliers", currentSuppliers, setSuppliers);
content = content.replace(`saveToStorage("erp_suppliers", currentSuppliers);`, `saveToStorage("erp_suppliers", currentSuppliers, setSuppliers);`);

// 1130: 'createdAt' does not exist in type 'Transaction'
// 1149, 1159, 1169, 1186: 'orderNumber' does not exist on type 'PurchaseOrder'
// I'll just change Omit<Transaction, "id" | "createdAt"> to Omit<Transaction, "id"> and so on.
content = content.replace(`const addTransaction = (t: Omit<Transaction, "id" | "createdAt">) => {`, `const addTransaction = (t: Omit<Transaction, "id">) => {`);
content = content.replace(`    const newT: Transaction = {
      ...t,
      id: \`tx-\${Date.now()}\`,
      createdAt: new Date().toISOString(),
    };`, `    const newT: Transaction = {
      ...t,
      id: \`tx-\${Date.now()}\`,
    };`);
    
content = content.replace(`const addPurchaseOrder = (po: Omit<PurchaseOrder, "id" | "createdAt">) => {`, `const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">) => {`);
content = content.replace(`      ...po,
      id: \`po-\${Date.now()}\`,
      createdAt: new Date().toISOString(),
      orderNumber: finalCode,`, `      ...po,
      id: \`po-\${Date.now()}\`,
      number: finalCode,`);

content = content.replace(`\${before?.orderNumber}`, `\${before?.number}`);
content = content.replace(`\${updatedPO.orderNumber}`, `\${updatedPO.number}`);

fs.writeFileSync('src/useERPStore.ts', content);
console.log("Fixed useERPStore final");
