import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnsplashPhoto, searchPhotos } from "@/services/unsplashService";
import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { UnsplashAttribution } from "../UnsplashAttribution";

interface AIPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: UnsplashPhoto[];
  onPhotoSelect: (photo: UnsplashPhoto) => void;
  initialQuery?: string;
}

export function AIPhotoDialog({
  open,
  onOpenChange,
  photos: initialPhotos,
  onPhotoSelect,
  initialQuery = ""
}: AIPhotoDialogProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>(initialPhotos);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-select first photo when dialog opens
  useEffect(() => {
    if (open && initialPhotos.length > 0) {
      console.log("Auto-selecting first photo:", initialPhotos[0]);
      onPhotoSelect(initialPhotos[0]);
    }
  }, [open, initialPhotos]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    console.log("Searching for photos with query:", searchQuery);
    setIsSearching(true);
    try {
      const newPhotos = await searchPhotos(searchQuery);
      console.log("Found photos:", newPhotos.length);
      setPhotos(newPhotos);
    } catch (error) {
      console.error("Error searching photos:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Suggested Photos</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for more photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <img
                src={photo.urls.small}
                alt={`Photo by ${photo.user.name}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onPhotoSelect(photo)}
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
      </DialogContent>
    </Dialog>
  );
}