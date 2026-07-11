with open("src/components/SettingsView.tsx", "r") as f:
    content = f.read()

# 1. Remove idb-keyval import
content = content.replace("import { set as idbSet } from 'idb-keyval';", "")

# 2. Fix the clearData logic
old_clear_data = """    } else if (deleteType === "clearData") {
      localStorage.setItem("erp_customers", JSON.stringify([]));
      localStorage.setItem("erp_products", JSON.stringify([]));
      localStorage.setItem("erp_suppliers", JSON.stringify([]));
      localStorage.setItem("erp_projects", JSON.stringify([]));
      localStorage.setItem("erp_proformas", JSON.stringify([]));
      localStorage.setItem("erp_purchase_orders", JSON.stringify([]));
      localStorage.setItem("erp_transactions", JSON.stringify([]));
      localStorage.setItem("erp_tasks", JSON.stringify([]));
      localStorage.setItem("erp_project_category_groups", JSON.stringify([]));
      localStorage.setItem("erp_module_notifications", JSON.stringify([]));

      // Remove any user-specific read notifications
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('read_notifications_')) {
          localStorage.removeItem(key);
        }
      }
      idbSet("erp_project_category_groups", []).catch(err => console.error("Failed to clear idb:", err));
      alert("تمامی داده‌ها با موفقیت پاک شدند. لطفاً صفحه را بارگذاری مجدد (Refresh) کنید.");
      window.location.reload();
    }"""

new_clear_data = """    } else if (deleteType === "clearData") {
      const keysToClear = [
        "erp_customers", "erp_products", "erp_suppliers", "erp_projects", 
        "erp_proformas", "erp_purchase_orders", "erp_transactions", "erp_tasks", 
        "erp_project_category_groups", "erp_supplier_inquiries", "erp_packaging_deliveries",
        "erp_after_sales_services"
      ];
      
      Promise.all(keysToClear.map(key => 
        fetch(`/api/data/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        })
      )).then(() => {
        // Remove any user-specific read notifications
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('read_notifications_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        alert("تمامی داده‌ها با موفقیت پاک شدند. لطفاً صفحه را بارگذاری مجدد (Refresh) کنید.");
        window.location.reload();
      }).catch(err => {
        console.error("Failed to clear data on server:", err);
        alert("خطا در پاک کردن داده‌ها!");
      });
    }"""

content = content.replace(old_clear_data, new_clear_data)

with open("src/components/SettingsView.tsx", "w") as f:
    f.write(content)
