with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace("Boxes\n} from 'lucide-react';", "Boxes,\n  Wrench\n} from 'lucide-react';")

content = content.replace("{ id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', icon: Boxes },", "{ id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', icon: Boxes },\n    { id: 'afterSalesServices', name: 'خدمات پس از فروش', icon: Wrench },")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
