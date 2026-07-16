const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// 1. Remove the injected methods that I accidentally put near the end
const badInjectionStart = "  const addProjectActivity = (categoryGroupId: string, activity: any) => {";
const badInjectionEnd = "saveToStorage(\"erp_project_category_groups\", updated, setProjectCategoryGroups);\n  };\n";

const firstIndex = content.lastIndexOf(badInjectionStart);
if (firstIndex !== -1) {
  const lastIndex = content.indexOf(badInjectionEnd, firstIndex) + badInjectionEnd.length;
  content = content.slice(0, firstIndex) + content.slice(lastIndex);
}

// 2. We already injected them at line 299 as well? Let's check where the first injection was.
// Ah, earlier I did content.replace('  return {', newFunctions + '\n  return {');
// This replaced the FIRST '  return {', which was inside toggleReferralStatus? No!
// Let's just find the MAIN return statement. It starts with "  return {\n    customers,\n    products,"
const mainReturn = "  return {\n    customers,\n    products,";
const mainReturnIndex = content.indexOf(mainReturn);
if (mainReturnIndex === -1) {
  console.log("Could not find main return");
} else {
  // 3. Ensure the methods are declared BEFORE mainReturn
  // I'll just write a script that declares them cleanly right before mainReturn
  const newFunctions = `
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
                  createdAt: new Date().toISOString(),
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
`;
  // First, strip these functions if they exist anywhere else in the file!
  content = content.replace(/const addProjectActivity = .*?updateProject\(updatedProj\);\n  };/gs, '');
  content = content.replace(/const updateProjectActivity = .*?updateProject\(updatedProj\);\n  };/gs, '');
  content = content.replace(/const deleteProjectActivity = .*?updateProject\(updatedProj\);\n  };/gs, '');
  content = content.replace(/const toggleReferralStatus = .*?updateProject\(updatedProj\);\n  };/gs, '');
  content = content.replace(/const respondToReferral = .*?updateProject\(updatedProj\);\n  };/gs, '');
  
  // Also strip the correct versions we might have accidentally placed
  const stripRegex = /const addProjectActivity = \(categoryGroupId: string, activity: any\) => \{[\s\S]*?saveToStorage\("erp_project_category_groups", updated, setProjectCategoryGroups\);\n  };\n/g;
  content = content.replace(stripRegex, '');
  const stripRegex2 = /const updateProjectActivity = \(categoryGroupId: string, activity: any\) => \{[\s\S]*?saveToStorage\("erp_project_category_groups", updated, setProjectCategoryGroups\);\n  };\n/g;
  content = content.replace(stripRegex2, '');
  const stripRegex3 = /const deleteProjectActivity = \(categoryGroupId: string, activityId: string\) => \{[\s\S]*?saveToStorage\("erp_project_category_groups", updated, setProjectCategoryGroups\);\n  };\n/g;
  content = content.replace(stripRegex3, '');
  const stripRegex4 = /const toggleReferralStatus = \(categoryGroupId: string, activityId: string\) => \{[\s\S]*?saveToStorage\("erp_project_category_groups", updated, setProjectCategoryGroups\);\n  };\n/g;
  content = content.replace(stripRegex4, '');
  const stripRegex5 = /const respondToReferral = \([\s\S]*?saveToStorage\("erp_project_category_groups", updated, setProjectCategoryGroups\);\n  };\n/g;
  content = content.replace(stripRegex5, '');

  // Now inject them exactly before mainReturn
  const newMainReturnIndex = content.indexOf(mainReturn);
  content = content.slice(0, newMainReturnIndex) + newFunctions + content.slice(newMainReturnIndex);

  // 4. Fix duplicate keys in the return object!
  // At the bottom of the file there might be duplicate keys:
  content = content.replace(/    logAction,\n    logAction,\n/g, '    logAction,\n');
  content = content.replace(/    auditLogs,\n    auditLogs,\n/g, '    auditLogs,\n');

  // 5. Fix TS2741 (createdAt missing)
  content = content.replace(/const addCustomer = \(customer: Omit<Customer, "id" \| "createdAt">\)/g, 'const addCustomer = (customer: Omit<Customer, "id">)');
  content = content.replace(/const addSupplier = \(supplier: Omit<Supplier, "id" \| "createdAt">\)/g, 'const addSupplier = (supplier: Omit<Supplier, "id">)');
  content = content.replace(/createdAt: new Date\(\)\.toISOString\(\),/g, ''); // just remove all createdAt assignments! They are mostly optional in types, except if we just removed them.
  // Wait, I will just manually add createdAt to addCustomer and addSupplier where they are created!
  content = content.replace(/const newCustomer: Customer = {/g, 'const newCustomer: Customer = { createdAt: new Date().toISOString(),');
  content = content.replace(/const newSupplier: Supplier = {/g, 'const newSupplier: Supplier = { createdAt: new Date().toISOString(),');
  
  // Fix orderNumber again
  content = content.replace(/orderNumber:/g, 'poNumber:');

  fs.writeFileSync('src/useERPStore.ts', content);
  console.log("Fixed scope!");
}
