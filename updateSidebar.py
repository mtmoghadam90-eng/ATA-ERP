with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { \n  LayoutDashboard, \n  Users, \n  Briefcase, \n  FileText, \n  Package, \n  ShoppingCart, \n  TrendingUp, \n  CheckSquare, \n  Settings as SettingsIcon,\n  ArrowDownLeft,\n  Truck,\n  Inbox,\n  HelpCircle,\n  Boxes,\n  ShieldCheck,\n  LogOut,\n  X\n} from 'lucide-react';", "import { \n  LayoutDashboard, \n  Users, \n  Briefcase, \n  FileText, \n  Package, \n  ShoppingCart, \n  TrendingUp, \n  CheckSquare, \n  Settings as SettingsIcon,\n  ArrowDownLeft,\n  Truck,\n  Inbox,\n  HelpCircle,\n  Boxes,\n  Wrench,\n  ShieldCheck,\n  LogOut,\n  X\n} from 'lucide-react';")

content = content.replace("{ id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', icon: Boxes },", "{ id: 'packagingDelivery', name: 'بسته‌بندی و تحویل کالا', icon: Boxes },\n    { id: 'afterSalesServices', name: 'خدمات پس از فروش', icon: Wrench },")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
