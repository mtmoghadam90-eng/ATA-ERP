import fs from 'fs';

const content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const regex = /<div className="bg-slate-900 rounded-3xl[\s\S]*$/;
const index = content.search(regex);
console.log(index);
