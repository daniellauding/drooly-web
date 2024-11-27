import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
}

export function ImagePreviewDialog({ open, onOpenChange, imageUrl }: ImagePreviewDialogProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <img
          src={imageUrl}
          alt="Recipe preview"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}