with open('src/components/ProformasView.tsx', 'r') as f:
    content = f.read()

replacement = """              <p className="text-slate-500 text-xs">
                چنانچه بعضی از ردیف‌های پیش‌فاکتور برنده و بعضی دیگر بازنده شده‌اند، وضعیت هر ردیف را به صورت مستقل به همراه علت باخت ثبت کنید. این کار به صورت اتوماتیک وضعیت کل پروژه مادری را نیز همگام‌سازی خواهد کرد.
              </p>
              
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setEditingItemsList(prev => prev.map(item => ({ ...item, status: 'برنده' })))}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <CheckCircle size={14} />
                  همه برنده
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItemsList(prev => prev.map(item => ({ ...item, status: 'بازنده' })))}
                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <XCircle size={14} />
                  همه بازنده
                </button>
              </div>"""

content = content.replace("""              <p className="text-slate-500 text-xs">
                چنانچه بعضی از ردیف‌های پیش‌فاکتور برنده و بعضی دیگر بازنده شده‌اند، وضعیت هر ردیف را به صورت مستقل به همراه علت باخت ثبت کنید. این کار به صورت اتوماتیک وضعیت کل پروژه مادری را نیز همگام‌سازی خواهد کرد.
              </p>""", replacement)

with open('src/components/ProformasView.tsx', 'w') as f:
    f.write(content)
