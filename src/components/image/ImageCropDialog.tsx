import { useState, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const initialCrop: Crop = {
  unit: '%',
  width: 90,
  height: 90,
  x: 5,
  y: 5
};

export function ImageCropDialog({ 
  open, 
  onOpenChange, 
  imageUrl, 
  onCropComplete 
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  // Reset crop when dialog opens with new image
  useEffect(() => {
    if (open) {
      console.log("Resetting crop to initial state");
      setCrop(initialCrop);
    }
  }, [open, imageUrl]);

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleComplete = () => {
    if (imageRef && crop.width && crop.height) {
      try {
        const croppedImageUrl = getCroppedImg(
          imageRef,
          crop as PixelCrop
        );
        onCropComplete(croppedImageUrl);
        onOpenChange(false);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  const handleReset = () => {
    console.log("Manually resetting crop to initial state");
    setCrop(initialCrop);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adjust Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            className="max-h-[60vh] mx-auto"
          >
            <img
              ref={(ref) => setImageRef(ref)}
              src={imageUrl}
              alt="Crop preview"
              className="max-h-[60vh] mx-auto"
              crossOrigin="anonymous"
            />
          </ReactCrop>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset Crop
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}