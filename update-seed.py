with open("src/seedData.ts", "r") as f:
    content = f.read()

content = content.replace(
    "{ id: 'rate-3', currency: 'AED', name: 'درهم امارات', rateToRIYAL: 171000, lastUpdated: '2026-07-05T09:00:00Z' }",
    "{ id: 'rate-3', currency: 'AED', name: 'درهم امارات', rateToRIYAL: 171000, lastUpdated: '2026-07-05T09:00:00Z' },\n  { id: 'rate-4', currency: 'CNY', name: 'یوان چین', rateToRIYAL: 86000, lastUpdated: '2026-07-05T09:00:00Z' }"
)

with open("src/seedData.ts", "w") as f:
    f.write(content)
