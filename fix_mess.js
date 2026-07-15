import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectsView.tsx', 'utf8');

// The duplicate arguments list starts right after `}: ProjectsViewProps) {`
const fixRegex = /\}: ProjectsViewProps\) \{\n  onOpenDocument,[\s\S]*?onClearInitialSelectedProject\n\}\n/g;
code = code.replace(fixRegex, '}: ProjectsViewProps) {\n');

// Wait, the javascript version had:
// export default function ProjectsView({
//   onOpenDocument,
//   projects,
// ...
// }) {
// Let's just find `}: ProjectsViewProps) {` and remove the second arguments block.
// Wait, I should just inspect what I actually generated.
fs.writeFileSync('src/components/ProjectsView.tsx', code);
