import re
with open("src/useERPStore.ts", "r") as f:
    content = f.read()

# Replace localStorage.setItem('key', JSON.stringify(updated)) with saveToServer('key', updated)
# but only for erp_* keys except erp_current_user and erp_simulated_role
def replacer(match):
    key = match.group(1)
    data = match.group(2)
    if key in ('erp_current_user', 'erp_simulated_role') or key.startswith('read_notifications_'):
        return match.group(0) # don't touch
    return f"saveToServer('{key}', {data})"

content = re.sub(r"localStorage\.setItem\('([^']+)', JSON\.stringify\(([^)]+)\)\)", replacer, content)

with open("src/useERPStore.ts", "w") as f:
    f.write(content)
