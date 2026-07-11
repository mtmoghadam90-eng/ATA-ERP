with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('message={store.completionPrompt?.message || \'\'}', 'message={store.completionPrompt?.message || \'\'}\n        confirmText="بله، تغییر یابد"\n        cancelText="انصراف"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
