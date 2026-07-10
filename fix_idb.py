import re

with open('src/useERPStore.ts', 'r') as f:
    content = f.read()

# Replace the force clear one
content = content.replace("localStorage.setItem('erp_project_category_groups', JSON.stringify([]));", "localStorage.setItem('erp_project_category_groups', JSON.stringify([]));\n        idbSet('erp_project_category_groups', []);")

# Replace try-catch blocks
pattern = r"try\s*\{\s*localStorage\.setItem\('erp_project_category_groups',\s*JSON\.stringify\((\w+)\)\);\s*\}\s*catch\s*\((\w+)\)\s*\{[^\}]+\}\s*"
# Wait, some catch blocks have alerts and multiple lines
pattern2 = r"try\s*\{\s*localStorage\.setItem\('erp_project_category_groups',\s*JSON\.stringify\((\w+)\)\);\s*\}\s*catch\s*\((\w+)\)\s*\{([\s\S]*?)\}"

def repl(m):
    var_name = m.group(1)
    return f"idbSet('erp_project_category_groups', {var_name}).catch(err => console.error('Failed to save to idb:', err));\n        "

content = re.sub(pattern2, repl, content)

with open('src/useERPStore.ts', 'w') as f:
    f.write(content)

