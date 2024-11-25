import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (oldRole: string, newRole: string) => void;
  currentRole: string;
}

export function EditRoleModal({ 
  open, 
  onOpenChange, 
  onSave,
  currentRole 
}: EditRoleModalProps) {
  const [newRoleName, setNewRoleName] = useState(currentRole);

  const handleSave = () => {
    if (newRoleName.trim() && newRoleName !== currentRole) {
      onSave(currentRole, newRoleName.trim());
      setNewRoleName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role Name</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter new role name..."
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}