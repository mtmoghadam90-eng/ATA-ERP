with open("src/components/ProformasView.tsx", "r") as f:
    content = f.read()

target = """                          {/* Computed Status Badge */}
                          <td className="p-4 text-center">
                            {(() => {
                               const items = pf.items || [];"""
                               
replacement = """                          {/* Computed Status Badge */}
                          <td className="p-4 text-center">
                            {(() => {
                               if (pf.status === 'لغو شده') return <span className="px-2.5 py-1 rounded-full font-bold text-[10px] border bg-slate-200 text-slate-700 border-slate-300 shadow-sm">لغو شده</span>;
                               const items = pf.items || [];"""

content = content.replace(target, replacement)

with open("src/components/ProformasView.tsx", "w") as f:
    f.write(content)

