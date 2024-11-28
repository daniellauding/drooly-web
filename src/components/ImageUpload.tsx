import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { processFile } from "@/utils/imageProcessing";
import { ImageGrid } from "./ImageGrid";
import { searchPhotos, triggerPhotoDownload, UnsplashPhoto } from "@/services/unsplashService";
import { UnsplashAttribution } from "./recipe/UnsplashAttribution";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

interface ImageUploadProps {
  images: string[];
  featuredImageIndex: number;
  onChange: (images: string[], featuredIndex: number) => void;
}

export function ImageUpload({ images, featuredImageIndex, onChange }: ImageUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [showUnsplashDialog, setShowUnsplashDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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

  const handleUnsplashSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const photos = await searchPhotos(searchQuery);
      setUnsplashPhotos(photos);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error searching photos",
        description: "Please try again later",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUnsplashSelect = async (photo: UnsplashPhoto) => {
    await triggerPhotoDownload(photo.id);
    onChange([...images, photo.urls.regular], featuredImageIndex);
    setShowUnsplashDialog(false);
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

        <Button
          variant="outline"
          className="flex-none flex gap-2 items-center"
          onClick={() => setShowUnsplashDialog(true)}
        >
          <Search className="w-4 h-4" />
          Search Photos
        </Button>
      </div>

      <ImageGrid
        images={images}
        featuredImageIndex={featuredImageIndex}
        onRemoveImage={removeImage}
        onSetFeatured={(index) => onChange(images, index)}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />

      <Dialog open={showUnsplashDialog} onOpenChange={setShowUnsplashDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Search Unsplash Photos</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for photos..."
                onKeyDown={(e) => e.key === 'Enter' && handleUnsplashSearch()}
              />
              <Button onClick={handleUnsplashSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {unsplashPhotos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <img
                    src={photo.urls.small}
                    alt={`Photo by ${photo.user.name}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleUnsplashSelect(photo)}
                  />
                  <UnsplashAttribution
                    photographer={{
                      name: photo.user.name,
                      url: photo.user.links.html
                    }}
                    photoUrl={photo.links.html}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}