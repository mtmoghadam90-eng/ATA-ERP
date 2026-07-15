import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

code = code.replace(
  "const [finFileSize, setFinFileSize] = useState<string>('');",
  "const [finFileSize, setFinFileSize] = useState<string>('');\n  const [techFileUrl, setTechFileUrl] = useState<string>('');\n  const [finFileUrl, setFinFileUrl] = useState<string>('');"
);

code = code.replace(
  "const [answerFinFileSize, setAnswerFinFileSize] = useState<string>('');",
  "const [answerFinFileSize, setAnswerFinFileSize] = useState<string>('');\n  const [answerTechFileUrl, setAnswerTechFileUrl] = useState<string>('');\n  const [answerFinFileUrl, setAnswerFinFileUrl] = useState<string>('');"
);

code = code.replace(
  "const [editFinFileSize, setEditFinFileSize] = useState<string>('');",
  "const [editFinFileSize, setEditFinFileSize] = useState<string>('');\n  const [editTechFileUrl, setEditTechFileUrl] = useState<string>('');\n  const [editFinFileUrl, setEditFinFileUrl] = useState<string>('');"
);

code = code.replace(
  "setTechFileSize('');",
  "setTechFileSize(''); setTechFileUrl('');"
);

code = code.replace(
  "setFinFileSize('');",
  "setFinFileSize(''); setFinFileUrl('');"
);

code = code.replace(
  "setAnswerTechFileSize('');",
  "setAnswerTechFileSize(''); setAnswerTechFileUrl('');"
);

code = code.replace(
  "setAnswerFinFileSize('');",
  "setAnswerFinFileSize(''); setAnswerFinFileUrl('');"
);

code = code.replace(
  "setEditTechFileSize('');",
  "setEditTechFileSize(''); setEditTechFileUrl('');"
);

code = code.replace(
  "setEditFinFileSize('');",
  "setEditFinFileSize(''); setEditFinFileUrl('');"
);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
