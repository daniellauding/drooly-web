export const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      let width = img.width;
      let height = img.height;
      const maxDimension = 1200;

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not compress image'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('Could not load image'));
    };
  });
};

export const processFile = async (file: File): Promise<string | null> => {
  console.log("Processing file:", file.name, file.type, file.size);
  
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error("Invalid file type");
    }

    let processedFile = file;
    
    if (file.size > 1024 * 1024 || /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      console.log("Compressing image...");
      const compressedBlob = await compressImage(file);
      processedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg'
      });
    }

    if (processedFile.size > 5 * 1024 * 1024) {
      throw new Error("File size too large (max 5MB)");
    }

    const imageUrl = URL.createObjectURL(processedFile);
    console.log("Created image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Image processing error:", error);
    return null;
  }
};