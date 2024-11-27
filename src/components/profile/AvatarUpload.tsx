import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    const options = ["Upload Image", "Take Photo", "Cancel"];
    if (currentAvatar) {
      options.unshift("Remove Photo");
    }

    const dialog = document.createElement("dialog");
    dialog.className = "fixed inset-0 bg-black/50 flex items-center justify-center";
    
    const content = document.createElement("div");
    content.className = "bg-white rounded-lg shadow-lg overflow-hidden min-w-[200px]";
    
    options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors";
      button.textContent = option;
      
      button.onclick = () => {
        switch (option) {
          case "Upload Image":
            fileInputRef.current?.click();
            break;
          case "Take Photo":
            cameraInputRef.current?.click();
            break;
          case "Remove Photo":
            onAvatarChange("");
            break;
        }
        dialog.close();
      };
      
      content.appendChild(button);
    });
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    dialog.showModal();
    
    dialog.addEventListener("close", () => {
      document.body.removeChild(dialog);
    });
  };

  return (
    <div className="relative">
      <div 
        onClick={handleAvatarClick}
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