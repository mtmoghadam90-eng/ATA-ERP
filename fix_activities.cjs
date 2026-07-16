const fs = require('fs');
let content = fs.readFileSync('src/useERPStore.ts', 'utf-8');

// Replace addProjectActivity, updateProjectActivity, deleteProjectActivity, toggleReferralStatus, respondToReferral
const toReplace = [
  /const addProjectActivity = .*?updateProject\(updatedProj\);\n  };/s,
  /const updateProjectActivity = .*?updateProject\(updatedProj\);\n  };/s,
  /const deleteProjectActivity = .*?updateProject\(updatedProj\);\n  };/s,
  /const toggleReferralStatus = .*?updateProject\(updatedProj\);\n  };/s,
  /const respondToReferral = .*?updateProject\(updatedProj\);\n  };/s
];

for(const regex of toReplace) {
  content = content.replace(regex, '');
}

const newFunctions = `
  const addProjectActivity = (categoryGroupId: string, activity: any) => {
    const updated = projectCategoryGroups.map(g => {
      if (g.id === categoryGroupId) {
        return { ...g, activities: [...g.activities, { ...activity, id: \`act-\${Date.now()}\`, createdAt: new Date().toISOString() }] };
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
                  id: \`msg-\${Date.now()}\`,
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

content = content.replace('  return {', newFunctions + '\n  return {');
fs.writeFileSync('src/useERPStore.ts', content);
console.log("Fixed activities");
