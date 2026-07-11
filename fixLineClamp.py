with open("src/components/ProformasView.tsx", "r") as f:
    content = f.read()

target = """                              <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                {pf.items && pf.items.length > 0 
                                   ? pf.items.map(item => `${item.productName} (${item.quantity} ${item.status === 'برنده' ? '✅' : item.status === 'بازنده' ? '❌' : ''})`).join('، ') 
                                   : 'فاقد کالا'}
                              </div>"""

replacement = """                              <div className="text-[10px] text-slate-500 line-clamp-4 leading-relaxed">
                                {pf.items && pf.items.length > 0 
                                   ? pf.items.map(item => `${item.productName} (${item.quantity} ${item.status === 'برنده' ? '✅' : item.status === 'بازنده' ? '❌' : ''})`).join('، ') 
                                   : 'فاقد کالا'}
                              </div>"""

content = content.replace(target, replacement)

with open("src/components/ProformasView.tsx", "w") as f:
    f.write(content)

