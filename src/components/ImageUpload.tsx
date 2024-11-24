import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  images: string[];
  featuredImageIndex: number;
  onChange: (images: string[], featuredIndex: number) => void;
}

export function ImageUpload({ images, featuredImageIndex, onChange }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Convert files to URLs
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
    onChange([...images, ...newImages], featuredImageIndex);
  }, [images, featuredImageIndex, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

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
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop the images here"
              : "Drag & drop images here, or click to select"}
          </p>
        </div>
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