import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ open, onOpenChange, defaultTab = 'login' }: AuthModalProps) {
  const { user } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    console.log('[AuthModal] User state changed:', { isAuthenticated: !!user, modalOpen: open });
    if (user && open) {  // Only close if modal is actually open
      console.log('[AuthModal] User authenticated, closing modal');
      onOpenChange(false);
    }
  }, [user, onOpenChange, open]);

  // Handle modal close
  const handleOpenChange = (newOpen: boolean) => {
    console.log('[AuthModal] Modal state changing to:', newOpen);
    if (!newOpen || !user) {  // Only allow opening if not authenticated
      onOpenChange(newOpen);
    }
  };

  // Don't render the modal at all if user is authenticated
  if (user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent className="sm:max-w-md">
        <LoginForm 
          onSignUpClick={() => {}} 
          onOpenChange={handleOpenChange}
          loading={false}
        />
      </DialogContent>
    </Dialog>
  );
} 