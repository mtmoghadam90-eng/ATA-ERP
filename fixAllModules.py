with open("src/components/SettingsView.tsx", "r") as f:
    content = f.read()

# Fix imports
content = content.replace("} from 'lucide-react';", "  Boxes,\n  Wrench\n} from 'lucide-react';")

# Fix ALL_MODULES
target_modules = """                const ALL_MODULES = [
                  { id: 'dashboard', name: 'داشبورد', desc: 'خلاصه وضعیت، آمارهای کلیدی و نمودارهای سریع سیستم', icon: LayoutDashboard },
                  { id: 'customers', name: 'مشتریان', desc: 'مدیریت پرونده‌های خریداران حقیقی و حقوقی و ارتباطات آن‌ها', icon: Users },
                  { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)', desc: 'کنترل فازها، فعالیت‌ها و ارجاعات مربوط به هر فرصت تجاری', icon: Briefcase },
                  { id: 'proformas', name: 'پیش‌فاکتورها', desc: 'صدور و پیگیری پیشنهادهای مالی فنی برای مشتریان', icon: FileText },
                  { id: 'products', name: 'کالاها و تجهیزات', desc: 'انبارداری، موجودی کالاها و ابزار دقیق شرکت', icon: Package },
                  { id: 'suppliers', name: 'تأمین‌کنندگان', desc: 'مدیریت وندورها و سازندگان داخلی و خارجی کالا', icon: Truck },
                  { id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', desc: 'مدیریت استعلام‌های قیمتی تامین‌کنندگان کالا، مقایسه پیشنهادات و آفرها', icon: HelpCircle },
                  { id: 'purchaseOrders', name: 'سفارشات خرید خارجی', desc: 'پیگیری مراحل پروفرمای خرید، حمل و ترخیص گمرکی', icon: ShoppingCart },
                  { id: 'transactions', name: 'دریافت و پرداخت ریالی', desc: 'ثبت و کنترل تراکنش‌های مالی ریالی و صندوق شرکت', icon: ArrowDownLeft },
                  { id: 'rates', name: 'نرخ ارز روزانه', desc: 'ثبت نرخ‌های روزانه ارزهای دلار، یورو و درهم', icon: TrendingUp },
                  { id: 'tasks', name: 'وظایف و پیگیری', desc: 'مدیریت کارها، ددلاین‌ها و پیگیری‌های پرسنل فروش و فنی', icon: CheckSquare },
                  { id: 'referrals', name: 'کارتابل ارجاعات کار', desc: 'صندوق ورودی ارجاع امور فنی و بازرگانی پروژه‌ها بین همکاران', icon: Inbox },
                  { id: 'users', name: 'مدیریت کاربران', desc: 'تعریف پرسنل، نقش‌ها و تنظیمات دسترسی به هر ماژول', icon: ShieldCheck },
                  { id: 'settings', name: 'تنظیمات سیستم', desc: 'شخصی‌سازی فیلدها، دسته‌بندی‌ها و قالب‌های اسناد رسمی', icon: Settings },
                ];"""

replacement_modules = """                const ALL_MODULES = [
                  { id: 'dashboard', name: 'داشبورد', desc: 'خلاصه وضعیت، آمارهای کلیدی و نمودارهای سریع سیستم', icon: LayoutDashboard },
                  { id: 'customers', name: 'مشتریان', desc: 'مدیریت پرونده‌های خریداران حقیقی و حقوقی و ارتباطات آن‌ها', icon: Users },
                  { id: 'projects', name: 'پروژه‌ها (فرصت‌ها)', desc: 'کنترل فازها، فعالیت‌ها و ارجاعات مربوط به هر فرصت تجاری', icon: Briefcase },
                  { id: 'proformas', name: 'پیش‌فاکتورها', desc: 'صدور و پیگیری پیشنهادهای مالی فنی برای مشتریان', icon: FileText },
                  { id: 'products', name: 'کالاها و تجهیزات', desc: 'انبارداری، موجودی کالاها و ابزار دقیق شرکت', icon: Package },
                  { id: 'suppliers', name: 'تأمین‌کنندگان', desc: 'مدیریت وندورها و سازندگان داخلی و خارجی کالا', icon: Truck },
                  { id: 'supplierInquiries', name: 'استعلام از تأمین‌کنندگان', desc: 'مدیریت استعلام‌های قیمتی تامین‌کنندگان کالا، مقایسه پیشنهادات و آفرها', icon: HelpCircle },
                  { id: 'purchaseOrders', name: 'سفارشات خرید خارجی', desc: 'پیگیری مراحل پروفرمای خرید، حمل و ترخیص گمرکی', icon: ShoppingCart },
                  { id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', desc: 'مدیریت پکینگ‌لیست‌ها و تحویل محموله‌ها به مشتری', icon: Boxes },
                  { id: 'afterSalesServices', name: 'خدمات پس از فروش', desc: 'رسیدگی به درخواست‌ها و پشتیبانی پس از فروش و گارانتی', icon: Wrench },
                  { id: 'transactions', name: 'دریافت و پرداخت ریالی', desc: 'ثبت و کنترل تراکنش‌های مالی ریالی و صندوق شرکت', icon: ArrowDownLeft },
                  { id: 'rates', name: 'نرخ ارز روزانه', desc: 'ثبت نرخ‌های روزانه ارزهای دلار، یورو و درهم', icon: TrendingUp },
                  { id: 'tasks', name: 'وظایف و پیگیری', desc: 'مدیریت کارها، ددلاین‌ها و پیگیری‌های پرسنل فروش و فنی', icon: CheckSquare },
                  { id: 'referrals', name: 'کارتابل ارجاعات کار', desc: 'صندوق ورودی ارجاع امور فنی و بازرگانی پروژه‌ها بین همکاران', icon: Inbox },
                  { id: 'users', name: 'مدیریت کاربران', desc: 'تعریف پرسنل، نقش‌ها و تنظیمات دسترسی به هر ماژول', icon: ShieldCheck },
                  { id: 'settings', name: 'تنظیمات سیستم', desc: 'شخصی‌سازی فیلدها، دسته‌بندی‌ها و قالب‌های اسناد رسمی', icon: Settings },
                ];"""

content = content.replace(target_modules, replacement_modules)

with open("src/components/SettingsView.tsx", "w") as f:
    f.write(content)

