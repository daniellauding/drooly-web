import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UnsplashPhoto, searchPhotos } from "@/services/unsplashService";
import { UnsplashAttribution } from "../recipe/UnsplashAttribution";

interface UnsplashSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoSelect: (photo: UnsplashPhoto) => void;
}

export function UnsplashSearchDialog({
  open,
  onOpenChange,
  onPhotoSelect
}: UnsplashSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}