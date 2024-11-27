import { useAuth } from "@/contexts/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function useAccountDeletion() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const functions = getFunctions();

  const deleteAccount = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete your account",
      });
      return;
    }

    try {
      console.log("Starting account deletion process");
      const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
      await deleteUserAccount();
      
      // Logout after successful deletion
      await logout();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
      });
    }
  };

  return { deleteAccount };
}