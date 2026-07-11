import re
with open("src/components/SettingsView.tsx", "r") as f:
    content = f.read()

content = re.sub(r'\} else if \(deleteType === "clearData"\) \{.*?(?=setDeleteConfirmOpen\(false\);)', """} else if (deleteType === "clearData") {
      const keysToClear = [
        "erp_customers", "erp_products", "erp_suppliers", "erp_projects", 
        "erp_proformas", "erp_purchase_orders", "erp_transactions", "erp_tasks", 
        "erp_project_category_groups", "erp_supplier_inquiries", "erp_packaging_deliveries",
        "erp_after_sales_services", "erp_module_notifications"
      ];
      
      Promise.all(keysToClear.map(key => 
        fetch(`/api/data/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        })
      )).then(() => {
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
    }
    """, content, flags=re.DOTALL)

with open("src/components/SettingsView.tsx", "w") as f:
    f.write(content)
