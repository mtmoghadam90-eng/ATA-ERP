import fs from 'fs';
import path from 'path';

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Clean up previous wrong replaces if any
      content = content.replace(/<SearchableSelect wrapperClassName="flex-1 min-w-0" wrapperClassName="flex-1 min-w-0"/g, '<SearchableSelect wrapperClassName="flex-1 min-w-0"');
      
      // Only replace if it doesn't already have wrapperClassName
      // We will do a regex that avoids matching if wrapperClassName is already there
      // Simple way: replace all `<SearchableSelect ` with a temp marker, then restore
      
      let newContent = content.replace(/<SearchableSelect(?!\s+wrapperClassName)/g, '<SearchableSelect wrapperClassName="flex-1 min-w-0"');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
}

fixDir('src/components');
