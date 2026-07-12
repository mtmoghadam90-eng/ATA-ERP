with open("server.ts", "r") as f:
    content = f.read()

content = content.replace("AED: 171000", "AED: 171000,\n      CNY: 86000")
content = content.replace("'https://www.tgju.org/profile/price_aed'", "'https://www.tgju.org/profile/price_aed',\n      CNY: 'https://www.tgju.org/profile/price_cny'")

with open("server.ts", "w") as f:
    f.write(content)
