import React, { useState } from 'react';
import { Clock, ShieldAlert, UserCheck, Eye, EyeOff, Lock } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string, password?: string) => boolean | Promise<boolean>;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('لطفاً نام کاربری و رمز ورود را وارد نمایید.');
      return;
    }

    const success = await onLogin(username.trim(), password);
    if (!success) {
      setError('نام کاربری یا رمز ورود اشتباه است. لطفاً مجدداً تلاش کنید.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-right" dir="rtl">
      <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>

        {/* Brand Header */}
        <div className="p-8 text-center bg-slate-900/60 border-b border-slate-800/50">
          <div className="mx-auto w-12 h-12 bg-sky-500 rounded-xl text-white flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4">
            <Clock className="animate-spin-slow text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-100">سامانه جامع ERP ابزار تامین ارشیا</h1>
          <p className="text-xs text-sky-400 mt-1.5 tracking-wider font-mono">ARSHIA ERP PORTAL v2.5</p>
        </div>

        {/* System Access Alert */}
        <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-850 flex items-start gap-3">
          <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-amber-500">حفاظت دسترسی و امنیت اطلاعات:</span>
            <span className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              ورود به این سامانه منحصر به پرسنل و کاربران مجاز شرکت ابزار تامین ارشیا می‌باشد. دسترسی‌ها توسط مدیریت ارشد سیستم کنترل و تخصیص داده می‌شود.
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-rose-400 text-xs text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">نام کاربری ورود (به انگلیسی)</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: mohammad"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500/50 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500/10 outline-none text-left font-mono"
                  dir="ltr"
                />
                <UserCheck className="absolute right-3 top-3 text-slate-500" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">رمز ورود</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500/50 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500/10 outline-none text-left font-mono"
                  dir="ltr"
                />
                <Lock className="absolute right-3 top-3 text-slate-500" size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-sky-600/15 transition-all mt-2"
            >
              ورود به سامانه
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/30 border-t border-slate-850/60 text-center text-[10px] text-slate-600">
          <span>شرکت ابزار تامین ارشیا © 2026</span>
        </div>
      </div>
    </div>
  );
}
