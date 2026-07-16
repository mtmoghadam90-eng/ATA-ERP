const fs = require('fs');
const content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const props = [
"addAfterSalesService", "addCustomer", "addPackagingDelivery", "addProduct",
"addProforma", "addProject", "addProjectActivity", "addProjectCategoryGroup",
"addPurchaseOrder", "addSupplier", "addSupplierInquiry", "addTask",
"addTransaction", "addUser", "adjustProductStock", "afterSalesServices",
"auditLogs", "batchImportProducts", "batchUpdateCustomers",
"batchUpdateProjectProformasStatus", "changeRole", "completeCategoryGroup",
"completeProjectCategoryGroup", "completionPrompt", "currentUser",
"customers", "deleteAfterSalesService", "deleteCustomer",
"deletePackagingDelivery", "deleteProduct", "deleteProforma",
"deleteProject", "deleteProjectActivity", "deleteProjectCategoryGroup",
"deletePurchaseOrder", "deleteSupplier", "deleteSupplierInquiry",
"deleteTask", "deleteTransaction", "deleteUser", "exchangeRates",
"fetchRatesFromAPI", "inventoryTransactions", "isInitialized",
"login", "loginWithUser", "logout", "markAllModuleNotificationsAsRead",
"markItemsAsRead", "markModuleNotificationAsRead", "moduleNotifications",
"packagingDeliveries", "products", "proformas", "projectCategoryGroups",
"projects", "purchaseOrders", "readItems", "respondToReferral",
"resumeProjectCategoryGroup", "setCompletionPrompt", "settings",
"supplierInquiries", "suppliers", "tasks", "toggleReferralStatus",
"transactions", "updateAfterSalesService", "updateCustomer",
"updateExchangeRate", "updatePackagingDelivery", "updateProduct",
"updateProforma", "updateProformaStatus", "updateProject",
"updateProjectActivity", "updatePurchaseOrder", "updatePurchaseOrderStatus",
"updateSettings", "updateSupplier", "updateSupplierInquiry", "updateTask",
"updateTransaction", "updateUser", "userRole", "users"
];

for(const p of props) {
    if(!content.includes(p)) {
        console.log("Missing:", p);
    }
}
