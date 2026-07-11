with open("src/components/SettingsView.tsx", "r") as f:
    content = f.read()

target = """  Bell
  Boxes,
  Wrench"""

replacement = """  Bell,
  Boxes,
  Wrench"""

content = content.replace(target, replacement)

with open("src/components/SettingsView.tsx", "w") as f:
    f.write(content)
