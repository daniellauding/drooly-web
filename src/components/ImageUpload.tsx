import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { processFile } from "@/utils/imageProcessing";
import { ImageGrid } from "./ImageGrid";

interface ImageUploadProps {
  images: string[];
  featuredImageIndex: number;
  onChange: (images: string[], featuredIndex: number) => void;
}

export function ImageUpload({ images, featuredImageIndex, onChange }: ImageUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageError = (error: string) => {
    console.error("Image upload error:", error);
    toast({
      variant: "destructive",
      title: "Error uploading image",
      description: "Please try again with a different image or format",
    });
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
    maxSize: 5 * 1024 * 1024
  });

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Camera capture triggered");
    const file = event.target.files?.[0];
    
    if (file) {
      console.log("Captured image:", file.name, file.type, file.size);
      const imageUrl = await processFile(file);
      
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
          onChange={handleCameraCapture}
        />
      </div>

      <ImageGrid
        images={images}
        featuredImageIndex={featuredImageIndex}
        onRemoveImage={removeImage}
        onSetFeatured={(index) => onChange(images, index)}
      />
    </div>
  );
}