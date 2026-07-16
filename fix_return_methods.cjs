const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const returnStatement = `  return {
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
    completeCategoryGroup,`;

const methodsToExport = `
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
`;

if (content.includes(returnStatement)) {
  content = content.replace(returnStatement, returnStatement + methodsToExport);
  fs.writeFileSync('src/useERPStore.ts', content);
  console.log("Injected methods to export.");
} else {
  console.log("Could not find returnStatement");
}
