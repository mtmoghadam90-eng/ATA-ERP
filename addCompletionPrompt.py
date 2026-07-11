with open('src/useERPStore.ts', 'r') as f:
    content = f.read()

# Add to state variables
state_vars = """
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [completionPrompt, setCompletionPrompt] = useState<{projectId: string, categoryName: string, message: string} | null>(null);

  const completeCategoryGroup = (projectId: string, categoryName: string) => {
    const normalize = (str: string) => str.replace(/[\s\u200c]/g, '').trim();
    setProjectCategoryGroups(prevGroups => {
      const updatedGroups = prevGroups.map(g => {
        if (g.projectId === projectId && normalize(g.categoryName) === normalize(categoryName)) {
          return {
            ...g,
            status: 'اتمام کار',
            endDate: getTodayShamsi()
          };
        }
        return g;
      });
      import('idb-keyval').then(idb => idb.set('erp_project_category_groups', updatedGroups).catch(err => console.error('Failed to save to idb:', err)));
      return updatedGroups;
    });
  };
"""
content = content.replace("const [currentUser, setCurrentUser] = useState<User | null>(null);", state_vars)

# 1. Proforma
pf_prompt = """
      const logText = statusChanged
        ? `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش شد و وضعیت آن به «${updatedPf.status}» تغییر یافت.`
        : `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      
      autoLogFactActivity(updatedPf.projectId, 'پیش‌فاکتور', logText);
      
      if (statusChanged && updatedPf.status === 'تایید شده') {
        setCompletionPrompt({
          projectId: updatedPf.projectId,
          categoryName: 'پیش‌فاکتور',
          message: `پیش‌فاکتور ${updatedPf.proformaNumber} تایید شد. آیا می‌خواهید وضعیت فعالیت‌های پیش‌فاکتور این پروژه را به «اتمام کار» تغییر دهید؟`
        });
      }
"""
content = content.replace("""      const logText = statusChanged
        ? `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش شد و وضعیت آن به «${updatedPf.status}» تغییر یافت.`
        : `پیش‌فاکتور شماره ${updatedPf.proformaNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      
      autoLogFactActivity(updatedPf.projectId, 'پیش‌فاکتور', logText);""", pf_prompt)

# 2. Purchase Order
po_prompt = """
      const logText = statusChanged
        ? `سفارش خرید شماره ${updatedPO.poNumber} ویرایش شد و وضعیت آن به «${updatedPO.status}» تغییر داده شد.`
        : `سفارش خرید شماره ${updatedPO.poNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      autoLogFactActivity(updatedPO.projectId, 'سفارش خرید', logText);
      
      if (statusChanged && updatedPO.status === 'تحویل شده (رسید انبار)') {
        setCompletionPrompt({
          projectId: updatedPO.projectId,
          categoryName: 'سفارش خرید',
          message: `سفارش خرید ${updatedPO.poNumber} به انبار تحویل شد. آیا می‌خواهید وضعیت فعالیت‌های سفارش خرید این پروژه را به «اتمام کار» تغییر دهید؟`
        });
      }
"""
content = content.replace("""      const logText = statusChanged
        ? `سفارش خرید شماره ${updatedPO.poNumber} ویرایش شد و وضعیت آن به «${updatedPO.status}» تغییر داده شد.`
        : `سفارش خرید شماره ${updatedPO.poNumber} ویرایش و اطلاعات آن بروزرسانی شد.`;
      autoLogFactActivity(updatedPO.projectId, 'سفارش خرید', logText);""", po_prompt)

# 3. Supplier Inquiry
si_prompt = """
    const logText = isWinner 
      ? `انتخاب پیشنهاد تامین‌کننده ${inq.supplierName} به عنوان برنده بابت پروژه ${inq.projectName}` 
      : `لغو وضعیت برنده برای پیشنهاد تامین‌کننده ${inq.supplierName}`;
    autoLogFactActivity(inq.projectId, 'استعلام قیمت از تامین کننده ها', logText);
    
    if (isWinner) {
      setCompletionPrompt({
        projectId: inq.projectId,
        categoryName: 'استعلام قیمت از تامین کننده ها',
        message: `پیشنهاد تامین‌کننده ${inq.supplierName} به عنوان برنده انتخاب شد. آیا می‌خواهید وضعیت این دسته فعالیت را به «اتمام کار» تغییر دهید؟`
      });
    }
"""
content = content.replace("""    const logText = isWinner 
      ? `انتخاب پیشنهاد تامین‌کننده ${inq.supplierName} به عنوان برنده بابت پروژه ${inq.projectName}` 
      : `لغو وضعیت برنده برای پیشنهاد تامین‌کننده ${inq.supplierName}`;
    autoLogFactActivity(inq.projectId, 'استعلام قیمت از تامین کننده ها', logText);""", si_prompt)

# 4. Packaging Delivery
pack_prompt = """
    const logText = `ثبت پکینگ لیست و تحویل کالا به شماره ${packingListNumber} با روش ارسال ${delivery.shippingMethod}`;
    autoLogFactActivity(delivery.projectId, 'بسته‌بندی و تحویل کالا', logText);
    
    setCompletionPrompt({
      projectId: delivery.projectId,
      categoryName: 'بسته‌بندی و تحویل کالا',
      message: `پکینگ لیست ${packingListNumber} صادر شد. آیا می‌خواهید وضعیت دسته فعالیت بسته‌بندی را به «اتمام کار» تغییر دهید؟`
    });
"""
content = content.replace("""    const logText = `ثبت پکینگ لیست و تحویل کالا به شماره ${packingListNumber} با روش ارسال ${delivery.shippingMethod}`;
    autoLogFactActivity(delivery.projectId, 'بسته‌بندی و تحویل کالا', logText);""", pack_prompt)

# 5. After Sales Service
ass_prompt = """
  const updateAfterSalesService = (updatedService: AfterSalesService) => {
    const oldService = afterSalesServices.find(s => s.id === updatedService.id);
    const updated = afterSalesServices.map(s => s.id === updatedService.id ? updatedService : s);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    const logText = `بروزرسانی خدمات پس از فروش کالای ${updatedService.itemName} - وضعیت: ${updatedService.status}`;
    autoLogFactActivity(updatedService.projectId, 'خدمات پس از فروش', logText);
    
    if (oldService && oldService.status !== updatedService.status && updatedService.status === 'تحویل داده شده') {
      setCompletionPrompt({
        projectId: updatedService.projectId,
        categoryName: 'خدمات پس از فروش',
        message: `کالای ${updatedService.itemName} تحویل مشتری داده شد. آیا می‌خواهید وضعیت دسته فعالیت مربوط به خدمات پس از فروش را به «اتمام کار» تغییر دهید؟`
      });
    }
  };
"""
ass_target = """  const updateAfterSalesService = (updatedService: AfterSalesService) => {
    const updated = afterSalesServices.map(s => s.id === updatedService.id ? updatedService : s);
    saveToStorage('erp_after_sales_services', updated, setAfterSalesServices);
    
    const logText = `بروزرسانی خدمات پس از فروش کالای ${updatedService.itemName} - وضعیت: ${updatedService.status}`;
    autoLogFactActivity(updatedService.projectId, 'خدمات پس از فروش', logText);
  };"""
content = content.replace(ass_target, ass_prompt)

# export it
content = content.replace("export function useERPStore() {", "export interface CompletionPrompt { projectId: string; categoryName: string; message: string; }\n\nexport function useERPStore() {")
exports = """    completionPrompt,
    setCompletionPrompt,
    completeCategoryGroup,
    currentUser,"""
content = content.replace("    currentUser,", exports)

with open('src/useERPStore.ts', 'w') as f:
    f.write(content)
