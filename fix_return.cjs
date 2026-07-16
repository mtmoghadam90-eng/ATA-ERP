const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

const returnTarget = `  return {
    products,
    suppliers,
    transactions,
    purchaseOrders,
    users,`;

const returnReplacement = `  return {
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

if(content.indexOf(returnTarget) !== -1) {
  content = content.replace(returnTarget, returnReplacement);
  
  // also clean up duplicate currentUser, completionPrompt, setCompletionPrompt, completeCategoryGroup
  // below the new returnReplacement
  content = content.replace(`    completionPrompt,
    setCompletionPrompt,
    completeCategoryGroup,
    currentUser,`, '');

  fs.writeFileSync('src/useERPStore.ts', content);
  console.log("Replaced return statement");
} else {
  console.log("Could not find return target");
}
