with open('src/useERPStore.ts', 'r') as f:
    content = f.read()

init_code = """
      const storedAfterSales = localStorage.getItem('erp_after_sales_services');
      if (storedAfterSales) {
        setAfterSalesServices(JSON.parse(storedAfterSales));
      } else {
        localStorage.setItem('erp_after_sales_services', JSON.stringify([]));
      }
"""

content = content.replace("const storedDeliveries = localStorage.getItem('erp_packaging_deliveries');", init_code + "\n      const storedDeliveries = localStorage.getItem('erp_packaging_deliveries');")

with open('src/useERPStore.ts', 'w') as f:
    f.write(content)
