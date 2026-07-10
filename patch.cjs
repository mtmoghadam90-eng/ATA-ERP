const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {renderActiveView()}
      </main>`;

const replacement = `      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shrink-0">
          <div className="font-bold text-slate-800 text-sm md:text-base hidden sm:block">سیستم مدیریت منابع سازمانی</div>
          <div className="flex items-center gap-5 mr-auto">
             <button 
               className="relative text-slate-500 hover:text-amber-600 transition p-1"
               onClick={() => setActiveView('referrals')}
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
               onClick={() => setActiveView('dashboard')} 
               title="اعلان‌های سیستم"
             >
               <Bell size={22} />
               {unreadNotifs.length > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] font-bold flex justify-center items-center rounded-full text-white shadow-sm border-2 border-white">
                   {unreadNotifs.length}
                 </span>
               )}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {renderActiveView()}
        </div>
      </main>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
}
