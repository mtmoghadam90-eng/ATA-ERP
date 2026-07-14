import fs from 'fs';

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

// We can just add wrapperClassName="flex-1 min-w-0" to all SearchableSelect
content = content.replace(/<SearchableSelect/g, '<SearchableSelect wrapperClassName="flex-1 min-w-0"');

fs.writeFileSync('src/components/ProjectsView.tsx', content);
console.log('Fixed SearchableSelect in ProjectsView');
