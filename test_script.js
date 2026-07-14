import fs from 'fs';
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
const targetStr = '<div className="bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden shadow-lg border border-slate-800">';
const index = content.indexOf(targetStr);
console.log(index);
