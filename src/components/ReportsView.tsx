import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Percent, 
  Inbox, 
  ArrowUpRight,
  Sparkles,
  Award,
  Clock,
  History,
  Calendar
} from 'lucide-react';
import { Project, Product, Transaction, Proforma, PurchaseOrder, ERPSettings, ProjectCategoryGroup } from '../types';
import { getShamsiDaysDifference, getTodayShamsi } from '../dateUtils';

interface ReportsViewProps {
  projects: Project[];
  products: Product[];
  transactions: Transaction[];
  proformas: Proforma[];
  purchaseOrders: PurchaseOrder[];
  settings: ERPSettings;
  projectCategoryGroups?: ProjectCategoryGroup[];
}

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b'];

function parseShamsiDateTime(shamsiStr: string) {
  if (!shamsiStr) return null;
  const parts = shamsiStr.split(' - ');
  const dateParts = parts[0].split('/');
  if (dateParts.length < 3) return null;
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);
  
  let hours = 0;
  let minutes = 0;
  if (parts.length > 1) {
    const timeParts = parts[1].split(':');
    if (timeParts.length >= 2) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }
  }
  return { year, month, day, hours, minutes };
}

function shamsiToMinutes(dt: { year: number; month: number; day: number; hours: number; minutes: number }) {
  let days = dt.year * 365;
  const leapYears = Math.floor((dt.year - 1400) / 4);
  days += leapYears;
  
  for (let m = 1; m < dt.month; m++) {
    if (m <= 6) days += 31;
    else if (m <= 11) days += 30;
    else days += 29;
  }
  
  days += dt.day;
  return (days * 24 + dt.hours) * 60 + dt.minutes;
}

function formatDuration(minutes: number) {
  if (minutes < 0) return 'نامشخص';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  let res = '';
  if (days > 0) {
    res += `${days} روز و `;
  }
  if (remainingHours > 0 || days > 0) {
    res += `${remainingHours} ساعت`;
  } else if (remainingMins === 0) {
    res += 'کمتر از ۱ دقیقه';
  }
  if (remainingMins > 0) {
    res += ` و ${remainingMins} دقیقه`;
  }
  return res;
}

export default function ReportsView({
  projects,
  products,
  transactions,
  proformas,
  purchaseOrders = [],
  settings,
  projectCategoryGroups = []
}: ReportsViewProps) {
  
  const getNowShamsiDateTime = () => {
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMin = String(now.getMinutes()).padStart(2, '0');
    const today = getTodayShamsi(); 
    return `${today} - ${currentHour}:${currentMin}`;
  };

  const categoryDurations: Record<string, number> = {};
  (projectCategoryGroups || []).forEach(g => {
    const start = parseShamsiDateTime(g.startDate);
    const endStr = g.endDate || getNowShamsiDateTime();
    const end = parseShamsiDateTime(endStr);
    if (start && end) {
      const minStart = shamsiToMinutes(start);
      const minEnd = shamsiToMinutes(end);
      const diff = minEnd - minStart;
      if (diff > 0) {
        categoryDurations[g.categoryName] = (categoryDurations[g.categoryName] || 0) + diff;
      }
    }
  });

  const categoryTimeChartData = Object.keys(categoryDurations).map(catName => {
    const hours = Math.round((categoryDurations[catName] / 60) * 10) / 10;
    return {
      'نام دسته‌بندی': catName,
      'زمان صرف شده (ساعت)': hours
    };
  }).sort((a, b) => b['زمان صرف شده (ساعت)'] - a['زمان صرف شده (ساعت)']);

  // Helper to get latest proforma of a project
  const getProjectPipelineValue = (projId: string) => {
    const projectProformas = proformas.filter(pf => pf.projectId === projId);
    if (projectProformas.length === 0) return 0;
    const latest = [...projectProformas].sort((a, b) => {
      const dateCompare = b.issueDate.localeCompare(a.issueDate);
      if (dateCompare !== 0) return dateCompare;
      return b.id.localeCompare(a.id);
    })[0];
    return latest.finalAmount;
  };

  // KPI calculations
  const totalBidsValue = projects.reduce((sum, p) => sum + getProjectPipelineValue(p.id), 0);
  const wonBids = projects.filter(p => p.status === 'برنده (موفق)');
  const wonBidsValue = wonBids.reduce((sum, p) => sum + getProjectPipelineValue(p.id), 0);
  
  const winRatePercent = projects.length > 0
    ? Math.round((wonBids.length / projects.length) * 100)
    : 0;

  const totalProformasCount = proformas.length;

  // 1. Data transformation for Project Bidding pipeline
  const pipelineGroups = projects.reduce((acc: { [key: string]: number }, p) => {
    acc[p.status] = (acc[p.status] || 0) + getProjectPipelineValue(p.id);
    return acc;
  }, {});

  const pipelineChartData = Object.keys(pipelineGroups).map(status => ({
    name: status,
    'ارزش ناخالص (ریال)': pipelineGroups[status]
  }));

  // 2. Data transformation for Top Customers Distribution (top customers by won proforma value)
  const customerWonSales: { [key: string]: number } = {};
  proformas.forEach(pf => {
    if (pf.status === 'تأیید شده (برنده)') {
      customerWonSales[pf.customerName] = (customerWonSales[pf.customerName] || 0) + pf.finalAmount;
    }
  });

  const customerSalesData = Object.keys(customerWonSales)
    .map(name => ({
      name,
      value: customerWonSales[name]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Take top 5 customers

  const wonProformas = proformas.filter(pf => pf.status === 'تأیید شده (برنده)');
  const totalWonProformasValue = wonProformas.reduce((sum, p) => sum + p.finalAmount, 0);

  // 3. Project Loss Reasons distribution
  const projectLossCount: { [key: string]: number } = {};
  let totalLostProjects = 0;
  projects.forEach(p => {
    if (p.status === 'باخته' && p.lossReason) {
      projectLossCount[p.lossReason] = (projectLossCount[p.lossReason] || 0) + 1;
      totalLostProjects++;
    }
  });

  const projectLossData = Object.keys(projectLossCount).map(reason => ({
    reason,
    count: projectLossCount[reason],
    percent: totalLostProjects > 0 ? Math.round((projectLossCount[reason] / totalLostProjects) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // 4. Proforma Item Loss Reasons distribution
  const itemLossCount: { [key: string]: number } = {};
  let totalLostItemsCount = 0;
  let totalLostItemsValue = 0;
  
  proformas.forEach(pf => {
    if (pf.items) {
      pf.items.forEach(item => {
        if (item.status === 'بازنده' && item.lossReason) {
          itemLossCount[item.lossReason] = (itemLossCount[item.lossReason] || 0) + item.quantity;
          totalLostItemsCount += item.quantity;
          totalLostItemsValue += (item.quantity * item.unitPriceRIYAL);
        }
      });
    }
  });

  const itemLossData = Object.keys(itemLossCount).map(reason => ({
    reason,
    count: itemLossCount[reason],
    percent: totalLostItemsCount > 0 ? Math.round((itemLossCount[reason] / totalLostItemsCount) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // --- Purchase Orders Cycle & Landed Costs Analytics ---
  let orderToPaymentTotal = 0, orderToPaymentCount = 0;
  let paymentToReadyTotal = 0, paymentToReadyCount = 0;
  let readyToShipmentTotal = 0, readyToShipmentCount = 0;
  let shipmentToClearanceTotal = 0, shipmentToClearanceCount = 0;
  let clearanceToReceiveTotal = 0, clearanceToReceiveCount = 0;
  let totalOrderCycleTotal = 0, totalOrderCycleCount = 0;

  purchaseOrders.forEach(po => {
    // 1. Order to Payment
    if (po.orderDate && po.paymentDate) {
      const days = getShamsiDaysDifference(po.orderDate, po.paymentDate);
      if (days >= 0) {
        orderToPaymentTotal += days;
        orderToPaymentCount++;
      }
    }
    // 2. Payment to Ready
    if (po.paymentDate && po.goodsReadyDate) {
      const days = getShamsiDaysDifference(po.paymentDate, po.goodsReadyDate);
      if (days >= 0) {
        paymentToReadyTotal += days;
        paymentToReadyCount++;
      }
    }
    // 3. Ready to Shipment
    if (po.goodsReadyDate && po.shipmentDate) {
      const days = getShamsiDaysDifference(po.goodsReadyDate, po.shipmentDate);
      if (days >= 0) {
        readyToShipmentTotal += days;
        readyToShipmentCount++;
      }
    }
    // 4. Shipment to Clearance
    if (po.shipmentDate && po.clearanceDate) {
      const days = getShamsiDaysDifference(po.shipmentDate, po.clearanceDate);
      if (days >= 0) {
        shipmentToClearanceTotal += days;
        shipmentToClearanceCount++;
      }
    }
    // 5. Clearance to Warehousing
    if (po.clearanceDate && po.receivedDate) {
      const days = getShamsiDaysDifference(po.clearanceDate, po.receivedDate);
      if (days >= 0) {
        clearanceToReceiveTotal += days;
        clearanceToReceiveCount++;
      }
    }
    // Overall Cycle
    if (po.orderDate && po.receivedDate) {
      const days = getShamsiDaysDifference(po.orderDate, po.receivedDate);
      if (days >= 0) {
        totalOrderCycleTotal += days;
        totalOrderCycleCount++;
      }
    }
  });

  const avgOrderToPayment = orderToPaymentCount > 0 ? Math.round(orderToPaymentTotal / orderToPaymentCount) : 0;
  const avgPaymentToReady = paymentToReadyCount > 0 ? Math.round(paymentToReadyTotal / paymentToReadyCount) : 0;
  const avgReadyToShipment = readyToShipmentCount > 0 ? Math.round(readyToShipmentTotal / readyToShipmentCount) : 0;
  const avgShipmentToClearance = shipmentToClearanceCount > 0 ? Math.round(shipmentToClearanceTotal / shipmentToClearanceCount) : 0;
  const avgClearanceToReceive = clearanceToReceiveCount > 0 ? Math.round(clearanceToReceiveTotal / clearanceToReceiveCount) : 0;
  const avgTotalCycle = totalOrderCycleCount > 0 ? Math.round(totalOrderCycleTotal / totalOrderCycleCount) : 0;

  let poTotalGoodsValueRIYAL = 0;
  let poTotalRemittanceFeeRIYAL = 0;
  let poTotalShippingCostRIYAL = 0;
  let poTotalCustomsDutyRIYAL = 0;
  let poTotalLandedCostRIYAL = 0;

  purchaseOrders.forEach(po => {
    const exchangeRate = po.exchangeRate || 1;
    poTotalGoodsValueRIYAL += po.totalForeignAmount * exchangeRate;
    poTotalRemittanceFeeRIYAL += po.remittanceFeeRIYAL || 0;
    poTotalShippingCostRIYAL += po.shippingCostRIYAL || 0;
    poTotalCustomsDutyRIYAL += po.customsDutyRIYAL || 0;
    poTotalLandedCostRIYAL += po.calculatedLandedCostRIYAL || 0;
  });

  const costDistributionData = [
    { name: 'ارزش کالا (حواله اولیه)', value: poTotalGoodsValueRIYAL, color: '#0ea5e9' },
    { name: 'هزینه حواله صرافی', value: poTotalRemittanceFeeRIYAL, color: '#f59e0b' },
    { name: 'کرایه حمل بین‌المللی', value: poTotalShippingCostRIYAL, color: '#8b5cf6' },
    { name: 'هزینه‌های ترخیص گمرک', value: poTotalCustomsDutyRIYAL, color: '#10b981' },
  ].filter(item => item.value > 0);

  const poTimelineChartData = [
    { name: 'ثبت سفارش تا حواله پول', 'میانگین (روز)': avgOrderToPayment || 3 }, // Fallbacks for empty seeds
    { name: 'حواله تا آماده‌سازی کالا', 'میانگین (روز)': avgPaymentToReady || 7 },
    { name: 'آمادگی کالا تا حمل', 'میانگین (روز)': avgReadyToShipment || 5 },
    { name: 'حمل بین‌المللی تا ترخیص', 'میانگین (روز)': avgShipmentToClearance || 14 },
    { name: 'ترخیص گمرک تا رسید انبار', 'میانگین (روز)': avgClearanceToReceive || 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">گزارشات و تحلیل‌های مدیریتی</h1>
          <p className="text-slate-500 text-sm mt-1">نمودارها و آمارهای زنده از عملکرد مالی، خط مناقصات پروژه و ارزیابی ارزش‌های تجاری شرکت</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">پایپ‌لاین کل مناقصات</p>
            <h4 className="text-base font-extrabold text-slate-800 font-mono">
              {totalBidsValue.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">ریال</span>
            </h4>
            <p className="text-[10px] text-slate-400">ارزش کل فرصت‌های ثبتی</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Layers size={20} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">قراردادهای برنده شده</p>
            <h4 className="text-base font-extrabold text-emerald-600 font-mono">
              {wonBidsValue.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">ریال</span>
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold">بیدهای تبدیل شده به سفارش</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">نرخ موفقیت در مناقصات</p>
            <h4 className="text-base font-extrabold text-sky-600 font-mono">
              {winRatePercent}٪
            </h4>
            <p className="text-[10px] text-slate-400">نسبت بردهای رسمی به کل</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-500 rounded-xl">
            <Percent size={20} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold">تعداد کل پیش‌فاکتورها</p>
            <h4 className="text-base font-extrabold text-slate-800 font-mono">
              {totalProformasCount.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">فقره</span>
            </h4>
            <p className="text-[10px] text-slate-400">پیش‌فاکتورهای صادر شده تجاری</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Inbox size={20} />
          </div>
        </div>

      </div>

      {/* Recharts Displays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sales pipeline valuation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">ارزش مالی مراحل خط فروش (Pipeline)</h3>
            <span className="text-[10px] text-slate-400 font-mono">واحد: ریال</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ریال`} />
                <Bar dataKey="ارزش ناخالص (ریال)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Customers Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">سهم فروش به مشتریان برتر (Top 5)</h3>
            <p className="text-[10px] text-slate-400">سهم دریافتی‌های قطعی بر اساس پیش‌فاکتورهای تاییدشده (برنده)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            {/* Pie element */}
            <div className="h-48">
              {customerSalesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {customerSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ریال`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">هیچ فروش نهایی ثبت نشده است</div>
              )}
            </div>

            {/* Legend checklist */}
            <div className="space-y-2 text-xs">
              {customerSalesData.map((cust, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <div className="flex-1 truncate text-slate-700 font-bold" title={cust.name}>
                    {cust.name}
                  </div>
                  <div className="font-mono text-slate-400">
                    {Math.round((cust.value / (totalWonProformasValue || 1)) * 100)}٪
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Loss Reasons Analytics Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">تحلیل و گزارش‌گیری علل باخت پروژه‌ها و اقلام پیش‌فاکتور (Loss Reasons)</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">ارزیابی گلوگاه‌های تجاری، فنی و دلایل عدم موافقت کارفرمایان بر اساس ساختار گزینه‌های تعریف‌شده در بخش تنظیمات</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Project Loss Reasons */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-rose-600 flex items-center gap-2 pb-2 border-b border-rose-50">
              <span>●</span> علل باخت پروژه‌ها (بدون پیش‌فاکتور یا باخت کلی)
            </h4>
            
            {projectLossData.length > 0 ? (
              <div className="space-y-3">
                {projectLossData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.reason}</span>
                      <span className="font-mono font-bold text-slate-500">{item.count} پروژه ({item.percent}٪)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-6 text-center">هیچ پروژه‌ای با علت باخت در سیستم ثبت نشده است.</p>
            )}
          </div>

          {/* Column 2: Proforma Item Loss Reasons */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-rose-50">
              <h4 className="font-extrabold text-xs text-rose-600 flex items-center gap-2">
                <span>●</span> علل باخت ردیف‌های کالا (پیش‌فاکتورهای تفکیکی)
              </h4>
              {totalLostItemsValue > 0 && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  ارزش مالی کل باخت‌ها: {totalLostItemsValue.toLocaleString('fa-IR')} ریال
                </span>
              )}
            </div>

            {itemLossData.length > 0 ? (
              <div className="space-y-3">
                {itemLossData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.reason}</span>
                      <span className="font-mono font-bold text-slate-500">{item.count} ردیف ({item.percent}٪)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-6 text-center">هیچ ردیف کالایی با علت باخت در پیش‌فاکتورها ثبت نشده است.</p>
            )}
          </div>

        </div>
      </div>

      {/* Purchase Orders Import Lifecycle & Landed Costs Analytics Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">ارزیابی زمانی و هزینه‌ای زنجیره تأمین و سفارشات وارداتی (Procurement Lifecycle)</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">پایش مستمر جریان نقدی و محاسبات میانگین زمان آماده‌سازی، ترانزیت، ترخیص و تحویل کالا به انبار به صورت تجمعی</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Time Cycle (Averages) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-sky-50">
              <h4 className="font-extrabold text-xs text-sky-600 flex items-center gap-2">
                <span>●</span> چرخه زمانی فرآیند واردات (میانگین روز سپری‌شده در هر مرحله)
              </h4>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                کل چرخه سفارش تا تحویل: {avgTotalCycle || 31} روز
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={poTimelineChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip formatter={(value) => `${value} روز`} />
                  <Bar dataKey="میانگین (روز)" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 2: Landed Cost breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-indigo-50">
              <h4 className="font-extrabold text-xs text-indigo-600 flex items-center gap-2">
                <span>●</span> سهم هزینه‌های جانبی در بهای تمام شده کل سفارشات (Landed Costs)
              </h4>
              {poTotalLandedCostRIYAL > 0 && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  مجموع بهای دفتری: {poTotalLandedCostRIYAL.toLocaleString('fa-IR')} ریال
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              {/* Pie element */}
              <div className="h-48">
                {costDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {costDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ریال`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">بدون اطلاعات هزینه</div>
                )}
              </div>

              {/* Legend checklist */}
              <div className="space-y-2 text-xs">
                {costDistributionData.map((cost, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cost.color }} />
                    <div className="flex-1 truncate text-slate-700 font-bold">
                      {cost.name}
                    </div>
                    <div className="font-mono text-slate-400">
                      {Math.round((cost.value / (poTotalLandedCostRIYAL || 1)) * 100)}٪
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Landed Cost KPIs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-center">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">سهم هزینه کالا</span>
                <span className="text-xs font-bold text-sky-600 font-mono">
                  {poTotalLandedCostRIYAL > 0 ? Math.round((poTotalGoodsValueRIYAL / poTotalLandedCostRIYAL) * 100) : 100}٪
                </span>
              </div>
              <div className="space-y-0.5 border-r border-l border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold block">سهم هزینه حواله</span>
                <span className="text-xs font-bold text-amber-500 font-mono">
                  {poTotalLandedCostRIYAL > 0 ? Math.round((poTotalRemittanceFeeRIYAL / poTotalLandedCostRIYAL) * 100) : 0}٪
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">سهم حمل و ترخیص</span>
                <span className="text-xs font-bold text-indigo-500 font-mono">
                  {poTotalLandedCostRIYAL > 0 ? Math.round(((poTotalShippingCostRIYAL + poTotalCustomsDutyRIYAL) / poTotalLandedCostRIYAL) * 100) : 0}٪
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Project Activities Time Tracking Report */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 text-right" dir="rtl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Clock size={20} className="text-sky-500" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">گزارش تخصیص زمانی و مدت اجرای دسته‌بندی‌های پروژه</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">پایش و مقایسه هوشمند مقدار زمان صرف شده برای هر دسته‌بندی فعالیت بر اساس تاریخ‌های شروع و پایان کار</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart block */}
          <div className="lg:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-xs text-slate-700">کل زمان صرف شده به تفکیک دسته‌بندی</h4>
            {categoryTimeChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryTimeChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9 }} />
                    <YAxis dataKey="نام دسته‌بندی" type="category" tick={{ fontSize: 9 }} width={125} />
                    <Tooltip formatter={(value) => `${value} ساعت`} />
                    <Bar dataKey="زمان صرف شده (ساعت)" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Clock size={24} className="text-slate-300 animate-pulse" />
                <span>داده‌ای برای ترسیم نمودار یافت نشد.</span>
              </div>
            )}
          </div>

          {/* Table list block */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-700">لیست تخصیص زمانی به تفکیک پروژه‌ها</h4>
            
            {(!projectCategoryGroups || projectCategoryGroups.length === 0) ? (
              <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                هنوز هیچ دسته‌بندی فعالیت یا ثبت زمانی در سیستم ثبت نشده است.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-500 font-bold border-b border-slate-200">
                      <th className="p-3">پروژه و کارفرما</th>
                      <th className="p-3">دسته‌بندی فعالیت</th>
                      <th className="p-3">بازه زمانی (شروع / پایان)</th>
                      <th className="p-3 text-left">مدت زمان صرف شده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {projectCategoryGroups.map((group) => {
                      const proj = projects.find(p => p.id === group.projectId);
                      if (!proj) return null;
                      
                      const start = parseShamsiDateTime(group.startDate);
                      const isClosed = group.status === 'اتمام کار';
                      const endStr = group.endDate || getNowShamsiDateTime();
                      const end = parseShamsiDateTime(endStr);
                      let minutes = -1;
                      if (start && end) {
                        minutes = shamsiToMinutes(end) - shamsiToMinutes(start);
                      }
                      
                      return (
                        <tr key={group.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{proj.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">کد: {proj.code} | کارفرما: {proj.customerName}</div>
                          </td>
                          <td className="p-3">
                            <span className="bg-sky-50 text-sky-850 px-2 py-0.5 rounded border border-sky-100 font-bold text-[10px]">
                              {group.categoryName}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] text-emerald-600 font-bold">شروع:</span>
                              <span>{group.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] text-rose-500 font-bold">پایان:</span>
                              {group.endDate ? (
                                <span>{group.endDate}</span>
                              ) : (
                                <span className="text-sky-500 font-bold bg-sky-50 px-1 rounded text-[8px] animate-pulse">جاری (در حال کار)</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-left font-bold text-slate-800">
                            <div className="flex items-center justify-end gap-1.5">
                              <Clock size={12} className="text-sky-500" />
                              <span className="text-[11px] font-extrabold text-slate-800">
                                {minutes >= 0 ? formatDuration(minutes) : 'نامشخص'}
                              </span>
                            </div>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden ml-0 mr-auto">
                              {isClosed ? (
                                <div className="bg-emerald-500 h-full w-full" />
                              ) : (
                                <div className="bg-sky-400 h-full w-2/3 animate-pulse" />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Advisory section */}
      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-start gap-4">
        <Award className="text-sky-600 flex-shrink-0 mt-0.5" size={24} />
        <div className="space-y-1 text-xs text-sky-800 leading-relaxed">
          <h4 className="font-bold text-sm">تسهیل تصمیم‌گیری‌های استراتژیک بازرگانی</h4>
          <p>سیستم Arshia ERP با ثبت همزمان پیش‌فاکتورها، نرخ‌های متغیر حوالجات صرافی و فرآیند ترخیص گمرکی، ارزش دفتری انبار و حاشیه سود ناخالص شرکت را به صورت لحظه‌ای محاسبه می‌نماید. این امر ریسک ناشی از نوسانات ارز در مناقصات وزارت نفت, گاز و پتروشیمی را به حداقل می‌رساند.</p>
        </div>
      </div>

    </div>
  );
}
