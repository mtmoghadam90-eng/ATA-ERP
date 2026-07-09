import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  FileSpreadsheet, 
  Users, 
  CheckSquare 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Customer, Product, Project, Proforma, PurchaseOrder, Task, ExchangeRate } from '../types';
import { getTodayShamsi } from '../dateUtils';

interface DashboardViewProps {
  customers: Customer[];
  products: Product[];
  projects: Project[];
  proformas: Proforma[];
  purchaseOrders: PurchaseOrder[];
  tasks: Task[];
  exchangeRates: ExchangeRate[];
  setActiveTab: (tab: string) => void;
  lowStockProducts: Product[];
}

export default function DashboardView({
  customers,
  products,
  projects,
  proformas,
  purchaseOrders,
  tasks,
  exchangeRates,
  setActiveTab,
  lowStockProducts
}: DashboardViewProps) {

  // 1. Calculate stats
  // Total Won Revenue (Proformas with status 'تأیید شده (برنده)')
  const wonProformas = proformas.filter(p => p.status === 'تأیید شده (برنده)');
  const totalRevenue = wonProformas.reduce((sum, p) => sum + p.finalAmount, 0);

  // Active Proformas (not won, draft, lost or cancelled - e.g., 'ارسال شده', 'پیش‌نویس')
  const activeProformas = proformas.filter(p => p.status === 'ارسال شده' || p.status === 'پیش‌نویس');
  const activeProformasValue = activeProformas.reduce((sum, p) => sum + p.finalAmount, 0);

  // Active Purchase Orders (under tracking)
  const activePOs = purchaseOrders.filter(po => po.status !== 'تحویل شده (رسید انبار)');
  
  // 2. Prepare Project Pie Chart Data
  const projectStatusCounts = projects.reduce((acc: { [key: string]: number }, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const projectChartData = Object.keys(projectStatusCounts).map(status => ({
    name: status,
    value: projectStatusCounts[status]
  }));

  const COLORS = ['#0ea5e9', '#38bdf8', '#0284c7', '#22c55e', '#ef4444', '#94a3b8'];

  // 3. Prepare Revenue by Category data for a Bar Chart
  const categorySales = wonProformas.reduce((acc: { [key: string]: number }, p) => {
    p.items.forEach(item => {
      // Find product category
      const prod = products.find(pr => pr.id === item.productId);
      const cat = prod ? prod.category : 'غیره';
      acc[cat] = (acc[cat] || 0) + item.totalPriceRIYAL;
    });
    return acc;
  }, {});

  const categoryChartData = Object.keys(categorySales).map(cat => ({
    name: cat.split(' - ')[1] || cat, // Get shorter name
    فروش: Math.round(categorySales[cat] / 1000000) // in Millions IRR
  }));

  // Format IRR Currency helper
  const formatIRR = (num: number) => {
    return (num / 10000000).toLocaleString('fa-IR', { maximumFractionDigits: 0 }) + ' میلیون تومان';
  };

  const formatRawIRR = (num: number) => {
    return num.toLocaleString('fa-IR') + ' ریال';
  };

  const getPriorityBadgeClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'فوری': return 'bg-red-100 text-red-800 border-red-200';
      case 'بالا': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'متوسط': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in bg-[#f8fafc] p-1 md:p-2 rounded-3xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            پیشخوان مدیریت ارشیا (ERP)
          </h1>
          <p className="text-slate-500 text-sm mt-1">سامانه جامع مدیریت منابع، تأمین تجهیزات و پیگیری پروژه‌ها</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-xs text-slate-400">آخرین بروزرسانی سیستم</p>
            <p className="text-sm font-semibold text-slate-700 font-mono">{getTodayShamsi()}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <button 
            onClick={() => setActiveTab('proformas')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
          >
            <FileText size={16} />
            صدور پیش‌فاکتور جدید
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* KPI 1: Value of total inventory */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-500 font-medium">ارزش کل قراردادها</p>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {wonProformas.length > 0 ? formatIRR(totalRevenue) : '۰ ریال'}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              ↑ {wonProformas.length} پیش‌فاکتور نهایی‌شده
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
            ↑
          </div>
        </div>

        {/* KPI 2: Active Quotations / Orders in Progress */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-500 font-medium">پیشنهادهای جاری فعال</p>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {formatIRR(activeProformasValue)}
            </p>
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              🕒 {activeProformas.length} پیش‌فاکتور معلق
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
            🕒
          </div>
        </div>

        {/* KPI 3: Today's Orders */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-500 font-medium">سفارشات خرید فعال</p>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {activePOs.length} سفارش فعال
            </p>
            <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-1">
              📝 در جریان تأمین و واردات
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
            📝
          </div>
        </div>

        {/* KPI 4: Total Products Defined */}
        <div 
          onClick={() => setActiveTab('products')}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-500 font-medium">کل تجهیزات تعریف‌شده</p>
            <p className="text-lg font-bold text-sky-600 tracking-tight group-hover:underline">
              {products.length} ردیف تجهیز
            </p>
            <span className="text-[10px] text-sky-500 font-semibold flex items-center gap-1">
              📋 کاتالوگ فنی ابزاردقیق
            </span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
            📋
          </div>
        </div>

        {/* Sales by Category (Bento Main Column 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold flex items-center gap-2 text-slate-800">
              <span>📦</span> وضعیت فروش برنده بر اساس دسته‌بندی تجهیزات
            </h2>
            <button 
              onClick={() => setActiveTab('products')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              مشاهده کالاها و تجهیزات ←
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <p className="text-xs text-slate-400 mb-4">حجم معاملات قطعی نهایی شده به تفکیک دسته‌بندی‌های کالا (میلیون تومان)</p>
            <div className="h-64">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} میلیون تومان`, 'حجم فروش']} />
                    <Bar dataKey="فروش" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-slate-400">فروش نهایی صادر نشده است</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Operations Module (Bento Column 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-5">
          <h2 className="font-bold flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-100 pb-3">
            <span>⚡</span> عملیات و پیگیری سریع
          </h2>
          <div className="flex flex-col gap-3 flex-1 justify-between">
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('proformas')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center justify-between group transition-all font-semibold text-sm shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span>📄</span> صدور پیش‌فاکتور ارزی/ریالی
                </span>
                <span className="opacity-60 group-hover:opacity-100 font-mono transition-opacity">+</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('products')}
                className="w-full bg-white border-2 border-dashed border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 p-3 rounded-xl flex items-center justify-between group transition-all font-semibold text-sm"
              >
                <span className="flex items-center gap-2">
                  <span>📥</span> مدیریت کاتالوگ فنی و ثبت کالا
                </span>
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">↓</span>
              </button>
            </div>

            {/* Quick tracker helper */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-2">رهگیری سفارش خرید خارجی</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="شماره سفارش (PO)..." 
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:border-blue-500 text-right"
                />
                <button 
                  onClick={() => setActiveTab('purchaseOrders')}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3 rounded-lg transition"
                >
                  رهگیری
                </button>
              </div>
            </div>

            {/* Dynamic Activity Log */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">آخرین فعالیت ثبت شده</span>
                <span className="text-[10px] text-slate-400 font-mono">بروزرسانی زنده</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {proformas.length > 0 ? (
                  <span>
                    پیش‌فاکتور شماره <strong>{proformas[proformas.length - 1].proformaNumber}</strong> برای مشتری <strong>{proformas[proformas.length - 1].customerName}</strong> ایجاد/بروزرسانی شد.
                  </span>
                ) : (
                  'سامانه آماده کار و تراکنش جدید است.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Currency Rates Card (Bento Column 4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>🪙</span> نرخ مرجع ارز روزانه
              </h3>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">ریال ایران</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">مبنای استعلام‌های خرید خارجی و فاکتوردهی</p>
          </div>
          
          <div className="my-3 divide-y divide-slate-100 flex-1 overflow-auto max-h-60">
            {exchangeRates.map((rate) => (
              <div key={rate.id} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shadow-sm">
                    {rate.currency}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">{rate.name}</span>
                    <span className="text-[9px] text-slate-400 block font-mono">بروزرسانی: {new Date(rate.lastUpdated).toLocaleTimeString('fa-IR')}</span>
                  </div>
                </div>
                <div className="text-left font-mono">
                  <span className="text-xs font-extrabold text-slate-800">
                    {rate.rateToRIYAL.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[9px] text-slate-400 mr-1">ریال</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setActiveTab('rates')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition text-center"
          >
            مدیریت نرخ ارزها و کوتیشن جدید ←
          </button>
        </div>

        {/* Project Pipeline Chart (Bento Column 4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>📈</span> پیپ‌لاین پروژه‌ها و فروش
            </h3>
            <p className="text-xs text-slate-400 mt-1">تعداد فرصت‌های ثبت شده به تفکیک مرحله تجاری</p>
          </div>
          
          <div className="h-48 my-2 flex items-center justify-center">
            {projectChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {projectChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} پروژه`, 'تعداد']} />
                  <Legend verticalAlign="bottom" height={32} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">اطلاعاتی یافت نشد</p>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('projects')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition text-center"
          >
            مدیریت فرصت‌های پروژه‌ای ←
          </button>
        </div>

        {/* Urgent/Pending Followups (Bento Column 4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>⚡</span> وظایف و اقدامات بازرگانی فوری
            </h3>
            <p className="text-xs text-slate-400 mt-1">تسک‌ها، پیگیری‌های مدارک فنی و مالی</p>
          </div>

          <div className="my-3 space-y-2.5 flex-1 overflow-auto max-h-60 pr-1">
            {tasks.filter(t => t.status !== 'انجام شده').slice(0, 3).map((task) => (
              <div key={task.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex flex-col gap-1.5 transition">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate">{task.title}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                {task.relatedToName && (
                  <span className="text-[10px] text-slate-400">
                    مربوط به: {task.relatedToName} ({task.relatedToType})
                  </span>
                )}
                <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-dashed border-slate-200 pt-1.5 mt-1">
                  <span>مسئول: {task.assignedTo}</span>
                  <span className="font-mono">سررسید: {task.dueDate}</span>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status !== 'انجام شده').length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">هیچ تسک یا اقدام معلقی وجود ندارد.</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('tasks')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition text-center"
          >
            مشاهده برد وظایف و پیگیری‌ها ←
          </button>
        </div>

        {/* Widescreen Periodic Procurement Analysis Block (Bento Column 12) */}
        <div className="col-span-12 bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative z-10 flex-1 space-y-2 text-right">
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              تحلیل هوشمند و دوره‌ای بازار
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-2">گزارش دوره‌ای تأمین تجهیزات ابزاردقیق</h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              بررسی آماری نرخ تبدیل پیشنهادهای قیمت، سهم بازار تأمین تجهیزات و وضعیت لجستیک صنایع نفت، گاز، پتروشیمی و صنایع بزرگ نیروگاهی کشور.
            </p>
            
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="text-right"> 
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">سهم بازار ارشیا</p>
                <p className="text-2xl font-black text-blue-400 tracking-tight font-mono">۱۸.۴٪</p>
              </div>
              <div className="text-right"> 
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">نرخ تبدیل پیش‌فاکتورها</p>
                <p className="text-2xl font-black text-green-400 tracking-tight font-mono">
                  {proformas.length > 0 
                    ? `${Math.round((wonProformas.length / proformas.length) * 100)}٪` 
                    : '۰٪'}
                </p>
              </div>
              <div className="text-right"> 
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">پروژه‌های موفق تجاری</p>
                <p className="text-2xl font-black text-purple-400 tracking-tight font-mono">
                  {projects.filter(p => p.status === 'برنده (موفق)').length} پروژه
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-64 h-36 flex items-end gap-2 pr-0 md:pr-8 z-10">
            <div className="w-full bg-blue-500/20 h-1/3 rounded-t-lg transition-all duration-500 hover:h-1/2"></div>
            <div className="w-full bg-blue-500/40 h-2/3 rounded-t-lg transition-all duration-500 hover:h-3/4"></div>
            <div className="w-full bg-blue-500/60 h-3/4 rounded-t-lg transition-all duration-500 hover:h-5/6"></div>
            <div className="w-full bg-blue-500 h-full rounded-t-lg transition-all duration-500 shadow-lg shadow-blue-500/20"></div>
            <div className="w-full bg-blue-400 h-5/6 rounded-t-lg transition-all duration-500"></div>
          </div>
          
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}
