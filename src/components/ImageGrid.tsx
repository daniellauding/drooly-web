import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageGridProps {
  images: string[];
  featuredImageIndex: number;
  onRemoveImage: (index: number) => void;
  onSetFeatured: (index: number) => void;
  onImageClick: (imageUrl: string) => void;
}

export function ImageGrid({ 
  images, 
  featuredImageIndex, 
  onRemoveImage, 
  onSetFeatured,
  onImageClick
}: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`Upload ${index + 1}`}
            className={`w-full h-32 object-cover rounded-lg cursor-pointer
              ${index === featuredImageIndex ? "ring-2 ring-primary" : ""}`}
            onClick={() => onImageClick(image)}
            onError={() => onRemoveImage(index)}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onSetFeatured(index)}
            >
              Set as Featured
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveImage(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}