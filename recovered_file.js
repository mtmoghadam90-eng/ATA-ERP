import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=fef82772"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=fef82772"; const useState = __vite__cjsImport1_react["useState"];
import {
  Package,
  Plus,
  Trash2,
  Check,
  X,
  Printer,
  Upload,
  ClipboardCheck,
  Truck,
  Calendar,
  FileText,
  Search,
  Info,
  FileCheck,
  Edit
} from "/node_modules/.vite/deps/lucide-react.js?v=fef82772";
import { getTodayShamsi } from "/src/dateUtils.ts";
import ConfirmModal from "/src/components/ConfirmModal.tsx";
export default function PackagingDeliveryView({
  projects,
  proformas,
  packagingDeliveries,
  addPackagingDelivery,
  updatePackagingDelivery,
  deletePackagingDelivery,
  settings,
  currentUser
}) {
  const activeTemplate = settings.proformaTemplates?.find((t) => t.name === settings.activeTemplateId) || settings.proformaTemplates?.[0];
  const [activeTab, setActiveTab] = useState("list");
  const [filterProject, setFilterProject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeliveryId, setEditingDeliveryId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProformaId, setSelectedProformaId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(getTodayShamsi());
  const [shippingMethod, setShippingMethod] = useState(settings.dropdownItems.shippingMethods?.[0] || "باربری");
  const [preDeliveryTestNotes, setPreDeliveryTestNotes] = useState("");
  const [packingItems, setPackingItems] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [tempItemName, setTempItemName] = useState("");
  const [tempItemQty, setTempItemQty] = useState(1);
  const [tempItemPackType, setTempItemPackType] = useState(settings.dropdownItems.packageTypes?.[0] || "کارتن");
  const [tempItemWidth, setTempItemWidth] = useState("");
  const [tempItemLength, setTempItemLength] = useState("");
  const [tempItemHeight, setTempItemHeight] = useState("");
  const [tempItemWeight, setTempItemWeight] = useState(0);
  const [tempItemBoxNumber, setTempItemBoxNumber] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deleteDeliveryId, setDeleteDeliveryId] = useState(null);
  const [deleteActivitiesWithDelivery, setDeleteActivitiesWithDelivery] = useState(false);
  const availableProformas = proformas.filter(
    (p) => p.projectId === selectedProjectId && p.status === "تأیید شده (برنده)"
  );
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedProformaId("");
    setPackingItems([]);
    const template = settings.deliveryChecklistTemplate || [];
    setChecklist(
      template.map((text) => ({
        name: text,
        completed: false
      }))
    );
  };
  const handleProformaChange = (proformaId) => {
    setSelectedProformaId(proformaId);
    if (!proformaId) {
      setPackingItems([]);
      return;
    }
    const prof = proformas.find((p) => p.id === proformaId);
    if (prof) {
      const defaultPackingItems = prof.items.map((item, idx) => ({
        id: `pack-item-auto-${idx}-${Date.now()}`,
        itemOrDocName: `${item.productName} (${item.brand})`,
        productId: item.productId,
        quantity: item.quantity,
        packageType: "کارتن",
        dimensions: "50x40x30 سانتی‌متر",
        weight: 1
      }));
      setPackingItems(defaultPackingItems);
    }
  };
  const handlePhotoUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhotos((prev) => [...prev, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhotos((prev) => [...prev, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleAddCustomItem = () => {
    if (!tempItemName.trim()) {
      alert("لطفاً نام کالا یا مدرک را وارد کنید.");
      return;
    }
    const dimensions = tempItemLength && tempItemWidth && tempItemHeight ? `${tempItemLength}x${tempItemWidth}x${tempItemHeight} سانتی‌متر` : "نامشخص";
    const newItem = {
      id: `pack-item-custom-${Date.now()}`,
      itemOrDocName: tempItemName.trim(),
      quantity: tempItemQty,
      packageType: tempItemPackType,
      dimensions,
      weight: tempItemWeight,
      boxNumber: tempItemBoxNumber
    };
    setPackingItems((prev) => [...prev, newItem]);
    setTempItemName("");
    setTempItemQty(1);
    setTempItemPackType(settings.dropdownItems.packageTypes?.[0] || "کارتن");
    setTempItemLength("");
    setTempItemWidth("");
    setTempItemHeight("");
    setTempItemWeight(0);
    setTempItemBoxNumber("");
  };
  const handleRemoveItem = (id) => {
    setPackingItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUpdateItemField = (id, field, value) => {
    setPackingItems((prev) => prev.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  const handleEditDelivery = (delivery) => {
    setEditingDeliveryId(delivery.id);
    setSelectedProjectId(delivery.projectId);
    setSelectedProformaId(delivery.proformaId || "");
    setDeliveryDate(delivery.deliveryDate);
    setShippingMethod(delivery.shippingMethod);
    setPreDeliveryTestNotes(delivery.preDeliveryTestNotes || "");
    setPackingItems(delivery.items);
    setChecklist(delivery.checklist);
    setPhotos(delivery.photos || []);
    setActiveTab("new");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("لطفاً پروژه مرتبط را انتخاب کنید.");
      return;
    }
    if (packingItems.length === 0) {
      alert("حداقل یک کالا یا سند باید در پکینگ لیست وجود داشته باشد.");
      return;
    }
    const proj = projects.find((p) => p.id === selectedProjectId);
    const prof = proformas.find((p) => p.id === selectedProformaId);
    if (editingDeliveryId) {
      const existingDelivery = packagingDeliveries.find((d) => d.id === editingDeliveryId);
      if (existingDelivery) {
        updatePackagingDelivery({
          ...existingDelivery,
          projectId: selectedProjectId,
          projectName: proj?.name || "",
          proformaId: selectedProformaId || void 0,
          proformaNumber: prof?.proformaNumber || void 0,
          deliveryDate,
          shippingMethod,
          preDeliveryTestNotes,
          checklist,
          items: packingItems,
          photos
        });
      }
    } else {
      const deliveryData = {
        projectId: selectedProjectId,
        projectName: proj?.name || "",
        proformaId: selectedProformaId || void 0,
        proformaNumber: prof?.proformaNumber || void 0,
        deliveryDate,
        shippingMethod,
        preDeliveryTestNotes,
        checklist,
        items: packingItems,
        photos
      };
      addPackagingDelivery(deliveryData);
    }
    setEditingDeliveryId(null);
    setSelectedProjectId("");
    setSelectedProformaId("");
    setDeliveryDate(getTodayShamsi());
    setShippingMethod(settings.dropdownItems.shippingMethods?.[0] || "باربری");
    setPreDeliveryTestNotes("");
    setPackingItems([]);
    setChecklist([]);
    setPhotos([]);
    setChecklist([]);
    setPhotos([]);
    setActiveTab("list");
  };
  const filteredDeliveries = packagingDeliveries.filter((d) => {
    const matchesProject = !filterProject || d.projectId === filterProject;
    const matchesSearch = !searchTerm || d.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || d.packingListNumber.toLowerCase().includes(searchTerm.toLowerCase()) || d.shippingMethod.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesSearch;
  });
  const totalLists = packagingDeliveries.length;
  const totalPackages = packagingDeliveries.reduce((acc, d) => acc + d.items.length, 0);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-right", dir: "rtl", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Package, { className: "text-emerald-500", size: 26 }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 317,
            columnNumber: 13
          }, this),
          "بسته‌بندی و تحویل کالا (پکینگ لیست)"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 316,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-slate-500 text-xs mt-1", children: "کنترل اقلام بسته‌بندی، تست کارکرد قبل از تحویل تجهیزات، ثبت چک‌لیست بازرسی و صادرکننده شناسنامه و پکینگ لیست استاندارد" }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 320,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 315,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-emerald-600 font-extrabold text-2xl", children: totalLists }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 327,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-emerald-800", children: "کل پکینگ لیست‌ها" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 328,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 326,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-sky-50/50 px-4 py-2.5 rounded-xl border border-sky-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-sky-600 font-extrabold text-2xl", children: totalPackages }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 331,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-sky-800", children: "کل بسته‌های ثبت شده" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 332,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 330,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 325,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 314,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-slate-200", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab("list"),
          className: `px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === "list" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`,
          children: [
            /* @__PURE__ */ jsxDEV(FileText, { size: 18 }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 347,
              columnNumber: 11
            }, this),
            "لیست پکینگ لیست‌های صادر شده"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 339,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab("new"),
          className: `px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === "new" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`,
          children: [
            /* @__PURE__ */ jsxDEV(Plus, { size: 18 }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 358,
              columnNumber: 11
            }, this),
            "ثبت بسته‌بندی و صدور پکینگ لیست جدید"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 350,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 338,
      columnNumber: 7
    }, this),
    activeTab === "list" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-semibold text-slate-500 mb-1.5", children: "فیلتر پروژه" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 369,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: filterProject,
              onChange: (e) => setFilterProject(e.target.value),
              className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: "همه پروژه‌ها" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 375,
                  columnNumber: 17
                }, this),
                projects.map((p) => /* @__PURE__ */ jsxDEV("option", { value: p.id, children: p.name }, p.id, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 377,
                  columnNumber: 19
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 370,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 368,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative md:col-span-2", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-semibold text-slate-500 mb-1.5", children: "جستجو متنی" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 383,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "جستجو بر اساس شماره پکینگ لیست، پروژه، روش ارسال...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 385,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(Search, { size: 16, className: "absolute right-3 top-2.5 text-slate-400" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 392,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 384,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 382,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 367,
        columnNumber: 11
      }, this),
      filteredDeliveries.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxDEV(Package, { size: 32 }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 401,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 400,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-700", children: "هیچ پکینگ لیستی یافت نشد" }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 403,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400", children: "اطلاعات بسته‌بندی و تحویلی در سیستم وجود ندارد." }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 404,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveTab("new"),
            className: "mt-2 bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition",
            children: "صدور اولین پکینگ لیست کالا"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 405,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 399,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredDeliveries.map((delivery) => {
        const checkedCount = delivery.checklist.filter((c) => c.completed).length;
        const totalChecklist = delivery.checklist.length;
        return /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "bg-white p-5 rounded-2xl border border-slate-150 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 hover:border-emerald-200",
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg", children: delivery.packingListNumber }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 425,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-400 font-mono flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxDEV(Calendar, { size: 13 }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 429,
                      columnNumber: 27
                    }, this),
                    delivery.deliveryDate
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 428,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 424,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-slate-800 text-sm leading-snug", children: delivery.projectName }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 435,
                    columnNumber: 25
                  }, this),
                  delivery.proformaNumber && /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: [
                    "پیش‌فاکتور: ",
                    delivery.proformaNumber
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 437,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 434,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 text-xs text-slate-600 pt-1", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1 text-[11px]", children: [
                    /* @__PURE__ */ jsxDEV(Truck, { size: 12 }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 443,
                      columnNumber: 27
                    }, this),
                    delivery.shippingMethod
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 442,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1 text-[11px]", children: [
                    /* @__PURE__ */ jsxDEV(Package, { size: 12 }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 447,
                      columnNumber: 27
                    }, this),
                    delivery.items.length,
                    " ردیف کالا"
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 446,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 441,
                  columnNumber: 23
                }, this),
                totalChecklist > 0 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5 pt-2 border-t border-slate-100", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-[10px] text-slate-500", children: [
                    /* @__PURE__ */ jsxDEV("span", { children: "پیشرفت بازرسی تحویل:" }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 455,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: [
                      checkedCount,
                      " از ",
                      totalChecklist
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 456,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 454,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-slate-100 h-1 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                    "div",
                    {
                      className: "bg-emerald-500 h-1 transition-all",
                      style: { width: `${checkedCount / totalChecklist * 100}%` }
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 459,
                      columnNumber: 29
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 458,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 453,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 423,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center pt-2 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => setSelectedDelivery(delivery),
                    className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxDEV(Info, { size: 14 }, void 0, false, {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 473,
                        columnNumber: 25
                      }, this),
                      "مشاهده جزئیات و چاپ"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 469,
                    columnNumber: 23
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleEditDelivery(delivery);
                      },
                      className: "text-sky-500 hover:text-sky-600 hover:bg-sky-50 p-1.5 rounded-xl transition-all",
                      title: "ویرایش پکینگ لیست",
                      children: /* @__PURE__ */ jsxDEV(Edit, { size: 15 }, void 0, false, {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 486,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 478,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setDeleteDeliveryId(delivery.id);
                      },
                      className: "text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-all",
                      title: "حذف پکینگ لیست",
                      children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 497,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 489,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 477,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 468,
                columnNumber: 21
              }, this)
            ]
          },
          delivery.id,
          true,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 419,
            columnNumber: 19
          },
          this
        );
      }) }, void 0, false, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 413,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 365,
      columnNumber: 9
    }, this),
    activeTab === "new" && /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 pb-3 border-b border-slate-150", children: [
        /* @__PURE__ */ jsxDEV(Package, { size: 22, className: "text-emerald-500" }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 513,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { className: "text-base font-bold text-slate-800", children: "ثبت مشخصات بسته‌بندی و تحویل جدید" }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 514,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 512,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700", children: [
            "انتخاب پروژه ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-rose-500", children: "*" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 520,
              columnNumber: 86
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 520,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: selectedProjectId,
              onChange: (e) => handleProjectChange(e.target.value),
              required: true,
              className: "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- انتخاب پروژه --" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 527,
                  columnNumber: 17
                }, this),
                projects.map((p) => /* @__PURE__ */ jsxDEV("option", { value: p.id, children: p.name }, p.id, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 529,
                  columnNumber: 19
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 521,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 519,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700", children: "پیش‌فاکتور تایید شده مرتبط" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 536,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: selectedProformaId,
              onChange: (e) => handleProformaChange(e.target.value),
              disabled: !selectedProjectId,
              className: "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: "-- بدون پیش‌فاکتور مرتبط (ثبت دستی اقلام) --" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 543,
                  columnNumber: 17
                }, this),
                availableProformas.map((p) => /* @__PURE__ */ jsxDEV("option", { value: p.id, children: [
                  "پیش‌فاکتور ",
                  p.proformaNumber
                ] }, p.id, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 545,
                  columnNumber: 19
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 537,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 535,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700", children: "تاریخ تحویل / بارگیری" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 552,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              value: deliveryDate,
              onChange: (e) => setDeliveryDate(e.target.value),
              required: true,
              placeholder: "مثال: ۱۴۰۵/۰۴/۱۸",
              className: "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-left focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono",
              dir: "ltr"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 553,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 551,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700", children: "نحوه ارسال کالا" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 566,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              value: shippingMethod,
              onChange: (e) => setShippingMethod(e.target.value),
              className: "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none",
              children: settings.dropdownItems.shippingMethods?.map((method, index) => /* @__PURE__ */ jsxDEV("option", { value: method, children: method }, index, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 573,
                columnNumber: 19
              }, this))
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 567,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 565,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 517,
        columnNumber: 11
      }, this),
      checklist.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 border-b border-slate-200 pb-2", children: [
          /* @__PURE__ */ jsxDEV(FileCheck, { className: "text-emerald-500", size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 583,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-slate-700", children: "چک‌لیست کنترل و بازرسی تحویل کالا (الگو)" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 584,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 582,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: checklist.map((item, index) => /* @__PURE__ */ jsxDEV(
          "label",
          {
            className: "flex items-center gap-2.5 p-3 bg-white border border-slate-150 rounded-xl hover:bg-emerald-50/20 cursor-pointer transition select-none",
            children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "checkbox",
                  checked: item.completed,
                  onChange: (e) => {
                    const updated = [...checklist];
                    updated[index].completed = e.target.checked;
                    updated[index].completedAt = e.target.checked ? getTodayShamsi() : void 0;
                    setChecklist(updated);
                  },
                  className: "rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 592,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-700 font-medium", children: item.name }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 603,
                columnNumber: 21
              }, this)
            ]
          },
          index,
          true,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 588,
            columnNumber: 19
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 586,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 581,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDEV(ClipboardCheck, { size: 15, className: "text-emerald-500" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 613,
            columnNumber: 15
          }, this),
          "ثبت گزارش تست‌های انجام شده قبل از تحویل"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 612,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "textarea",
          {
            rows: 3,
            value: preDeliveryTestNotes,
            onChange: (e) => setPreDeliveryTestNotes(e.target.value),
            placeholder: "مثال: تست عایق الکتریکی با دستگاه مگر انجام شد و تایید گردید. همچنین بردهای کالیبراسیون بررسی و گواهی کالیبراسیون در جعبه کالا قرار گرفت.",
            className: "w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none leading-relaxed"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 616,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 611,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-200 rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-bold text-slate-800 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDEV(Package, { size: 15, className: "text-emerald-500" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 629,
              columnNumber: 17
            }, this),
            "لیست اقلام پکینگ لیست (لیست عدل‌بندی)"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 628,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[11px] text-slate-500 font-medium", children: [
            "مجموع اقلام: ",
            packingItems.length,
            " ردیف"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 632,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 627,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-4", children: [
          packingItems.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl", children: "آیتمی در پکینگ لیست ثبت نشده است. از کادر زیر برای اضافه کردن استفاده کنید." }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 638,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDEV("table", { className: "w-full text-xs text-right border-collapse", children: [
            /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "border-b border-slate-150 text-slate-400 font-bold bg-slate-50/40", children: [
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-8", children: "ردیف" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 646,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2", children: "کالا یا مدرک ارسالی" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 647,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-20", children: "تعداد" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 648,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-28", children: "نوع بسته‌بندی" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 649,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-44", children: "ابعاد (طولxعرضxارتفاع)" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 650,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-24", children: "وزن (کیلوگرم)" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 651,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-24", children: "شماره جعبه" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 652,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("th", { className: "p-2 w-10 text-center", children: "حذف" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 653,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 645,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 644,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-100", children: packingItems.map((item, idx) => /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/40", children: [
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 text-slate-400 font-mono", children: idx + 1 }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 659,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: item.itemOrDocName,
                  onChange: (e) => handleUpdateItemField(item.id, "itemOrDocName", e.target.value),
                  className: "w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white rounded px-1.5 py-1 text-xs font-medium"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 661,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 660,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: item.quantity,
                  onChange: (e) => handleUpdateItemField(item.id, "quantity", Number(e.target.value)),
                  className: "w-full border border-slate-200 rounded px-1.5 py-1 text-xs text-center"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 669,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 668,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "select",
                {
                  value: item.packageType,
                  onChange: (e) => handleUpdateItemField(item.id, "packageType", e.target.value),
                  className: "w-full border border-slate-200 rounded px-1.5 py-1 text-xs",
                  children: settings.dropdownItems.packageTypes?.map((pt, i) => /* @__PURE__ */ jsxDEV("option", { value: pt, children: pt }, i, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 683,
                    columnNumber: 33
                  }, this))
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 677,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 676,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: item.dimensions,
                  placeholder: "۵۰x۴۰x۳۰ سانتی‌متر",
                  onChange: (e) => handleUpdateItemField(item.id, "dimensions", e.target.value),
                  className: "w-full border border-slate-200 rounded px-1.5 py-1 text-xs font-mono text-left",
                  dir: "ltr"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 688,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 687,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "number",
                  value: item.weight,
                  onChange: (e) => handleUpdateItemField(item.id, "weight", Number(e.target.value)),
                  className: "w-full border border-slate-200 rounded px-1.5 py-1 text-xs text-center"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 698,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 697,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2", children: /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "text",
                  value: item.boxNumber || "",
                  onChange: (e) => handleUpdateItemField(item.id, "boxNumber", e.target.value),
                  placeholder: "جعبه ۱",
                  className: "w-full border border-slate-200 rounded px-1.5 py-1 text-xs text-center"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 706,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 705,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("td", { className: "p-2 text-center", children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => handleRemoveItem(item.id),
                  className: "text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50",
                  children: /* @__PURE__ */ jsxDEV(Trash2, { size: 13 }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 720,
                    columnNumber: 31
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 715,
                  columnNumber: 29
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 714,
                columnNumber: 27
              }, this)
            ] }, item.id, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 658,
              columnNumber: 25
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 656,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 643,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 642,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-slate-700", children: "افزودن کالا، مدارک یا وسایل جانبی متفرقه" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 732,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "نام کالا یا مستندات (مثال: شناسنامه گارانتی)" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 735,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "text",
                    value: tempItemName,
                    onChange: (e) => setTempItemName(e.target.value),
                    placeholder: "کاتالوگ، قطعه یدکی، نقشه فونداسیون...",
                    className: "w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 736,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 734,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "تعداد" }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 746,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "number",
                      value: tempItemQty,
                      onChange: (e) => setTempItemQty(Number(e.target.value)),
                      className: "w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 747,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 745,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "نوع بسته‌بندی" }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 755,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "select",
                    {
                      value: tempItemPackType,
                      onChange: (e) => setTempItemPackType(e.target.value),
                      className: "w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none",
                      children: settings.dropdownItems.packageTypes?.map((pt, idx) => /* @__PURE__ */ jsxDEV("option", { value: pt, children: pt }, idx, false, {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 762,
                        columnNumber: 27
                      }, this))
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 756,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 754,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 744,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-5 gap-1.5 items-end", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "col-span-3 space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "ابعاد (طولxعرضxارتفاع) به سانتی‌متر" }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 769,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1 items-center", dir: "ltr", children: [
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "text",
                        placeholder: "طول",
                        value: tempItemLength,
                        onChange: (e) => setTempItemLength(e.target.value),
                        className: "w-full border border-slate-200 rounded-lg py-1.5 text-xs text-center focus:outline-none font-mono"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 771,
                        columnNumber: 25
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: "x" }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 778,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "text",
                        placeholder: "عرض",
                        value: tempItemWidth,
                        onChange: (e) => setTempItemWidth(e.target.value),
                        className: "w-full border border-slate-200 rounded-lg py-1.5 text-xs text-center focus:outline-none font-mono"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 779,
                        columnNumber: 25
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400", children: "x" }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 786,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "text",
                        placeholder: "ارتفاع",
                        value: tempItemHeight,
                        onChange: (e) => setTempItemHeight(e.target.value),
                        className: "w-full border border-slate-200 rounded-lg py-1.5 text-xs text-center focus:outline-none font-mono"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                        lineNumber: 787,
                        columnNumber: 25
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 770,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 768,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "وزن (Kg)" }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 797,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "number",
                      placeholder: "وزن",
                      value: tempItemWeight || "",
                      onChange: (e) => setTempItemWeight(Number(e.target.value)),
                      className: "w-full border border-slate-200 rounded-lg py-1.5 text-xs text-center focus:outline-none"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 798,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 796,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxDEV("label", { className: "text-[10px] font-bold text-slate-500 block", children: "شماره جعبه/پالت" }, void 0, false, {
                    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                    lineNumber: 807,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "text",
                      placeholder: "شماره جعبه",
                      value: tempItemBoxNumber || "",
                      onChange: (e) => setTempItemBoxNumber(e.target.value),
                      className: "w-full border border-slate-200 rounded-lg py-1.5 text-xs text-center focus:outline-none"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 808,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 806,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 767,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: handleAddCustomItem,
                  className: "w-full bg-slate-700 text-white rounded-lg py-2 text-xs font-bold transition hover:bg-slate-800 flex items-center justify-center gap-1 shrink-0",
                  children: [
                    /* @__PURE__ */ jsxDEV(Plus, { size: 14 }, void 0, false, {
                      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                      lineNumber: 823,
                      columnNumber: 23
                    }, this),
                    "افزودن به لیست عدل‌بندی"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 818,
                  columnNumber: 21
                },
                this
              ) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 817,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 733,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 731,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 635,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 626,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "block text-xs font-bold text-slate-700", children: "بارگذاری تصاویر بسته‌بندی، سلامت تجهیز و فرآیند بارگیری کالا" }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 834,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            className: "border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/50 rounded-2xl p-6 text-center transition cursor-pointer group",
            onClick: () => document.getElementById("photo-upload-input")?.click(),
            children: [
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  type: "file",
                  id: "photo-upload-input",
                  multiple: true,
                  accept: "image/*",
                  className: "hidden",
                  onChange: handlePhotoUpload
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 841,
                  columnNumber: 15
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(Upload, { className: "mx-auto text-slate-400 group-hover:text-emerald-500 transition-colors mb-2", size: 32 }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 849,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors", children: "انتخاب تصویر (تصاویر بسته‌بندی، پلاک دستگاه، فیش ترخیص و بارگیری)" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 850,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-400 mt-1", children: "می‌توانید فایل‌های تصویری خود را مستقیماً به اینجا بکشید و رها کنید." }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 853,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 835,
            columnNumber: 13
          },
          this
        ),
        photos.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3", children: photos.map((photo, idx) => /* @__PURE__ */ jsxDEV("div", { className: "relative group rounded-xl overflow-hidden border border-slate-200 shadow-xs aspect-square", children: [
          /* @__PURE__ */ jsxDEV("img", { referrerPolicy: "no-referrer", src: photo, alt: `pack-${idx}`, className: "w-full h-full object-cover" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 861,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                setPhotos((prev) => prev.filter((_, i) => i !== idx));
              },
              className: "absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition shadow-sm hover:scale-110",
              children: /* @__PURE__ */ jsxDEV(X, { size: 12 }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 870,
                columnNumber: 23
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 862,
              columnNumber: 21
            },
            this
          )
        ] }, idx, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 860,
          columnNumber: 19
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 858,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 833,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 justify-end border-t border-slate-100 pt-4 bg-slate-50/20", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "submit",
            className: "bg-emerald-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-sm",
            children: "ثبت و صدور پکینگ لیست کالا"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 880,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveTab("list");
            },
            className: "bg-slate-100 text-slate-600 font-bold text-xs px-6 py-3 rounded-xl hover:bg-slate-200 transition",
            children: "انصراف"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 886,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 879,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 511,
      columnNumber: 9
    }, this),
    selectedDelivery && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto", dir: "rtl", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in relative max-h-[90vh]", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/80 no-print", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Package, { className: "text-emerald-500", size: 20 }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 906,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "font-extrabold text-slate-800 text-sm md:text-base", children: [
            "پکینگ لیست کالا - ",
            selectedDelivery.packingListNumber
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 907,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 905,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSelectedDelivery(null),
            className: "text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition hover:bg-slate-200/55",
            children: /* @__PURE__ */ jsxDEV(X, { size: 18 }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 915,
              columnNumber: 17
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 911,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 904,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "p-6 md:p-8 overflow-y-auto space-y-6 printable-container select-text", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-center md:items-start pb-4 border-b border-slate-300 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2 text-center md:text-right", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-lg font-extrabold text-slate-900", children: "پکینگ لیست استاندارد کالا (Packing List)" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 924,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-500", children: "مجموعه اسناد رسمی ترخیص و لجستیک" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 925,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 923,
            columnNumber: 17
          }, this),
          activeTemplate?.showLogo && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", dir: "rtl", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-sm text-slate-800", children: activeTemplate.companyName }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 932,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[9px] text-slate-400", children: "تامین تجهیزات اتوماسیون و ابزاردقیق" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 933,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 931,
              columnNumber: 21
            }, this),
            activeTemplate.logoUrl ? /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: activeTemplate.logoUrl,
                alt: activeTemplate.companyName,
                className: "w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white",
                referrerPolicy: "no-referrer"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 936,
                columnNumber: 23
              },
              this
            ) : /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 bg-sky-500 text-white flex items-center justify-center font-bold text-xl rounded-lg shrink-0", children: "ATA" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 943,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 930,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 922,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "شماره پکینگ لیست:" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 955,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-extrabold", children: selectedDelivery.packingListNumber }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 956,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 954,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "تاریخ صدور / ارسال:" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 959,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-mono font-bold", children: selectedDelivery.deliveryDate }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 960,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 958,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "روش حمل و ارسال:" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 963,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-extrabold", children: selectedDelivery.shippingMethod }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 964,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 962,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 953,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "پروژه (کارفرما):" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 970,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-extrabold", children: selectedDelivery.projectName }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 971,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 969,
              columnNumber: 19
            }, this),
            selectedDelivery.proformaNumber && /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "پیش‌فاکتور مرجع:" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 975,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-mono", children: selectedDelivery.proformaNumber }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 976,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 974,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-slate-400", children: "مسئول ثبت و کنترل:" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 980,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("strong", { className: "text-slate-800 font-bold", children: currentUser?.fullName || "مسئول انبار و لجستیک" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 981,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 979,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 968,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 952,
          columnNumber: 15
        }, this),
        selectedDelivery.checklist && selectedDelivery.checklist.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 no-print", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-1.5", children: [
            /* @__PURE__ */ jsxDEV(FileCheck, { size: 15, className: "text-emerald-500" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 990,
              columnNumber: 21
            }, this),
            "نتیجه بازرسی فنی و ایمنی کالا"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 989,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: selectedDelivery.checklist.map((item, idx) => /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `flex items-center gap-2 p-2.5 rounded-xl border text-xs ${item.completed ? "bg-emerald-50/20 border-emerald-150 text-emerald-800" : "bg-slate-50/30 border-slate-200 text-slate-400"}`,
              children: [
                item.completed ? /* @__PURE__ */ jsxDEV("div", { className: "p-0.5 bg-emerald-500 text-white rounded-full shrink-0", children: /* @__PURE__ */ jsxDEV(Check, { size: 11 }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1005,
                  columnNumber: 29
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1004,
                  columnNumber: 27
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "p-0.5 bg-slate-200 text-slate-500 rounded-full shrink-0", children: /* @__PURE__ */ jsxDEV(X, { size: 11 }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1009,
                  columnNumber: 29
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1008,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: item.name }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1012,
                  columnNumber: 25
                }, this),
                item.completedAt && /* @__PURE__ */ jsxDEV("span", { className: "mr-auto font-mono text-[9px] text-slate-400", children: [
                  "(",
                  item.completedAt,
                  ")"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1014,
                  columnNumber: 27
                }, this)
              ]
            },
            idx,
            true,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 995,
              columnNumber: 23
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 993,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 988,
          columnNumber: 17
        }, this),
        selectedDelivery.preDeliveryTestNotes && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-1.5", children: [
            /* @__PURE__ */ jsxDEV(ClipboardCheck, { size: 15, className: "text-emerald-500" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1026,
              columnNumber: 21
            }, this),
            "گزارش تست قبل از تحویل تجهیز"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1025,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-150 leading-relaxed font-medium", children: selectedDelivery.preDeliveryTestNotes }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1029,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1024,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-1.5", children: [
            /* @__PURE__ */ jsxDEV(Package, { size: 15, className: "text-emerald-500" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1038,
              columnNumber: 19
            }, this),
            "لیست کالاها و عدل‌بندی بسته‌بندی"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1037,
            columnNumber: 17
          }, this),
          Object.entries(
            selectedDelivery.items.reduce((acc, item) => {
              const box = item.boxNumber || "اقلام بدون شماره جعبه";
              if (!acc[box]) acc[box] = [];
              acc[box].push(item);
              return acc;
            }, {})
          ).map(([box, items], boxIdx) => /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-200 rounded-xl overflow-hidden mb-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-100 text-slate-700 font-bold text-xs p-2.5 border-b border-slate-200 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV(Package, { size: 14, className: "text-slate-500" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1052,
                columnNumber: 23
              }, this),
              "بسته‌بندی / جعبه: ",
              box
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1051,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("table", { className: "w-full text-xs text-right border-collapse", children: [
              /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { className: "bg-slate-50/50 text-slate-500 font-bold border-b border-slate-200", children: [
                /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-10", children: "ردیف" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1058,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("th", { className: "p-3", children: "کالا / تجهیز / سند" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1059,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("th", { className: "p-3 text-center w-16", children: "تعداد" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1060,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-28", children: "نوع بسته‌بندی" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1061,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("th", { className: "p-3 w-40", children: "ابعاد بسته‌بندی" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1062,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("th", { className: "p-3 text-center w-24", children: "وزن (کیلوگرم)" }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1063,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1057,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1056,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("tbody", { className: "divide-y divide-slate-150", children: items.map((item, idx) => /* @__PURE__ */ jsxDEV("tr", { className: "hover:bg-slate-50/50", children: [
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 text-slate-400 font-mono font-semibold", children: idx + 1 }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1069,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-bold text-slate-800", children: item.itemOrDocName }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1070,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-extrabold text-slate-700 text-center font-mono", children: item.quantity }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1071,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-medium text-slate-600", children: item.packageType }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1072,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-mono text-left text-slate-600", dir: "ltr", children: item.dimensions }, void 0, false, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1073,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("td", { className: "p-3 font-mono text-slate-700 text-center font-semibold", children: [
                  item.weight,
                  " Kg"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                  lineNumber: 1074,
                  columnNumber: 29
                }, this)
              ] }, item.id, true, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1068,
                columnNumber: 27
              }, this)) }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1066,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1055,
              columnNumber: 21
            }, this)
          ] }, boxIdx, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1050,
            columnNumber: 19
          }, this))
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1036,
          columnNumber: 15
        }, this),
        selectedDelivery.photos && selectedDelivery.photos.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "space-y-2.5 no-print", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-1.5", children: [
            /* @__PURE__ */ jsxDEV(Upload, { size: 15, className: "text-emerald-500" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1087,
              columnNumber: 21
            }, this),
            "تصاویر پیوست بسته‌بندی و ارسال"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1086,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: selectedDelivery.photos.map((photo, idx) => /* @__PURE__ */ jsxDEV("div", { className: "border border-slate-200 rounded-xl overflow-hidden aspect-square hover:shadow-md transition", children: /* @__PURE__ */ jsxDEV("img", { referrerPolicy: "no-referrer", src: photo, alt: `delivery-${idx}`, className: "w-full h-full object-cover" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1093,
            columnNumber: 25
          }, this) }, idx, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1092,
            columnNumber: 23
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1090,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1085,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-6 pt-12 pb-8 text-center text-xs relative", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block", children: "امضا و تایید تحویل‌گیرنده (کارفرما):" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1103,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-44 h-24 border border-dashed border-slate-200 rounded-lg mx-auto bg-slate-50/30" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1104,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: "نام و نام خانوادگی / تاریخ تحویل" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1105,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1102,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 relative", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-slate-700 block", children: "مسئول انبار و تایید خروج کالا:" }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1109,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-44 h-24 relative mx-auto flex items-center justify-center", children: [
              activeTemplate?.companySealUrl && /* @__PURE__ */ jsxDEV("img", { src: activeTemplate.companySealUrl, alt: "Company Stamp", className: "absolute top-0 right-0 h-24 opacity-60 mix-blend-multiply pointer-events-none" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1113,
                columnNumber: 23
              }, this),
              currentUser?.signatureImage ? /* @__PURE__ */ jsxDEV("img", { src: currentUser.signatureImage, alt: "User Signature", className: "absolute z-10 max-h-16 max-w-[150px] object-contain pointer-events-none" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1117,
                columnNumber: 23
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full border border-dashed border-slate-200 rounded-lg bg-slate-50/30 flex items-center justify-center text-slate-400 font-mono text-[10px]", children: "مهر و امضای ترخیص لجستیک" }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1119,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1110,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono", children: currentUser?.fullName }, void 0, false, {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1124,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1108,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1101,
          columnNumber: 15
        }, this),
        activeTemplate?.footerText && /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-slate-500 text-center pt-8 border-t border-slate-200 mt-8", children: activeTemplate.footerText }, void 0, false, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1130,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 920,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 justify-end px-6 py-4 border-t border-slate-150 bg-slate-50/50 no-print", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => {
              setTimeout(() => {
                window.print();
              }, 150);
            },
            className: "bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm",
            children: [
              /* @__PURE__ */ jsxDEV(Printer, { size: 15 }, void 0, false, {
                fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
                lineNumber: 1147,
                columnNumber: 17
              }, this),
              "چاپ پکینگ لیست استاندارد"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1138,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => setSelectedDelivery(null),
            className: "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-xl transition",
            children: "بستن پنجره"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1150,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 1137,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 902,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 901,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(
      ConfirmModal,
      {
        isOpen: !!deleteDeliveryId,
        onClose: () => {
          setDeleteDeliveryId(null);
          setDeleteActivitiesWithDelivery(false);
        },
        onConfirm: () => {
          if (deleteDeliveryId) {
            deletePackagingDelivery(deleteDeliveryId, deleteActivitiesWithDelivery);
          }
        },
        title: "حذف پکینگ لیست",
        message: "آیا از حذف این پکینگ لیست و تحویل کالا اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
        children: /* @__PURE__ */ jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-100 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "checkbox",
              id: "deleteActivities",
              checked: deleteActivitiesWithDelivery,
              onChange: (e) => setDeleteActivitiesWithDelivery(e.target.value === "true"),
              className: "mt-1"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
              lineNumber: 1179,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "deleteActivities", className: "text-xs text-slate-600", children: "حذف لاگ‌های فعالیت پروژه مرتبط با این پکینگ لیست (در دسته‌بندی بسته‌بندی و تحویل کالا)" }, void 0, false, {
            fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
            lineNumber: 1186,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
          lineNumber: 1178,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
        lineNumber: 1164,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("style", { children: `
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-container, .printable-container * {
            visibility: visible;
          }
          .printable-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            direction: rtl !important;
            text-align: right !important;
            font-family: 'Inter', system-ui, sans-serif !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      ` }, void 0, false, {
      fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
      lineNumber: 1192,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/PackagingDeliveryView.tsx",
    lineNumber: 312,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhY2thZ2luZ0RlbGl2ZXJ5Vmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgXG4gIFBhY2thZ2UsIFxuICBQbHVzLCBcbiAgVHJhc2gyLCBcbiAgQ2hlY2ssIFxuICBYLCBcbiAgUHJpbnRlciwgXG4gIFVwbG9hZCwgXG4gIENsaXBib2FyZENoZWNrLCBcbiAgVHJ1Y2ssIFxuICBDYWxlbmRhciwgXG4gIEZpbGVUZXh0LCBcbiAgU2VhcmNoLCBcbiAgQnJpZWZjYXNlLCBcbiAgSW5mbyxcbiAgQWxlcnRDaXJjbGUsXG4gIEZpbGVDaGVjayxcbiAgRWRpdFxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuaW1wb3J0IHsgXG4gIFByb2plY3QsIFxuICBQcm9mb3JtYSwgXG4gIFBhY2thZ2luZ0RlbGl2ZXJ5LCBcbiAgUGFja2luZ0l0ZW0sIFxuICBEZWxpdmVyeUNoZWNrbGlzdEl0ZW0sXG4gIEVSUFNldHRpbmdzIFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRUb2RheVNoYW1zaSB9IGZyb20gJy4uL2RhdGVVdGlscyc7XG5pbXBvcnQgQ29uZmlybU1vZGFsIGZyb20gJy4vQ29uZmlybU1vZGFsJztcblxuaW50ZXJmYWNlIFBhY2thZ2luZ0RlbGl2ZXJ5Vmlld1Byb3BzIHtcbiAgcHJvamVjdHM6IFByb2plY3RbXTtcbiAgcHJvZm9ybWFzOiBQcm9mb3JtYVtdO1xuICBwYWNrYWdpbmdEZWxpdmVyaWVzOiBQYWNrYWdpbmdEZWxpdmVyeVtdO1xuICBhZGRQYWNrYWdpbmdEZWxpdmVyeTogKGRlbGl2ZXJ5OiBPbWl0PFBhY2thZ2luZ0RlbGl2ZXJ5LCAnaWQnIHwgJ2NyZWF0ZWRBdCcgfCAncGFja2luZ0xpc3ROdW1iZXInPikgPT4gYW55O1xuICB1cGRhdGVQYWNrYWdpbmdEZWxpdmVyeTogKGRlbGl2ZXJ5OiBQYWNrYWdpbmdEZWxpdmVyeSkgPT4gdm9pZDtcbiAgZGVsZXRlUGFja2FnaW5nRGVsaXZlcnk6IChpZDogc3RyaW5nLCBkZWxldGVMb2dzPzogYm9vbGVhbikgPT4gdm9pZDtcbiAgc2V0dGluZ3M6IEVSUFNldHRpbmdzO1xuICBjdXJyZW50VXNlcjogYW55O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQYWNrYWdpbmdEZWxpdmVyeVZpZXcoe1xuICBwcm9qZWN0cyxcbiAgcHJvZm9ybWFzLFxuICBwYWNrYWdpbmdEZWxpdmVyaWVzLFxuICBhZGRQYWNrYWdpbmdEZWxpdmVyeSxcbiAgdXBkYXRlUGFja2FnaW5nRGVsaXZlcnksXG4gIGRlbGV0ZVBhY2thZ2luZ0RlbGl2ZXJ5LFxuICBzZXR0aW5ncyxcbiAgY3VycmVudFVzZXJcbn06IFBhY2thZ2luZ0RlbGl2ZXJ5Vmlld1Byb3BzKSB7XG4gIGNvbnN0IGFjdGl2ZVRlbXBsYXRlID0gc2V0dGluZ3MucHJvZm9ybWFUZW1wbGF0ZXM/LmZpbmQodCA9PiB0Lm5hbWUgPT09IHNldHRpbmdzLmFjdGl2ZVRlbXBsYXRlSWQpIHx8IHNldHRpbmdzLnByb2Zvcm1hVGVtcGxhdGVzPy5bMF07XG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZTwnbGlzdCcgfCAnbmV3Jz4oJ2xpc3QnKTtcblxuICAvLyBGaWx0ZXIgU3RhdGVzXG4gIGNvbnN0IFtmaWx0ZXJQcm9qZWN0LCBzZXRGaWx0ZXJQcm9qZWN0XSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbc2VhcmNoVGVybSwgc2V0U2VhcmNoVGVybV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICAvLyBGb3JtIFN0YXRlcyAoTmV3IERlbGl2ZXJ5KVxuICBjb25zdCBbZWRpdGluZ0RlbGl2ZXJ5SWQsIHNldEVkaXRpbmdEZWxpdmVyeUlkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbc2VsZWN0ZWRQcm9qZWN0SWQsIHNldFNlbGVjdGVkUHJvamVjdElkXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbc2VsZWN0ZWRQcm9mb3JtYUlkLCBzZXRTZWxlY3RlZFByb2Zvcm1hSWRdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IFtkZWxpdmVyeURhdGUsIHNldERlbGl2ZXJ5RGF0ZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KGdldFRvZGF5U2hhbXNpKCkpO1xuICBjb25zdCBbc2hpcHBpbmdNZXRob2QsIHNldFNoaXBwaW5nTWV0aG9kXSA9IHVzZVN0YXRlPHN0cmluZz4oc2V0dGluZ3MuZHJvcGRvd25JdGVtcy5zaGlwcGluZ01ldGhvZHM/LlswXSB8fCAn2KjYp9ix2KjYsduMJyk7XG4gIGNvbnN0IFtwcmVEZWxpdmVyeVRlc3ROb3Rlcywgc2V0UHJlRGVsaXZlcnlUZXN0Tm90ZXNdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IFtwYWNraW5nSXRlbXMsIHNldFBhY2tpbmdJdGVtc10gPSB1c2VTdGF0ZTxQYWNraW5nSXRlbVtdPihbXSk7XG4gIGNvbnN0IFtjaGVja2xpc3QsIHNldENoZWNrbGlzdF0gPSB1c2VTdGF0ZTxEZWxpdmVyeUNoZWNrbGlzdEl0ZW1bXT4oW10pO1xuICBjb25zdCBbcGhvdG9zLCBzZXRQaG90b3NdID0gdXNlU3RhdGU8c3RyaW5nW10+KFtdKTtcblxuICAvLyBUZW1wb3JhcnkgaXRlbSBpbnB1dHNcbiAgY29uc3QgW3RlbXBJdGVtTmFtZSwgc2V0VGVtcEl0ZW1OYW1lXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbdGVtcEl0ZW1RdHksIHNldFRlbXBJdGVtUXR5XSA9IHVzZVN0YXRlPG51bWJlcj4oMSk7XG4gIGNvbnN0IFt0ZW1wSXRlbVBhY2tUeXBlLCBzZXRUZW1wSXRlbVBhY2tUeXBlXSA9IHVzZVN0YXRlPHN0cmluZz4oc2V0dGluZ3MuZHJvcGRvd25JdGVtcy5wYWNrYWdlVHlwZXM/LlswXSB8fCAn2qnYp9ix2KrZhicpO1xuICBjb25zdCBbdGVtcEl0ZW1XaWR0aCwgc2V0VGVtcEl0ZW1XaWR0aF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW3RlbXBJdGVtTGVuZ3RoLCBzZXRUZW1wSXRlbUxlbmd0aF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW3RlbXBJdGVtSGVpZ2h0LCBzZXRUZW1wSXRlbUhlaWdodF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW3RlbXBJdGVtV2VpZ2h0LCBzZXRUZW1wSXRlbVdlaWdodF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuICBjb25zdCBbdGVtcEl0ZW1Cb3hOdW1iZXIsIHNldFRlbXBJdGVtQm94TnVtYmVyXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG4gIC8vIFNlbGVjdGVkIFBhY2tpbmcgTGlzdCBEZXRhaWwgTW9kYWxcbiAgY29uc3QgW3NlbGVjdGVkRGVsaXZlcnksIHNldFNlbGVjdGVkRGVsaXZlcnldID0gdXNlU3RhdGU8UGFja2FnaW5nRGVsaXZlcnkgfCBudWxsPihudWxsKTtcblxuICAvLyBEZWxldGUgTW9kYWwgU3RhdGVcbiAgY29uc3QgW2RlbGV0ZURlbGl2ZXJ5SWQsIHNldERlbGV0ZURlbGl2ZXJ5SWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtkZWxldGVBY3Rpdml0aWVzV2l0aERlbGl2ZXJ5LCBzZXREZWxldGVBY3Rpdml0aWVzV2l0aERlbGl2ZXJ5XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBGaWx0ZXIgd29uL2FwcHJvdmVkIHByb2Zvcm1hcyBmb3IgdGhlIHNlbGVjdGVkIHByb2plY3RcbiAgY29uc3QgYXZhaWxhYmxlUHJvZm9ybWFzID0gcHJvZm9ybWFzLmZpbHRlcihcbiAgICBwID0+IHAucHJvamVjdElkID09PSBzZWxlY3RlZFByb2plY3RJZCAmJiBwLnN0YXR1cyA9PT0gJ9iq2KPbjNuM2K8g2LTYr9mHICjYqNix2YbYr9mHKSdcbiAgKTtcblxuICAvLyBXaGVuIHByb2plY3QgY2hhbmdlcywgcmVzZXQgcHJvZm9ybWEgYW5kIGF1dG8tZmlsbCBjaGVja2xpc3RcbiAgY29uc3QgaGFuZGxlUHJvamVjdENoYW5nZSA9IChwcm9qZWN0SWQ6IHN0cmluZykgPT4ge1xuICAgIHNldFNlbGVjdGVkUHJvamVjdElkKHByb2plY3RJZCk7XG4gICAgc2V0U2VsZWN0ZWRQcm9mb3JtYUlkKCcnKTtcbiAgICBzZXRQYWNraW5nSXRlbXMoW10pO1xuICAgIFxuICAgIC8vIEluaXRpYWxpemUgY2hlY2tsaXN0IHdpdGggdGVtcGxhdGUgZnJvbSBzZXR0aW5nc1xuICAgIGNvbnN0IHRlbXBsYXRlID0gc2V0dGluZ3MuZGVsaXZlcnlDaGVja2xpc3RUZW1wbGF0ZSB8fCBbXTtcbiAgICBzZXRDaGVja2xpc3QoXG4gICAgICB0ZW1wbGF0ZS5tYXAodGV4dCA9PiAoe1xuICAgICAgICBuYW1lOiB0ZXh0LFxuICAgICAgICBjb21wbGV0ZWQ6IGZhbHNlXG4gICAgICB9KSlcbiAgICApO1xuICB9O1xuXG4gIC8vIFdoZW4gcHJvZm9ybWEgY2hhbmdlcywgcG9wdWxhdGUgZGVmYXVsdCBwYWNraW5nIGl0ZW1zIGZyb20gaXRzIGl0ZW1zXG4gIGNvbnN0IGhhbmRsZVByb2Zvcm1hQ2hhbmdlID0gKHByb2Zvcm1hSWQ6IHN0cmluZykgPT4ge1xuICAgIHNldFNlbGVjdGVkUHJvZm9ybWFJZChwcm9mb3JtYUlkKTtcbiAgICBpZiAoIXByb2Zvcm1hSWQpIHtcbiAgICAgIHNldFBhY2tpbmdJdGVtcyhbXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvZiA9IHByb2Zvcm1hcy5maW5kKHAgPT4gcC5pZCA9PT0gcHJvZm9ybWFJZCk7XG4gICAgaWYgKHByb2YpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQYWNraW5nSXRlbXM6IFBhY2tpbmdJdGVtW10gPSBwcm9mLml0ZW1zLm1hcCgoaXRlbSwgaWR4KSA9PiAoe1xuICAgICAgICBpZDogYHBhY2staXRlbS1hdXRvLSR7aWR4fS0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgaXRlbU9yRG9jTmFtZTogYCR7aXRlbS5wcm9kdWN0TmFtZX0gKCR7aXRlbS5icmFuZH0pYCxcbiAgICAgICAgcHJvZHVjdElkOiBpdGVtLnByb2R1Y3RJZCxcbiAgICAgICAgcXVhbnRpdHk6IGl0ZW0ucXVhbnRpdHksXG4gICAgICAgIHBhY2thZ2VUeXBlOiAn2qnYp9ix2KrZhicsXG4gICAgICAgIGRpbWVuc2lvbnM6ICc1MHg0MHgzMCDYs9in2YbYqtuM4oCM2YXYqtixJyxcbiAgICAgICAgd2VpZ2h0OiAxXG4gICAgICB9KSk7XG4gICAgICBzZXRQYWNraW5nSXRlbXMoZGVmYXVsdFBhY2tpbmdJdGVtcyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFVwbG9hZCBQaG90byBoYW5kbGVyIChDb252ZXJ0IHRvIEJhc2U2NClcbiAgY29uc3QgaGFuZGxlUGhvdG9VcGxvYWQgPSAoZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICBpZiAoZS50YXJnZXQuZmlsZXMpIHtcbiAgICAgIGNvbnN0IGZpbGVzQXJyYXkgPSBBcnJheS5mcm9tKGUudGFyZ2V0LmZpbGVzKSBhcyBGaWxlW107XG4gICAgICBmaWxlc0FycmF5LmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlYWRlci5yZXN1bHQpIHtcbiAgICAgICAgICAgIHNldFBob3RvcyhwcmV2ID0+IFsuLi5wcmV2LCByZWFkZXIucmVzdWx0IGFzIHN0cmluZ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRHJhZ092ZXIgPSAoZTogUmVhY3QuRHJhZ0V2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURyb3AgPSAoZTogUmVhY3QuRHJhZ0V2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChlLmRhdGFUcmFuc2Zlci5maWxlcykge1xuICAgICAgY29uc3QgZmlsZXNBcnJheSA9IEFycmF5LmZyb20oZS5kYXRhVHJhbnNmZXIuZmlsZXMpIGFzIEZpbGVbXTtcbiAgICAgIGZpbGVzQXJyYXkuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpID0+IHtcbiAgICAgICAgICBpZiAocmVhZGVyLnJlc3VsdCkge1xuICAgICAgICAgICAgc2V0UGhvdG9zKHByZXYgPT4gWy4uLnByZXYsIHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBBZGQgY3VzdG9tIGl0ZW0vZG9jdW1lbnRcbiAgY29uc3QgaGFuZGxlQWRkQ3VzdG9tSXRlbSA9ICgpID0+IHtcbiAgICBpZiAoIXRlbXBJdGVtTmFtZS50cmltKCkpIHtcbiAgICAgIGFsZXJ0KCfZhNi32YHYp9mLINmG2KfZhSDaqdin2YTYpyDbjNinINmF2K/YsdqpINix2Kcg2YjYp9ix2K8g2qnZhtuM2K8uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRlbXBJdGVtTGVuZ3RoICYmIHRlbXBJdGVtV2lkdGggJiYgdGVtcEl0ZW1IZWlnaHQgXG4gICAgICA/IGAke3RlbXBJdGVtTGVuZ3RofXgke3RlbXBJdGVtV2lkdGh9eCR7dGVtcEl0ZW1IZWlnaHR9INiz2KfZhtiq24zigIzZhdiq2LFgIFxuICAgICAgOiAn2YbYp9mF2LTYrti1JztcblxuICAgIGNvbnN0IG5ld0l0ZW06IFBhY2tpbmdJdGVtID0ge1xuICAgICAgaWQ6IGBwYWNrLWl0ZW0tY3VzdG9tLSR7RGF0ZS5ub3coKX1gLFxuICAgICAgaXRlbU9yRG9jTmFtZTogdGVtcEl0ZW1OYW1lLnRyaW0oKSxcbiAgICAgIHF1YW50aXR5OiB0ZW1wSXRlbVF0eSxcbiAgICAgIHBhY2thZ2VUeXBlOiB0ZW1wSXRlbVBhY2tUeXBlLFxuICAgICAgZGltZW5zaW9ucyxcbiAgICAgIHdlaWdodDogdGVtcEl0ZW1XZWlnaHQsXG4gICAgICBib3hOdW1iZXI6IHRlbXBJdGVtQm94TnVtYmVyXG4gICAgfTtcblxuICAgIHNldFBhY2tpbmdJdGVtcyhwcmV2ID0+IFsuLi5wcmV2LCBuZXdJdGVtXSk7XG5cbiAgICAvLyBSZXNldCBpbnB1dHNcbiAgICBzZXRUZW1wSXRlbU5hbWUoJycpO1xuICAgIHNldFRlbXBJdGVtUXR5KDEpO1xuICAgIHNldFRlbXBJdGVtUGFja1R5cGUoc2V0dGluZ3MuZHJvcGRvd25JdGVtcy5wYWNrYWdlVHlwZXM/LlswXSB8fCAn2qnYp9ix2KrZhicpO1xuICAgIHNldFRlbXBJdGVtTGVuZ3RoKCcnKTtcbiAgICBzZXRUZW1wSXRlbVdpZHRoKCcnKTtcbiAgICBzZXRUZW1wSXRlbUhlaWdodCgnJyk7XG4gICAgc2V0VGVtcEl0ZW1XZWlnaHQoMCk7XG4gICAgc2V0VGVtcEl0ZW1Cb3hOdW1iZXIoJycpO1xuICB9O1xuXG4gIC8vIFJlbW92ZSBQYWNraW5nIEl0ZW1cbiAgY29uc3QgaGFuZGxlUmVtb3ZlSXRlbSA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgc2V0UGFja2luZ0l0ZW1zKHByZXYgPT4gcHJldi5maWx0ZXIoaXRlbSA9PiBpdGVtLmlkICE9PSBpZCkpO1xuICB9O1xuXG4gIC8vIEVkaXQgUGFja2luZyBJdGVtIGlubGluZSBmaWVsZFxuICBjb25zdCBoYW5kbGVVcGRhdGVJdGVtRmllbGQgPSAoaWQ6IHN0cmluZywgZmllbGQ6IGtleW9mIFBhY2tpbmdJdGVtLCB2YWx1ZTogYW55KSA9PiB7XG4gICAgc2V0UGFja2luZ0l0ZW1zKHByZXYgPT4gcHJldi5tYXAoaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uaXRlbSwgW2ZpZWxkXTogdmFsdWUgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pKTtcbiAgfTtcblxuICAvLyBMb2FkIGRlbGl2ZXJ5IGludG8gZm9ybSBmb3IgZWRpdGluZ1xuICBjb25zdCBoYW5kbGVFZGl0RGVsaXZlcnkgPSAoZGVsaXZlcnk6IFBhY2thZ2luZ0RlbGl2ZXJ5KSA9PiB7XG4gICAgc2V0RWRpdGluZ0RlbGl2ZXJ5SWQoZGVsaXZlcnkuaWQpO1xuICAgIHNldFNlbGVjdGVkUHJvamVjdElkKGRlbGl2ZXJ5LnByb2plY3RJZCk7XG4gICAgc2V0U2VsZWN0ZWRQcm9mb3JtYUlkKGRlbGl2ZXJ5LnByb2Zvcm1hSWQgfHwgJycpO1xuICAgIHNldERlbGl2ZXJ5RGF0ZShkZWxpdmVyeS5kZWxpdmVyeURhdGUpO1xuICAgIHNldFNoaXBwaW5nTWV0aG9kKGRlbGl2ZXJ5LnNoaXBwaW5nTWV0aG9kKTtcbiAgICBzZXRQcmVEZWxpdmVyeVRlc3ROb3RlcyhkZWxpdmVyeS5wcmVEZWxpdmVyeVRlc3ROb3RlcyB8fCAnJyk7XG4gICAgc2V0UGFja2luZ0l0ZW1zKGRlbGl2ZXJ5Lml0ZW1zKTtcbiAgICBzZXRDaGVja2xpc3QoZGVsaXZlcnkuY2hlY2tsaXN0KTtcbiAgICBzZXRQaG90b3MoZGVsaXZlcnkucGhvdG9zIHx8IFtdKTtcbiAgICBzZXRBY3RpdmVUYWIoJ25ldycpO1xuICB9O1xuXG4gIC8vIFN1Ym1pdCBkZWxpdmVyeSBpbmZvXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChlOiBSZWFjdC5Gb3JtRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCFzZWxlY3RlZFByb2plY3RJZCkge1xuICAgICAgYWxlcnQoJ9mE2LfZgdin2Ysg2b7YsdmI2pjZhyDZhdix2KrYqNi3INix2Kcg2KfZhtiq2K7Yp9ioINqp2YbbjNivLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFja2luZ0l0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWxlcnQoJ9it2K/Yp9mC2YQg24zaqSDaqdin2YTYpyDbjNinINiz2YbYryDYqNin24zYryDYr9ixINm+2qnbjNmG2q8g2YTbjNiz2Kog2YjYrNmI2K8g2K/Yp9i02KrZhyDYqNin2LTYry4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qID0gcHJvamVjdHMuZmluZChwID0+IHAuaWQgPT09IHNlbGVjdGVkUHJvamVjdElkKTtcbiAgICBjb25zdCBwcm9mID0gcHJvZm9ybWFzLmZpbmQocCA9PiBwLmlkID09PSBzZWxlY3RlZFByb2Zvcm1hSWQpO1xuXG4gICAgaWYgKGVkaXRpbmdEZWxpdmVyeUlkKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0RlbGl2ZXJ5ID0gcGFja2FnaW5nRGVsaXZlcmllcy5maW5kKGQgPT4gZC5pZCA9PT0gZWRpdGluZ0RlbGl2ZXJ5SWQpO1xuICAgICAgaWYgKGV4aXN0aW5nRGVsaXZlcnkpIHtcbiAgICAgICAgdXBkYXRlUGFja2FnaW5nRGVsaXZlcnkoe1xuICAgICAgICAgIC4uLmV4aXN0aW5nRGVsaXZlcnksXG4gICAgICAgICAgcHJvamVjdElkOiBzZWxlY3RlZFByb2plY3RJZCxcbiAgICAgICAgICBwcm9qZWN0TmFtZTogcHJvaj8ubmFtZSB8fCAnJyxcbiAgICAgICAgICBwcm9mb3JtYUlkOiBzZWxlY3RlZFByb2Zvcm1hSWQgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgIHByb2Zvcm1hTnVtYmVyOiBwcm9mPy5wcm9mb3JtYU51bWJlciB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgZGVsaXZlcnlEYXRlLFxuICAgICAgICAgIHNoaXBwaW5nTWV0aG9kLFxuICAgICAgICAgIHByZURlbGl2ZXJ5VGVzdE5vdGVzLFxuICAgICAgICAgIGNoZWNrbGlzdCxcbiAgICAgICAgICBpdGVtczogcGFja2luZ0l0ZW1zLFxuICAgICAgICAgIHBob3Rvc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVsaXZlcnlEYXRhID0ge1xuICAgICAgICBwcm9qZWN0SWQ6IHNlbGVjdGVkUHJvamVjdElkLFxuICAgICAgICBwcm9qZWN0TmFtZTogcHJvaj8ubmFtZSB8fCAnJyxcbiAgICAgICAgcHJvZm9ybWFJZDogc2VsZWN0ZWRQcm9mb3JtYUlkIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgcHJvZm9ybWFOdW1iZXI6IHByb2Y/LnByb2Zvcm1hTnVtYmVyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgZGVsaXZlcnlEYXRlLFxuICAgICAgICBzaGlwcGluZ01ldGhvZCxcbiAgICAgICAgcHJlRGVsaXZlcnlUZXN0Tm90ZXMsXG4gICAgICAgIGNoZWNrbGlzdCxcbiAgICAgICAgaXRlbXM6IHBhY2tpbmdJdGVtcyxcbiAgICAgICAgcGhvdG9zXG4gICAgICB9O1xuICAgICAgYWRkUGFja2FnaW5nRGVsaXZlcnkoZGVsaXZlcnlEYXRhKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBGb3JtXG4gICAgc2V0RWRpdGluZ0RlbGl2ZXJ5SWQobnVsbCk7XG4gICAgc2V0U2VsZWN0ZWRQcm9qZWN0SWQoJycpO1xuICAgIHNldFNlbGVjdGVkUHJvZm9ybWFJZCgnJyk7XG4gICAgc2V0RGVsaXZlcnlEYXRlKGdldFRvZGF5U2hhbXNpKCkpO1xuICAgIHNldFNoaXBwaW5nTWV0aG9kKHNldHRpbmdzLmRyb3Bkb3duSXRlbXMuc2hpcHBpbmdNZXRob2RzPy5bMF0gfHwgJ9io2KfYsdio2LHbjCcpO1xuICAgIHNldFByZURlbGl2ZXJ5VGVzdE5vdGVzKCcnKTtcbiAgICBzZXRQYWNraW5nSXRlbXMoW10pO1xuICAgIHNldENoZWNrbGlzdChbXSk7XG4gICAgc2V0UGhvdG9zKFtdKTtcblxuICAgIHNldENoZWNrbGlzdChbXSk7XG4gICAgc2V0UGhvdG9zKFtdKTtcblxuICAgIHNldEFjdGl2ZVRhYignbGlzdCcpO1xuICB9O1xuXG4gIC8vIEZpbHRlciBkZWxpdmVyaWVzXG4gIGNvbnN0IGZpbHRlcmVkRGVsaXZlcmllcyA9IHBhY2thZ2luZ0RlbGl2ZXJpZXMuZmlsdGVyKGQgPT4ge1xuICAgIGNvbnN0IG1hdGNoZXNQcm9qZWN0ID0gIWZpbHRlclByb2plY3QgfHwgZC5wcm9qZWN0SWQgPT09IGZpbHRlclByb2plY3Q7XG4gICAgY29uc3QgbWF0Y2hlc1NlYXJjaCA9ICFzZWFyY2hUZXJtIHx8IFxuICAgICAgZC5wcm9qZWN0TmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgIGQucGFja2luZ0xpc3ROdW1iZXIudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICBkLnNoaXBwaW5nTWV0aG9kLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKTtcblxuICAgIHJldHVybiBtYXRjaGVzUHJvamVjdCAmJiBtYXRjaGVzU2VhcmNoO1xuICB9KTtcblxuICAvLyBDYWxjdWxhdGUgc3RhdHNcbiAgY29uc3QgdG90YWxMaXN0cyA9IHBhY2thZ2luZ0RlbGl2ZXJpZXMubGVuZ3RoO1xuICBjb25zdCB0b3RhbFBhY2thZ2VzID0gcGFja2FnaW5nRGVsaXZlcmllcy5yZWR1Y2UoKGFjYywgZCkgPT4gYWNjICsgZC5pdGVtcy5sZW5ndGgsIDApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTYgdGV4dC1yaWdodFwiIGRpcj1cInJ0bFwiPlxuICAgICAgey8qIEhlYWRlciAmIFN0YXRzIEJhbm5lciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtc3RhcnQgbWQ6aXRlbXMtY2VudGVyIGdhcC00IGJnLXdoaXRlIHAtNiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MCBzaGFkb3ctc21cIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC14bCBtZDp0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1zbGF0ZS04MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxQYWNrYWdlIGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC01MDBcIiBzaXplPXsyNn0gLz5cbiAgICAgICAgICAgINio2LPYqtmH4oCM2KjZhtiv24wg2Ygg2KrYrdmI24zZhCDaqdin2YTYpyAo2b7aqduM2YbaryDZhNuM2LPYqilcbiAgICAgICAgICA8L2gxPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgbXQtMVwiPlxuICAgICAgICAgICAg2qnZhtiq2LHZhCDYp9mC2YTYp9mFINio2LPYqtmH4oCM2KjZhtiv24zYjCDYqtiz2Kog2qnYp9ix2qnYsdivINmC2KjZhCDYp9iyINiq2K3ZiNuM2YQg2KrYrNmH24zYstin2KrYjCDYq9io2Kog2obaqeKAjNmE24zYs9iqINio2KfYstix2LPbjCDZiCDYtdin2K/Ysdqp2YbZhtiv2Ycg2LTZhtin2LPZhtin2YXZhyDZiCDZvtqp24zZhtqvINmE24zYs9iqINin2LPYqtin2YbYr9in2LHYr1xuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1lbWVyYWxkLTUwLzUwIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1lbWVyYWxkLTEwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNjAwIGZvbnQtZXh0cmFib2xkIHRleHQtMnhsXCI+e3RvdGFsTGlzdHN9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1lbWVyYWxkLTgwMFwiPtqp2YQg2b7aqduM2YbaryDZhNuM2LPYquKAjNmH2Kc8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNreS01MC81MCBweC00IHB5LTIuNSByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItc2t5LTEwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNreS02MDAgZm9udC1leHRyYWJvbGQgdGV4dC0yeGxcIj57dG90YWxQYWNrYWdlc308L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNreS04MDBcIj7aqdmEINio2LPYqtmH4oCM2YfYp9uMINir2KjYqiDYtNiv2Yc8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIE5hdmlnYXRpb24gdGFicyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBib3JkZXItYiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ2xpc3QnKX1cbiAgICAgICAgICBjbGFzc05hbWU9e2BweC02IHB5LTMgZm9udC1zZW1pYm9sZCB0ZXh0LXNtIHRyYW5zaXRpb24tYWxsIGJvcmRlci1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgJHtcbiAgICAgICAgICAgIGFjdGl2ZVRhYiA9PT0gJ2xpc3QnIFxuICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgdGV4dC1lbWVyYWxkLTYwMCcgXG4gICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCB0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXNsYXRlLTYwMCdcbiAgICAgICAgICB9YH1cbiAgICAgICAgPlxuICAgICAgICAgIDxGaWxlVGV4dCBzaXplPXsxOH0gLz5cbiAgICAgICAgICDZhNuM2LPYqiDZvtqp24zZhtqvINmE24zYs9iq4oCM2YfYp9uMINi12KfYr9ixINi02K/Zh1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYignbmV3Jyl9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNiBweS0zIGZvbnQtc2VtaWJvbGQgdGV4dC1zbSB0cmFuc2l0aW9uLWFsbCBib3JkZXItYi0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yICR7XG4gICAgICAgICAgICBhY3RpdmVUYWIgPT09ICduZXcnIFxuICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgdGV4dC1lbWVyYWxkLTYwMCcgXG4gICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCB0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXNsYXRlLTYwMCdcbiAgICAgICAgICB9YH1cbiAgICAgICAgPlxuICAgICAgICAgIDxQbHVzIHNpemU9ezE4fSAvPlxuICAgICAgICAgINir2KjYqiDYqNiz2KrZh+KAjNio2YbYr9uMINmIINi12K/ZiNixINm+2qnbjNmG2q8g2YTbjNiz2Kog2KzYr9uM2K9cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIExJU1QgVEFCICovfVxuICAgICAge2FjdGl2ZVRhYiA9PT0gJ2xpc3QnICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICB7LyogRmlsdGVyIEJhciAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtNSByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLXNsYXRlLTEwMCBzaGFkb3ctc20gZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMyBnYXAtNCBpdGVtcy1lbmRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMS41XCI+2YHbjNmE2KrYsSDZvtix2YjamNmHPC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgIHZhbHVlPXtmaWx0ZXJQcm9qZWN0fVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEZpbHRlclByb2plY3QoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBiZy1zbGF0ZS01MCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLXhsIHB4LTMgcHktMiB0ZXh0LXhzIGZvbnQtbWVkaXVtIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLWVtZXJhbGQtNTAwIG91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+2YfZhdmHINm+2LHZiNqY2YfigIzZh9inPC9vcHRpb24+XG4gICAgICAgICAgICAgICAge3Byb2plY3RzLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+e3AubmFtZX08L29wdGlvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtZDpjb2wtc3Bhbi0yXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMS41XCI+2KzYs9iq2KzZiCDZhdiq2YbbjDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2KzYs9iq2KzZiCDYqNixINin2LPYp9izINi02YXYp9ix2Ycg2b7aqduM2YbaryDZhNuM2LPYqtiMINm+2LHZiNqY2YfYjCDYsdmI2LQg2KfYsdiz2KfZhC4uLlwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoVGVybX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFNlYXJjaFRlcm0oZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXNsYXRlLTUwIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQteGwgcHItOSBwbC0zIHB5LTIgdGV4dC14cyBmb250LW1lZGl1bSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1lbWVyYWxkLTUwMCBvdXRsaW5lLW5vbmVcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFNlYXJjaCBzaXplPXsxNn0gY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMyB0b3AtMi41IHRleHQtc2xhdGUtNDAwXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBMaXN0IGl0ZW1zICovfVxuICAgICAgICAgIHtmaWx0ZXJlZERlbGl2ZXJpZXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTEyIHRleHQtY2VudGVyIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItc2xhdGUtMTAwIHNoYWRvdy1zbSBzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTE2IGgtMTYgYmctc2xhdGUtNTAgdGV4dC1zbGF0ZS0zMDAgcm91bmRlZC1mdWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG14LWF1dG9cIj5cbiAgICAgICAgICAgICAgICA8UGFja2FnZSBzaXplPXszMn0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbGF0ZS03MDBcIj7Zh9uM2oYg2b7aqduM2YbaryDZhNuM2LPYqtuMINuM2KfZgdiqINmG2LTYrzwvaDM+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj7Yp9i32YTYp9i52KfYqiDYqNiz2KrZh+KAjNio2YbYr9uMINmIINiq2K3ZiNuM2YTbjCDYr9ixINiz24zYs9iq2YUg2YjYrNmI2K8g2YbYr9in2LHYry48L3A+XG4gICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCduZXcnKX0gXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtMiBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgZm9udC1zZW1pYm9sZCBweC00IHB5LTIgcm91bmRlZC14bCBob3ZlcjpiZy1lbWVyYWxkLTYwMCB0cmFuc2l0aW9uXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgINi12K/ZiNixINin2YjZhNuM2YYg2b7aqduM2YbaryDZhNuM2LPYqiDaqdin2YTYp1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTMgZ2FwLTRcIj5cbiAgICAgICAgICAgICAge2ZpbHRlcmVkRGVsaXZlcmllcy5tYXAoZGVsaXZlcnkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWRDb3VudCA9IGRlbGl2ZXJ5LmNoZWNrbGlzdC5maWx0ZXIoYyA9PiBjLmNvbXBsZXRlZCkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsQ2hlY2tsaXN0ID0gZGVsaXZlcnkuY2hlY2tsaXN0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgICAga2V5PXtkZWxpdmVyeS5pZH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctd2hpdGUgcC01IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItc2xhdGUtMTUwIHNoYWRvdy14cyBob3ZlcjpzaGFkb3ctbWQgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwIGZsZXggZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIHNwYWNlLXktNCBob3Zlcjpib3JkZXItZW1lcmFsZC0yMDBcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtc3RhcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgYmctc2xhdGUtMTAwIHRleHQtc2xhdGUtNzAwIHB4LTIuNSBweS0xIHJvdW5kZWQtbGdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2RlbGl2ZXJ5LnBhY2tpbmdMaXN0TnVtYmVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxDYWxlbmRhciBzaXplPXsxM30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2RlbGl2ZXJ5LmRlbGl2ZXJ5RGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc2xhdGUtODAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e2RlbGl2ZXJ5LnByb2plY3ROYW1lfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZGVsaXZlcnkucHJvZm9ybWFOdW1iZXIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMFwiPtm+24zYtOKAjNmB2Kfaqdiq2YjYsToge2RlbGl2ZXJ5LnByb2Zvcm1hTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0yIHRleHQteHMgdGV4dC1zbGF0ZS02MDAgcHQtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmctc2t5LTUwIHRleHQtc2t5LTcwMCBweC0yIHB5LTAuNSByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItc2t5LTEwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LVsxMXB4XVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJ1Y2sgc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtkZWxpdmVyeS5zaGlwcGluZ01ldGhvZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJnLWVtZXJhbGQtNTAgdGV4dC1lbWVyYWxkLTcwMCBweC0yIHB5LTAuNSByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZW1lcmFsZC0xMDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC1bMTFweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFBhY2thZ2Ugc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtkZWxpdmVyeS5pdGVtcy5sZW5ndGh9INix2K/bjNmBINqp2KfZhNinXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICB7dG90YWxDaGVja2xpc3QgPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xLjUgcHQtMiBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+2b7bjNi02LHZgdiqINio2KfYstix2LPbjCDYqtit2YjbjNmEOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGRcIj57Y2hlY2tlZENvdW50fSDYp9iyIHt0b3RhbENoZWNrbGlzdH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBiZy1zbGF0ZS0xMDAgaC0xIHJvdW5kZWQtZnVsbCBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctZW1lcmFsZC01MDAgaC0xIHRyYW5zaXRpb24tYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHsoY2hlY2tlZENvdW50IC8gdG90YWxDaGVja2xpc3QpICogMTAwfSVgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBwdC0yIGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZERlbGl2ZXJ5KGRlbGl2ZXJ5KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLWVtZXJhbGQtNTAgdGV4dC1lbWVyYWxkLTcwMCBob3ZlcjpiZy1lbWVyYWxkLTEwMCBmb250LWJvbGQgdGV4dC14cyBweC0zIHB5LTEuNSByb3VuZGVkLXhsIHRyYW5zaXRpb24gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxJbmZvIHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAg2YXYtNin2YfYr9mHINis2LLYptuM2KfYqiDZiCDahtin2b5cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlRWRpdERlbGl2ZXJ5KGRlbGl2ZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1za3ktNTAwIGhvdmVyOnRleHQtc2t5LTYwMCBob3ZlcjpiZy1za3ktNTAgcC0xLjUgcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2YjbjNix2KfbjNi0INm+2qnbjNmG2q8g2YTbjNiz2KpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8RWRpdCBzaXplPXsxNX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXREZWxldGVEZWxpdmVyeUlkKGRlbGl2ZXJ5LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTUwMCBob3Zlcjp0ZXh0LXJvc2UtNjAwIGhvdmVyOmJnLXJvc2UtNTAgcC0xLjUgcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwi2K3YsNmBINm+2qnbjNmG2q8g2YTbjNiz2KpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJhc2gyIHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBORVcgUkVHSVNUUkFUSU9OIEZPUk0gKi99XG4gICAgICB7YWN0aXZlVGFiID09PSAnbmV3JyAmJiAoXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9IGNsYXNzTmFtZT1cImJnLXdoaXRlIHAtNiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MCBzaGFkb3ctc20gc3BhY2UteS02XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBwYi0zIGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xNTBcIj5cbiAgICAgICAgICAgIDxQYWNrYWdlIHNpemU9ezIyfSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgLz5cbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1ib2xkIHRleHQtc2xhdGUtODAwXCI+2KvYqNiqINmF2LTYrti12KfYqiDYqNiz2KrZh+KAjNio2YbYr9uMINmIINiq2K3ZiNuM2YQg2KzYr9uM2K88L2gyPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGxnOmdyaWQtY29scy00IGdhcC00XCI+XG4gICAgICAgICAgICB7LyogUHJvamVjdCBkcm9wZG93biAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtin2YbYqtiu2KfYqCDZvtix2YjamNmHIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS01MDBcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRQcm9qZWN0SWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlUHJvamVjdENoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC14bCBweC0zIHB5LTIgdGV4dC14cyBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1lbWVyYWxkLTUwMCBmb2N1czpvdXRsaW5lLW5vbmVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPi0tINin2YbYqtiu2KfYqCDZvtix2YjamNmHIC0tPC9vcHRpb24+XG4gICAgICAgICAgICAgICAge3Byb2plY3RzLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+e3AubmFtZX08L29wdGlvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEFwcHJvdmVkIFByb2Zvcm1hcyBkcm9wZG93biAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtm+24zYtOKAjNmB2Kfaqdiq2YjYsSDYqtin24zbjNivINi02K/ZhyDZhdix2KrYqNi3PC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZFByb2Zvcm1hSWR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlUHJvZm9ybWFDaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshc2VsZWN0ZWRQcm9qZWN0SWR9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQteGwgcHgtMyBweS0yIHRleHQteHMgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctZW1lcmFsZC01MDAgZm9jdXM6b3V0bGluZS1ub25lIGRpc2FibGVkOm9wYWNpdHktNTBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPi0tINio2K/ZiNmGINm+24zYtOKAjNmB2Kfaqdiq2YjYsSDZhdix2KrYqNi3ICjYq9io2Kog2K/Ys9iq24wg2KfZgtmE2KfZhSkgLS08L29wdGlvbj5cbiAgICAgICAgICAgICAgICB7YXZhaWxhYmxlUHJvZm9ybWFzLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+2b7bjNi04oCM2YHYp9qp2KrZiNixIHtwLnByb2Zvcm1hTnVtYmVyfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogRGVsaXZlcnkgRGF0ZSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtiq2KfYsduM2K4g2KrYrdmI24zZhCAvINio2KfYsdqv24zYsduMPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkZWxpdmVyeURhdGV9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0RGVsaXZlcnlEYXRlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2YXYq9in2YQ6INux27TbsNu1L9uw27Qv27HbuFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQteGwgcHgtMyBweS0yIHRleHQteHMgdGV4dC1sZWZ0IGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLWVtZXJhbGQtNTAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb250LW1vbm9cIlxuICAgICAgICAgICAgICAgIGRpcj1cImx0clwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFNoaXBwaW5nIE1ldGhvZCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtmG2K3ZiNmHINin2LHYs9in2YQg2qnYp9mE2Kc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgdmFsdWU9e3NoaXBwaW5nTWV0aG9kfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFNoaXBwaW5nTWV0aG9kKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC14bCBweC0zIHB5LTIgdGV4dC14cyBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1lbWVyYWxkLTUwMCBmb2N1czpvdXRsaW5lLW5vbmVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3NldHRpbmdzLmRyb3Bkb3duSXRlbXMuc2hpcHBpbmdNZXRob2RzPy5tYXAoKG1ldGhvZCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpbmRleH0gdmFsdWU9e21ldGhvZH0+e21ldGhvZH08L29wdGlvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBDaGVja2xpc3QgQXJlYSAqL31cbiAgICAgICAgICB7Y2hlY2tsaXN0Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCBwLTQgcm91bmRlZC0yeGwgc3BhY2UteS0zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBib3JkZXItYiBib3JkZXItc2xhdGUtMjAwIHBiLTJcIj5cbiAgICAgICAgICAgICAgICA8RmlsZUNoZWNrIGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC01MDBcIiBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMFwiPtqG2qnigIzZhNuM2LPYqiDaqdmG2KrYsdmEINmIINio2KfYstix2LPbjCDYqtit2YjbjNmEINqp2KfZhNinICjYp9mE2q/ZiCk8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTMgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7Y2hlY2tsaXN0Lm1hcCgoaXRlbSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBcbiAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH0gXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yLjUgcC0zIGJnLXdoaXRlIGJvcmRlciBib3JkZXItc2xhdGUtMTUwIHJvdW5kZWQteGwgaG92ZXI6YmctZW1lcmFsZC01MC8yMCBjdXJzb3ItcG9pbnRlciB0cmFuc2l0aW9uIHNlbGVjdC1ub25lXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpdGVtLmNvbXBsZXRlZH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBbLi4uY2hlY2tsaXN0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRbaW5kZXhdLmNvbXBsZXRlZCA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkW2luZGV4XS5jb21wbGV0ZWRBdCA9IGUudGFyZ2V0LmNoZWNrZWQgPyBnZXRUb2RheVNoYW1zaSgpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2hlY2tsaXN0KHVwZGF0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZCB0ZXh0LWVtZXJhbGQtNjAwIGZvY3VzOnJpbmctZW1lcmFsZC01MDAgdy00IGgtNCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS03MDAgZm9udC1tZWRpdW1cIj57aXRlbS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBUZXN0IHJlcG9ydCB0ZXh0YXJlYSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMS41XCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS03MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cbiAgICAgICAgICAgICAgPENsaXBib2FyZENoZWNrIHNpemU9ezE1fSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgLz5cbiAgICAgICAgICAgICAg2KvYqNiqINqv2LLYp9ix2LQg2KrYs9iq4oCM2YfYp9uMINin2YbYrNin2YUg2LTYr9mHINmC2KjZhCDYp9iyINiq2K3ZiNuM2YRcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgcm93cz17M31cbiAgICAgICAgICAgICAgdmFsdWU9e3ByZURlbGl2ZXJ5VGVzdE5vdGVzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRQcmVEZWxpdmVyeVRlc3ROb3RlcyhlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2YXYq9in2YQ6INiq2LPYqiDYudin24zZgiDYp9mE2qnYqtix24zaqduMINio2Kcg2K/Ys9iq2q/Yp9mHINmF2q/YsSDYp9mG2KzYp9mFINi02K8g2Ygg2KrYp9uM24zYryDar9ix2K/bjNivLiDZh9mF2obZhtuM2YYg2KjYsdiv2YfYp9uMINqp2KfZhNuM2KjYsdin2LPbjNmI2YYg2KjYsdix2LPbjCDZiCDar9mI2KfZh9uMINqp2KfZhNuM2KjYsdin2LPbjNmI2YYg2K/YsSDYrNi52KjZhyDaqdin2YTYpyDZgtix2KfYsSDar9ix2YHYqi5cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC14bCBwLTMgdGV4dC14cyBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1lbWVyYWxkLTUwMCBmb2N1czpvdXRsaW5lLW5vbmUgbGVhZGluZy1yZWxheGVkXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogUGFja2luZyBpdGVtcyBtYW5hZ2VyICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC0yeGwgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwIHAtNCBib3JkZXItYiBib3JkZXItc2xhdGUtMjAwIGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS04MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgIDxQYWNrYWdlIHNpemU9ezE1fSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgLz5cbiAgICAgICAgICAgICAgICDZhNuM2LPYqiDYp9mC2YTYp9mFINm+2qnbjNmG2q8g2YTbjNiz2KogKNmE24zYs9iqINi52K/ZhOKAjNio2YbYr9uMKVxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBmb250LW1lZGl1bVwiPtmF2KzZhdmI2Lkg2KfZgtmE2KfZhToge3BhY2tpbmdJdGVtcy5sZW5ndGh9INix2K/bjNmBPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHNwYWNlLXktNFwiPlxuICAgICAgICAgICAgICB7LyogRHluYW1pYyBUYWJsZSBvciBJbnB1dHMgKi99XG4gICAgICAgICAgICAgIHtwYWNraW5nSXRlbXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC04IHRleHQtY2VudGVyIHRleHQteHMgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtNTAvNTAgcm91bmRlZC14bFwiPlxuICAgICAgICAgICAgICAgICAg2KLbjNiq2YXbjCDYr9ixINm+2qnbjNmG2q8g2YTbjNiz2Kog2KvYqNiqINmG2LTYr9mHINin2LPYqi4g2KfYsiDaqdin2K/YsSDYstuM2LEg2KjYsdin24wg2KfYttin2YHZhyDaqdix2K/ZhiDYp9iz2KrZgdin2K/ZhyDaqdmG24zYry5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93LXgtYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LXhzIHRleHQtcmlnaHQgYm9yZGVyLWNvbGxhcHNlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTE1MCB0ZXh0LXNsYXRlLTQwMCBmb250LWJvbGQgYmctc2xhdGUtNTAvNDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgdy04XCI+2LHYr9uM2YE8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMlwiPtqp2KfZhNinINuM2Kcg2YXYr9ix2qkg2KfYsdiz2KfZhNuMPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgdy0yMFwiPtiq2LnYr9in2K88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiB3LTI4XCI+2YbZiNi5INio2LPYqtmH4oCM2KjZhtiv24w8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiB3LTQ0XCI+2KfYqNi52KfYryAo2LfZiNmEeNi52LHYtnjYp9ix2KrZgdin2LkpPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgdy0yNFwiPtmI2LLZhiAo2qnbjNmE2Yjar9ix2YUpPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTIgdy0yNFwiPti02YXYp9ix2Ycg2KzYudio2Yc8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtMiB3LTEwIHRleHQtY2VudGVyXCI+2K3YsNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPVwiZGl2aWRlLXkgZGl2aWRlLXNsYXRlLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtwYWNraW5nSXRlbXMubWFwKChpdGVtLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT1cImhvdmVyOmJnLXNsYXRlLTUwLzQwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTIgdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vXCI+e2lkeCArIDF9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0uaXRlbU9yRG9jTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGhhbmRsZVVwZGF0ZUl0ZW1GaWVsZChpdGVtLmlkLCAnaXRlbU9yRG9jTmFtZScsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBiZy10cmFuc3BhcmVudCBib3JkZXItYiBib3JkZXItdHJhbnNwYXJlbnQgaG92ZXI6Ym9yZGVyLXNsYXRlLTIwMCBmb2N1czpib3JkZXItZW1lcmFsZC01MDAgZm9jdXM6Ymctd2hpdGUgcm91bmRlZCBweC0xLjUgcHktMSB0ZXh0LXhzIGZvbnQtbWVkaXVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnF1YW50aXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlVXBkYXRlSXRlbUZpZWxkKGl0ZW0uaWQsICdxdWFudGl0eScsIE51bWJlcihlLnRhcmdldC52YWx1ZSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQgcHgtMS41IHB5LTEgdGV4dC14cyB0ZXh0LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnBhY2thZ2VUeXBlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlVXBkYXRlSXRlbUZpZWxkKGl0ZW0uaWQsICdwYWNrYWdlVHlwZScsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkIHB4LTEuNSBweS0xIHRleHQteHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZXR0aW5ncy5kcm9wZG93bkl0ZW1zLnBhY2thZ2VUeXBlcz8ubWFwKChwdCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aX0gdmFsdWU9e3B0fT57cHR9PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0uZGltZW5zaW9uc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi27XbsHjbtNuweNuz27Ag2LPYp9mG2KrbjOKAjNmF2KrYsVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBoYW5kbGVVcGRhdGVJdGVtRmllbGQoaXRlbS5pZCwgJ2RpbWVuc2lvbnMnLCBlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZCBweC0xLjUgcHktMSB0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LWxlZnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyPVwibHRyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLndlaWdodH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGhhbmRsZVVwZGF0ZUl0ZW1GaWVsZChpdGVtLmlkLCAnd2VpZ2h0JywgTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZCBweC0xLjUgcHktMSB0ZXh0LXhzIHRleHQtY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5ib3hOdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBoYW5kbGVVcGRhdGVJdGVtRmllbGQoaXRlbS5pZCwgJ2JveE51bWJlcicsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi2KzYudio2Ycg27FcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQgcHgtMS41IHB5LTEgdGV4dC14cyB0ZXh0LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlUmVtb3ZlSXRlbShpdGVtLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtcm9zZS01MDAgaG92ZXI6dGV4dC1yb3NlLTYwMCBwLTEgcm91bmRlZCBob3ZlcjpiZy1yb3NlLTUwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJhc2gyIHNpemU9ezEzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgey8qIEFkZCBDdXN0b20gSXRlbSAvIERvYyBCbG9jayAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS01MCBwLTQgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMC82MCBzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2KfZgdiy2YjYr9mGINqp2KfZhNin2Iwg2YXYr9in2LHaqSDbjNinINmI2LPYp9uM2YQg2KzYp9mG2KjbjCDZhdiq2YHYsdmC2Yc8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTQgZ2FwLTMgaXRlbXMtZW5kXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2YbYp9mFINqp2KfZhNinINuM2Kcg2YXYs9iq2YbYr9in2KogKNmF2KvYp9mEOiDYtNmG2KfYs9mG2KfZhdmHINqv2KfYsdin2YbYqtuMKTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVtcEl0ZW1OYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRlbXBJdGVtTmFtZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLaqdin2KrYp9mE2Yjar9iMINmC2LfYudmHINuM2K/aqduM2Iwg2YbZgti02Ycg2YHZiNmG2K/Yp9iz24zZiNmGLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0zIHB5LTEuNSB0ZXh0LXhzIGZvY3VzOm91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2tcIj7Yqti52K/Yp9ivPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RlbXBJdGVtUXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0VGVtcEl0ZW1RdHkoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweC0yIHB5LTEuNSB0ZXh0LXhzIHRleHQtY2VudGVyIGZvY3VzOm91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9ja1wiPtmG2YjYuSDYqNiz2KrZh+KAjNio2YbYr9uMPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVtcEl0ZW1QYWNrVHlwZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRlbXBJdGVtUGFja1R5cGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHgtMiBweS0xLjUgdGV4dC14cyBmb2N1czpvdXRsaW5lLW5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzZXR0aW5ncy5kcm9wZG93bkl0ZW1zLnBhY2thZ2VUeXBlcz8ubWFwKChwdCwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpZHh9IHZhbHVlPXtwdH0+e3B0fTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTUgZ2FwLTEuNSBpdGVtcy1lbmRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc3Bhbi0zIHNwYWNlLXktMVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2tcIj7Yp9io2LnYp9ivICjYt9mI2YR42LnYsdi2eNin2LHYqtmB2KfYuSkg2KjZhyDYs9in2YbYqtuM4oCM2YXYqtixPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTEgaXRlbXMtY2VudGVyXCIgZGlyPVwibHRyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIti32YjZhFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZW1wSXRlbUxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0VGVtcEl0ZW1MZW5ndGgoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBweS0xLjUgdGV4dC14cyB0ZXh0LWNlbnRlciBmb2N1czpvdXRsaW5lLW5vbmUgZm9udC1tb25vXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTQwMFwiPng8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIti52LHYtlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZW1wSXRlbVdpZHRofVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRUZW1wSXRlbVdpZHRoKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHktMS41IHRleHQteHMgdGV4dC1jZW50ZXIgZm9jdXM6b3V0bGluZS1ub25lIGZvbnQtbW9ub1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS00MDBcIj54PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLYp9ix2KrZgdin2LlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVtcEl0ZW1IZWlnaHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRlbXBJdGVtSGVpZ2h0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQtbGcgcHktMS41IHRleHQteHMgdGV4dC1jZW50ZXIgZm9jdXM6b3V0bGluZS1ub25lIGZvbnQtbW9ub1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrXCI+2YjYstmGIChLZyk8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItmI2LLZhlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGVtcEl0ZW1XZWlnaHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRUZW1wSXRlbVdlaWdodChOdW1iZXIoZS50YXJnZXQudmFsdWUpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB5LTEuNSB0ZXh0LXhzIHRleHQtY2VudGVyIGZvY3VzOm91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9ja1wiPti02YXYp9ix2Ycg2KzYudio2Ycv2b7Yp9mE2Ko8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLYtNmF2KfYsdmHINis2LnYqNmHXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0ZW1wSXRlbUJveE51bWJlciB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRlbXBJdGVtQm94TnVtYmVyKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIHB5LTEuNSB0ZXh0LXhzIHRleHQtY2VudGVyIGZvY3VzOm91dGxpbmUtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVBZGRDdXN0b21JdGVtfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBiZy1zbGF0ZS03MDAgdGV4dC13aGl0ZSByb3VuZGVkLWxnIHB5LTIgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbiBob3ZlcjpiZy1zbGF0ZS04MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTEgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFBsdXMgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAg2KfZgdiy2YjYr9mGINio2Ycg2YTbjNiz2Kog2LnYr9mE4oCM2KjZhtiv24xcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBQaG90byB1cGxvYWQgc2VjdGlvbiAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQteHMgZm9udC1ib2xkIHRleHQtc2xhdGUtNzAwXCI+2KjYp9ix2q/YsNin2LHbjCDYqti12KfZiNuM2LEg2KjYs9iq2YfigIzYqNmG2K/bjNiMINiz2YTYp9mF2Kog2KrYrNmH24zYsiDZiCDZgdix2KLbjNmG2K8g2KjYp9ix2q/bjNix24wg2qnYp9mE2Kc8L2xhYmVsPlxuICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgb25EcmFnT3Zlcj17aGFuZGxlRHJhZ092ZXJ9XG4gICAgICAgICAgICAgIG9uRHJvcD17aGFuZGxlRHJvcH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtMzAwIGhvdmVyOmJvcmRlci1lbWVyYWxkLTQwMCBiZy1zbGF0ZS01MC81MCByb3VuZGVkLTJ4bCBwLTYgdGV4dC1jZW50ZXIgdHJhbnNpdGlvbiBjdXJzb3ItcG9pbnRlciBncm91cFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaG90by11cGxvYWQtaW5wdXQnKT8uY2xpY2soKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICAgIGlkPVwicGhvdG8tdXBsb2FkLWlucHV0XCJcbiAgICAgICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVBob3RvVXBsb2FkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VXBsb2FkIGNsYXNzTmFtZT1cIm14LWF1dG8gdGV4dC1zbGF0ZS00MDAgZ3JvdXAtaG92ZXI6dGV4dC1lbWVyYWxkLTUwMCB0cmFuc2l0aW9uLWNvbG9ycyBtYi0yXCIgc2l6ZT17MzJ9IC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1zbGF0ZS02MDAgZ3JvdXAtaG92ZXI6dGV4dC1zbGF0ZS04MDAgdHJhbnNpdGlvbi1jb2xvcnNcIj5cbiAgICAgICAgICAgICAgICDYp9mG2KrYrtin2Kgg2KrYtdmI24zYsSAo2KrYtdin2YjbjNixINio2LPYqtmH4oCM2KjZhtiv24zYjCDZvtmE2KfaqSDYr9iz2Krar9in2YfYjCDZgduM2LQg2KrYsdiu24zYtSDZiCDYqNin2LHar9uM2LHbjClcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS00MDAgbXQtMVwiPtmF24zigIzYqtmI2KfZhtuM2K8g2YHYp9uM2YTigIzZh9in24wg2KrYtdmI24zYsduMINiu2YjYryDYsdinINmF2LPYqtmC24zZhdin2Ysg2KjZhyDYp9uM2YbYrNinINio2qnYtNuM2K8g2Ygg2LHZh9inINqp2YbbjNivLjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBQaG90b3MgUHJldmlldyBHcmlkICovfVxuICAgICAgICAgICAge3Bob3Rvcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIHNtOmdyaWQtY29scy00IGxnOmdyaWQtY29scy02IGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICB7cGhvdG9zLm1hcCgocGhvdG8sIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2lkeH0gY2xhc3NOYW1lPVwicmVsYXRpdmUgZ3JvdXAgcm91bmRlZC14bCBvdmVyZmxvdy1oaWRkZW4gYm9yZGVyIGJvcmRlci1zbGF0ZS0yMDAgc2hhZG93LXhzIGFzcGVjdC1zcXVhcmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyByZWZlcnJlclBvbGljeT1cIm5vLXJlZmVycmVyXCIgc3JjPXtwaG90b30gYWx0PXtgcGFjay0ke2lkeH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFBob3RvcyhwcmV2ID0+IHByZXYuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpZHgpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0xIHJpZ2h0LTEgYmctcmVkLTYwMCB0ZXh0LXdoaXRlIHAtMSByb3VuZGVkLWZ1bGwgb3BhY2l0eS05MCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uIHNoYWRvdy1zbSBob3ZlcjpzY2FsZS0xMTBcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFggc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBGb3JtIEFjdGlvbnMgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yIGp1c3RpZnktZW5kIGJvcmRlci10IGJvcmRlci1zbGF0ZS0xMDAgcHQtNCBiZy1zbGF0ZS01MC8yMFwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctZW1lcmFsZC02MDAgdGV4dC13aGl0ZSBmb250LWV4dHJhYm9sZCB0ZXh0LXhzIHB4LTYgcHktMyByb3VuZGVkLXhsIGhvdmVyOmJnLWVtZXJhbGQtNzAwIHRyYW5zaXRpb24gc2hhZG93LXNtXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAg2KvYqNiqINmIINi12K/ZiNixINm+2qnbjNmG2q8g2YTbjNiz2Kog2qnYp9mE2KdcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEFjdGl2ZVRhYignbGlzdCcpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZy1zbGF0ZS0xMDAgdGV4dC1zbGF0ZS02MDAgZm9udC1ib2xkIHRleHQteHMgcHgtNiBweS0zIHJvdW5kZWQteGwgaG92ZXI6Ymctc2xhdGUtMjAwIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDYp9mG2LXYsdin2YFcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvcm0+XG4gICAgICApfVxuXG4gICAgICB7LyogREVUQUlMIE1PREFMIFdJVEggUFJJTlQgQ0FQQUJJTElUWSAqL31cbiAgICAgIHtzZWxlY3RlZERlbGl2ZXJ5ICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIGJnLXNsYXRlLTkwMC82MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTQgei01MCBvdmVyZmxvdy15LWF1dG9cIiBkaXI9XCJydGxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtMnhsIHctZnVsbCBtYXgtdy00eGwgc2hhZG93LTJ4bCBmbGV4IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBvdmVyZmxvdy1oaWRkZW4gYW5pbWF0ZS1mYWRlLWluIHJlbGF0aXZlIG1heC1oLVs5MHZoXVwiPlxuICAgICAgICAgICAgey8qIE1vZGFsIEhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xNTAgZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJnLXNsYXRlLTUwLzgwIG5vLXByaW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICA8UGFja2FnZSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgc2l6ZT17MjB9IC8+XG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZvbnQtZXh0cmFib2xkIHRleHQtc2xhdGUtODAwIHRleHQtc20gbWQ6dGV4dC1iYXNlXCI+XG4gICAgICAgICAgICAgICAgICDZvtqp24zZhtqvINmE24zYs9iqINqp2KfZhNinIC0ge3NlbGVjdGVkRGVsaXZlcnkucGFja2luZ0xpc3ROdW1iZXJ9XG4gICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZERlbGl2ZXJ5KG51bGwpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtc2xhdGUtNjAwIHAtMS41IHJvdW5kZWQteGwgdHJhbnNpdGlvbiBob3ZlcjpiZy1zbGF0ZS0yMDAvNTVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFggc2l6ZT17MTh9IC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBNb2RhbCBCb2R5IC8gUHJpbnRhYmxlIENvbnRlbnQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBtZDpwLTggb3ZlcmZsb3cteS1hdXRvIHNwYWNlLXktNiBwcmludGFibGUtY29udGFpbmVyIHNlbGVjdC10ZXh0XCI+XG4gICAgICAgICAgICAgIHsvKiBQUklOVCBTUEVDSUFMIFBBR0UgSEVBREVSIChEaXNwbGF5cyBvbiBVSSBhbmQgUHJpbnQpICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgbWQ6ZmxleC1yb3cganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBtZDppdGVtcy1zdGFydCBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS0zMDAgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTIgdGV4dC1jZW50ZXIgbWQ6dGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtZXh0cmFib2xkIHRleHQtc2xhdGUtOTAwXCI+2b7aqduM2YbaryDZhNuM2LPYqiDYp9iz2KrYp9mG2K/Yp9ix2K8g2qnYp9mE2KcgKFBhY2tpbmcgTGlzdCk8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMFwiPtmF2KzZhdmI2LnZhyDYp9iz2YbYp9ivINix2LPZhduMINiq2LHYrtuM2LUg2Ygg2YTYrNiz2KrbjNqpPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgey8qIExvZ28gU2VjdGlvbiAqL31cbiAgICAgICAgICAgICAgICB7YWN0aXZlVGVtcGxhdGU/LnNob3dMb2dvICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIiBkaXI9XCJydGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtc20gdGV4dC1zbGF0ZS04MDBcIj57YWN0aXZlVGVtcGxhdGUuY29tcGFueU5hbWV9PC9oND5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVs5cHhdIHRleHQtc2xhdGUtNDAwXCI+2KrYp9mF24zZhiDYqtis2YfbjNiy2KfYqiDYp9iq2YjZhdin2LPbjNmI2YYg2Ygg2KfYqNiy2KfYsdiv2YLbjNmCPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRlbXBsYXRlLmxvZ29VcmwgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXthY3RpdmVUZW1wbGF0ZS5sb2dvVXJsfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWx0PXthY3RpdmVUZW1wbGF0ZS5jb21wYW55TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctMTIgaC0xMiBvYmplY3QtY29udGFpbiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItc2xhdGUtMjAwIGJnLXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVycmVyUG9saWN5PVwibm8tcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgYmctc2t5LTUwMCB0ZXh0LXdoaXRlIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGZvbnQtYm9sZCB0ZXh0LXhsIHJvdW5kZWQtbGcgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEFUQVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIE1haW4gb2ZmaWNpYWwgaGVhZGVyIGxheW91dCAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC00IGJnLXNsYXRlLTUwIHAtNCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLXNsYXRlLTE1MFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS02MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMFwiPti02YXYp9ix2Ycg2b7aqduM2YbaryDZhNuM2LPYqjo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1leHRyYWJvbGRcIj57c2VsZWN0ZWREZWxpdmVyeS5wYWNraW5nTGlzdE51bWJlcn08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDBcIj7Yqtin2LHbjNiuINi12K/ZiNixIC8g2KfYsdiz2KfZhDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1tb25vIGZvbnQtYm9sZFwiPntzZWxlY3RlZERlbGl2ZXJ5LmRlbGl2ZXJ5RGF0ZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDBcIj7YsdmI2LQg2K3ZhdmEINmIINin2LHYs9in2YQ6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtZXh0cmFib2xkXCI+e3NlbGVjdGVkRGVsaXZlcnkuc2hpcHBpbmdNZXRob2R9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS02MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMFwiPtm+2LHZiNqY2YcgKNqp2KfYsdmB2LHZhdinKTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS04MDAgZm9udC1leHRyYWJvbGRcIj57c2VsZWN0ZWREZWxpdmVyeS5wcm9qZWN0TmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAge3NlbGVjdGVkRGVsaXZlcnkucHJvZm9ybWFOdW1iZXIgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS02MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwXCI+2b7bjNi04oCM2YHYp9qp2KrZiNixINmF2LHYrNi5Ojwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtbW9ub1wiPntzZWxlY3RlZERlbGl2ZXJ5LnByb2Zvcm1hTnVtYmVyfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS02MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMFwiPtmF2LPYptmI2YQg2KvYqNiqINmIINqp2YbYqtix2YQ6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtODAwIGZvbnQtYm9sZFwiPntjdXJyZW50VXNlcj8uZnVsbE5hbWUgfHwgJ9mF2LPYptmI2YQg2KfZhtio2KfYsSDZiCDZhNis2LPYqtuM2qknfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBDaGVja2xpc3QgcmV2aWV3ICovfVxuICAgICAgICAgICAgICB7c2VsZWN0ZWREZWxpdmVyeS5jaGVja2xpc3QgJiYgc2VsZWN0ZWREZWxpdmVyeS5jaGVja2xpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIuNSBuby1wcmludFwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS04MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBib3JkZXItYiBib3JkZXItc2xhdGUtMTUwIHBiLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8RmlsZUNoZWNrIHNpemU9ezE1fSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAg2YbYqtuM2KzZhyDYqNin2LLYsdiz24wg2YHZhtuMINmIINin24zZhdmG24wg2qnYp9mE2KdcbiAgICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkRGVsaXZlcnkuY2hlY2tsaXN0Lm1hcCgoaXRlbSwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aWR4fSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHAtMi41IHJvdW5kZWQteGwgYm9yZGVyIHRleHQteHMgJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21wbGV0ZWQgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC01MC8yMCBib3JkZXItZW1lcmFsZC0xNTAgdGV4dC1lbWVyYWxkLTgwMCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtNTAvMzAgYm9yZGVyLXNsYXRlLTIwMCB0ZXh0LXNsYXRlLTQwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmNvbXBsZXRlZCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTAuNSBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHJvdW5kZWQtZnVsbCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDaGVjayBzaXplPXsxMX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMC41IGJnLXNsYXRlLTIwMCB0ZXh0LXNsYXRlLTUwMCByb3VuZGVkLWZ1bGwgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8WCBzaXplPXsxMX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1zZW1pYm9sZFwiPntpdGVtLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0uY29tcGxldGVkQXQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtci1hdXRvIGZvbnQtbW9ubyB0ZXh0LVs5cHhdIHRleHQtc2xhdGUtNDAwXCI+KHtpdGVtLmNvbXBsZXRlZEF0fSk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgIHsvKiBQcmUgZGVsaXZlcnkgcmVwb3J0IHJldmlldyAqL31cbiAgICAgICAgICAgICAge3NlbGVjdGVkRGVsaXZlcnkucHJlRGVsaXZlcnlUZXN0Tm90ZXMgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTgwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xNTAgcGItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgIDxDbGlwYm9hcmRDaGVjayBzaXplPXsxNX0gY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgINqv2LLYp9ix2LQg2KrYs9iqINmC2KjZhCDYp9iyINiq2K3ZiNuM2YQg2KrYrNmH24zYslxuICAgICAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS03MDAgYmctc2xhdGUtNTAgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1zbGF0ZS0xNTAgbGVhZGluZy1yZWxheGVkIGZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZERlbGl2ZXJ5LnByZURlbGl2ZXJ5VGVzdE5vdGVzfVxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgIHsvKiBJdGVtcyBUYWJsZSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTgwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IGJvcmRlci1iIGJvcmRlci1zbGF0ZS0xNTAgcGItMS41XCI+XG4gICAgICAgICAgICAgICAgICA8UGFja2FnZSBzaXplPXsxNX0gY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgICDZhNuM2LPYqiDaqdin2YTYp9mH2Kcg2Ygg2LnYr9mE4oCM2KjZhtiv24wg2KjYs9iq2YfigIzYqNmG2K/bjFxuICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAge09iamVjdC5lbnRyaWVzKFxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREZWxpdmVyeS5pdGVtcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBpdGVtLmJveE51bWJlciB8fCAn2KfZgtmE2KfZhSDYqNiv2YjZhiDYtNmF2KfYsdmHINis2LnYqNmHJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhY2NbYm94XSkgYWNjW2JveF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYWNjW2JveF0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIHR5cGVvZiBzZWxlY3RlZERlbGl2ZXJ5Lml0ZW1zPilcbiAgICAgICAgICAgICAgICApLm1hcCgoW2JveCwgaXRlbXNdLCBib3hJZHgpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtib3hJZHh9IGNsYXNzTmFtZT1cImJvcmRlciBib3JkZXItc2xhdGUtMjAwIHJvdW5kZWQteGwgb3ZlcmZsb3ctaGlkZGVuIG1iLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS0xMDAgdGV4dC1zbGF0ZS03MDAgZm9udC1ib2xkIHRleHQteHMgcC0yLjUgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTIwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxQYWNrYWdlIHNpemU9ezE0fSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAg2KjYs9iq2YfigIzYqNmG2K/bjCAvINis2LnYqNmHOiB7Ym94fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LXhzIHRleHQtcmlnaHQgYm9yZGVyLWNvbGxhcHNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImJnLXNsYXRlLTUwLzUwIHRleHQtc2xhdGUtNTAwIGZvbnQtYm9sZCBib3JkZXItYiBib3JkZXItc2xhdGUtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy0xMFwiPtix2K/bjNmBPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInAtM1wiPtqp2KfZhNinIC8g2KrYrNmH24zYsiAvINiz2YbYrzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXIgdy0xNlwiPtiq2LnYr9in2K88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwicC0zIHctMjhcIj7ZhtmI2Lkg2KjYs9iq2YfigIzYqNmG2K/bjDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdy00MFwiPtin2KjYudin2K8g2KjYs9iq2YfigIzYqNmG2K/bjDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzc05hbWU9XCJwLTMgdGV4dC1jZW50ZXIgdy0yNFwiPtmI2LLZhiAo2qnbjNmE2Yjar9ix2YUpPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPVwiZGl2aWRlLXkgZGl2aWRlLXNsYXRlLTE1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT1cImhvdmVyOmJnLXNsYXRlLTUwLzUwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyB0ZXh0LXNsYXRlLTQwMCBmb250LW1vbm8gZm9udC1zZW1pYm9sZFwiPntpZHggKyAxfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyBmb250LWJvbGQgdGV4dC1zbGF0ZS04MDBcIj57aXRlbS5pdGVtT3JEb2NOYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInAtMyBmb250LWV4dHJhYm9sZCB0ZXh0LXNsYXRlLTcwMCB0ZXh0LWNlbnRlciBmb250LW1vbm9cIj57aXRlbS5xdWFudGl0eX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgZm9udC1tZWRpdW0gdGV4dC1zbGF0ZS02MDBcIj57aXRlbS5wYWNrYWdlVHlwZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJwLTMgZm9udC1tb25vIHRleHQtbGVmdCB0ZXh0LXNsYXRlLTYwMFwiIGRpcj1cImx0clwiPntpdGVtLmRpbWVuc2lvbnN9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwicC0zIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTcwMCB0ZXh0LWNlbnRlciBmb250LXNlbWlib2xkXCI+e2l0ZW0ud2VpZ2h0fSBLZzwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBQaG90byBhdHRhY2htZW50cyBnYWxsZXJ5IGluc2lkZSBkZXRhaWxzIChIaWRkZW4gb24gUHJpbnQpICovfVxuICAgICAgICAgICAgICB7c2VsZWN0ZWREZWxpdmVyeS5waG90b3MgJiYgc2VsZWN0ZWREZWxpdmVyeS5waG90b3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIuNSBuby1wcmludFwiPlxuICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1leHRyYWJvbGQgdGV4dC1zbGF0ZS04MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBib3JkZXItYiBib3JkZXItc2xhdGUtMTUwIHBiLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8VXBsb2FkIHNpemU9ezE1fSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNTAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAg2KrYtdin2YjbjNixINm+24zZiNiz2Kog2KjYs9iq2YfigIzYqNmG2K/bjCDZiCDYp9ix2LPYp9mEXG4gICAgICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIHNtOmdyaWQtY29scy00IGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZERlbGl2ZXJ5LnBob3Rvcy5tYXAoKHBob3RvLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aWR4fSBjbGFzc05hbWU9XCJib3JkZXIgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLXhsIG92ZXJmbG93LWhpZGRlbiBhc3BlY3Qtc3F1YXJlIGhvdmVyOnNoYWRvdy1tZCB0cmFuc2l0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHJlZmVycmVyUG9saWN5PVwibm8tcmVmZXJyZXJcIiBzcmM9e3Bob3RvfSBhbHQ9e2BkZWxpdmVyeS0ke2lkeH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgey8qIFNJR05BVFVSRSBTRUNUSU9OIChQZXJmZWN0IGZvciBvZmZpY2lhbCBwcmludG91dHMpICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTYgcHQtMTIgcGItOCB0ZXh0LWNlbnRlciB0ZXh0LXhzIHJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtYm9sZCB0ZXh0LXNsYXRlLTcwMCBibG9ja1wiPtin2YXYttinINmIINiq2KfbjNuM2K8g2KrYrdmI24zZhOKAjNqv24zYsdmG2K/ZhyAo2qnYp9ix2YHYsdmF2KcpOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy00NCBoLTI0IGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS0yMDAgcm91bmRlZC1sZyBteC1hdXRvIGJnLXNsYXRlLTUwLzMwXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNDAwIGZvbnQtbW9ub1wiPtmG2KfZhSDZiCDZhtin2YUg2K7Yp9mG2YjYp9iv2q/bjCAvINiq2KfYsduM2K4g2KrYrdmI24zZhDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IHJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1zbGF0ZS03MDAgYmxvY2tcIj7Zhdiz2KbZiNmEINin2YbYqNin2LEg2Ygg2KrYp9uM24zYryDYrtix2YjYrCDaqdin2YTYpzo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctNDQgaC0yNCByZWxhdGl2ZSBteC1hdXRvIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBPZmZpY2lhbCBTdGFtcCAqL31cbiAgICAgICAgICAgICAgICAgICAge2FjdGl2ZVRlbXBsYXRlPy5jb21wYW55U2VhbFVybCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2FjdGl2ZVRlbXBsYXRlLmNvbXBhbnlTZWFsVXJsfSBhbHQ9XCJDb21wYW55IFN0YW1wXCIgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTAgcmlnaHQtMCBoLTI0IG9wYWNpdHktNjAgbWl4LWJsZW5kLW11bHRpcGx5IHBvaW50ZXItZXZlbnRzLW5vbmVcIiAvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICB7LyogVXNlciBTaWduYXR1cmUgKi99XG4gICAgICAgICAgICAgICAgICAgIHtjdXJyZW50VXNlcj8uc2lnbmF0dXJlSW1hZ2UgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2N1cnJlbnRVc2VyLnNpZ25hdHVyZUltYWdlfSBhbHQ9XCJVc2VyIFNpZ25hdHVyZVwiIGNsYXNzTmFtZT1cImFic29sdXRlIHotMTAgbWF4LWgtMTYgbWF4LXctWzE1MHB4XSBvYmplY3QtY29udGFpbiBwb2ludGVyLWV2ZW50cy1ub25lXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTIwMCByb3VuZGVkLWxnIGJnLXNsYXRlLTUwLzMwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRleHQtc2xhdGUtNDAwIGZvbnQtbW9ubyB0ZXh0LVsxMHB4XVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAg2YXZh9ixINmIINin2YXYttin24wg2KrYsdiu24zYtSDZhNis2LPYqtuM2qlcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS00MDAgZm9udC1tb25vXCI+e2N1cnJlbnRVc2VyPy5mdWxsTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBUZW1wbGF0ZSBGb290ZXIgKi99XG4gICAgICAgICAgICAgIHthY3RpdmVUZW1wbGF0ZT8uZm9vdGVyVGV4dCAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB0ZXh0LWNlbnRlciBwdC04IGJvcmRlci10IGJvcmRlci1zbGF0ZS0yMDAgbXQtOFwiPlxuICAgICAgICAgICAgICAgICAge2FjdGl2ZVRlbXBsYXRlLmZvb3RlclRleHR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIE1vZGFsIEZvb3RlciB3aXRoIHByaW50IHRyaWdnZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTIganVzdGlmeS1lbmQgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS0xNTAgYmctc2xhdGUtNTAvNTAgbm8tcHJpbnRcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICAgICAgICAgICAgICAgIH0sIDE1MCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTcwMCB0ZXh0LXdoaXRlIGZvbnQtZXh0cmFib2xkIHRleHQteHMgcHgtNSBweS0yLjUgcm91bmRlZC14bCB0cmFuc2l0aW9uIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgc2hhZG93LXNtXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxQcmludGVyIHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgICAgINqG2KfZviDZvtqp24zZhtqvINmE24zYs9iqINin2LPYqtin2YbYr9in2LHYr1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkRGVsaXZlcnkobnVsbCl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctc2xhdGUtMTAwIGhvdmVyOmJnLXNsYXRlLTIwMCB0ZXh0LXNsYXRlLTYwMCBmb250LWJvbGQgdGV4dC14cyBweC01IHB5LTIuNSByb3VuZGVkLXhsIHRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAg2KjYs9iq2YYg2b7Zhtis2LHZh1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBFbWJlZGRlZCBwcmludCBzdHlsaW5nIHNwZWNpZmljYWxseSBmb3IgcHJvZmVzc2lvbmFsIHN0YW5kYXJkIGRvY3VtZW50IGxheW91dCAqL31cbiAgICAgIHsvKiBEZWxldGUgQ29uZmlybWF0aW9uIE1vZGFsICovfVxuICAgICAgPENvbmZpcm1Nb2RhbFxuICAgICAgICBpc09wZW49eyEhZGVsZXRlRGVsaXZlcnlJZH1cbiAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgIHNldERlbGV0ZURlbGl2ZXJ5SWQobnVsbCk7XG4gICAgICAgICAgc2V0RGVsZXRlQWN0aXZpdGllc1dpdGhEZWxpdmVyeShmYWxzZSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uQ29uZmlybT17KCkgPT4ge1xuICAgICAgICAgIGlmIChkZWxldGVEZWxpdmVyeUlkKSB7XG4gICAgICAgICAgICBkZWxldGVQYWNrYWdpbmdEZWxpdmVyeShkZWxldGVEZWxpdmVyeUlkLCBkZWxldGVBY3Rpdml0aWVzV2l0aERlbGl2ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHRpdGxlPVwi2K3YsNmBINm+2qnbjNmG2q8g2YTbjNiz2KpcIlxuICAgICAgICBtZXNzYWdlPVwi2KLbjNinINin2LIg2K3YsNmBINin24zZhiDZvtqp24zZhtqvINmE24zYs9iqINmIINiq2K3ZiNuM2YQg2qnYp9mE2Kcg2KfYt9mF24zZhtin2YYg2K/Yp9ix24zYr9ifINin24zZhiDYudmF2YTbjNin2Kog2LrbjNix2YLYp9io2YQg2KjYp9iy2q/YtNiqINin2LPYqi5cIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcHQtNCBib3JkZXItdCBib3JkZXItc2xhdGUtMTAwIGZsZXggaXRlbXMtc3RhcnQgZ2FwLTJcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBpZD1cImRlbGV0ZUFjdGl2aXRpZXNcIlxuICAgICAgICAgICAgY2hlY2tlZD17ZGVsZXRlQWN0aXZpdGllc1dpdGhEZWxpdmVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0RGVsZXRlQWN0aXZpdGllc1dpdGhEZWxpdmVyeShlLnRhcmdldC52YWx1ZSA9PT0gJ3RydWUnKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTFcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJkZWxldGVBY3Rpdml0aWVzXCIgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTYwMFwiPlxuICAgICAgICAgICAg2K3YsNmBINmE2Kfar+KAjNmH2KfbjCDZgdi52KfZhNuM2Kog2b7YsdmI2pjZhyDZhdix2KrYqNi3INio2Kcg2KfbjNmGINm+2qnbjNmG2q8g2YTbjNiz2KogKNiv2LEg2K/Ys9iq2YfigIzYqNmG2K/bjCDYqNiz2KrZh+KAjNio2YbYr9uMINmIINiq2K3ZiNuM2YQg2qnYp9mE2KcpXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0NvbmZpcm1Nb2RhbD5cblxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIEBtZWRpYSBwcmludCB7XG4gICAgICAgICAgYm9keSAqIHtcbiAgICAgICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnByaW50YWJsZS1jb250YWluZXIsIC5wcmludGFibGUtY29udGFpbmVyICoge1xuICAgICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLnByaW50YWJsZS1jb250YWluZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgcGFkZGluZzogMjBweDtcbiAgICAgICAgICAgIGRpcmVjdGlvbjogcnRsICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6ICdJbnRlcicsIHN5c3RlbS11aSwgc2Fucy1zZXJpZiAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5uby1wcmludCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibWFwcGluZ3MiOiJBQTRUWTtBQTVUWixTQUFnQixnQkFBZ0I7QUFDaEM7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxPQUNLO0FBU1AsU0FBUyxzQkFBc0I7QUFDL0IsT0FBTyxrQkFBa0I7QUFhekIsd0JBQXdCLHNCQUFzQjtBQUFBLEVBQzVDO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLEdBQStCO0FBQzdCLFFBQU0saUJBQWlCLFNBQVMsbUJBQW1CLEtBQUssT0FBSyxFQUFFLFNBQVMsU0FBUyxnQkFBZ0IsS0FBSyxTQUFTLG9CQUFvQixDQUFDO0FBQ3BJLFFBQU0sQ0FBQyxXQUFXLFlBQVksSUFBSSxTQUF5QixNQUFNO0FBR2pFLFFBQU0sQ0FBQyxlQUFlLGdCQUFnQixJQUFJLFNBQWlCLEVBQUU7QUFDN0QsUUFBTSxDQUFDLFlBQVksYUFBYSxJQUFJLFNBQWlCLEVBQUU7QUFHdkQsUUFBTSxDQUFDLG1CQUFtQixvQkFBb0IsSUFBSSxT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