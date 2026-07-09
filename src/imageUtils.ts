/**
 * Compresses and resizes an uploaded image file before converting it to a Base64 string.
 * This prevents localStorage QuotaExceededErrors and keeps database sizes minimal.
 */
export function compressAndResizeImage(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Signatures are best kept as PNG to support transparency, but logos/seals can be JPEG
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const base64 = canvas.toDataURL(mimeType, quality);
        resolve(base64);
      };
      img.onerror = () => {
        reject(new Error('خطا در پردازش تصویر'));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('خطا در خواندن فایل'));
    };
    reader.readAsDataURL(file);
  });
}
