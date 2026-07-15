import fs from 'fs';
let code = fs.readFileSync('src/components/SupplierInquiriesView.tsx', 'utf8');

const oldHandleFileUpload = `  const handleFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setTechFileName(file.name);
      setTechFileSize(sizeInMB);
      setIsUploadingTech(true);
      setUploadProgressTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setFinFileName(file.name);
      setFinFileSize(sizeInMB);
      setIsUploadingFin(true);
      setUploadProgressFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingFin(false);
          }, 300);
        }
      }, 100);
    }
  };`;

const newHandleFileUpload = `  const handleFileUpload = async (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    try {
      if (type === 'tech') {
        setTechFileName(file.name);
        setTechFileSize(sizeInMB);
        setIsUploadingTech(true);
        setUploadProgressTech(50);
        const url = await uploadFile(file);
        setTechFileUrl(url);
        setUploadProgressTech(100);
        setIsUploadingTech(false);
      } else {
        setFinFileName(file.name);
        setFinFileSize(sizeInMB);
        setIsUploadingFin(true);
        setUploadProgressFin(50);
        const url = await uploadFile(file);
        setFinFileUrl(url);
        setUploadProgressFin(100);
        setIsUploadingFin(false);
      }
    } catch (error) {
      console.error(error);
      alert('خطا در آپلود فایل');
      if (type === 'tech') {
        setIsUploadingTech(false);
        setTechFileName('');
        setTechFileUrl('');
      } else {
        setIsUploadingFin(false);
        setFinFileName('');
        setFinFileUrl('');
      }
    }
  };`;

code = code.replace(oldHandleFileUpload, newHandleFileUpload);


const oldHandleAnswerFileUpload = `  const handleAnswerFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setAnswerTechFile(file.name);
      setAnswerTechFileSize(sizeInMB);
      setIsUploadingAnswerTech(true);
      setUploadProgressAnswerTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressAnswerTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingAnswerTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setAnswerFinFile(file.name);
      setAnswerFinFileSize(sizeInMB);
      setIsUploadingAnswerFin(true);
      setUploadProgressAnswerFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressAnswerFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingAnswerFin(false);
          }, 300);
        }
      }, 100);
    }
  };`;

const newHandleAnswerFileUpload = `  const handleAnswerFileUpload = async (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    try {
      if (type === 'tech') {
        setAnswerTechFile(file.name);
        setAnswerTechFileSize(sizeInMB);
        setIsUploadingAnswerTech(true);
        setUploadProgressAnswerTech(50);
        const url = await uploadFile(file);
        setAnswerTechFileUrl(url);
        setUploadProgressAnswerTech(100);
        setIsUploadingAnswerTech(false);
      } else {
        setAnswerFinFile(file.name);
        setAnswerFinFileSize(sizeInMB);
        setIsUploadingAnswerFin(true);
        setUploadProgressAnswerFin(50);
        const url = await uploadFile(file);
        setAnswerFinFileUrl(url);
        setUploadProgressAnswerFin(100);
        setIsUploadingAnswerFin(false);
      }
    } catch (error) {
      console.error(error);
      alert('خطا در آپلود فایل');
      if (type === 'tech') {
        setIsUploadingAnswerTech(false);
        setAnswerTechFile('');
        setAnswerTechFileUrl('');
      } else {
        setIsUploadingAnswerFin(false);
        setAnswerFinFile('');
        setAnswerFinFileUrl('');
      }
    }
  };`;

code = code.replace(oldHandleAnswerFileUpload, newHandleAnswerFileUpload);

const oldHandleEditFileUpload = `  const handleEditFileUpload = (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    if (type === 'tech') {
      setEditTechFileName(file.name);
      setEditTechFileSize(sizeInMB);
      setIsUploadingEditTech(true);
      setUploadProgressEditTech(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressEditTech(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingEditTech(false);
          }, 300);
        }
      }, 100);
    } else {
      setEditFinFileName(file.name);
      setEditFinFileSize(sizeInMB);
      setIsUploadingEditFin(true);
      setUploadProgressEditFin(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgressEditFin(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingEditFin(false);
          }, 300);
        }
      }, 100);
    }
  };`;

const newHandleEditFileUpload = `  const handleEditFileUpload = async (file: File, type: 'tech' | 'fin') => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    try {
      if (type === 'tech') {
        setEditTechFileName(file.name);
        setEditTechFileSize(sizeInMB);
        setIsUploadingEditTech(true);
        setUploadProgressEditTech(50);
        const url = await uploadFile(file);
        setEditTechFileUrl(url);
        setUploadProgressEditTech(100);
        setIsUploadingEditTech(false);
      } else {
        setEditFinFileName(file.name);
        setEditFinFileSize(sizeInMB);
        setIsUploadingEditFin(true);
        setUploadProgressEditFin(50);
        const url = await uploadFile(file);
        setEditFinFileUrl(url);
        setUploadProgressEditFin(100);
        setIsUploadingEditFin(false);
      }
    } catch (error) {
      console.error(error);
      alert('خطا در آپلود فایل');
      if (type === 'tech') {
        setIsUploadingEditTech(false);
        setEditTechFileName('');
        setEditTechFileUrl('');
      } else {
        setIsUploadingEditFin(false);
        setEditFinFileName('');
        setEditFinFileUrl('');
      }
    }
  };`;

code = code.replace(oldHandleEditFileUpload, newHandleEditFileUpload);

fs.writeFileSync('src/components/SupplierInquiriesView.tsx', code);
