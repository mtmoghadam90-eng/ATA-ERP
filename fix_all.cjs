const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// 1. Move functions to the right place
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

// Remove them from where they are now (by exact match but regex is safer)
content = content.replace(/const addProjectActivity = .*?updateProject\(updatedProj\);\n  };/s, '');
content = content.replace(/const updateProjectActivity = .*?updateProject\(updatedProj\);\n  };/s, '');
content = content.replace(/const deleteProjectActivity = .*?updateProject\(updatedProj\);\n  };/s, '');
content = content.replace(/const toggleReferralStatus = .*?updateProject\(updatedProj\);\n  };/s, '');
content = content.replace(/const respondToReferral = .*?updateProject\(updatedProj\);\n  };/s, '');

// Also clean up my previous generated functions that were placed incorrectly
content = content.replace(newFunctions, '');

const finalReturnIndex = content.lastIndexOf('  return {');
content = content.slice(0, finalReturnIndex) + newFunctions + content.slice(finalReturnIndex);

// 2. Fix Transaction createdAt and PurchaseOrder orderNumber/number
content = content.replace(/const addTransaction = \(t: Omit<Transaction, "id" \| "createdAt">\)/g, 'const addTransaction = (t: Omit<Transaction, "id">)');
content = content.replace(/const addTransaction = \(t: Omit<Transaction, "id">\)\s*=>\s*\{\s*const newT: Transaction = \{\s*\.\.\.t,\s*id: `tx-\$\{Date\.now\(\)\}`,\s*createdAt: new Date\(\)\.toISOString\(\),\s*\};/g, 
  'const addTransaction = (t: Omit<Transaction, "id">) => {\n' +
  '    const newT: Transaction = {\n' +
  '      ...t,\n' +
  '      id: "tx-" + Date.now(),\n' +
  '    };');

content = content.replace(/id: `tx-\$\{Date\.now\(\)\}`,\s*createdAt: new Date\(\)\.toISOString\(\),/g, 'id: "tx-" + Date.now(),');

content = content.replace(/const addPurchaseOrder = \(po: Omit<PurchaseOrder, "id">\)/g, 'const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">)');
content = content.replace(/const addPurchaseOrder = \(po: Omit<PurchaseOrder, "id" \| "createdAt">\)/g, 'const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">)');

content = content.replace(/id: `po-\$\{Date\.now\(\)\}`,\s*createdAt: new Date\(\)\.toISOString\(\),\s*orderNumber: finalCode,/g, 'id: "po-" + Date.now(), poNumber: finalCode,');
content = content.replace(/id: `po-\$\{Date\.now\(\)\}`,\s*number: finalCode,/g, 'id: "po-" + Date.now(), poNumber: finalCode,');

content = content.replace(/before\?\.orderNumber/g, 'before?.poNumber');
content = content.replace(/updatedPO\.orderNumber/g, 'updatedPO.poNumber');
content = content.replace(/before\?\.number/g, 'before?.poNumber');
content = content.replace(/updatedPO\.number/g, 'updatedPO.poNumber');

// 3. Fix logAction error
content = content.replace(/logAction\(\n\s*"سیستم",\n\s*"تنظیمات نرم‌افزار بروزرسانی شد\.",\n\s*"Update"\n\s*\);/g, 
  'logAction("UPDATE", "سیستم", "تنظیمات نرم‌افزار", "تنظیمات نرم‌افزار بروزرسانی شد.");');

// 4. Clean up duplicate returns at the end of file
content = content.replace(/    logAction,\n    updateSettings,\n    runWorkflows,\n  };\n}/g, '    logAction,\n  };\n}');
content = content.replace(/    updateSettings,\n    runWorkflows,\n  };\n}/g, '  };\n}');
content = content.replace(/    updateSettings,\n  };\n}/g, '  };\n}');

fs.writeFileSync('src/useERPStore.ts', content);
console.log("Fixed all!");
