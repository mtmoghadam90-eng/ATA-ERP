import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import ProductsView from './components/ProductsView';
import ProformasView from './components/ProformasView';
import PurchaseOrdersView from './components/PurchaseOrdersView';
import SuppliersView from './components/SuppliersView';
import ProjectsView from './components/ProjectsView';
import TransactionsView from './components/TransactionsView';
import RatesView from './components/RatesView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import ReferralsView from './components/ReferralsView';
import UsersView from './components/UsersView';
import LoginView from './components/LoginView';
import { useERPStore } from './useERPStore';
import { ShieldAlert, Bell, Inbox } from 'lucide-react';

export default function App() {
  const store = useERPStore();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [referralsTab, setReferralsTab] = useState<'toMe' | 'fromMe' | 'notifications'>('toMe');

  if (!store.isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-300">در حال راه‌اندازی سامانه ERP ابزار تامین ارشیا...</p>
      </div>
    );
  }

  // If there is no user logged in, intercept and show the LoginView
  if (!store.currentUser) {
    return <LoginView onLogin={store.login} />;
  }

  const renderActiveView = () => {
    // Granular Module Permission Check
    const hasPermission = store.currentUser && (!store.currentUser.permissions || store.currentUser.permissions[activeView as keyof typeof store.currentUser.permissions] !== false);
    if (!hasPermission) {
      return (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4 text-right" dir="rtl">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">عدم دسترسی به ماژول</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            حساب کاربری شما اجازه دسترسی به ماژول «{
              activeView === 'users' ? 'مدیریت کاربران' : 
              activeView === 'settings' ? 'تنظیمات سیستم' : 
              activeView === 'transactions' ? 'دریافت و پرداخت ریالی' :
              activeView === 'reports' ? 'گزارشات و نمودارها' : 
              activeView
            }» را ندارد.
            لطفاً در صورت نیاز به این بخش، با مدیریت ارشد سیستم (محمد توکل مقدم) هماهنگ فرمایید.
          </p>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            products={store.products}
            customers={store.customers}
            projects={store.projects}
            proformas={store.proformas}
            purchaseOrders={store.purchaseOrders}
            exchangeRates={store.exchangeRates}
            tasks={store.tasks}
            setActiveTab={setActiveView}
            lowStockProducts={store.products.filter(p => p.stockLevel <= p.minStockLevel)}
          />
        );
      case 'customers':
        return (
          <CustomersView 
            customers={store.customers}
            addCustomer={store.addCustomer}
            updateCustomer={store.updateCustomer}
            deleteCustomer={store.deleteCustomer}
            batchUpdateCustomers={store.batchUpdateCustomers}
            industries={store.settings.dropdownItems.industries}
            settings={store.settings}
          />
        );
      case 'products':
        return (
          <ProductsView 
            products={store.products}
            addProduct={store.addProduct}
            updateProduct={store.updateProduct}
            deleteProduct={store.deleteProduct}
            adjustProductStock={store.adjustProductStock}
            categories={store.settings.dropdownItems.categories}
            units={store.settings.dropdownItems.units}
            settings={store.settings}
          />
        );
      case 'proformas':
        return (
          <ProformasView 
            proformas={store.proformas}
            customers={store.customers}
            projects={store.projects}
            products={store.products}
            settings={store.settings}
            exchangeRates={store.exchangeRates}
            addProforma={store.addProforma}
            updateProforma={store.updateProforma}
            updateProformaStatus={store.updateProformaStatus}
            batchUpdateProjectProformasStatus={store.batchUpdateProjectProformasStatus}
            deleteProforma={store.deleteProforma}
            addCustomer={store.addCustomer}
            addProject={store.addProject}
            addProduct={store.addProduct}
            users={store.users}
            currentUser={store.currentUser}
          />
        );
      case 'purchaseOrders':
        return (
          <PurchaseOrdersView 
            purchaseOrders={store.purchaseOrders}
            suppliers={store.suppliers}
            projects={store.projects}
            products={store.products}
            exchangeRates={store.exchangeRates}
            proformas={store.proformas}
            addPurchaseOrder={store.addPurchaseOrder}
            updatePurchaseOrder={store.updatePurchaseOrder}
            updatePurchaseOrderStatus={store.updatePurchaseOrderStatus}
            deletePurchaseOrder={store.deletePurchaseOrder}
            settings={store.settings}
            addSupplier={store.addSupplier}
            addProject={store.addProject}
            addProduct={store.addProduct}
            customers={store.customers}
            addCustomer={store.addCustomer}
          />
        );
      case 'suppliers':
        return (
          <SuppliersView 
            suppliers={store.suppliers}
            addSupplier={store.addSupplier}
            updateSupplier={store.updateSupplier}
            deleteSupplier={store.deleteSupplier}
            settings={store.settings}
          />
        );
      case 'projects':
        return (
          <ProjectsView 
            projects={store.projects}
            customers={store.customers}
            products={store.products}
            proformas={store.proformas}
            addProject={store.addProject}
            updateProject={store.updateProject}
            deleteProject={store.deleteProject}
            settings={store.settings}
            projectCategoryGroups={store.projectCategoryGroups}
            addProjectCategoryGroup={store.addProjectCategoryGroup}
            addProjectActivity={store.addProjectActivity}
            completeProjectCategoryGroup={store.completeProjectCategoryGroup}
            resumeProjectCategoryGroup={store.resumeProjectCategoryGroup}
            currentUser={store.currentUser}
            addCustomer={store.addCustomer}
            addProduct={store.addProduct}
            users={store.users}
          />
        );
      case 'referrals':
        return (
          <ReferralsView 
            initialTab={referralsTab}
            readItems={store.readItems}
            markItemsAsRead={store.markItemsAsRead}
            users={store.users}
            projectCategoryGroups={store.projectCategoryGroups}
            projects={store.projects}
            respondToReferral={store.respondToReferral}
            toggleReferralStatus={store.toggleReferralStatus}
            currentUser={store.currentUser}
            settings={store.settings}
            moduleNotifications={store.moduleNotifications}
            markModuleNotificationAsRead={store.markModuleNotificationAsRead}
            markAllModuleNotificationsAsRead={store.markAllModuleNotificationsAsRead}
          />
        );
      case 'transactions':
        return (
          <TransactionsView 
            transactions={store.transactions}
            customers={store.customers}
            suppliers={store.suppliers}
            projects={store.projects}
            addTransaction={store.addTransaction}
            deleteTransaction={store.deleteTransaction}
            settings={store.settings}
            addCustomer={store.addCustomer}
            addSupplier={store.addSupplier}
            addProject={store.addProject}
          />
        );
      case 'rates':
        return (
          <RatesView 
            exchangeRates={store.exchangeRates}
            updateExchangeRate={store.updateExchangeRate}
            fetchRatesFromAPI={store.fetchRatesFromAPI}
          />
        );
      case 'tasks':
        return (
          <TasksView 
            tasks={store.tasks}
            customers={store.customers}
            projects={store.projects}
            addTask={store.addTask}
            updateTask={store.updateTask}
            deleteTask={store.deleteTask}
            settings={store.settings}
            currentUser={store.currentUser}
            addCustomer={store.addCustomer}
            addProject={store.addProject}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            projects={store.projects}
            products={store.products}
            transactions={store.transactions}
            proformas={store.proformas}
            purchaseOrders={store.purchaseOrders}
            settings={store.settings}
            projectCategoryGroups={store.projectCategoryGroups}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            settings={store.settings}
            updateSettings={store.updateSettings}
            userRole={store.userRole}
            changeRole={store.changeRole}
            projectCategoryGroups={store.projectCategoryGroups}
            users={store.users}
            currentUser={store.currentUser}
            projects={store.projects}
          />
        );
      case 'users':
        return (
          <UsersView 
            users={store.users}
            settings={store.settings}
            currentUser={store.currentUser}
            addUser={store.addUser}
            updateUser={store.updateUser}
            deleteUser={store.deleteUser}
          />
        );
      default:
        return <div className="text-slate-500">محیط در حال ساخت...</div>;
    }
  };

  const currentUserName = store.currentUser?.fullName || 'محمد توکل مقدم';
  const isManagerOrAdmin = store.currentUser?.role === 'admin' || store.currentUser?.isSystemAdmin;

  const readItems = new Set(store.readItems || []);

  let groupedNotifsUnread = 0;
  (store.projectCategoryGroups || []).forEach(group => {
    const cat = store.settings?.activityCategories?.find(c => c.id === group.categoryId);
    const isResponsible = isManagerOrAdmin || cat?.responsibleUserId === currentUserName;
    
    (group.activities || []).forEach((act) => {
      if (isResponsible) {
        if (!readItems.has(act.id)) groupedNotifsUnread++;
      }
      if (act.referral) {
        let messages = act.referral.messages ? [...act.referral.messages] : [];
        if (messages.length === 0 && act.referral.response) {
          messages = [act.referral.response];
        }
        messages.forEach((msg: any, idx: number) => {
           if (isResponsible || act.referral?.assignedBy === currentUserName) {
             const id = msg.id || `${act.id}-msg-${msg.timestamp || parseInt(act.id.split('-').pop() || '0', 10) + idx + 1}`;
             if (!readItems.has(id)) groupedNotifsUnread++;
           }
        });
      }
    });
  });

  const unreadNotifsCount = (store.moduleNotifications || []).filter(n => !n.read && n.responsibleName === currentUserName).length;
  const totalUnreadCount = unreadNotifsCount + groupedNotifsUnread;

  const pendingReferrals = (store.projectCategoryGroups || []).flatMap(g => g.activities || [])
    .filter(a => a.referral && a.referral.status === 'در انتظار اقدام' && a.referral.assignedTo === currentUserName);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-right" dir="rtl">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeView} 
        setActiveTab={setActiveView} 
        taskCount={store.tasks.filter(t => t.status !== 'انجام شده').length}
        lowStockCount={store.products.filter(p => p.stockLevel <= p.minStockLevel).length}
        userRole={store.userRole}
        changeRole={store.changeRole}
        referralsCount={pendingReferrals.length}
        currentUser={store.currentUser}
        onLogout={store.logout}
        sidebarModuleOrder={store.settings.sidebarModuleOrder}
      />

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shrink-0">
          <div className="font-bold text-slate-800 text-sm md:text-base hidden sm:block">سیستم مدیریت منابع سازمانی</div>
          <div className="flex items-center gap-5 mr-auto">
             <button 
               className="relative text-slate-500 hover:text-amber-600 transition p-1"
               onClick={() => { setReferralsTab('toMe'); setActiveView('referrals'); }}
               title="ارجاعات کار (نیاز به اقدام)"
             >
               <Inbox size={22} />
               {pendingReferrals.length > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-[10px] font-bold flex justify-center items-center rounded-full text-white shadow-sm border-2 border-white">
                   {pendingReferrals.length}
                 </span>
               )}
             </button>
             <button 
               className="relative text-slate-500 hover:text-rose-600 transition p-1"
               onClick={() => { setReferralsTab('notifications'); setActiveView('referrals'); }} 
               title="اعلان‌های سیستم"
             >
               <Bell size={22} />
               {totalUnreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] font-bold flex justify-center items-center rounded-full text-white shadow-sm border-2 border-white">
                   {totalUnreadCount}
                 </span>
               )}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {renderActiveView()}
        </div>
      </main>

    </div>
  );
}
