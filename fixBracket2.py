import re
with open("src/useERPStore.ts", "r") as f:
    content = f.read()

content = re.sub(r"saveToServer\('erp_project_category_groups', (.*?)\)\);", r"saveToServer('erp_project_category_groups', \1);", content)

with open("src/useERPStore.ts", "w") as f:
    f.write(content)
