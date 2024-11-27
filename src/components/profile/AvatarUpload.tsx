import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setDialogOpen(false);
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setDialogOpen(true)}
        className="cursor-pointer group"
      >
        <img
          src={currentAvatar || "/placeholder.svg"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Image
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => cameraInputRef.current?.click()}
            >
              Take Photo
            </Button>
            {currentAvatar && (
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  onAvatarChange("");
                  setDialogOpen(false);
                }}
              >
                Remove Photo
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}