import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Dialog } from '@/components/ui/dialog';

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { user } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (user) {
      onOpenChange(false);
    }
  }, [user, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ... rest of the modal content ... */}
    </Dialog>
  );
} 