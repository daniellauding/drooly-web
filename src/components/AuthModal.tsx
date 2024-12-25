import { useViewLogger } from '@/hooks/useViewLogger';

export function AuthModal({ open, onOpenChange }) {
  useViewLogger('AuthModal', { open });
  // ... rest of component
} 