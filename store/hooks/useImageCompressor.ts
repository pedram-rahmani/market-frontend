import { useState, useCallback } from 'react';

export function useImageCompressor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAvatar = useCallback((file: File, size = 300, quality = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      const reader = new FileReader();
      
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setIsProcessing(false);
            return reject(new Error('Canvas context not available'));
          }

          // محاسبه مختصات برای برش مرکز تصویر به صورت مربع
          let sourceX = 0;
          let sourceY = 0;
          let sourceSize = Math.min(img.width, img.height);

          if (img.width > img.height) {
            sourceX = (img.width - img.height) / 2;
          } else {
            sourceY = (img.height - img.width) / 2;
          }

          // رسم تصویر برش‌خورده روی بوم
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            size,
            size
          );

          // تبدیل بوم به فایل فشرده‌شده
          canvas.toBlob(
            (blob) => {
              setIsProcessing(false);
              if (!blob) {
                return reject(new Error('Blob creation failed'));
              }
              const processedFile = new File(
                [blob], 
                file.name.replace(/\.[^/.]+$/, "") + '.jpg', 
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              );
              resolve(processedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = (err) => {
          setIsProcessing(false);
          reject(err);
        };
      };

      reader.onerror = (err) => {
        setIsProcessing(false);
        reject(err);
      };
    });
  }, []);

  return { processAvatar, isProcessing };
}