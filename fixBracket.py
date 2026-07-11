with open("src/useERPStore.ts", "r") as f:
    content = f.read()

content = content.replace("saveToServer('erp_project_category_groups', updatedGroups));", "saveToServer('erp_project_category_groups', updatedGroups);")

with open("src/useERPStore.ts", "w") as f:
    f.write(content)
