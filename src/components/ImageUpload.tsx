import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";
import { processFile } from "@/utils/imageProcessing";
import { ImageGrid } from "./ImageGrid";
import { searchPhotos, triggerPhotoDownload, UnsplashPhoto } from "@/services/unsplashService";
import { UnsplashSearchDialog } from "./image/UnsplashSearchDialog";
import { ImageCropDialog } from "./image/ImageCropDialog";
import { ImageUploadButtons } from "./image/ImageUploadButtons";

interface ImageUploadProps {
  images: string[];
  featuredImageIndex: number;
  onChange: (images: string[], featuredIndex: number) => void;
}

export function ImageUpload({ images, featuredImageIndex, onChange }: ImageUploadProps) {
  const [showUnsplashDialog, setShowUnsplashDialog] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageError = (error: string) => {
    console.error("Image upload error:", error);
    toast({
      variant: "destructive",
      title: "Error uploading image",
      description: "Please try again with a different image or format",
    });
  };

  const handleImageProcessing = async (file: File) => {
    console.log("Processing image:", file.name);
    const imageUrl = await processFile(file);
    if (imageUrl) {
      setCropImage(imageUrl);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles.length);
    if (acceptedFiles.length > 0) {
      await handleImageProcessing(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024
  });

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Camera capture triggered");
    const file = event.target.files?.[0];
    if (file) {
      await handleImageProcessing(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    console.log("Crop completed, updating image");
    if (cropImage?.startsWith('blob:')) {
      // New image upload
      onChange([...images, croppedImageUrl], featuredImageIndex);
    } else {
      // Re-cropping existing image
      const imageIndex = images.indexOf(cropImage || '');
      if (imageIndex !== -1) {
        const newImages = [...images];
        newImages[imageIndex] = croppedImageUrl;
        onChange(newImages, featuredImageIndex);
      }
    }
    setCropImage(null);
  };

  const handleUnsplashSelect = async (photo: UnsplashPhoto) => {
    await triggerPhotoDownload(photo.id);
    onChange([...images, photo.urls.regular], featuredImageIndex);
    setShowUnsplashDialog(false);
  };

  const handleImageClick = (imageUrl: string) => {
    console.log("Opening crop dialog for image:", imageUrl);
    setCropImage(imageUrl);
  };

  return (
    <div className="space-y-4">
      <ImageUploadButtons
        onDrop={onDrop}
        onCameraCapture={handleCameraCapture}
        onSearchClick={() => setShowUnsplashDialog(true)}
        isDragActive={isDragActive}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
      />

      <ImageGrid
        images={images}
        featuredImageIndex={featuredImageIndex}
        onRemoveImage={(index) => {
          const newImages = images.filter((_, i) => i !== index);
          const newFeaturedIndex = index === featuredImageIndex 
            ? Math.min(featuredImageIndex, newImages.length - 1)
            : featuredImageIndex;
          onChange(newImages, newFeaturedIndex);
        }}
        onSetFeatured={(index) => onChange(images, index)}
        onImageClick={handleImageClick}
      />

      <UnsplashSearchDialog
        open={showUnsplashDialog}
        onOpenChange={setShowUnsplashDialog}
        onPhotoSelect={handleUnsplashSelect}
      />

      <ImageCropDialog
        open={!!cropImage}
        onOpenChange={(open) => !open && setCropImage(null)}
        imageUrl={cropImage || ''}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}