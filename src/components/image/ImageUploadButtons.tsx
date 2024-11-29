import { useRef } from "react";
import { Camera, Search, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";

interface ImageUploadButtonsProps {
  onDrop: (files: File[]) => void;
  onCameraCapture: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  isDragActive: boolean;
  getInputProps: () => JSX.IntrinsicElements['input'];
  getRootProps: () => JSX.IntrinsicElements['div'];
}

export function ImageUploadButtons({
  onDrop,
  onCameraCapture,
  onSearchClick,
  isDragActive,
  getInputProps,
  getRootProps
}: ImageUploadButtonsProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  return (
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
            {isDragActive ? "Drop the image here" : "Tap to select image or use camera"}
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
        onClick={onSearchClick}
      >
        <Search className="w-4 w-4" />
        Search Photos
      </Button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onCameraCapture}
      />
    </div>
  );
}