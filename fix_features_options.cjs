const fs = require('fs');
let content = fs.readFileSync('src/components/ProductsView.tsx', 'utf-8');

const oldOptionInput = `                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              id={\`feature-input-\${feature.id}\`}
                              placeholder="مقدار جدید (برای چند مقدار با ویرگول جدا کنید)..."
                              className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-sky-500"`;

const newOptionInput = `                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                            <input
                              type="text"
                              id={\`feature-input-\${feature.id}\`}
                              placeholder="مقدار جدید (برای چند مقدار با ویرگول جدا کنید)..."
                              className="w-full sm:flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-sky-500"`;

if (content.includes(oldOptionInput)) {
    content = content.replace(oldOptionInput, newOptionInput);
    console.log("Successfully replaced option input");
} else {
    console.log("Could not find option input");
}

const oldOptionBtn = `                              className="px-3 py-1.5 bg-sky-50 text-sky-600 font-semibold text-xs rounded-lg hover:bg-sky-100 transition whitespace-nowrap"
                            >
                              افزودن
                            </button>`;

const newOptionBtn = `                              className="w-full sm:w-auto px-3 py-1.5 bg-sky-50 text-sky-600 font-semibold text-xs rounded-lg hover:bg-sky-100 transition whitespace-nowrap"
                            >
                              افزودن
                            </button>`;

if (content.includes(oldOptionBtn)) {
    content = content.replace(oldOptionBtn, newOptionBtn);
    console.log("Successfully replaced option btn");
} else {
    console.log("Could not find option btn");
}

fs.writeFileSync('src/components/ProductsView.tsx', content);
