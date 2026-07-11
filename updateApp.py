with open('src/App.tsx', 'r') as f:
    content = f.read()

import_str = "import AfterSalesServicesView from './components/AfterSalesServicesView';\nimport PackagingDeliveryView from './components/PackagingDeliveryView';"
content = content.replace("import PackagingDeliveryView from './components/PackagingDeliveryView';", import_str)

access_str = """
              activeView === 'packagingDelivery' ? 'بسته‌بندی و تحویل کالا' :
              activeView === 'afterSalesServices' ? 'خدمات پس از فروش' :
"""
content = content.replace("activeView === 'packagingDelivery' ? 'بسته‌بندی و تحویل کالا' :", access_str)

render_str = """
      case 'afterSalesServices':
        return (
          <AfterSalesServicesView 
            afterSalesServices={store.afterSalesServices}
            projects={store.projects}
            proformas={store.proformas}
            addAfterSalesService={store.addAfterSalesService}
            updateAfterSalesService={store.updateAfterSalesService}
            deleteAfterSalesService={store.deleteAfterSalesService}
            settings={store.settings}
            currentUser={store.currentUser}
          />
        );
      case 'settings':
"""
content = content.replace("case 'settings':", render_str)

with open('src/App.tsx', 'w') as f:
    f.write(content)
