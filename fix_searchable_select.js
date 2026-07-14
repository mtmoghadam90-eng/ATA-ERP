import fs from 'fs';

let content = fs.readFileSync('src/components/SearchableSelect.tsx', 'utf-8');
content = content.replace(
  'className?: string;',
  'className?: string;\n  wrapperClassName?: string;'
);
content = content.replace(
  'className = \'\',',
  'className = \'\',\n  wrapperClassName = \'\','
);
content = content.replace(
  '<div\n      ref={containerRef}\n      className={`relative w-full ${disabled ? \'opacity-60 pointer-events-none\' : \'\'}`}\n    >',
  '<div\n      ref={containerRef}\n      className={`relative w-full ${disabled ? \'opacity-60 pointer-events-none\' : \'\'} ${wrapperClassName}`}\n    >'
);

fs.writeFileSync('src/components/SearchableSelect.tsx', content);
console.log('Fixed SearchableSelect');
