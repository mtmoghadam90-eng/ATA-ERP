import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

const startIndex = code.indexOf('}: ProjectsViewProps) {\n  onOpenDocument,');
if (startIndex !== -1) {
  const endIndex = code.indexOf('  const [search, setSearch] = useState("");');
  code = code.substring(0, startIndex + 24) + code.substring(endIndex);
}

fs.writeFileSync('src/components/ProjectsView.tsx', code);
