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
import { Product, ERPSettings, InventoryTransaction } from '../types';
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
  adjustProductStock: (id: string, amount: number, referenceId?: string, referenceType?: 'MANUAL' | 'PURCHASE_ORDER' | 'PROFORMA', notes?: string, transactionDate?: string) => void;
  batchImportProducts: (items: Array<{
    code?: string;
    name?: string;
    category?: string;
    supplyType?: 'INVENTORY' | 'ORDER';
    notes?: string;
    size?: string;
    measurementRange?: string;
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
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [measurementRange, setMeasurementRange] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [supplyType, setSupplyType] = useState<'INVENTORY' | 'ORDER'>('INVENTORY');
  const [initialStock, setInitialStock] = useState<string>('0');

  // Batch upload modal state
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);

  // Stock adjust modal state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAdjustProd, setStockAdjustProd] = useState<Product | null>(null);
  const [stockAdjustAmount, setStockAdjustAmount] = useState('');
  const [stockAdjustType, setStockAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [stockAdjustNotes, setStockAdjustNotes] = useState('');

  // Trigger modal for adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setDisplayName('');
    setCategory(categories[0] || 'ابزار دقیق - فشار');
    setBrand('');
    setDescription('');
    setSize('');
    setMeasurementRange('');
    setImages([]);
    setSupplyType('INVENTORY');
    setInitialStock('0');
    setCustomValues({});
    setShowModal(true);
  };

  // Trigger modal for editing
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setDisplayName(prod.displayName);
    setCategory(prod.category);
    setBrand(prod.brand || '');
    setDescription(prod.description);
    setSize(prod.size || '');
    setMeasurementRange(prod.measurementRange || '');
    setImages(prod.images || []);
    setSupplyType(prod.supplyType === 'ORDER' ? 'ORDER' : 'INVENTORY');
    setCustomValues(prod.customValues || {});
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
      { header: "سایز", key: "size", width: 15 },
      { header: "رنج اندازه گیری", key: "mRange", width: 20 },
      { header: "توضیحات", key: "notes", width: 30 },
    ];

    // Add some sample rows
    worksheet.addRow({
      code: "EQ-12345", name: "پرشر ترانسمیتر", category: categories.length > 0 ? categories[0] : "ابزار دقیق - فشار", brand: "WIKA",
      supplyType: "INVENTORY", amount: 10, type: "IN", date: "1403/05/12", 
      size: "2 inch", mRange: "0-10 bar", notes: "خرید جدید"
    });
    worksheet.addRow({
      code: "EQ-67890", name: "", category: "", brand: "",
      supplyType: "", amount: 5, type: "OUT", date: "", 
      size: "", mRange: "", notes: "مصرف پروژه"
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
          const size = row["سایز"] || "";
          const mRange = row["رنج اندازه گیری"] || "";

          return {
            code,
            name,
            category,
            brand,
            supplyType,
            notes,
            size,
            measurementRange: mRange,
            amt,
            type,
            dateVal
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

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        displayName,
        name: displayName, // Synchronize name with displayName
        category,
        brand,
        description,
        size,
        measurementRange,
        images,
        supplyType,
        customValues
      });
    } else {
      addProduct({
        displayName,
        name: displayName,
        category,
        brand,
        description,
        size,
        measurementRange,
        images,
        supplyType,
        code: "EQ-" + Math.floor(10000 + Math.random() * 90000),
        modelNumber: "N/A",
        unit: "عدد",
        basePriceRIYAL: 0,
        minStockLevel: 0,
        stockLevel: supplyType === 'INVENTORY' ? Number(initialStock) || 0 : 0,
        customValues
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
                            {p.size && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                                سایز: {p.size}
                              </span>
                            )}
                            {p.measurementRange && (
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-medium">
                                رنج: {p.measurementRange}
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
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md inline-block w-max ${
                          p.supplyType === 'INVENTORY' ? 'bg-indigo-50 text-indigo-700' :
                          p.supplyType === 'ORDER' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {p.supplyType === 'ORDER' ? 'قابل سفارش' : 'موجود در انبار'}
                        </span>
                        {(p.supplyType === 'INVENTORY' || !p.supplyType) && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-slate-500 text-xs">موجودی:</span>
                            <span className={`text-sm font-bold ${(p.stockLevel || 0) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {p.stockLevel || 0}
                            </span>
                          </div>
                        )}
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
                  {/* Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">سایز (Size)</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="مثال: '2 یا DN50"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-medium"
                    />
                  </div>

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
                  {!editingProduct && supplyType === 'INVENTORY' && (
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

                  {/* Measurement Range */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">رنج اندازه‌گیری (Range)</label>
                    <input
                      type="text"
                      value={measurementRange}
                      onChange={(e) => setMeasurementRange(e.target.value)}
                      placeholder="مثال: 0 to 10 bar"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right font-medium"
                    />
                  </div>
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
                const finalAmt = stockAdjustType === 'IN' ? amt : -amt;
                if (stockAdjustType === 'OUT' && (stockAdjustProd.stockLevel || 0) < amt) {
                   alert('موجودی انبار کافی نیست.');
                   return;
                }
                adjustProductStock(stockAdjustProd.id, finalAmt, undefined, 'MANUAL', stockAdjustNotes);
                setStockModalOpen(false);
              }
            }} className="p-6 space-y-4">
              
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <div className="font-bold text-slate-800 mb-1">{stockAdjustProd.displayName}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span>موجودی فعلی:</span>
                  <span className="font-bold">{stockAdjustProd.stockLevel || 0} عدد</span>
                </div>
              </div>

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
