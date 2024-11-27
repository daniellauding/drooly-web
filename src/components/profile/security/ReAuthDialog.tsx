import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
}

export function ReAuthDialog({ 
  open, 
  onOpenChange, 
  password, 
  onPasswordChange, 
  onConfirm 
}: ReAuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your password</DialogTitle>
          <DialogDescription>
            For security reasons, please enter your password to continue with account deletion.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="delete-password">Password</Label>
            <Input
              id="delete-password"
              type="password"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Deletion
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}