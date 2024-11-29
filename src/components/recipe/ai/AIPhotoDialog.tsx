import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnsplashPhoto } from "@/services/unsplashService";

interface AIPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: UnsplashPhoto[];
  onPhotoSelect: (photo: UnsplashPhoto) => void;
}

export function AIPhotoDialog({
  open,
  onOpenChange,
  photos,
  onPhotoSelect
}: AIPhotoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Suggested Photos</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <img
                src={photo.urls.small}
                alt={`Photo by ${photo.user.name}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onPhotoSelect(photo)}
              />
              <div className="text-xs text-gray-500">
                Photo by{' '}
                <a 
                  href={photo.user.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
                >
                  {photo.user.name}
                </a>
                {' '}on{' '}
                <a
                  href={photo.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
                >
                  Unsplash
                </a>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}