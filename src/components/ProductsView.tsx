import { parsePersianDate } from '../dateUtils';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Edit, 
  Trash2, 
  X
} from 'lucide-react';
import { Product, ProductVariant, ERPSettings, InventoryTransaction, ProductFeature } from '../types';
import { toShamsiStr, toGregorianStr } from '../dateUtils';
import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsDetailView from './CustomFieldsDetailView';
import ConfirmModal from './ConfirmModal';
import { uploadFile } from '../imageUtils';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ProductsViewProps {
  products: Product[];
  inventoryTransactions: InventoryTransaction[];
  addProduct: (product: Omit<Product, 'id' | 'stockLevel'> & { stockLevel?: number, transactionDate?: string, customValues?: Record<string, any> }) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (id: string, amount: number, variantId?: string, referenceId?: string, referenceType?: 'MANUAL' | 'PURCHASE_ORDER' | 'PROFORMA', notes?: string, transactionDate?: string) => void;
  batchImportProducts: (items: Array<{
    code?: string;
    name?: string;
    category?: string;
    supplyType?: 'INVENTORY' | 'ORDER';
    notes?: string;
    amt?: number;
    type?: string;
    dateVal?: string;
  }>) => { successCount: number; createCount: number };
  categories: string[];
  units: string[];
  settings: ERPSettings;
}

export default function ProductsView({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
  batchImportProducts,
  categories,
  settings,
  inventoryTransactions
}: ProductsViewProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'TRANSACTIONS'>('PRODUCTS');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Dynamic Custom Fields State
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [productToDeleteName, setProductToDeleteName] = useState<string>('');

  // Form states (Only Category, Equipment Type, and Technical Specs are managed in UI)
  const [displayName, setDisplayName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [supplyType, setSupplyType] = useState<'INVENTORY' | 'ORDER'>('INVENTORY');
  const [initialStock, setInitialStock] = useState<string>('0');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Batch upload modal state
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);

  // Stock adjust modal state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAdjustProd, setStockAdjustProd] = useState<Product | null>(null);
  const [stockAdjustAmount, setStockAdjustAmount] = useState('');
  const [stockAdjustType, setStockAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [stockAdjustNotes, setStockAdjustNotes] = useState('');
  const [stockAdjustVariantId, setStockAdjustVariantId] = useState('');

  // Trigger modal for adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setDisplayName('');
    setCategory(categories[0] || 'ابزار دقیق - فشار');
    setBrand('');
    setDescription('');
    setImages([]);
    setSupplyType('INVENTORY');
    setInitialStock('0');
    setProductCode('');
    setCustomValues({});
    setFeatures([]);
    setHasVariants(false);
    setVariants([]);
    setShowModal(true);
  };

  // Trigger modal for editing
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductCode(prod.code || '');
    setDisplayName(prod.displayName);
    setCategory(prod.category);
    setBrand(prod.brand || '');
    setDescription(prod.description);
    setImages(prod.images || []);
    setSupplyType(prod.supplyType === 'ORDER' ? 'ORDER' : 'INVENTORY');
    setCustomValues(prod.customValues || {});
    setFeatures(prod.features || []);
    setHasVariants(prod.hasVariants || false);
    setVariants(prod.variants || []);
    setShowModal(true);
  };

  // Handle Save (Add / Edit)

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventory_Template");

    // Add headers
    worksheet.columns = [
      { header: "کد کالا", key: "code", width: 15 },
      { header: "نام تجهیز", key: "name", width: 25 },
      { header: "دسته بندی", key: "category", width: 20 },
      { header: "برند", key: "brand", width: 15 },
      { header: "نوع تامین", key: "supplyType", width: 15 },
      { header: "تعداد تغییر / موجودی اولیه", key: "amount", width: 25 },
      { header: "نوع تغییر", key: "type", width: 15 },
      { header: "تاریخ", key: "date", width: 15 },
      { header: "توضیحات", key: "notes", width: 30 },
      { header: "ویژگی‌های قابل تنظیم", key: "features", width: 35 },
    ];

    // Add some sample rows
    worksheet.addRow({
      code: "EQ-12345", name: "پرشر ترانسمیتر", category: categories.length > 0 ? categories[0] : "ابزار دقیق - فشار", brand: "WIKA",
      supplyType: "INVENTORY", amount: 10, type: "IN", date: "1403/05/12", 
 notes: "خرید جدید",
      features: "سایز:۱ اینچ،۲ اینچ|متریال بدنه:استیل،برنج"
    });
    worksheet.addRow({
      code: "EQ-67890", name: "", category: "", brand: "",
      supplyType: "", amount: 5, type: "OUT", date: "", 
 notes: "مصرف پروژه"
    });

    // Add data validations for 200 rows
    let catList = '"بدون دسته بندی"';
    if (categories && categories.length > 0) {
      // exceljs requires comma separated string in double quotes for lists
      catList = '"' + categories.join(',') + '"';
    }
    
    for (let i = 2; i <= 200; i++) {
      // Category Dropdown (Column C)
      worksheet.getCell(`C${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [catList]
      };
      
      // Supply Type Dropdown (Column E)
      worksheet.getCell(`E${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"INVENTORY,ORDER"']
      };

      // Change Type Dropdown (Column G)
      worksheet.getCell(`G${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"IN,OUT"']
      };
    }

    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "Batch_Inventory_Template.xlsx");
  };

  const handleProcessBatch = async () => {
    if (!batchFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        // Helper to convert shamsi date to ISO
        const parseDate = (dateStr: string) => {
          if (!dateStr) return undefined;
          try {
            const str = String(dateStr).trim();
            if (/^(13|14)\d{2}[-/]\d{1,2}[-/]\d{1,2}/.test(str)) {
               const gStr = toGregorianStr(str);
               if (gStr) {
                 const d = new Date(gStr);
                 if (!isNaN(d.getTime())) return d.toISOString();
               }
            }
            const d = new Date(str);
            if (!isNaN(d.getTime())) return d.toISOString();
            return undefined;
          } catch {
            return undefined;
          }
        };

        const itemsToImport = jsonData.map(row => {
          const code = row["کد کالا"] || "";
          const amt = Number(row["تعداد تغییر / موجودی اولیه"]) || Number(row["تعداد تغییر"]);
          const type = row["نوع تغییر"];
          const notes = row["توضیحات"] || "ویرایش گروهی";
          const dateVal = row["تاریخ"] ? parseDate(String(row["تاریخ"])) : undefined;
          
          const name = row["نام تجهیز"];
          const category = row["دسته بندی"];
          const brand = row["برند"] || "";
          const supplyType = (row["نوع تامین"] === 'ORDER' ? 'ORDER' : 'INVENTORY') as 'INVENTORY' | 'ORDER';
          const featuresRaw = row["ویژگی‌های قابل تنظیم"] || "";

          return {
            code,
            name,
            category,
            brand,
            supplyType,
            notes,
            amt,
            type,
            dateVal,
            featuresRaw
          };
        });

        const { successCount, createCount } = batchImportProducts(itemsToImport);
        
        alert(`عملیات موفقیت آمیز بود. ${successCount} کالا بروزرسانی شد و ${createCount} کالای جدید تعریف شد.`);
        setBatchModalOpen(false);
        setBatchFile(null);
      } catch (err) {
        alert('خطا در پردازش فایل اکسل');
      }
    };
    reader.readAsArrayBuffer(batchFile);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Fields Validation
    const moduleFields = (settings?.customFields || []).filter(f => f.module === 'products');
    for (const field of moduleFields) {
      if (field.required) {
        const val = customValues[field.id];
        if (val === undefined || val === null || val === '') {
          alert(`لطفاً فیلد سفارشی اجباری "${field.name}" را تکمیل کنید.`);
          return;
        }
      }
    }

    if (!productCode.trim()) {
      alert('لطفاً کد کالا را وارد کنید.');
      return;
    }
    
    // Check for duplicate code
    const duplicate = products.find(p => p.code === productCode.trim() && p.id !== editingProduct?.id);
    if (duplicate) {
      alert('کد کالای وارد شده تکراری است. لطفاً کد دیگری انتخاب کنید.');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        displayName,
        name: displayName, // Synchronize name with displayName
        category,
        brand,
        description,
        images,
        supplyType,
        code: productCode.trim(),
        customValues,
        features,
        hasVariants,
        variants
      });
    } else {
      addProduct({
        displayName,
        name: displayName,
        category,
        brand,
        description,
        images,
        supplyType,
        code: productCode.trim(),
        modelNumber: "N/A",
        unit: "عدد",
        basePriceRIYAL: 0,
        minStockLevel: 0,
        stockLevel: supplyType === 'INVENTORY' ? (hasVariants ? variants.reduce((sum, v) => sum + (v.stockLevel || 0), 0) : Number(initialStock) || 0) : 0,
        customValues,
        features,
        hasVariants,
        variants
      });
    }
    setShowModal(false);
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">کاتالوگ تجهیزات ابزاردقیق</h1>
          <p className="text-slate-500 text-sm mt-1">تعریف مشخصات فنی، نوع تجهیزات و گروه‌بندی تخصصی کالاها</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => { setBatchFile(null); setBatchModalOpen(true); }}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2"
          >
            <Package size={16} />
            ورود/خروج گروهی
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            تعریف تجهیز جدید
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'PRODUCTS' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('PRODUCTS')}
        >
          فهرست کالاها
        </button>
        <button
          className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === 'TRANSACTIONS' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('TRANSACTIONS')}
        >
          تاریخچه تراکنش‌های انبار
        </button>
      </div>

      {activeTab === 'PRODUCTS' ? (
        <>
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="جستجو در نوع تجهیز، دسته‌بندی یا مشخصات فنی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition text-right"
          />
        </div>

        <div className="relative w-full md:w-64 flex items-center gap-2">
          <Filter size={16} className="text-slate-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition appearance-none text-right bg-white"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                <th className="p-4 w-1/3">نوع تجهیز و نام کالا</th>
                <th className="p-4 w-1/4">دسته‌بندی</th>
                <th className="p-4 w-1/4">مشخصات فنی و توضیحات</th>
                <th className="p-4 w-24">انبار و تامین</th>
                <th className="p-4 text-center w-28">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredProducts.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    {/* Display Name */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        {p.images && p.images.length > 0 ? (
                          <img
                            src={p.images[0]}
                            alt={p.displayName}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 flex-shrink-0">
                            <Package size={18} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 text-sm leading-snug">{p.displayName}</div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-1 text-[10px]">
                            {p.brand && (
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                                برند: {p.brand}
                              </span>
                            )}
                            {p.images && p.images.length > 0 && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium">
                                🖼️ {p.images.length} تصویر
                              </span>
                            )}
                          </div>

                          <div className="mt-1">
                            <CustomFieldsDetailView
                              module="products"
                              customFields={settings?.customFields || []}
                              customValues={p.customValues}
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-slate-600 font-medium">
                      {p.category}
                    </td>

                    {/* Technical Specifications / Description */}
                    <td className="p-4 max-w-md">
                      <p className="text-slate-500 leading-relaxed whitespace-pre-wrap line-clamp-3">
                        {p.description || 'ثبت نشده'}
                      </p>
                    </td>

                    {/* Stock & Supply Type */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        
                        {(() => {
                          const totalStock = p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : (p.stockLevel || 0);
                          const effectiveSupplyType = totalStock === 0 ? 'ORDER' : (p.supplyType || 'INVENTORY');
                          return (
                            <span className={`text-xs font-semibold px-2 py-1 rounded-md inline-block w-max ${
                              effectiveSupplyType === 'INVENTORY' ? 'bg-indigo-50 text-indigo-700' :
                              effectiveSupplyType === 'ORDER' ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {effectiveSupplyType === 'ORDER' ? 'قابل سفارش' : 'موجود در انبار'}
                            </span>
                          );
                        })()}
                        {(() => {
                          const totalStock = p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : (p.stockLevel || 0);
                          const effectiveSupplyType = totalStock === 0 ? 'ORDER' : (p.supplyType || 'INVENTORY');
                          return (effectiveSupplyType === 'INVENTORY') && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-slate-500 text-xs">موجودی:</span>
                            <span className={`text-sm font-bold ${(p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : p.stockLevel || 0) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {p.hasVariants && p.variants ? p.variants.reduce((acc, v) => acc + (v.stockLevel || 0), 0) : p.stockLevel || 0}
                            </span>
                          </div>
                        )})()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Adjust Stock */}
                        {(p.supplyType === 'INVENTORY' || !p.supplyType) && (
                          <button
                            onClick={() => {
                              setStockAdjustProd(p);
                              setStockAdjustAmount('');
                              setStockAdjustNotes('');
                              setStockAdjustType('IN');
                              setStockAdjustVariantId('');
                              setStockModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="ورود/خروج انبار"
                          >
                            <Package size={14} />
                          </button>
                        )}
                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition"
                          title="ویرایش تجهیز"
                        >
                          <Edit size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setProductToDeleteId(p.id);
                            setProductToDeleteName(p.displayName || p.name);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف تجهیز"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-12 text-slate-400 bg-white">
                    <Package className="mx-auto text-slate-300 mb-3" size={40} />
                    هیچ کالایی متناسب با فیلتر شما در سیستم ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                <th className="p-4 w-1/4">تاریخ</th>
                <th className="p-4 w-1/4">کالا</th>
                <th className="p-4 w-1/6 text-center">نوع</th>
                <th className="p-4 w-1/6 text-center">تعداد</th>
                <th className="p-4 w-1/3">توضیحات و رفرنس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {inventoryTransactions.length === 0 && (
                 <tr>
                    <td colSpan={5} className="text-center p-12 text-slate-400">هیچ تراکنشی یافت نشد.</td>
                 </tr>
              )}
              {inventoryTransactions.sort((a, b) => parsePersianDate(b.date).getTime() - parsePersianDate(a.date).getTime()).map(tr => {
                const p = products.find(prod => prod.id === tr.productId);
                return (
                  <tr key={tr.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono">{toShamsiStr(tr.date)}</td>
                    <td className="p-4 font-bold">{p ? p.displayName : 'کالای حذف شده'}</td>
                    <td className="p-4 text-center">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${tr.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                         {tr.type === 'IN' ? 'ورود' : 'خروج'}
                       </span>
                    </td>
                    <td className="p-4 text-center font-bold font-mono text-sm">{tr.quantity}</td>
                    <td className="p-4 text-slate-500 text-[11px] leading-tight">
                       {tr.referenceType && <div className="font-bold text-slate-700 mb-0.5">منبع: {tr.referenceType}</div>}
                       {tr.notes}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editingProduct ? `ویرایش اطلاعات فنی: ${editingProduct.displayName}` : 'تعریف تجهیز ابزاردقیق جدید'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">دسته‌بندی تخصصی ابزاردقیق *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Product Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">کد کالا *</label>
                  <input
                    type="text"
                    required
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="مثال: PRD-001"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-500">کد کالا باید یکتا باشد.</p>
                </div>

                {/* Equipment Type / Display Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">نوع تجهیز و نام کالا *</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="مثال: ترانسمیتر اختلاف فشار (DP Transmitter)"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-medium"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">برند (اختیاری)</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="مثال: WIKA, Rosemount, Siemens"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">


                  {/* Supply Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">نوع تامین</label>
                    <select
                      value={supplyType}
                      onChange={(e) => setSupplyType(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right bg-white"
                    >
                      <option value="INVENTORY">موجود در انبار</option>
                      <option value="ORDER">قابل سفارش</option>
                    </select>
                  </div>

                  {/* Initial Stock (Only for New Products & Inventory) */}
                  {!editingProduct && supplyType === 'INVENTORY' && !hasVariants && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-3 mt-3">
                      <label className="text-xs font-semibold text-emerald-600">موجودی اولیه در انبار</label>
                      <input
                        type="number"
                        min="0"
                        value={initialStock}
                        onChange={(e) => setInitialStock(e.target.value)}
                        placeholder="0"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-right font-medium bg-emerald-50/30"
                      />
                      <p className="text-[10px] text-slate-500">برای تغییر موجودی پس از تعریف کالا، از دکمه‌های ورود/خروج انبار استفاده کنید.</p>
                    </div>
                  )}


                </div>

                {/* Product Images */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">تصاویر محصول</label>
                  
                  {/* Drag and Drop Zone */}
                  <div className="border-2 border-dashed border-slate-250 hover:border-sky-500 rounded-xl p-4 transition text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files) {
                          for (const file of Array.from(files) as File[]) {
                            try {
                              const url = await uploadFile(file);
                              setImages(prev => [...prev, url]);
                            } catch (err: any) {
                              alert(err.message || 'خطا در بارگذاری تصویر محصول');
                            }
                          }
                        }
                        if (e.target) e.target.value = '';
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="text-slate-500 space-y-1">
                      <div className="text-xs font-bold text-slate-700">انتخاب یا رها کردن تصاویر کالا</div>
                      <div className="text-[10px] text-slate-400">فرمت‌های تصویری (JPG, PNG) - ذخیره‌سازی محلی</div>
                    </div>
                  </div>

                  {/* Thumbnail Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                          <img
                            src={img}
                            alt={`Product image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-700 z-20"
                            title="حذف تصویر"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description / Technical Specifications */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">مشخصات فنی و توضیحات</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="جزئیات متریال بدنه، اتصالات، کلاس کاری، رنج فشار یا دما، سیگنال خروجی و گواهینامه‌ها..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right leading-relaxed"
                  />
                </div>

                {/* Product Features Configuration */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">ویژگی‌های قابل تنظیم (کانفیگوراتور)</h4>
                      <p className="text-xs text-slate-500 mt-1">ویژگی‌هایی که در زمان پیش‌فاکتور قابل انتخاب هستند.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeatures([...features, { id: Date.now().toString(), name: '', options: [] }])}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
                    >
                      <Plus size={14} />
                      افزودن ویژگی
                    </button>
                  </div>
                  
                  {features.map((feature, fIndex) => (
                    <div key={feature.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                          <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], name: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="نام ویژگی (مثل: سایز)"
                            className="w-full sm:flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                          />
                          <input
                            type="text"
                            value={feature.code || ''}
                            onChange={(e) => {
                              const newF = [...features];
                              newF[fIndex] = { ...newF[fIndex], code: e.target.value };
                              setFeatures(newF);
                            }}
                            placeholder="کد (مثل: s)"
                            className="w-full sm:w-24 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sky-500 sm:text-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newF = [...features];
                            newF.splice(fIndex, 1);
                            setFeatures(newF);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-0.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {feature.options.map((opt, oIndex) => (
                            <div key={opt.id} className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                              <span className="px-2 text-xs font-medium">{opt.value}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newF = [...features];
                                  newF[fIndex] = {
                                    ...newF[fIndex],
                                    options: newF[fIndex].options.filter((_, idx) => idx !== oIndex)
                                  };
                                  setFeatures(newF);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                            <input
                              type="text"
                              id={`feature-input-${feature.id}`}
                              placeholder="مقدار جدید (برای چند مقدار با ویرگول جدا کنید)..."
                              className="w-full sm:flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-sky-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const inputEl = e.currentTarget;
                                  const val = inputEl.value.trim();
                                  if (val) {
                                    const vals = val.split(/[,،]/).map(v => v.trim()).filter(Boolean);
                                    if (vals.length > 0) {
                                      const newOptions = vals.map((v, i) => ({ id: Date.now().toString() + i.toString() + Math.random().toString(), value: v }));
                                      const newF = [...features];
                                      newF[fIndex] = {
                                        ...newF[fIndex],
                                        options: [...newF[fIndex].options, ...newOptions]
                                      };
                                      setFeatures(newF);
                                    }
                                    inputEl.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const inputEl = document.getElementById(`feature-input-${feature.id}`) as HTMLInputElement;
                                if (inputEl) {
                                  const val = inputEl.value.trim();
                                  if (val) {
                                    const vals = val.split(/[,،]/).map(v => v.trim()).filter(Boolean);
                                    if (vals.length > 0) {
                                      const newOptions = vals.map((v, i) => ({ id: Date.now().toString() + i.toString() + Math.random().toString(), value: v }));
                                      const newF = [...features];
                                      newF[fIndex] = {
                                        ...newF[fIndex],
                                        options: [...newF[fIndex].options, ...newOptions]
                                      };
                                      setFeatures(newF);
                                    }
                                    inputEl.value = '';
                                  }
                                }
                              }}
                              className="w-full sm:w-auto px-3 py-1.5 bg-sky-50 text-sky-600 font-semibold text-xs rounded-lg hover:bg-sky-100 transition whitespace-nowrap"
                            >
                              افزودن
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400">برای ثبت Enter بزنید یا روی دکمه افزودن کلیک کنید. برای ثبت چند مقدار همزمان از ویرگول (,) استفاده کنید.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Variants Configuration */}
                {features.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasVariants}
                        onChange={(e) => setHasVariants(e.target.checked)}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-800">مدیریت موجودی در سطح ویژگی‌ها (SKU)</span>
                    </label>

                    {hasVariants && (
                      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-slate-500">برای ترکیب‌های مختلف ویژگی‌ها کدهای کالا (SKU) و موجودی مجزا تعریف کنید.</p>
                          <button
                            type="button"
                            onClick={() => {
                              // Generate cartesian product of all feature options
                              const getCombinations = (featuresArr: ProductFeature[]): Record<string, string>[] => {
                                if (featuresArr.length === 0) return [{}];
                                const current = featuresArr[0];
                                const rest = getCombinations(featuresArr.slice(1));
                                const combos: Record<string, string>[] = [];
                                
                                if (current.options.length === 0) {
                                  return rest;
                                }

                                for (const opt of current.options) {
                                  for (const r of rest) {
                                    combos.push({ ...r, [current.name]: opt.value });
                                  }
                                }
                                return combos;
                              };

                              const combinations = getCombinations(features);
                              const pCode = productCode.trim() || 'SKU';
                              const newVariants = combinations.map((combo, i) => {
                                // Generate SKU
                                const skuParts = [pCode];
                                Object.entries(combo).forEach(([fName, fVal]) => {
                                  const feat = features.find(f => f.name === fName);
                                  if (feat) {
                                    const optIndex = feat.options.findIndex(o => o.value === fVal);
                                    if (optIndex !== -1) {
                                      const prefix = feat.code ? feat.code : '';
                                      skuParts.push(`${prefix}${optIndex + 1}`);
                                    }
                                  }
                                });
                                const generatedSku = skuParts.join('-');

                                // check if exists
                                const existing = variants.find(v => {
                                  const vKeys = Object.keys(v.attributes);
                                  const cKeys = Object.keys(combo);
                                  if (vKeys.length !== cKeys.length) return false;
                                  return vKeys.every(k => v.attributes[k] === combo[k]);
                                });
                                
                                if (existing) {
                                  return { ...existing, sku: existing.sku || generatedSku };
                                }

                                return {
                                  id: `var-${Date.now()}-${i}`,
                                  sku: generatedSku,
                                  attributes: combo,
                                  stockLevel: 0,
                                  minStockLevel: 0
                                };
                              });
                              setVariants(newVariants);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                          >
                            تولید ترکیب‌ها
                          </button>
                        </div>
                        
                        {variants.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="py-2 px-3 text-xs font-semibold text-slate-600">کد SKU</th>
                                  <th className="py-2 px-3 text-xs font-semibold text-slate-600">ترکیب</th>
                                  {supplyType === 'INVENTORY' && <th className="py-2 px-3 text-xs font-semibold text-slate-600">موجودی اولیه</th>}
                                  <th className="py-2 px-3 text-xs font-semibold text-slate-600">عملیات</th>
                                </tr>
                              </thead>
                              <tbody>
                                {variants.map((variant, vIdx) => (
                                  <tr key={variant.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100 transition">
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => {
                                          const newV = [...variants];
                                          newV[vIdx].sku = e.target.value;
                                          setVariants(newV);
                                        }}
                                        placeholder="SKU"
                                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-sky-500"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-xs text-slate-700 whitespace-nowrap">
                                      {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(' ، ')}
                                    </td>
                                    {supplyType === 'INVENTORY' && (
                                      <td className="py-2 px-3">
                                        <input
                                          type="number"
                                          min="0"
                                          value={variant.stockLevel}
                                          onChange={(e) => {
                                            const newV = [...variants];
                                            newV[vIdx].stockLevel = Number(e.target.value) || 0;
                                            setVariants(newV);
                                          }}
                                          className="w-20 border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-sky-500"
                                        />
                                      </td>
                                    )}
                                    <td className="py-2 px-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newV = [...variants];
                                          newV.splice(vIdx, 1);
                                          setVariants(newV);
                                        }}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded transition"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            هیچ ترکیب SKU ایجاد نشده است.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Custom Fields Form Section */}
                <CustomFieldsForm
                  module="products"
                  customFields={settings?.customFields || []}
                  customValues={customValues}
                  onChange={setCustomValues}
                />

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-sky-500/15"
                >
                  {editingProduct ? 'ثبت تغییرات تجهیز' : 'ذخیره تجهیز'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Adjust Stock Modal */}
      {stockModalOpen && stockAdjustProd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                ثبت ورود/خروج انبار
              </h3>
              <button 
                onClick={() => setStockModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const amt = Number(stockAdjustAmount);
              if (amt > 0) {
                if (stockAdjustProd.hasVariants && !stockAdjustVariantId) {
                  alert('لطفاً نوع (SKU) مورد نظر را انتخاب کنید.');
                  return;
                }
                
                const finalAmt = stockAdjustType === 'IN' ? amt : -amt;
                let currentStock = stockAdjustProd.stockLevel || 0;
                
                if (stockAdjustProd.hasVariants && stockAdjustVariantId) {
                  const variant = stockAdjustProd.variants?.find(v => v.id === stockAdjustVariantId);
                  if (variant) currentStock = variant.stockLevel || 0;
                }
                
                if (stockAdjustType === 'OUT' && currentStock < amt) {
                   if (!window.confirm('موجودی ثبت شده در سیستم برای این خروج کافی نیست. آیا مایلید با وجود مغایرت، موجودی منفی را در دفاتر انبار ثبت کنید؟')) return;
                }
                
                adjustProductStock(stockAdjustProd.id, finalAmt, stockAdjustVariantId || undefined, 'MANUAL', stockAdjustNotes);
                setStockModalOpen(false);
              }
            }} className="p-6 space-y-4">
              
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <div className="font-bold text-slate-800 mb-1">{stockAdjustProd.displayName}</div>
                {!stockAdjustProd.hasVariants && (
                  <div className="flex justify-between mt-2 text-xs">
                    <span>موجودی فعلی:</span>
                    <span className="font-bold">{stockAdjustProd.stockLevel || 0} عدد</span>
                  </div>
                )}
              </div>
              
              {stockAdjustProd.hasVariants && stockAdjustProd.variants && (
                <div className="space-y-1.5 mb-4">
                  <label className="text-xs font-semibold text-slate-500">انتخاب نوع (SKU) *</label>
                  <select
                    value={stockAdjustVariantId}
                    onChange={(e) => setStockAdjustVariantId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="">-- انتخاب کنید --</option>
                    {stockAdjustProd.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.sku} - {Object.values(v.attributes).join(', ')} (موجودی: {v.stockLevel || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setStockAdjustType('IN')}
                  className={`py-2 text-sm font-bold rounded-lg border ${stockAdjustType === 'IN' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  ورود به انبار
                </button>
                <button
                  type="button"
                  onClick={() => setStockAdjustType('OUT')}
                  className={`py-2 text-sm font-bold rounded-lg border ${stockAdjustType === 'OUT' ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  خروج از انبار
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">تعداد *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockAdjustAmount}
                  onChange={(e) => setStockAdjustAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none text-right font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">توضیحات (اختیاری)</label>
                <textarea
                  value={stockAdjustNotes}
                  onChange={(e) => setStockAdjustNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none text-right font-medium resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-5 py-2 text-white rounded-xl text-sm font-medium transition shadow-lg ${stockAdjustType === 'IN' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
                >
                  ثبت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Batch Upload Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                ورود و خروج گروهی با اکسل
              </h3>
              <button 
                onClick={() => setBatchModalOpen(false)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                برای ویرایش موجودی یا <strong>تعریف گروهی تجهیزات جدید</strong>، ابتدا فایل نمونه را دانلود کنید. <br/>
                - <strong>نوع تامین</strong>: برای کالاهای موجود در انبار مقدار <code>INVENTORY</code> و برای کالاهای سفارشی مقدار <code>ORDER</code> را وارد کنید.<br/>
                - <strong>کد کالا</strong>: اگر خالی باشد، سیستم به صورت خودکار یک کد جدید برای کالا ایجاد می‌کند.<br/>
                - <strong>تاریخ</strong>: تاریخ را می‌توانید به صورت شمسی (مثل 1403/05/12) وارد کنید. اگر خالی باشد، تاریخ امروز ثبت می‌شود.
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition text-sm flex items-center gap-2"
                >
                  دانلود قالب اکسل
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">آپلود فایل تکمیل شده</label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleProcessBatch}
                  disabled={!batchFile}
                  className="flex-1 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-500/20"
                >
                  پردازش و اعمال تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProductToDeleteId(null);
          setProductToDeleteName('');
        }}
        onConfirm={() => {
          if (productToDeleteId) {
            deleteProduct(productToDeleteId);
          }
        }}
        title="حذف کالا/تجهیز"
        message={`آیا از حذف کالا "${productToDeleteName}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />

    </div>
  );
}
