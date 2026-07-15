import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

code = code.replace("export default function ProjectsView({", "export default function ProjectsView({\n  onOpenDocument,");

fs.writeFileSync('src/components/ProjectsView.tsx', code);
