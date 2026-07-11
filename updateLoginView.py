import re

with open('src/components/LoginView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onLogin: (username: string, password?: string) => boolean;",
    "onLogin: (username: string, password?: string) => boolean | Promise<boolean>;"
)

content = content.replace(
    "const handleSubmit = (e: React.FormEvent) => {",
    "const handleSubmit = async (e: React.FormEvent) => {"
)

content = content.replace(
    "const success = onLogin(username.trim(), password);",
    "const success = await onLogin(username.trim(), password);"
)

with open('src/components/LoginView.tsx', 'w') as f:
    f.write(content)
