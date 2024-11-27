import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  images: string[];
  featuredImageIndex: number;
  onChange: (images: string[], featuredIndex: number) => void;
}

export function ImageUpload({ images, featuredImageIndex, onChange }: ImageUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<Blob> => {
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

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200; // Max dimension for either width or height

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
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
          0.8 // Compression quality
        );
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };
    });
  };

  const handleImageError = (error: string) => {
    console.error("Image upload error:", error);
    toast({
      variant: "destructive",
      title: "Error uploading image",
      description: "Please try again with a different image or format",
    });
  };

  const processFile = async (file: File) => {
    console.log("Processing file:", file.name, file.type, file.size);
    
    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        handleImageError("Invalid file type");
        return null;
      }

      let processedFile = file;
      
      // Compress if file is too large or from iOS
      if (file.size > 1024 * 1024 || /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log("Compressing image...");
        const compressedBlob = await compressImage(file);
        processedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg'
        });
      }

      // Final size check after compression
      if (processedFile.size > 5 * 1024 * 1024) {
        handleImageError("File size too large (max 5MB)");
        return null;
      }

      const imageUrl = URL.createObjectURL(processedFile);
      console.log("Created image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      handleImageError("Failed to process image");
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles.length);
    
    const processedUrls = await Promise.all(
      acceptedFiles.map(processFile)
    );

    const validUrls = processedUrls.filter((url): url is string => url !== null);
    
    if (validUrls.length > 0) {
      onChange([...images, ...validUrls], featuredImageIndex);
    }
  }, [images, featuredImageIndex, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Camera capture triggered");
    const file = event.target.files?.[0];
    
    if (file) {
      console.log("Captured image:", file.name, file.type, file.size);
      const imageUrl = processFile(file);
      
      if (imageUrl) {
        onChange([...images, imageUrl], featuredImageIndex);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newFeaturedIndex = index === featuredImageIndex 
      ? Math.min(featuredImageIndex, newImages.length - 1)
      : featuredImageIndex;
    onChange(newImages, newFeaturedIndex);
  };

  const setFeaturedImage = (index: number) => {
    onChange(images, index);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the images here"
                : "Tap to select images or use camera"}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="flex-none flex gap-2 items-center"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-4 h-4" />
          Take Photo
        </Button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const imageUrl = await processFile(file);
              if (imageUrl) {
                onChange([...images, imageUrl], featuredImageIndex);
              }
            }
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className={`w-full h-32 object-cover rounded-lg 
                  ${index === featuredImageIndex ? "ring-2 ring-primary" : ""}`}
                onError={() => {
                  handleImageError("Failed to load image");
                  removeImage(index);
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setFeaturedImage(index)}
                >
                  Set as Featured
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}