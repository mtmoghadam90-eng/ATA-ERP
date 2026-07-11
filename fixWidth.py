with open("src/components/ProformasView.tsx", "r") as f:
    content = f.read()

target = """                          {/* Items description column */}
                          <td className="p-4">
                            <div className="max-w-md space-y-1">"""

replacement = """                          {/* Items description column */}
                          <td className="p-4">
                            <div className="space-y-1">"""

content = content.replace(target, replacement)

with open("src/components/ProformasView.tsx", "w") as f:
    f.write(content)

