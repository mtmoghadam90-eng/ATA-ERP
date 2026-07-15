import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

// remove everything from `}) {` until the `const [search, setSearch]`
code = code.replace(/\}\) \{\n  const \[search, setSearch\]/, '  const [search, setSearch]');

fs.writeFileSync('src/components/ProjectsView.tsx', code);
