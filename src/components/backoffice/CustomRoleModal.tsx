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

interface CustomRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: string) => void;
}

export function CustomRoleModal({ open, onOpenChange, onSave }: CustomRoleModalProps) {
  const [newRole, setNewRole] = useState("");

  const handleSave = () => {
    if (newRole.trim()) {
      onSave(newRole.trim());
      setNewRole("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Role</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter new role name..."
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
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